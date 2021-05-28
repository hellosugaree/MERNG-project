import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Menu, Button } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { FETCH_POSTS_QUERY } from '../gql/gql';
import '../App.css';
import { AuthContext } from '../context/auth';



function Home(props) {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
  
  const handleSidebarClick = (event) => {
    console.log(event.target.name);
    if (event.target.name==='logCatch') {
      props.history.push('/logcatch');
    }
  };

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
          <Grid.Row>
            {/* LOGGED IN SIDEBAR MENU */}
            <div className='vertical-menu-container'>
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