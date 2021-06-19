import React, { useContext, useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Icon, Card, Dropdown, TextArea } from 'semantic-ui-react';


import PostFeed from '../components/PostFeed';
import CatchFeed from '../components/CatchFeed';
import WeatherFeed from '../components/WeatherFeed';
import LoaderFish from '../components/LoaderFish';
import DoubleFeed from '../components/DoubleFeed';
import UserCatchesMap from '../pages/UserCatchesMap';
import BeachAccessLocations from '../components/BeachAccessLocations';

import { FETCH_POSTS_QUERY, GET_CATCHES, GET_USER_BASIC_DATA } from '../gql/gql';
import { AuthContext } from '../context/auth';
import { DateTime } from 'luxon';
import '../App.css';



function Home(props) {

  const { user } = useContext(AuthContext);

  const { loading: loadingUserStats, error: userStatsError, data: userStatsData } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id }, onError: (err) => console.log(err)
  } );

  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { catchesToReturn: 100, userId: user.id }
  });
 


  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  const { loading: feedCatchesLoading, error: feedCatchesError, data: feedCatchesData } = useQuery(GET_CATCHES);

  const [displayOptions, setDisplayOptions] = useState({ showCreateCatch: false });
  // control for dropdown to select content on the left and right main panel, uses index of the options array
  const [leftMainContentPanelDropdownIndex, setLeftMainContentPanelDropdownIndex] = useState(0);
  const [rightMainContentPanelDropdownIndex, setRightMainContentPanelDropdownIndex] = useState(1);

  // only for testing purposes
/*   const handleLog = () => {
    // userCatchesData.getCatches.forEach(catch => console.log(catch));
    console.log(userCatchesData.getCatches)
    userCatchesData.getCatches.forEach(val => console.log(val))
    const longestCatch = Math.max(...userCatchesData.getCatches.map(value => value.catchLength));
    console.log(longestCatch); 

    // console.log(userCatchesData.getCatches.reduce((prev, current) => prev.catchLength - current.catchLength).catchLength)
  }
*/

  // used for our route-specific styling
  const path = props.location.pathname;
  // style for our active sidebar button
  const activeSideBarButtonStyle = {
    // backgroundColor: '#F4FDFF',
    boxShadow: 'none',
    color: 'teal'
  }


  const handleSidebarClick = (event) => {
    if (event.target.name==='logCatch') {
      // props.history.push('/logcatch');
      // toggle showLogCatch
      setDisplayOptions(prevOptions => ({ ...prevOptions, showCreateCatch: !prevOptions.showCreateCatch }));
    }
    switch (event.target.name) {
      case 'userCatchMap':
        props.history.push('/user/catchmap');
      break;
      case 'home':
        props.history.push('/');
      break;
      case 'weather':
        props.history.push('/weather');
      break;
    }



    console.log(props.location.pathname);
  };

  // update our biggest catch if user logs a bigger catch
  let userHasBiggestCatch;
  let biggestCatch;
  if (userCatchesData) {
    userHasBiggestCatch = Math.max(...userCatchesData.getCatches.map(value => value.catchLength)) > 0;
    biggestCatch = Math.max(...userCatchesData.getCatches.map(value => value.catchLength))
  }

