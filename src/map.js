import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
function showMap() {

    //--------------------------------------------------------------
    // Initialize the Mapbox map
    // With your access token from .env and initial settings
    //--------------------------------------------------------------
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN; // put token in .env
    
    // BCIT location 49.25324576104826, -123.00163752324765  Centered at BCIT
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
        map.addControl(new mapboxgl.NavigationControl());

        // Add other controls here as needed
        //addGeolocationControl(map);
        //addGeoCoderControl(map);
    }

    // Adds marker to rm 322, change to add multiple through some for loop + db
    let lng = -121.72558950141405;
    let lat = 48.573977758379556;
    const se12_322 = new mapboxgl.Marker()
        .setLngLat([-121.72558950141405, 48.573977758379556])
        .addTo(map);
    se12_322.getElement().addEventListener("click", function (e) {
      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([lng, lat])
        .setHTML('<p>This is Room 322<br><a href="/reviews-app/index.html">More</a></p>')
        .addTo(map);
    })

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
      map.addSource("se12-3", { // Change to display multiple, use some for loop
        "type": "image",
        "url": "./../images/se12-3.jpg",
        "coordinates": [
          [-123, 49],
          [-121, 49],
          [-121, 48],
          [-123, 48]
        ]
      });
      map.addLayer({
        "id": "se12-3",
        "type": "raster",
        "source": "se12-3"
      });
      // Test function to grab coordinates
      // map.on("click", (e) => {
      //   document.getElementById('info').innerHTML = JSON.stringify(e.lngLat.wrap());
      // });
    }
}
showMap();