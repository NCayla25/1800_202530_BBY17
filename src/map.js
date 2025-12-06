import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { db } from "./firebaseConfig.js";
import {collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import { auth } from "./firebaseConfig";

// The following section was primarily done by Copilot after my attempts failed, it imports
// needed images such as floors as urls instead of string literals. This is so they are properly
// included in the assets folder when doing npm run build.
import questionImage from "./../images/question.png";
import blankImage from "./../images/blank.jpg";
import se123 from "./../images/floors/se12-3.jpg";
import se124 from "./../images/floors/se12-4.jpg";

// Map floor IDs to imported images
const floorImages = {
  "se12-3": se123,
  "se12-4": se124
};

// Helper function to get floor image URL
function getFloorImageUrl(floorId) {
  return floorImages[floorId] || null;
}

// Lead function that essentially loads the entire page's map display and info
function showMap() {

    // Mapbox token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    // Creates a Mapbox map object with restricted zoom and bounds to limit the user from
    // viewing stuff other than the floor images. I used this mapbox style because it doesn't
    // have layers that stay above the floor images.
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v11",
        center: [-122, 48.5],
        maxBounds: [
          [-123, 48],
          [-121, 49] 
        ],
        zoom: 10,
        minZoom: 9,
        maxZoom: 12
    });

    // Adds default Mapbox navigation to the map, but removes the top right zoom buttons because
    // it would interfere with the restrictions and go beyond the zoom limits
    addControls();
    function addControls() {
        // Add zoom and rotation controls to the map.
        const navControl = new mapboxgl.NavigationControl();
        map.addControl(navControl);
        map.removeControl(navControl, "top-right");
    }

    // Loads a floor image and its related room markers
    async function displayFloor() {
      try {

          // Fetch the current floorID (default to se12-3) and also manipulates the string to show
          // the user what floor they're on
          const floor = localStorage.getItem("floorID");
          const floorMessage = floor.substring(0, 4).toUpperCase() + " Floor " + floor.charAt(5);
          document.getElementById("navbar-message").innerHTML = floorMessage;

          // Use Firestore to fetch rooms with attributes matching the floor currently on
          const q = query(collection(db, "rooms"), where("floor", "==", floor));
          const querySnapshot = await getDocs(q);
          const floorImageUrl = getFloorImageUrl(floor);
          
          // Only add source and layer if the floor image exists, follows Mapbox documentation on
          // adding images to maps
          if (floorImageUrl) {
            map.addSource(`${floor}`, {
              "type": "image",
              "url": floorImageUrl,
              "coordinates": [
                [-123, 49],
                [-121, 49],
                [-121, 48],
                [-123, 48]
              ]
            });
            map.addLayer({
              "id": `${floor}`,
              "type": "raster",
              "source": `${floor}`
            });
          }
          
          // Fetch user Firestore information to check if the user has map markers toggled on
          const user = auth.currentUser;
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          if (userData.markersToggled) {

            // Goes through all of the room documents and makes a marker based on its attributes
            querySnapshot.forEach((docSnap) => {
              const rooms = docSnap.data();
              const lat = rooms.lat;
              const lng = rooms.lng;
              const desc = rooms.desc;
              const link = rooms.link;

              // Create a HTML element to contain the marker
              const e1 = document.createElement("div");
              e1.className = "room-marker";

              // Add a popup with information pertaining to the marker that opens on click
              const popup = new mapboxgl.Popup({
                closeOnClick: true, 
                closeButton: false, 
                closeOnMove: true,
                focusAfterOpen: false})
                .setLngLat([lng, lat])
                .setHTML(`<p>${desc}<br><br>
                  <a href="/room-reviews.html"><img src="${questionImage}" alt="image"></a></p>`)  
                .addTo(map);

              // On popup click, update the roomID so the room-reviews.html will load reviews for that room
              // the next time the user goes to reviews
              popup.on("open", () => {
                localStorage.setItem("roomID", docSnap.id);
              });

              // The actual marker object being added to map
              const marker = new mapboxgl.Marker(e1)
                  .setLngLat([lng, lat])
                  .setPopup(popup)
                  .addTo(map);
              e1.ariaExpanded = true;
            });
          }
      } catch (error) {
          console.error("Error loading:", error);
      }
    }
    
    // Adds an event listener to each dropdown item so that the user can change what floor to view
    async function dropdownItems() {
      const items = document.getElementsByClassName("dropdown-item");
      for (let i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function (e) {
          // Change the floorID to the id of the floor list item (see line 25-26 in map.html)
          localStorage.setItem("floorID", this.id);
          // Reload the page so the map can be reloaded and fed the new floorID
          document.location.reload();
        });
      }
    }

    // Add all map components like floors and markers once the base Mapbox map loads
    map.once("load", () => setupMap(map));
    function setupMap(map) {
      // Blank image layer so that the user doesn't see the base map when zooming out
      map.addSource("blank", {
        "type": "image",
        "url": blankImage,
        "coordinates": [
          [-125, 50],
          [-119, 50],
          [-119, 47],
          [-125, 47]
        ]
      });
      map.addLayer({
        "id": "blank",
        "type": "raster",
        "source": "blank"
      });
      displayFloor();
      dropdownItems();
      // Test function to grab coordinates 48.55835893821671
      // map.on("click", (e) => {
      //   console.log(JSON.stringify(e.lngLat.wrap()));
      // });
    }
}

document.addEventListener("DOMContentLoaded", function () {
  // Show map when page is loaded
  showMap();

  // Help modal shows automatically if when the user views the page for the first time
  if (!("helpShown" in localStorage)){
    localStorage.setItem('helpShown', true);
    document.querySelector('[data-bs-target="#helpModal"]').click();
  }
});
