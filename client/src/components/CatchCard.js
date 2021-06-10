import React, { useContext } from 'react';
import { Card, Image } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import PostCardMenu from '../components/PostCardMenu';


function CatchCard(props) {
  const { id, username, fishingType, species, catchDate, catchLocation, catchLength, notes} = props.catch;
 
  // use to determine if a user is logged in
  const { user } = useContext(AuthContext); 

    return (
    <div style={{ maxWidth: 400, margin: '10px auto 10px auto'}}>
      <Card fluid  > {/* fluid lets the cards stretch to fill */}
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username} logged a catch</Card.Header>
          
          {/* can pass true to fromNow to remove 'ago' from date display */}
          <Card.Meta as={Link} to={`/catches/${id}`}>{DateTime.fromMillis(Date.parse(catchDate)).toRelative()}</Card.Meta>
          {fishingType && <Card.Meta>{fishingType}</Card.Meta>}
          {catchLocation && <Card.Meta>{catchLocation}</Card.Meta>}
          <Card.Header style={{marginTop: 5, fontSize: 18}}>{species} {catchLength && <span style={{marginLeft: 8}}>{catchLength} in</span>}</Card.Header>

          {notes && <Card.Description>{notes}</Card.Description>}


          {/* show restricted options only on user's post card when user is logged in */}
          {(user && user.username === props.catch.username) && (
            <PostCardMenu postId={props.catch.id}/>
          )
          }
          
        </Card.Content>
      </Card>
    </div>
  );
}

export default CatchCard;

/* <Comment.Action  style={{display: 'block'}} onClick={showLessComments} >show less comments...</Comment.Action> */


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