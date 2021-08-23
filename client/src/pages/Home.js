import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
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
import UserSettings from './UserSettings';

// import { GET_CATCHES } from '../gql/gql';
import { AuthContext } from '../context/auth';
// import { DateTime } from 'luxon';
import '../App.css';



function Home(props) {

  const { user } = useContext(AuthContext);

  // const { loading: loadingUserStats, error: userStatsError, data: userStatsData } = useQuery(GET_USER_BASIC_DATA, {
  //   variables: { userId: user.id }, onError: (err) => console.log(err)
  // } );

  // const { data: userCatchesData } = useQuery(GET_CATCHES, {
  //   variables: { userId: user.id }
  // });

  // const { loading: postsLoading, error: postsError, data: postsData } = useQuery(FETCH_POSTS_QUERY);

  // const { loading: feedCatchesLoading, error: feedCatchesError, data: feedCatchesData } = useQuery(GET_CATCHES);

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
      case 'settings':
        props.history.push('/settings');
      break;
      default:
        props.history.push('/');
      break;         
    }
  };


  return (
  
    <div className='home-page'>
        {/* SIDEBAR PANEL */}
        <div className='side-bar'>
          <div style={{width: '100%', padding: '0px 40px 0px 0px', marginLeft: 5}}>
            <img src='/img/logos/radar-icon-white-teal-sweep-teal-circle-border.svg' alt='logo of radar displaying fish location' style={{width: '66%', height: 'auto'}} />
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

          <button type='button' name='settings' 
            className='side-bar-menu-button' 
            onClick={handleSidebarClick}
            style={path === '/settings' ? activeSideBarButtonStyle : {}}
          >
            {/* <Icon name='umbrella-beach' style={{marginRight: 10}} /> */}
            <Icon name='settings' style={{marginRight: 10}} />
            Settings
          </button>
        </div>
        {/* MAIN CONTENT PANEL */}
        <div className='home-page-main-content'>
          {/* {(userStatsData && userStatsData.getUser.catches.length > 0) &&  */}
          <Route exact path='/user/catchmap' component={UserCatchesMap} />
          {/* <Route exact path='/catchfeed'><CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions} /></Route> */}
          <Route exact path='/weather' component={WeatherFeed} />
          <Route exact path='/beaches' component={BeachAccessLocations} />
          <Route exact path='/posts' ><MixedFeed user={user} /></Route>
          <Route exact path='/settings'><UserSettings /></Route>
          <Route exact path='/' ><UserStatsPage /></Route>
        </div>
    </div> 
  );
}

export default Home;