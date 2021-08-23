import React, { useState, useEffect } from 'react';
import { staticGridData } from '../staticDataForTesting/staticData';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter, VictoryLegend, VictoryLabel, VictoryBar } from 'victory';
import { Card, Icon, Checkbox } from 'semantic-ui-react';
import WeatherCard from './WeatherCard';
import LoaderFish from './LoaderFish';
import ArrowPoint from './chart/ArrowPoint';
import { ArrowLegendComponent } from './chart/LegendComponents';
import TemperaturePoint from './chart/TemperaturePoint';
import { useGoogleMap2, useGoogleAutocomplete } from '../utilities/hooks';
import { DateTime, Duration } from 'luxon';

import '../App.css';
import { isNonEmptyArray } from '@apollo/client/utilities';

// console.log(staticDayData[1])
// 33.4672,-117.6981
// water 33.408922,-117.838593monotoneX

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

const selectLocationButton = document.createElement('button');
selectLocationButton.classList.add('custom-map-control-button');
selectLocationButton.innerHTML='Get Weather';

const HorizontalBarDataLabel = props => {
  console.log(props);
  // let x = props.data.scale.y((props.data.datum._y + props.data.datum._y0)/2);
  // center the label without putting it out of chart range
  // if (x < 50) {
  //   x = 50
  // }
  // if (x > 200) {
  //   x = 200;
  // }
  // console.log(x)
  return <VictoryLabel 
    textAnchor='middle' {...props} 
    style={{fontSize: 11}}
    y={props.data.scale.x(props.data.datum._x)} 
    dy={-12} 
    x={props.data.width / 2} 
  />
};

const generateHazardLabel = (phenomenonCode, significanceCode) => {
  // decode the hazard phenmonen and significance keys according to NOAA codes https://www.weather.gov/bmx/vtec
  // return a string label eg "Small Craft Advisory"

  let hazardLongName = ''; 
  let significanceLongName = '';
  switch (phenomenonCode) {
    case 'BZ': 
      hazardLongName = 'Blizzard';
      break;
    case 'WS': 
      hazardLongName = 'Winter Storm';
      break;
    case 'WW Winter Weather': 
      hazardLongName = 'undefined';
      break;
    case 'SN': 
      hazardLongName = 'Snow';
      break;
    case 'HS': 
      hazardLongName = 'Heavy Snow';
      break;
    case 'LE': 
      hazardLongName = 'Lake Effect Snow';
      break;
    case 'LB': 
      hazardLongName = 'Lake Effect Snow & Blowing Snow';
      break;
    case 'BS': 
      hazardLongName = 'Blowing/Drifting Snow';
      break;
    case 'SB': 
      hazardLongName = 'Snow & Blowing Snow';
      break;
    case 'IP': 
      hazardLongName = 'Sleet';
      break;
    case 'HP': 
      hazardLongName = 'Heavy Sleet';
      break;
    case 'ZR': 
      hazardLongName = 'Freezing Rain';
      break;
    case 'IS': 
      hazardLongName = 'Ice Storm';
      break;
    case 'FZ': 
      hazardLongName = 'Freeze';
      break;
    case 'ZF': 
      hazardLongName = 'Freezing Fog';
      break;
    case 'FR': 
      hazardLongName = 'Frost';
      break;
    case 'WC': 
      hazardLongName = 'Wind Chill';
      break;
    case 'EC': 
      hazardLongName = 'Extreme Cold';
      break;
    case 'WI': 
      hazardLongName = 'Wind';
      break;
    case 'HW': 
      hazardLongName = 'High Wind';
      break;
    case 'LW': 
      hazardLongName = 'Lake Wind';
      break;
    case 'FG': 
      hazardLongName = 'Dense Fog';
      break;
    case 'SM': 
      hazardLongName = 'Dense Smoke';
      break;
    case 'HT': 
      hazardLongName = 'Heat';
      break;
    case 'EH': 
      hazardLongName = 'Excessive Heat';
      break;
    case 'DU': 
      hazardLongName = 'Blowing Dust';
      break;
    case 'DS': 
      hazardLongName = 'Dust Storm';
      break;
    case 'FL': 
      hazardLongName = 'Flood';
      break;
    case 'FF': 
      hazardLongName = 'Flash Flood';
      break;
    case 'SV': 
      hazardLongName = 'Severe Thunderstorm';
      break;
    case 'TO': 
      hazardLongName = 'Tornado';
      break;
    case 'FW': 
      hazardLongName = 'Fire Weather';
      break;
    case 'RH': 
      hazardLongName = 'Radiological Hazard';
      break;
    case 'VO': 
      hazardLongName = 'Volcano';
      break;
    case 'AF': 
      hazardLongName = 'Volcanic Ashfall';
      break;
    case 'AS': 
      hazardLongName = 'Air Stagnation';
      break;
    case 'AV': 
      hazardLongName = 'Avalanche';
      break;
    case 'TS': 
      hazardLongName = 'Tsunami';
      break;
    case 'MA': 
      hazardLongName = 'Marine';
      break;
    case 'SC': 
      hazardLongName = 'Small Craft';
      break;
    case 'GL': 
      hazardLongName = 'Gale';
      break;
    case 'SR': 
      hazardLongName = 'Storm';
      break;
    case 'HF': 
      hazardLongName = 'Hurricane Force Wind';
      break;
    case 'TR': 
      hazardLongName = 'Tropical Storm';
      break;
    case 'HU': 
      hazardLongName = 'Hurricane';
      break;
    case 'TY': 
      hazardLongName = 'Typhoon';
      break;
    case 'TI': 
      hazardLongName = 'Inland Tropical Storm Wind';
      break;
    case 'HI': 
      hazardLongName = 'Inland Hurricane Wind';
      break;
    case 'LS': 
      hazardLongName = 'Lakeshore Flood';
      break;
    case 'CF': 
      hazardLongName = 'Coastal Flood';
      break;
    case 'UP': 
      hazardLongName = 'Ice Accretion';
      break;
    case 'LO': 
      hazardLongName = 'Low Water';
      break;
    case 'SU': 
      hazardLongName = 'High Surf';
      break;
    default:
      hazardLongName = 'Unknown Hazard';
      break;
  }

  // decode signficance
  switch (significanceCode) {
    case 'W': 
      significanceLongName = 'Warning';
      break;
    case 'A': 
      significanceLongName = 'Watch';
      break;
    case 'Y': 
      significanceLongName = 'Advisory';
      break;
    case 'S': 
      significanceLongName = 'Statement';
      break; 
    default: 
      significanceLongName = '';                       
  }
  
  return hazardLongName + ' ' + significanceLongName;
}


