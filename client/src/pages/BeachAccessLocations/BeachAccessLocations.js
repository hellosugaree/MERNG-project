import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useGoogleMap } from '../../utilities/hooks';
import GoogleMap from '../../components/GoogleMap';
import Pagination from '../../components/Pagination';
import BeachCard from './BeachCard';
import Filters from './Filters';
import LoaderFish from '../../components/LoaderFish';
import { defaultFilters, applyFilters, generateMarkerClusters, generateMarkers } from './helpers';
import '../../App.css';
import './BeachAccessLocations.css';

const BeachAccessLocations = (props) => {
  // hook for google map refs and loader
  const { mapMarkers, loadMap, center, mapContainerRef, markersRef, mapRef, apiStatus, basicControls } = useGoogleMap();
  // store initial fetched data 
  const [accessLocations, setAccessLocations] = useState(null);
  // active page for pagination
  const [activePage, setActivePage] = useState(1);
  const [displayFilters, setDisplayFilters] = useState(defaultFilters);
  const filteredAccessLocations = useMemo(() => accessLocations ? applyFilters(accessLocations, displayFilters) : null, [displayFilters, accessLocations]);
  const [fetchStatus, setFetchStatus] = useState({error: false, loading: true})
  const infoWindowRef = useRef(null);
  const markerClusterRef = useRef(null);

  // useEffect to load map
  useEffect(() => {
    if (apiStatus.loading && !apiStatus.errors) {
      loadMap();
    }
  }, [apiStatus, loadMap]);

  // map markers
  useEffect(() => {
    // initialize markers if map is loaded and markersRef array is empty
    if (mapRef.current && filteredAccessLocations) {
      const markers = generateMarkers(mapRef, infoWindowRef, filteredAccessLocations);
      generateMarkerClusters(markers, markerClusterRef, mapRef);
      // markersRef.current = markers;
      // mapMarkers(markersArray, mapRef, true, { fitBounds: 50 });  
    }
  }, [filteredAccessLocations, mapMarkers, mapRef, markersRef]);


  // function to fetch data and sort ascending for initial fetch
  const fetchData = async () => {
    console.log('fectching data');
    setFetchStatus(prevStatus => ({...prevStatus, loading: true, error: false}));
    // default fetch all locations
    let fetchURL = 'https://api.coastal.ca.gov/access/v1/locations';
    await fetch(fetchURL)
      .then(res => res.json())
      .then(json => {
        setFetchStatus(prevStatus => ({...prevStatus, loading: false}));
        setAccessLocations(json);
      })
      .catch(err => {
        setFetchStatus(prevStatus => ({...prevStatus, error: true, loading: false}));
        console.log(err)
      });
  }

  // fetch data on first render
  useEffect(() => {
    fetchData();
  }, []);

  // function to map our access locations into an array of jsx elements
  const mappedAccessLocations = useMemo(() => {
      return filteredAccessLocations ?
        filteredAccessLocations
        .slice(activePage * displayFilters.itemsPerPage - displayFilters.itemsPerPage , activePage * displayFilters.itemsPerPage)
        .map(loc => (
          <div key={loc.ID} style={{padding: '5px 5px'}}>
            <BeachCard {...loc} />
          </div>
        ))
        : null;
  }, [filteredAccessLocations, displayFilters, activePage]);

  return (
        <div className='flex fit'>
          {apiStatus.loading && 
            <div className='center'> 
              <LoaderFish />
            </div>
          }
          <div className='flex column beach-cards-and-pagination-container'>
            {filteredAccessLocations && 
              <div className='flex column beach-cards-container' >
                {mappedAccessLocations} 
              </div> 
            }  
            {!fetchStatus.loading && !fetchStatus.error && filteredAccessLocations && 
              <Pagination 
                itemCount={filteredAccessLocations.length} 
                itemsPerPage={displayFilters.itemsPerPage} 
                setActivePage={setActivePage}
                activePage={activePage} 
              />
            }  
          </div>
          {!fetchStatus.loading && !fetchStatus.error && !apiStatus.loading && !apiStatus.errors && filteredAccessLocations &&
            <div className='flex column filter-and-map-container'>
                <Filters filteredAccessLocations displayFilters={displayFilters} setDisplayFilters={setDisplayFilters} /> 
              <div style={{height: '100%', width: '100%', paddingTop: 10}}>
                  <div id='map' ref={mapContainerRef} style={{height: '100%', width: '100%'}}>
                    <GoogleMap 
                      center={center}             
                      mapRef={mapRef} 
                      mapContainer={mapContainerRef} 
                      zoom={8} 
                      controls={basicControls}
                      options={{
                        scaleControl: true,
                        mapTypeControl: true,
                      }}
                    />
                  </div>
                
              </div>
          </div>
          }       
      </div>
  );
};

