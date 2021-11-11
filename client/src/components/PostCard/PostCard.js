import React, { useContext, useState } from 'react';
import { Card, Button, Image, Comment, Grid } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../../gql/gql';
import { AuthContext } from '../../context/auth';
import { useForm } from '../../utilities/hooks';
import PostCardMenu from '../PostCardMenu';
import CommentCard from '../CommentCard';
import CreateComment from '../CreateComment';

function PostCard(props) {
  const { id, username, createdAt, title, comments, body, likes, likeCount, commentCount, profilePhoto } = props.post;
  const { user } = useContext(AuthContext); 
  const { handleFormErrors } = useForm();

  const [shakeLike, setShakeLike] = useState(false);
  const [shakeComment, setShakeComment] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(2);
  const [showCreateComment, setShowCreateComment] = useState({isMounted: false, show: false});
  const [displayLikes, setDisplayLikes] = useState(false);

  const [likePost, { loading }] = useMutation(LIKE_POST, {
    update(cache, data) {
      console.log('done');
      console.log(cache);
      console.log(data);
    },
    onError(err) {
      handleFormErrors(err);
    }
  });

  // show likes when hover over like button
  let displayLikesTimer;
  const likeMouseOn = () => {
    if (likeCount === 0) return;
    clearTimeout(displayLikesTimer);
    console.log('mouse in')
    displayLikesTimer = setTimeout(() => setDisplayLikes(true), 800);
  };
  const likeMouseOff = () => {
    clearTimeout(displayLikesTimer);
    setDisplayLikes(false);
  }

  const handleLikeClick = (event) => {
    event.preventDefault();
    setDisplayLikes(false);
    if (!user) {
      setShakeLike(true)
      return setTimeout(() => setShakeLike(false), 2000);
    }
    likePost({variables: { postId: props.post.id }});
  } 

  const handleCommentClick = (event) => {
    event.preventDefault();
    if (!user) {
      setShakeComment(true)
      return setTimeout(() => setShakeComment(false), 2000);
    }
    if (!showCreateComment.isMounted) {
      // if not mounted for first time, lets mount it and show it
      setShowCreateComment({show: true, isMounted: true});
    } else {
      // it's already mounted so let's keep it mounted and just hide it
      setShowCreateComment({ isMounted: true, show: !showCreateComment.show});
    }
  };

  const mappedComments = comments.length > 0 
    ? comments.map(comment => (<CommentCard key={comment.id} { ...comment } />))
    : false;

  const showMoreComments = () => {
    setCommentsToShow((prevState) => setCommentsToShow(prevState + 2));
  };

  const showLessComments = () => {
    setCommentsToShow((prevState) => setCommentsToShow(prevState - 2));
  };

  const mapLikes = () => {
    if (likeCount === 1) {
      if (likes[0].username === user.username) {
        return 'You liked this';
      } else {
        return `${likes[0].username} liked this`;
      }
    }

    let likedBy = likes.map(like => like.username);
    let likedByUser = false;
    const userLikeIndex = likedBy.indexOf(user.username);

    if (userLikeIndex > -1) {
      likedByUser = true;
      likedBy.splice(userLikeIndex, 1)
    }
    if (likedBy.length <= 5) {
      const lastLike = likedBy.pop();
      return `${likedByUser ? 'You, ': ''}${likedBy.join(', ')} and ${lastLike} liked this`;
    }
    if (likedBy.length > 5) {
      if (likedByUser) {
        likedBy = likedBy.slice(0,3);
      } else {
        likedBy = likedBy.slice(0,4);
      }
      const lastLike = likedBy.pop();
      console.log(`like count ${likeCount}`)
      console.log(likedBy.join(', '))
      return `${likedByUser ? 'You, ': ''}${likedBy.join(', ')}, ${lastLike}, and ${likeCount - 1 - likedBy.length - (likedByUser ? 1 : 0)} others like this`;
    }
  };

    return (
    <Card className='feed-card' > 
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src={profilePhoto.secure_url}
        />
        <Card.Header>{username}</Card.Header>
        {/* can pass true to fromNow to remove 'ago' from date display */}
        <Card.Meta as={Link} to={`/posts/${id}`}>{DateTime.fromMillis(Date.parse(createdAt)).toRelative()}</Card.Meta>
        <Card.Header size='small' style={{paddingTop: 20, fontSize: 15}}>{title}</Card.Header>
        <Card.Description>{body}</Card.Description>
        {/* show restricted options only on user's post card when user is logged in */}
        {(user && user.username === props.post.username) && (
          <PostCardMenu postId={props.post.id}/>
        )}
      </Card.Content>

      {mappedComments && (
        <Card.Content>                    
          <Comment.Group>
              {mappedComments.slice(0, commentsToShow)}
                <Comment.Actions>
                  {
                    mappedComments.length > commentsToShow && 
                      <Comment.Action style={{display: 'block', float: 'left'}} onClick={showMoreComments} >show more comments...</Comment.Action>
                  }
                  {
                    (mappedComments.length > 0 && commentsToShow > 2) &&
                     <Comment.Action style={{display: 'block', float: 'right'}} onClick={showLessComments} >show less comments...</Comment.Action>
                  }
                </Comment.Actions>
          </Comment.Group>
      </Card.Content>
      )}
        
      {showCreateComment.isMounted && (
        <div style={{display: showCreateComment.show ? null : 'none'}}>
          <CreateComment postId={id}/>
        </div>
      )}

      <Card.Content extra style={{margin: 0, padding: 10}}>
        <Grid style={{margin: 0, padding: 0}} columns={2}>
          <Grid.Column mobile={16} tablet={8} computer={8} style={{padding: 0, margin: 0}}>
            <Button
                className='ui fluid'
                style={{position: 'relative', margin: 0, padding: 0, animation: shakeLike ? 'shake 0.5s' : 'none'}}
                size='mini'
                basic
                color='teal'
                icon='thumbs up'
                label={{ basic: true, color: 'teal', pointing: 'left', content: likeCount }}
                onClick={shakeLike ? null : handleLikeClick}
                loading={loading}
                onMouseEnter={likeMouseOn}
                onMouseLeave={likeMouseOff}
            />
            <div style={{display: displayLikes ? '' : 'none', maxWidth: '100%', backgroundColor: 'white', color: 'black', border: '1px solid grey', borderRadius: 5, padding: 5, position: 'absolute', bottom: 40, zIndex: 100}}>
              {mapLikes()}
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={8} style={{padding: 0, margin: 0}}>
            <Button
                className='ui fluid'
                style={{position: 'relative', margin: 0, padding: 0, animation: shakeComment ? 'shake 0.5s' : 'none'}}
                size='mini'
                basic
                color='blue'
                icon='comment'
                label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
                onClick={shakeComment? null : handleCommentClick}
                
              />
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );
}

export default PostCard;