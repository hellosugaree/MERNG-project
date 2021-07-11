import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { groupBy } from 'lodash';
import { VictoryChart, VictoryLabel, VictoryPie, VictoryVoronoiContainer, VictoryStack, VictoryHistogram, VictoryAxis, createContainer } from 'victory';
import { DateTime, Interval } from 'luxon';
import * as d3 from 'd3';
import { GET_CATCHES, GET_USER_BASIC_DATA } from '../gql/gql';
import { AuthContext } from '../context/auth';
import { Card } from 'semantic-ui-react';
import LoaderFish from '../components/LoaderFish';
import Dropdown from '../components/Dropdown';
import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../App.css';

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

const sharedAxisStyles = {
  tickLabels: {
    fontSize: 13
  },
  axisLabel: {
    padding: 30,
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: 'bold'
  }
};

const monthDropdownItems = ['All Months'];
for (let i = 0; i < 12; i++) {
  monthDropdownItems.push(new Date(2021,i,1).toLocaleString('default', { month: 'long' }));
}

const renderBasicStatsCard = (basicCatchStats) => {
  // takes an object of catch stats 
  // { createdAt: userBasicData.createdAt, username: userBasicData.username, catchCount: catches.length, biggestCatch: calculateBiggestCatch(catches), speciesList: createSpeciesList(catches), fishingTypeFrequency: createFishingTypeFrequencyObject(catches) }
  const renderTopCatches = frequencyList => {
    return frequencyList.slice(0,3).map(frequencyObject => <Card.Description key={frequencyObject.species} style={{padding: '3px 0px'}}>{frequencyObject.count} {frequencyObject.species}</Card.Description>)
  };  

  return (
    <div style={{width: 800}}>
      <Card fluid >
        <Card.Content style={{fontSize: 16}}>
          <Card.Header>{basicCatchStats.username}</Card.Header>
          <hr />
          <Card.Meta>Joined Fishsmart {DateTime.fromMillis(Date.parse(basicCatchStats.createdAt)).toRelative()}</Card.Meta>

          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', border: '1px solid lightgrey', borderRadius: 5, padding: 15}}>

              {/* total caught */}
              <div className='catch-stats-grid-row' style={{display: 'flex',}}>
                <div className='catch-stats-grid-column' style={{width: 150, }}>
                  <Card.Description style={{padding: '3px 0px'}}><b>Catches: </b></Card.Description>
                </div>
                <div className='catch-stats-grid-column'>
                  <Card.Description style={{padding: '3px 0px'}}>{basicCatchStats.catchCount}</Card.Description>
                </div>
              </div>
              {/* species caught */}
              <div className='catch-stats-grid-row' style={{display: 'flex'}}>
                <div className='catch-stats-grid-column' style={{width: 150}}>
                  <Card.Description style={{padding: '3px 0px'}}><b>Species Caught: </b></Card.Description>
                </div>
                <div className='catch-stats-grid-column' >
                  <Card.Description style={{padding: '3px 0px'}}>{basicCatchStats.speciesList.length}</Card.Description>
                </div>
              </div>
              {/* best month */}
              <div className='catch-stats-grid-row' style={{display: 'flex'}}>
                <div className='catch-stats-grid-column' style={{width: 150}}>
                  <Card.Description style={{padding: '3px 0px'}}><b>Best month: </b></Card.Description>
                </div>
                <div className='catch-stats-grid-column' >
                  {/* month is zero indexed */}
                  <Card.Description style={{padding: '3px 0px'}}>{basicCatchStats.bestMonth.month + 1}/{basicCatchStats.bestMonth.year} - {basicCatchStats.bestMonth.count} fish</Card.Description>
                </div>
              </div>
              {/* best day */}
              <div className='catch-stats-grid-row' style={{display: 'flex'}}>
                <div className='catch-stats-grid-column' style={{width: 150}}>
                  <Card.Description style={{padding: '3px 0px'}}><b>Best day: </b></Card.Description>
                </div>
                <div className='catch-stats-grid-column' >
                  {/* month is zero indexed */}
                  <Card.Description style={{padding: '3px 0px'}}>{basicCatchStats.bestDay.month + 1}/{basicCatchStats.bestDay.day}/{basicCatchStats.bestDay.year} - {basicCatchStats.bestDay.count} fish</Card.Description>
                </div>
              </div>
                            
              {/* most caught species */}
              {basicCatchStats.catchCount > 0 &&
              <div className='catch-stats-grid-row' style={{display: 'flex'}}>
                <div className='catch-stats-grid-column' style={{width: 150}}>
                  <Card.Description style={{padding: '3px 0px'}}><b>Most caught: </b></Card.Description>
                </div>
                <div className='catch-stats-grid-column' >
                  <Card.Description style={{padding: '0px 0px'}}>            
                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                      {renderTopCatches(basicCatchStats.speciesList)}
                    </div>
                  </Card.Description>
                </div>
              </div>
              }
              {/* longest catch */}
              {basicCatchStats.biggestCatch &&
                <div className='catch-stats-grid-row' style={{display: 'flex'}}>
                  <div className='catch-stats-grid-column' style={{width: 150}}>
                    <Card.Description style={{padding: '3px 0px'}}><b>Longest Catch: </b></Card.Description>
                  </div>
                  <div className='catch-stats-grid-column'>
                    <Card.Description style={{padding: '3px 0px'}}>{basicCatchStats.biggestCatch} in</Card.Description>
                  </div>
                </div>
              }
            </div>
              {basicCatchStats.catchCount > 0 ? 
                ( //basicCatchStats.fishingTypeFrequency
                  <div style={{height: 275}}>
                    <VictoryPie 
                      style={{labels: { padding: 15 }}}
                      colorScale={['navy', 'teal', 'tomato']}
                      // x={ (datum) => datum.type ? datum.type: null }
                      // y={(datum) => datum.count ? datum.count: null}
                      // x='type'
                      // y='count'
                      radius={125}
                      labelPlacement='vertical'
                      labels={({datum}) => [`${datum.x}`, `${Math.round(datum.y/basicCatchStats.catchCount*100)}%`]}
                      // labels={ ({datum}) => {
                      //   console.log(datum);
                      //   console.log(Math.round(datum.count/basicCatchStats.catchCount*100));
                      //   return Math.round(datum.count/basicCatchStats.catchCount*100) > 0 ? [`${datum.type}`, `${Math.round(datum.count/basicCatchStats.catchCount*100)}%`] : ' '
                      // }}
                      // labels={ ({ datum }) => {
                      //   console.log(datum.y)
                      //   return datum.type ? [`${datum.type}`, `${Math.round(datum.count/basicCatchStats.catchCount*100)}%`] : ''
                      // }
                      // }

                      // labelRadius={90}
                      data={basicCatchStats.fishingTypeFrequency.map(datum => {
                        console.log ({ x: datum.type, y: datum.count })
                        return { x: datum.type, y: datum.count }
                      }).filter(datum => datum.y > 0)}
                      // style={{labels: { fontSize: 20, fontWeight: 'bold', fill: 'white', align: 'center' }}}
                      labelComponent={
                        <VictoryLabel
                          // textAnchor="middle"
                          style={[
                            { fontSize: 25, },
                            { fontSize: 20, textAlign: 'middle' } ,
                          ]}
                        />
                      }
                    />
                  </div>
                )
                :
                (
                  <div style={{padding: 20}}>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', color: 'rgb(80, 80, 100);'}}>
                      <h2>No catch data to display</h2> 
                    </div>
                    <h3 style={{margin: 0, marginTop: 8}}>The Home Page gives you a detailed analysis of your fishing record.<br/>Go to the Catch Map to start logging catches</h3>
                  </div>
                )
              }
          </div>
        </Card.Content>
      </Card>
    </div>
  )

};







