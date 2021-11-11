import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../../context/auth";
import { Dropdown, Transition } from "semantic-ui-react";
import { FETCH_POSTS_QUERY, GET_CATCHES } from "../../gql/gql";
import PostCard from "../PostCard";
import CreatePost from "../CreatePost";
import LoaderFish from "../LoaderFish";
import CatchCard from "../CatchCard";

const MixedFeed = props => {
  const { user } = useContext(AuthContext);

  const postSortOptions = [
    {
      key: "Post date ascending",
      text: "Post date ascending",
      value: "Post date ascending",
      icon: "calendar plus outline",
    },

    {
      key: "Post date descending",
      text: "Post date descending",
      value: "Post date descending",
      icon: "calendar minus outline",
    },
  ];

  const [feed, setFeed] = useState(null);

  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery(FETCH_POSTS_QUERY);

  const {
    loading: catchesLoading,
    error: catchesError,
    data: catchesData,
  } = useQuery(GET_CATCHES);

  // generate and update our feed state when we get data
  useEffect(() => {
    console.log("query data useEffect");
    // inital data sets the order for the feed
    if (
      !postsError &&
      !catchesError &&
      !postsLoading &&
      !catchesLoading &&
      postsData &&
      catchesData
    ) {
      console.log("got data");
      // check if this is the first data received
      if (!feed) {
        // posts and catches come pre-sorted with newest first, so we can shift them off the data arrays
        const posts = [...postsData.getPosts];
        const catches = [...catchesData.getCatches];
        const mixedFeed = [];
        console.log(catchesData.getCatches);
        console.log(postsData.getPosts);
        while (posts.length > 0 || catches.length > 0) {
          // while both still populated, build feed at random
          if (posts.length > 0 && catches.length > 0) {
            if (Math.random() < 0.5) {
              mixedFeed.push(posts.shift());
            } else {
              mixedFeed.push(catches.shift());
            }
            continue;
          }
          // one is empty when we hit this point, so get the rest off the non-empty one
          if (posts.length > 0) {
            mixedFeed.push(posts.shift());
          }
          if (catches.length > 0) {
            mixedFeed.push(catches.shift());
          }
        }
        setFeed(mixedFeed);
        console.log(mixedFeed);
      } else {
        // we already created a feed, so this data is either an update (new like or comment) or a new item or deleted item
        // we want to preserve the order of the feed so it doesn't reshuffle when we like or comment on a post
        const updatedServerData = [
          ...postsData.getPosts,
          ...catchesData.getCatches,
        ];
        const newFeed = [];
        feed.forEach(oldFeedItem => {
          const indexOfOldFeedItemInUpdatedServerData =
            updatedServerData.findIndex(
              updatedItem => updatedItem.id === oldFeedItem.id
            );
          if (indexOfOldFeedItemInUpdatedServerData > -1) {
            newFeed.push(
              ...updatedServerData.splice(
                indexOfOldFeedItemInUpdatedServerData,
                1
              )
            );
          }
        });
        // if there are leftover items in updatedServerData (new feed items), splice them onto beginning of array
        if (updatedServerData.length > 0) {
          newFeed.splice(0, 0, ...updatedServerData);
        }
        console.log(newFeed);
        console.log(updatedServerData);
        setFeed(newFeed);
      }
    }
  }, [
    postsLoading,
    postsError,
    postsData,
    catchesLoading,
    catchesError,
    catchesData,
    setFeed,
  ]);

  return (
    <div className='feed-container' >
      {(postsError || catchesError) && (
        <div className="grid-row">
          <h1 className="page-title">Failed to load feed</h1>
        </div>
      )}

      {user && (
        <div className='feed-card-container'>
          <CreatePost />
        </div>
      )}

      {(postsLoading || catchesLoading) && (
        <div className="grid-row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoaderFish />
          </div>
          <h1 className="page-title">Loading posts...</h1>
        </div>
      )}

      {feed && (
        <>
          <Dropdown
            style={{margin: '10px 0px'}}
            inline
            options={postSortOptions}
            defaultValue={postSortOptions[0].value}
          />
          <Transition.Group animation="fly right" duration={600}>
            {feed.map(feedItem => {
              return feedItem.__typename === "Post" ? (
                <div
                  className='feed-card-container'
                  key={feedItem.id}
                >
                  <PostCard post={feedItem} />
                </div>
              ) : feedItem.__typename === "Catch" ? (
                <div
                  className='feed-card-container'
                  key={feedItem.id}

                >
                  <CatchCard catch={feedItem} style={{ margin: "10px 0px" }} />
                </div>
              ) : null;
            })}
          </Transition.Group>
        </>
      )}
    </div>
  );
};

export default MixedFeed;