export default BeachAccessLocations;




/*   const testLog = () => {
    // generate array of initial markers to load on the map
    const markersArray = [];
    filteredAccessLocations.forEach(location => {
      if (location.LATITUDE && location.LONGITUDE) {
        const marker = { position: { lat: location.LATITUDE, lng: location.LONGITUDE }, id: location.ID };
        markersArray.push(marker);
      }
    })
    mapMarkers(markersArray, mapRef);
  } */


/*   // update state for filter toggles
  const handleFilterToggle = (e, checked, name) => {
    setDisplayFilters(prevFilters => ({ ...prevFilters, [name]: checked, applied: false }));
  };
  const handleCountyChange = (e, value) => {
    setDisplayFilters(prevFilters => ({ ...prevFilters, county: value, applied: false }));
  };

  // effect called when search by named value changes
  useEffect(() => {
      // call our debounced search on the entire dataset
    debouncedFilterByName.current(accessLocations, displayFilters.searchInName);

  }, [displayFilters.searchInName, accessLocations])
 */


/*   // function to debounce search by name so we don't search until after the user pauses typing
  // need useRef to use debounce in a functional component
  const debouncedFilterByName = useRef(_.debounce(filterByName, 500));


  // handle our filter by name input change
  const handleSearchInNameChange = (e) => {
    setLoadingSearchInName(true);
    setDisplayFilters({...displayFilters, searchInName: e.target.value})
  };
 */


  // const renderFilterMenu = () => {
  //   return (
  //     <div style={{width: '100%'}}> 
  //     <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', border: '1px solid #CCC', borderRadius: 5}}>
  //       {/* SORT DROPDOWN */}
  //       <span style={{marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>Filter Access Locations</span>
  //       <div style={{margin: '10px 0px'}}>
  //         <span style={{marginRight: 10, fontSize: 16}}>Sort by</span>
  //         <Dropdown 
  //           inline 
  //           style={{fontSize: 16}} 
  //           options={sortOptions}
  //           onChange={handleSortDropdownChange} 
  //           value={displayFilters.sortDropdownValue}
  //         />
  //       </div>
      
  //         <div style={{position: 'relative', display: 'flex', width: 250}}>
  //           {/* TEXT INPUT TO FILTER NAMES */}
  //           <input
  //             style={{zIndex: 1, flexGrow: 1, width: 100, border: '1px solid gray', borderRadius: 5, height: 30, fontSize: 16, padding: '5px 30px 5px 5px'}}
  //             disabled={!filteredAccessLocations ? true : false }
  //             placeholder='Name contains' 
  //             type='text' 
  //             name='searchInName' 
  //             value={displayFilters.searchInName} 
  //             onChange={handleSearchInNameChange} 
  //           /> 
  //           <div 
  //             className='animate-spinner'
  //             style={{
  //               display: loadingSearchInName ? '' : 'none',
  //               position: 'absolute',
  //               borderRadius: '50%', border: '6px solid #898A8A', borderTop: '6px solid lightblue',
  //               right: 2, bottom: 2, 
  //               height: 26, width: 26,
  //               zIndex: 100
  //             }} 
  //           />
  //         </div>

  //         <div style={{display: 'flex', width: '60%', maxWidth: 150, alignItems: 'center', justifyContent: 'center', height: 30, borderRadius: 5, border: '1px solid grey', marginTop: 10}}>
  //           <Dropdown
  //             style={{flexGrow: 1, textAlign: 'center'}}               
  //             inline
  //             options={countyDropdownOptions}
  //             name='county'
  //             onChange={(e, { value }) => handleCountyChange(e, value)}
  //             value={displayFilters.county}
  //           />
  //         </div>

  //       {/* FILTER ATTRIBUTE CHECKBOXES */}
  //       <div style={{marginTop: 10, display: 'flex',flexDirection: 'column'}}> 
  //         <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
  //           <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='hasBoating' label='Boating' checked={displayFilters.hasBoating} onChange={(e, { checked, name }) => handleFilterToggle(e, checked, name)}/>
  //           <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='hasCampground' label='Campground' checked={displayFilters.hasCampground} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
  //         </div>
  //         <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
  //           <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='isSandy' label='Sandy shore' checked={displayFilters.isSandy} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
  //           <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='isRocky' label='Rocky shore' checked={displayFilters.isRocky} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
  //         </div>
  //       </div>

  //       <div style={{ marginBottom: 10}}>
  //         <span style={{marginRight: 10, fontSize: 16}}>Items per page</span>
  //         <input 
  //           style={{maxWidth: 40, padding: 2, fontSize: 16,textAlign: 'center'}} 
  //           type='number' value={displayFilters.itemsPerPage} 
  //           onChange={handlePagesToDisplayInputChange} 
  //           onClick={e => e.target.select()}
  //         />
  //       </div>
  //       <div style={{ marginBottom: 10}}>
  //         <span style={{fontSize: 16}}>Total results: {filteredAccessLocations.length}</span>
  //       </div>
  //       {/* <button type='button' onClick={testLog}>Test log</button> */}
  //     </div>
  //     </div> 
  //   );
  // };



  // const renderPagination = () => {
  //   return (
  //   /* CONTAINER FOR PAGINATION and PAGE COUNT*/
  //   <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10}}>
  //     {/* PAGINATION BUTTONS CONTAINER*/}
  //     <div style={{border: '1px solid lightgrey', borderRadius: 5, display: 'flex', width: '100%', flexGrow: 1,  maxWidth: 500}}>
  //       <button 
  //         className='pagination-button'
  //         type='button' 
  //         name='first'
  //         onClick={handlePageChange}
  //         disabled={displayPage === 1} 
  //       >
  //         <Icon name='fast backward' />
  //       </button>
  //       <button 
  //         onClick={handlePageChange}
  //         className='pagination-button'
  //         type='button' name='minusFive'
  //         disabled={displayPage < 5}
  //       >
  //         <Icon name='backward' />
  //       </button>
  //       <button 
  //         onClick={handlePageChange}
  //         className='pagination-button'
  //         type='button' name='previous'
  //         disabled={displayPage === 1}
  //       >
  //         <Icon name='step backward' />
  //       </button>    
  //         <input type='number' className='pagination-input' value={displayPage} onChange={handlePageChange} onClick={e => e.target.select()} />
  //       <button 
  //         onClick={handlePageChange}
  //         className='pagination-button'
  //         type='button' name='next'
  //         disabled={displayPage === Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)} 
  //       >
  //         <Icon name='step forward' />
  //       </button>
  //       <button 
  //         onClick={handlePageChange}
  //         className='pagination-button'
  //         type='button' name='plusFive'
  //         disabled={Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage) - displayPage < 5} 
  //       >
  //         <Icon name='forward' />
  //       </button>
  //       <button 
  //         onClick={handlePageChange}
  //         className='pagination-button'
  //         type='button' name='last'
  //         disabled={displayPage === Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)} 
  //       >
  //         <Icon name='fast forward' />
  //       </button>
  //     </div>
  //     <span style={{color: 'grey'}}>
  //       Total pages: {Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)}
  //     </span>

  //   </div>
  //   );
  // }