function generateHazardChart(hazardData) {
  // input data comes in an array of hourly objects with a start time and an array of hazards for that hour
  const chartWidth = 300;
  const groupedPhenomena = [];
  // group hazards by phenomenon
  // sample grouped phenomena [{phenomenon: "SC", significance: "Y", times: [startTime, startTime, ...]}]
  hazardData.forEach(hourlyHazard => {
    // each hour has an array of hazards in value property
    hourlyHazard.value.forEach(hazardValue => {
      // if hazard exists in groupedPhenomena, push new times into times array, otherwise create a new hazard element
      const hazardIndex = groupedPhenomena.findIndex(groupedHazard => (groupedHazard.phenomenon === hazardValue.phenomenon && groupedHazard.significance === hazardValue.significance))
      if (hazardIndex > -1) {
        groupedPhenomena[hazardIndex].times.push(hourlyHazard.startTime);
      } else {
        groupedPhenomena.push({ phenomenon: hazardValue.phenomenon, significance: hazardValue.significance, times: [hourlyHazard.startTime] })
      }
    })
  });
  // the hazard data has phenomenon: "<None>" as a hazard phenomenon for times with no hazard... splice these out
  const noHazardIndex = groupedPhenomena.findIndex(hazard => hazard.phenomenon === "<None>");
  if (noHazardIndex > -1) {
    groupedPhenomena.splice(noHazardIndex, 1);
  }
  const chartHeight = 65 + groupedPhenomena.length * 15;
  return groupedPhenomena.length > 0 ? 
    (
      <VictoryChart 
        height={chartHeight} 
        width={chartWidth}
        padding={{top: 10, left: 30, right: 30, bottom: 20}}
        // scale={{ x: "time" }}
        domain={{ y: [0, 24], x: [0.5, groupedPhenomena.length + 1]  }}
        //x: [0, groupedPhenomena.length + 1]
        // minDomain={{ y: Math.min(...processedData.map(object => object.y)) * 0.5 }}
        // maxDomain={{ y: Math.max(...processedData.map(object => object.y)) * 1.2 }}
      >
      <VictoryLabel
        text='Hazards'
        x={chartWidth/2.5}
        y={15}
        style={{fill: '#555', fontSize: 12, padding: 0}}
      />
        {/* {groupedPhenomena.length > 0 && 
          groupedPhenomena.map((phenomenon, index) => {
            console.log(phenomenon);
            return <VictoryBar 
              key={`${phenomenon.phenomenon} ${phenomenon.significance}`} 
              // data={phenomenon}
              horizontal
              data={phenomenon.times}
              x={index + 1}
              // y0={datum => datum.phenomenon.times[0].hour}
              // y={data => console.log(data)}
            />
          })
          
        } */}

            {/* <VictoryBar 
              // data={phenomenon}
              horizontal
              barWidth={12}
              data={groupedPhenomena}
              x={data => data.phenomenon}
              // y0={datum => datum.phenomenon.times[0].hour}
              y0={data => data.times[0].hour }
              y={data => data.times[data.times.length - 1].hour + 1 }
              labels={({datum}) => datum.xName }
              labelComponent={<VictoryLabel data={datum => console.log(datum)} style={{padding: 0, margin: 0}} textAnchor='end' />}
            /> */}

        {
          groupedPhenomena.map((phenomenon, index) => {
            console.log(index)
            return (
              <VictoryBar
                key={`${phenomenon.phenomenon}, ${phenomenon.index}`} 
                horizontal
                style={{
                  data: { fill: "#c43a31" }
                }}
                barRatio={1}
                data={[phenomenon]}
                x={() => index + 1}
                y0={data => data.times[0].hour }
                y={data => data.times[data.times.length - 1].hour + 1 }
                // padding={{top: 0, bottom: 0, left: 0, right: 0}}
                // labels={({ datum }) => datum.phenomenon}
                labelComponent={<HorizontalBarDataLabel text={generateHazardLabel(phenomenon.phenomenon, phenomenon.significance)} />}
              />
            )
          })
        }

        <VictoryAxis
          dependentAxis
          domain={[0,24]}
          tickValues={[0, 6, 12, 18, 23]} 
          tickFormat={t => {
            switch (t) {
              case 0:
                return '12AM';
              case 6:
                return '6AM';
              case 12:
                return '12PM';
              case 18:
                return '6PM';
              case 23:
                return '11PM';
              default: 
                return null;
            }
          }}
          style={{
            axis: {stroke: "#756f6a"},
            ticks: {stroke: "grey", size: 5},
            tickLabels: {fontSize: 9, padding: 1}
          }} 
        />

            {/* <VictoryBar 
              data={{}}
            /> */}


      </VictoryChart>
    )
  : <div style={{padding: '5px 5px', fontSize: 16, fontWeight: 'bold'}}>No active advisories</div>
}


  const processDataForArrowChart = (data, options) => {
    // data argument given as an object; key indicates data type (windSpeed, swellHeight, etc), and value is an array of data objects with startTime and value keys
    // e.g. { period: [ { startTime, value } ], direction: [ { startTime, value } ] } or { gust: [ { startTime, value } ], direction: [ { startTime, value } ] }
    // this function will merge the data so there is a single array of objects at the end
    // output example: { x: <hour> (0-23 representing 12AM to 11PM), swellHeight: <number>, direction: <number>, period: <number> }

    // multiplier and addend for our primary Y and secondary axis if supplied in options object, otherwise default to 1 and 0 respectively
    const { primaryYKey, secondaryYKey, primaryYMultiplier, primaryYAddend, secondaryYMultiplier, secondaryYAddend } = options;

    const processedData = [];
    // go through data key and build the processed data array
    for (const dataKey in data ) {
      // multipliers and addends to convert values to different units can be supplied in the options object (primaryYMultiplier, primaryYAddend, secondaryYMultiplier, secondaryYAddend)
      let multiplier = null;
      let addend = null;
      let applyValueAdjustment = false;
      // see if we need to apply the multipler and addend to this data set
      if (dataKey === primaryYKey) {
        multiplier = primaryYMultiplier ? primaryYMultiplier : 1;
        addend = primaryYAddend ? primaryYAddend : 0;
        applyValueAdjustment = true;
      }
      if (dataKey === secondaryYKey) {
        multiplier = secondaryYMultiplier ? secondaryYMultiplier : 1;
        addend = secondaryYAddend ? secondaryYAddend : 0;
        applyValueAdjustment = true;
      }
      data[dataKey].forEach(dataObject => {
        const hour = dataObject.startTime.hour;
        const value = applyValueAdjustment ? dataObject.value * multiplier + addend : dataObject.value;
        // if data keys for this x value (start hour) already exists in the processed data object, add new values to that object, otherwise push a new dataObject
        const processedDataIndexToAppendTo = processedData.findIndex(processedDataObject => processedDataObject.x === hour);
        if (processedDataIndexToAppendTo > -1) {
          // data for this x value (hour) in the processed data array exists, so just add a new key/value pair to that object
          processedData[processedDataIndexToAppendTo][dataKey] = value;
        } else {
          // no data for this x value (hour) in the processed data array yet, so push a new object
          processedData.push({ startTime: dataObject.startTime, x: hour, [dataKey]: value });
        }
      });
    }

    return processedData;
  };
  
  function generateArrowChart(data, options) {
    // data is an array, first element is array of data objects for primary y axis, element 1 to n are supplementary data arrays
    // takes options object:
    /*
    {
      chartTitle: <String>             Title for the chart
      primaryYKey: <String>            indicates key that holds primary Y axis 
      primaryYLabel: <String>          label for the primary y axis
      primaryYMultiplier: <Number>     factor to scale primary y axis values (for unit conversions like mph to km/h, etc)
      primaryYAddend: <Number>         fixed value to add to the primary y axis values after applying the scale factor
      primaryYUnit: <String>           unit for primary Y axis to display with label 
      secondaryYLabel: <String>         
      secondaryYMultiplier: <Number>     
      secondaryYAddend: <Number>         
      secondaryYUnit: <String>
      secondaryYKey:  <String>        identifies which key in the supplementary data is for secondary Y axis (ex: 'windGust')
    }
    
    */

    const { primaryYKey, primaryYLabel, primaryYUnit, secondaryYKey, secondaryYLabel, secondaryYUnit, chartTitle } = options;
    const processedData = processDataForArrowChart(data, options);
    const chartWidth = 300;
    const chartHeight = 110;
    // get max y value for main data component (swell height, wind speed, etc) to normalize data 
    const maxYPrimary = Math.round(Math.max(...processedData.filter(dataObj => typeof dataObj[primaryYKey] === 'number').map(dataObj => dataObj[primaryYKey]))) + 1;
    // swell period data is not always present, so we filter out numbers only then get max for secondary axis
    const filteredSecondaryYValues = processedData.filter(dataObj => typeof dataObj[secondaryYKey] === 'number');
    // if there are no period values, make maxYSecondary null
    const maxYSecondary = filteredSecondaryYValues.length > 0 ? Math.round(Math.max(...filteredSecondaryYValues.map(dataObj => dataObj[secondaryYKey]))) + 1 : null;
    // we need to manually calculate normalized tick values for integer points so we don't get decimal ticks 
    const primaryYTicks = [];
    for (let i=maxYPrimary; i > 0; i-- ) {
      primaryYTicks.push(i/maxYPrimary);
    }
    const secondaryYTicks = [];
    if (maxYSecondary) {
        for (let i=maxYSecondary; i > 0; i--) {
          secondaryYTicks.push(i/maxYSecondary);
        }
    }

    // process our y axis labels into a single string with label and unit
    let processedPrimaryYLabel = ''.concat(primaryYLabel !== undefined ? primaryYLabel : '').concat(primaryYUnit !== undefined ? ` (${primaryYUnit})` : '');
    let processedSecondaryYLabel = ''.concat(secondaryYLabel !== undefined ? secondaryYLabel : '').concat(secondaryYUnit !== undefined ? ` (${secondaryYUnit})` : '');

    // process our legend symbols since we don't always have data for our secondary y axis
    const legendData = [{ name: `${primaryYLabel}\ndirection`, symbolToRender: 'arrow', }];
    if (maxYSecondary) {
      legendData.push({ name: secondaryYLabel, symbolToRender: 'line',});
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/* <div style={{fontSize: 20, paddingTop: 5, height: 30}}><b>{chartTitle}</b></div> */}
        <VictoryChart 
          events={[{target: 'data', eventHandlers: {onMouseOver: () => console.log('mouseover')}}]}
          domain={{ y: [0, 1.35] }} // normalize our y values so we can have axes on independent scales
          height={chartHeight} 
          width={chartWidth}
          padding={{top: 10, left: 30, right: 30, bottom: 20}}
          // minDomain={{ y: Math.min(...processedData.map(object => object.y)) * 0.5 }}
          // maxDomain={{ y: Math.max(...processedData.map(object => object.y)) * 1.2 }}
        >
          <VictoryLegend 
            // gutter={12}
            symbolSpacer={10}
            orientation="horizontal"
            x={chartWidth/1.8}
            y={4}
            // titleOrientation="left"
            style={{ border: { stroke: "none", }, labels: { fontSize: 8 }}}
            data={legendData}
            dataComponent={<ArrowLegendComponent />}
          />
          <VictoryLabel
            text={chartTitle}
            x={chartWidth/2.5}
            y={15}
            style={{fill: '#555', fontSize: 12, padding: 0}}
          />
          {/* <ArrowGraphLegend x={chartWidth/2} y={10} /> */}

          <VictoryAxis 
            domain={{ x: [0, 24]}}
            tickValues={[0, 6, 12, 18, 23]} 
            tickFormat={t => {
              switch (t) {
                case 0:
                  return '12AM';
                case 6:
                  return '6AM';
                case 12:
                  return '12PM';
                case 18:
                  return '6PM';
                case 23:
                  return '11PM';
                default: 
                  return null;
              }
            }}
            style={{
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 9, padding: 1}
            }} 
          />

          {/* PLOT LINE FOR SWELL PERIOD ON SAME CHART AS HEIGHT AND DIRECTION */}
          {maxYSecondary && // make sure we have values for the secondary axis, otherwise we just plot a single axis
              <VictoryAxis 
                dependentAxis
                offsetX={chartWidth - 30}
                label={processedSecondaryYLabel}
                tickValues={secondaryYTicks}
                tickFormat={t => (t*maxYSecondary).toFixed(0)}
                tickCount={4}
                style={{
                  padding: {top: 20, bottom: 50},
                  axis: {stroke: "#756f6a"},
                  ticks: {stroke: "grey", size: -5, padding: -11 },
                  tickLabels: {fontSize: 8, textAnchor: 'start'},
                  axisLabel: {fontSize: 9, padding: -22},
                }} 
              />
          }

          {maxYSecondary &&
            <VictoryLine interpolation='monotoneX' x='x' 
            y={datum => datum[secondaryYKey] ? datum[secondaryYKey]/maxYSecondary : null}
            domain={{x: [0, 23]}} data={processedData}  
            style={{ 
              data: {
                stroke: 'lightgrey',
                strokeWidth: 0.5,
              }
            }}
          />
          } 

          <VictoryAxis 
            dependentAxis
            label={processedPrimaryYLabel}
            tickValues={primaryYTicks}
            tickFormat={t => (t*maxYPrimary).toFixed(0)}
            tickCount={4}
            style={{
              padding: {top: 20, bottom: 50},
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 9, padding: 1},
              axisLabel: {fontSize: 9, padding: 15},
            }} 
          />

          <VictoryScatter x='x' y={datum => datum[primaryYKey]/maxYPrimary} domain={{ x: [0, 23] }} 
            data={processedData} 
            dataComponent={
              <ArrowPoint
                dataKey={primaryYKey}
              />
            }
          />

            
        </VictoryChart>
      </div>
    );
  }

  function generateLineChart(data, options) {
    // data is an array, first element is array of data objects for primary y axis, element 1 to n are supplementary data arrays
    // takes options object:
    /*
    {
      chartTitle: <String>             Title for the chart
      primaryYKey: <String>            indicates key that holds primary Y axis 
      primaryYLabel: <String>          label for the primary y axis
      primaryYMultiplier: <Number>     factor to scale primary y axis values (for unit conversions like mph to km/h, etc)
      primaryYAddend: <Number>         fixed value to add to the primary y axis values after applying the scale factor
      primaryYUnit: <String>           unit for primary Y axis to display with label 
      secondaryYLabel: <String>         
      secondaryYMultiplier: <Number>     
      secondaryYAddend: <Number>         
      secondaryYUnit: <String>
      secondaryYKey:  <String>        identifies which key in the supplementary data is for secondary Y axis (ex: 'windGust')
    }
    
    */

    const { primaryYKey, primaryYLabel, primaryYUnit, secondaryYKey, secondaryYLabel, secondaryYUnit, chartTitle } = options;
    const processedData = processDataForArrowChart(data, options);
    const chartWidth = 300;
    const chartHeight = 110;
    // get max y value for main data component (swell height, wind speed, etc) to normalize data 
    const maxYPrimary = Math.round(Math.max(...processedData.filter(dataObj => typeof dataObj[primaryYKey] === 'number').map(dataObj => dataObj[primaryYKey]))) + 1;
    // swell period data is not always present, so we filter out numbers only then get max for secondary axis
    const filteredSecondaryYValues = processedData.filter(dataObj => typeof dataObj[secondaryYKey] === 'number');
    // if there are no period values, make maxYSecondary null
    const maxYSecondary = filteredSecondaryYValues.length > 0 ? Math.round(Math.max(...filteredSecondaryYValues.map(dataObj => dataObj[secondaryYKey]))) + 1 : null;
    // we need to manually calculate normalized tick values for integer points so we don't get decimal ticks 
    const primaryYTicks = [];
    for (let i=maxYPrimary; i > 0; i-- ) {
      primaryYTicks.push(i/maxYPrimary);
    }
    const secondaryYTicks = [];
    if (maxYSecondary) {
        for (let i=maxYSecondary; i > 0; i--) {
          secondaryYTicks.push(i/maxYSecondary);
        }
    }

    // process our y axis labels into a single string with label and unit
    let processedPrimaryYLabel = ''.concat(primaryYLabel !== undefined ? primaryYLabel : '').concat(primaryYUnit !== undefined ? ` (${primaryYUnit})` : '');
    let processedSecondaryYLabel = ''.concat(secondaryYLabel !== undefined ? secondaryYLabel : '').concat(secondaryYUnit !== undefined ? ` (${secondaryYUnit})` : '');

    // process our legend symbols since we don't always have data for our secondary y axis
    const legendData = [{ name: [primaryYLabel, 'direction'], symbolToRender: 'arrow', }];
    if (maxYSecondary) {
      legendData.push({ name: secondaryYLabel, symbolToRender: 'line',});
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/* <div style={{fontSize: 20, paddingTop: 5, height: 30}}><b>{chartTitle}</b></div> */}
        <VictoryChart 
          events={[{target: 'data', eventHandlers: {onMouseOver: () => console.log('mouseover')}}]}
          domain={{ y: [0, 1.35] }} // normalize our y values so we can have axes on independent scales
          height={chartHeight} 
          width={chartWidth}
          padding={{top: 10, left: 30, right: 30, bottom: 20}}
          // minDomain={{ y: Math.min(...processedData.map(object => object.y)) * 0.5 }}
          // maxDomain={{ y: Math.max(...processedData.map(object => object.y)) * 1.2 }}
        >
          <VictoryLabel
            text={chartTitle}
            x={chartWidth/2.5}
            y={15}
            style={{fill: '#555', fontSize: 12, padding: 0}}
          />
          {/* <ArrowGraphLegend x={chartWidth/2} y={10} /> */}

          <VictoryAxis 
            domain={{ x: [0, 24]}}
            tickValues={[0, 6, 12, 18, 23]} 
            tickFormat={t => {
              switch (t) {
                case 0:
                  return '12AM';
                case 6:
                  return '6AM';
                case 12:
                  return '12PM';
                case 18:
                  return '6PM';
                case 23:
                  return '11PM';
                default: 
                  return null;
              }
            }}
            style={{
              axis: {stroke: "#756f6a",},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 9, padding: 2}
            }} 
          />

          {/* PLOT LINE FOR SWELL PERIOD ON SAME CHART AS HEIGHT AND DIRECTION */}
          {maxYSecondary && // make sure we have values for the secondary axis, otherwise we just plot a single axis
              <VictoryAxis 
                dependentAxis
                offsetX={chartWidth - 30}
                label={processedSecondaryYLabel}
                tickValues={secondaryYTicks}
                tickFormat={t => (t*maxYSecondary).toFixed(0)}
                tickCount={4}
                style={{
                  padding: {top: 20, bottom: 50},
                  axis: {stroke: "#756f6a"},
                  ticks: {stroke: "grey", size: -5, padding: -11 },
                  tickLabels: {fontSize: 8, textAnchor: 'start'},
                  axisLabel: {fontSize: 9, padding: -22},
                }} 
              />
          }

          {maxYSecondary &&
            <VictoryLine interpolation='monotoneX' x='x' 
            y={datum => datum[secondaryYKey]/maxYSecondary}
            domain={{x: [0, 23]}} data={processedData}  
            style={{ 
              data: {
                stroke: 'lightgrey',
                strokeWidth: 0.5,
              }
            }}
          />
          } 

          <VictoryAxis 
            dependentAxis
            label={processedPrimaryYLabel}
            tickValues={primaryYTicks}
            tickFormat={t => (t*maxYPrimary).toFixed(0)}
            tickCount={4}
            style={{
              padding: {top: 20, bottom: 50},
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 9, padding: 1},
              axisLabel: {fontSize: 9, padding: 18},
            }} 
          />

          <VictoryScatter x='x' y={datum => datum[primaryYKey]/maxYPrimary} domain={{ x: [0, 23] }} 
            data={processedData}
            // size={2}
            
            dataComponent={<TemperaturePoint />}
            // style={{
            //   data: {
            //     fill: ({ datum }) => generateTemperatureColor(datum.y)
            //   }
            // }}
          />

            
        </VictoryChart>
      </div>
    );
  }



