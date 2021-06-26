import React, { useEffect, useState, useRef } from 'react';
import { useGoogleMap } from '../utilities/hooks';
import _ from 'lodash';
import { Card, Dropdown, Image, Checkbox, Icon } from 'semantic-ui-react';
import GoogleMap from './GoogleMap';

import '../App.css';

// static data options
const sortOptions = [
  {
    value: 'Name A-Z',
    key: 'Name A-Z',
    text: 'Name A-Z',
    icon: 'sort alphabet down',
  },

  {
    value: 'Name Z-A',
    key: 'Name Z-A',
    text: 'Name Z-A',
    icon: 'sort alphabet up'
  }
];

// In the source JSON, the counties are numbered in CountyNum property and named in COUNTY property
// for CountyNum: 10, 4 of the locations have name as "3_Central Coast"
// Will treat 3_Central Coast as "San Luis Obispo"
// CountyNum: 14, has COUNTY: "Orange" except for 1 beach "Orange (and LA)", will treat all as Orange
// County 9 is "Monterey", except for 2 beaches, one in Santa Cruz (Pajaro River Bike Path) and one in San Luis Obispo (Piedras Blancas Light Station)
/** 
* Counties by CountyNum are:
* 1: "Del Norte"
* 2: "Humboldt"
* 3: "Mendocino" (1 "Sonoma")
* 4: "Sonoma"
* 5: "Marin"
* 6: "San Francisco"
* 7: "San Mateo"
* 8: "Santa Cruz"
* 9: "Monterey"
* 10: "San Luis Obispo" (and "3_Central Coast")
* 11: "Santa Barbara"
* 12: "Ventura" (1 Los Angeles "Staircase Beach")
* 13: "Los Angeles"
* 14: "Orange" (1 "Orange (and La)")
*/
const countyDropdownOptions = [
  {  
    value: "All counties",
    key: "All counties",
    text: "All counties"
  },
  {  
    value: "Orange",
    key: "Orange",
    text: "Orange"
  },
  {  
    value: "Monterey",
    key: "Monterey",
    text: "Monterey"
  },
  {  
    value: "Santa Cruz",
    key: "Santa Cruz",
    text: "Santa Cruz"
  },
  {  
    value: "San Mateo",
    key: "San Mateo",
    text: "San Mateo"
  },
  {  
    value: "Humboldt",
    key: "Humboldt",
    text: "Humboldt"
  },
  {  
    value: "Los Angeles",
    key: "Los Angeles",
    text: "Los Angeles"
  },
  {  
    value: "Marin",
    key: "Marin",
    text: "Marin"
  },
  {  
    value: "San Diego",
    key: "San Diego",
    text: "San Diego"
  },
  {  
    value: "Mendocino",
    key: "Mendocino",
    text: "Mendocino"
  },
  {  
    value: "San Francisco",
    key: "San Francisco",
    text: "San Francisco"
  },
  {  
    value: "Santa Barbara",
    key: "Santa Barbara",
    text: "Santa Barbara"
  },
  {  
    value: "San Luis Obispo",
    key: "San Luis Obispo",
    text: "San Luis Obispo"
  },
  {  
    value: "Del Norte",
    key: "Del Norte",
    text: "Del Norte"
  },
  {  
    value: "Ventura",
    key: "Ventura",
    text: "Ventura"
  },
  {  
    value: "Sonoma",
    key: "Sonoma",
    text: "Sonoma"
  }
];

// "Monterey",
// "Santa Cruz",
// "San Mateo",
// "Humboldt",
// "Los Angeles",
// "Marin",
// "San Diego",
// "Mendocino",
// "San Francisco",
// "Santa Barbara",
// "San Luis Obispo",
// "Del Norte",
// "Ventura",
// "Sonoma",
// "3_Central Coast",
// "Orange (and LA)"


