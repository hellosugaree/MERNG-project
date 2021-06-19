
import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import { ModalContext } from '../context/modal';
import { Loader } from "@googlemaps/js-api-loader"
import { useGeolocation } from './useGeolocation';
import '../App.css';


export const useGoogleMap = () => {
  // loading state for google api
  const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
  // refs for map components
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const currentPositionMarkerRef = useRef(null);

  // center to control map center via props
  const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 });

  const { getPosition, geolocationStatus } = useGeolocation();

  const getCurrentLocationButton = document.createElement('button');
  getCurrentLocationButton.classList.add("custom-map-control-button");
  getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';

  const basicControls = [{ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] }];

  const loader = new Loader({
    // apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
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

  return {
    loadMap,
    geolocationStatus,
    mapContainerRef,
    currentPositionMarkerRef,
    mapRef,
    infoWindowRef,
    apiStatus,
    basicControls,
    center
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
  const { logout, user } = useContext(AuthContext); 
  
  const { showModal, showLoginModal, closeModal } = useContext(ModalContext);

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
    console.log(Object.keys(err));
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
    showModal,  // use this for the show prop in the Modal component within a form
    handleChange,
    handleDateChange,
    onSubmit,
    handleFormErrors,
    values,
    errors,
    setValues,   // ideally this would never be used outside of here, but it's necessary for a controlled AutoSearchInput    
  };

};