const WeatherFeed = (props) => {
  const defaultFetchStatus = { loading: true, error: null };
  const defaultWeatherData = { type: null, data: null, position: null };

  // temporary for getting the grid forecast going
  const [processedGridData, setProcessedGridData] = useState(null);

  const [weatherData, setWeatherData] = useState(defaultWeatherData);
  const [fetchStatus, setFetchStatus] = useState(defaultFetchStatus);
  
  const [weatherFilters, setWeatherFilters] = useState({ windSpeed: true, temperature: true, swellHeight: true, hazards: true, skyCover: false, windWaveHeight: false });

  const additonalControls = [{ position: 'BOTTOM_CENTER', element: selectLocationButton, listeners: [{event: 'click', callback: handleSelectLocationButtonClick}] }];
  const { loadMap, showInfoWindowInCenter, mapContainerRef, mapRef, infoWindowRef, apiStatus, mapLoaded, getPosition, geolocationStatus } = useGoogleMap2(true, additonalControls, null, true, null, 8);
  const { autocompleteInputRef, autocompleteRef, loadAutocomplete } = useGoogleAutocomplete(handlePlaceSelect);

  // controls.push({ position: 'BOTTOM_CENTER', element: selectLocationButton, listeners: [{event: 'click', callback: handleSelectLocationButtonClick}] })

  //https://api.weather.gov/gridpoints/SGX/44,52/forecast

  // once the api script is loaded load the map
  useEffect(() => {
    console.log('map load use effect triggered')
    if (!mapLoaded && apiStatus.complete) {
      loadMap();
      loadAutocomplete();
      getPosition();
    }
  }, [mapLoaded, apiStatus, loadMap, getPosition, loadAutocomplete]);
  
  // get forecast if geolocation position comes through
  useEffect(() => {
    console.log('geolocation status use effect triggered')
    if (geolocationStatus.position) {
      getForecast(geolocationStatus.position);
    }
  }, [geolocationStatus]);
  



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
          console.log(JSON.stringify(json.properties, null, 4))
          // console.log(json.properties)
          processGridData(json.properties);
          // console.log(json.properties);
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
        getGridForecast(grid);
      } else {
        // no forecast urls available for this position, so cant get weather for this location
        setFetchStatus({ loading: false, error: { message: 'Forecast unavailable for this location' } });
      }    
    } else {
      // error getting forecast url
      setFetchStatus({ loading: false, error: { message: 'Unable to retreive forecast from server. Please try again later' } });
    }
  };


  function handleSelectLocationButtonClick() {
    getForecast(mapRef.current.getCenter().toJSON());
  }

  // function to flatten the grid data object into an array of days with all data types for each day
  function processGridData (forecastData = staticGridData) {
    // first construct and array with object dates for the next few days
    const today = DateTime.now();
    const days = [];
    const keysToMap = [ 'weather', 'hazards', 'primarySwellHeight', 'temperature', 'primarySwellDirection', 'windWaveHeight', 'wavePeriod2', 'secondarySwellDirection', 'secondarySwellHeight', 'wavePeriod', 'waveHeight', 'weather', 'windGust', 'windSpeed', 'windDirection', 'skyCover' ];
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
              temperature: [{ startTime, value }, { startTime, value } ... ], 
              windSpeed: [{ startTime, value }, { startTime, value }, ... ],
              weather: [{ startTime, value: { coverage, weather, intensity, visibility: { unitCode, value }, attributes: [] } }],
              hazards: [{ startTime, value: { values: [{ startTime, value: { phenomenon, significance, event_number } }] } }]
            }
          ] 
          harzard phenomena, significance: https://www.weather.gov/bmx/vtec
          weather coverage, intensity, weather : https://vlab.noaa.gov/web/mdl/degrib-ndfd-weather#the-possibilities-for%C2%A0weather-type-are
          each startTime, value object represents 1 a 1 hour increment
          */

          const [isoTime, isoDuration] = dataPoint.validTime.split('/');
          const startTime = DateTime.fromISO(isoTime);
          const durationInHours =  Duration.fromISO(isoDuration).shiftTo('hours').toObject().hours;
          // if there is a duration longer than 1h, we need to create an array of new data points containing a new data point for each hour of the duration
          for (let i = 0; i < durationInHours; i++) {
            // add an hour to the start time for every iteration to get a new hour timepoint so we can spread the data over the duration
            const currentInterval = startTime.plus({ hours: 1 * i }).toObject();
            // find the day in the days array that matches the the day of our current one hour interval
            const dayIndex = days.findIndex(item => item.date.year === currentInterval.year && item.date.day === currentInterval.day && item.date.month === currentInterval.month );          
            if (dayIndex > -1) {
              // // add the data to the appropriate day
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
    console.log(days);
    setProcessedGridData(days);
  };






  function handlePlaceSelect() {
    console.log('place select callback')
    // get the place the user selected
    const place = autocompleteRef.current.getPlace();
    console.log(place);
    if (place.geometry && place.geometry.location) {
      // const { lat, lng } = place.geometry.location;
      // center our map on selected place
      mapRef.current.setCenter(place.geometry.location);
      mapRef.current.setZoom(9);
      console.log(place.geometry.location.lat())
      getForecast(mapRef.current.getCenter().toJSON());
    } else {
      // no place returned, see if the input is in decimal degrees
      const coordinates = { lat: null, lng: null };
      // remove all spaces and split at comma
      let splitString = place.name.replace(/ /g, '').split(',');
      if (splitString.length === 2) {
        // check if potential lat and lng are both numbers within a valid lat and lng range
        if (typeof Number.parseFloat(splitString[0]) === 'number' && Math.abs(Number.parseFloat(splitString[0])) <= 90 ) {
          coordinates.lat = Number.parseFloat(splitString[0]);
        }
        if (typeof Number.parseFloat(splitString[1]) === 'number' && Math.abs(Number.parseFloat(splitString[1])) <= 180 ) {
          coordinates.lng = Number.parseFloat(splitString[1]);
        }
      }
      // 44.3863863,shskhp   poop
      if (coordinates.lat && coordinates.lng) {
        mapRef.current.setCenter(coordinates);
        mapRef.current.setZoom(10);
        getForecast(coordinates);
      } else {
        // display info window for invalid location
        const infoDivStyle = 'padding-bottom: 5px; font-size: 16px;'
        const infoJSX = `
          <div style='width: 400px'>
            <div style='${infoDivStyle}'><b>${place.name} not found</b></div>
            <div style='${infoDivStyle}'>Please select a suggested place from the dropdown</div>
            <div style='${infoDivStyle}'>Or enter gps coordinates in the coodinates field</div>                 
          </div>`;
        showInfoWindowInCenter(infoJSX, mapRef, infoWindowRef);
      }
    }
  }
          


  const renderOptions = () => {
    return processedGridData ? (
      <div style={{marginTop: 10, display: 'flex',flexDirection: 'column'}}> 
      <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
        <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='temperature' label='Temperature' checked={weatherFilters.temperature} onChange={(e, { checked, name }) => setWeatherFilters(prevFilters => ({ ...prevFilters, [name]: checked }))}/>
        <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='windSpeed' label='Wind speed' checked={weatherFilters.windSpeed} onChange={(e, { checked, name }) => setWeatherFilters(prevFilters => ({ ...prevFilters, [name]: checked }))}/>
        <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='swellHeight' label='Swell height' checked={weatherFilters.swellHeight} onChange={(e, { checked, name }) => setWeatherFilters(prevFilters => ({ ...prevFilters, [name]: checked }))}/>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', padding: '5px 10px'}}>
        <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='hazards' label='Advisories' checked={weatherFilters.hazards} onChange={(e, { checked, name }) =>  setWeatherFilters(prevFilters => ({ ...prevFilters, [name]: checked }))}/>
        {/* <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='skyCover' label='Sky cover' checked={weatherFilters.skyCover} onChange={(e, { checked, name }) =>  setWeatherFilters(prevFilters => ({ ...prevFilters, [name]: checked }))}/> */}
        {/* <Checkbox style={{marginBottom: 5, marginLeft: 10}} toggle name='windWaveHeight' label='Wind wave height' checked={weatherFilters.windWaveHeight} onChange={(e, { checked, name }) =>  setWeatherFilters(prevFilters => ({ ...prevFilters, [name]: checked }))}/> */}
      </div>
    </div>
    ) : null;
  };

  return (
    // outer container
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      {/* container for map container, min 400, grow to page height up to 900 max */}
    <div style={{display: 'flex',  height: 400, flexGrow: 1, maxHeight: 900}}>
    <div className='map-container' style={{width: 300, height: '100%', position: 'relative'}}>
      <div id='map' ref={mapContainerRef} />

      <input 
        ref={autocompleteInputRef} type='text' 
        placeholder='Search for a place to center map'
        style={{
          display: mapLoaded ? '' : isNonEmptyArray,
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 35, 
          margin: 0,
          borderRadius: 5,
          zIndex: 100
        }}
      />

      <div style={{zIndex: 100, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        {(apiStatus.loading || fetchStatus.loading) && <LoaderFish />}
        {apiStatus.loading && <div style={{fontSize: 16, fontWeight: 'bold', zIndex: 100}}>Loading Map...</div>}
        {fetchStatus.loading && <div style={{fontSize: 16, fontWeight: 'bold', zIndex: 100}}>Loading weather...</div>}
      </div>
      
    </div>


    <div style={{ width: 600, padding: '0px 10px', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: 10}}>
        {!fetchStatus.loading && !fetchStatus.error &&  
          <div style={{fontSize: 20}}>
            {weatherData.type === 'periods' ? <span>Basic forecast</span> : <span>Marine forecast</span>}
          </div>
          }

        {!fetchStatus.loading && !fetchStatus.error && weatherData.type === 'grid' &&
          <div style={{width: '100%'}}> 
            {renderOptions()}
          </div>
        }
      </div>

      <div style={{overflowY: 'auto', padding: 10}}>
      {/* <button type='button' onClick={}>test log</button> */}
      {/* <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
        {generateArrowChart({ windSpeed: staticDayData[2].windSpeed, direction: staticDayData[2].windDirection, windGust: staticDayData[2].windGust }, 
          { 
            chartTitle: 'Wind',
            primaryYKey: 'windSpeed',
            primaryYLabel: 'speed', 
            primaryYUnit: 'kn', 
            primaryYMultiplier:  1/1.852,
            secondaryYLabel: 'gust', 
            secondaryYUnit: 'kn', 
            secondaryYMultiplier:  1/1.852, 
            secondaryYKey: 'windGust'
          }
        )}
      </div>
      <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
        {
          // hazard chart
          generateHazardChart(staticDayData[0].hazards)
        
        }
      </div> */}
                {/* <div style={{border: '1px solid lightgray', borderRadius: '5px', margin: '5px 0px 5px 0px'}}>
                  {generateLineChart({temperature: staticDayData[2].temperature }, 
                    { chartTitle: 'Temperature', primaryYKey: 'temperature', primaryYLabel: 'temperature', primaryYUnit: 'deg F', primaryYMultiplier: 1.8, primaryYAddend: 32,
                    }
                  )}
                </div> */}


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

              {weatherFilters.hazards  && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px', marginTop: 5}}>
                  {generateHazardChart(date.hazards)}
                </div>
              }
            
              {date.temperature.length > 0 && weatherFilters.temperature &&
                <div style={{border: '1px solid lightgray', borderRadius: '5px', margin: '5px 0px 5px 0px'}}>
                  {generateLineChart({temperature: date.temperature }, 
                    { chartTitle: 'Temperature', primaryYKey: 'temperature', primaryYLabel: 'temperature', primaryYUnit: 'deg F', primaryYMultiplier: 1.8, primaryYAddend: 32,
                    }
                  )}
                </div>
              }
              {/* {date.skyCover.length > 0 && weatherFilters.skyCover &&
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                  {generateLineChart([date.skyCover], 'sky cover', '%')}
                </div>
              }               */}



              {date.windSpeed.length > 0 && weatherFilters.windSpeed &&
                <div style={{border: '1px solid lightgray', borderRadius: '5px', marginTop: 5}}>
                  {generateArrowChart({windSpeed: date.windSpeed, direction: date.windDirection, windGust: date.windGust }, 
                    { chartTitle: 'Wind', primaryYKey: 'windSpeed', primaryYLabel: 'speed', primaryYUnit: 'kn', primaryYMultiplier:  1/1.852,
                      secondaryYLabel: 'gust', secondaryYUnit: 'kn', secondaryYMultiplier:  1/1.852, secondaryYKey: 'windGust'
                    }
                  )}
                </div>
              }
              {date.primarySwellHeight.length > 0 && weatherFilters.swellHeight &&
                <div style={{border: '1px solid lightgray', borderRadius: '5px', marginTop: 5}}>
                  {generateArrowChart({primarySwellHeight: date.primarySwellHeight, direction: date.primarySwellDirection, period: date.wavePeriod }, 
                    { chartTitle: 'Swell', primaryYKey: 'primarySwellHeight', primaryYLabel: 'height', primaryYUnit: 'ft', primaryYMultiplier:  3.28084,
                      secondaryYLabel: 'period', secondaryYUnit: 's', secondaryYKey: 'period'
                    }
                  )}
                </div>
              }
              {/* {date.primarySwellHeight.length > 0 && weatherFilters.swellHeight &&
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                  {generateLineChart([date.primarySwellHeight, { direction: date.primarySwellDirection, period: date.wavePeriod }], 'swell height', 'ft', 3.28084)}
                </div>
              }
              {date.windWaveHeight.length > 0 && weatherFilters.windWaveHeight &&
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                 {generateLineChart([date.windWaveHeight], 'wind wave height', 'ft', 3.28084)}
                </div> */}
              
            </div>
          </Card.Content>
        </Card>  
      )}

      </div>

    </div>

    </div>

    </div>

  );
};

