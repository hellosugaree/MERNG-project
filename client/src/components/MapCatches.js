import React, { useState, useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import { DateTime } from 'luxon';
import GoogleMap from './GoogleMap';
import useGeolocation from '../utilities/useGeolocation';
import '../App.css';

// create custom control elements to send to our map
// create a custom button for our map to get location
const getCurrentLocationButton = document.createElement('button');
getCurrentLocationButton.classList.add("custom-map-control-button");
getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';

const MapCatches = props => {

  const { catches } = props;


/*   const catches = [
    { catchLocation: {lat: 33.4999985, lng: -117.7490541}, species: 'Bonito' },
    { catchLocation: {lat: 33.50881546785603, lng: -117.77067146729961}, species: 'Yellowtail' }, 
    { catchLocation: {lat: 33.52074990370165, lng: -117.7907109774181}, species: 'Bonito' }, 
    { catchLocation: {lat: 33.438086040850784, lng: -117.70684376238613}, species: 'Halibut' }, 
    { catchLocation: {lat: 33.43350197455659, lng: -117.72675648211269}, species: 'Bonito' }, 
    { catchLocation: {lat: 33.419175206713135, lng: -117.73018970965175}, species: 'Calico Bass' }
    ]; */

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
        const calicoURL='http://localhost:3000/img/icons/Calico-Bass-3840-1920.svg';
        const calicoURL2='http://localhost:3000/img/icons/Calico-Bass-3840-1920-test.png'
        const URLSVG = 'http://localhost:3000/img/icons/svg-icon.svg';
        const URLBiter = 'http://localhost:3000/img/icons/Biter-SVG-3840-1920.svg';
        const svgMarker = {
          url: URLSVG,
          scaledSize: new window.google.maps.Size(20*1.97642436149, 20),
          // scaledSize: new window.google.maps.Size(40, 20)
        }
        const calicoMarker = {
          url: calicoURL2,
          scaledSize: new window.google.maps.Size(30*1.97642436149, 30),
          // scaledSize: new window.google.maps.Size(40, 20)
        }

        // map our catches
        console.log(catches)
        if (catches && catches.length > 0) {
          catches.forEach((catchObj, index) => {

            console.log(catchObj);
            if (catchObj.catchLocation && typeof catchObj.catchLocation === 'object' ) {
              catchMarkersRef.current.push(new window.google.maps.Marker({
                position: {lat: catchObj.catchLocation.lat, lng: catchObj.catchLocation.lng},
                map: mapRef.current,
                icon: calicoMarker,
              }));
    
              const oldContent =`<div id="content">
              <div><b>${catchObj.species}</b></div><br/>
                <div></div>
                </div>`
        


              const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'

              const infoJSX = `
                <div style='width: 150px'>
                  <div style='${infoDivStyle}'><b>${catchObj.species}</b></div>
                  <div style='${infoDivStyle}; color: grey'>${DateTime.fromMillis(Date.parse(catchObj.catchDate)).toRelative()}</div>
                  ${catchObj.catchLength ? `<div style='${infoDivStyle}'>Length: ${catchObj.catchLength}</div>` : ``}
                  ${catchObj.fishingType ? `<div style='${infoDivStyle}'>${catchObj.fishingType}</div>` : ``}
                  ${catchObj.notes ? `<div style='${infoDivStyle}'>Notes: ${catchObj.notes}</div>` : ``}                  
                </div>
              `;

              // create a new info window for the catch
              const infoWindow = new window.google.maps.InfoWindow({
                content: infoJSX,
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
            }
  
          });
        }


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
/*     const pos = {lat: 33.25298912416853, lng: -118.14031335990441};
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
      .catch (err => console.log(err)); */
  };

  return (
        <div style={{display: 'flex'}}>
          <div className='map-container' style={{display: 'flex', flexDirection: 'column', width: 600, height: 600}}>
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
            {/* <button type='button' onClick={handleTestButtonClick} >test</button> */}
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

/*
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


*/