import React, { useEffect } from 'react';

/**
 * Instructions for use:
 * load from a parent component that has initialized the google maps and places api scripts
 * this component assumes scripts are loaded--do all loading and error checking before rendering this component 
 * this component takes 2 mandatory props:
 * 1) autocompleteInput: this prop is a ref for an html input in the parent component, in which the autocomplete will be rendered
 * 2) autocompleteRef: this is a blank ref in the parent component
 * 3) onPlaceSelect: a callback to be called when the user selects a place. 
 *    This is where the autocompleteRef is important, because you will need to reference it in your callback in the parent component to access the data of the selected place
 */
const GoogleAutocomplete = props => {

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

    props.autocomplete.current = new window.google.maps.places.Autocomplete(props.autocompleteInput.current, options);
    // add a listener for place selection
    props.autocomplete.current.addListener('place_changed', props.onPlaceSelect)
  };

  useEffect(() => {
    initializeAutocomplete();
  }, []);

  return <></>;

};

export default GoogleAutocomplete;

