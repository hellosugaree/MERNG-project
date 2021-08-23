
import { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/auth';
import { ModalContext } from '../context/modal';
import { Loader } from "@googlemaps/js-api-loader"
import { useGeolocation } from './useGeolocation';
import MarkerClusterer from '@googlemaps/markerclustererplus'

import '../App.css';


export const useGoogleAutocomplete = placeSelectCallback => {

  const autocompleteInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const loadAutocomplete = () => {
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
    autocompleteRef.current.addListener('place_changed', placeSelectCallback)
  };

  return { loadAutocomplete, autocompleteRef, autocompleteInputRef };

};





export const useGoogleMap2 = (showBasicControls = true, additionalControls, onCenterChangeCallback, showCenterMarker, mapOptions, defaultZoom = 13) => {
/**
 * @callback onCenterChangeCallback - (optional) callback function executed when map center changed
 * @param {boolean} showBasicControls - include basic controls (default true)
 * @param {Object[]} additionalControls - array of additional controls
 * @param {boolean} showCenterMarker - show a marker that stays fixed in the center of the map
 * @param {Object} mapOptions - object of map options to pass to the google.maps.Map constructor
 * @param {number} defaultZoom - specify initial zoom of map in google.maps.Map constructor
 */
  const getCurrentLocationButton = document.createElement('button');
  getCurrentLocationButton.classList.add("custom-map-control-button");
  getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';

  const controls = [];

  if (showBasicControls) {
    controls.push({ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] });
  }
  if (additionalControls && additionalControls.length > 0) {
    additionalControls.forEach(control => controls.push(control));
  }

  // loading state for google api
  const [apiStatus, setApiStatus] = useState({errors: null, loading: false, complete: false});
  // state to indicate map has loaded
  const [mapLoaded, setMapLoaded] = useState(false);

  // refs for map components
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const currentPositionMarkerRef = useRef(null);
  const markersRef = useRef([]);
  const markerClusterRef = useRef(null);
  const centerMarkerRef = useRef(null);
  
  // center to control map center via props
  const center = { lat: 33.4672, lng: -117.6981 };

  const { getPosition, geolocationStatus } = useGeolocation();

  // map options
  const additionalOptions = { center_changed: handleCenterChange, streetViewControl: false  };

  // function to create a center marker on the map that stays centered
  // useCallback so we can pass it to a useEffect for when the showCenterMarker argument changes dynamically, as well as if it's set to true statically (via the loadMap function)
  const createCenterMarker = useCallback((mapRef, centerMarkerRef) => {
    // set a new crosshair marker at center of map and add it to state so we can set it as center every time the map moves
    // apply current position status to map
    console.log('creating center marker')
    // const circleIcon = { 
    //   scale: 15,
    //   strokeWeight: 2,
    //   path: window.google.maps.SymbolPath.CIRCLE 
    // };

    const fishTargetIcon = {
      url: 'http://localhost:3000/img/icons/yellowfin-crosshair.png',
      scaledSize: new window.google.maps.Size(75, 75),
      anchor: new window.google.maps.Point(37.5, 37.5),
    };

    // initialize center marker
    centerMarkerRef.current = new window.google.maps.Marker({
      position: mapRef.current.getCenter().toJSON(),
      map: mapRef.current,
      // icon: 'http://localhost:3000/img/icons/yellowfin-crosshair.png',
      icon: fishTargetIcon,
      opacity: 0.5,
    });
  },[]);


    // load the API
  if (!apiStatus.errors && apiStatus.loading === false && apiStatus.complete === false) {
    setApiStatus({ ...apiStatus, loading: true });
    console.log('loading api from inside useGoogleMap2 hook')
    loadApi();
  }

  // load the api script
  function loadApi() {
    const loader = new Loader({
      apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
      version: "weekly",
      libraries: ["places"],
    });
    loader.load()
    .then(() => {
      console.log('API loaded')
      // set our status to loaded so we know when to render dependent components
      setApiStatus({ loading: false, errors: null, complete: true });
        // getPosition();
    })
    .catch (err => {
      console.log(err);
      setApiStatus({ loading: false, errors: err, complete: false });
    });
  };

  // load the map
  function loadMap () {
    // load and initialize map
    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: center,
      zoom: defaultZoom,
      ...mapOptions,
      ...additionalOptions,
      // gestureHandling: 'cooperative'
    });
    
    // push custom controls onto the form
    if (controls.length > 0) {
      controls.forEach(control => {
        // add listeners to the control
        control.listeners.forEach(listener => control.element.addEventListener(listener.event, listener.callback));
        // add our control to the map controls.
        const pos = control.position;
        const controlArrayIndex = window.google.maps.ControlPosition[pos];
        mapRef.current.controls[controlArrayIndex].push(control.element);
      });
    }
    if (showCenterMarker) {
      createCenterMarker(mapRef, centerMarkerRef);
    }
    setMapLoaded(true);
  }

  // useEffect to toggle center marker on and off via showCenterMarker argument
  useEffect(() => {
    if (showCenterMarker && !centerMarkerRef.current && mapRef.current){
      createCenterMarker(mapRef, centerMarkerRef);
    }
    // case to handle if marker is toggled off via props after load
    if (!showCenterMarker && centerMarkerRef.current) {
      centerMarkerRef.current.setMap(null);
      centerMarkerRef.current = null;
    }

  }, [showCenterMarker, centerMarkerRef, mapRef, createCenterMarker]);


  // handler for the location button click on map
  function handleGetLocationButtonClick() {
    getPosition();
  }

  // useEffect to monitor our geoloation position when updated from any getPosition() calls and center the map to position
  useEffect(() => {
    if (mapRef.current){
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
        mapRef.current.setCenter(geolocationStatus.position)      
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
  }
  }, [geolocationStatus.position, geolocationStatus.errorMessage, mapRef, infoWindowRef])


  // fit the map bounds to contain an array of position objects {lat: <float>, lng: <float>}
  function fitBounds(positions, margin) {
    const latitudes = [];
    const longitudes = [];
    positions.forEach(position => {
      latitudes.push(position.lat);
      longitudes.push(position.lng)
    });
    // get our max and min lat and lng
    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);
    // return a boundary literal to pass back to our google Map instance
    const bounds = { north: maxLat, south: minLat, west: minLng, east: maxLng };
      mapRef.current.fitBounds(bounds, margin ? margin : 0);
  }

  // map markers, set clear to false if you want to add markers instead of clearing all markers
  // input is an array in the format of [{position: {lat: <float>, lng: <float>}, id: <string> }, ...]
  // options are fitBounds: <int> if specified, it will fit bounds with the specified margin when mapping markers
  function mapMarkers(markerArray, mapRef, clear = true, options = {fitBounds: 50}) {
    if (!window.google) return null;
    // clear old markers
    if (clear && markersRef.current.length > 0) {
      markersRef.current.forEach(markerRef => markerRef.ref.setMap(null));
    }
    markersRef.current = [];
    // array to hold positions of all markers to fit the map bounds
    const positions = [];
    // map the new markers
    const markers = [];
    markerArray.forEach(marker => {
      const newMarker = new window.google.maps.Marker({
        position: marker.position,
        map: mapRef.current
      });
      markersRef.current.push({id: marker.id, ref: newMarker });
      positions.push(marker.position);
      markers.push(newMarker);
    })
    if (options.fitBounds && markers.length > 0){
      fitBounds(positions, options.fitBounds);
    }
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }
    if (markers.length > 0) {
      markerClusterRef.current = new MarkerClusterer(mapRef.current, markers,
        {
          // gridSize: 20,
          // imagePath: 'http://localhost:3000/img/markerclusterer/m1.png'
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
    }
  };


  // functions for handling map events
  function handleCenterChange() {
    // throttledUpdateCenterMarker();
    if (onCenterChangeCallback) {
      onCenterChangeCallback();
    }
    updateCenterMarker();
  }
  
  // function we will throttle to update the center marker when map moves
  function updateCenterMarker() {
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setPosition(mapRef.current.getCenter());
    }
  }

    // function to display an info window on the map
    function showInfoWindowInCenter (content, mapRef, infoWindowRef) {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }   
      const infoWindow = new window.google.maps.InfoWindow({
        content: content,
      });
  
      infoWindow.setPosition(mapRef.current.getCenter());
      infoWindow.open(mapRef.current);
      infoWindowRef.current = infoWindow;
    }

  return {
    loadMap,
    mapMarkers,
    getPosition, 
    showInfoWindowInCenter,
    geolocationStatus,
    mapContainerRef,
    currentPositionMarkerRef,
    mapRef,
    infoWindowRef,
    apiStatus,
    mapLoaded,
    center,
    markersRef,
  };

};
























