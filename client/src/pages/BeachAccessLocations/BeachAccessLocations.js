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