/*


  // function to render the catch cards
  const renderCards = () => {
    return (
                <div style={{width: '100%', height: 1, flexGrow:1, display: 'flex', flexDirection: 'column'}}>

                <div style={{width: '100%', display: 'flex', flexDirection: 'column', minHeight: 300, marginTop: 10, marginBottom: 10, overflowY: 'auto'}}>
                    {mapAccessLocations(filteredAccessLocations)} 
                  </div>   

                  <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                  <div style={{border: '1px solid lightgrey', borderRadius: 5, display: 'flex', width: '100%', flexGrow: 1,  maxWidth: 500}}>
                      <button 
                        className='pagination-button'
                        type='button' 
                        name='first'
                        onClick={handlePageChange}
                        disabled={displayPage === 1} 
                      >
                        <Icon name='fast backward' />
                      </button>
                      <button 
                        onClick={handlePageChange}
                        className='pagination-button'
                        type='button' name='minusFive'
                        disabled={displayPage < 5}
                      >
                        <Icon name='backward' />
                      </button>
                      <button 
                        onClick={handlePageChange}
                        className='pagination-button'
                        type='button' name='previous'
                        disabled={displayPage === 1}
                      >
                        <Icon name='step backward' />
                      </button>    
                        <input type='number' className='pagination-input' value={displayPage} onChange={handlePageChange} onClick={e => e.target.select()} />
                      <button 
                        onClick={handlePageChange}
                        className='pagination-button'
                        type='button' name='next'
                        disabled={displayPage === Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)} 
                      >
                        <Icon name='step forward' />
                      </button>
                      <button 
                        onClick={handlePageChange}
                        className='pagination-button'
                        type='button' name='plusFive'
                        disabled={Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage) - displayPage < 5} 
                      >
                        <Icon name='forward' />
                      </button>
                      <button 
                        onClick={handlePageChange}
                        className='pagination-button'
                        type='button' name='last'
                        disabled={displayPage === Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)} 
                      >
                        <Icon name='fast forward' />
                      </button>
                    </div>
                    <span style={{color: 'grey'}}>
                      Total pages: {Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)}
                    </span>
                  </div>
                </div>     
    );
  };

  const renderMap = () => {
    return !apiStatus.loading && !apiStatus.error 
      ? ( 
        <div style={{width: '100%', height: 1, flexGrow:1, display: 'flex', flexDirection: 'column'}}>
          <div id='map' ref={mapContainerRef} style={{height: '100%', width: '100%'}}>
            <GoogleMap center={center}             
              mapRef={mapRef} 
              mapContainer={mapContainerRef} 
              center={center}
              zoom={8} 
              controls={basicControls}
              options={{
                scaleControl: true,
                mapTypeControl: true,
                // scaleControlOptions: {
                //   position: window.google.maps.ControlPosition.TOP_LEFT
                // }
              }}
            />
          </div>
        </div>     
      )
      : null;
  };

  const renderFilterMenu = () => {
    return (
      <div style={{width: '100%', padding: '0px 5px'}}> 
      <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', border: '1px solid #CCC', borderRadius: 5}}>

      <span style={{marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>Filter Access Locations</span>
        <div style={{margin: '10px 0px'}}>
          <span style={{marginRight: 10, fontSize: 16}}>Sort by</span>
          <Dropdown 
            inline 
            style={{fontSize: 16}} 
            options={sortOptions}
            onChange={handleSortDropdownChange} 
            value={displayFilters.sortDropdownValue}
          />
        </div>
      
          <div style={{position: 'relative', display: 'flex', width: 250}}>

          <input
              style={{zIndex: 1, flexGrow: 1, width: 100, border: '1px solid gray', borderRadius: 5, height: 30, fontSize: 16, padding: '5px 30px 5px 5px'}}
              disabled={!filteredAccessLocations ? true : false }
              placeholder='Name contains' 
              type='text' 
              name='searchInName' 
              value={displayFilters.searchInName} 
              onChange={handleSearchInNameChange} 
            /> 
            <div 
              className='animate-spinner'
              style={{
                display: loadingSearchInName ? '' : 'none',
                position: 'absolute',
                borderRadius: '50%', border: '6px solid #898A8A', borderTop: '6px solid lightblue',
                right: 2, bottom: 2, 
                height: 26, width: 26,
                zIndex: 100
              }} 
            />
          </div>



          
          <div style={{display: 'flex', width: '60%', maxWidth: 150, alignItems: 'center', justifyContent: 'center', height: 30, borderRadius: 5, border: '1px solid grey', marginTop: 10}}>
            <Dropdown
              style={{flexGrow: 1, textAlign: 'center'}}               
              inline
              options={countyDropdownOptions}
              onChange={(e, {value}) => setDisplayFilters({...displayFilters, county: value})} 
              value={displayFilters.county}
            />
          </div>


          <div style={{marginTop: 10, display: 'flex',flexDirection: 'column'}}> 
          <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Boating' checked={displayFilters.hasBoating} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, hasBoating: checked})}/>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Campground' checked={displayFilters.hasCampground} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, hasCampground: checked})}/>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Sandy shore' checked={displayFilters.isSandy} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, isSandy: checked, isRocky: false })}/>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Rocky shore' checked={displayFilters.isRocky} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, isRocky: checked, isSandy: false })}/>
          </div>
        </div>

        <div style={{ marginBottom: 10}}>
          <span style={{marginRight: 10, fontSize: 16}}>Items per page</span>
          <input 
            style={{maxWidth: 40, padding: 2, fontSize: 16,textAlign: 'center'}} 
            type='number' value={displayFilters.itemsPerPage} 
            onChange={handlePagesToDisplayInputChange} 
            onClick={e => e.target.select()}
          />
        </div>
        <div style={{ marginBottom: 10}}>
          <span style={{fontSize: 16}}>Total results: {filteredAccessLocations.length}</span>
        </div>
        <button type='button' onClick={() => setShowMap(prevVal => !prevVal)}>Toggle map</button>
        <button type='button' onClick={testLog}>Test log</button>
      </div>
      </div> 
    );
  };




   {
        boatingLocations && boatingLocations.map(loc => (
          <div id={loc.id}>
            <div>{loc.NameMobileWeb}</div>
            <div>{loc.LATITUDE}, {loc.LONGITUDE}</div>
          </div>
        ))
      }


*/


/* 
Input a <input type='text' value={testFilters.a} onChange={e => setTestFilters({...testFilters, a: e.target.value})} />
Input b <input type='text' value={testFilters.b} onChange={e => setTestFilters({...testFilters, b: e.target.value})} />
Input c <input type='text' value={testFilters.c} onChange={e => setTestFilters({...testFilters, c: e.target.value})} /> */