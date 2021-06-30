import React from 'react';
import { Dropdown, Transition } from 'semantic-ui-react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import LoaderFish from './LoaderFish';
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
    <div style={{width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              { props.error && (
                <div className='grid-row'>
                  <h1 className='page-title'>Couldn't connect to database.<br/>Failed to load posts</h1>
                </div>   
              )}
              
             {(props.user && !props.loading && !props.error) && (
                <div style={{width: 450, margin: '10px 0px'}}>
                  <CreatePost />
                </div>
              )}

              { props.loading && (
                <div className='grid-row'>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><LoaderFish/></div>
                  <h1 className='page-title'>Loading posts...</h1>
                </div>   
              )}

            {!props.loading && (
              <>
                <div className='grid-row'>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Dropdown
                      inline
                      options={postSortOptions}
                      defaultValue={postSortOptions[0].value}
                    />
                  </div>
                </div>

                <Transition.Group animation='fly right' duration={600}>
                  {props.data && props.data.getPosts.map(post => (
                    <div className='grid-row' key={post.id} style={{width: 450}}>
                      <PostCard post={post} />
                    </div>
                  ))
                  }
                </Transition.Group>
                </>
              )}
    </div>
  )
}

export default PostFeed;