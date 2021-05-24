import React, { useContext, useState } from 'react';
import { Card, Button, Image, Popup, Transition, Menu, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../gql/gql';
import { AuthContext } from '../context/auth';
import { useForm } from '../utilities/hooks';
import PostCardMenu from '../components/PostCardMenu';

function PostCard(props) {
  const { id, username, createdAt, title, body, likes, likeCount, commentCount } = props.post;
 
  // use to determine if a user is logged in
  const { user } = useContext(AuthContext); 

  // handle form errors for mutations
  const { errors, handleFormErrors } = useForm();

  // state to manage animation for like and comment buttons when logged out
  const [shakeLike, setShakeLike] = useState(false);
  const [shakeComment, setShakeComment] = useState(false);
  const [otherState, setOtherState] = useState({ hidePostMenu: true });



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
    console.log('Clicked Like');
    if (!user) {
      setShakeLike(true)
      return setTimeout(() => setShakeLike(false), 2000);
    }
    likePost({variables: { postId: props.post.id }});
  } 

  // comment click handler
  const commentPost = (event) => {
    event.preventDefault();
    console.log('Clicked Comment');
    if (!user) {
      setShakeComment(true)
      
      return setTimeout(() => setShakeComment(false), 2000);
    }
  }


  


  return (
    <Card fluid style={{minWidth: 190}}> {/* fluid lets the cards stretch to fill */}
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        
        {/* can pass true to fromNow to remove 'ago' from date display */}
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Header size='small' style={{paddingTop: 20, fontSize: 15}}>{title}</Card.Header>
        <Card.Description>{body}</Card.Description>

        {/* show restricted options only on user's post card when user is logged in */}
        {(user && user.username === props.post.username) && (
          <PostCardMenu postId={props.post.id}/>
        )
        }
        
      </Card.Content>

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
                onClick={shakeComment? null : commentPost}
              />
            } 
          />

        </Button.Group>
      </Card.Content>
    </Card>
  );
}

export default PostCard;

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

          */