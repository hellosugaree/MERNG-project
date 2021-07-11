import React, { useContext, useState } from 'react';
import { Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Icon } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUmbrellaBeach, faComments, faFish } from '@fortawesome/free-solid-svg-icons'

import UserStatsPage from './UserStatsPage';
import MixedFeed from '../components/MixedFeed';
// import CatchFeed from '../components/CatchFeed';
import WeatherFeed from '../components/WeatherFeed';
// import LoaderFish from '../components/LoaderFish';
import UserCatchesMap from '../pages/UserCatchesMap';
import BeachAccessLocations from '../components/BeachAccessLocations';

import { GET_CATCHES } from '../gql/gql';
import { AuthContext } from '../context/auth';
// import { DateTime } from 'luxon';
import '../App.css';



function Home(props) {

  const { user } = useContext(AuthContext);

  // const { loading: loadingUserStats, error: userStatsError, data: userStatsData } = useQuery(GET_USER_BASIC_DATA, {
  //   variables: { userId: user.id }, onError: (err) => console.log(err)
  // } );

  const { loading: loadingUserCatches, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { userId: user.id }
  });
 


  // const { loading: postsLoading, error: postsError, data: postsData } = useQuery(FETCH_POSTS_QUERY);

  const { loading: feedCatchesLoading, error: feedCatchesError, data: feedCatchesData } = useQuery(GET_CATCHES);

  const [displayOptions, setDisplayOptions] = useState({ showCreateCatch: false });


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
      case 'beaches':
      props.history.push('/beaches');
      break;
      case 'posts':
      props.history.push('/posts');
      break;
      case 'catchfeed':
      props.history.push('/catchfeed');
      break;   
      default:
        props.history.push('/catchfeed');
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

  return (
  
    <div className='home-page'>
        {/* SIDEBAR PANEL */}

        <div className='home-page-side-bar'>
                  {/* USER STATS CARD
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
                  </Card> */}

                  <div style={{width: '100%', padding: '0px 40px 0px 0px', marginLeft: 5}}>
                    <img src='/img/logos/radar-icon-white-teal-sweep-teal-circle-border.svg' alt='logo of radar displaying fish location' style={{width: '60%', height: 'auto'}} />
                  </div>

                  <button type='button' name='home' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/' ? activeSideBarButtonStyle : {}}
                  >
                    <Icon name='home' style={{marginRight: 10}} />
                    Home
                  </button>
                  
                    <button type='button' name='userCatchMap' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={ path === '/user/catchmap' ? {...activeSideBarButtonStyle} : {} }
                    >
                      {/* <Icon name='map marker alternate' style={{marginRight: 10}} /> */}
                      <FontAwesomeIcon icon={faFish} style={{marginRight: 10}} />
                      My Catches
                    </button>
                  

                  <button type='button' name='posts' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/posts' ? activeSideBarButtonStyle : {}}
                  >
                    <FontAwesomeIcon icon={faComments} style={{marginRight: 10}} />
                    Posts
                  </button>
                  {/* <button type='button' name='catchfeed' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/catchfeed' ? activeSideBarButtonStyle : {}}
                  >
                    <FontAwesomeIcon icon={faFish} style={{marginRight: 10}} />
                    Catch feed
                  </button> */}

                  <button type='button' name='weather' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/weather' ? activeSideBarButtonStyle : {}}
                  >
                    <Icon name='sun' style={{marginRight: 10}} />
                    Weather
                  </button>
                  <button type='button' name='beaches' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}
                    style={path === '/beaches' ? activeSideBarButtonStyle : {}}
                  >
                    {/* <Icon name='umbrella-beach' style={{marginRight: 10}} /> */}
                    <FontAwesomeIcon icon={faUmbrellaBeach} style={{marginRight: 10}} />
                    Beaches
                  </button>

                  {/* <button type='button' name='logCatch' 
                    className='side-bar-menu-button' 
                    onClick={handleSidebarClick}>
                    Log catch
                  </button>
                  <button type='button' name='testButton' 
                    className='side-bar-menu-button' 
                    onClick={() => console.log(user)}>
                    test log
                  </button> */}
         </div>

        {/* MAIN CONTENT PANEL */}
        <div className='home-page-main-content'>
          {/* {(userStatsData && userStatsData.getUser.catches.length > 0) &&  */}
          <Route exact path='/user/catchmap' component={UserCatchesMap} />
          {/* <Route exact path='/catchfeed'><CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions} /></Route> */}
          <Route exact path='/weather' component={WeatherFeed} />
          <Route exact path='/beaches' component={BeachAccessLocations} />
          <Route exact path='/posts' ><MixedFeed user={user} /></Route>
          <Route exact path='/' ><UserStatsPage /></Route>
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