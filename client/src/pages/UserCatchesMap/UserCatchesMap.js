import React, { useContext, useEffect, useState, useRef, useMemo, } from 'react';
import { AuthContext } from '../../context/auth';
import { ModalContext } from '../../context/modal';
import { useQuery } from '@apollo/client';
import { Button } from 'semantic-ui-react';
import { useGoogleAutocomplete, useGoogleMap2 } from '../../utilities/hooks';
import { GET_CATCHES } from '../../gql/gql';
import CatchCard from '../../components/CatchCard';
import MapStatus from './MapStatus';
import LoaderFish from '../../components/LoaderFish';
import Filters from './Filters';
import CreateCatchForm from '../../components/CreateCatchForm';
import ModalCreateCatchSuccess from '../../components/ModalCreateCatchSuccess';
import { generateFileDataArray, createMarkers, createCatchCardRefs, createSpeciesList, applyFilters } from './helpers';
import '../../App.css';
import './UserCatchesMap.css';

// state to hold selected filters
const defaultFilters = {apply: false, isDefault: true, species: [], catchDate: 'ALL'};
const defaultFormStatus = { initiated: false, showLogCatch: false, showAcceptLocation: false, showForm: false };

const UserCatchesMap = () => {

  const { user } = useContext(AuthContext);
  const { showCustomModal, closeModal } = useContext(ModalContext);

  const [highlightedCatch, setHighlightedCatch] = useState(null);
  const [formStatus, setFormStatus] = useState(defaultFormStatus);
  // state to hold image data for 
  const [displayImageData, setDisplayImageData] = useState([]);

  const { 
    loadMap, 
    showInfoWindowInCenter, 
    mapContainerRef,
    markerClusterRef, 
    mapRef, 
    infoWindowRef, 
    apiStatus, 
    mapLoaded 
  } = useGoogleMap2({ showBasicControls: true, showCenterMarker: formStatus.showAcceptLocation, defaultZoom: 4 });
  
  const { 
    autocompleteInputRef, 
    loadAutocomplete, 
    getCoordinatesFromAutocomplete 
  } = useGoogleAutocomplete(handlePlaceSelect);
  
  // array to store our catch markers as references so we can bind events to them and access them later, format: { id: <id of the catch>, marker: <the marker for that catch>}
  const catchMarkersRef = useRef([]);
  // ref for our catch cards so we can select and focus them, format: { id: <id of the catch>, ref: <ref for that card>}
  const catchCardRefs = useRef({});
  // an array for our species list, this will get populated from the useEffect when the catch data loads from server
  const [speciesList, setSpeciesList] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { userId: user.id },
  });

  const filteredCatches = useMemo(() => {
    if (!userCatchesData) {
      return null;
    }
    return applyFilters(userCatchesData.getCatches, filters);
  }, [userCatchesData, filters])
  
  // create markers on filtered catches change
  useEffect(() => {
    if (filteredCatches && mapLoaded) {
      console.log('creating markers')
      createMarkers(filteredCatches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch);
    }
  }, [filteredCatches, mapLoaded, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch]);


  // once the api script is loaded load the map
  useEffect(() => {
    if (!mapLoaded && apiStatus.complete) {
      loadMap();
      loadAutocomplete();
    }
  }, [mapLoaded, apiStatus.complete, loadAutocomplete, loadMap]);


  // useEffect for when we get data from query. This will trigger on initial data, and when we add a catch and the query updates
  useEffect(() => {
    if (userCatchesData && mapLoaded) { // don't trigger until map is loaded and we have query data
      // reset filter options
      setFilters(defaultFilters);
      // populate species list in state to generate species filter options
      const speciesList = createSpeciesList(userCatchesData.getCatches);
      setSpeciesList(speciesList);
      createCatchCardRefs(userCatchesData.getCatches, catchCardRefs);
    }
  }, [userCatchesData, mapLoaded, setSpeciesList, catchCardRefs, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch]);

  // add listener to close info windows 
  useEffect(() => {
    if(mapLoaded) {
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
    if (highlightedCatch && Object.keys(catchCardRefs.current).length > 0) {
      // scroll to the highlighted catch
      const card = catchCardRefs.current[highlightedCatch].current;
      if (card) {
        card.scrollIntoView();
      }
    }
  }, [highlightedCatch, catchCardRefs])


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


  // toggle form, argument defaults to true, but when we toggle on successful catch log, we don't want to generate markers since new ones will be generated from the query update useffect
  const handleLogCatchClick = () => {
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }
    setFormStatus(prevStatus => ({ ...prevStatus, initiated: true, showAcceptLocation: true }));
  };

  const handleAcceptLocation = () => {
    setFormStatus(prevStatus => ({ ...prevStatus, showAcceptLocation: false ,showCreateCatch: true }));
  };

  const handleCloseForm = () => {
    if (filteredCatches) {
      createMarkers(filteredCatches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch);
    }
    setFormStatus(defaultFormStatus);
  };

  const handleLocationInputClick = () => {
    setFormStatus(prevStatus => ({ ...prevStatus, showAcceptLocation: true ,showCreateCatch: false }));
  };

  // pass to the form to run in update function after successful mutation
  const successfulCatchLogCallback = (catchObj) => {
    // toggle off create catch form without generating new markers since this will be automatically done from the query update useeffect
    setFormStatus({ defaultFormStatus });
    showCustomModal(<ModalCreateCatchSuccess species={catchObj.species} />);
    setTimeout(() => closeModal(), 3000);
  }

  // callback passed to our form that gets file list for image upload selections
  const handleFileSelect = async images => {
    // convert to an array of image data and update the state used to display previews and pass back to our form for the controlled image data value
    const fileData = await generateFileDataArray(images);    
    setDisplayImageData(fileData);
  }

  
  function handlePlaceSelect() {
    // get the place the user selected
    const coordinates = getCoordinatesFromAutocomplete();
    if (coordinates) {
      // center our map on selected place
      mapRef.current.setCenter(coordinates);
      mapRef.current.setZoom(9);
    } else {
      // display info window for invalid location
      const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'
      const infoJSX = `
        <div style='width: 400px'>
          <div style='${infoDivStyle}'><b>Not found</b></div>
          <div style='${infoDivStyle}'>Please select a suggested place from the dropdown</div>
          <div style='${infoDivStyle}'>Or enter gps coordinates in the coodinates field</div>                 
        </div>`;
      showInfoWindowInCenter(infoJSX, mapRef, infoWindowRef);
    }
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
    <div className='fit' style={{overflowY: 'auto'}}>
      <div className='flex fit'>
        {/* MAP */}
        <div className='map-container' >
          <div id='map' ref={mapContainerRef} >
          </div>
          <MapStatus apiStatus={apiStatus} loadingUserCatches={loadingUserCatches} userCatchesError={userCatchesError} />
          
          <div className='filters-and-autocomplete-container'>
            <div className='filter-menu flex' >
              {!formStatus.initiated && filteredCatches && speciesList &&
                <Filters 
                  speciesList={speciesList} 
                  filters={filters} 
                  defaultFilters={defaultFilters} 
                  setFilters={setFilters} 
                />
              }
            </div>
            <input 
              className='autocomplete-input'
              ref={autocompleteInputRef} 
              type='text' 
              placeholder='Search for a place to center map'
            />
          </div>
          {mapLoaded && userCatchesData &&
            <div className='log-catch-map-buttons-container'>
              <Button 
                name='log-catch'
                className='custom-map-control-button log-catch-map-button'
                primary
                style={{ display: formStatus.initiated ? 'none' : '' }}
                onClick={handleLogCatchClick} 
              >
                Log a Catch
              </Button>
              <Button 
                name='cancel'
                className='custom-map-control-button log-catch-map-button' 
                negative
                style={{ display: formStatus.showAcceptLocation ? '' : 'none' }}
                onClick={handleCloseForm}
              >
                Cancel
              </Button>              
              <Button 
                name='accept-location'
                className='custom-map-control-button log-catch-map-button' 
                primary
                style={{ display: formStatus.showAcceptLocation ? '' : 'none' }}
                onClick={handleAcceptLocation}
              >
                Accept Location
              </Button>
            </div>
          }
        </div>
        
        {/* RIGHT SIDE WITH CATCH CARDS AND FILTER OPTIONS */}
        <div className='flex column'>
          {/* CONTAINER FOR CATCH CARDS*/}
          <div className='catch-cards-container'>
            {renderCards()}
          </div>
        </div>
      </div>
      {/* BOTTOM CONTAINER FOR IMAGE PREVIEWS */}
      {/* <div style={{display: 'flex', width: '100%'}}>
        <div style={{height: 200, width: 100, flexGrow: 1, overflowY: 'hidden', overflowX: 'scoll', whiteSpace: 'nowrap', }}>
          {showCreateCatch && displayImageData.map((image, index) => <img key={index} src={image} alt='your catch' style={{maxHeight: 200, width: 'auto', display: 'inline-block'}} /> )}
        </div>
      </div> */}
        {formStatus.showCreateCatch &&
          <div style={{overflowY: 'auto', position: 'fixed', height: '100vh', width: '100vw', top: 0, left: 0, zIndex: 5, backgroundColor: 'rgba(0,0,0,0.8)'}}>
            <div className='catch-form-container'>
              <CreateCatchForm
                handleCloseForm={handleCloseForm}
                handleLocationInputClick={handleLocationInputClick}
                imageData={displayImageData} 
                handleFileSelect={handleFileSelect} 
                onSuccessCallback={successfulCatchLogCallback} 
                catchLocation={mapRef.current ? mapRef.current.getCenter().toJSON() : null} 
              />
            </div>
          </div>
        }
    </div>
  );
};


