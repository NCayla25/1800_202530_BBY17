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
        style: "mapbox://styles/mapbox/standard",// any Mapbox style
        center: [-123.00163752324765, 49.25324576104826],
        zoom: 10
    });
    /*
    const map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'se-12': {
            type: 'image',
            url: './../images/se12.jpg',  // your image file
            coordinates: [
              [0, 2965],   // top-left
              [4674, 2965], // top-right
              [4674, 0],   // bottom-right
              [0, 0]       // bottom-left
            ]
          }
        }
      },
      center: [-123.00163752324765, 49.25324576104826],  // start centered on the map
      zoom: 1,
      maxZoom: 5,
      minZoom: 0
    });*/
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

    //--------------------------------------------------------------
    // Add layers, sources, etc. to the map, and keep things organized.
    // You can call additional layers/setup functions from here.
    // Run setupMap() once when the style loads.
    //--------------------------------------------------------------
    map.once("load", () => setupMap(map)); // run once for the initial style
    function setupMap(map) {
        map.addSource('se12', {
            'type': 'raster',
            'url': './images/se12.jpg',
        });

        map.addLayer({
            'id': 'se12-layer',
            'source': 'se12',
            'type': 'raster'
        });
        //addUserPin(map);
        //add other layers and stuff here
        //addCustomLayer1(map);
        //addCustomLayer2(map);
        //addCustomLayer3(map);
    }
}
showMap();