const createSpeciesList = catches => {
  // takes a list of catches as received from server and returns an array of objects with species catch frequencies [{ species: <species name>, count: <number caught> }, ...]
  // return the array sorted from most to least catches
  return catches
    .map(thisCatch => thisCatch.species.toLowerCase())
    .reduce((accumulator, species) => {
      const indexInAccumulator = accumulator.findIndex(frequencyObject => frequencyObject.species === species);
      if ( indexInAccumulator < 0) {
        // add this species to the array
        accumulator.push({ species, count: 1 });
      } else {
        // species already exists, increment the count
        accumulator[indexInAccumulator].count += 1;
      }
      return accumulator;
    } ,[])
    .sort ((a,b) => b.count - a.count);
};

const createFishingTypeFrequencyObject = catches => {
  // takes catches as received from server and returns object with counts for each fishing type 
  // first create object { offshore: <number>, inshore: <number>, onshore: <number> }
  const fishingTypeFrequencyObj = { offshore: 0, onshore: 0, inshore: 0}
  catches.forEach(thisCatch => fishingTypeFrequencyObj[thisCatch.fishingType] += 1);
  // final output an array that we can feed into a victory chart
  // [ { fishingType: 'offshore', count: <number> }, { fishingType: 'inshore', count: <number> }, { fishingType: 'onshore', count: <number> },  ]
  const fishingTypeFrequencyArr = [];
  for (const key in fishingTypeFrequencyObj) {
    // if (fishingTypeFrequencyObj[key] > 0) {
      // only add types for catches we have so we don't create unnecessary labels on the pie graph
      fishingTypeFrequencyArr.push({ type: key, count: fishingTypeFrequencyObj[key] });
    // }
  }
  console.log(fishingTypeFrequencyArr)
  return fishingTypeFrequencyArr;
};

