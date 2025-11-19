import { auth } from "./firebaseConfig";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

window.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("displayName");
    const emailInput = document.getElementById("email");
    const profileForm = document.getElementById("profile-form");
    const signoutBtn = document.getElementById("signout-btn");

    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }

        nameInput.value = user.displayName || "";
        emailInput.value = user.email || "";
    });

    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newName = nameInput.value.trim();
        const user = auth.currentUser;

        if (user) {
            updateProfile(auth.currentUser, { displayName: newName })
                .then(() => {
                    alert("Profile updated!");
                })
                .catch(err => {
                    console.error(err);
                    alert("Error updating profile.");
                });
        }
    });

    loadMapSettings();

    signoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    });
});

document.getElementById("toggle-markers").addEventListener("click", async () => {
    try {
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        const markersToggled = document.getElementById("toggle-markers").checked;
        await updateDoc(userRef, { markersToggled });
        console.log("Map setting changed");
    } catch (error) {
        console.error("Error updating user document:", error);
    }
});

function loadMapSettings() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // reference to the user document
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    document.getElementById("toggle-markers").checked = userData.markersToggled;
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting user document:", error);
            }
        } else {
            console.log("No user is signed in");
        }
    });
}