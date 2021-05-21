import React, { useContext } from 'react';
import { Card, Button, Image } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../gql/gql';
import { AuthContext } from '../context/auth';
import { useForm } from '../utilities/hooks';
function PostCard(props) {
  const { id, username, createdAt, body, likes, likeCount, commentCount } = props.post;
  const { user } = useContext(AuthContext); // use to determine if a user is logged in
  const [likePost, { loading, data }] = useMutation(LIKE_POST, {
    done(_, data) {
      
    },
    onError(err) {
      handleFormErrors(err);
    }
  });

  const { errors, handleFormErrors } = useForm();

  const handleLikeClick = (event) => {
    event.preventDefault();
    console.log('Clicked Like');
    if (!user) {
      return console.log('not logged in');
    }
    likePost({variables: { postId: props.post.id }});
  } 

  const commentPost = (event) => {
    console.log(event);

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
        <Card.Description>{body}</Card.Description>
        <br />
      </Card.Content>
      <Card.Content extra>
        <Button.Group fluid compact>
          <Button
            basic
            size='mini'
            color='teal'
            icon='thumbs up'
            label={{ basic: true, color: 'teal', pointing: 'left', content: likeCount }}
            onClick={handleLikeClick}
            loading={loading}
          />
          <Button
            size='mini'
            basic
            color='blue'
            icon='comment'
            label={{ as: 'a', basic: true, color: 'blue', pointing: 'left', content: commentCount }}
            onClick={commentPost}
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