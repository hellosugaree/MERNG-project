import { useState } from 'react';
/*
Use for geolocation
import the getPosition function and the geolocationStatus object
geolocationStatus has 3 properties:
  1) loading: specifies whether geolocation is loading (default: false)
  2) error: contains any geolocation errors (default: null)
      error.code:
        1 location services turned off
        2 position unavailable
        3 timeout
        4 unsupported browser
  3) position: will contain position from geolocation in the form of {lat: latitude, lng: longitude} (default null)
*/

const useGeolocation = () => {
  const initialState = { loading: false, error: null, errorMessage: null, position: null };
  const [geolocationStatus, setGeolocationStatus] = useState(initialState);

  const getPosition = () => {
    setGeolocationStatus({ 
      ...initialState, 
      loading: true, 
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loc => {
        const position = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        // update successful location status in state
        setGeolocationStatus({ 
          ...initialState, 
          position
        });
      }, err => {
        // update error in location status in state
        let errorMessage = '';
        switch (err.code) {
          case 1:
            errorMessage = 'Unable to get location. Please enable location services';
          break;
          case 2:
            errorMessage = 'Your current position is unavailable. Please try again later.';
          break;
          case 3:
            errorMessage = 'Location request timed out. Please try again';
          break;
          default:
          break;
        }
        setGeolocationStatus({ 
          ...initialState, 
          error: err,
          errorMessage
        });
      }, { timeout: 20000 });
    } else {
      // set error for navigator.geolocation unsuppored
      setGeolocationStatus({
        ...initialState,
        error: { code: 4 },
        errorMessage: 'Unable to get current location. Your browser does not support geolocation.'
      });
    }
    
  };

  return {
    getPosition,
    geolocationStatus
  };
}

export default useGeolocation;