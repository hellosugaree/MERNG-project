import React, { useContext } from 'react';
import { Card, Image } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { ModalContext } from '../context/modal';
import ModalSingleImage from './ModalSingleImage';
import PostCardMenu from '../components/PostCardMenu';


function CatchCard(props) {
  const { id, username, fishingType, species, catchDate, catchLocation, catchLength, images, notes} = props.catch;
 
  // use to determine if a user is logged in
  const { user } = useContext(AuthContext); 
  // style for highlighted card if props.highlighted is true
  const highlightedStyle = {border: '3px solid grey', boxShadow: '0 1px 4px -1px rgba(0, 0, 0, 0.3)'};

  const { showCustomModal } = useContext(ModalContext);

    return (
      <Card className='feed-card' onClick={props.onClick} fluid style={props.highlight ? { ...highlightedStyle, ...props.style } : {...props.style} } > 
        <Card.Content>
          <Image
            alt='profile'
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username} logged a catch</Card.Header>
          {/* can pass true to fromNow to remove 'ago' from date display */}
          <Card.Meta as={Link} to={`/catches/${id}`}>{DateTime.fromMillis(Date.parse(catchDate)).toRelative()}</Card.Meta>
          {fishingType && <Card.Meta>{fishingType}</Card.Meta>}
          {catchLocation && typeof catchLocation.lat === 'number' && typeof catchLocation.lng === 'number' && <Card.Meta>{`${catchLocation.lat.toFixed(4)}, ${catchLocation.lng.toFixed(4)}`}</Card.Meta>}
          <Card.Header style={{marginTop: 5, fontSize: 18}}>{species} {catchLength && <span style={{marginLeft: 8}}>{catchLength} in</span>}</Card.Header>
          {images && images.map(image => 
            <img 
              key={image.asset_id} 
              alt='catch'
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_150,h_100/${image.public_id}.jpg`} 
              onClick={() => showCustomModal(<ModalSingleImage src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_800,h_800/${image.public_id}.jpg`} alt='catch photo' />)}
              style={{borderRadius: 10, padding: 5}}
            /> 
          )}
          {notes && <Card.Description>{notes}</Card.Description>}
          {/* show restricted options only on user's post card when user is logged in */}
          {(!props.hideMenu && user && user.username === props.catch.username) && (
            <PostCardMenu postId={props.catch.id}/>
          )
          }
        </Card.Content>
      </Card>
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