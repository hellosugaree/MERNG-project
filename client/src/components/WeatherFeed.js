import React, { useState, useEffect } from 'react';
import { staticGridData } from '../staticDataForTesting/staticData';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter, VictoryLabel } from 'victory';
import { Card, Icon } from 'semantic-ui-react';
import WeatherCard from './WeatherCard';
import LoaderFish from './LoaderFish';
import GoogleMap from './GoogleMap';
import { useGoogleMap } from '../utilities/hooks';
import { DateTime, Duration } from 'luxon';

import '../App.css';

const selectLocationButton = document.createElement('button');
selectLocationButton.classList.add('custom-map-control-button');
selectLocationButton.innerHTML='Get Weather';





// 33.4672,-117.6981
// water 33.408922,-117.838593

// return meta about a point
// https://api.weather.gov/points/33.408922%2C-117.838593


// if marine forecast not support message, hit the grid data for detailed marine data
// "forecastGridData": "https://api.weather.gov/gridpoints/LOX/164,13",


// successful response to first fetch should give various forecast urls
// properties: 
// forecast: "https://api.weather.gov/gridpoints/SGX/22,36/forecast"
// forecastGridData: "https://api.weather.gov/gridpoints/SGX/22,36"
// forecastHourly: "https://api.weather.gov/gridpoints/SGX/22,36/forecast/hourly"
// forecastOffice: "https://api.weather.gov/offices/SGX"
// forecastZone: "https://api.weather.gov/zones/forecast/PZZ775"