export default WeatherFeed;



      /* {
        groupedPhenomena.map((phenomenon, index) => {
          console.log(index)
          return <HorizontalBarDataLabel text="test" />
        })
      }       */
/* 
      <VictoryAxis 
        domain={[0, groupedPhenomena.length + 0.5]}
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          // tickLabels: { fontSize: 12, fill: "black" }
        }}
        // tickLabelComponent={
        //   <VictoryLabel
        //     x={chartWidth/2}
        //     textAnchor="middle"
        //   />
        // }

      /> */

      /* <VictoryAxis 
        style={{
          padding: {top: 20, bottom: 50},
          axis: {stroke: "#756f6a"},
          ticks: {stroke: "grey", size: 5},
          tickLabels: {fontSize: 9, padding: 1},
          axisLabel: {fontSize: 9, padding: 15},
        }} 
        domain={[0,2]}
      /> */

/*
  const hazards = `BZ   Blizzard
WS  Winter Storm
WW Winter Weather
SN   Snow
HS   Heavy Snow
LE    Lake Effect Snow
LB   Lake Effect Snow & Blowing Snow
BS   Blowing/Drifting Snow
SB   Snow & Blowing Snow
IP     Sleet
HP    Heavy Sleet
ZR   Freezing Rain
IS     Ice Storm
FZ    Freeze
ZF    Freezing Fog
FR    Frost
WC  Wind Chill
EC    Extreme Cold
WI    Wind
HW  High Wind
LW   Lake Wind
FG   Dense Fog
SM   Dense Smoke
HT    Heat
EH    Excessive Heat
DU   Blowing Dust
DS   Dust Storm
FL    Flood
FF    Flash Flood
SV   Severe Thunderstorm
TO   Tornado
FW   Fire Weather
RH   Radiological Hazard
VO   Volcano
AF   Volcanic Ashfall
AS   Air Stagnation
AV   Avalanche
TS    Tsunami
MA   Marine
SC   Small Craft
GL   Gale
SR   Storm
HF    Hurricane Force Wind
TR    Tropical Storm
HU   Hurricane
TY   Typhoon
TI     Inland Tropical Storm Wind
HI     Inland Hurricane Wind
LS    Lakeshore Flood
CF    Coastal Flood
UP    Ice Accretion
LO   Low Water
SU   High Surf`
let switchText = '';
const hazardsArray=hazards.split('\n').forEach(hazard => {
  const [code, hazardLongName] = hazard.split(/ {2,}/)
  switchText += 
  `case '${code}': 
  hazardLongName = '${hazardLongName}';
  break;\n`
});


    // function to process the color for the scatter points
    const processColor = (datum, label) => {
      // datum is a data point in the format of { startTime: <Object>, value: float}, and label is a string (eg 'swell height')
      const { y: value } = datum;
      // console.log(label, value);
      switch (label) {
        case 'swell height':
          if (inRange(value, -1, 1)) return '#00FF00';
          if (inRange(value, 1, 2)) return '#fff33b';
          if (inRange(value, 2, 3)) return '#fdc70c';
          if (inRange(value, 3, 4)) return '#f3903f';
          if (inRange(value, 4, 5)) return '#ed683c';
          if (value > 5) return '#e93e3a';
          break;
          case 'wind speed':
            if (inRange(value, -1, 4)) return '#00FF00';
            if (inRange(value, 4, 8)) return '#fff33b';
            if (inRange(value, 8, 12)) return '#fdc70c';
            if (inRange(value, 12, 16)) return '#f3903f';
            if (inRange(value, 16, 20)) return '#ed683c';
            if (value > 20) return '#e93e3a';
            break;
            case 'temperature':
              if (value < 0) return '#800080'; // purple
              if (inRange(value, -1, 30)) return '#000068'; // blue black
              if (inRange(value, 30, 40)) return '#0000A3'; // dark blue
              if (inRange(value, 40, 60)) return '#7D7DFF'; // light blue
              if (inRange(value, 60, 70)) return '#004200'; // dark green
              if (inRange(value, 70, 80)) return '#339933'; // light green
              if (inRange(value, 80, 90)) return '#FFA500'; // orange
              if (inRange(value, 90, 100)) return '#FF0000'; // red
              if (value > 100) return '#530000'; // dark red
              break;
        default: 
          return 'red';
      }
    };



    */

    // // if we have supplementary data like wind direction, let's add that to the processedData so we can render it on the chart
    // if (supplementaryData) {
    //   // supplementary data is an object with keys that contain arrays of hourly data objects

    //   // we want to merge these supplementary data keys and values into their matching processedData hourly objects
    //   // example of final processed data [{x: <hour (0-23)>, y: <main y value>, period: <period value>, direction: <direction value>  }]
    //   // there may be multiple keys for different datasets in supplementary data object (period, direction, etc)
    //   for (const supplementaryDataKey in supplementaryData) {
    //     let secondaryYMultiplier = null;
    //     let secondaryYAddend = null; 
    //     // only apply if a secondary Y key was provided
    //     let applySecondaryYScale = false;
    //     // We can only apply a multiplier and/or addend the secondary Y axis if a key was provided
    //     if('secondaryYKey' in options) {
    //       secondaryYMultiplier = options.secondaryYMultiplier ? options.secondaryYMultiplier : 1;
    //       secondaryYAddend = options.secondaryYAddend ? options.secondaryYAddend : 0;
    //       applySecondaryYScale = true;
    //     }
    //     supplementaryData[supplementaryDataKey].forEach(supplementaryDataObject => {
    //       // find the x point with the same hour as our supplementary point
    //       const processedDataIndexToAppendTo = processedData.findIndex(processedDataObject => processedDataObject.x === supplementaryDataObject.startTime.hour);
    //       if (processedDataIndexToAppendTo > -1) {
    //         // apply multiplier and addend to secondary y if present
    //         // add our supplementary data key and value to the appropriate hour on the main data object
    //         let supplementaryDataValue = supplementaryDataObject.value;
    //         // if a secondary Y key is supplied in options, apply the data transformations
    //         if (applySecondaryYScale) {
    //           supplementaryDataValue = supplementaryDataValue * secondaryYMultiplier + secondaryYAddend;
    //         }
    //         processedData[processedDataIndexToAppendTo][supplementaryDataKey] = supplementaryDataValue;
    //       }
    //     });
    //   }
    // }

