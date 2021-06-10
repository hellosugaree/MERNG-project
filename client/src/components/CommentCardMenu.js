import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Dropdown } from 'semantic-ui-react';
import { DELETE_COMMENT } from '../gql/gql';

const CommentCardMenu = (props) => {

    // delete a post
    const [deleteComment, { loading }] = useMutation(DELETE_COMMENT, {
      update(cache, { data: { deleteComment: deletedComment }}){
        // get the comments from this post
        const { comments: postComments, commentCount } = cache.readFragment({
          id: `Post:${props.postId}`,
          fragment: gql `
            fragment DeleteCommentFragment on Post {
              comments {
                id
                username
                createdAt
                body
              }
              commentCount
            }
          `
        });
        // find the index of the comment we need to delete from the postComments array
        const commentIndexToDelete = postComments.findIndex(comment => comment.id === deletedComment.id);
        // make a shallow copy of the cached comments
        const copiedComments = postComments.slice(0);
        // delete the comment from cached post comments fragment
        copiedComments.splice(commentIndexToDelete, 1);
        // update the comment count
        const newCommentCount = commentCount - 1;
        // write the updated comments back to the cached post
        cache.writeFragment({
          id: `Post:${props.postId}`,
          fragment: gql `
            fragment DeleteCommentFragment on Post {
              comments {
                id
                username
                createdAt
                body
              }
              commentCount
            }
          `,
          data: {
            comments: [...copiedComments],
            commentCount: newCommentCount
          }
        });
      },
      onError(err) {
      }
    });

  
    // delete click handler
    // postId is passed to this component as a prop from PostCard
    const handleDeleteClick = (event) => {
      console.log(props.postId, props.commentId)
      event.preventDefault();
      deleteComment({variables: { postId: props.postId, commentId: props.commentId }});
      
    }

  // array of menu items for our dropdown menu  
  const dropdownItems = [
    { key: 'edit', icon:  {name: 'edit', color: 'grey'}, text: 'edit', value: 'edit', selected: false},
    { key: 'delete', onClick: handleDeleteClick, icon: {name: 'trash', color: 'grey'}, text: 'delete', value: 'delete', selected: false}
  ];
  
  return (
      <Dropdown
        loading={loading}
        size='tiny'
        upward
        style={{float: 'right'}}
        compact
        className='icon'
        icon={{name: 'ellipsis vertical', color: 'grey'}}
      >
        <Dropdown.Menu direction='left'>
        {dropdownItems.map(item => (<Dropdown.Item key={item.key} {...item} />))}
        </Dropdown.Menu>
      </Dropdown>
  );
};


export default CommentCardMenu;
