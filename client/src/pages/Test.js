import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { Card, Pagination, Dropdown, Input, Image, Checkbox } from 'semantic-ui-react';
import '../App.css';


// https://api.coastal.ca.gov/access/v1/locations/attribute/BOATING

const Test = (props) => {

  const [accessLocations, setAccessLocations] = useState(null);
  const [displayPage, setDisplayPage] = useState(1);
  const [displayFilters, setDisplayFilters] = useState({
    itemsPerPage: 15, 
    sortDropdownValue: 'Name A-Z', 
    hasCampground: false,
    hasBoating: false,
    isSandy: false,
    isRocky: false,
    show: false,
    searchInName: '',
  });

  const [fetchStatus, setFetchStatus] = useState({error: false, loading: true})
  const [loadingSearchInName, setLoadingSearchInName] = useState(false);
  // function to apply our filters after fetch
  const applyFilterOptions = unfilteredLocations => {
    // use this to prevent duplicating the array in case we don't need to sort
    console.log(displayFilters)
    let hasBeenFiltered = false;
    let filteredLocations = [];
    if (displayFilters.hasBoating) {
      console.log('filtering for boating options')
      filteredLocations = unfilteredLocations.filter(loc => loc.BOATING.toLowerCase() === "yes");
      hasBeenFiltered = true;
    }
    if (displayFilters.isRocky) {
      console.log('filtering for rocky shore')
      filteredLocations = filteredLocations.filter(loc => loc.RKY_SHORE.toLowerCase() === "yes");
      hasBeenFiltered = true;
    }
    if (displayFilters.isSandy) {
      console.log('filtering for sandy beach')
      filteredLocations = filteredLocations.filter(loc => loc.SNDY_BEACH.toLowerCase() === "yes");
      hasBeenFiltered = true;
    }
    return hasBeenFiltered ? filteredLocations : unfilteredLocations;
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log('fectch effect called');
      setFetchStatus({...fetchStatus, error: false});
      // default fetch all locations
      let fetchURL = 'https://api.coastal.ca.gov/access/v1/locations';
      if (displayFilters.hasCampground) {
        fetchURL = 'https://api.coastal.ca.gov/access/v1/locations/attribute/campground';
      }
      await fetch(fetchURL)
        .then(res => res.json())
        .then(json => {
          // filter our fetched data according to our currently set filters
          const filteredAccessLocations = applyFilterOptions(json);
          // sort fetched data according to sort order specified
          const sortedAccessLocations = [...filteredAccessLocations].sort((a, b) => {
            return a.NameMobileWeb > b.NameMobileWeb ? 1 
            : a.NameMobileWeb < b.NameMobileWeb ? -1 : 0;
          });
          setFetchStatus({...fetchStatus, loading: false});
          return setAccessLocations(sortedAccessLocations);
        })
        .catch(err => {
          setFetchStatus({...fetchStatus, error: true, loading: false});
          console.log(err)
        });
    }
    fetchData();
   
  }, [displayFilters.hasCampground, displayFilters.hasBoating, displayFilters.isSandy, displayFilters.isRocky]);

  function filterByName(){
    console.log('debounced');
    setLoadingSearchInName(false);
  }

  // need useRef to use debounce in a functional component
  const debouncedFilterByName = useRef(_.debounce(filterByName, 500)).current;

  // handle our filter by name input change
  const handleSearchInNameChange = (e) => {
    setLoadingSearchInName(true);
    setDisplayFilters({...displayFilters, searchInName: e.target.value})
    // function to debounce so we don't filter until after the user pauses typing
    debouncedFilterByName();
  };


  // sort accessLocations when dropdown changes
  useEffect(() => {
    console.log('displayFilters.sortDropdownValue changed')
    if (accessLocations) {
      switch (displayFilters.sortDropdownValue) {
        case 'Name A-Z':
          const ascendingName = [...accessLocations].sort((a, b) => {
            return a.NameMobileWeb > b.NameMobileWeb ? 1 
            : a.NameMobileWeb < b.NameMobileWeb ? -1 : 0;
          });
          setAccessLocations(ascendingName);
        break;

        case 'Name Z-A':
          const descendingName = [...accessLocations].sort((a, b) => {
            return a.NameMobileWeb < b.NameMobileWeb ? 1 
            : a.NameMobileWeb > b.NameMobileWeb ? -1 : 0;
          });;
          setAccessLocations(descendingName);
        break;

        default:
        break; 
      }
    }
  }, [displayFilters.sortDropdownValue])


  // handler for pagination change
  const handlePageChange = (event, data) => {
    setDisplayPage(data.activePage);
  };

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
  const counties = [
    "Orange",
    "Monterey",
    "Santa Cruz",
    "San Mateo",
    "Humboldt",
    "Los Angeles",
    "Marin",
    "San Diego",
    "Mendocino",
    "San Francisco",
    "Santa Barbara",
    "San Luis Obispo",
    "Del Norte",
    "Ventura",
    "Sonoma",
    "3_Central Coast",
    "Orange (and LA)"
  ];

  // handle setting pages to display filter
  const handlePagesToDisplayInputChange = (event, { value }) => {
    // setDisplayFilters(prevFilters => ({...prevFilters, itemsPerPage: value }))
    if (value < 1) value = 1;
    if (value > 50) value = 50;
    setDisplayFilters({...displayFilters, itemsPerPage: value});
  };

  // handle change for sort dropdown
  const handleSortDropdownChange = (event, { value }) => {

    setDisplayFilters({...displayFilters, sortDropdownValue: value});
  }

  

  return (
    <div className='home-page' style={{}}>
      <div style={{height: '94vh', overflowY: 'scroll'}}>
      {
        accessLocations && (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          
          <div style={{display: 'flex', marginTop: 10}}>
            <span style={{marginRight: 10}}>Sort by</span>
            <Dropdown 
              inline 
              style={{marginBottom: 10}} 
              options={sortOptions}
              onChange={handleSortDropdownChange} 
              value={displayFilters.sortDropdownValue}
            />
          </div>
          <div>
            <span style={{marginRight: 10}}>Items per page</span>
            <Input size='small' style={{maxWidth: 75, marginBottom: 10}} min={1} max={50} type='number' value={displayFilters.itemsPerPage} onChange={handlePagesToDisplayInputChange} />
          </div>

          {/* TEXT INPUT TO FILTER NAMES */}
          <div style={{width: 400, marginBottom: 10}}>
            <div style={{position: 'relative', width: 250}}>
            {/* DIV FOR LOADING ANIMATION */}
            <div 
              className='animate-spinner'
              style={{
                display: loadingSearchInName ? '' : 'none',
                position: 'absolute',
                borderRadius: '50%', border: '6px solid lightgrey', borderTop: '6px solid lightblue',
                right: 2, bottom: 2, 
                height: 26, width: 26
              }} 
            />
              <input
                placeholder='Name contains' 
                style={{border: '1px solid gray', borderRadius: 5, width: 250, height: 30, fontSize: 16, padding: '5px 30px 5px 5px'}}
                type='text' 
                name='searchInName' 
                value={displayFilters.searchInName} 
                onChange={handleSearchInNameChange} 
              />
            </div>
          </div>
          {/* FILTER ATTRIBUTE CHECKBOXES */}
          <div style={{width: 400, marginBottom: 10}}> 
            <Checkbox toggle style={{display: 'block', marginBottom: 8}} label='Boating' checked={displayFilters.hasBoating} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, hasBoating: checked})}/>
            <Checkbox toggle style={{display: 'block', marginBottom: 8}} label='Campground' checked={displayFilters.hasCampground} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, hasCampground: checked})}/>
            <Checkbox toggle style={{marginBottom: 8, marginRight: 15}} label='Sandy shore' checked={displayFilters.isSandy} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, isSandy: checked, isRocky: false })}/>
            <Checkbox toggle style={{marginBottom: 8}} label='Rocky shore' checked={displayFilters.isRocky} onChange={(e, { checked }) => setDisplayFilters({...displayFilters, isRocky: checked, isSandy: false })}/>
            </div>


          
          {fetchStatus.loading && <h1 className='page-title'>Retreiving beach data from server...</h1>}
          {fetchStatus.error && <h1 className='page-title'>Could not retreive beach data from server, please try again later...</h1>}

          {
            !fetchStatus.loading && 
              accessLocations
              .slice(displayPage * displayFilters.itemsPerPage - displayFilters.itemsPerPage , displayPage * displayFilters.itemsPerPage)
              .map(loc => (
                <div key={loc.ID} style={{width: 400, marginBottom: 10}}>
                  <Card 
                    fluid
                  >
                    <Card.Content>
                    <Card.Header>{loc.NameMobileWeb}</Card.Header>
                    <Card.Meta>County: {loc.COUNTY}</Card.Meta>
                    <Card.Meta>{loc.ID}</Card.Meta>
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
              ))
          }
        <div>
          <Pagination boundaryRange={1} onPageChange={handlePageChange} activePage={displayPage} totalPages={Math.ceil(accessLocations.length / displayFilters.itemsPerPage)} />
        </div>
        </div>
        )
      }
      </div>
    </div>
  );

};


export default Test;



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