import React, { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';



const WeatherFeed = (props) => {
  
  const [ weatherData, setWeatherData ] = useState();

  useEffect(() => {
    const getForecast = async pos => {
      const forecastUrl = await fetch(`https://api.weather.gov/points/${pos.coords.latitude},${pos.coords.longitude}`)
        .then (res => res.json())
        .then (jsonData => {
          console.log(`JSON data:\n${jsonData}`);
          return jsonData.properties.forecast;
        })  
        .catch(error => console.log(error));
        console.log(`forecast URL: ${forecastUrl}`)
        const forecast = await fetch(forecastUrl)
          .then (response => response.json())
          .then (jsonData => jsonData)
          .catch(error => console.log(`error: ${error}`));
        if (forecast){
          console.log(forecast.properties.periods)
          setWeatherData([...forecast.properties.periods]);
        }
        
    };

    navigator.geolocation.getCurrentPosition(pos => {
      getForecast(pos);
    }, error => console.log(error));

  }, []);


  return (
    <div style={{ maxWidth: 400, margin: '0px auto'}}>
      {!weatherData && <h1 className='page-title'>Loading forecast...</h1>}
      {weatherData && weatherData.slice(0,6).map(period => (
        <WeatherCard key={period.number} weatherImage={period.icon} forecastDay={period.name} shortForecast={period.shortForecast} forecastDescription={period.detailedForecast}/>
      ))}
    </div>
  );
};


export default WeatherFeed;