import { auth } from "./firebaseConfig";
import { signOut, onAuthStateChanged} from "firebase/auth";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Signout Button
window.addEventListener("DOMContentLoaded", () => {
    const signoutBtn = document.getElementById("signout-btn");

    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }

    });

    loadMapSettings();

    signoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    });
});

// Map marker button
document.getElementById("toggle-markers").addEventListener("click", async () => {
    try {
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        const markersToggled = document.getElementById("toggle-markers").checked;
        await updateDoc(userRef, { markersToggled });
    } catch (error) {
        console.error("Error updating user document:", error);
    }
});

// Gets the map marker settings from firebase
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