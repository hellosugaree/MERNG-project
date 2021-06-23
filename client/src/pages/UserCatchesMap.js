import React, { useContext, useEffect, useState, useRef, createRef } from 'react';
import { DateTime, Interval } from 'luxon';
import { AuthContext } from '../context/auth';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { useQuery } from '@apollo/client';
import { useGoogleMap } from '../utilities/hooks';
import { GET_CATCHES } from '../gql/gql';
import { Icon } from 'semantic-ui-react';
import CatchCard from '../components/CatchCard';
import GoogleMap from '../components/GoogleMap';
import LoaderFish from '../components/LoaderFish';
import CreateCatchForm from '../components/CreateCatchForm';
// import { useGeolocation } from '../utilities/useGeolocation';
import '../App.css';

  // create custom control elements to send to our map
  // create a custom button for our map to get location
  const getCurrentLocationButton = document.createElement('button');
  getCurrentLocationButton.classList.add("custom-map-control-button");
  getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';
  

  const toggleMarkerClustersButton = document.createElement('button');
  toggleMarkerClustersButton.classList.add("custom-map-control-button");
  toggleMarkerClustersButton.innerHTML=``;

const UserCatchesMap = props => {
  
  const { user } = useContext(AuthContext);
  
  const [highlightedCatch, setHighlightedCatch] = useState(null);
  const [showCreateCatch, setShowCreateCatch] = useState(false);
  
  // get our geolocation hook
  // const { getPosition, geolocationStatus } = useGeolocation();

  const { loadMap, mapContainerRef, mapRef, infoWindowRef, center, basicControls, apiStatus } = useGoogleMap();

  
  // array to store our catch markers as references so we can bind events to them and access them later
  // format: { id: <id of the catch>, marker: <the marker for that catch>}
  const catchMarkersRef = useRef([]);
  // ref for our catch cards so we can select and focus them
  // format: { id: <id of the catch>, ref: <ref for that card>}
  const catchCardRefs = useRef({});
  const markerClusterRef = useRef(null);
  const [clusterMarkers, setClusterMarkers] = useState(true);
  // state to show and hide our filter dropdown menu
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  // an array for our species list, this will get populated from the useEffect when the catch data loads from server
  const [speciesList, setSpeciesList] = useState([]);

  // state to hold selected filters
  const defaultFilters = {apply: false, isDefault: true, species: [], catchDate: 'ALL'};
  const [filters, setFilters] = useState(defaultFilters);
  const [filteredCatches, setFilteredCatches] = useState(null);

  // state property that tracks map center via callback passed as props to our map component
  // value will be passed as prop to create catch form
  const [currentMapCenter, setCurrentMapCenter] = useState(center);



  
  // our query
  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { catchesToReturn: 100, userId: user.id },
    //  fetchPolicy: 'cache-and-network'
    // onCompleted: ({ getCatches }) => setFilteredCatches(getCatches)
  });

  // set filtered catches query loaded
  useEffect(() => {
    if (loadingUserCatches) console.log('loading catches')
    if (userCatchesError) console.log('user catches error')
    if (userCatchesData) {
      console.log(userCatchesData)
      // reset filter options
      setFilters(defaultFilters);
      setHighlightedCatch(null);
      setFilteredCatches(userCatchesData.getCatches);
    }

  }, [loadingUserCatches, userCatchesError, userCatchesData ])


    // once we get once filtered catches is initialized with the original query data, create the species list and catch card refs
    useEffect(() => {
      if (filteredCatches && filteredCatches.length > 0) {
        // create refs for our catch cards the first time we get the data
        if (Object.keys(catchCardRefs.current).length === 0) {
          createCatchCardRefs();
        }
        // populate our species list if we haven't already
        if (speciesList.length === 0 && filteredCatches.length > 0){
          const species = [];
          // create list of unique species from catch cards
          filteredCatches.forEach(catchObj => {
            if (species.indexOf(catchObj.species) < 0) {
              species.push(catchObj.species);
            }
          });
          setSpeciesList(species);
        }
      }
    }, [userCatchesData, catchCardRefs, speciesList, filteredCatches, createCatchCardRefs])  
  



  // useEffect to load map
  useEffect(() => {
    if (apiStatus.loading && !apiStatus.errors) {
      console.log('map loder useEffect triggered in UserCatchesMap')
      loadMap();
    }
  }, [apiStatus]);

  // initialize our markers after map load or after form is toggled off
  useEffect(() => {
    if (!showCreateCatch && !apiStatus.loading && !apiStatus.errors && mapRef.current && filteredCatches && filteredCatches.length > 0 && catchMarkersRef.current.length === 0) {
      generateMarkers(filteredCatches);
      // set our map bounds based on the catches
      const bounds = calculateBounds(filteredCatches);
      if (bounds) {
        mapRef.current.fitBounds(bounds, 50);
      }
    }
  }, [showCreateCatch, apiStatus, mapRef, filteredCatches, catchMarkersRef])



    // add listener to close info windows 
    useEffect(() => {
      if(mapRef.current) {
        console.log('adding map click listener for window close')
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
    }, [mapRef.current, infoWindowRef]);

  // useEffect to scroll to the highlighted catch when it gets updated from marker click
  useEffect(() => {
    if (highlightedCatch && Object.keys(catchCardRefs.current).length > 0) {
      // scroll to the highlighted catch
      const card = catchCardRefs.current[highlightedCatch].current;
      if (card) {
        card.scrollIntoView();
      }
      // console.log(card);
    }
  }, [highlightedCatch, catchCardRefs])





  // handler for when user clicks a catch card
  const handleCatchCardClick = (e, catchId) => {
    // e.preventDefault(); 
    // update state for highlighted catch
    setHighlightedCatch(catchId)
    const { marker } = catchMarkersRef.current.find(ref => ref.id === catchId);
    if (marker) {
      mapRef.current.setZoom(10);
      window.google.maps.event.trigger( marker, 'click' );
    }
  };


  if (userCatchesError) console.log(userCatchesError);


  // calculate our map bounds based on the catch data so we can contain the data within the map
  function calculateBounds(catchData) {
    // map our latitudes
    const latitudes = catchData.map(catchObj => {
      // make sure the catch contains a lat, lng object. This check will prevent errors from data entered befoe this was mandatory
      if (catchObj.catchLocation && catchObj.catchLocation && catchObj.catchLocation.lat && catchObj.catchLocation.lng) {
        return catchObj.catchLocation.lat;
      }
    });
    const longitudes = catchData.map(catchObj => {
      // make sure the catch contains a lat, lng object. This check will prevent errors from data entered befoe this was mandatory
      if (catchObj.catchLocation && catchObj.catchLocation && catchObj.catchLocation.lat && catchObj.catchLocation.lng) {
        return catchObj.catchLocation.lng;
      }
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
  function generateMarkers(catches) {
    // first clear the map of all markers in case we are remapping markers after filtering catches
    if (catchMarkersRef.current.length > 0) {
      catchMarkersRef.current.forEach(marker => marker.setMap(null));
      catchMarkersRef.current = [];
    }
    // close open infoWindow if it exists
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    // clear info window refs
    infoWindowRef.current = null;
    // create markers for all our catches
    if (catches && catches.length > 0) {
      catches.forEach((catchObj, index) => {
        let markerUrl;
        let scaleFactor = [35 * 2, 35];
        // backwards compatibility before locations were required objects
        if (catchObj.catchLocation && typeof catchObj.catchLocation === 'object' ) {
          // select marker based on species
          
          if (catchObj.species.match(/calico|sand bass|spotted bass|sculpin/gi)) {
            // console.log('calico');
            markerUrl='http://localhost:3000/img/small/Calico-Bass-Small.png';
          }
          else if (catchObj.species.match(/rockfish/gi)) {
            // console.log('rockfish');
            markerUrl='http://localhost:3000/img/icons/small/Rockfish-Small.png';
          }          
          else if (catchObj.species.match(/tuna|bonito|yellowfin|yellowtail/gi)) {
            // console.log('tuna|bonito|yellowfin|yellowtail');
            markerUrl='http://localhost:3000/img/icons/small/Yellowfin-Small.png'
          }
          else if (catchObj.species.match(/striper|striped bass|stripper/gi)) {
            // console.log('striper|striped bass|stripper');
            markerUrl = 'http://localhost:3000/img/icons/small/Stiped-Bass-Small.png';
          }
          else if (catchObj.species.match(/shark|leopard|mako|thresher/gi)) {
            // console.log('shark|leopard');
            // markerUrl='http://localhost:3000/img/icons/Leopard-Shark-3840-1920.svg'
            markerUrl = 'http://localhost:3000/img/icons/small/Leopard-Shark-Cropped-Small.png';
            scaleFactor = [30 * 3.4143151476, 30];
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
            // scaledSize: new window.google.maps.Size(...scaleFactor),
            // scaledSize: new window.google.maps.Size(30*1.97642436149, 30),
            // scaledSize: new window.google.maps.Size(40, 20)
          }
          // create a new marker for this catch
          const catchMarker = new window.google.maps.Marker({
            position: {lat: catchObj.catchLocation.lat, lng: catchObj.catchLocation.lng},
            map: mapRef.current,
            icon: catchIcon,
            collisionBehavior: window.google.maps.CollisionBehavior.REQUIRED,
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
          // add a click listener to the info window        
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
            mapRef.current.setCenter(catchMarker.getPosition());
          }); 
          // store the info window as a ref
          catchMarkersRef.current.push({id: catchObj.id, marker: catchMarker});  
        }
        if (clusterMarkers) {
          const markers = catchMarkersRef.current.map(obj => obj.marker);
          generateMarkerClusters(markers);
        }
      });
    }
  }

  function generateMarkerClusters(markers) {
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }
    // const markerStyles = [MarkerClusterer.withDefaultStyle({
    //   // url: "../img/icons/Calico-Bass-3840-1920.png",
    //   url: "../img/markerclusterer/cluster-test-1.png",
    //   // height: 80,
    //   // width: 177,
    //   height: 100,
    //   width: 100,
    //   anchorIcon: [50, 50],
    //   textColor: "#FFFFFF",
    //   textSize: 20,
    //   maxZoom: 10,
    // })];
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
    // check that apply is true to prevent running before user sets a filters
    if (filters.apply) {
      console.log('applying filters')
      let filteredData = [];
      // hide all markers
      catchMarkersRef.current.forEach(markerRef => markerRef.marker.setMap(null));
      // SPECIES FILTERS
      if (filters.species.length > 0) {
        console.log('applying species filters')
        userCatchesData.getCatches.map(catchObj => {
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

      // show the markers for our filtered catches
      filteredData.forEach(catchObj => {
        const { marker } = catchMarkersRef.current.find(ref => ref.id === catchObj.id);
        marker.setMap(mapRef.current);
      })
      // re center our map with bounds based on new markers
      if (filteredData.length > 0) {
        const bounds = calculateBounds(filteredData);
        mapRef.current.fitBounds(bounds, 50);
      }
      setFilteredCatches(() => filteredData);

      // set our default property so we know whether to activate the clear filters button, and set apply to false so we don't trigger refilter
      if (filters.species.length === 0 && filters.catchDate === 'ALL'){
        console.log('default')
        setFilters(prevFilters => ({ ...prevFilters, isDefault: true, apply: false }))
      } else {
        console.log('not default')
        setFilters(prevFilters => ({ ...prevFilters, isDefault: false, apply: false }))
      }
    }

  }, [filters, setFilteredCatches, setFilters, userCatchesData, catchMarkersRef.current]);

  // toggle form
  const handleFormToggle = () => {
    // toggle form on
    if (!showCreateCatch) {
      // toggle off all markers
      if (catchMarkersRef.current && catchMarkersRef.current.length > 0) {
        console.log('deleting all markers')
        catchMarkersRef.current.forEach(markerRef => markerRef.marker.setMap(null));
        catchMarkersRef.current = [];
      }
      // toggle off clusters
      if (markerClusterRef.current) {
        markerClusterRef.current.clearMarkers();
      }
      } else {
      // events to run when form toggles off
      catchCardRefs.current = {};
    }
    setShowCreateCatch(prevValue => !prevValue);
  };

  // callback executed when map center changed, update currentMapCenter state to pass location to create catch form
  const getCenterFromMap = () => {
      setCurrentMapCenter(mapRef.current.getCenter().toJSON());
  };

  function createCatchCardRefs() {
      console.log('creating refs');
      if (filteredCatches.length > 0) {
        filteredCatches.map(thisCatch => {
          console.log('creating individual ref')
          console.log(catchCardRefs.current)
          catchCardRefs.current[thisCatch.id] = createRef()
        });
      }
  }

  // pass to the form to run in update function after successful mutation
  const successfulCatchLogCallback = (catchObj) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }   
    const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'
    const infoJSX = `
      <div style='width: 150px'>
        <div style='${infoDivStyle}'><b>Successfully logged ${catchObj.speies}</b></div>
        <div style='${infoDivStyle}'>Now loading catches...</div>                 
      </div>`;

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoJSX
    });

    infoWindow.setPosition(mapRef.current.getCenter());
    infoWindow.open(mapRef.current);
    infoWindowRef.current = infoWindow;

    setTimeout(() => {
      handleFormToggle();
    }, 3000);
  }

  const handleTestLog = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }   
    const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'
    const infoJSX = `
      <div style='width: 150px'>
        <div style='${infoDivStyle}'><b>Successfully logged poop</b></div>
        <div style='${infoDivStyle}'>Now loading catches...</div>                 
      </div>`;

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoJSX
    });

    infoWindow.setPosition(mapRef.current.getCenter());
    infoWindow.open(mapRef.current);
    infoWindowRef.current = infoWindow;
  };


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
    return filteredCatches && Object.keys(catchCardRefs.current).length > 0 && filteredCatches.length > 0
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
        : <span>No results with current filters</span>
  };


  return (
      <div style={{display: 'flex', height: '100%', paddingRight: 80}}>
            <div className='map-container' style={{position: 'relative'}} >
              <div id='map' ref={mapContainerRef} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {(apiStatus.loading || loadingUserCatches) && (
                  <div>
                    <LoaderFish />
                    {!filteredCatches && <div>Loading Catch Data...</div>}
                    {apiStatus.loading && <div>Loading Catch Map...</div>}
                    {userCatchesError && <div>Sorry, failed to load catch data from server. Please try again later...</div>}
                  </div>
                )}
              </div>
              {(!apiStatus.loading && !apiStatus.errors && filteredCatches) && 
                <div>
                  <GoogleMap 
                    showCenterMarker={showCreateCatch}
                    mapRef={mapRef} 
                    mapContainer={mapContainerRef} 
                    center={center}
                    zoom={4} 
                    controls={basicControls}
                    // callback to be used on center change in the map component so we can pass back the map center to send as props to the create catch form
                    onCenterChangeCallback={getCenterFromMap}
                  />
                </div>
              }
              {(!apiStatus.loading && !apiStatus.errors && filteredCatches) && 
                <button onClick={handleFormToggle} style={{position: 'absolute', height: 40, width: 200, backgroundColor: '#EBEBEB', borderRadius: 5, zIndex: 99999999999999, bottom: 20, left: '40%'}}>
                  Log Catch
                </button>
              }
            </div>
        
        {/* RIGHT SIDE WITH CATCH CARDS AND FILTER OPTIONS */}
        <div style={{height: 800, display: filteredCatches ? 'flex' : 'none', flexDirection: 'column'}}>
          {/* CONTAINER FOR FILTER MENU*/}
          <div style={{paddingLeft: 10, display: 'flex'}}>
            {renderFilterMenu()}
          </div>
          {/* CONTAINER FOR CATCH CARDS*/}
          <div style={{padding: '0px 10px', marginTop: 20, width: 400, overflowY: 'scroll'}}>
            {/* <button onClick={handleTestLog}>test log</button> */}
            {/* <button onClick={handleFormToggle}>toggle form</button> */}
            {
              showCreateCatch 
                ? <CreateCatchForm onSuccessCallback={successfulCatchLogCallback} catchLocation={currentMapCenter} />
                : filteredCatches && Object.keys(catchCardRefs.current).length > 0 && filteredCatches.length > 0 
                ? renderCards() : null
            }
          </div>
        </div>
      </div>

  );
};