const createBasicStatsObject = (catches, userBasicData) => {
  // creates a user stats object from raw server data
  // the returned object will be passed to the function that renders the starts card
  const calculateBiggestCatch = catches => {
    if (catches.length > 0) {
      const biggestCatch = Math.max(...catches.filter(thisCatch => typeof thisCatch.catchLength === 'number').map(thisCatch => thisCatch.catchLength));
      console.log(biggestCatch);
      return biggestCatch > 0 ? biggestCatch: null;
    } 
  };

  const calculateBestDayAndMonth = catches => {
    // bin catches into months and days
    // [{ month, year, count }, ...] months array
    // [{ month, year, day, count }, ...] days array
    const months = [];
    const days = [];
    // map catch dates into date objects
    catches.map(thisCatch => new Date(thisCatch.catchDate))
    // iterate through the dates array and build our months array
    .forEach(catchDate => {
      const catchDay = catchDate.getDate();
      const catchMonth = catchDate.getMonth();
      const catchYear = catchDate.getFullYear();
      // find the month, increment if it exists, create it if it doesn't
      const monthIndex = months.findIndex(monthObj => monthObj.month === catchMonth && monthObj.year === catchYear );
      if (monthIndex > -1) {
        months[monthIndex].count += 1;
      } else {
        months.push({ month: catchMonth, year: catchYear, count: 1})
      }
      // find the day, increment if it exists, create it if it doesn't
      const dayIndex = days.findIndex(monthObj => monthObj.month === catchMonth && monthObj.year === catchYear && monthObj.day === catchDay );
      if (dayIndex > -1) {
        days[dayIndex].count += 1;
      } else {
        days.push({ month: catchMonth, year: catchYear, day: catchDay, count: 1})
      }      
    });
    const bestMonth = months.sort((a, b) => b.count - a.count)[0];
    const bestDay = days.sort((a, b) => b.count - a.count)[0];
    console.log(days);
    return { bestMonth, bestDay };
  };
  
  const { bestMonth, bestDay } = calculateBestDayAndMonth(catches)
  console.log(bestMonth)
  console.log(bestDay)
  return { 
    createdAt: userBasicData.createdAt, 
    username: userBasicData.username, 
    catchCount: catches.length, 
    biggestCatch: calculateBiggestCatch(catches), 
    speciesList: createSpeciesList(catches), 
    fishingTypeFrequency: createFishingTypeFrequencyObject(catches),
    bestMonth: bestMonth,
    bestDay: bestDay,
  };
};