// /      image: {as: 'div', style:{ height: 30, width: 50, border:'2px solid black', borderRadius: 5}, src: '/img/icons/post-icon-blue-small.jpg'}

  const leftMainContentPanelDropdownOptions = [
    {
      key: 'posts',
      value: 0,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center'}}>
        <div style={{height: 30, width: 50, backgroundColor: '#6795CE', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/post-icon-blue-small.jpg' alt='Posts feed icon' style={{maxHeight: '95%', margin: '0px auto 0px auto'}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Post feed</div>
        </div>
      )
    },

    {
      key: 'catches',
      value: 1,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center'}}>
        <div style={{height: 30, width: 50, backgroundColor: '#71B1AD', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/halibut-teal-background-tiny.jpg' alt='Catches feed icon' style={{maxHeight: '95%', margin: '0px auto 0px auto'}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Catch feed</div>
        </div>
      )
    },

    {
      key: 'weather',
      value: 2,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center'}}>
        <div style={{height: 30, width: 50, backgroundColor: '#2E69C2', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/weather-icon.png' alt='Weather feed icon' style={{ width: 50, margin: '0px auto 0px auto', borderRadius: 5}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Weather feed</div>
        </div>
      )
    },

    {
      key: 'beach access',
      value: 3,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center', width: 200 }}>
        <div style={{height: 30, width: 50, backgroundColor: '#2E69C2', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/beach-icon-small.jpg' alt='Beach access page icon' style={{ width: 50, margin: '0px auto 0px auto', borderRadius: 5}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Beach Access Locations</div>
        </div>
      )
    }
  ];

  // handlers for the feed selection dropdowns on main content panels
  const handleLeftMainContentPanelDropdownChange = (event, { value }) => {
    setLeftMainContentPanelDropdownIndex(value);
  }
  const handleRightMainContentPanelDropdownChange = (event, { value }) => {
    setRightMainContentPanelDropdownIndex(value);
  }


  return (
  
    <div className='home-page'>
        {/* SIDEBAR PANEL */}

        <div className='home-page-side-bar'>
                  {/* USER STATS CARD */}
                  <Card fluid style={{marginBottom: 15}}>
                  <Card.Content>
                  {(!(userStatsData && userCatchesData ) && !(userCatchesError || userStatsError)) && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><LoaderFish/></div>}
                  {userStatsError && <Card.Header>Failed to load user stats</Card.Header>}
                  {userCatchesError && <Card.Header>Failed to load user catches</Card.Header>}
                  {loadingUserStats && (<Card.Header>Loading user stats</Card.Header>)}
                  {loadingUserCatches && (<Card.Header>Loading user catches</Card.Header>)}
                  {userStatsData &&  userCatchesData && (
                    <>
                    <Card.Header>Your stats</Card.Header>
                    <Card.Meta>Joined Fishsmart {DateTime.fromMillis(Date.parse(userStatsData.getUser.createdAt)).toRelative()}</Card.Meta>
                    <Card.Description>Catch count: {userStatsData.getUser.catchCount}</Card.Description>
                    {userHasBiggestCatch && <Card.Description>Biggest catch {biggestCatch} inches</Card.Description>}
                    {userStatsData.getUser.catches.length > 0 && (
                      <Card.Description style={{marginTop: 10}}>
                        <Link to='/user/catchmap'>Show catch map</Link>
                      </Card.Description>
                    )}
                    </>
                  )}
                  </Card.Content>
                  </Card>

                  <button type='button' name='home' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/' ? activeSideBarButtonStyle : {}}
                  >
                    <Icon name='home' style={{marginRight: 10}} />
                    Home
                  </button>
                  {userStatsData && userStatsData.getUser.catches.length > 0 &&
                    <button type='button' name='userCatchMap' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={ path === '/user/catchmap' ? {... activeSideBarButtonStyle} : {} }
                    >
                      <Icon name='map marker alternate' style={{marginRight: 10}} />                    
                      My Catches
                    </button>
                  }
                  <button type='button' name='weather' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/weather' ? activeSideBarButtonStyle : {}}
                  >
                    <Icon name='sun' style={{marginRight: 10}} />
                    Weather
                  </button>

                  <button type='button' name='logCatch' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}>
                    Log catch
                  </button>
                  <button type='button' name='testButton' 
                    className='side-bar-menu-button' 
                    onClick={() => console.log(user)}>
                    test log
                  </button>
         </div>

        {/* MAIN CONTENT PANEL */}
        <div className='home-page-main-content'>
          <Route exact path='/' component={DoubleFeed} />
          <Route exact path='/user/catchmap'>
            {(userStatsData && userStatsData.getUser.catches.length > 0) 
              ? <UserCatchesMap />
              : <DoubleFeed  />
            }
          </Route>
          <Route exact path='/catchfeed'><CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions} /></Route>
          <Route exact path='/weather' component={WeatherFeed} />
        </div>

      





    </div> 
  );
}

export default Home;

/*
    <div className='main-content-flex-container' style={{display: 'flex', margin: 5, overflowY: 'scroll', flexGrow: 1, border: '1px solid red'}}>

        <div className='left-main-content-flex-container' style={{display: 'flex',  flexDirection: 'column', flexGrow: 1, padding: 10, margin: 5}}>
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
            <div style={{display: 'flex', flexGrow: 1, maxWidth: 400}}>
              <Dropdown
                fluid
                selection
                selectOnNavigation={false}
                options={leftMainContentPanelDropdownOptions}
                onChange={handleLeftMainContentPanelDropdownChange}
                value={leftMainContentPanelDropdownIndex}
                trigger={leftMainContentPanelDropdownOptions[leftMainContentPanelDropdownIndex].content}
                />
            </div>
          </div>
          <div style={{}}>
            {leftMainContentPanelDropdownIndex === 0 && (
              <PostFeed user={user} loading={loading} error={error} data={data} />
            )}
            {leftMainContentPanelDropdownIndex === 1 && (
              <CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions}/>
            )}
            {leftMainContentPanelDropdownIndex === 2 && (
              <WeatherFeed />
            )}
            {leftMainContentPanelDropdownIndex === 3 && (
              <BeachAccessLocations />
            )}
          </div>

        </div>

        <div className='right-main-content-flex-container' style={{display: 'flex', flexGrow: 1, flexDirection: 'column', padding: 10, margin: 5}}>

          <Grid.Row>
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
            <div style={{display: 'flex', flexGrow: 1, maxWidth: 400}}>
              <Dropdown
                fluid
                selection
                selectOnNavigation={false}
                options={leftMainContentPanelDropdownOptions}
                onChange={handleRightMainContentPanelDropdownChange}
                value={rightMainContentPanelDropdownIndex}
                trigger={leftMainContentPanelDropdownOptions[rightMainContentPanelDropdownIndex].content}
              />
            </div>
          </div>
          </Grid.Row>
          {rightMainContentPanelDropdownIndex === 0 && (
            <PostFeed user={user} loading={loading} error={error} data={data} />
          )}
          {rightMainContentPanelDropdownIndex === 1 && (
            <CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions}/>
          )}
          {rightMainContentPanelDropdownIndex === 2 && (
            <WeatherFeed />
          )}      
          {rightMainContentPanelDropdownIndex === 3 && (
            <BeachAccessLocations />
          )}    
        </div>   
</div>
        */