export default UserCatchesMap;



  // useEffect to handle filtering catches when filters change
  // useEffect(() => {
  //   if (filters.apply) {
  //     console.log('applying filters')
  //     let filteredData = [];
  //     // SPECIES FILTERS
  //     if (filters.species.length > 0) {
  //       console.log('applying species filters')
  //       userCatchesData.getCatches.forEach(catchObj => {
  //         // each catch against the species filter array and push species that match into the filtered data array
  //         if (filters.species.indexOf(catchObj.species) >-1) {
  //           filteredData.push(catchObj);
  //         }
  //       });
  //     } else {
  //       // no species filters, so pass all catch data onto the next set of filters
  //       filteredData = [...userCatchesData.getCatches];
  //     }
  //     // DATE FILTERS
  //     if (filters.catchDate === 'TODAY'){
  //       const now = new Date();
  //       filteredData = filteredData.filter(catchObj => {
  //         const catchDate = new Date(catchObj.catchDate);
  //         return (catchDate.getDate() === now.getDate() && catchDate.getMonth() === now.getMonth() && catchDate.getFullYear() === now.getFullYear());
  //       }); 
  //     }
  //     if (filters.catchDate === 'WEEK') {
  //       const now = DateTime.now();
  //       filteredData = filteredData.filter(catchObj => {
  //         const catchDate = DateTime.fromMillis(Date.parse(catchObj.catchDate));
  //         return (Interval.fromDateTimes(catchDate, now).toDuration('days').toObject().days <= 7);
  //       });
  //     }
  //     if (filters.catchDate === 'MONTH') {
  //       const now = DateTime.now();
  //       filteredData = filteredData.filter(catchObj => {
  //         const catchDate = DateTime.fromMillis(Date.parse(catchObj.catchDate));
  //         return (Interval.fromDateTimes(catchDate, now).toDuration('months').toObject().months <= 1);
  //       });
  //     }
  //     if (filters.catchDate === 'YEAR') {
  //       const now = DateTime.now();
  //       filteredData = filteredData.filter(catchObj => {
  //         const catchDate = DateTime.fromMillis(Date.parse(catchObj.catchDate));
  //         return (Interval.fromDateTimes(catchDate, now).toDuration('years').toObject().years <= 1);
  //       });
  //     }
  //     // set our default property so we know whether to activate the clear filters button, and set apply to false so we don't trigger refilter
  //     if (filters.species.length === 0 && filters.catchDate === 'ALL'){
  //       console.log('default')
  //       setFilters(prevFilters => ({ ...prevFilters, isDefault: true, apply: false }))
  //     } else {
  //       console.log('not default')
  //       setFilters(prevFilters => ({ ...prevFilters, isDefault: false, apply: false }))
  //     }
  //     // update our filtered catches state
  //     // setFilteredCatches(() => filteredData);
  //     // TESTING, also added all dependencies after mapref
  //     console.log(filteredData);
  //     createMarkers(filteredData, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch);
  //   }    
  // }, [filters, setFilters, userCatchesData, catchMarkersRef, mapRef, infoWindowRef, markerClusterRef, setHighlightedCatch ]);

    // // toggle form on
    // if (!showCreateCatch) {
    //   catchMarkersRef.current = [];
    //   // toggle off clusters
    //   if (markerClusterRef.current) {
    //     markerClusterRef.current.clearMarkers();
    //   }
    //   // show instructions in info window
    //   showInfoWindowInCenter(formInstructionsJSX, mapRef, infoWindowRef);
    //   // add a single use listener to clear the instructions window when bounds change
    //   // window.google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => infoWindowRef.current ? infoWindowRef.current.close() : null);
    //   } else {
    //     // events to run when form toggles off
    //     // clear selected image data that gets passed back to our form for the controlled value
    //     setDisplayImageData([]);
    //     // google autocomplete widget leaves a 1px tall div on top of map even when you hide the input, this will remove it
    //     const container = document.getElementsByClassName('pac-container');
    //     if (container) {
    //       for (let i = 0; i < container.length; i++) {
    //         container[i].remove();
    //       }
    //     }
    //     autocompleteInputRef.current.value = null;
    //     // // clear all catch card refs to force a remap
    //     // catchCardRefs.current = {};
    //     if (generateMarkersFromFilteredData) {
    //       createMarkers(filteredCatches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, clusterMarkers, setHighlightedCatch);
    //     }
    //   }
    // setShowCreateCatch(prevValue => !prevValue);