import { Comment } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { AuthContext } from '../context/auth'
import CommentCardMenu from './CommentCardMenu';
// Uses luxon (DateTime) instead of moment per recommendation of moment docs
// Our dates are stored as javascript Date.toISOString
// We need to parse them into ms then convert into a DateTime object, then use DateTime's toRelative() method to convert that into human readable time from now

const CommentCard = (props) => {
  const { user: loggedInUser } = useContext(AuthContext);
  return (
    <Comment>
      <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
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


/*

      <Comment.Actions>
        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>

*/