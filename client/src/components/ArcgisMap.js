/*
import React from 'react';
import esriConfig from "@arcgis/core/config.js";
import Map from '@arcgis/core/Map';
import MapView from "@arcgis/core/views/MapView"


import '../App.css';
 esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY;

const ArcgisMap = (props) => {



 
  console.log(process.env.REACT_APP_ARCGIS_API_KEY);

  const map = new Map({
    basemap: "arcgis-topographic", // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [ 33.4672, -117.6981],
    zoom: 13,
    container: 'viewDiv'
  })

  const handleClick = () => {

  };

  return (
    <>
        <div id='viewDiv' style={{height: '100%', width: '100%'}}></div>
    </>
    
  );

};


// console.log(Object.keys(loader))

export default ArcgisMap;



      

      <br/><br/><br/><br/><br/>
      <button type='button' onClick={handleClick}>skhskh</button>

      */
     