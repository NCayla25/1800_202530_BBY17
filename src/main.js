import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { onAuthReady } from "./authentication.js"
import "./firebaseConfig.js";
import "./loginSignup.js";
import "../styles/style.css";

function showDashboard() {
      const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"
      const appContent = document.getElementById("app-content");

      if (appContent) {
        appContent.style.display = "none";
      }

      // Wait for Firebase to determine the current authentication state.
      // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
      // The user's name is extracted from the Firebase Authentication object
      // You can "go to console" to check out current users. 
      onAuthReady((user) => {
        const onLoginPage = window.location.pathname.includes("login.html");

          if (!user) {
              if (!onLoginPage) {
                location.href = "login.html";
              }
              return;
          }

          // If a user is logged in:
          // Use their display name if available, otherwise show their email.
          const name = user.displayName || user.email;

          // Update the welcome message with their name/email.
          if (nameElement) {
              nameElement.textContent = `${name}!`;
          }

          if (appContent) {
            appContent.style.display = "block";
          }
      });
}

// Check if a floorID is in localStorage, defaults to se12-3
function checkFloorID() {
  if (!("floorID" in localStorage)){
    localStorage.setItem('floorID', 'se12-3');
  }
}

showDashboard();
checkFloorID();