const WeatherFeed = (props) => {
  
  const defaultFetchStatus = { loading: true, error: null };
  const defaultWeatherData = { type: null, data: null };


  // temporary for getting the grid forecast going
  const [processedGridData, setProcessedGridData] = useState(null);

  const [weatherData, setWeatherData] = useState({ type: null, data: null });
  const [fetchStatus, setFetchStatus] = useState(defaultFetchStatus);
  const [locationDetails, setLocationDetails] = useState({city: null, state: null})
  const { loadMap, apiStatus, basicControls, mapRef, mapContainerRef, center } = useGoogleMap();

  const controls = basicControls;

  controls.push({ position: 'BOTTOM_CENTER', element: selectLocationButton, listeners: [{event: 'click', callback: handleSelectLocationButtonClick}] });


  //https://api.weather.gov/gridpoints/SGX/44,52/forecast



  // type defaults to forecast. If forecast is unavailable, or we get a marine error in the second fetch, we will fetch and display grid forecastGridData
  const getForecastUrl = async (pos) => {
    setFetchStatus(defaultFetchStatus);
    setWeatherData(defaultWeatherData);
    let forecastUrl = { standard: null, grid: null };
    // status for the first api call to get the point data which should include forecast urls
    let error = null;
    await fetch(`https://api.weather.gov/points/${pos.lat},${pos.lng}`)
      .then (res => {
        if (!res.ok) {
          error = true;
        }    
        return res.json();      
      })
      .then (json => {
        // failed to get any data from first fetch
        if (error) {
          error = true;
          return null;
        }
        // setLocationDetails({city: jsonData.properties.relativeLocation.properties.city, state: jsonData.properties.relativeLocation.properties.state });
        forecastUrl = {standard: json.properties.forecast, grid: json.properties.forecastGridData}
      })  
      .catch(error => {
        // console.log(error);
        // setFetchStatus({loading: false, error: { message: 'Failed to retreive data from NOAA'} });
      });
    return { url: forecastUrl, error };
  };

  
  const getGridForecast = async gridUrl => {
    let fetchSuccess = false;
    await fetch(gridUrl)
      .then(response => {
        if (response.ok) {
          fetchSuccess = true;
        }
        return response.json()
      })
      .then(json => {
        if (fetchSuccess) {
          setFetchStatus({ loading: false, error: null });
          setWeatherData({ type: 'grid', data: json.properties });
        //   console.log(JSON.stringify(json.properties, null, 4))
          processGridData(json.properties);
        } else {
          // handle errors in grid forecast response
          if (json.status === 500) {
            setFetchStatus({ loading: false, error: { code: 500, message: 'Weather server error, please try again later' }})
          }
          if (json.status === 404) {
            setFetchStatus({ loading: false, error: { code: 404, message: 'Forecast unavailable for this location' } })
          }
        }
      })
      .catch(err => console.log(err));
  };

  const getForecast = async pos => {
    // first fetch request gets the appropriate forecast URL.
    const forecastUrl = await getForecastUrl(pos);
    // console.log(forecastUrl);

    // no errors getting the url
    if (!forecastUrl.error) {
      // a standard forecast url is available
      const { standard, grid } = forecastUrl.url;
      if (standard) {
        await fetch(standard)
        .then (response => {
          return response.json()
        })
        .then (jsonData => {
          // periods forecast available
          if (jsonData.properties && jsonData.properties.periods) {
            setFetchStatus({ loading: false, error: false, type: 'periods' });
            setWeatherData({ type: 'periods', data: [...jsonData.properties.periods] });
          } else {
            // periods unavailable for this location, try grid
            if (grid) {
              getGridForecast(grid);
            } else {
              // grid url also unavailable, so can't get weather for this location
              setFetchStatus({loading: false, error: { message: 'Forecast unavailable for this location' } })
            }

          }
        })
        .catch(error => {
          console.log(`error: ${error}`)
          setFetchStatus({loading: false, error: true});
        });    
      } 
      // standard forecast url not available, check for grid url
      else if (grid) { 
        getGridForecast();
      } else {
        // no forecast urls available for this position, so cant get weather for this location
        setFetchStatus({ loading: false, error: { message: 'Forecast unavailable for this location' } });
      }    
    } else {
      // error getting forecast url
      setFetchStatus({ loading: false, error: { message: 'Unable to retreive forecast from server. Please try again later' } });
    }
  };

  // load the map
  useEffect(() => {
    if (!window.google) {
      loadMap();
    }
  }, [loadMap]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      getForecast({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, error => console.log(error));
  }, []);

  function handleSelectLocationButtonClick() {
    getForecast(mapRef.current.getCenter().toJSON());
  }

  // function to flatten the grid data object into an array of days with all data types for each day
  function processGridData (forecastData = staticGridData) {
    // first construct and array with object dates for the next few days
    const today = DateTime.now();
    const days = [];
    const keysToMap = ['temperature', 'primarySwellDirection', 'primarySwellHeight', 'windWaveHeight', 'wavePeriod2', 'secondarySwellDirection', 'secondarySwellHeight', 'wavePeriod', 'waveHeight', 'weather', 'windGust', 'windSpeed', 'windDirection', 'skyCover' ];
    for (let i = 0; i <= 5; i++) {
      // add a day to today's date for each iteration
      const thisDay = today.plus({days: i}).toObject();
      days.push({ date: thisDay });
    }
    // remap the data so it's stored by date

    keysToMap.forEach(key => {
      // push an empty array for this forecast key into each day
      days.forEach(dayObject => dayObject[key] = []);
      // if there's data for this forecast component, then map it back to days
      if (forecastData[key].values.length > 0){
        forecastData[key].values.forEach(dataPoint => {

          // first get an array of date objects with a unique day
          // final processed data should look like this:
          /* 
          [
            { 
              date: {year, month, day},
              temperature: [{startTime, tempValue}, {startTime, tempValue}]
            }
          ] 
          */

          const [isoTime, isoDuration] = dataPoint.validTime.split('/');
          const startTime = DateTime.fromISO(isoTime);
          const durationInHours =  Duration.fromISO(isoDuration).shiftTo('hours').toObject().hours;
          console.log(`key: ${key}, time: ${JSON.stringify(isoTime)}, duration: ${JSON.stringify(durationInHours)}`);
          
          // if there is a duration longer than 1h, we need to create an array of new data points containing a new data point for each hour of the duration
          for (let i = 0; i <= durationInHours; i++) {
            // add an hour to the start time for every iteration to get a new hour timepoint so we can spread the data over the duration
            const currentInterval = startTime.plus({ hours: 1 * i }).toObject();
            // find the day in the days array that matches the current interval day
            const dayIndex = days.findIndex(item => item.date.year === startTime.year && item.date.day === startTime.day && item.date.month === startTime.month );
            if (dayIndex > -1) {
              // add the data to the appropriate day
              days[dayIndex][key].push({ startTime: currentInterval, value: dataPoint.value });
            }  

          }
        });
      }
    });
    // set max and min temp for each day
    days.forEach(day => {
      if (day.temperature.length > 0) {
        // extract the temps for the day
        const dailyTemps = day.temperature.map(temperatureObject => temperatureObject.value)
        day.tempHigh = Math.max(...dailyTemps);
        day.tempLow = Math.min(...dailyTemps);
      }
    })
    setProcessedGridData(days);
  };

  // generate a chart from processed grid data
  function generateLineChart(data, label, unit, valueMultiplier = 1, valueAdded = 0) {
    const processedData = [];
    data.forEach(dataObject => {
      const hour = dataObject.startTime.hour;
      processedData.push({ hour: hour, value: dataObject.value * valueMultiplier + valueAdded });
      if (label==='swell height') {
        console.log(`Swell height for ${dataObject.startTime.month}-${dataObject.startTime.day}: ${dataObject.value}`);
      }
      // processedData.push({hour: new Date(DateTime.fromObject(dataObject.startTime).toISO()), value: dataObject.value});
    });
    //tickFormat={['12AM', '6AM', '12PM', '6PM', '12PM']}
    //domain={{x: [0, 23]}} tickCount={6}
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span><b>{`${label} in ${unit}`}</b></span>
        <VictoryChart 
          height={150} 
          padding={{top: 10, left: 30, right: 30, bottom: 30}}
          minDomain={{ y: 0 }}
          maxDomain={{ y: Math.max(...processedData.map(object => object.value)) * 1.1 }}
        >
          <VictoryAxis 
            tickValues={[0, 6, 12, 18, 24]} 
            tickFormat={t => {
              switch (t) {
                case 0:
                return '12AM';
                break;
                case 6:
                  return '6AM';
                break;
                case 12:
                  return '12PM';
                break;
                case 18:
                  return '6PM';
                break;
                case 24:
                  return '12AM';
                break;
              }
            }}
            style={{
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 14, padding: 0}
            }} 
          />
          <VictoryAxis 
            dependentAxis={true}
            style={{
              padding: {top: 20, bottom: 50},
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 14, padding: 0}
            }} 
          />
          <VictoryLine interpolation='monotoneX' x='hour' y='value' domain={{x: [0, 24]}} data={processedData}  />
          {/* <VictoryScatter x='hour' y='value' domain={{x: [0, 24]}} data={processedData}  /> */}

          {/* <VictoryLine x='hour' y='value' scale={{x: "time", y: "linear"}} data={processedData} /> */}
        </VictoryChart>
      </div>
    );
  }

  /*

            style={{
              axis: {stroke: "#756f6a"},
              axisLabel: {fontSize: 20},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 15, padding: 5}
            }} 
  */




  return (
    <div style={{display: 'flex',  height: '100%', paddingRight: 75}}>

    <div className='map-container' style={{width: 300, height: 800}}>
      <div id='map' ref={mapContainerRef}>
        {(!apiStatus.loading && !apiStatus.errors) && 
          <GoogleMap 
            showCenterMarker={true}
            mapRef={mapRef} 
            mapContainer={mapContainerRef} 
            center={center}
            zoom={8} 
            controls={controls}
            options={{
              scaleControl: true,
              mapTypeControl: true,
            }}
          />
        }
      </div>
    </div>

    <div style={{ width: 450, padding: '0px 10px', height: 800, overflowY: 'auto'}}>
      <button type='button' onClick={processGridData}>test log</button>

      {fetchStatus.loading && !fetchStatus.error && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}><LoaderFish/><h1>Loading forecast...</h1></div>}
      
      {!fetchStatus.loading && fetchStatus.error && 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <h2>Error loading forecast...</h2>
          {fetchStatus.error.status === 500 && <h3>Weather server error</h3>}
          {fetchStatus.error.message && <h3>{fetchStatus.error.message}</h3>}
        </div>
      }
      
      {!fetchStatus.loading && !fetchStatus.error && weatherData.type === 'periods' && weatherData.data.slice(0,6).map(period => (
        <WeatherCard key={period.number} weatherImage={period.icon} forecastDay={period.name} shortForecast={period.shortForecast} forecastDescription={period.detailedForecast}/>
      ))}

      {!fetchStatus.loading && !fetchStatus.error && weatherData.type === 'grid' && processedGridData && processedGridData.map(date => 
        <Card fluid key={DateTime.fromObject(date.date).toISODate()} style={{border: '2px solid gray'}}>
          <Card.Content>
            <Card.Header>{DateTime.fromObject(date.date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</Card.Header>
            {date.tempHigh && <div><Icon name='thermometer' /> {date.tempHigh*9/5+32}</div>}
            {date.tempLow && <div><Icon name='thermometer empty' /> {date.tempLow*9/5+32}</div>}
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {date.temperature.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px', margin: '5px 0px 5px 0px'}}>
                  {generateLineChart(date.temperature, 'temperature', 'deg F', 1.8, 32 )}
                </div>
              }
              {date.skyCover.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                  {generateLineChart(date.skyCover, 'Sky cover', '%')}
                </div>
              }              
              {date.windSpeed.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                 {generateLineChart(date.windSpeed, 'wind speed', 'km/h')}
                </div>
              }
              {date.primarySwellHeight.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                  {generateLineChart(date.primarySwellHeight, 'swell height', 'ft', 3.28084)}
                </div>
              }
              {date.windWaveHeight.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                 {generateLineChart(date.windWaveHeight, 'wind wave height', 'ft', 3.28084)}
                </div>
              }
            </div>
          </Card.Content>
        </Card>  
      )}

    </div>

    </div>

  );
};

