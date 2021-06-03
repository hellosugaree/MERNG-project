import React, { useEffect } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import JSON_ACCESS_LOCATIONS from '../utilities/locations.js';


import '../App.css';


const ArcgisMap = (props) => {
  let map;
  const additionalOptions = {};


  const loader = new Loader({
    apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
    version: "weekly"
  });

  loader.load().then(() => {
    const google = window.google;
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 33.4672, lng: -117.6981 },
      zoom: 8,
      ...additionalOptions
    });
    map.data.loadGeoJson('../utilities/locations.json');
  });

  const handleClick = () => {
    console.log(map);
  };

  return (
    <div className='home-page'>
      <div className='map-container'>
        <div id='map'/>
      </div>
      

      <br/><br/><br/><br/><br/>
      <button type='button' onClick={ handleClick }>skhskh</button>

    </div>
    
  );

};


// console.log(Object.keys(loader))

export default GoogleMap;