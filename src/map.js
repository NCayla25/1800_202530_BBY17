import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { db } from "./firebaseConfig.js";
import {collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import { auth } from "./firebaseConfig";

function showMap() {

    //--------------------------------------------------------------
    // Initialize the Mapbox map
    // With your access token from .env and initial settings
    //--------------------------------------------------------------
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN; // put token in .env
    
    const map = new mapboxgl.Map({
        container: "map",                        // <div id="map"></div>
        style: "mapbox://styles/mapbox/light-v11",// any Mapbox style
        center: [-122, 48.5],
        maxBounds: [
          [-123, 48],
          [-121, 49] 
        ],
        zoom: 10,
        minZoom: 9,
        maxZoom: 12
    });

    //------------------------------------------------------------------------
    // Add controls to the map here, and keep things organized
    // You can call additional controls/setup functions from here.
    //------------------------------------------------------------------------
    addControls();
    function addControls() {
        // Add zoom and rotation controls to the map.
        const navControl = new mapboxgl.NavigationControl();
        map.addControl(navControl);
        map.removeControl(navControl, "top-right");
    }

    async function displayFloor() {
      try {
          const floor = localStorage.getItem("floorID");
          const floorMessage = floor.substring(0, 4).toUpperCase() + " Floor " + floor.charAt(5);
          document.getElementById("navbar-message").innerHTML = floorMessage;
          const q = query(collection(db, "rooms"), where("floor", "==", floor));
          const querySnapshot = await getDocs(q);
          map.addSource(`${floor}`, {
            "type": "image",
            "url": `./../images/${floor}.jpg`,
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
          
          const user = auth.currentUser;
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          if (userData.markersToggled) {
            querySnapshot.forEach((docSnap) => {
              const rooms = docSnap.data();
              const lat = rooms.lat;
              const lng = rooms.lng;
              const desc = rooms.desc;
              const link = rooms.link;
              const e1 = document.createElement("div");
              e1.className = "room-marker";
              const popup = new mapboxgl.Popup({
                closeOnClick: true, 
                closeButton: false, 
                closeOnMove: true,
                focusAfterOpen: false})
                .setLngLat([lng, lat])
                .setHTML(`<p>${desc}<br><br>
                  <a href="/review-finalapp/${link}.html"><img src="./../images/question.png" alt="image"></a></p>`)
                .addTo(map);
              popup.on("open", () => {
                localStorage.setItem("roomID", docSnap.id);
              });
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
    

    async function dropdownItems() {
      const items = document.getElementsByClassName("dropdown-item");
      for (let i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function (e) {
          localStorage.setItem("floorID", this.id);
          document.location.reload();
        });
      }
    }
    //--------------------------------------------------------------
    // Add layers, sources, etc. to the map, and keep things organized.
    // You can call additional layers/setup functions from here.
    // Run setupMap() once when the style loads.
    //--------------------------------------------------------------
    map.once("load", () => setupMap(map)); // run once for the initial style
    function setupMap(map) {
      map.addSource("blank", {
        "type": "image",
        "url": "./../images/blank.jpg",
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
  showMap();

  // Help modal shows automatically if when the user views the page for the first time
  if (!("helpShown" in localStorage)){
    localStorage.setItem('helpShown', true);
    document.querySelector('[data-bs-target="#helpModal"]').click();
  }
});
