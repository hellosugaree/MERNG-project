import React, { useContext, useState } from 'react';
import { Card, Button, Image, Popup, Transition, Menu, Icon, Form, Comment } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../gql/gql';
import { AuthContext } from '../context/auth';
import { useForm } from '../utilities/hooks';
import PostCardMenu from '../components/PostCardMenu';
import CommentCard from '../components/CommentCard';
import CreateComment from '../components/CreateComment';

function PostCard(props) {
  const { id, username, createdAt, title, comments, body, likes, likeCount, commentCount } = props.post;
 
  // use to determine if a user is logged in
  const { user } = useContext(AuthContext); 

  // handle form errors for mutations
  const { errors, handleFormErrors } = useForm();

  // state to manage animation for like and comment buttons when logged out
  const [shakeLike, setShakeLike] = useState(false);
  const [shakeComment, setShakeComment] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(2);
  const [showCreateComment, setShowCreateComment] = useState({isMounted: false, show: false});

  // like a post
  const [likePost, { loading, data }] = useMutation(LIKE_POST, {
    done(_, data) {
  
    },
    onError(err) {
      handleFormErrors(err);
    }
  });



  // like click handler
  const handleLikeClick = (event) => {
    event.preventDefault();
    if (!user) {
      setShakeLike(true)
      return setTimeout(() => setShakeLike(false), 2000);
    }
    likePost({variables: { postId: props.post.id }});
  } 

  // comment click handler
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

  }

    // map comments into an array of comment cards
    // we need to pass the commentId and postId so our comment card menu can run mutations on comments
    const mappedComments = comments.length > 0 
      ? comments.map(comment => (<CommentCard key={comment.id} commentId={comment.id} postId={id} body={comment.body} username={comment.username} createdAt={comment.createdAt}/>))
      : false;

    const showMoreComments = () => {
      setCommentsToShow((prevState) => setCommentsToShow(prevState + 2));
    }

    const showLessComments = () => {
      setCommentsToShow((prevState) => setCommentsToShow(prevState - 2));
    }

    return (
    <Card fluid style={{ maxWidth: 350, margin: '10px auto 10px auto'}} > {/* fluid lets the cards stretch to fill */}
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        
        {/* can pass true to fromNow to remove 'ago' from date display */}
        <Card.Meta as={Link} to={`/posts/${id}`}>{DateTime.fromMillis(Date.parse(createdAt)).toRelative()}</Card.Meta>
        <Card.Header size='small' style={{paddingTop: 20, fontSize: 15}}>{title}</Card.Header>
        <Card.Description>{body}</Card.Description>


        {/* show restricted options only on user's post card when user is logged in */}
        {(user && user.username === props.post.username) && (
          <PostCardMenu postId={props.post.id}/>
        )
        }
        
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
        
        {
          /* create a CreateComment component and pass it the id of the post to be used in the mutation */
          showCreateComment.isMounted && (
            <div style={{display: showCreateComment.show ? null : 'none'}}>
             <CreateComment postId={id}/>
            </div>
          )
        }

      <Card.Content extra>
        <Button.Group fluid compact>
        <Popup 
            disabled={shakeLike ? false : true } 
            content={user ? '' : 'You must log in to like post'} 
            open
            trigger={
            <Button
                style={{animation: shakeLike ? 'shake 0.5s' : 'none'}}
                basic
                size='mini'
                color='teal'
                icon='thumbs up'
                label={{ basic: true, color: 'teal', pointing: 'left', content: likeCount }}
                onClick={shakeLike ? null : handleLikeClick}
                loading={loading}
            />
            }
            />

          <Popup 
            disabled={shakeComment ? false : true } 
            content={user ? '' : 'You must log in to comment'} 
            open
            trigger={
              <Button
                style={{animation: shakeComment ? 'shake 0.5s' : 'none'}}
                size='mini'
                basic
                color='blue'
                icon='comment'
                label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
                onClick={shakeComment? null : handleCommentClick}
              />
            } 
          />
        </Button.Group>
 
      </Card.Content>


    </Card>

  



  );
}

export default PostCard;

{/* <Comment.Action  style={{display: 'block'}} onClick={showLessComments} >show less comments...</Comment.Action> */}


/*
          <Button icon='thumbs up' size='mini' basic color='teal' />
          <Button icon='comment' size='mini' color='teal' />
          */



          /*
         <Popup 
            disabled={ otherState.hidePostMenu } 
            content={
              <PostCardMenu />             
            } 
            on='click'
            trigger={
              <Button 
                circular
                loading={deletePostLoading}
                onClick={handleDeleteClick}
                size='tiny'
                basic floated='right' 
                icon='ellipsis vertical'
              />
            }
          />


          <Comment key={comment.id} body={comment.body} username={comment.username} createdAt={comment.createdAt} />



                {mappedComments ? (
      <Card.Content>
        <Comment.Group>
        {mappedComments}
        </Comment.Group>
      </Card.Content>
      ) : ''
      }





          */