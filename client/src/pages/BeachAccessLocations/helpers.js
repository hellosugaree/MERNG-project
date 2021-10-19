import MarkerClusterer from '@googlemaps/markerclustererplus';

// function to sort access locations
const sortAccessLocations = (locations, filters) => {
  const { sortDropdownValue } = filters;
  console.log('sorting');
  switch (sortDropdownValue) {
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

  // function to filter locations that contain the search term in their name
  export const filterByName = (locations, currentSearchTerm) => {
    console.log('searching by name');
    // if user empties search bar, reset searched locations to null so we know to apply filters off entire dataset instead of searched dataset
    if (currentSearchTerm === '') {
      console.log('Empty search, setting searched locations to null');
      return locations;
    } else {
      console.log(`Pre filtered locations: ${locations.length}`);
      const filteredByName = locations.filter(loc => {
        // returns true of any part of name contains search value
        return loc.NameMobileWeb.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1
      });      
      console.log(`Post filtered locations: ${filteredByName.length}`);
      return filteredByName;
    }
  }



export const applyFilters = (locations, filters) => {
  const { county, hasBoating, isRocky, isSandy, hasCampground, searchInName } = filters;
  let filteredLocations = filterByName(locations, searchInName);
  filteredLocations = county !== 'All counties' ? filteredLocations.filter(loc => loc.COUNTY === county) : filteredLocations;
  filteredLocations = hasBoating ? filteredLocations.filter(loc => loc.BOATING.toLowerCase() === "yes") : filteredLocations;
  filteredLocations = isRocky ? filteredLocations.filter(loc => loc.RKY_SHORE.toLowerCase() === "yes") : filteredLocations;
  filteredLocations = isSandy ? filteredLocations.filter(loc => loc.SNDY_BEACH.toLowerCase() === "yes") : filteredLocations;
  filteredLocations = hasCampground ? filteredLocations.filter(loc => loc.CAMPGROUND.toLowerCase() === "yes") : filteredLocations;
  console.log(filteredLocations)
  filteredLocations = sortAccessLocations(filteredLocations, filters);
  return filteredLocations;  
}


export const generateMarkers = (mapRef, infoWindowRef, filteredAccessLocations) => {
  const markers = [];
  
  filteredAccessLocations.forEach(location => {
    if (location.LATITUDE && location.LONGITUDE) {
      // const marker = { position: { lat: location.LATITUDE, lng: location.LONGITUDE }, id: location.ID };
      const marker = new window.google.maps.Marker({
        position: { lat: location.LATITUDE, lng: location.LONGITUDE }, 
        // map: mapRef.current,
      });
      // create an info window for the marker
      const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'
      const infoJSX = `
        <div class="map-tooltip-catch">
          <div style='${infoDivStyle}'><b>${location.NameMobileWeb}</b></div>
          <div style='${infoDivStyle}; color: grey'>${location.COUNTY}</div>
          <div style='${infoDivStyle}; color: grey'>${location.DescriptionMobileWeb}</div>
          <div class="map-tooltip-image-container">
          ${ location.Photo_1 && 
            `<img 
              class="beach-tooltip-image" 
              alt='location'
              src=${location.Photo_1}
            />`
          }
          </div>                      
        </div>
      `;
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoJSX,
      });
      // add a click listener to the catch marker
      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // open the info window for this marker
        infoWindow.open(mapRef.current, marker);
        // set the ref for this window so we can close it on map click
        infoWindowRef.current = infoWindow;
        //highlight the catch
      }); 
      markers.push(marker);
    }
  });
  return markers;
};

export const generateMarkerClusters = (markers, markerClusterRef, mapRef) => {
  if (markerClusterRef.current) {
    markerClusterRef.current.clearMarkers();
  }
  
  markerClusterRef.current = new MarkerClusterer(mapRef.current, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    maxZoom: 20,
    averageCenter: true,
    gridSize: 50,
  });

  markerClusterRef.current.fitMapToMarkers();

  // const clustersBounds = markerClusterRef.current.clusters_.map(cluster => cluster.bounds);
  // console.log(markerClusterRef.current)
  // console.log(markerClusterRef.current.clusters_)
  // console.log(Object.keys(markerClusterRef.current))
};



    

export const sortOptions = [
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
  export const countyDropdownOptions = [
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



export const defaultFilters = {
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
};


