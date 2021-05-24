import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { FETCH_POSTS_QUERY } from '../gql/gql';
import '../App.css';
import { AuthContext } from '../context/auth';


function Home() {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
  
  return (
    <Grid columns={3} relaxed >
      {(user && !loading) && (
        <Grid.Row>
          <CreatePost />
        </Grid.Row>
      )}
    
     {!user &&  <h1 className='page-title' >Recent Posts</h1>}

      <Grid.Row>
        {
          loading ? (
            <h1 className='page-title'>Loading posts...</h1>
          ) : (
            <Transition.Group animation='fly right' duration={600}>
            {data && data.getPosts.map(post => (
              <Grid.Column key={post.id} style={{marginBottom: '20px'}}>
                <PostCard post={post} />
              </Grid.Column>
            )
            )
            }
            </Transition.Group>
          )
        }
        </Grid.Row>

    </Grid>
  );
}

export default Home;


/*

      <Grid.Row>
        <h1 className='page-title' >Recent Posts</h1>
      </Grid.Row>

      */