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

function CatchCard(props) {
  const { id, username, species, catchDate, catchLocation, catchLength, notes} = props.catch;
 
  // use to determine if a user is logged in
  const { user } = useContext(AuthContext); 

  // handle form errors for mutations
  const { errors, handleFormErrors } = useForm();


    return (
    <Card fluid style={{ maxWidth: 350, margin: '10px auto 10px auto'}} > {/* fluid lets the cards stretch to fill */}
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username} logged a catch</Card.Header>
        
        {/* can pass true to fromNow to remove 'ago' from date display */}
        <Card.Meta as={Link} to={`/catches/${id}`}>{DateTime.fromMillis(Date.parse(catchDate)).toRelative()}</Card.Meta>
        {catchLocation && <Card.Meta>{catchLocation}</Card.Meta>}
        <Card.Header style={{marginTop: 5, fontSize: 18}}>{species} {catchLength && <span style={{marginLeft: 8}}>{catchLength} in</span>}</Card.Header>

        {notes && <Card.Description>{notes}</Card.Description>}


        {/* show restricted options only on user's post card when user is logged in */}
        {(user && user.username === props.catch.username) && (
          <PostCardMenu postId={props.catch.id}/>
        )
        }
        
      </Card.Content>
{/* 
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
      )} */}
{/*         
        {
          // create a CreateComment component and pass it the id of the post to be used in the mutation 
          showCreateComment.isMounted && (
            <div style={{display: showCreateComment.show ? null : 'none'}}>
             <CreateComment postId={id}/>
            </div>
          )
        } */}
{/* 
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

 */}
    </Card>

  



  );
}

export default CatchCard;

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