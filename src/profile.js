import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

// -------------------------------------------------------------
// Function to populate user info in the profile form
// Fetches user data from Firestore and fills in the form fields
// Assumes user is already authenticated
// and their UID corresponds to a document in the "users" collection
// of Firestore.
// Fields populated: name, school, city
// Form field IDs: nameInput, schoolInput, cityInput
// -------------------------------------------------------------
function populateUserInfo() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // reference to the user document
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    const { name = "", campus = "", city = "" } = userData;

                    document.getElementById("nameInput").value = name;
                    
                    const campuses = document.getElementsByName("campus");
                    for (let i = 0; i < campuses.length; i++) {
                        if (campuses[i].value == campus) {
                            campuses[i].checked = true;
                        }
                    }
                    document.getElementById("cityInput").value = city;
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

//call the function to run it 
populateUserInfo();

//-------------------------------------------------------------
// Function to enable editing of user info form fields
//------------------------------------------------------------- 
document.querySelector('#editButton').addEventListener('click', editUserInfo);
function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

//-------------------------------------------------------------
// Function to save updated user info from the profile form
//-------------------------------------------------------------
document.querySelector('#saveButton').addEventListener('click', saveUserInfo);   //Add event listener for save button
async function saveUserInfo() {
    const user = auth.currentUser;
    if (!user) {
        alert("No user is signed in. Please log in first.");
        return;
    }
    //enter code here

    //a) get user entered values
    const userName = document.getElementById('nameInput').value;     //get the value of the field with id="nameInput"
    let userCampusTemp = "";
    if (document.querySelector(`input[id=campusInput1]:checked`)){
        userCampusTemp = document.getElementById("campusInput1").value;
    } else if (document.querySelector(`input[id=campusInput2]:checked`)) {
        userCampusTemp = document.getElementById("campusInput2").value;
    }
    const userCampus = userCampusTemp;
    const userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"
    //b) update user's document in Firestore
    await updateUserDocument(user.uid, userName, userCampus, userCity);
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

//-------------------------------------------------------------
// Updates the user document in Firestore with new values
// Parameters:
//   uid (string)  – user’s UID
//   name, school, city (strings)
//-------------------------------------------------------------
async function updateUserDocument(uid, name, campus, city) {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { name, campus, city });
        console.log("User document successfully updated!");
    } catch (error) {
        console.error("Error updating user document:", error);
    }
}