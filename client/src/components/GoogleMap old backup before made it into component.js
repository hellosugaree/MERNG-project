import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Loader } from "@googlemaps/js-api-loader"
// import JSON_ACCESS_LOCATIONS from '../utilities/locations.js';

import '../App.css';


const GoogleMap = props => {
  // debounced function to update state with current center position on map scroll


  const debouncedUpdateMapCenter = useCallback(_.debounce(updateMapCenter, 800),[]);
  const throttledUpdateCenterMarker = useCallback(_.throttle(updateCenterMarker, 50), []);


  const mapContainerRef = useRef();
  const mapRef = useRef();
  const autocompleteRef = useRef();
  const autocompleteInputRef = useRef();

  const currentPositionMarker = useRef();
  const centerMarkerRef = useRef();
  const getLocationButtonRef = useRef();

  const additionalOptions = { center_changed: handleCenterChange };

  const [ test, setTest ] = useState ({ lat: 33.4672, lng: -117.6981 });
  

  const [locationStatus, setLocationStatus] = useState({ loading: true, error: null, position: {}})
  const [mapCenter, setMapCenter] = useState({ centerMarker: null, position: {} });


  // useEffect to update marker to center center of map when center changed (for location select)
  useEffect(() => {
    
  }, []);

  // https://maps.googleapis.com/maps/api/geocode/json?address=24%20Sussex%20Drive%20Ottawa%20ON&key=AIzaSyCiIhYg0zDT2eTO8TY9QAoumCNvJTv6u4w



  const initializeMap = () => {
    // create a custom button for our map to get location
    const locationButton = document.createElement('button');
    locationButton.classList.add("custom-map-control-button");
    locationButton.innerHTML='<i class="blue location arrow icon"></i>';
    locationButton.addEventListener('click', handleGetLocationButtonClick);

    // load and initialize map
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: 33.4672, lng: -117.6981 },
        zoom: 13,
        ...additionalOptions,
      });

      // locationButton.style.display='';
      mapRef.current.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
      // const locationButton = document.createElement("button");
      // // locationButton.textContent = "";
      // locationButton.innerHTML = "<Icon name='backward' />";
      // locationButton.classList.add("custom-map-control-button");

      console.log(locationButton.innerHTML)
      
      // set a new crosshair marker at center of map and add it to state so we can set it as center every time the map moves

      // apply current position status to map
      const circleIcon = { 
        scale: 15,
        strokeWeight: 2,
        
        path: window.google.maps.SymbolPath.CIRCLE 
      };
      centerMarkerRef.current = new window.google.maps.Marker({
        position: mapRef.current.getCenter().toJSON(),
        map: mapRef.current,
        icon: circleIcon
      });
  };

  const initializeAutocomplete = () => {
    const center = { lat: 33.4672, lng: -117.6981 };
    // set default search bounds to +/- 100km from default location
    const defaultBounds = {
      north: center.lat + 1,
      south: center.lat - 1,
      east: center.lng + 1,
      west: center.lng - 1,
    };
    // set options for autocomplete
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "icon", "name"],
      origin: center,
      strictBounds: false,
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, options);
    // add a listener for place selection
    autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
  };

  // useEffect to initialize map and position
  useEffect(() => {
    console.log(autocompleteRef.current);
    const loader = new Loader({
      // apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
      version: "weekly",
      libraries: ["places"]
    });
    loader.load()
      .then(() => {
        initializeMap();
        initializeAutocomplete();
        getPosition();
        console.log(autocompleteRef.current);
      })
      .catch (err => console.log(err));
  }, []);


/*   // useEffect to retry get loading on timeout
  useEffect(() => {
    if locationStatus.
  }, [locationStatus.error]); */


  const getPosition = () => {
    // delete the current marker from the map
    if (currentPositionMarker.current) {
      currentPositionMarker.current.setMap(null);
    }
    setLocationStatus({ 
      ...locationStatus, 
      loading: false, 
      error: null, 
      position: {}
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loc => {
        const position = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        // update successful location status in state
        setLocationStatus({ 
          ...locationStatus, 
          loading: false, 
          error: null, 
          position
        });
        // mark our position on the map
        currentPositionMarker.current = new window.google.maps.Marker({
          position: position,
          map: mapRef.current
        });
        // center our map on current position:
        mapRef.current.setCenter(position);

      }, err => {
        // update error in location status in state
        setLocationStatus({ ...locationStatus, loading: false, error: err });
      }, { timeout: 20000 });
    } else {
      // set error for navigator.geolocation unsuppored
      setLocationStatus({
        ...locationStatus,
        loading: false,
        error: { code: 4 }
      });
    }
    
    // console.log(position);
    // // return null if couldn't get positon, otherwise return position
    // return Object.keys(position).length > 0 ? position : null;
  };