//    const keysToMap = ['temperature', 'primarySwellDirection', 'primarySwellHeight', 'windWaveHeight', 'wavePeriod2', 'secondarySwellDirection', 'secondarySwellHeight', 'wavePeriod', 'waveHeight', 'weather', 'windGust', 'windSpeed', 'windDirection', 'skyCover' ];
//2021-06-18T10:00:00.000-07:00




/* 


    function mapGradient() {
      const colors = [];
      data.forEach(dataObject => {
        if (dataObject.value <= 15) {
          colors.push('green');
        } else {
          colors.push('red');
        }
      });
      return (
        <linearGradient ref={gradientRef} id="myGradient">
          <stop offset='0%' stopColor={colors[0]} />
          <stop offset='4.167%' stopColor={colors[1]} />
          <stop offset='8.333%' stopColor={colors[2]} />
          <stop offset='12.5%' stopColor={colors[3]} />
          <stop offset='16.667%' stopColor={colors[4]} />
          <stop offset='20.833%' stopColor={colors[5]} />
          <stop offset='100%' stopColor={colors[6]} />
        </linearGradient>)
    }





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




                        /* // create a gradient component for the chart to apply to the line filteredAccessLocation */
          /* <linearGradient id="myGradient"
            <stop offset="0%" stopColor='red'/>
            <stop offset="25%" stopColor="orange"/>
            <stop offset="50%" stopColor="gold"/>
            <stop offset="75%" stopColor="yellow"/>
            <stop offset="100%" stopColor="green"/>
        </linearGradient> */
  
  /* <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id="myGradient">
          <stop offset="0%" stopColor="red"/>
          <stop offset="25%" stopColor="orange"/>
          <stop offset="50%" stopColor="gold"/>
          <stop offset="75%" stopColor="yellow"/>
          <stop offset="100%" stopColor="green"/>
        </linearGradient>
      </defs>
    </svg> */



    /*
      // generate a chart from processed grid data
  function generateLineChart(data, label, unit, valueMultiplier = 1, valueAdded = 0) {
    // data is an array, first element is array of data objects for primary y axis, second element is an object of supplementary data
    // example: [ windSpeed, { direction, windGust } ]
    // takes options object:

    {
      old arguments       label, unit, valueMultiplier = 1, valueAdded = 0
      primaryYLabel: <String>          label for the primary y axis
      primaryYMultiplier: <Number>     factor to scale primary y axis values (for unit conversions like mph to km/h, etc)
      primaryYAddend: <Number>         fixed value to add to the primary y axis values after applying the scale factor
      primaryYUnit: <String>           unit for primary Y axis to display with label 
      secondaryYLabel: <String>         
      secondaryYMultiplier: <Number>     
      secondaryYAddend: <Number>         
      secondaryYUnit: <String>
      secondaryYKey:  <String>        identifies which key in the supplementary data is for secondary Y axis (ex: 'windGust')
    }
    
    */




  /*
    // data argument given as an array with one or two values
    // for charts that only need a single data set, like temperature, the array has 1 item
    // for charts like wind speed that have both a speed and direction component, there will be two datasets

    // if a second item exists, it will be an object with supplementary data keys
    // e.g. { period: [ { startTime, value } ], direction: [ { startTime, value } ] } or { gust: [ { startTime, value } ], direction: [ { startTime, value } ] }

    // first array value is always main x and y component
    // if there's supplementary data, let's pull it from the array
    let supplementaryData = null;
    if (data.length > 0) {
      supplementaryData = data[1];
    }
    // assign our main data component to data (first array value)
    data = data[0];
    // process the data into an array of hourly objects we can feed to our graph component
    // each item will be an object { x: <hour> (0-23 representing 12AM to 11PM), y: <value> }
    const processedData = [];
    data.forEach(dataObject => {
      const hour = dataObject.startTime.hour;
      processedData.push({ day: dataObject.startTime.day, x: hour, y: dataObject.value * valueMultiplier + valueAdded });
      // if (label==='swell height') {
      //   console.log(`Swell height for ${dataObject.startTime.month}-${dataObject.startTime.day}: ${dataObject.value}`);
      // }
    });

    // if we have supplementary data like wind direction, let's add that to the processedData so we can render it on the chart
    if (supplementaryData) {
      // supplementary data is an object with keys that contain arrays of hourly data objects
      // we want to merge these supplementary data keys and values into their matching processedData hourly objects
      // final processedData should be [{x: <hour (0-23)>, y: <main y value>, period: <period value>, direction: <direction value>  }]
      for (let supplementaryDataType in supplementaryData) {
        // console.log(supplementaryDataType);
        if (supplementaryData[supplementaryDataType]) {
          supplementaryData[supplementaryDataType].forEach(supplementaryDataObject => {
            // find the x point with the same hour as our supplementary point
            const processedDataIndexToAppendTo = processedData.findIndex(processedDataObject => processedDataObject.x === supplementaryDataObject.startTime.hour);
            if (processedDataIndexToAppendTo > -1) {
              // add a z value to the processedData object (z is the supplementary data value)
              processedData[processedDataIndexToAppendTo][supplementaryDataType] = supplementaryDataObject.value;
            }
          });
        }
      }
    }

    // generate graphs that have more than one data component (e.g. swell height, swell period, and direction)
    if (label === 'wind speed' || label === 'swell height') {
      // key to dynamically process secondary axis data
      const secondaryYAxisDataKey = 
        label === 'wind speed' ? 'windGust'
        : label === 'swell height' ? 'period' : null;
      // wind speeds contained in processedData
      // wind direction contained in supplementaryData
      const chartWidth = 300;
      // get max y value for main data component (swell height, wind speed, etc) to normalize data 
      const maxYPrimary = Math.round(Math.max(...processedData.filter(dataObj => typeof dataObj.y === 'number').map(dataObj => dataObj.y))) + 1;
      // swell period data is not always present, so we filter out numbers only then get max for secondary axis
      const filteredSecondaryYValues = processedData.filter(dataObj => typeof dataObj[secondaryYAxisDataKey] === 'number');
      // if there are no period values, make maxYSecondary null
      const maxYSecondary = filteredSecondaryYValues.length > 0 ? Math.round(Math.max(...filteredSecondaryYValues.map(dataObj => dataObj[secondaryYAxisDataKey]))) + 1 : null;
      // we need to manually calculate normalized tick values for integer points so we don't get decimal ticks 
      const primaryYTicks = [];
      for (let i=maxYPrimary; i > 0; i-- ) {
        primaryYTicks.push(i/maxYPrimary);
      }
      const secondaryYTicks = [];
      if (maxYSecondary) {
          for (let i=maxYSecondary; i > 0; i--) {
            secondaryYTicks.push(i/maxYSecondary);
          }
      }

      // label for our secondary Y axis
      let secondaryYAxisLabel;
      switch (label) {
        case 'wind speed':
          secondaryYAxisLabel = `Gust ${unit}`;
        break;
        case 'swell height':
          secondaryYAxisLabel = 'Period (s)'
        break;
        default: 
          secondaryYAxisLabel = null;
      }

      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span style={{fontSize: 20, paddingTop: 5}}><b>{`${label.split(' ')[0]}`}</b></span>
        <VictoryChart 
          domain={{ y: [0, 1.05] }} // normalize our y values so we can have axes on independent scales
          height={100} 
          width={chartWidth}
          padding={{top: 10, left: 30, right: 30, bottom: 20}}
          // minDomain={{ y: Math.min(...processedData.map(object => object.y)) * 0.5 }}
          // maxDomain={{ y: Math.max(...processedData.map(object => object.y)) * 1.2 }}
        >
          <VictoryAxis 
            tickValues={[0, 6, 12, 18, 23]} 
            tickFormat={t => {
              switch (t) {
                case 0:
                  return '12AM';
                case 6:
                  return '6AM';
                case 12:
                  return '12PM';
                case 18:
                  return '6PM';
                case 23:
                  return '11PM';
                default: 
                  return null;
              }
            }}
            style={{
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 9, padding: 1}
            }} 
          />
          
          <VictoryLegend 
          
          />


          <VictoryAxis 
            dependentAxis
            label={`${label.split(' ')[1]} (${unit})`}
            tickValues={primaryYTicks}
            tickFormat={t => (t*maxYPrimary).toFixed(0)}
            tickCount={4}
            style={{
              padding: {top: 20, bottom: 50},
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 9, padding: 1},
              axisLabel: {fontSize: 9, padding: 15},
            }} 
          />

          <VictoryScatter x='x' y={datum => datum.y/maxYPrimary} domain={{ x: [0, 23] }} 
            data={processedData} 
            dataComponent={
              <ArrowPoint 
                dataType={label} 
              />
            }
            // labels={processedData.map(object => object.period ? object.period : object.windGust ? object.windGust : null)}
            style={{ 
              data: {
                // stroke: ({ datum }) => {
                //   // console.log(datum);
                //   return datum.y < 6 ? "red" : "black"
                // }
              }
            }}
          />

          {(label === 'swell height' || label === 'wind speed') && maxYSecondary && // make sure we have values for the secondary axis, otherwise we just plot a single axis
              <VictoryAxis 
                dependentAxis
                offsetX={chartWidth - 30}
                label={secondaryYAxisLabel}
                tickValues={secondaryYTicks}
                tickFormat={t => (t*maxYSecondary).toFixed(0)}
                tickCount={4}
                style={{
                  padding: {top: 20, bottom: 50},
                  axis: {stroke: "#756f6a"},
                  ticks: {stroke: "grey", size: -5, padding: -11 },
                  tickLabels: {fontSize: 8, textAnchor: 'start'},
                  axisLabel: {fontSize: 9, padding: -22},
                }} 
              />
          }

          {(label === 'swell height' || label === 'wind speed') && maxYSecondary &&
            <VictoryLine interpolation='monotoneX' x='x' 
            y={datum => datum[secondaryYAxisDataKey]/maxYSecondary}
            domain={{x: [0, 23]}} data={processedData}  
            style={{ 
              data: {
                stroke: 'lightgrey',
                strokeWidth: 1,
              }
            }}
          />
          } 
            
        </VictoryChart>
      </div>

      );
    
      // for graphs with single data component (temperature, windWaveHeight, etc)
    } else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span><b>{`${label} in ${unit}`}</b></span>
          <VictoryChart 
            height={150} 
            padding={{top: 10, left: 30, right: 30, bottom: 30}}
            minDomain={{ y: 0 }}
            maxDomain={{ y: Math.max(...processedData.map(object => object.y)) * 1.1 }}
          >
            <VictoryAxis 
              tickValues={[0, 6, 12, 18, 23]} 
              tickFormat={t => {
                switch (t) {
                  case 0:
                    return '12AM';
                  case 6:
                    return '6AM';
                  case 12:
                    return '12PM';
                  case 18:
                    return '6PM';
                  case 23:
                    return '11PM';
                  default: 
                    return null;
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
            
            <VictoryLine interpolation='monotoneX' x='x' y='y' domain={{x: [0, 23]}} data={processedData}  
              style={{ 
                data: {
                  stroke: 'grey',
                  strokeWidth: 1,
                  // stroke: "url(#myGradient)",
              //   // fill: ({ index }) => +index % 2 === 0 ? "blue" : "grey",
              //   // stroke: ({ data }) => console.log(a)
              //   //   stroke: ({ datum }) => {
              //   //     console.log(datum);
              //   //     return datum.y < 6 ? "red" : "black"
              //   //   }
                }
              }}
            />

            <VictoryScatter x='x' y='y' domain={{x: [0, 23]}} data={processedData} 
              style={{ 
                data: {
                  fill: ({ datum }) => processColor(datum, label),
                  // stroke: ({ datum }) => {
                  //   // console.log(datum);
                  //   return datum.y < 6 ? "red" : "black"
                  // }
                }
              }}
            />  
          </VictoryChart>
        </div>
      );
    }
  }

*/