export default WeatherFeed;

//    const keysToMap = ['temperature', 'primarySwellDirection', 'primarySwellHeight', 'windWaveHeight', 'wavePeriod2', 'secondarySwellDirection', 'secondarySwellHeight', 'wavePeriod', 'waveHeight', 'weather', 'windGust', 'windSpeed', 'windDirection', 'skyCover' ];
//2021-06-18T10:00:00.000-07:00




/* 

            {date.windDirection.length > 0 && 
              <div>
                <span style={{padding: '0px 0px 5px 0px'}}>Wind Direction</span>
                <div style={{display: 'flex'}}>
                  {date.windDirection.map(dataObject => 
                    <div key={JSON.stringify(dataObject.startTime)} style={{display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                      <div style={{padding: '0px 5px', fontSize: 13}}>
                        {DateTime.fromObject(dataObject.startTime).toLocaleString(DateTime.TIME_SIMPLE)}
                      </div>
                      <div>
                        {dataObject.value}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{border: '1px solid grey'}}>
                {generateLineChart(date.windDirection, 'wind direction', 'deg')}
                </div>
                
              </div>
            }


// map the detailed temperatures
            {
              date.temperatures.map(tempObj => 
                <div key={DateTime.fromObject(tempObj.startTime).toString()}>
                  <div>{DateTime.fromObject(tempObj.startTime).toLocaleString(DateTime.TIME_SIMPLE)}</div>
                  <div>{tempObj.value} C</div>
                </div>
              )
            }



        <WeatherCard key={date.date}forecastDay={date.date} shortForecast={'placeholder'} 
          forecastDescription={() => {
            date.temperature.map(tempObj => 
              <div>
              <div>{tempObj.startTime.hours}:{tempObj.startTime.minutes}</div>
              <div>{tempObj.value} C</div>
              </div>
            )
          }} 
        /> 














              {date.windSpeed.length > 0 && 
                <div>
                  <span style={{padding: '0px 0px 5px 0px'}}>Wind speed</span>
                  <div style={{display: 'flex'}}>
                    {date.windSpeed.map(dataObject => 
                      <div key={JSON.stringify(dataObject.startTime)} style={{display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                        <div style={{padding: '0px 5px', fontSize: 13}}>
                          {DateTime.fromObject(dataObject.startTime).toLocaleString(DateTime.TIME_SIMPLE)}
                        </div>
                        <div>
                          {Math.round(dataObject.value/1.609)} mph
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                   {generateLineChart(date.windSpeed, 'wind speed', 'km/h')}
                  </div>

                </div>
              }





        */