export const useGoogleMap = () => {
  // loading state for google api
  const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
  // refs for map components
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const currentPositionMarkerRef = useRef(null);
  const markersRef = useRef([]);
  const markerClusterRef = useRef(null);

  // center to control map center via props
  const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 });

  const { getPosition, geolocationStatus } = useGeolocation();

  const getCurrentLocationButton = document.createElement('button');
  getCurrentLocationButton.classList.add("custom-map-control-button");
  getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';

  const basicControls = [{ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] }];

  const loader = new Loader({
    apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
    version: "weekly",
    libraries: ["places"],
  });

  const loadMap = () => {
    loader.load()
    .then(() => {
      console.log('API loaded')
      // set our status to loaded so we know when to render dependent components
      setApiStatus({loading: false, errors: null});
        getPosition();
    })
    .catch (err => {
      console.log(err);
      setApiStatus({loading: false, errors: err});
    });
  };


  // handler for the location button click on map
  function handleGetLocationButtonClick(event) {
    getPosition();
  }

  // useEffect to monitor our geoloation position when updated from any getPosition() calls and center the map to position
  useEffect(() => {
    if (mapRef.current){
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
  }
  }, [geolocationStatus.position, geolocationStatus.errorMessage, mapRef, infoWindowRef, setCenter])


  // fit the map bounds to contain an array of position objects {lat: <float>, lng: <float>}
  function fitBounds(positions, margin) {
    const latitudes = [];
    const longitudes = [];
    positions.forEach(position => {
      latitudes.push(position.lat);
      longitudes.push(position.lng)
    });
    // get our max and min lat and lng
    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);
    // return a boundary literal to pass back to our google Map instance
    const bounds = { north: maxLat, south: minLat, west: minLng, east: maxLng };
      mapRef.current.fitBounds(bounds, margin ? margin : 0);
  }

  // map markers, set clear to false if you want to add markers instead of clearing all markers
  // input is an array in the format of [{position: {lat: <float>, lng: <float>}, id: <string> }, ...]
  // options are fitBounds: <int> if specified, it will fit bounds with the specified margin when mapping markers
  function mapMarkers(markerArray, mapRef, clear = true, options = {fitBounds: 50}) {
    if (!window.google) return null;
    // clear old markers
    if (clear && markersRef.current.length > 0) {
      markersRef.current.forEach(markerRef => markerRef.ref.setMap(null));
    }
    markersRef.current = [];
    // array to hold positions of all markers to fit the map bounds
    const positions = [];
    // map the new markers
    const markers = [];
    markerArray.forEach(marker => {
      const newMarker = new window.google.maps.Marker({
        position: marker.position,
        map: mapRef.current
      });
      markersRef.current.push({id: marker.id, ref: newMarker });
      positions.push(marker.position);
      markers.push(newMarker);
    })
    if (options.fitBounds && markers.length > 0){
      fitBounds(positions, options.fitBounds);
    }
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }
    if (markers.length > 0) {
      markerClusterRef.current = new MarkerClusterer(mapRef.current, markers,
        {
          gridSize: 20,
          // imagePath: 'http://localhost:3000/img/markerclusterer/m1.png'
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
    }

  };

  return {
    loadMap,
    mapMarkers,
    setCenter,
    geolocationStatus,
    mapContainerRef,
    currentPositionMarkerRef,
    mapRef,
    infoWindowRef,
    apiStatus,
    center,
    markersRef,
    basicControls
  };

};



