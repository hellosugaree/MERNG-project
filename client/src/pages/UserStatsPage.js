import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { groupBy } from 'lodash';
import { VictoryChart, VictoryLabel, VictoryPie, VictoryVoronoiContainer, VictoryStack, VictoryHistogram, VictoryAxis, createContainer } from 'victory';
import { DateTime, Interval } from 'luxon';
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
  // takes an array of catches and user stats fata from a GET_USER_BASIC_DATA query and renders a basic stats card
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
            <div style={{display: 'flex', flexDirection: 'column', border: '1px solid lightgrey', borderRadius: 5, padding: 10}}>

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
              {/* most caught species */}
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
              {/* longest catch */}
              <div className='catch-stats-grid-row' style={{display: 'flex'}}>
                <div className='catch-stats-grid-column' style={{width: 150}}>
                  <Card.Description style={{padding: '3px 0px'}}><b>Longest Catch: </b></Card.Description>
                </div>
                <div className='catch-stats-grid-column'>
                  <Card.Description style={{padding: '3px 0px'}}>{basicCatchStats.biggestCatch} in</Card.Description>
                </div>
              </div>
            </div>
            
              <div style={{height: 300}}>
                <VictoryPie 
                  style={{labels: { padding: 20 }}}
                  colorScale={['navy', 'teal', 'tomato']}
                  x='type'
                  y='count'
                  labelPlacement='vertical'
                  labels={ ({ datum }) => [datum.type, `${Math.round(datum.count/basicCatchStats.catchCount*100)}%`]}
                  // labelRadius={90}
                  data={basicCatchStats.fishingTypeFrequency}
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
    if (fishingTypeFrequencyObj[key] > 0) {
      // only add types for catches we have so we don't create unnecessary labels on the pie graph
      fishingTypeFrequencyArr.push({ type: key, count: fishingTypeFrequencyObj[key] });
    }
  }
  console.log(fishingTypeFrequencyArr)
  return fishingTypeFrequencyArr;
};

const createBasicStatsObject = (catches, userBasicData) => {
  const calculateBiggestCatch = catches => {
    if (catches.length > 0) {
      const biggestCatch = Math.max(...catches.filter(thisCatch => typeof thisCatch.catchLength === 'number').map(thisCatch => thisCatch.catchLength));
      console.log(biggestCatch);
      return biggestCatch > 0 ? biggestCatch: null;
    } 
  };
  return { createdAt: userBasicData.createdAt, username: userBasicData.username, catchCount: catches.length, biggestCatch: calculateBiggestCatch(catches), speciesList: createSpeciesList(catches), fishingTypeFrequency: createFishingTypeFrequencyObject(catches) };
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
}

const applyCatchFilters = (catches, filters) => {
  let newFilteredCatches = catches;
  if (filters.year) {
    newFilteredCatches = newFilteredCatches.filter(thisCatch => new Date(thisCatch.catchDate).getFullYear() === filters.year);
  }
  console.log(newFilteredCatches);
  return newFilteredCatches;
};

const calculateFilteredCatchesXDomain = filters => {
  // takes our filters object and returns an array with two date objects to set the x axis domain for our catches histogram
  if (filters.year) {
    return [new Date(filters.year, 0, 1), new Date(filters.year, 11, 31)]
  }
  return null;
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
      // date range to populate our filter menu
      const dateRangeForAllCatches = calculateDateRange(userCatchesData.getCatches.map(thisCatch => new Date(thisCatch.catchDate)));
      setDateRange(dateRangeForAllCatches);
      // create set the basic catch stats object 
      setBasicCatchStats(createBasicStatsObject(userCatchesData.getCatches, userBasicData.getUser));
      // separate date range of filtered data for our chart
      setFilteredCatchesXDomain(dateRangeForAllCatches);
      // need to pad if smaller than 1 year
    }

  }, [loadingUserCatches, userCatchesError, userCatchesData, loadingUserBasicData, userBasicDataError, userBasicData, setAllCatches, setFilteredCatches, setBasicCatchStats, setGroupedData, setFilteredCatchesXDomain]);
  

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
      setFilters(prevFilters => ({ ...prevFilters, apply: false }) )
      setFilteredCatches(newFilteredCatches);
      // const newFilteredDateRange = calculateDateRange(newFilteredCatches.map(thisCatch => new Date(thisCatch.catchDate)));
      // get the length of the interval of the date range and adjust if it's less than 1 month
      // const { values: { milliseconds } } = Interval.fromDateTimes(...newFilteredDateRange).toDuration();
      // console.log(milliseconds);
      // calculate a new domain for the x axis if we have date filters applied
      // setFilteredCatchesXDomain();
      console.log(calculateFilteredCatchesXDomain(filters))
      setFilteredCatchesXDomain(calculateFilteredCatchesXDomain(filters))
    }
  }, [filters, allCatches, setFilters, setFilteredCatches, setFilteredCatchesXDomain])



  console.log('re render stats page')



  const catchYearSelectCallback = e => {
    if (e.target.name === 'All Years') {
      setFilters(prevFilters => ({ ...prevFilters, year: null, apply: true }));
    } else {
      setFilters(prevFilters => ({ ...prevFilters, year: Number.parseInt(e.target.name), apply: true }));
    }
  };

  const catchMonthSelectCallback = e => {
    console.log(e.target.name);
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

        <div>
          date range filters
        </div>

        <div style={{margin: '10px 0px'}}>
          {/* show date range */}
          {basicCatchStats && renderBasicStatsCard(basicCatchStats)}
          {/* total species caught aggregate  */}
          {/* and by fishing type: offshore, inshore, onshore */}
        </div>

        
        {/* <div>
          show date range
          subject to main date range filter
          graph of catches by month
          individually filterable by species
        </div> */}

        {groupedData &&
          <div style={{ width: 800, backgroundColor: 'white', padding: '0px 0px 0px 0px', border: '1px solid lightgrey', borderRadius: 5 }}>
          { dateRange &&
            <div style={{width: '100%', padding: '5px 20px'}}>
              <Dropdown style={{float: 'right'}} onItemSelect={catchYearSelectCallback} items={[ 'All Years', ...getYearsFromRange(dateRange)]} defaultIndex={getYearsFromRange(dateRange).length} />
              <Dropdown style={{float: 'right'}} onItemSelect={catchYearSelectCallback} items={monthDropdownItems} defaultIndex={0} />
            </div>
          }
            <VictoryChart
              // domainPadding={{x: 10}}
              // y: [0, allCatches.length ]
              domain={{x: filteredCatchesXDomain}}
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
                  labels= { ({ datum }) => datum.y > 0 ? `${datum.y} ${datum.binnedData[0].species}` : null }
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
                      // bins={1}
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

              <VictoryAxis
                // tickCount={6}
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
              />
            </VictoryChart>
            {/* <button onClick={() => {
                const testFilteredCatches = userCatchesData.getCatches.filter(thisCatch => (new Date(thisCatch.catchDate).getFullYear() === 2021 && new Date(thisCatch.catchDate).getMonth() === 5  ));
                console.log(createGroupedDataForHistogram(testFilteredCatches))
                setGroupedData(createGroupedDataForHistogram(testFilteredCatches) );
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