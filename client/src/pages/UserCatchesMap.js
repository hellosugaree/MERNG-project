import React, { useContext, useEffect, useState, useRef, createRef, useCallback } from 'react';
import { DateTime, Interval } from 'luxon';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { debounce } from 'lodash';
import { AuthContext } from '../context/auth';
import { ModalContext } from '../context/modal';
import { useQuery } from '@apollo/client';
import { useGoogleAutocomplete, useGoogleMap2 } from '../utilities/hooks';
import { GET_CATCHES } from '../gql/gql';
import { Icon } from 'semantic-ui-react';
import CatchCard from '../components/CatchCard';
import LoaderFish from '../components/LoaderFish';
import CreateCatchForm from '../components/CreateCatchForm';
import ModalCreateCatchSuccess from '../components/ModalCreateCatchSuccess';
import '../App.css';

// create custom control elements to send to our map
// create a custom button for our map to get location
const getCurrentLocationButton = document.createElement('button');
getCurrentLocationButton.classList.add("custom-map-control-button");
getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';


const toggleMarkerClustersButton = document.createElement('button');
toggleMarkerClustersButton.classList.add("custom-map-control-button");
toggleMarkerClustersButton.innerHTML=``;




  // calculate our map bounds based on the catch data so we can contain the data within the map
  function calculateBounds(catchData) {
    // map our latitudes
    const latitudes = catchData.map(catchObj => {
      // make sure the catch contains a lat, lng object. This check will prevent errors from data entered befoe this was mandatory
      if (catchObj.catchLocation && catchObj.catchLocation && catchObj.catchLocation.lat && catchObj.catchLocation.lng) {
        return catchObj.catchLocation.lat;
      } else return null;
    });
    const longitudes = catchData.map(catchObj => {
      // make sure the catch contains a lat, lng object. This check will prevent errors from data entered befoe this was mandatory
      if (catchObj.catchLocation && catchObj.catchLocation && catchObj.catchLocation.lat && catchObj.catchLocation.lng) {
        return catchObj.catchLocation.lng;
      } else return null;
    });
    // get our max and min lat and lng
    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);
    // return a boundary literal to pass back to our google Map instance
    return ({ north: maxLat, south: minLat, west: minLng, east: maxLng });
  }


  // function to generate markers on the map for our currently selected catches
  function createMarkers(catches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, clusterMarkers, setHighlightedCatch) {
    console.log('generating markers');
    // first clear the map of all markers in case we are remapping markers after filtering catches
    catchMarkersRef.current.forEach(marker => marker.setMap(null));
    catchMarkersRef.current = [];
    // close open infoWindow if it exists
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    // clear info window refs
    infoWindowRef.current = null;
    // create markers for all our catches
    // array to hold markers
    const markers = [];
    catches.forEach(catchObj => {
      let markerUrl;
      // backwards compatibility before locations were required objects
      if (catchObj.catchLocation && typeof catchObj.catchLocation === 'object' ) {
        // let scaleFactor = [35 * 2, 35];
        // select marker based on species
        if (catchObj.species.match(/calico|sand bass|spotted bass|sculpin/gi)) {
          // console.log('calico');
          markerUrl='http://localhost:3000/img/icons/small/Calico-Bass-Small.png';
        }
        else if (catchObj.species.match(/rockfish/gi)) {
          // console.log('rockfish');
          markerUrl='http://localhost:3000/img/icons/small/Rockfish-Small.png';
        }          
        else if (catchObj.species.match(/tuna|bonito|yellowfin/gi)) {
          // console.log('tuna|bonito|yellowfin|yellowtail');
          markerUrl='http://localhost:3000/img/icons/small/Yellowfin-Small.png'
        }
        else if (catchObj.species.match(/yellowtail/gi)) {
          // console.log('tuna|bonito|yellowfin|yellowtail');
          markerUrl='http://localhost:3000/img/icons/small/Yellowtail-Small.png'
        }
        else if (catchObj.species.match(/striper|striped bass|stripper/gi)) {
          // console.log('striper|striped bass|stripper');
          markerUrl = 'http://localhost:3000/img/icons/small/Striped-Bass-Small.png';
        }
        else if (catchObj.species.match(/shark|leopard|mako|thresher/gi)) {
          // console.log('shark|leopard');
          // markerUrl='http://localhost:3000/img/icons/Leopard-Shark-3840-1920.svg'
          markerUrl = 'http://localhost:3000/img/icons/small/Leopard-Shark-Cropped-Small.png';
          // scaleFactor = [30 * 3.4143151476, 30];
        } 
        else if (catchObj.species.match(/halibut|flounder|butt/gi)) {
          // console.log('halibut|flounder|butt');
          markerUrl='http://localhost:3000/img/icons/small/Halibut-Small.png'
        }                        
        else {
          // console.log('default');
          markerUrl='http://localhost:3000/img/icons/small/Calico-Bass-Small.png';
        }
        // create the icon object
        const catchIcon = {
          url: markerUrl,
        }
        // create a new marker for this catch
        const catchMarker = new window.google.maps.Marker({
          position: {lat: catchObj.catchLocation.lat, lng: catchObj.catchLocation.lng},
          map: mapRef.current,
          icon: catchIcon,
          // collisionBehavior: window.google.maps.CollisionBehavior.REQUIRED,
          catchId: catchObj.id,
          species: catchObj.species
        });
        // create an info window for the marker
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
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoJSX,
        });
        // add a click listener to the catch marker
        catchMarker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          // open the info window for this marker
          infoWindow.open(mapRef.current, catchMarker);
          // set the ref for this window so we can close it on map click
          infoWindowRef.current = infoWindow;
          //highlight the catch
          setHighlightedCatch(catchObj.id);
          console.log(catchObj.id);
          console.log(JSON.stringify(catchObj))
          mapRef.current.setCenter(catchMarker.getPosition());
        }); 
        // store the info window as a ref
        markers.push(catchMarker);
      }
    });
    catchMarkersRef.current = markers;
    if (clusterMarkers) {
      generateMarkerClusters(markers, markerClusterRef, mapRef);
    }
    // center our map around the catch bounds
    if (catches.length > 0) {
      const bounds = calculateBounds(catches)
      mapRef.current.fitBounds(bounds, 100);
    }
  }


  function generateMarkerClusters(markers, markerClusterRef, mapRef) {
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }
    console.log('generating marker clusters');
    const markerStyles = [
      MarkerClusterer.withDefaultStyle({
        // url: "../img/icons/Calico-Bass-3840-1920.png",
        url: "../img/markerclusterer/m1.png",
        // height: 80,
        // width: 177,
        height: 53,
        width: 53,
        // anchorIcon: [37.5, 37.5],
        textColor: "#000000",
        textSize: 15,
        maxZoom: 10,
      }),  
      MarkerClusterer.withDefaultStyle({
        // url: "../img/icons/Calico-Bass-3840-1920.png",
        url: "../img/markerclusterer/m2.png",
        // height: 80,
        // width: 177,
        height: 56,
        width: 56,
        // anchorIcon: [37.5, 37.5],
        textColor: "#000000",
        textSize: 15,
        maxZoom: 10,
      }),  
      MarkerClusterer.withDefaultStyle({
        // url: "../img/icons/Calico-Bass-3840-1920.png",
        url: "../img/markerclusterer/m3.png",
        // height: 80,
        // width: 177,
        height: 66,
        width: 66,
        // anchorIcon: [37.5, 37.5],
        textColor: "#FFFFFF",
        textSize: 15,
        maxZoom: 10,
      }),  
      MarkerClusterer.withDefaultStyle({
        // url: "../img/icons/Calico-Bass-3840-1920.png",
        url: "../img/markerclusterer/m4.png",
        // height: 80,
        // width: 177,
        height: 78,
        width: 78,
        // anchorIcon: [37.5, 37.5],
        textColor: "#FFFFFF",
        textSize: 15,
        maxZoom: 10,
      }),
      MarkerClusterer.withDefaultStyle({
        // url: "../img/icons/Calico-Bass-3840-1920.png",
        url: "../img/markerclusterer/m5.png",
        // height: 80,
        // width: 177,
        height: 90,
        width: 90,
        // anchorIcon: [37.5, 37.5],
        textColor: "#FFFFFF",
        textSize: 15,
        maxZoom: 10,
      }),      
    ];
    markerClusterRef.current = new MarkerClusterer(mapRef.current, markers, {
      styles: markerStyles,
        // imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      maxZoom: 10,
      averageCenter: true,
      gridSize: 60,
    });

    // calculator for clusterer 
    markerClusterRef.current.setCalculator(function (m) {
      // build a species list to display in the tooltip
      const speciesList = { };
      m.forEach(marker => {
        if (marker.species in speciesList) {
          speciesList[marker.species] += 1;
        } else {
          speciesList[marker.species] = 1;
        }
      });
      let speciesText ='';
      for (const species in speciesList) {
        if (speciesList[species] > 1) {
          speciesText += `${speciesList[species]} ${species}, `;
        } else {
          speciesText += `${species}, `;
        }
      }
      // console.log(speciesText);
      speciesText = speciesText.substring(0, speciesText.length - 2);
      // for (let marker in m) console.log(typeof marker);
      const clusterSize = m.length; 
      let index;
      if (clusterSize <= 5) index = 1;
      if (clusterSize > 5 && clusterSize <= 10) index = 2;
      if (clusterSize > 10 && clusterSize <= 20) index = 3;
      if (clusterSize > 20 && clusterSize <= 30) index = 4;
      if (clusterSize > 30) index = 5;
      return { index, text: clusterSize, title: speciesText };
    });
  }

  // generate refs for our catch cards
  function createCatchCardRefs(catches, catchCardRefs) {
    console.log('creating catch card refs');
    // clear previous refs
    catchCardRefs.current = {};
    // create a ref with key of the catch id
    catches.forEach(catchObj => {
      catchCardRefs.current[catchObj.id] = createRef();
    });
  }

  // create and set our species list to be used for species filters 
  const createSpeciesList = (catches) => {
    const species = [];
    // create list of unique species from catch cards
    catches.forEach(catchObj => {
      if (species.indexOf(catchObj.species) < 0) {
        species.push(catchObj.species);
      }
    });
    return species;
  };

