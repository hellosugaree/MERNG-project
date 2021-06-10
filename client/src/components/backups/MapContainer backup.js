import React, { useState, useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import GoogleMap from './GoogleMap';
import GoogleAutocomplete from './GoogleAutocomplete';
import useGeolocation from '../utilities/useGeolocation';
import CreateCatchFormOld from './CreateCatchFormOld';
import '../App.css';

// create custom control elements to send to our map
// create a custom button for our map to get location
const getCurrentLocationButton = document.createElement('button');
getCurrentLocationButton.classList.add("custom-map-control-button");
getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';
// create a button to accept our location
const selectLocationButton = document.createElement('button');
selectLocationButton.classList.add('custom-map-control-button');
selectLocationButton.innerHTML='Accept catch location';


const MapContainer = props => {
  // array to hold controls that will be added on mount
  const controls = [];
  // create a controls array to pass to the GoogleMap component
  controls.push({ position: 'BOTTOM_CENTER', element: selectLocationButton, listeners: [{event: 'click', callback: handleSelectLocationButtonClick}] });
  controls.push({ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] });

  // state to check when loader is loaded so we know when to render our map and autocomplete components
  const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
  // pass this as a prop to our--initial value is default center, and the map center will always auto update if we set coords here
  const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 });

  // set up a ref for a marker to mark our current position on the map
  const currentPositionMarkerRef = useRef(null);

  // get our geolocation hook
  const { getPosition, geolocationStatus } = useGeolocation();

  const autocompleteInputRef = useRef();
  const autocompleteRef = useRef();
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const infoWindowRef = useRef();

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
      // check if we already have a position marker
      if (currentPositionMarkerRef.current) {
        // current position marker exists, update the marker
        console.log('current pos marker already exists');
        currentPositionMarkerRef.current.setPosition(geolocationStatus.position);
      } else {
        console.log('current pos marker doesn\'t exist, creating new one');
        // current position marker doesn't exist, create a new marker
        currentPositionMarkerRef.current = new window.google.maps.Marker({
          position: geolocationStatus.position,
          map: mapRef.current
        });
        // center the map on current position
      }
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
  }, [geolocationStatus.position, geolocationStatus.errorMessage, currentPositionMarkerRef, mapRef, infoWindowRef])


    // add listener to close info windows on map click
    useEffect(() => {
      if(mapRef.current) {
        console.log('adding listener')
        mapRef.current.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });
      }
    }, [mapRef.current, infoWindowRef]);
  

  function handleSelectLocationButtonClick() {
    console.log('selected location');
    console.log(mapRef.current.getCenter().toJSON());
  }

  

  function handlePlaceSelect() {
    console.log('place select callback')
    // get the place the user selected
    const place = autocompleteRef.current.getPlace();
    console.log(JSON.stringify(place));
    const { lat, lng } = place.geometry.location;
    console.log(lat, lng);
    mapRef.current.setCenter(place.geometry.location);

    /*
    {
      "address_components":
        [
          {
            "long_name":"San Francisco",
            "short_name":"SF",
            "types":["locality","political"]
          },
          {
            "long_name":"San Francisco County",
            "short_name":"San Francisco County",
            "types":["administrative_area_level_2","political"]
          },
          {
            "long_name":"California",
            "short_name":"CA",
            "types":["administrative_area_level_1","political"]
          },
            {
              "long_name":"United States",
              "short_name":"US",
              "types":["country","political"]
            }
          ],
      "geometry":
        {
          "location":
            {
              "lat":37.7749295,
              "lng":-122.4194155
            },
            "viewport":{"south":37.70339999999999,"west":-122.527,"north":37.812,"east":-122.3482}},
            "icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
            "name":"San Francisco",
            "html_attributions":[]
        }

    */
  }


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

  return (
        <div style={{display: 'flex', border: '2px dashed blue', justifyContent: 'center', flexDirection: 'column'}}>
          <div className='map-container' style={{display: 'flex', flexDirection: 'column'}}>
            <input ref={autocompleteInputRef} type='text' placeholder='Enter a location to center the map' style={{height: 40}} />
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
                <GoogleAutocomplete autocomplete={autocompleteRef} autocompleteInput={autocompleteInputRef} onPlaceSelect={handlePlaceSelect} />
              </div>
            }
          </div>
          <CreateCatchForm />

        </div>
  );
}


export default MapContainer;