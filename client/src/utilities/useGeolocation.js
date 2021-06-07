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
  const [geolocationStatus, setGeolocationStatus] = useState({ loading: false, error: null, position: null})

  const getPosition = () => {
    setGeolocationStatus({ 
      ...geolocationStatus, 
      loading: true, 
      error: null, 
      position: null
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loc => {
        const position = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        // update successful location status in state
        setGeolocationStatus({ 
          ...geolocationStatus, 
          loading: false, 
          error: null, 
          position
        });
      }, err => {
        // update error in location status in state
        setGeolocationStatus({ ...geolocationStatus, loading: false, error: err });
      }, { timeout: 20000 });
    } else {
      // set error for navigator.geolocation unsuppored
      setGeolocationStatus({
        ...geolocationStatus,
        loading: false,
        error: { code: 4 }
      });
    }
    
  };

  return {
    getPosition,
    geolocationStatus
  };


}



export default useGeolocation;