const createGroupedDataForHistogram = catches => {
  // process catch data as received from query and turn it into an object grouped by species
  // final output format { "Bluefin tuna": [{species: "Bluefin tuna", catchDate: <Date>}, {species: "Bluefin tuna", catchDate: <Date>}], species2: [catches] } }
  const catchesWithDateObjects = catches.map(thisCatch => ({ species: thisCatch.species, catchDate: new Date(thisCatch.catchDate) }))
  return groupBy(catchesWithDateObjects, ({species}) => species);
};


const getYearsFromRange = range => {
  const years = [];
  const startYear = range[0].getFullYear();
  const endYear = range[1].getFullYear();
  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }
  return years;
};

const calculateDateRange = dates => {
  // takes an array of javascript dates and returns a date range [<earliest date>, <latest date>]
  // if only one date is provided, it will serve both start and end
  const sortedDates = dates.map(date => date.getTime()).sort((a,b) => a-b);
  return [new Date(sortedDates[0]), new Date(sortedDates[sortedDates.length - 1])];
};

const applyCatchFilters = (catches, filters) => {
  let newFilteredCatches = catches;
  if (filters.year) {
    console.log('filtering year');
    newFilteredCatches = newFilteredCatches.filter(thisCatch => new Date(thisCatch.catchDate).getFullYear() === filters.year);
  }
  if (filters.month) {
    console.log('filtering month')
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months.indexOf(filters.month);
    newFilteredCatches = newFilteredCatches.filter(thisCatch => new Date(thisCatch.catchDate).getMonth() === month);
  }
  return newFilteredCatches;
};

const calculateFilteredCatchesXDomain = filters => {
  // takes our filters object and returns an array with two date objects to set the x axis domain for our catches histogram
  if (filters.month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months.indexOf(filters.month);
    // set range to [first day of month, last day of month]
    console.log([new Date(filters.year, month , 1), new Date(filters.year, month + 1, 0)])
    return [new Date(filters.year, month , 1), new Date(filters.year, month + 1, 0)]
  }
  if (filters.year) {
    return [new Date(filters.year, 0, 1), new Date(filters.year, 11, 31)]
  }
  return null;
};




const calculateTimeBins = (catchData, binType) => {
  // takes catch data in format received from server and bin type and calculates x axis time bins
  // bin types are 'month', 'week'

  // set the bin type
  const d3BinType = binType === 'week' ? 'utcWeek' : 'utcMonth';
  // map catches into dates
  const dates = catchData.map(thisCatch => ({ x: new Date(thisCatch.catchDate) })).sort((a, b) => a.x.getTime() - b.x.getTime());
  console.log(dates);
  // extent returns date range from array of dates: [<earliest Date>, <latest Date>];
  const extent = d3.extent(dates, ({ x }) => x);
  const niceTimeScale = d3
    .scaleUtc() // scaletime()
    .domain(extent)
    .nice(d3[d3BinType]);
  
    // console.log(niceTimeScale);

  // get thresholds to bin data by months
  const bins = niceTimeScale.ticks(d3[d3BinType]); // utcDay
  return bins;
  // console.log(d3.extent(dates, ({ x }) => x));
}

