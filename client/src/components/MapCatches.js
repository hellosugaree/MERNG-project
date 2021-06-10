import React, { useState, useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import GoogleMap from './GoogleMap';
import useGeolocation from '../utilities/useGeolocation';
import '../App.css';

// create custom control elements to send to our map
// create a custom button for our map to get location
const getCurrentLocationButton = document.createElement('button');
getCurrentLocationButton.classList.add("custom-map-control-button");
getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';

const MapCatches = props => {
  const catchIcon = {
    path: `M508.437,281.222l-14.015-9.344l14.015-9.344c2.145-1.43,3.469-3.806,3.558-6.382c0.088-2.576-1.07-5.037-3.112-6.611
    c-2.855-2.2-66.516-50.626-141.038-56.974c-0.694-15.537-4.176-34.585-18.689-46.807c-1.81-1.525-4.229-2.176-6.561-1.771
    c-3.759,0.657-5.379,3.458-6.07,4.654c-6.848,11.842-22.304,17.077-34.064,19.383c-30.251,5.932-46.822,18.746-54.944,27.42
    c-10.037-10.354-29.441-27.569-47.517-27.569c-3.303,0-6.266,2.03-7.459,5.109c-1.193,3.08-0.371,6.577,2.069,8.802
    c0.044,0.041,4.519,4.234,7.585,11.102c3.542,7.931,3.639,15.971,0.306,23.947c-12.225,3.836-23.78,7.752-34.715,11.463
    c-29.107,9.876-54.481,18.485-75.768,19.481c-4.247-5.767-13.467-17.852-25.123-30.562c-21.941-23.925-41.199-37.776-57.24-41.17
    c-3.194-0.671-6.482,0.66-8.301,3.373c-1.819,2.714-1.805,6.262,0.036,8.961C16.318,210.278,40,250.135,40,263.878
    c0,13.731-23.683,53.594-38.61,75.494c-1.84,2.699-1.854,6.246-0.035,8.96c1.504,2.245,4.013,3.546,6.644,3.546
    c0.549,0,1.104-0.057,1.657-0.173c16.041-3.394,35.299-17.245,57.24-41.17c11.656-12.71,20.876-24.795,25.123-30.562
    c21.287,0.996,46.661,9.605,75.768,19.481c3.183,1.08,6.421,2.178,9.709,3.286c1.894,8.228,2.059,17.188-7.451,27.795
    c-2.041,2.275-2.611,5.53-1.462,8.362c0.873,2.151,2.936,4.787,7.814,5.126c0.816,0.057,1.744,0.088,2.771,0.088
    c12.039,0,37.578-4.39,52.662-24.647c27.937,7.437,59.101,13.529,94.104,15.624c2.761,6.304,2.688,17.668,1.882,24.013
    c-0.396,3.058,1.001,6.07,3.59,7.744c1.321,0.854,2.831,1.282,4.343,1.282c1.453,0,2.906-0.396,4.193-1.187
    c12.216-7.518,21.684-23.08,25.974-31.472c46.882-2.706,83.373-18.486,108.26-29.254c12.82-5.548,23.891-10.338,29.823-10.338
    c3.525,0,6.635-2.308,7.657-5.682S511.371,283.177,508.437,281.222z M305.539,183.729c12.451-2.441,28.308-7.732,38.979-19.188
    c5.049,7.917,6.749,18.164,7.269,27.339c-31.431,0.015-59.957,3.408-85.972,8.521C273.556,194.425,286.127,187.535,305.539,183.729
    z M218.818,191.759c6.364,4.423,12.647,10.086,17.685,15.312c-5.47,1.408-10.819,2.869-16.051,4.368
    C221.446,204.318,220.631,197.656,218.818,191.759z M191.464,326.578c2.65-6.383,3.338-12.48,2.99-18.224
    c6.587,2.131,13.376,4.254,20.38,6.326C207.701,321.587,198.801,324.953,191.464,326.578z M342.815,335.77
    c1.488,0.031,2.983,0.053,4.484,0.069c-1.084,1.707-2.279,3.478-3.563,5.229C343.515,339.307,343.207,337.529,342.815,335.77z
     M475.562,278.534l9.005,6.004c-4.991,1.907-10.524,4.302-16.744,6.993c-17.035,7.371-37.956,16.416-63.271,22.276
    c-14.275-9.152-21.398-23.58-21.165-42.889c0.188-15.528,5.315-29.982,7.625-34.192c2.126-3.873,0.709-8.736-3.165-10.862
    c-3.873-2.126-8.737-0.708-10.862,3.165c-3.595,6.551-9.379,23.663-9.597,41.697c-0.23,19.062,5.528,35.002,16.782,46.883
    c-7.203,1.018-14.71,1.737-22.54,2.064c-0.764-0.084-1.524-0.056-2.262,0.075c-2.429,0.078-4.88,0.129-7.37,0.129
    c-74.226,0-132.36-19.725-179.073-35.574c-32.302-10.96-60.199-20.426-84.927-20.426c-2.608,0-5.053,1.271-6.551,3.408
    c-8.566,12.22-29.647,38.837-50.42,55.297C42.64,303.139,56,277.75,56,263.878c0-13.868-13.351-39.243-24.959-58.686
    c20.76,16.461,41.838,43.063,50.409,55.279c1.498,2.134,3.942,3.406,6.55,3.406c24.728,0,52.625-9.466,84.927-20.426
    c11.041-3.746,22.729-7.708,35.107-11.575c1.567-0.008,3.096-0.491,4.401-1.361c39.052-11.957,84.948-22.638,139.565-22.638
    c59.558,0,116.162,33.4,137.833,47.83l-14.271,9.514c-2.226,1.483-3.563,3.981-3.563,6.656S473.337,277.051,475.562,278.534z
M347.603,262.702l1.292,0.549c4.073,1.714,8.763-0.197,10.478-4.269c1.714-4.072-0.197-8.763-4.269-10.478l-1.223-0.52
c-10.467-4.467-38.274-16.329-69.725,0.877c-2.535,1.389-4.129,4.045-4.161,6.936c-0.052,4.7,2.598,6.33,8.403,9.901
c2.667,1.642,6.502,3.955,11.09,6.691c8.236,4.913,18.316,10.841,24.514,14.417c5.602,3.231,11.114,4.408,16.062,4.408
c7.15-0.001,13.116-2.46,16.443-4.729c3.65-2.488,4.592-7.466,2.103-11.116s-7.466-4.593-11.117-2.103
c-0.068,0.048-7.084,4.533-15.495-0.32c-7.325-4.226-18.012-10.525-26.38-15.533C324.166,252.705,339.445,259.223,347.603,262.702z`,
    fillColor: "blue",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.1,
    // anchor: new window.google.maps.Point(15, 30),
  }


  const catches = [
    { catchLocation: {lat: 33.4999985, lng: -117.7490541}, species: 'Bonito' },
    { catchLocation: {lat: 33.50881546785603, lng: -117.77067146729961}, species: 'Yellowtail' }, 
    { catchLocation: {lat: 33.52074990370165, lng: -117.7907109774181}, species: 'Bonito' }, 
    { catchLocation: {lat: 33.438086040850784, lng: -117.70684376238613}, species: 'Halibut' }, 
    { catchLocation: {lat: 33.43350197455659, lng: -117.72675648211269}, species: 'Bonito' }, 
    { catchLocation: {lat: 33.419175206713135, lng: -117.73018970965175}, species: 'Calico Bass' }
    ];

  // array to hold controls that will be added on mount
  const controls = [];
  // create a controls array to pass to the GoogleMap component
  controls.push({ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] });

  // state to check when loader is loaded so we know when to render our map and autocomplete components
  const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
  // pass this as a prop to our--initial value is default center, and the map center will always auto update if we set coords here
  const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 });
  


  // get our geolocation hook
  const { getPosition, geolocationStatus } = useGeolocation();

  const mapContainerRef = useRef();
  const mapRef = useRef();
  const infoWindowRef = useRef();
  const catchMarkersRef = useRef([]);
  

  useEffect(() => {
    // load script on mount and set status of load accordingly
    const loader = new Loader({
      // apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load()
      .then(() => {
        console.log('API loaded')
        // set our status to loaded so we know when to render dependent components
        setApiStatus({loading: false, errors: null});
        // get our position
        getPosition();

        console.log(catches.length);
        catches.forEach((catchObj, index) => {
          // create a new marker for each catch
          console.log(catchObj.catchLocation);


          //new window.google.maps.MarkerImage('http://localhost:3000/img/striped-bass-small.png',);
          // note: aspect ration 2.6847826087
          const markerUrl1='http://localhost:3000/img/striped-bass-small.png';
          const markerUrl2='http://localhost:3000/img/icons/fish-icon-1-small.jpg';
          const URL128 = 'http://localhost:3000/img/icons/fish-icon-128.jpg';
          const URL64 = 'http://localhost:3000/img/icons/fish-icon-64.jpg';
          const URL32 = 'http://localhost:3000/img/icons/fish-icon-32.jpg';
          const URL128COLOR= 'http://localhost:3000/img/icons/fish-icon-color-128.gif';
          const URL1024COLOR ='http://localhost:3000/img/icons/fish-icon-color-1024.gif';
          const URLSVG = 'http://localhost:3000/img/icons/svg-icon.svg';
          const URLBiter = 'http://localhost:3000/img/icons/Biter-SVG-3840-1920.svg';
          // const fishMarker3 = {
          //   url: URL32,
          //   // size: new window.google.maps.Size(247,92),
          //   scaledSize: new window.google.maps.Size(22*2.6847826087,22),
          // } 

          const svgMarker = {
            url: URLSVG,
            // scaledSize: new window.google.maps.Size(20*1.97642436149, 20),
            // scaledSize: new window.google.maps.Size(40, 20)
          }

          const fishMarker1024 = {
            url: URL1024COLOR,
            scaledSize: new window.google.maps.Size(16*1.97642436149, 16),
          };

          const biterIcon = {
            url: URLBiter,
            scaledSize: new window.google.maps.Size(50*1.97642436149, 50),
          };
          // const fishMarker2 = {
          //   url: URL64,
          //   // size: new window.google.maps.Size(247,92),
          //    scaledSize: new window.google.maps.Size(32, 32),
          // } 
          // const fishMarker3 = {
          //   url: URL32,
          //   // size: new window.google.maps.Size(247,92),
          // } 

          catchMarkersRef.current.push(new window.google.maps.Marker({
            position: {lat: catchObj.catchLocation.lat, lng: catchObj.catchLocation.lng},
            map: mapRef.current,
            icon: biterIcon,
          }));

          // catchMarkersRef.current.push(new window.google.maps.Marker({
          //   position: {lat: catchObj.catchLocation.lat + 0.01 , lng: catchObj.catchLocation.lng},
          //   map: mapRef.current,
          //   icon: fishMarker2,
          // }));

          // catchMarkersRef.current.push(new window.google.maps.Marker({
          //   position: {lat: catchObj.catchLocation.lat + 0.02, lng: catchObj.catchLocation.lng},
          //   map: mapRef.current,
          //   icon: fishMarker3,
          // }));

          // catchMarkersRef.current.push(new window.google.maps.Marker({
          //   position: catchObj.catchLocation,
          //   map: mapRef.current,
          //   icon: fishMarker,
          // }));

          // create a new info window for the catch
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div id="content">
            <div><b>${catchObj.species}</b></div><br/>
              <div>Some info about the catch here</div>
              </div>`,
          });
          console.log('adding marker listener')
          

          catchMarkersRef.current[index].addListener("click", () => {
            console.log('marker handling click listener')
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
            infoWindow.open(mapRef.current, catchMarkersRef.current[index]);
            infoWindowRef.current = infoWindow;
            mapRef.current.setCenter(infoWindowRef.current.getPosition());
          }); // make event listener passive if supported

        });

      })
      .catch (err => {
        console.log(err);
        setApiStatus({loading: false, errors: err});
      });
  }, []);



  // useEffect to monitor our geoloation position when updated from any getPosition() calls
  useEffect(() => {
    console.log('position update detected in useEffect');
    // check if we have a position
    if (geolocationStatus.position) {      
      setCenter(geolocationStatus.position);      
    }
    if (geolocationStatus.errorMessage) {
      console.log('processing geolocation errors')
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      infoWindowRef.current = new window.google.maps.InfoWindow({
        content: `<div id="content">
        <div><b>Location error</b></div><br/>
          <div>${geolocationStatus.errorMessage}</div>
          </div>`,
      });
      infoWindowRef.current.setPosition(mapRef.current.getCenter());
      infoWindowRef.current.open(mapRef.current);
    }
  }, [geolocationStatus.position, geolocationStatus.errorMessage, mapRef, infoWindowRef])


    // add listener to close info windows on map click
    useEffect(() => {
      if(mapRef.current) {
        console.log('adding listener')      
        mapRef.current.addListener('click', e => {
          console.log('map click event listener')
          console.log(e)
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });
      }
    }, [mapRef.current, infoWindowRef]);
  
  
  /*
        // mark our position on the map
          currentPositionMarker.current = new window.google.maps.Marker({
            position: position,
            map: props.mapRef.current
          });
          // center our map on current position:
          props.mapRef.current.setCenter(position);
  */

  function handleGetLocationButtonClick(event) {
    getPosition();
  }

  const handleTestButtonClick = () => {
    // near cat 33.25298912416853, -118.14031335990441
    // dp inshore lat: 33.419175206713135, lng: -117.73018970965175
    const pos = {lat: 33.25298912416853, lng: -118.14031335990441};
    const fetchUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    const fetchUrl2=`http://api.marineplan.com/api/revgeocode/1/api/revgeocode.json?point=latitude=33.419175206713135&longitude=-117.73018970965175`
    const req = new Request(fetchUrl2, {mode: 'no-cors'});
    console.log(req.mode);

    const fetchUrl3=`https://data.opendatasoft.com/api/records/1.0/search/?dataset=us-county-boundaries%40public&q=CA&facet=statefp&facet=countyfp&facet=name&facet=namelsad&facet=stusab&facet=state_name&refine.namelsad=Del+Norte+County`;

    fetch(fetchUrl3)
      .then (res => res.json())
      .then (json => {
        let boundaries = [];
        console.log(json)

        const points = json.records[0].fields.geo_shape.coordinates[0];
        console.log(points);
        points.forEach(pair => {
          // console.log(pair);
          // console.log(`{ lat: ${pair[0]}, lng: ${pair[1]} }`)
          boundaries.push({ lat: pair[1], lng: pair[0] })
        });

        console.log(boundaries);
        const polygon = new window.google.maps.Polyline({
          path: boundaries,
          geodesic: true,
          strokeWeight: 2,
          strokeColor: '#0000FF',
          strokeOpacity: 0.9,
          // fillColor: '#0000FF',
          // fillOpacity: 0.2,
        });
        polygon.setMap(mapRef.current);
        console.log(polygon)
      }
      )
      .catch (err => console.log(err));
  };

  return (
        <div style={{display: 'flex', border: '2px dashed blue'}}>
          <div className='map-container' style={{display: 'flex', flexDirection: 'column'}}>
            <div id='map' ref={mapContainerRef}/>
              {apiStatus.loading && <h1>Loading map</h1>}

            { // display our google API components only if the script has loaded without errors
              (!apiStatus.loading && !apiStatus.errors) && 
              <div>
                <GoogleMap 
                  mapRef={mapRef} 
                  mapContainer={mapContainerRef} 
                  center={center} 
                  controls={controls}
                />
              </div>
            }
            <button type='button' onClick={handleTestButtonClick} >test</button>
          </div>
        </div>
  );
}


export default MapCatches;

/*
{"plus_code":{"global_code":"85537V35+5V"},"results":[{"address_components":[{"long_name":"United States","short_name":"US","types":["country","political"]}],"formatted_address":"United States","geometry":{"bounds":{"northeast":{"lat":71.5388001,"lng":-66.885417},"southwest":{"lat":18.7763,"lng":170.5957}},"location":{"lat":37.09024,"lng":-95.712891},"location_type":"APPROXIMATE","viewport":{"northeast":{"lat":71.5388001,"lng":-66.885417},"southwest":{"lat":18.7763,"lng":170.5957}}},"place_id":"ChIJCzYy5IS16lQRQrfeQ5K5Oxw","types":["country","political"]},{"address_components":[{"long_name":"85537V35+5V","short_name":"85537V35+5V","types":["plus_code"]}],"formatted_address":"85537V35+5V","geometry":{"bounds":{"northeast":{"lat":33.253,"lng":-118.14025},"southwest":{"lat":33.252875,"lng":-118.140375}},"location":{"lat":33.2529891,"lng":-118.1403134},"location_type":"ROOFTOP","viewport":{"northeast":{"lat":33.2542864802915,"lng":-118.1389635197085},"southwest":{"lat":33.25158851970851,"lng":-118.1416614802915}}},"place_id":"GhIJS19j8mGgQEARMQwO5fqIXcA","plus_code":{"global_code":"85537V35+5V"},"types":["plus_code"]}],"status":"OK"}

{
    "plus_code": {
        "global_code": "85537V35+5V"
    },
    "results": [
        {
            "address_components": [
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": [
                        "country",
                        "political"
                    ]
                }
            ],
            "formatted_address": "United States",
            "geometry": {
                "bounds": {
                    "northeast": {
                        "lat": 71.5388001,
                        "lng": -66.885417
                    },
                    "southwest": {
                        "lat": 18.7763,
                        "lng": 170.5957
                    }
                },
                "location": {
                    "lat": 37.09024,
                    "lng": -95.712891
                },
                "location_type": "APPROXIMATE",
                "viewport": {
                    "northeast": {
                        "lat": 71.5388001,
                        "lng": -66.885417
                    },
                    "southwest": {
                        "lat": 18.7763,
                        "lng": 170.5957
                    }
                }
            },
            "place_id": "ChIJCzYy5IS16lQRQrfeQ5K5Oxw",
            "types": [
                "country",
                "political"
            ]
        },
        {
            "address_components": [
                {
                    "long_name": "85537V35+5V",
                    "short_name": "85537V35+5V",
                    "types": [
                        "plus_code"
                    ]
                }
            ],
            "formatted_address": "85537V35+5V",
            "geometry": {
                "bounds": {
                    "northeast": {
                        "lat": 33.253,
                        "lng": -118.14025
                    },
                    "southwest": {
                        "lat": 33.252875,
                        "lng": -118.140375
                    }
                },
                "location": {
                    "lat": 33.2529891,
                    "lng": -118.1403134
                },
                "location_type": "ROOFTOP",
                "viewport": {
                    "northeast": {
                        "lat": 33.2542864802915,
                        "lng": -118.1389635197085
                    },
                    "southwest": {
                        "lat": 33.25158851970851,
                        "lng": -118.1416614802915
                    }
                }
            },
            "place_id": "GhIJS19j8mGgQEARMQwO5fqIXcA",
            "plus_code": {
                "global_code": "85537V35+5V"
            },
            "types": [
                "plus_code"
            ]
        }
    ],
    "status": "OK"
}



// opendata api
//https://data.opendatasoft.com/explore/dataset/us-county-boundaries%40public/api/?disjunctive.statefp&disjunctive.countyfp&disjunctive.name&disjunctive.namelsad&disjunctive.stusab&disjunctive.state_name&q=CA&refine.namelsad=Del+Norte+County
    const fetchUrl3=`https://data.opendatasoft.com/api/records/1.0/search/?dataset=us-county-boundaries%40public&q=CA&facet=statefp&facet=countyfp&facet=name&facet=namelsad&facet=stusab&facet=state_name&refine.namelsad=Del+Norte+County`;

    fetch(fetchUrl3)
      .then (res => res.json())
      .then (json => {
        let boundaries = [];
        console.log(json)

        const points = json.records[0].fields.geo_shape.coordinates[0];
        console.log(points);
        points.forEach(pair => {
          // console.log(pair);
          // console.log(`{ lat: ${pair[0]}, lng: ${pair[1]} }`)
          boundaries.push({ lat: pair[1], lng: pair[0] })
        });

        console.log(boundaries);
        const polygon = new window.google.maps.Polyline({
          path: boundaries,
          geodesic: true,
          strokeWeight: 2,
          strokeColor: '#0000FF',
          strokeOpacity: 0.9,
          // fillColor: '#0000FF',
          // fillOpacity: 0.2,
        });
        polygon.setMap(mapRef.current);
        console.log(polygon)
      }
      )
      .catch (err => console.log(err));
  };

*/