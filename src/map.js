import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { db } from "./firebaseConfig.js";
import {collection, query, where, getDocs} from "firebase/firestore";

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
          [-122.75, 48.2],
          [-121.25, 48.8] 
        ],
        zoom: 1,
        minZoom: 0
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

    async function displayRoomMarkers() {
        try {
            const floor = localStorage.getItem("floorID");
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
            
            querySnapshot.forEach((docSnap) => {

              const rooms = docSnap.data();
              const lat = rooms.lat;
              const lng = rooms.lng;
              const desc = rooms.desc;
              const link = rooms.link;

              const marker = new mapboxgl.Marker()
                  .setLngLat([lng, lat])
                  .addTo(map);
              marker.getElement().addEventListener("click", function (e) { // need to make it so other pop ups close on click
                const popup = new mapboxgl.Popup({closeOnClick: false, closeButton: true})
                  .setLngLat([lng, lat])
                  .setHTML(`<p>${desc}<br><a href="/reviews-app/${link}.html">See reviews</a></p>`)
                  .addTo(map);
                console.log("Popup added");
              });
            });
        } catch (error) {
            console.error("Error loading room marker:", error);
        }
    }

    // adds buttons to go up down floors, need to change into buttons in the future or a hamburger menu factoring the multiple buildings
    async function addUpDown() {
      document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowUp") {
          localStorage.setItem("floorID", "se12-4");
          this.location.reload();
        } else if (e.key === "ArrowDown") {
          localStorage.setItem("floorID", "se12-3");
          this.location.reload();
        }
      })
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
          [-124, 50],
          [-120, 50],
          [-120, 47],
          [-124, 47]
        ]
      });
      map.addLayer({
        "id": "blank",
        "type": "raster",
        "source": "blank"
      });
      displayRoomMarkers();
      addUpDown();
      // Test function to grab coordinates
      // map.on("click", (e) => {
      //   console.log(JSON.stringify(e.lngLat.wrap()));
      // });
    }
}
showMap();