// <CatchFeed user={user} feedCatchesLoading={loadingUserCatches} feedCatchesError={userCatchesError} feedCatchesData={filteredCatches} displayOptions={{showCreateCatch: false}}/>



export default UserCatchesMap;

/*


//   const GET_SPECIES = gql`
//   query Catch($species: String!) {
//     Catch(species: $species) {
//       id
//     }
//   }
// `;

  // const { loading: testLoading, error: testError, data: testData } = useQuery(GET_SPECIES, {
  //   variables: { species: 'Striped Bass' },
  //   fetchPolicy: 'cache-and-network'
  // });

  // if (testData) console.log(testData);
  
  // if (userCatchesData && !useRef.current) {
  //   console.log(userCatchesData);
  // }
  

                      <li><button className='species-button'>Yellowtail</button></li>
                      <li><button className='species-button'>Striper</button></li>
                      <li><button className='species-button'>Yellowtail</button></li>
                      <li><button className='species-button'>Tuna</button></li>
                      <li><button className='species-button'>Mako</button></li>
                      <li><button className='species-button'>Halibut</button></li>
                      <li><button className='species-button'>Calico</button></li>
                      <li><button className='species-button'>Salmon</button></li>
                      <li><button className='species-button'>Bluefin tuna</button></li>
                      <li><button className='species-button'>Striper</button></li>

              <div className='dropdown-field'>
                <div className='dropdown-field-label'>Filters</div>
                <div className='dropdown-subfield'>
                    <div className='dropdown-field-label'>Species</div>
                    <div className='dropdown-subfield open-right species-scroll'>
                      <div>
                        Shark 
                      </div>
                      <div>
                        Ray
                      </div>
                    </div>
                </div>
              </div>


          <Menu attached='top'>
            <Dropdown item icon='wrench'>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Icon name='dropdown' />
                  <span className='text'>Species</span>
                  {userCatchesData && (
                  <Dropdown.Menu  >
                    {userCatchesData.getCatches.map(catchObj => 
                      <Dropdown.Item key={catchObj.id}>{catchObj.species}</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                  )}
                </Dropdown.Item>
                <Dropdown.Item>Open</Dropdown.Item>
                <Dropdown.Item>Save...</Dropdown.Item>
                <Dropdown.Item>Edit Permissions</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Export</Dropdown.Header>
                <Dropdown.Item>Share</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu>



      <button className='dropdown-button' onClick={toggleDropdown} >
              Filters
            </button>

            <div style={{display: showFilterMenu ? '' : 'none', width: 200, height: 100, position: 'absolute', backgroundColor: 'grey', zIndex: 100}}>
              <div>
                Species
              </div>
            </div>










          {userCatchesData && Object.keys(catchCardRefs.current).length > 0 &&
            userCatchesData.getCatches.map((thisCatch, index) => {
              // add a property for this card to our refs object
              // { id: thisCatch.id, ref: element }

              return (<CatchCard
                ref={catchCardRefs.current[thisCatch.id]}
                key={thisCatch.id}
                hideMenu={true} 
                onClick={e => handleCatchCardClick(e, thisCatch.id)} 
                highlight={highlightedCatch===thisCatch.id}
                catch={thisCatch} 
              />);              
            }
            )            
          }


          */

            // // once filteredCatches is initialized with whole dataset, load the map and generate the catch cards and inital marker set 
  // useEffect(() => {
  //   // wait until there's catch data before loading the map
  //   if (!window.google && filteredCatches && filteredCatches.length > 0 && apiStatus.loading === true) {
  //     console.log('loading API');
  //     // load script on mount and set status of load accordingly
  //     const loader = new Loader({
  //       // apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
  //       version: "weekly",
  //       libraries: ["places"],
  //     });
      
  //     loader.load()
  //       .then(() => {
  //         console.log('API loaded')
  //         // set our status to loaded so we know when to render dependent components
  //         setApiStatus({loading: false, errors: null});
  //         // get our position
  //         getPosition();
  //         // generate markers on the map for our catches
  //         generateMarkers(filteredCatches);
  //         // set our map bounds based on the catches
  //         const bounds = calculateBounds(filteredCatches);
  //         if (bounds) {
  //           mapRef.current.fitBounds(bounds, 50);
  //         }

  //       })
  //       .catch (err => {
  //         console.log(err);
  //         setApiStatus({loading: false, errors: err});
  //       });
  //   }
  // }, [setApiStatus, filteredCatches, getPosition, apiStatus]);
    

    // // array to hold controls that will be added on mount
  // const controls = [];
  // // create a controls array to pass to the GoogleMap component
  // controls.push({ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] });

  // // state to check when loader is loaded so we know when to render our map and autocomplete components
  // const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
  // // pass this as a prop to our--initial value is default center, and the map center will always auto update if we set coords here
  // const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 }); 

    // // useEffect to monitor our geoloation position when updated from any getPosition() calls and center the map to position
  // useEffect(() => {
  //   console.log('position update detected in useEffect');
  //   // check if we have a position
  //   if (geolocationStatus.position) { 
  //     console.log(geolocationStatus.position)     
  //     mapRef.current.setCenter(geolocationStatus.position);      
  //   }
  //   if (geolocationStatus.errorMessage) {
  //     console.log('processing geolocation errors')
  //     if (infoWindowRef.current) {
  //       infoWindowRef.current.close();
  //     }
  //     infoWindowRef.current = new window.google.maps.InfoWindow({
  //       content: `<div id="content">
  //       <div><b>Location error</b></div><br/>
  //         <div>${geolocationStatus.errorMessage}</div>
  //         </div>`,
  //     });
  //     infoWindowRef.current.setPosition(mapRef.current.getCenter());
  //     infoWindowRef.current.open(mapRef.current);
  //   }
  // }, [geolocationStatus.position, geolocationStatus.errorMessage, mapRef, infoWindowRef, setCenter])

  


  // // handler for the location button click on map
  // function handleGetLocationButtonClick(event) {
  //   getPosition();
  // }
