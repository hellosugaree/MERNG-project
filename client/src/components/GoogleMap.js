import React, { useRef, useEffect } from 'react';
// import _ from 'lodash';

const GoogleMap = props => {
  // const { throttle } = _;
  // throttled function to update center position marker when map moves
  // const throttledUpdateCenterMarker = useMemo(() => throttle(updateCenterMarker, 10), [updateCenterMarker, throttle],);
  const centerMarkerRef = useRef(null);
  const additionalOptions = { center_changed: handleCenterChange, streetViewControl: false  };
  
  // useEffect to update center of map if props.center changes
  useEffect(() => {
    if (props.mapRef.current) {
      console.log('setting map center from props');
      // console.log(props.center)
      props.mapRef.current.setCenter(props.center);
    }
  }, [props.center, props.mapRef]);

  // initialize the map on mount 
  useEffect(() => {
    // console.log('initial useEffect called')
    initializeMap();
  }, []);


  function initializeMap () {
      // load and initialize map
      props.mapRef.current = new window.google.maps.Map(props.mapContainer.current, {
        center: props.center,
        zoom: props.zoom ? props.zoom : 13,
        ...additionalOptions,
        ...props.options
      });
      
      // push custom controls onto the form
      if (props.controls) {
        props.controls.forEach(control => {
          // add listeners to the control
          control.listeners.forEach(listener => control.element.addEventListener(listener.event, listener.callback));
          // add our control to the map controls.
          const pos = control.position;
          const controlArrayIndex = window.google.maps.ControlPosition[pos];
          props.mapRef.current.controls[controlArrayIndex].push(control.element);
        });
      }

    // if (props.showCenterMarker){
    //   // set a new crosshair marker at center of map and add it to state so we can set it as center every time the map moves
    //   // apply current position status to map
    //   const circleIcon = { 
    //     scale: 15,
    //     strokeWeight: 2,
    //     path: window.google.maps.SymbolPath.CIRCLE 
    //   };
    //   // initialize center marker
    //   centerMarkerRef.current = new window.google.maps.Marker({
    //     position: props.mapRef.current.getCenter().toJSON(),
    //     map: props.mapRef.current,
    //     icon: circleIcon
    //   });
    // }
  }

  // useEffect for when we toggle center marker via props
  useEffect(() => {
    if (props.showCenterMarker && !centerMarkerRef.current){
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
    // case to handle if marker is toggled off via props after load
    if (!props.showCenterMarker && centerMarkerRef.current) {
      centerMarkerRef.current.setMap(null);
      centerMarkerRef.current = null;
    }

  }, [props.showCenterMarker, centerMarkerRef.current]);




  function handleCenterChange() {
    // throttledUpdateCenterMarker();
    if (props.onCenterChangeCallback) {
      props.onCenterChangeCallback();
    }
    updateCenterMarker();
  }
  
  // function we will throttle to update the center marker when map moves
  function updateCenterMarker() {
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setPosition(props.mapRef.current.getCenter());
    }
  }

  return null;

};

export default GoogleMap;