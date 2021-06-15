import React, { useContext, useEffect, useState, useRef, createRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import { DateTime } from 'luxon';
import { AuthContext } from '../context/auth';
import { useQuery } from '@apollo/client';
import { GET_CATCHES } from '../gql/gql';
import { Icon } from 'semantic-ui-react';
import CatchCard from '../components/CatchCard';
import GoogleMap from '../components/GoogleMap';
import useGeolocation from '../utilities/useGeolocation';
import '../App.css';
import { isNonEmptyArray } from '@apollo/client/utilities';

  // create custom control elements to send to our map
  // create a custom button for our map to get location
  const getCurrentLocationButton = document.createElement('button');
  getCurrentLocationButton.classList.add("custom-map-control-button");
  getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';
  

const UserCatchesMap = props => {
  
  const { user } = useContext(AuthContext);

  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { catchesToReturn: 100, userId: user.id },
    fetchPolicy: 'cache-and-network'
  });
  
  // if (userCatchesData && !useRef.current) {
  //   console.log(userCatchesData);
  // }
  
  const [highlightedCatch, setHighlightedCatch] = useState(null);
  
  
  // get our geolocation hook
  const { getPosition, geolocationStatus } = useGeolocation();

  // refs for map elements
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  // array to store our catch markers as references so we can bind events to them and access them later
  // format: { id: <id of the catch>, marker: <the marker for that catch>}
  const catchMarkersRef = useRef([]);

  // ref for our catch cards so we can select and focus them
  // format: { id: <id of the catch>, ref: <ref for that card>}
  const catchCardRefs = useRef({});
  
  // state to show and hide our filter dropdown menu
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // an array for our species list, this will get populated from the useEffect when the catch data loads from server
  const [speciesList, setSpeciesList] = useState([]);

  // state to hold selected filters
  const [filters, setFilters] = useState({ species: [] });
  const [filteredCatches, setFilteredCatches] = useState([]);


  // useEffect for when we get catch data from server
  useEffect(() => {

    if (userCatchesData) {
      // create refs for our catch cards the first time we get the data
      if (Object.keys(catchCardRefs.current).length === 0) {
        console.log('creating refs');
        userCatchesData.getCatches.map(thisCatch => catchCardRefs.current[thisCatch.id] = createRef());
      }
      // populate our species list if we haven't already
      if (speciesList.length === 0 && userCatchesData.getCatches.length > 0){
        const species = [];
        // create list of unique species from catch cards
        userCatchesData.getCatches.forEach(catchObj => {
          if (species.indexOf(catchObj.species) < 0) {
            species.push(catchObj.species);
          }
        });
        setSpeciesList(species);
      }
      // initialize our filteredCatches to the catches
      setFilteredCatches(userCatchesData.getCatches);
    }
  }, [userCatchesData, catchCardRefs, speciesList, setFilteredCatches])


  // useEffect to scroll to the highlighted catch when it gets updated from marker click
  useEffect(() => {
    if (highlightedCatch) {
      console.log('useeffect for updated highlight')
      // scroll to the highlighted catch
      const card = catchCardRefs.current[highlightedCatch].current;
      if (card) {
        card.scrollIntoView();
        console.log(card);
      }
      // console.log(card);
    }
  }, [highlightedCatch])

 
    // array to hold controls that will be added on mount
    const controls = [];
    // create a controls array to pass to the GoogleMap component
    controls.push({ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] });
  
    // state to check when loader is loaded so we know when to render our map and autocomplete components
    const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
    // pass this as a prop to our--initial value is default center, and the map center will always auto update if we set coords here
    const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 });
    
  
    
      useEffect(() => {
      // wait until there's catch data before loading the map
      if (filteredCatches.length > 0 && apiStatus.loading === true) {
        // load script on mount and set status of load accordingly
        const loader = new Loader({
          // apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
          version: "weekly",
          libraries: ["places"],
        });
        
        loader.load()
          .then(() => {
            console.log('API loaded')
            // set our status to loaded so we know when to render dependent components
            setApiStatus({loading: false, errors: null});
            // get our position
            getPosition();
            console.log(filteredCatches);
            // generate markers on the map for our catches
            generateMarkers(filteredCatches);

            // set our map bounds based on the catches
            const bounds = calculateBounds(filteredCatches);
            console.log(bounds);
            if (bounds) {
              mapRef.current.fitBounds(bounds, 50);
            }

          })
          .catch (err => {
            console.log(err);
            setApiStatus({loading: false, errors: err});
          });
      }
    }, [setApiStatus, filteredCatches, getPosition, apiStatus]);
  
  

    // useEffect to monitor our geoloation position when updated from any getPosition() calls
    useEffect(() => {
      console.log('position update detected in useEffect');
      // check if we have a position
      if (geolocationStatus.position) {      
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
    }, [geolocationStatus.position, geolocationStatus.errorMessage, mapRef, infoWindowRef])
  
  
  // add listener to close info windows on map click
  useEffect(() => {
    console.log('adding listener')
    if(mapRef.current) {
      // window.google.maps.event.clearListeners(mapRef.current, 'click');
      mapRef.current.addListener('click', e => {
        console.log('map click event listener')
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // unhighlight catch
        setHighlightedCatch(null);
      });
    }
  }, [mapRef, infoWindowRef]);
    
  

  // handler for the location button click on map
  function handleGetLocationButtonClick(event) {
    getPosition();
  }





  // handler for when user clicks a catch card
  const handleCatchCardClick = (e, catchId) => {
    // e.preventDefault(); 
    // update state for highlighted catch
    setHighlightedCatch(catchId)
    const { marker } = catchMarkersRef.current.find(ref => ref.id === catchId);
    console.log(marker);
    if (marker) {
      window.google.maps.event.trigger( marker, 'click' );
      // open the label for this marker
      // console.log(marker.getLabel())
      // center the map on this catch's marker
      // console.log(marker.getPosition());
      // setCenter(marker.getPosition());
    }

    
  };


  if (userCatchesError) console.log(userCatchesError);

  const refCallback = (e, id) => {
    catchCardRefs.current[id] = e; 
    console.log(e);
  }

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
    console.log(latitudes);
    console.log(longitudes);
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
    


    const calicoURL2='http://localhost:3000/img/icons/Calico-Bass-3840-1920-test.png'
    // const URLSVG = 'http://localhost:3000/img/icons/svg-icon.svg';

    const calicoMarker = {
      url: calicoURL2,
      scaledSize: new window.google.maps.Size(30*1.97642436149, 30),
      // scaledSize: new window.google.maps.Size(40, 20)
    }

    // create markers for all our catches
    if (catches && catches.length > 0) {
      catches.forEach((catchObj, index) => {
        // console.log(catchObj);
        if (catchObj.catchLocation && typeof catchObj.catchLocation === 'object' ) {
          // create a new marker
          const catchMarker = new window.google.maps.Marker({
            position: {lat: catchObj.catchLocation.lat, lng: catchObj.catchLocation.lng},
            map: mapRef.current,
            icon: calicoMarker,
            collisionBehavior: window.google.maps.CollisionBehavior.REQUIRED,
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
            console.log('marker handling click listener')
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
            // open the info window for this marker
            infoWindow.open(mapRef.current, catchMarker);
            // set the ref for this window so we can close it on map click
            infoWindowRef.current = infoWindow;
            //highlight the catch
            setHighlightedCatch(catchObj.id);
            mapRef.current.setCenter(catchMarker.getPosition());
          }); 
          // store the info window as a ref
          catchMarkersRef.current.push({id: catchObj.id, marker: catchMarker});  
        }
        // const markers = catchMarkersRef.current.map(obj => obj.marker);
        // new MarkerClusterer(mapRef.current, markers, {
        //   imagePath:
        //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        // });
      });
    }

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

  const handleFilterClick = (e, property) => {
    e.stopPropagation();
    const valueToFilter = e.target.name;
    console.log(valueToFilter);
    console.log(filters.species.indexOf(valueToFilter))
    // if we only add filters, then we can filter the filtered data
    let filterFromFullDataset = false; 
    // handle species filters
    if (property === 'species') {
      if (filters.species.indexOf(valueToFilter) > -1) {
        // species already being filtered, toggle it off
        console.log('found')
        filterFromFullDataset = true;
        let newSpeciesArray = filters.species.slice();
        console.log(filters.species.indexOf(valueToFilter))
        newSpeciesArray.splice(filters.species.indexOf(valueToFilter), 1);
        setFilters(prevFilters => ( { ...prevFilters, species: newSpeciesArray} ));
      } else {
        setFilters(prevFilters => ({ ...prevFilters, species: [...prevFilters.species, valueToFilter]}));
      }
    }
    console.log(filters);
  }

  return (
    <div className='home-page' style={{padding: 20}}>
      <div style={{display: 'flex', height: '100%', overflow: 'hidden'}}>
        <div >
          {loadingUserCatches && <h1>Loading catch data...</h1>}
          {userCatchesError && <h1>Sorry, failed to load catch data from server. Please try again later...</h1>}
          {filteredCatches && 
            <div style={{display: 'flex'}}>
            <div className='map-container' style={{display: 'flex', flexDirection: 'column', width: 600, height: 600}}>
              <div id='map' ref={mapContainerRef}/>
                {apiStatus.loading && <h1>Loading map</h1>}

              { // display our google API components only if the script has loaded without errors
                (!apiStatus.loading && !apiStatus.errors) && 
                <div>
                  <GoogleMap 
                    mapRef={mapRef} 
                    mapContainer={mapContainerRef} 
                    center={center}
                    zoom={4} 
                    controls={controls}
                  />
                </div>
              }
              {/* <button type='button' onClick={handleTestButtonClick} >test</button> */}
            </div>
          </div>
          }
        </div>
        {/* RIGHT SIDE WITH CATCH CARDS AND FILTER OPTIONS */}
        <div style={{marginLeft: 20, height: 600, display: 'flex', flexDirection: 'column'}}>

          <div style={{padding: '0px 0px 10px 10px', display: 'flex'}}>
            {/* FILTER MENU */}
            <div className='dropdown-menu'>
                <button onClick={toggleDropdown}>
                  <span>Filters</span> 
                  <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle down'/></button>
                <ul style={{display: showFilterMenu ? 'block' : 'none'}}>
                {speciesList.length > 0 &&  
                  <li style={{position: 'relative'}}>
                    <span>Species</span>
                    <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle right'/>
                    <ul className='species-list' style={{position: 'absolute', top: 0, left: '100%'}}>
                      {/* SPECIES FILTER BUTTONS */}
                        <li>
                        {filters.species.length > 0 ?
                          <button onClick={e => {e.stopPropagation(); setFilters(prevFilers => ({ ...prevFilers, species: [] }))}} className='species-button'>
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
                            <Icon style={{display: filters.species.indexOf(species) > -1 ? '' : 'none', marginLeft: 'auto'}} name='check circle outline'/>
                          </button>
                        </li>
                      )
                      }
                    </ul>
                  </li>
                }
                  <li>Catch date</li>
                </ul>
            </div>
            {/* <div className='catch-filter-display' style={{marginLeft: 10, flexGrow: 1}}>{JSON.stringify(filters)}</div> */}
          </div>


          <div style={{padding: '0px 10px', width: 350, minWidth: 250, flexShrink: 1, overflowY: 'scroll'}}>
          { filteredCatches && Object.keys(catchCardRefs.current).length > 0 && filteredCatches.map(thisCatch => 
            (<div ref={catchCardRefs.current[thisCatch.id]}>
              <CatchCard
                style={{margin: '10px 0px'}}
                key={thisCatch.id}
                hideMenu={true} 
                onClick={e => handleCatchCardClick(e, thisCatch.id)} 
                highlight={highlightedCatch===thisCatch.id}
                catch={thisCatch} 
              />
            </div>)
            )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// <CatchFeed user={user} feedCatchesLoading={loadingUserCatches} feedCatchesError={userCatchesError} feedCatchesData={filteredCatches} displayOptions={{showCreateCatch: false}}/>



export default UserCatchesMap;

/*

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