import React, { useEffect, useState, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { Dropdown, Transition } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY, GET_CATCHES } from '../gql/gql';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import LoaderFish from './LoaderFish';
import CatchCard from './CatchCard';

const MixedFeed = (props) => {
  const { user } = useContext(AuthContext);

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

  /*
  state for post query results
  state for catch query results
  state for calculated feed results

  */

  const [catches, setCatches] = useState(null);
  const [posts, setPosts] = useState(null);
  const [feed, setFeed] = useState(null);

  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(FETCH_POSTS_QUERY);

  const { loading: catchesLoading, error: catchesError, data: catchesData } = useQuery(GET_CATCHES);

  // generate and update our feed state when we get data
  useEffect(() => {
    console.log('query data useEffect');
    // inital data
    if (!postsError && !catchesError && !postsLoading && !catchesLoading && postsData && catchesData && !posts && !catches ) {
      console.log('got data')
      // posts and catches come pre-sorted with newest first, so we can unshift them off the data arrays
      // console.log(postsData)
      // console.log(catchesData)
      setPosts(postsData.getPosts);
      setCatches(catchesData.getCatches);
      const posts = [...postsData.getPosts];
      const catches = [...catchesData.getCatches];
      const mixedFeed = [];
      while (posts.length > 0 || catches.length > 0) {
        console.log('iteration')
        // while both still populated, build feed at random
        if (posts.length > 0 && catches.length > 0) {
          if (Math.random() < 0.5) {
            mixedFeed.push({ feedItemType: 'post', data: posts.shift() });
          } else {
            mixedFeed.push({ feedItemType: 'catch', data: catches.shift() });
          }
          continue;
        }
        // one is empty when we hit this point, so get the rest off the non-empty one
        if (posts.length > 0) {
          mixedFeed.push({ feedItemType: 'post', data: posts.shift() })
        } 
        if (catches.length > 0) {
          mixedFeed.push({ feedItemType: 'catch', data: catches.shift() })
        }
      }
      setFeed(mixedFeed);
    }
  }, [postsLoading, postsError, postsData, catchesLoading, catchesError, catchesData, setFeed, posts, catches])

  return (
    <div style={{width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              { (postsError || catchesError) && (
                <div className='grid-row'>
                  <h1 className='page-title'>Failed to load feed</h1>
                </div>   
              )}
              
             {user && (
                <div style={{width: 450, margin: '10px 0px'}}>
                  <CreatePost />
                </div>
              )}

              { (postsLoading || catchesLoading) && (
                <div className='grid-row'>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><LoaderFish/></div>
                  <h1 className='page-title'>Loading posts...</h1>
                </div>   
              )}

            {feed && (
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
                  {
                    feed.map(feedItem => {
                      return feedItem.feedItemType === 'post' ? (
                        <div className='grid-row' key={feedItem.data.id} style={{width: 450}}>
                          <PostCard post={feedItem.data} />
                        </div>
                      ) : 
                        feedItem.feedItemType === 'catch' ? (
                          <div className='grid-row' key={feedItem.data.id} style={{width: 450}}>
                            <CatchCard catch={feedItem.data} style={{margin: '10px 0px'}} />
                          </div>
                        ) : null;
                    })
                  }
                </Transition.Group>
                </>
              )}
    </div>
  )
}

export default MixedFeed;