const BeachAccessLocations = (props) => {
  // store initial fetched data 
  const [accessLocations, setAccessLocations] = useState(null);
  // state for filtered access locations based on sort order and toggle filters
  const [filteredAccessLocations, setFilteredAccessLocations] = useState(null);
  // state for searched acccess locations based on manually entered search terms which we will further filter into this variable
  // this is present to allow restoration of filtered locations without refiltering when searches are cleared
  // this prevents us from needing to filter the entire access locations data on search
  const [searchedAccessLocations, setSearchedAccessLocations] = useState(null);
  const [displayPage, setDisplayPage] = useState(1);
  const [displayFilters, setDisplayFilters] = useState({
    itemsPerPage: 10, 
    sortDropdownValue: 'Name A-Z', 
    hasCampground: false,
    hasBoating: false,
    isSandy: false,
    isRocky: false,
    show: false,
    searchInName: '',
    county: 'All counties',
    applied: false
  });

  // useRef for our displayFilters so we can determine when we need to refetch 
  const [fetchStatus, setFetchStatus] = useState({error: false, loading: true})
  const [loadingSearchInName, setLoadingSearchInName] = useState(false);
  
  // hook for google map refs and loader
  const { mapMarkers, loadMap, center, mapContainerRef, markersRef, mapRef, apiStatus, basicControls } = useGoogleMap();


  // useEffect to load map
  useEffect(() => {
    if (apiStatus.loading && !apiStatus.errors) {
      console.log('map loder useEffect triggered in beachaccesslocations')
      loadMap();
    }
  }, [apiStatus]);

  // useEffect to initialize markers
  useEffect(() => {
    // initialize markers if map is loaded and markersRef array is empty
    if (markersRef.current.length === 0 && mapRef.current && filteredAccessLocations.length > 0) {
      console.log('initilize marker set')
      const markersArray = [];
      filteredAccessLocations.forEach(location => {
        if (location.LATITUDE && location.LONGITUDE) {
          const marker = { position: { lat: location.LATITUDE, lng: location.LONGITUDE }, id: location.ID };
          markersArray.push(marker);
        }
      });
      mapMarkers(markersArray, mapRef, true, { fitBounds: 50 });  
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
        // sort fetched data as ascending by default
        json.sort((a, b) => {
          return a.NameMobileWeb > b.NameMobileWeb ? 1 
          : a.NameMobileWeb < b.NameMobileWeb ? -1 : 0;
        });
        setFetchStatus(prevStatus => ({...prevStatus, loading: false}));
        setAccessLocations(json);
        setFilteredAccessLocations(json);
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

  // update state for filter toggles
  const handleFilterToggle = (e, checked, name) => {
    setDisplayFilters(prevFilters => ({ ...prevFilters, [name]: checked, applied: false }));
  };
  const handleCountyChange = (e, value) => {
    setDisplayFilters(prevFilters => ({ ...prevFilters, county: value, applied: false }));
  };

  // handle changes to state for filter options
  useEffect(() => {
    // function to sort access locations
    const sortAccessLocations = locations => {
      console.log('sorting');
      setDisplayPage(1);
      switch (displayFilters.sortDropdownValue) {
        case 'Name A-Z':
          const ascendingName = [...locations].sort((a, b) => {
            return a.NameMobileWeb > b.NameMobileWeb ? 1 
            : a.NameMobileWeb < b.NameMobileWeb ? -1 : 0;
          });
          return ascendingName;
        
        case 'Name Z-A':
          const descendingName = [...locations].sort((a, b) => {
            return a.NameMobileWeb < b.NameMobileWeb ? 1 
            : a.NameMobileWeb > b.NameMobileWeb ? -1 : 0;
          });;
          return descendingName;
  
        default:
        break; 
      }
    };

    // function to filter by county
    const filterByCounty = locationsToFilter => {
      return locationsToFilter.filter(loc => loc.COUNTY === displayFilters.county);
    };

    // function filter access location data
    const applyFilterOptions = locationsToFilter => {
      // applied property allows us to filter on a useState trigger with all dependencies without triggering infinite loop
      if (!displayFilters.applied) {
        setDisplayFilters(prevFilters => ({ ...prevFilters, applied: true }));
        console.log('Applying filter options')
        console.log(`Pre filtered locations: ${locationsToFilter.length}`);
        // use this to prevent duplicating the array in case we don't need to sort
        if (displayFilters.county !== 'All counties') {
          console.log('filtering by county')
          locationsToFilter = filterByCounty(locationsToFilter);
        }
        if (displayFilters.hasBoating) {
          console.log('filtering for boating options')
          locationsToFilter = locationsToFilter.filter(loc => loc.BOATING.toLowerCase() === "yes");
        }
        if (displayFilters.isRocky) {
          console.log('filtering for rocky shore')
          locationsToFilter = locationsToFilter.filter(loc => loc.RKY_SHORE.toLowerCase() === "yes");
        }
        if (displayFilters.isSandy) {
          console.log('filtering for sandy beach')
          locationsToFilter = locationsToFilter.filter(loc => loc.SNDY_BEACH.toLowerCase() === "yes");
        }
        if (displayFilters.hasCampground) {
          console.log('filtering for campground')
          locationsToFilter = locationsToFilter.filter(loc => loc.CAMPGROUND.toLowerCase() === "yes");
        }
        console.log(`Post filtered locations: ${locationsToFilter.length}`);
        locationsToFilter = sortAccessLocations(locationsToFilter);
        // set generate map markers for filtered locations
        const markersArray = [];
        locationsToFilter.forEach(location => {
          if (location.LATITUDE && location.LONGITUDE) {
            const marker = { position: { lat: location.LATITUDE, lng: location.LONGITUDE }, id: location.ID };
            markersArray.push(marker);
          }
        });
        if (mapRef.current) {
          mapMarkers(markersArray, mapRef, true, { fitBounds: 50 });
        }
        return locationsToFilter;  
      }
    }

    if (!displayFilters.applied) {
      // if locations have been searched, filter the searched values, if not, filter all locations
      if (searchedAccessLocations){
        console.log('filtering searched data')
        setFilteredAccessLocations(applyFilterOptions([...searchedAccessLocations]));
      } else if (accessLocations) {
        console.log('filtering unsearched data')
        setFilteredAccessLocations(applyFilterOptions([...accessLocations]));
      }
    }
  }, [displayFilters, searchedAccessLocations, accessLocations, setFilteredAccessLocations, mapRef, mapMarkers]);
// last 4 added



  // // sort accessLocations when dropdown changes
  // useEffect(() => {
  //   console.log('displayFilters.sortDropdownValue changed')
  //   if (filteredAccessLocations) {
  //     setFilteredAccessLocations(prevLocations => sortAccessLocations(prevLocations));
  //   }
  // }, [displayFilters.sortDropdownValue])

    // effect called when search by named value changes
    useEffect(() => {
        // call our debounced search on the entire dataset
      debouncedFilterByName.current(accessLocations, displayFilters.searchInName);
  
    }, [displayFilters.searchInName, accessLocations])


  // handle setting pages to display filter
  const handlePagesToDisplayInputChange = event => {
    let inputValue = event.target.value;
    if (inputValue < 1) inputValue = 1;
    if (inputValue > 50) inputValue = 50;
    setDisplayFilters({...displayFilters, itemsPerPage: inputValue});
  };

  // handler for pagination change, both button and numeric input to manually enter a page to display
  const handlePageChange = e => {
    // forward or back buttons clicked
    if (e.type === 'click') {
      // use currentTarget because a click in the nested icon within button will show up as target when clicked
      if (e.currentTarget.name === 'first') {
        return setDisplayPage(1);
      }
      if (e.currentTarget.name === 'minusFive') {
        return setDisplayPage(prevPage => prevPage - 5);
      }
      if (e.currentTarget.name === 'previous') {
        return setDisplayPage(prevPage => prevPage - 1);
      }
      if (e.currentTarget.name === 'next') {
        return setDisplayPage(prevPage => prevPage + 1);
      }
      if (e.currentTarget.name === 'plusFive') {
        return setDisplayPage(prevPage => prevPage + 5);
      }
      if (e.currentTarget.name === 'last') {
        return setDisplayPage(Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage));
      }
    }
    // numeric page input changed directly
    if (e.type === 'change') {
      const totalPages = Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage);
      // if user tries to input number larger than page count, set to last page
      if (e.target.value > totalPages) {
        setDisplayPage(totalPages);
      } else if (e.target.value < 1) {
        setDisplayPage(1);
      } else {
        setDisplayPage(e.target.value);
      }
    }
  };

  // handle change for sort dropdown
  const handleSortDropdownChange = (event, { value }) => {
    setDisplayFilters({...displayFilters, sortDropdownValue: value, applied: false});
  }

  // function to filter locations that contain the search term in their name
  function filterByName(currentLocations, currentSearchTerm){
    console.log('searching by name');
    // if user empties search bar, reset searched locations to null so we know to apply filters off entire dataset instead of searched dataset
    if (currentSearchTerm === '') {
      console.log('Empty search, setting searched locations to null');
      setSearchedAccessLocations(null);
    } else {
      console.log(`Pre filtered locations: ${currentLocations.length}`);
      const filteredByName = currentLocations.filter(loc => {
        // returns true of any part of name contains search value
        return loc.NameMobileWeb.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1
      });      
      console.log(`Post filtered locations: ${filteredByName.length}`);
      setSearchedAccessLocations(filteredByName);
    }
    setLoadingSearchInName(false);
    // trigger a refilter of the data
    setDisplayFilters(prevFilters => ({ ...prevFilters, applied: false }))
  }
  // function to debounce search by name so we don't search until after the user pauses typing
  // need useRef to use debounce in a functional component
  const debouncedFilterByName = useRef(_.debounce(filterByName, 500));


  // handle our filter by name input change
  const handleSearchInNameChange = (e) => {
    setLoadingSearchInName(true);
    setDisplayFilters({...displayFilters, searchInName: e.target.value})
  };

  // function to map our access locations into an array of jsx elements
  const mapAccessLocations = (locations) => {
      return locations
        .slice(displayPage * displayFilters.itemsPerPage - displayFilters.itemsPerPage , displayPage * displayFilters.itemsPerPage)
        .map(loc => (
          <div key={loc.ID} style={{padding: '5px 5px'}}>
            <Card
              fluid
            >
              <Card.Content>
              <Card.Header>{loc.NameMobileWeb}</Card.Header>
              <Card.Meta>County: {loc.COUNTY}</Card.Meta>
              <Card.Meta>Coordinates: {loc.LATITUDE}, {loc.LONGITUDE}</Card.Meta>
              <Card.Meta>{loc.SNDY_BEACH === 'Yes' && 'Sandy beach'}</Card.Meta>
              <Card.Meta>{loc.RKY_SHORE === 'Yes' && 'Rocky shore'}</Card.Meta>
              {loc.Photo_1 && <Image style={{margin: 2, objectFit: 'cover', height: 110, width: 110}} rounded  src={loc.Photo_1} />}
              {loc.Photo_2 && <Image style={{margin: 2, objectFit: 'cover', height: 110, width: 110}} rounded  src={loc.Photo_2} />}
              {loc.Photo_3 && <Image style={{margin: 2, objectFit: 'cover', height: 110, width: 110}} rounded  src={loc.Photo_3} />}
              {!loc.Photo_1 && <Card.Meta textAlign='right'>No photo available</Card.Meta>}
              <Card.Description style={{marginTop: 4}} content={loc.LocationMobileWeb}/>
              <Card.Description style={{marginTop: 4}} content={loc.DescriptionMobileWeb}/>
              </Card.Content>
              {/* <div>{loc.LATITUDE}, {loc.LONGITUDE}</div> */}
            </Card>
          </div>
        ));
  }

  // function to render the catch cards
  const renderCards = () => {
    return (
      /* ACCESS LOCATION CARDS CONTAINER */
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto'}}>
        {mapAccessLocations(filteredAccessLocations)} 
      </div> 
    );
  };

  const renderPagination = () => {
    return (
    /* CONTAINER FOR PAGINATION and PAGE COUNT*/
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10}}>
      {/* PAGINATION BUTTONS CONTAINER*/}
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
    );
  }

  const renderMap = () => {
    return !apiStatus.loading && !apiStatus.errors
      ? ( 
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
                // scaleControlOptions: {
                //   position: window.google.maps.ControlPosition.TOP_LEFT
                // }
              }}
            />
          </div>
      )
      : null;
  };

  const renderFilterMenu = () => {
    return (
      <div style={{width: '100%', padding: '0px 5px'}}> 
      <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', border: '1px solid #CCC', borderRadius: 5}}>
        {/* SORT DROPDOWN */}
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
            {/* TEXT INPUT TO FILTER NAMES */}
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


         {/* DIV FOR LOADING ANIMATION */}            

          <div style={{display: 'flex', width: '60%', maxWidth: 150, alignItems: 'center', justifyContent: 'center', height: 30, borderRadius: 5, border: '1px solid grey', marginTop: 10}}>
            <Dropdown
              style={{flexGrow: 1, textAlign: 'center'}}               
              inline
              options={countyDropdownOptions}
              name='county'
              onChange={(e, { value }) => handleCountyChange(e, value)}
              value={displayFilters.county}
            />
          </div>

        {/* FILTER ATTRIBUTE CHECKBOXES */}
        <div style={{marginTop: 10, display: 'flex',flexDirection: 'column'}}> 
          <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='hasBoating' label='Boating' checked={displayFilters.hasBoating} onChange={(e, { checked, name }) => handleFilterToggle(e, checked, name)}/>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='hasCampground' label='Campground' checked={displayFilters.hasCampground} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='isSandy' label='Sandy shore' checked={displayFilters.isSandy} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
            <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='isRocky' label='Rocky shore' checked={displayFilters.isRocky} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
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
        {/* <button type='button' onClick={testLog}>Test log</button> */}
      </div>
      </div> 
    );
  };

  const testLog = () => {
    // generate array of initial markers to load on the map
    const markersArray = [];
    filteredAccessLocations.forEach(location => {
      if (location.LATITUDE && location.LONGITUDE) {
        const marker = { position: { lat: location.LATITUDE, lng: location.LONGITUDE }, id: location.ID };
        markersArray.push(marker);
      }
    })
    mapMarkers(markersArray, mapRef);
  }

  return (
        /* CONTAINER FOR FILTERS AND POSTS */
        <div style={{display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', height: '100%', padding: '0px 10px 0px 0px'}}>

          {/* SORT AND FILTER OPTIONS */} 
          {filteredAccessLocations && renderFilterMenu()} 
        {/* CONTAINER FOR MAP AND CARD CONTAINERS */}
        <div style={{display: 'flex', height: 1, flexGrow: 1, width: '100%', paddingTop: 10}}>
          {/* CONTAINER FOR CARDS */}
          <div style={{height: '100%', width: 400, display: 'flex', flexDirection: 'column'}}>
            {fetchStatus.loading && (<h1 className='page-title' style={{}}>Retreiving beach data from server...</h1>)}
            {fetchStatus.error && (<h1 className='page-title' style={{}}>Could not retreive beach data from server, please try again later...</h1>)}
            {!fetchStatus.loading && !fetchStatus.error && filteredAccessLocations && renderCards()}  
            {!fetchStatus.loading && !fetchStatus.error && filteredAccessLocations && renderPagination()}  
          </div>
          

          <div style={{flexGrow:1, padding: '0px 10px 20px 10px'}}>
            {!fetchStatus.loading && !fetchStatus.error && !apiStatus.loading && !apiStatus.errors && filteredAccessLocations && renderMap() }  
          </div>
        </div>
      </div>
  );

};




export default BeachAccessLocations;



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