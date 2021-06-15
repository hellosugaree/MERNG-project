import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Card, Dropdown } from 'semantic-ui-react';
import PostFeed from '../components/PostFeed';
import CatchFeed from '../components/CatchFeed';
import WeatherFeed from '../components/WeatherFeed';

import { FETCH_POSTS_QUERY, GET_CATCHES, GET_USER_BASIC_DATA } from '../gql/gql';
import '../App.css';
import { AuthContext } from '../context/auth';
import { DateTime } from 'luxon';
import BeachAccessLocations from '../components/BeachAccessLocations';



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


  const handleSidebarClick = (event) => {
    console.log(event.target.name);
    if (event.target.name==='logCatch') {
      // props.history.push('/logcatch');
      // toggle showLogCatch
      setDisplayOptions(prevOptions => ({ ...prevOptions, showCreateCatch: !prevOptions.showCreateCatch }));
    }
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
      <div className='home-page-outer-flex-container' style={{display: 'flex', height: '100%'}}>
        {/* SIDEBAR PANEL */}

        <div className='sidebar-flex-container' style={{display: 'flex', padding: 10}} >
          {/* Render different sidebar when user not logged in */}
          {!user && (
            <Grid.Row>
              <h1 className='page-title'>logged out</h1>
            </Grid.Row>
          )}
          {user && (
          <div>         
            <Grid.Row>
              {/* LOGGED IN SIDEBAR MENU */}
              <div className='vertical-menu-container'>           
                <Grid.Row>
                  {/* USER STATS CARD */}
                  <Card style={{marginBottom: 15}}>
                  <Card.Content>
                  {userStatsError && <Card.Header>Failed to load user stats</Card.Header>}
                  {userCatchesError && <Card.Header>Failed to load user catches</Card.Header>}
                  {loadingUserStats && (<Card.Header>Loading user stats</Card.Header>)}
                  {loadingUserCatches && (<Card.Header>Loading user catches</Card.Header>)}
                  {userStatsData && (
                    <>
                    <Card.Header>Your stats</Card.Header>
                    <Card.Meta>Joined Fishsmart {DateTime.fromMillis(Date.parse(userStatsData.getUser.createdAt)).toRelative()}</Card.Meta>
                    <Card.Description>Catch count: {userStatsData.getUser.catchCount}</Card.Description>
                    {userHasBiggestCatch && <Card.Description>Biggest catch {biggestCatch} inches</Card.Description>}
                    {userStatsData.getUser.catches.length > 0 && (
                      <Card.Description style={{marginTop: 10}}>
                        <a href='/mapcatches' >Show catch map</a>
                      </Card.Description>
                    )}
                    </>
                  )}
                  </Card.Content>
                  </Card>
                </Grid.Row>
                <Grid.Row>
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
                </Grid.Row>

              </div>
            </Grid.Row>
          </div>
          )}
        </div>

        {/* MAIN CONTENT PANEL */}      
        <div className='main-content-flex-container' style={{display: 'flex', margin: 5, overflowY: 'scroll', flexGrow: 1}}>
        {/* MAIN CONTENT PANEL HAS A GRID WITH 2 COLUMNS */}

        {/* FIRST MAIN CONTENT COLUMN -- POSTS */}
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
            {/* RENDER POST FEED IF SELECTED ON DROPDOWN */}
            {leftMainContentPanelDropdownIndex === 0 && (
              <PostFeed user={user} loading={loading} error={error} data={data} />
            )}
            {/* RENDER CATCH FEED IF SELECTED ON DROPDOWN */}
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

        {/* SECOND MAIN CONTENT COLUMN -- CATCHES */}
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
                      {/* RENDER POST FEED IF SELECTED ON DROPDOWN */}
          {rightMainContentPanelDropdownIndex === 0 && (
            <PostFeed user={user} loading={loading} error={error} data={data} />
          )}
          {/* RENDER CATCH FEED IF SELECTED ON DROPDOWN */}
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
      
    </div> {/* OUTER FLEX CONTAINER */}
    </div> /* OUTER MAIN CONTAINER */
  );
}

export default Home;


/*

      <Grid.Row>
        <h1 className='page-title' >Recent Posts</h1>
      </Grid.Row>


                  <Menu secondary compact vertical>
              <Menu.Item
                className='side-bar-menu-item'
                name='main'
                content={user.username}
                onClick={handleSidebarClick}
              />
              <Menu.Item
                className='side-bar-menu-item'
                name='settings'
                onClick={handleSidebarClick}
              />
            </Menu>


      */

// old post feed from main page
            /* { error && (
                <Grid.Row>
                  <h1 className='page-title'>Couldn't connect to database.<br/>Failed to load posts</h1>
                </Grid.Row>   
              )}
              
             {(user && !loading &&!error) && (
                <Grid.Row>
                    <CreatePost />
                </Grid.Row>
              )}

              { loading && (
                <Grid.Row>
                  <h1 className='page-title'>Loading posts...</h1>
                </Grid.Row>   
              )}

            {!loading && (
              <span >
                <Grid.Row>
                <Grid columns={1}>
                  <Grid.Column textAlign='center'>
                  <Dropdown
                    inline
                    options={postSortOptions}
                    defaultValue={postSortOptions[0].value}
                  />
                  </Grid.Column>
                </Grid>

                </Grid.Row>
                <Transition.Group animation='fly right' duration={600}>
                  {data && data.getPosts.map(post => (
                    <Grid.Row key={post.id}>
                      <PostCard post={post} />
                    </Grid.Row>
                  ))
                  }
                </Transition.Group>
                </span>
              )} */
