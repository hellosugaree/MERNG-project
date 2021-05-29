import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Menu, Button, Card, Segment } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import CatchCard from '../components/CatchCard';
import CreatePost from '../components/CreatePost';
import { FETCH_POSTS_QUERY, GET_CATCHES, GET_USER_BASIC_DATA } from '../gql/gql';
import '../App.css';
import { AuthContext } from '../context/auth';
import { DateTime } from 'luxon';
import { getDefaultValues } from '@apollo/client/utilities';


function Home(props) {
  const { user } = useContext(AuthContext);
  
  const { loading: loadingUserStats, error: userStatsError, data: userStatsData } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id }, onError: (err) => console.log(err)
  } );

  const { loading: userCatchesLoading, error: userCatchesError, data: userCatchesData } = useQuery(GET_CATCHES, {
    variables: { catchesToReturn: 100, userId: user.id }
  });

  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  const { loading: feedCatchesLoading, error: feedCatchesError, data: feedCatchesData } = useQuery(GET_CATCHES);

 const handleLog = () => {
  console.log(Math.max(3, null))

  // userCatchesData.getCatches.forEach(catch => console.log(catch));
  console.log(userCatchesData.getCatches)
  userCatchesData.getCatches.forEach(val => console.log(val))
  const longestCatch = Math.max(...userCatchesData.getCatches.map(value => value.catchLength));
  console.log(longestCatch);

  // console.log(userCatchesData.getCatches.reduce((prev, current) => prev.catchLength - current.catchLength).catchLength)

 }

  const handleSidebarClick = (event) => {
    console.log(event.target.name);
    if (event.target.name==='logCatch') {
      props.history.push('/logcatch');
    }
  };

  let userHasBiggestCatch;
  let biggestCatch;
  if (userCatchesData) {
    userHasBiggestCatch = Math.max(...userCatchesData.getCatches.map(value => value.catchLength)) > 0;
    biggestCatch = Math.max(...userCatchesData.getCatches.map(value => value.catchLength))
  }

  return (
  
    <div className='home-page'>
      <Grid columns={2} style={{marginRight: 'auto', marginLeft: 'auto'}}>
        {/* SIDEBAR PANEL */}
        <Grid.Column width={4} className='side-bar'>
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
                <Card style={{marginBottom: 15}}>
                <Card.Content>
                {loadingUserStats && (<Card.Header>Loading user stats</Card.Header>)}
                {userStatsData && (
                  <>
                  <Card.Header>Your stats</Card.Header>
                  <Card.Meta>Joined Fishsmart {DateTime.fromMillis(Date.parse(userStatsData.getUser.createdAt)).toRelative()}</Card.Meta>
                  <Card.Description>Catch count: {userStatsData.getUser.catchCount}</Card.Description>
                  {userHasBiggestCatch && <Card.Description>Biggest catch {biggestCatch} inches</Card.Description>}
                  </>
                
              
                
                )}
                </Card.Content>
                </Card>
              </Grid.Row>
            
                <button type='button' name='profile' className='side-bar-menu-button' onClick={handleSidebarClick}>
                  {user.username}
                </button>
                <button type='button' name='logCatch' 
                  className='side-bar-menu-button' 
                  onClick={handleSidebarClick}>
                  
                  Log catch
                </button>
              </div>
            </Grid.Row>
          </div>
          )}
        </Grid.Column>

        {/* MAIN CONTENT PANEL */}      
        <Grid.Column width={12} style={{height: '100vh', paddingBottom:'50px', overflowY: 'scroll'}} >
          <Grid columns={2}   >
              { loading && (
                <Grid.Row>
                  <h1 className='page-title'>Loading posts...</h1>
                </Grid.Row>   
              )}
            <Grid.Row>

        {/* TEST CATCH */}
        {feedCatchesData && 
          feedCatchesData.getCatches.map(catchData => (
            <Grid.Column key={catchData.id}>
              <CatchCard catch={catchData} />
            </Grid.Column>
          ))
        }
              
            <Grid.Column>
              <CatchCard catch={{'username': 'hellosugaree', id:'2373g3737g37g22u2g', species: 'Striped Bass', catchLength: 12, catchLocation: 'SF Bay', catchDate: '2021/05/21', notes: 'tasty'}}/>
            </Grid.Column>

              {(user && !loading) && (
                <Grid.Column>
                    <CreatePost />
                </Grid.Column>
              )}
      
              {!loading && (
                <Transition.Group animation='fly right' duration={600}>
                  {data && data.getPosts.map(post => (
                    <Grid.Column key={post.id}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))
                  }
                </Transition.Group>
              )}
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
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