import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

// ----- DOM elements -----
const profileImage = document.getElementById("profileImage");
const profileFileInput = document.getElementById("profileFileInput");
const personalInfoFields = document.getElementById("personalInfoFields");

const nameInput = document.getElementById("nameInput");
const cityInput = document.getElementById("cityInput");
const campusInput1 = document.getElementById("campusInput1");
const campusInput2 = document.getElementById("campusInput2");
const mobilityAidSelect = document.getElementById("mobilityAid");
const frequentRoutesTextarea = document.getElementById("frequentRoutes");

const uploadButton = document.getElementById("uploadButton");
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");

// ----- State -----
let newProfileImageBase64 = null;

function compressImage(file, maxSize = 300) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            // Create a canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Resize while keeping aspect ratio
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image onto canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG Base64 (quality 0.75)
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);

            resolve(compressedBase64);
        };

        img.src = URL.createObjectURL(file);
    });
}


// -------------------------------------------------------------
// Convert selected file to Base64
// -------------------------------------------------------------
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// -------------------------------------------------------------
// Populate user info from Firestore
// -------------------------------------------------------------
function populateUserInfo() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) return;

            const data = snap.data();

            nameInput.value = data.name || "";
            cityInput.value = data.city || "";
            frequentRoutesTextarea.value = data.frequentRoutes || "";
            mobilityAidSelect.value = data.mobilityAid || mobilityAidSelect.value;

            const campus = data.campus || "";
            campusInput1.checked = campus === campusInput1.value;
            campusInput2.checked = campus === campusInput2.value;

            // Load profile picture
            if (data.profileImage) {
                profileImage.src = data.profileImage;
            }

        } catch (err) {
            console.error("Error loading user:", err);
        }
    });
}

populateUserInfo();

uploadButton.addEventListener("click", () => {
        profileFileInput.click();
});

// -------------------------------------------------------------
// Handle file selection (convert to Base64 + preview)
// -------------------------------------------------------------
profileFileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        // Compress BEFORE converting to Base64
        newProfileImageBase64 = await compressImage(file);

        // Preview compressed version
        profileImage.src = newProfileImageBase64;
    }
});


// -------------------------------------------------------------
// Enable editing
// -------------------------------------------------------------
editButton.addEventListener("click", () => {
    personalInfoFields.disabled = false;
    uploadButton.classList.remove("hidden");

});

// -------------------------------------------------------------
// Save all profile data (including Base64 image)
// -------------------------------------------------------------
saveButton.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in first.");
        return;
    }

    const userRef = doc(db, "users", user.uid);

    // Collect user input
    const name = nameInput.value;
    const city = cityInput.value;

    let campus = "";
    if (campusInput1.checked) campus = campusInput1.value;
    if (campusInput2.checked) campus = campusInput2.value;

    const mobilityAid = mobilityAidSelect.value;
    const frequentRoutes = frequentRoutesTextarea.value;

    // Build Firestore update object
    const updatedData = {
        name,
        campus,
        city,
        mobilityAid,
        frequentRoutes,
    };

    // If a new Base64 image was selected, store it
    if (newProfileImageBase64) {
        updatedData.profileImage = newProfileImageBase64;
    }

    try {
        await updateDoc(userRef, updatedData);

        alert("Profile updated!");

        // Lock fields again
        personalInfoFields.disabled = true;
        uploadButton.classList.add("hidden");


        // Clear temp image
        newProfileImageBase64 = null;

    } catch (err) {
        console.error("Error saving profile:", err);
        alert("Error saving profile.");
    }
});