/*   useEffect(() => {
    console.log('map center position change useEffect')
    console.log(`current position from state ${mapCenter.position}`)
    if (centerMarkerRef.current) {
      console.log('found centerMarkerRef.current');
      centerMarkerRef.current.setPosition(mapCenter.position);
    }

  }, [mapCenter.position]);
 */
  function handleCenterChange() {
    debouncedUpdateMapCenter();
    throttledUpdateCenterMarker();
  }

  const handleGetLocationButtonClick = event => {
    event.preventDefault();
    getPosition();
  }

  // function to debounce, we will invoke debounced version on map center change
  function updateMapCenter() {
    console.log('center change')
    console.log(mapRef.current);
    console.log(`mapCenter.position keys: ${Object.keys(mapCenter.position)}`);
    setMapCenter({ ...mapCenter, position: mapRef.current.getCenter().toJSON() });
    // console.log(mapRef.current.center.lat())
    // console.log(mapRef.current.center.lng())
  }
  
  
  // function we will throttle to update the center marker when map moves
  function updateCenterMarker() {
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setPosition(mapRef.current.getCenter());
    }
  }
  
  function handlePlaceSelect() {
    // get the place the user selected
    const place = autocompleteRef.current.getPlace();
    console.log(JSON.stringify(place));
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
 
  const handleClick =  () => {
    console.log('click')
    console.log(Object.keys(props));
    // google autocomplete place object to use for dev without querying api
    const place = {"address_components":[{"long_name":"San Francisco","short_name":"SF","types":["locality","political"]},{"long_name":"San Francisco County","short_name":"San Francisco County","types":["administrative_area_level_2","political"]},{"long_name":"California","short_name":"CA","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]}],"geometry":{"location":{"lat":37.7749295,"lng":-122.4194155},"viewport":{"south":37.70339999999999,"west":-122.527,"north":37.812,"east":-122.3482}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png","name":"San Francisco","html_attributions":[]};
    const { lat, lng } = place.geometry.location;
    console.log(lat, lng);
    currentPositionMarker.current.setPosition({ lat: lat, lng: lng });
    mapRef.current.setCenter({ lat: lat, lng: lng });
    // console.log(currentPositionMarker.current.setPosition)
    // console.log(mapRef.current.getCenter())

    // const newMarker = new window.google.maps.Marker({
    //   position: { lat: 33.4672, lng: -117.6981 },
    //   map: mapRef.current
    // });
    // currentPositionMarker.current.setPosition(mapRef.current.getCenter())
    // setTest({ lat: 33.50944561981977, lng: -117.74184432216796 })
    // console.log(Object.keys(mapRef.current))
    // console.log(mapRef.current.center.lat())
    // console.log(mapRef.current.center.lng())
    // console.log(mapRef.current.data.map.features)
    // setMapCenter({ ...mapCenter, centerMarker: centerMarkerRef.current })
  };

  const passLocationToParent = () => {
    props.getLocationFromChildCallback(mapCenter.position);
  }

  const handleAddressChange = event => {
    const input = event.target.value;
    // const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    // // console.log(event.target.value);

    // const encodedURL = encodeURI(URL);
    // fetch(encodedURL);
    //   .then(res => res.json())
    //   .then(json => console.log(json));
  }

  const getGeocodedAddress = async (url) => {
    fetch(url)
    .then(res => res.json())
    .then(json => console.log(json));
  }
  const handleAddressKeyPress = event => {
    console.log(event);
    if (event.key === 'Enter') {
      if (event.target.value.trim().length > 0) {
        const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${event.target.value}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
        const encodedURL = encodeURI(URL);
        getGeocodedAddress(encodedURL);
      }
    }
  }

  return (
    <div className='home-page'>
      <div style={{display: 'flex', border: '2px dashed blue'}}>
        <div className='map-container' style={{display: 'flex', flexDirection: 'column'}}>
          {/* STANDARD ADDRESS INPUT NON AUTOCOMPLETE */}
          <input type='text' style={{display: 'none'}} name='addressInput' onChange={handleAddressChange} onKeyPress={handleAddressKeyPress} />

          {/* ADDRESS AUTOCOMPLETE INPUT */}
          <input type='text' ref={autocompleteInputRef} style={{height: 40}} name='addressAutocomplete' placeholder='Enter a location' />

          <div id='map' ref={mapContainerRef} />
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '4px dotted green'}}>
            { // display location loading message
              locationStatus.loading && 
                <span>Loading location...</span>
            }
            { // display unsupported browser message
              (locationStatus.error && locationStatus.error.code) === 1 && 
              <span>Couldn't get current location, location services turned off by user</span>
            }
            { // display unsupported browser message
              (locationStatus.error && locationStatus.error.code) === 2 && 
              <span>Couldn't get current location, position unavailable</span>
            }
            { // display unsupported browser message
              (locationStatus.error && locationStatus.error.code) === 4 && 
              <span>Couldn't get current location, unsupported browser</span>
            }
            { // display map center location
              Object.keys(mapCenter.position).length > 0 && 
              <span>Map center: {mapCenter.position.lat}, {mapCenter.position.lng} </span>
            }

            {Object.keys(locationStatus.position).length > 0 && <span> Your location: { locationStatus.position.lat }, { locationStatus.position.lng }</span>}
          </div>
        </div>

        

        <br/><br/><br/><br/><br/>

        </div>
        <button type='button' onClick={ handleClick }>skhskh</button>
        {/* <button ref={getLocationButtonRef} style={{display: 'none'}} id='get-location-button' className='custom-map-control-button' ><Icon color='blue' name='location arrow' /></button> */}

    </div>
    
  );

};


// console.log(Object.keys(loader))

export default GoogleMap;