// state to hold selected filters
const defaultFilters = {apply: false, isDefault: true, species: [], catchDate: 'ALL'};

const UserCatchesMap = () => {
  console.log('UserCatchesMap Re rendered');

  const { user } = useContext(AuthContext);
  const { showCustomModal, closeModal } = useContext(ModalContext);

  const [highlightedCatch, setHighlightedCatch] = useState(null);
  const [showCreateCatch, setShowCreateCatch] = useState(false);
  // state to hold image data for 
  const [displayImageData, setDisplayImageData] = useState([]);

  // callback executed when map center changed, update currentMapCenter state to pass location to create catch form
  const debouncedSetCurrentMapCenter = useCallback(debounce(() => setCurrentMapCenter(mapRef.current.getCenter().toJSON()), 100,))

  // second null is getCenterFromMap
  const { loadMap, showInfoWindowInCenter, mapContainerRef, mapRef, infoWindowRef, center, apiStatus, mapLoaded } = useGoogleMap2(true, null, debouncedSetCurrentMapCenter, showCreateCatch, null, 4);
  const { autocompleteInputRef, autocompleteRef, loadAutocomplete } = useGoogleAutocomplete(handlePlaceSelect);
  
  // array to store our catch markers as references so we can bind events to them and access them later
  // format: { id: <id of the catch>, marker: <the marker for that catch>}
  const catchMarkersRef = useRef([]);
  // ref for our catch cards so we can select and focus them
  // format: { id: <id of the catch>, ref: <ref for that card>}
  const catchCardRefs = useRef({});
  const markerClusterRef = useRef(null);
  const clusterMarkers = true;
  // state to show and hide our filter dropdown menu
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  // an array for our species list, this will get populated from the useEffect when the catch data loads from server
  const [speciesList, setSpeciesList] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [filteredCatches, setFilteredCatches] = useState([]);

  // state property that tracks map center via callback passed as props to our map component
  // value will be passed as prop to create catch form
  const [currentMapCenter, setCurrentMapCenter] = useState(center);
  
  // our query
  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { userId: user.id },
    //  fetchPolicy: 'cache-and-network'
    // fetchPolicy: 'cache-only'
    // onCompleted: ({ getCatches }) => {
    //   setFilteredCatches(getCatches);
    // }
  });


  // once the api script is loaded load the map
  useEffect(() => {
    // console.log('map loading useEffect triggered')
    if (!mapLoaded && apiStatus.complete) {
      // console.log('map loading useEffect executed')
      loadMap();
      loadAutocomplete();
    }
  }, [mapLoaded, apiStatus.complete, loadAutocomplete, loadMap]);


  // useEffect for when we get data from query. This will trigger on initial data, and when we add a catch and the query updates
  useEffect(() => {
    console.log('useeffect to handle new query data triggered, but not executed')
    if (userCatchesData && mapLoaded) { // don't trigger until map is loaded and we have query data
      console.log('useeffect to handle new query data executed')
      console.log(userCatchesData)
      // reset filter options
      setFilters(defaultFilters);
      console.log('filters set')
      // populate species list in state to generate species filter options
      const speciesList = createSpeciesList(userCatchesData.getCatches);
      setSpeciesList(speciesList);
      console.log('species list set')
      // set our filtered catches state value to the new data set
      setFilteredCatches(userCatchesData.getCatches);
      console.log('filtered catches set')
      // create new catch card refs
      createCatchCardRefs(userCatchesData.getCatches, catchCardRefs);
      console.log('catch card refs created')
      // generate new markers
      createMarkers(userCatchesData.getCatches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, true, setHighlightedCatch)
      console.log('markers generated')
    }
  }, [userCatchesData, mapLoaded, setFilteredCatches, setSpeciesList, catchCardRefs, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch]);

  // add listener to close info windows 
  useEffect(() => {
    console.log('add map listeners triggered')
    if(mapLoaded) {
      console.log('add map listeners executed')
      // window.google.maps.event.clearListeners(mapRef.current, 'click');
      mapRef.current.addListener('click', e => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // unhighlight catch
        setHighlightedCatch(null);
      });
      mapRef.current.addListener('zoom_changed', e => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // unhighlight catch
        setHighlightedCatch(null);
      });
    }
  }, [mapLoaded, mapRef, infoWindowRef, setHighlightedCatch]);


  // useEffect to scroll to the highlighted catch when it gets updated from marker click and display images in bottom bar if any
  useEffect(() => {
    console.log('highlightedcatch updates useEffect')
    if (highlightedCatch && Object.keys(catchCardRefs.current).length > 0) {
      // scroll to the highlighted catch
      const card = catchCardRefs.current[highlightedCatch].current;
      if (card) {
        card.scrollIntoView();
      }
      // console.log(card);
    }
  }, [highlightedCatch, catchCardRefs])

  // pass as a callback to our useGoogleAutocomplete hook to be run on place select
  function handlePlaceSelect() {
    console.log('place select callback')
    // get the place the user selected
    const place = autocompleteRef.current.getPlace();
    console.log(place);
    if (place.geometry && place.geometry.location) {
      // const { lat, lng } = place.geometry.location;
      // center our map on selected place
      mapRef.current.setCenter(place.geometry.location);
      mapRef.current.setZoom(9);
    } else {
      // no place returned, see if the input is in decimal degrees
      const coordinates = { lat: null, lng: null };
      // remove all spaces and split at comma
      let splitString = place.name.replace(/ /g, '').split(',');
      if (splitString.length === 2) {
        // check if potential lat and lng are both numbers within a valid lat and lng range
        if (typeof Number.parseFloat(splitString[0]) === 'number' && Math.abs(Number.parseFloat(splitString[0])) <= 90 ) {
          coordinates.lat = Number.parseFloat(splitString[0]);
        }
        if (typeof Number.parseFloat(splitString[1]) === 'number' && Math.abs(Number.parseFloat(splitString[1])) <= 180 ) {
          coordinates.lng = Number.parseFloat(splitString[1]);
        }
      }
      // 44.3863863,shskhp   poop
      if (coordinates.lat && coordinates.lng) {
        mapRef.current.setCenter(coordinates);
        mapRef.current.setZoom(10);
      } else {
        // display info window for invalid location
        const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'
        const infoJSX = `
          <div style='width: 400px'>
            <div style='${infoDivStyle}'><b>${place.name} not found</b></div>
            <div style='${infoDivStyle}'>Please select a suggested place from the dropdown</div>
            <div style='${infoDivStyle}'>Or enter gps coordinates in the coodinates field</div>                 
          </div>`;
        showInfoWindowInCenter(infoJSX, mapRef, infoWindowRef);
      }
    }
  }

  // handler for when user clicks a catch card
  const handleCatchCardClick = (e, catchId) => {
    // e.preventDefault(); 
    // update state for highlighted catch
    setHighlightedCatch(catchId)
    // console.log(catchId);
    const marker = catchMarkersRef.current.find(marker => marker.catchId === catchId);
    if (marker) {
      mapRef.current.setZoom(13);
      window.google.maps.event.trigger( marker, 'click' );
    }
  };

  const closeFilterMenu = () => {
    console.log('close click handler')
    setShowFilterMenu(false);
    document.removeEventListener('click', closeFilterMenu);
  };

  // toggle show and hide for dropdown menu
  const toggleDropdown = e => {
    // stop the event from propagating or it will immediately trigger our document clickhandler and keep itself closed
    e.stopPropagation();
    e.preventDefault();
    if (showFilterMenu === false) {
      setShowFilterMenu(() => true);
      document.addEventListener('click', closeFilterMenu);
    } else {
      closeFilterMenu();
    }
  }

  // update our filters object when the user clicks a filter
  const handleFilterClick = (e, property) => {
    // property is passed as an argument to the onClick handler from the filter button component
    // clear all filters 
    if (property === 'clear') {
      return setFilters({...defaultFilters, apply: true});
    }
    const valueToFilter = e.target.name;
    // handle species filters
    if (property === 'species') {
      // prevent a species filter click from closing the dropdown so the user can select multiple species
      e.stopPropagation();
      if (filters.species.indexOf(valueToFilter) > -1) {
        // species already being filtered, toggle it off
        console.log('found')
        let newSpeciesArray = filters.species.slice();
        console.log(filters.species.indexOf(valueToFilter))
        newSpeciesArray.splice(filters.species.indexOf(valueToFilter), 1);
        setFilters(prevFilters => ( { ...prevFilters, apply: true, species: newSpeciesArray} ));
      } else {
        setFilters(prevFilters => ({ ...prevFilters, apply: true, species: [...prevFilters.species, valueToFilter]}));
      }
    }
    if (property === 'catchDate') {
      // dont change filters if we click the same date so we dont refilter the data for no reason
      if (filters.catchDate !== e.target.name ){
        setFilters(prevFilters => ({ ...prevFilters, apply: true, catchDate: e.target.name }))
      }
    }
  }

  // useEffect to handle filtering catches when filters change
  useEffect(() => {
    console.log('filtering useeffect triggered');
    // check that apply is true to prevent running before user sets a filters
    if (filters.apply) {
      console.log('applying filters')
      let filteredData = [];
      // SPECIES FILTERS
      if (filters.species.length > 0) {
        console.log('applying species filters')
        userCatchesData.getCatches.forEach(catchObj => {
          // each catch against the species filter array and push species that match into the filtered data array
          if (filters.species.indexOf(catchObj.species) >-1) {
            filteredData.push(catchObj);
          }
        });
      } else {
        // no species filters, so pass all catch data onto the next set of filters
        filteredData = [...userCatchesData.getCatches];
      }
      // DATE FILTERS
      if (filters.catchDate === 'TODAY'){
        const now = new Date();
        filteredData = filteredData.filter(catchObj => {
          const catchDate = new Date(catchObj.catchDate);
          return (catchDate.getDate() === now.getDate() && catchDate.getMonth() === now.getMonth() && catchDate.getFullYear() === now.getFullYear());
        }); 
      }
      if (filters.catchDate === 'WEEK') {
        const now = DateTime.now();
        filteredData = filteredData.filter(catchObj => {
          const catchDate = DateTime.fromMillis(Date.parse(catchObj.catchDate));
          return (Interval.fromDateTimes(catchDate, now).toDuration('days').toObject().days <= 7);
        });
      }
      if (filters.catchDate === 'MONTH') {
        const now = DateTime.now();
        filteredData = filteredData.filter(catchObj => {
          const catchDate = DateTime.fromMillis(Date.parse(catchObj.catchDate));
          return (Interval.fromDateTimes(catchDate, now).toDuration('months').toObject().months <= 1);
        });
      }
      if (filters.catchDate === 'YEAR') {
        const now = DateTime.now();
        filteredData = filteredData.filter(catchObj => {
          const catchDate = DateTime.fromMillis(Date.parse(catchObj.catchDate));
          return (Interval.fromDateTimes(catchDate, now).toDuration('years').toObject().years <= 1);
        });
      }
      // set our default property so we know whether to activate the clear filters button, and set apply to false so we don't trigger refilter
      if (filters.species.length === 0 && filters.catchDate === 'ALL'){
        console.log('default')
        setFilters(prevFilters => ({ ...prevFilters, isDefault: true, apply: false }))
      } else {
        console.log('not default')
        setFilters(prevFilters => ({ ...prevFilters, isDefault: false, apply: false }))
      }
      // update our filtered catches state
      setFilteredCatches(() => filteredData);
      // TESTING, also added all dependencies after mapref
      console.log(filteredData);
      createMarkers(filteredData, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, clusterMarkers, setHighlightedCatch);
    }    
  }, [filters, setFilteredCatches, setFilters, userCatchesData, catchMarkersRef, mapRef, infoWindowRef, clusterMarkers, markerClusterRef, setHighlightedCatch ]);

  // toggle form, argument defaults to true, but when we toggle on successful catch log, we don't want to generate markers since new ones will be generated from the query update useffect
  const handleFormToggle = (generateMarkersFromFilteredData = true) => {
    // toggle form on
    if (!showCreateCatch) {
      // toggle off all markers
      console.log('deleting all markers')
      catchMarkersRef.current.forEach(markerRef => markerRef.setMap(null));
      catchMarkersRef.current = [];
      // toggle off clusters
      if (markerClusterRef.current) {
        markerClusterRef.current.clearMarkers();
      }
      // show instructions info window
      const infoDivStyle = 'padding-bottom: 10px; font-size: 18px;'
      const infoJSX = `
        <div style='width: 400px'>
          <div style='${infoDivStyle}'><b>How to use the map to log a catch</b></div>
          <div style='font-size: 16px;'>There are several ways to select your catch position:</div>
            <ul style='font-size: 16px; margin: 0px'>
              <li style='padding-top: 5px;'>Manually drag the map to positon your catch</li>                   
              <li style='padding-top: 5px;'>Use the search bar to find a location (e.g. "San Clemente Pier")</li>      
              <li style='padding-top: 5px;'>Use the search bar to enter GPS coordinates in decimal degrees (e.g. "33.419095, -117.62117") </li>
            </ul>                
        </div>`;
      showInfoWindowInCenter(infoJSX, mapRef, infoWindowRef);
      // add a single use listener to clear the instructions window when bounds change
      window.google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => infoWindowRef.current ? infoWindowRef.current.close() : null);
      } else {
        // events to run when form toggles off
        // clear selected image data that gets passed back to our form for the controlled value
        setDisplayImageData([]);
        // google autocomplete widget leaves a 1px tall div on top of map even when you hide the input, this will remove it
        const container = document.getElementsByClassName('pac-container');
        if (container) {
          for (let i = 0; i < container.length; i++) {
            container[i].remove();
          }
        }
        autocompleteInputRef.current.value = null;
        // // clear all catch card refs to force a remap
        // catchCardRefs.current = {};
        if (generateMarkersFromFilteredData) {
          createMarkers(filteredCatches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, clusterMarkers, setHighlightedCatch);
        }
      }
    setShowCreateCatch(prevValue => !prevValue);
  };

  // pass to the form to run in update function after successful mutation
  const successfulCatchLogCallback = (catchObj) => {
    // toggle off create catch form without generating new markers since this will be automatically done from the query update useeffect
    handleFormToggle(false);

    showCustomModal(<ModalCreateCatchSuccess species={catchObj.species} />);
    setTimeout(() => closeModal(), 3000);
  }

  // callback passed to our form that gets file list for image upload selections
  const handleFileSelect = async images => {
    // function to take file list and return array of dataURLs to display as preview and send data to server
    async function generateFileDataArray(fileList) {
      const readFile = file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      };
      const previewData = [];
      fileList.forEach(file => {
        try {
          let fileData = readFile(file);
          previewData.push(fileData);
        } catch (err) {
          console.log(err);
        }
      })
      const data = await Promise.all(previewData).then(values => values);
      console.log(data);
      return data;
    };

    // convert to an array of image data and update the state used to display previews and pass back to our form for the controlled image data value
    const fileData = await generateFileDataArray(images);    
    setDisplayImageData(fileData);
  }

  const renderFilterMenu = () => {
    return (
      <div className='dropdown-menu'>
      <button onClick={toggleDropdown}>
        <span>Filters</span> 
        <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle down'/></button>
      <ul style={{display: showFilterMenu ? 'block' : 'none'}}>
        <li>
          <button style={filters.isDefault ? {backgroundColor: 'white'} : {}} disabled={filters.isDefault} onClick={(e) => handleFilterClick(e, 'clear')} className='species-button'>
            {filters.isDefault ? 'Select filters' : 'Clear Filters'}
          </button>                    
        </li>
        <hr style={{margin: 0}} />
        {speciesList.length > 0 &&  
          <li style={{position: 'relative'}}>
            <span>Species</span>
            <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle right'/>
            <ul className='species-list' style={{position: 'absolute', top: 0, left: '100%'}}>
              {/* SPECIES FILTER BUTTONS */}
                <li>
                {filters.species.length > 0 ?
                  <button onClick={e => handleFilterClick(e, 'clear')} className='species-button'>
                    Clear species filters
                  </button>
                  :
                  <button className='species-button' style={{backgroundColor: 'white'}}>Select species</button>
                }
                </li>
              <hr style={{margin: 0, padding: 0}} />
              {speciesList.map(species => 
                <li key={species}>
                  <button onClick={e => handleFilterClick(e, 'species')} name={species} className='species-button'>
                    {species}
                    <Icon style={{display: filters.species.indexOf(species) > -1 ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                  </button>
                </li>
              )
              }
            </ul>
          </li>
        }
        <li style={{position: 'relative'}}>
          <span>Catch date</span>
          <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle right'/>
          <ul className='catch-date' style={{position: 'absolute', top: 0, left: '100%', minWidth: 175}}>
              <li>
                <button onClick={e => handleFilterClick(e, 'catchDate')} name='ALL' className='species-button'>
                  All dates
                  <Icon style={{display: filters.catchDate === 'ALL' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                </button>
              </li>
              <li>
                <button onClick={e => handleFilterClick(e, 'catchDate')} name='TODAY' className='species-button'>
                    Today
                    <Icon style={{display: filters.catchDate === 'TODAY' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                </button>
              </li>
              <li>
                <button onClick={e => handleFilterClick(e, 'catchDate')} name='WEEK' className='species-button'>
                    Past week
                    <Icon style={{display: filters.catchDate === 'WEEK' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                </button>
              </li>
              <li>
                <button onClick={e => handleFilterClick(e, 'catchDate')} name='MONTH' className='species-button'>
                    Past month
                    <Icon style={{display: filters.catchDate === 'MONTH' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                </button>
              </li>                    
              <li>
                <button onClick={e => handleFilterClick(e, 'catchDate')} name='YEAR' className='species-button'>
                    Past Year
                    <Icon style={{display: filters.catchDate === 'YEAR' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                </button>
              </li>       
          </ul>
        </li>
      </ul>
  </div>  
    );
  };

  const renderCards = () => {
    if (loadingUserCatches || !userCatchesData) {
      return (
        <div>
          <LoaderFish />
          <div style={{fontSize: 16, fontWeight: 'bold'}}>Loading catches</div>
        </div>
      );
    }

    return  filteredCatches.length > 0
        ? filteredCatches.map(thisCatch => 
          (<div key={thisCatch.id} ref={catchCardRefs.current[thisCatch.id]}>
            <CatchCard
              style={{margin: '10px 0px'}}
              hideMenu={true} 
              onClick={e => handleCatchCardClick(e, thisCatch.id)} 
              highlight={highlightedCatch===thisCatch.id}
              catch={thisCatch} 
            />
          </div>))
        : <span style={{fontSize: 16}}>No results with current filters</span>
  };


  return (
    <div style={{height: '100%', width: '100%', overflowY: 'auto'}}>
      <div style={{display: 'flex', width: '100%', minHeight: 620, height: 'calc(100% - 200px)', flexGrow: 1, paddingRight: 10}}>
        {/* MAP */}
        <div style={{position: 'relative', height: '100%', width: '100%' }} >
          <div id='map' ref={mapContainerRef} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
          </div>
          {(apiStatus.loading || loadingUserCatches || userCatchesError) && (
              <div style={{zIndex: 100, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                {(apiStatus.loading || loadingUserCatches) && <LoaderFish />}
                {apiStatus.loading && <div style={{fontSize: 16, fontWeight: 'bold', zIndex: 100}}>Loading Map...</div>}
                {loadingUserCatches && <div style={{fontSize: 16, fontWeight: 'bold', zIndex: 100}}>Loading Catches...</div>}
                {userCatchesError && <div style={{fontSize: 16, fontWeight: 'bold',  zIndex: 100}}>Sorry, failed to load catch data from server. Please try again later...</div>}
              </div>
            )}
          
          {mapLoaded && userCatchesData &&
            <button 
              onClick={handleFormToggle} 
              className='custom-map-control-button log-catch-map-button'
            >
              {showCreateCatch ? 'Cancel Log' : 'Log A Catch'}
            </button>
          }
          {/*AUTOCOMPLETE INPUT (only show when create catch form is shown) */}
            <input 
              ref={autocompleteInputRef} type='text' 
              placeholder='Search for a place to center map'
              style={{
                position: 'absolute',
                top: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                display: showCreateCatch ? '' : 'none',
                width: 300,
                height: 35, 
                margin: 0,
                borderRadius: 5,
                zIndex: 100
              }}
            />
        </div>
        
        {/* RIGHT SIDE WITH CATCH CARDS AND FILTER OPTIONS */}
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {/* CONTAINER FOR FILTER MENU*/}
          <div style={{paddingLeft: 10, display: 'flex'}}>
            {!showCreateCatch && filteredCatches && speciesList &&
              renderFilterMenu()
            }
          </div>
          {/* CONTAINER FOR CATCH CARDS*/}
          <div style={{padding: '0px 10px', marginTop: 20, width: 400, height: '100%', overflowY: 'auto'}}>
            {
              showCreateCatch 
                ? <CreateCatchForm imageData={displayImageData} handleFileSelect={handleFileSelect} onSuccessCallback={successfulCatchLogCallback} catchLocation={currentMapCenter} style={{ paddingTop: 10, paddingBottom: 10}} />
                : renderCards()
            }
          </div>
        </div>
      </div>

      <div style={{display: 'flex', width: '100%'}}>
      <div style={{height: 200, width: 100, flexGrow: 1, overflowY: 'hidden', overflowX: 'scoll', whiteSpace: 'nowrap', }}>
        {showCreateCatch && displayImageData.map((image, index) => <img key={index} src={image} alt='your catch' style={{maxHeight: 200, width: 'auto', display: 'inline-block'}} /> )}
      </div>
      </div>


      </div>
  );
};


export default UserCatchesMap;



/*

            <div style={{height: 300, width: '100%', overflowY: 'hidden', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>
              DFSFD
            </div>

*/