const renderNoUserCatches = () => {
  return (
    <div style={{width: 800}}> 
      <Card fluid>
        <Card.Content style={{fontSize: 16, padding: '20px 10px'}}>
          <Card.Header>Welcome to Fish Smart</Card.Header>
          <br />
          <Card.Description>You have no catches logged. Go to "My Catches" to start logging catches.</Card.Description>
          <br />
          <Card.Description>After you log catches, you can view detailed statistics here</Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
};






const UserStatsPage = props => {
  const { user } = useContext(AuthContext);

  const { loading: loadingUserBasicData, error: userBasicDataError, data: userBasicData } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id }, onError: (err) => console.log(err)
  } );
  
  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { userId: user.id }
  });


  // we will need a state for filtered data since we will filter catches by date range, species, etc
  const [filteredCatches, setFilteredCatches] = useState(null);
  const [allCatches, setAllCatches] = useState(null)
  const [basicCatchStats, setBasicCatchStats] = useState(null);
  // for testing
  const [groupedData, setGroupedData] = useState(null);
  //{ x: [new Date(2021,1,1), new Date(2025,12,1)] }
  const [chartZoom, setChartZoom ] = useState( { x: [new Date(2020, 1, 1), new Date(2021, 12, 1)] })
  const [filteredCatchesXDomain, setFilteredCatchesXDomain] = useState(null);
  // state for histogram display properties
  const [histogramProperties, setHistogramProperties] = useState({ bins: null });
  const [dateRange, setDateRange] = useState(null);

  const [filters, setFilters] = useState({ apply: false, year: null, month: null });



  const handleZoom = domain => {
    console.log(domain)
    setChartZoom (domain);
  };


  // useEffect to initialize filteredCatches when we get server data for the first time
  useEffect (() => {
    console.log('data useEffect')
    if (!loadingUserCatches && !userCatchesError &&  !loadingUserBasicData && !userBasicDataError && userCatchesData && userBasicData ) {
      console.log('setting filtered catches on server data receipt');
      setFilteredCatches(userCatchesData.getCatches);
      setAllCatches(userCatchesData.getCatches);
      // set our time bins to monthly
      setHistogramProperties(prevProperties => ({ ...prevProperties, bins: calculateTimeBins(userCatchesData.getCatches, 'month') }));
      if (userCatchesData.getCatches.length > 0) {
        const dateRangeForAllCatches = calculateDateRange(userCatchesData.getCatches.map(thisCatch => new Date(thisCatch.catchDate)));
        console.log(dateRangeForAllCatches);
        // date range to populate our filter menu
        setDateRange(dateRangeForAllCatches);
        // date range to set x axis domain for histogram chart
        // set the domain to 1 year if less than one year
        // get the length of the interval of the date range and adjust if it's less than 1 year
        const { values: { milliseconds } } = Interval.fromDateTimes(...dateRangeForAllCatches).toDuration();
        // find the center of the date range and add 6 months to each side
        console.log(dateRangeForAllCatches[0].getTime())
        const middleOfDateRange = new Date((dateRangeForAllCatches[0].getTime() + dateRangeForAllCatches[1].getTime()) / 2);
        console.log(middleOfDateRange)
        console.log(middleOfDateRange.getYear())
        const xDomain = milliseconds < 31556926000 
          ? [new Date(middleOfDateRange.getFullYear(), middleOfDateRange.getMonth() - 6, middleOfDateRange.getDate()), new Date(middleOfDateRange.getFullYear(), middleOfDateRange.getMonth() + 6, middleOfDateRange.getDate())]
          : dateRangeForAllCatches;
          console.log(xDomain)
        setFilteredCatchesXDomain(xDomain);
      }
      // create set the basic catch stats object 
      setBasicCatchStats(createBasicStatsObject(userCatchesData.getCatches, userBasicData.getUser));
    }

  }, [loadingUserCatches, userCatchesError, userCatchesData, loadingUserBasicData, userBasicDataError, userBasicData, setAllCatches, setFilteredCatches, setBasicCatchStats, setGroupedData, setFilteredCatchesXDomain, setHistogramProperties]);
  

  // useEffect for when filtered catches changes
  useEffect(() => {
    // set grouped data for our stacked histogram of catches
    if (filteredCatches) {
      console.log('setting grouped data')
      console.log(createGroupedDataForHistogram(filteredCatches));
      setGroupedData(createGroupedDataForHistogram(filteredCatches));
    }
  }, [filteredCatches, setGroupedData])

  // useEffect for when filters change, apply the filters to the whole dataset, and set filtered catches to the filtered dataset
  useEffect(() => {
    if (filters.apply && allCatches) {
      const newFilteredCatches = applyCatchFilters(allCatches, filters);
      console.log('filtered catches')
      console.log(newFilteredCatches)
      // set our histogram time bins as weekly if we're filtering a month, otherwise set bins monthly
      const binInterval = filters.month ? 'week' : 'month';
      setHistogramProperties(prevProperties => ({ ...prevProperties, bins: calculateTimeBins(newFilteredCatches, binInterval) }));
      setFilters(prevFilters => ({ ...prevFilters, apply: false }) )
      setFilteredCatches(newFilteredCatches);
      setFilteredCatchesXDomain(calculateFilteredCatchesXDomain(filters))
    }
  }, [filters, allCatches, setFilters, setFilteredCatches, setFilteredCatchesXDomain, setHistogramProperties])



  console.log('re render stats page')



  const catchYearSelectCallback = e => {
    if (e.target.name === 'All Years') {
      setFilters(prevFilters => ({ ...prevFilters, month: null, year: null, apply: true }));
    } else {
      setFilters(prevFilters => ({ ...prevFilters, year: Number.parseInt(e.target.name), apply: true }));
    }
  };

  const catchMonthSelectCallback = e => {
    if (e.target.name === 'All Months') {
      console.log('setting filers all months')
      setFilters(prevFilters => ({ ...prevFilters, month: null, apply: true }));
    } else {
      setFilters(prevFilters => ({ ...prevFilters, month: e.target.name, apply: true }));
    }
  };






  return (
    <div style={{width: '100%', height: '100%', overflowY: 'auto'}}>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div>
          {(loadingUserBasicData || loadingUserCatches) && 
            <div>
              <LoaderFish />
              Loading your stats
            </div>
          }
        </div>

        {/* <div>
          date range filters
        </div> */}

        <div style={{margin: '10px 0px'}}>
          {/* show date range */}
          {basicCatchStats && basicCatchStats.catchCount > 0 && renderBasicStatsCard(basicCatchStats)}
          {/* total species caught aggregate  */}
          {/* and by fishing type: offshore, inshore, onshore */}
        </div>

        {basicCatchStats && basicCatchStats.catchCount === 0 &&
          renderNoUserCatches()
        }
        
        {/* <div>
          show date range
          subject to main date range filter
          graph of catches by month
          individually filterable by species
        </div> */}

        {(allCatches && allCatches.length > 0 && groupedData) &&
          <div style={{ width: 800, backgroundColor: 'white', padding: '0px 0px 0px 0px', border: '1px solid lightgrey', borderRadius: 5 }}>
          { dateRange &&
            <div style={{width: '100%', padding: '5px 20px 0px 0px', height: 50}}>
              <Dropdown style={{float: 'right'}} onItemSelect={catchYearSelectCallback} items={[ 'All Years', ...getYearsFromRange(dateRange)]} defaultIndex={getYearsFromRange(dateRange).length} />
              <Dropdown style={{float: 'right'}} onItemSelect={catchMonthSelectCallback} items={monthDropdownItems} defaultIndex={0} disabled={ !filters.year } />
            </div>
          }
          {true &&
            <VictoryChart
              // domainPadding={{x: 10}}
              domain={{x: filteredCatchesXDomain, y: [0, allCatches.length > 5 ? allCatches.length : 5 ]}}
              height={350}
              width={800}
              scale={{ x: "time" }}
              padding= {{ right: 80, left: 80, top: 40, bottom: 50 }}

              containerComponent={
                <VictoryZoomVoronoiContainer
                  zoomDimension="x"
                  allowZoom={false}
                  allowPan={false}
                  width={800}
                  // style={{border: '1px solid black'}}
                  labels= { 
                    Object.keys(groupedData).length > 0 
                      ? ({ datum }) => datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null 
                      : null
                    }
                  // return datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null
                />
              }
            >
              <VictoryLabel
                x={400}
                y={25}
                style={{fontSize: 30}}
                textAnchor="middle"
                text="Catches"
              />

              <VictoryStack
                colorScale={[
                  "#003f5c",
                  "#2f4b7c",
                  "#665191",
                  "#a05195",
                  "#d45087",
                  "#f95d6a",
                  "#ff7c43",
                  "#ffa600"
                ]}
              >
                {Object.entries(groupedData).sort((a,b) => a[1].length - b[1].length).map(([key, dataGroup]) => {
                  return (
                    <VictoryHistogram
                      bins={ histogramProperties.bins ? histogramProperties.bins : null }
                      key={key}
                      data={dataGroup}
                      x={datum => new Date(datum.catchDate)}
                      binSpacing={2}
                      style={{
                        data: { strokeWidth: 0 }
                      }}
                    />
                  );
                })}
              </VictoryStack>

              {Object.keys(groupedData).length === 0 &&
                <VictoryLabel
                  x={400}
                  y={150}
                  style={{fontSize: 30}}
                  textAnchor="middle"
                  text="No Catches to Show with Selected Filters"
                />
              }

              <VictoryAxis
                tickCount={6}
                // tickFormat={date => {
                //   // console.log(date)
                //   return [ date.toLocaleString("default", { month: "short" }), date.toLocaleString("default", { year: 'numeric' }).substring(2) ]
                // }}
                style={{ ...sharedAxisStyles }}
                // tickLabelComponent={<VictoryLabel transform='rotate(90)' />}
              />

              <VictoryAxis
                dependentAxis
                label="Catch Count"
                style={{axisLabel: { fontSize: 30 }}}
                style={sharedAxisStyles}
                tickFormat={datum => Number.parseInt(datum)}
              />
            </VictoryChart>
          }

            {/* <button onClick={() => {
                
              }}  
            >
              test
            </button> */}
          </div>
        }







      </div>
    </div>
  )
}

