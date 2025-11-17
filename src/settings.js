import { auth } from "./firebaseConfig";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

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

    signoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    });
});