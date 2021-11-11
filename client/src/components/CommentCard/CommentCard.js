import { Comment } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth'
import CommentCardMenu from '../CommentCardMenu';

const CommentCard = (props) => {
  console.log(props);
  console.log(props.profilePhoto);
  const { user: loggedInUser } = useContext(AuthContext);
  return (
    <Comment>
      <Comment.Avatar src={props.profilePhoto.secure_url} />
      <Comment.Content>
        {
          // if we have a user logged in, and the user matches the comment creator's user, show a menu for comment options
          (loggedInUser && loggedInUser.username === props.username) && <CommentCardMenu commentId={props.commentId} postId={props.postId} />
        }
        <Comment.Author as='a'>{props.username}</Comment.Author>
        <Comment.Metadata>
          <div>{DateTime.fromMillis(Date.parse(props.createdAt)).toRelative()}</div>
        </Comment.Metadata>
        <Comment.Text>{props.body}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default CommentCard;