import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { Card, Dropdown, Image, Checkbox, Icon } from 'semantic-ui-react';
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

/*

user searches on unfiltered data
  search entire dataset and display result
  if (no filters) {
    search entire dataset
    store searched dataset in searchedAccessLocations
  }

user searches on filtered data
  search filtered dataset and display it
  if (filters) {
    search filteredAccessLocations
    store in searchedAccessLocations
  }

user filters unsearched data
  apply filters to whole dataset

user filters searched data
  if (searched data) {
    apply all filters to main dataset then search filtered
  }

*/


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
    itemsPerPage: 5, 
    sortDropdownValue: 'Name A-Z', 
    hasCampground: false,
    hasBoating: false,
    isSandy: false,
    isRocky: false,
    show: false,
    searchInName: '',
    county: 'All counties'
  });

  // useRef for our displayFilters so we can determine when we need to refetch 
  const [fetchStatus, setFetchStatus] = useState({error: false, loading: true})
  const [loadingSearchInName, setLoadingSearchInName] = useState(false);

  // function to filter by county
  const filterByCounty = locationsToFilter => {
    return locationsToFilter.filter(loc => loc.COUNTY === displayFilters.county);
  };

  // function filter access location data
  const applyFilterOptions = locationsToFilter => {
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
    return locationsToFilter;
  }

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

  // handle filter toggles
  useEffect(() => {
    console.log('deciding which data to filter');
    // if locations have been searched, filter the searched values, if not, filter all locations
    if (searchedAccessLocations){
      console.log('filtering searched data')
      setFilteredAccessLocations(applyFilterOptions([...searchedAccessLocations]));
    } else if (accessLocations) {
      console.log('filtering unsearched data')
      setFilteredAccessLocations(applyFilterOptions([...accessLocations]));
    }
  }, [displayFilters.hasCampground, displayFilters.hasBoating, displayFilters.isSandy, displayFilters.isRocky, searchedAccessLocations, displayFilters.county]);

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

  // sort accessLocations when dropdown changes
  useEffect(() => {
    console.log('displayFilters.sortDropdownValue changed')
    if (filteredAccessLocations) {
      setFilteredAccessLocations(prevLocations => sortAccessLocations(prevLocations));
    }
  }, [displayFilters.sortDropdownValue])


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

  // effect called when search by named value changes
  useEffect(() => {
    // if search bar is empty, set the searchedLocations to null
      // call our debounced search on the entire dataset
    debouncedFilterByName.current(accessLocations, displayFilters.searchInName);

  }, [displayFilters.searchInName])

  // handle change for sort dropdown
  const handleSortDropdownChange = (event, { value }) => {
    setDisplayFilters({...displayFilters, sortDropdownValue: value});
  }


  // function to filter locations that contain the search term in their name
  function filterByName(currentLocations, currentSearchTerm){
    console.log('searching by name');
    // if user empties search bar, reset searched locations to null so we know to apply filters off entire dataset instead of searched dataset
    if (currentSearchTerm === '') {
      console.log('Empty search, filter whole dataset instead');
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
            <Card 
              style={{margin: '0px 0px 10px 0px'}}
              key={loc.ID}
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

        ));
  }

  return (
      <div >
       {/* SORT AND FILTER OPTIONS -- ONLY DISPLAY WHEN THERE IS DATA TO SORT OR FILTER */} 
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #CCC', borderRadius: 5, marginBottom: 10}}>
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
          {/* ITEMS PER PAGE */}

          {/* <div style={{display: 'flex', position: 'relative', alignItems: 'center', maxWidth: 400, marginBottom: 10, border: '2px solid purple'}}> */}

            <div style={{position: 'relative', display: 'flex', width: '80%', boxSizing: 'border-box'}}>
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
                onChange={(e, {value}) => setDisplayFilters({...displayFilters, county: value})} 
                value={displayFilters.county}
              />
            </div>

          {/* FILTER ATTRIBUTE CHECKBOXES */}
          <div style={{marginTop: 10, display: 'flex', width: '100%', flexDirection: 'column'}}> 
            <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
              <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Boating' checked={displayFilters.hasBoating} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, hasBoating: checked})}/>
              <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Campground' checked={displayFilters.hasCampground} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, hasCampground: checked})}/>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
              <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Sandy shore' checked={displayFilters.isSandy} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, isSandy: checked, isRocky: false })}/>
              <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle label='Rocky shore' checked={displayFilters.isRocky} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, isRocky: checked, isSandy: false })}/>
            </div>
         
          </div>

            <div>
            <span style={{marginRight: 10, fontSize: 16}}>Items per page</span>
            <input 
              style={{maxWidth: 40, padding: 2, fontSize: 16, marginBottom: 10, textAlign: 'center'}} 
              type='number' value={displayFilters.itemsPerPage} 
              onChange={handlePagesToDisplayInputChange} 
              onClick={e => e.target.select()}
            />
          </div>
          </div>
          {/* END SORT AND FILER OPTIONS */} 
          
          {/* FETCH STATUS MESSAGES */} 
          {fetchStatus.loading && (<h1 className='page-title' style={{}}>Retreiving beach data from server...</h1>)}
          {fetchStatus.error && (<h1 className='page-title' style={{}}>Could not retreive beach data from server, please try again later...</h1>)}
           
          {/* BEACH DATA CARDS AND PAGINATION */}               
          {
            (!fetchStatus.loading && !fetchStatus.error && filteredAccessLocations) && (
              <>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {/* map our access locations, searched ones if they exist, otherwise just the filtered ones */}
                {mapAccessLocations(filteredAccessLocations) } 
                </div>   

              <div style={{border: '1px solid lightgrey', borderRadius: 5, height: 50,  display: 'flex', alignItems: 'stretch'}}>
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
              <div style={{display: 'flex', justifyContent: 'center', color: 'grey'}}>
                Total pages: {Math.ceil(filteredAccessLocations.length / displayFilters.itemsPerPage)}
              </div>
              
              </>
            )
          }
      </div>
  );

};




export default BeachAccessLocations;



/*


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