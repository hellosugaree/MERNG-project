import React, { useRef, useEffect, useCallback } from 'react';
import _ from 'lodash';


const GoogleMap = props => {

  // throttled function to update center position marker when map moves
  const throttledUpdateCenterMarker = useCallback(_.throttle(updateCenterMarker, 50), [updateCenterMarker]);
  const centerMarkerRef = useRef();
  const additionalOptions = { center_changed: handleCenterChange };
  
  // useEffect to update center of map if props.center changes
  useEffect(() => {
    if (props.mapRef.current) {
      console.log('setting map center from props');
      props.mapRef.current.setCenter(props.center);
    }
  }, [props.center]);

  // https://maps.googleapis.com/maps/api/geocode/json?address=24%20Sussex%20Drive%20Ottawa%20ON&key=AIzaSyCiIhYg0zDT2eTO8TY9QAoumCNvJTv6u4w

  // initialize the map on mount 
  useEffect(() => {
    console.log('initial useEffect called')
    initializeMap();
  }, []);

  function initializeMap () {
      // load and initialize map
      props.mapRef.current = new window.google.maps.Map(props.mapContainer.current, {
        center: { lat: 33.4672, lng: -117.6981 },
        zoom: 13,
        ...additionalOptions,
      });
      
      // push custom controls onto the form
      if (props.controls) {
        props.controls.forEach(control => {
          // add a listener to the control
          control.listeners.forEach(listener => control.element.addEventListener(listener.event, listener.callback));
          props.mapRef.current.controls[window.google.maps.ControlPosition.[control.position]].push(control.element);
        });
      }


      // set a new crosshair marker at center of map and add it to state so we can set it as center every time the map moves
      // apply current position status to map
      const circleIcon = { 
        scale: 15,
        strokeWeight: 2,
        path: window.google.maps.SymbolPath.CIRCLE 
      };
      // initialize center marker
      centerMarkerRef.current = new window.google.maps.Marker({
        position: props.mapRef.current.getCenter().toJSON(),
        map: props.mapRef.current,
        icon: circleIcon
      });
  }

  function handleCenterChange() {
    throttledUpdateCenterMarker();
  }
  
  // function we will throttle to update the center marker when map moves
  function updateCenterMarker() {
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setPosition(props.mapRef.current.getCenter());
    }
  }

  return <div></div>

};

export default GoogleMap;



/*

  const handleClick =  () => {
    console.log('click')
    console.log(Object.keys(props));
    // google autocomplete place object to use for dev without querying api
    const place = {"address_components":[{"long_name":"San Francisco","short_name":"SF","types":["locality","political"]},{"long_name":"San Francisco County","short_name":"San Francisco County","types":["administrative_area_level_2","political"]},{"long_name":"California","short_name":"CA","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]}],"geometry":{"location":{"lat":37.7749295,"lng":-122.4194155},"viewport":{"south":37.70339999999999,"west":-122.527,"north":37.812,"east":-122.3482}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png","name":"San Francisco","html_attributions":[]};
    const { lat, lng } = place.geometry.location;
    console.log(lat, lng);
    currentPositionMarker.current.setPosition({ lat: lat, lng: lng });
    props.mapRef.current.setCenter({ lat: lat, lng: lng });

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

  // const getGeocodedAddress = async (url) => {
  //   fetch(url)
  //   .then(res => res.json())
  //   .then(json => console.log(json));
  // }

  // const handleAddressKeyPress = event => {
  //   console.log(event);
  //   if (event.key === 'Enter') {
  //     if (event.target.value.trim().length > 0) {
  //       const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${event.target.value}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
  //       const encodedURL = encodeURI(URL);
  //       getGeocodedAddress(encodedURL);
  //     }
  //   }
  // }

  */