export default UserStatsPage;





/*

// working but slow brush and zoom
        {groupedData &&
          <div style={{width: 800, border: '1px solid red'}}>
            test with victory data as is
            <VictoryChart
              height={350}
              width={600}
              scale={{ x: "time" }}
              // containerComponent={
              //   <VictoryVoronoiContainer
              //     width={800}
              //     style={{}}
              //     labels={ ({ datum }) => datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null }
              //     // return datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null
              //   />
              // }
              containerComponent={
                <VictoryZoomContainer
                  zoomDimension="x"
                  zoomDomain={chartZoom}
                  onZoomDomainChange={domain => handleZoom(domain)}
                />
              }
            >
               <VictoryLabel
                x={225}
                y={25}
                textAnchor="middle"
                text="catches"
              /> 

              <VictoryStack
                colorScale={[
                  "#003f5c",
                  "#2f4b7c",
                  "#665191",
                  "#a05195",
                  "#d45087",
                  "#f95d6a",
                  "#ff7c43",
                  "#ffa600"
                ]}
              >
                {Object.entries(groupedData).map(([key, dataGroup]) => {
                  // groupedMusic
                  // groupedData
                  // console.log(dataGroup)
                  return (
                    <VictoryHistogram
                      key={key}
                      data={dataGroup}
                      x={datum => {
                        // console.log(datum);
                        return new Date(datum.catchDate)
                      }}
                      binSpacing={8}
                      style={{
                        data: { strokeWidth: 0 }
                      }}
                    />
                  );
                })}
              </VictoryStack>

              <VictoryAxis
                tickCount={13}
                tickFormat={date => {
                  // console.log(date)
                  return [ date.toLocaleString("default", { month: "short" }), date.toLocaleString("default", { year: 'numeric' }).substring(2) ]
                }}
                style={{ ...sharedAxisStyles }}
                // tickLabelComponent={<VictoryLabel transform='rotate(90)' />}
              />

              <VictoryAxis
                dependentAxis
                label="Total # of Songs"
                style={sharedAxisStyles}
              />
            </VictoryChart>



            <VictoryChart
              padding={{ top: 0, left: 50, right: 50, bottom: 60 }}
              width={600} height={200} scale={{ x: "time" }}
              containerComponent={
                <VictoryBrushContainer
                  brushDimension="x"
                  brushDomain={chartZoom}
                  onBrushDomainChange={domain => setChartZoom(domain)}
                />
              }
            >


            <VictoryAxis
              // domain={{ x: [new Date(2020, 1, 1), new Date(2021, 12, 1)] }}
              tickFormat={x => new Date(x).getFullYear()}
              style={{ ...sharedAxisStyles }}
              // tickLabelComponent={<VictoryLabel transform='rotate(90)' />}
            />


            <VictoryStack
              colorScale={[
                "#003f5c"
              ]}
            > 
              {Object.entries(groupedData).map(([key, dataGroup]) => {
                // groupedMusic
                // groupedData
                // console.log(dataGroup)
                return (
                  <VictoryHistogram
                    domain={{ x: [new Date(2020, 1, 1), new Date(2021, 12, 1)] }}
                    key={key}
                    data={dataGroup}
                    x='catchDate'
                    binSpacing={8}
                    style={{
                      data: { strokeWidth: 0 }
                    }}
                  />
                );
              })}
            </VictoryStack>
          </VictoryChart>








        {groupedData &&
          <div style={{width: 800, border: '1px solid red'}}>
            test with victory data as is
            <VictoryChart
              height={350}
              width={600}
              scale={{ x: "time" }}
              // containerComponent={
              //   <VictoryVoronoiContainer
              //     width={800}
              //     style={{}}
              //     labels={ ({ datum }) => datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null }
              //     // return datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null
              //   />
              // }
              containerComponent={
                <VictoryZoomContainer
                  zoomDimension="x"
                  zoomDomain={[new Date(2021,1,1), new Date(2021,12,1)]}
                  // onZoomDomainChange={this.handleZoom.bind(this)}
                />
              }
            >
              <VictoryLabel
                x={225}
                y={25}
                textAnchor="middle"
                text="catches"
              />

              <VictoryStack
                colorScale={[
                  "#003f5c",
                  "#2f4b7c",
                  "#665191",
                  "#a05195",
                  "#d45087",
                  "#f95d6a",
                  "#ff7c43",
                  "#ffa600"
                ]}
              >
                {Object.entries(groupedData).map(([key, dataGroup]) => {
                  // groupedMusic
                  // groupedData
                  // console.log(dataGroup)
                  return (
                    <VictoryHistogram
                      key={key}
                      data={dataGroup}
                      x={datum => {
                        // console.log(datum);
                        return new Date(datum.catchDate)
                      }}
                      binSpacing={8}
                      style={{
                        data: { strokeWidth: 0 }
                      }}
                    />
                  );
                })}
              </VictoryStack>

              <VictoryAxis
                tickCount={13}
                tickFormat={date => {
                  // console.log(date)
                  return [ date.toLocaleString("default", { month: "short" }), date.toLocaleString("default", { year: 'numeric' }).substring(2) ]
                }}
                style={{ ...sharedAxisStyles }}
                // tickLabelComponent={<VictoryLabel transform='rotate(90)' />}
              />

              <VictoryAxis
                dependentAxis
                label="Total # of Songs"
                style={sharedAxisStyles}
              />
            </VictoryChart>
          </div>
        }



        */