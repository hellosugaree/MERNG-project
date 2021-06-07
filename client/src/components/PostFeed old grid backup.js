import React from 'react';
import { Grid, Dropdown, Transition } from 'semantic-ui-react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

const PostFeed = (props) => {

  const postSortOptions = [
    {
      key: 'Post date ascending',
      text: 'Post date ascending',
      value: 'Post date ascending',
      icon: 'calendar plus outline',
    },

    {
      key: 'Post date descending',
      text: 'Post date descending',
      value: 'Post date descending',
      icon: 'calendar minus outline'
    }
  ];

  return (
    <div>
      { props.error && (
                <Grid.Row>
                  <h1 className='page-title'>Couldn't connect to database.<br/>Failed to load posts</h1>
                </Grid.Row>   
              )}
              
             {(props.user && !props.loading && !props.error) && (
                <Grid.Row>
                    <CreatePost />
                </Grid.Row>
              )}

              { props.loading && (
                <Grid.Row>
                  <h1 className='page-title'>Loading posts...</h1>
                </Grid.Row>   
              )}

            {!props.loading && (
              <span >
                <Grid.Row>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Dropdown
                      inline
                      options={postSortOptions}
                      defaultValue={postSortOptions[0].value}
                    />
                  </div>
                </Grid.Row>

                <Transition.Group animation='fly right' duration={600}>
                  {props.data && props.data.getPosts.map(post => (
                    <Grid.Row key={post.id}>
                      <PostCard post={post} />
                    </Grid.Row>
                  ))
                  }
                </Transition.Group>
                </span>
              )}
    </div>
  )
}

export default PostFeed;