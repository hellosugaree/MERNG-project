import { createRef } from 'react';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { DateTime, Interval } from 'luxon';

// generate refs for our catch cards
export const createCatchCardRefs = (catches, catchCardRefs) => {
  // clear previous refs
  catchCardRefs.current = {};
  // create a ref with key of the catch id
  catches.forEach(catchObj => {
    catchCardRefs.current[catchObj.id] = createRef();
  });
}

// create and set our species list to be used for species filters 
export const createSpeciesList = (catches) => {
  const species = [];
  // create list of unique species from catch cards
  catches.forEach(catchObj => {
    if (species.indexOf(catchObj.species) < 0) {
      species.push(catchObj.species);
    }
  });
  return species;
};

// calculate our map bounds based on the catch data so we can contain the data within the map
export const calculateBounds = (catchData) => {
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

export const generateMarkerClusters = (markers, markerClusterRef, mapRef) => {
  if (markerClusterRef.current) {
    markerClusterRef.current.clearMarkers();
  }
  console.log('generating marker clusters');
  const markerStyles = [
    MarkerClusterer.withDefaultStyle({
      url: "../img/markerclusterer/m1.png",
      height: 53,
      width: 53,
      textColor: "#000000",
      textSize: 15,
      maxZoom: 10,
    }),  
    MarkerClusterer.withDefaultStyle({
      url: "../img/markerclusterer/m2.png",
      height: 56,
      width: 56,
      textColor: "#000000",
      textSize: 15,
      maxZoom: 10,
    }),  
    MarkerClusterer.withDefaultStyle({
      url: "../img/markerclusterer/m3.png",
      height: 66,
      width: 66,
      textColor: "#FFFFFF",
      textSize: 15,
      maxZoom: 10,
    }),  
    MarkerClusterer.withDefaultStyle({
      url: "../img/markerclusterer/m4.png",
      height: 78,
      width: 78,
      textColor: "#FFFFFF",
      textSize: 15,
      maxZoom: 10,
    }),
    MarkerClusterer.withDefaultStyle({
      url: "../img/markerclusterer/m5.png",
      height: 90,
      width: 90,
      textColor: "#FFFFFF",
      textSize: 15,
      maxZoom: 10,
    }),      
  ];
  markerClusterRef.current = new MarkerClusterer(mapRef.current, markers, {
    styles: markerStyles,
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

    speciesText = speciesText.substring(0, speciesText.length - 2);

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


// function to generate markers on the map for our currently selected catches
export const createMarkers = (catches, catchMarkersRef, infoWindowRef, mapRef, markerClusterRef, setHighlightedCatch) => {
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
        <div class="map-tooltip-catch">
          <div style='${infoDivStyle}'><b>${catchObj.species}</b></div>
          <div style='${infoDivStyle}; color: grey'>${DateTime.fromMillis(Date.parse(catchObj.catchDate)).toRelative()}</div>
          ${catchObj.catchLength ? `<div style='${infoDivStyle}'>Length: ${catchObj.catchLength}</div>` : ``}
          ${catchObj.fishingType ? `<div style='${infoDivStyle}'>${catchObj.fishingType}</div>` : ``}
          <div class="map-tooltip-image-container">
          ${catchObj.images && catchObj.images.length > 0 && catchObj.images.map(image => {
            return `<img 
              key={image.asset_id}
              class="map-tooltip-catch-image" 
              alt='catch'
              src=${`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_130,h_150/${image.public_id}.jpg`}
              style={{borderRadius: 10, padding: 5}}
              />`
          })}    
          </div>        
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
  // catchMarkersRef.current = markers;
  generateMarkerClusters(markers, markerClusterRef, mapRef);
  // center our map around the catch bounds
  if (catches.length > 0) {
    markerClusterRef.current.fitMapToMarkers(50);
  }
}

export const generateFileDataArray = async (fileList) => {
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
  return data;
};

export const applyFilters = (data, filters) => {
  console.log('applying filters')
  let filteredData = [];
  // SPECIES FILTERS
  if (filters.species.length > 0) {
    data.forEach(catchObj => {
      // each catch against the species filter array and push species that match into the filtered data array
      if (filters.species.indexOf(catchObj.species) >-1) {
        filteredData.push(catchObj);
      }
    });
  } else {
    // no species filters, so pass all catch data onto the next set of filters
    filteredData = [...data];
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
  return filteredData;  
};


// show instructions info window
const formInstructionsStyle = 'padding-bottom: 10px; font-size: 18px;'
export const formInstructionsJSX = `
  <div style='width: 400px'>
    <div style='${formInstructionsStyle}'><b>How to use the map to log a catch</b></div>
    <div style='font-size: 16px;'>There are several ways to select your catch position:</div>
      <ul style='font-size: 16px; margin: 0px'>
        <li style='padding-top: 5px;'>Manually drag the map to positon your catch</li>                   
        <li style='padding-top: 5px;'>Use the search bar to find a location (e.g. "San Clemente Pier")</li>      
        <li style='padding-top: 5px;'>Use the search bar to enter GPS coordinates in decimal degrees (e.g. "33.419095, -117.62117") </li>
      </ul>                
  </div>`;


// create custom control elements to send to our map
// create a custom button for our map to get location
export const getCurrentLocationButton = document.createElement('button');
getCurrentLocationButton.classList.add("custom-map-control-button");
getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';

export const toggleMarkerClustersButton = document.createElement('button');
toggleMarkerClustersButton.classList.add("custom-map-control-button");
toggleMarkerClustersButton.innerHTML=``;

const acceptCatchLocationButton = document.createElement('button');
acceptCatchLocationButton.classList.add("custom-map-control-button");
acceptCatchLocationButton.innerHTML=`Accept Catch Location`;
export { acceptCatchLocationButton };