export const useDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const closeFilterMenu = () => {
    console.log('close click handler')
    setShowDropdown(false);
    document.removeEventListener('click', closeFilterMenu);
  };

  // toggle show and hide for dropdown menu
  const toggleDropdown = e => {
    // stop the event from propagating or it will immediately trigger our document clickhandler and keep itself closed
    e.stopPropagation();
    e.preventDefault();
    if (showDropdown === false) {
      setShowDropdown(() => true);
      document.addEventListener('click', closeFilterMenu);
    } else {
      closeFilterMenu();
    }
  }

  return {
    showDropdown,
    toggleDropdown
  };
};

// takes a callback which will be our query or mutation function for that form which will be defined in that component
export const useForm = (callback, initialValues) => { // initial values and object to specify default values for form fields
  // import logout so we can logout user and clear all user data from our context if we get back an invalid or missing token from server
  const { user } = useContext(AuthContext); 
  
  const { showLoginModal } = useContext(ModalContext);

  // controlled form values
  const [ values, setValues ] = useState(initialValues);
  const [ errors, setErrors ] = useState({});

  // handle change in controlled form values
  const handleChange = event => {
    // update state when form values change
    setValues({...values, [event.target.name]: event.target.value});
  };

  // handle change in date selection fields
  const handleDateChange = (date, name) => {
    setValues(prevValues => ({...prevValues, [name]: date}));
  };

  // handle form submit
  const onSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    // execute our form submit callback
    console.log(user);
    callback();
  };


  // Error processing
  // takes and option callback for a setter to show an error modal window
  const handleFormErrors = (err) => {
    // console.log(Object.keys(err));
    // array to return messages as strings from our error object
    const errorMessages = [];
    // object to return names of inputs with errors so we can highlight wrong input fields on the form
    const errorFields = {};
    // handle graphQLErrors
    if (err.graphQLErrors.length > 0) { 
      if (err.graphQLErrors[0].message === 'Authorization header missing') {
        // handle cases where user acesses and tries to use feature that requires login, but the token is missing so no header gets sent
        // redirect to login
        // errorMessages.push('You must be logged in to that')
        // Show the login modal
        showLoginModal();
        // logout();
        // return window.location.replace('/login')
      }
      if (err.graphQLErrors[0].message === 'Invalid/Expired token') {
        // handle cases where user acesses and tries to use feature that requires login, but the token is missing so no header gets sent
        // redirect to login
        // errorMessages.push('You must be logged in to that')
        // Show the login modal
        showLoginModal()
        // logout();
        // return window.location.replace('/login')
      }
  
      const graphQLErrors = err.graphQLErrors[0].extensions.exception;
      for (const key in graphQLErrors) {
        if (key !== 'stacktrace') {
          errorFields[key] = true;
          console.log(graphQLErrors[key]);
          errorMessages.push(graphQLErrors[key]);
        }
      }
    }
    // handle network errors
    if (err.networkError){
      errorMessages.push(`Server error - ${err.message}`);
    }
    errorMessages.forEach(val => console.log(val));
    // set errors so form can update
    // in future need to add which input fields generated errors to highlight input fields
    if (errorMessages.length > 0){
      setErrors({errorMessages, errorFields, ...err})
    }
  }              

  // return both functions and values (state) so we can use them in our components
  return {
    handleChange,
    handleDateChange,
    onSubmit,
    handleFormErrors,
    values,
    errors,
    setValues,   // ideally this would never be used outside of here, but it's necessary for a controlled AutoSearchInput    
  };

};

