import React from 'react';
import { useMutation } from '@apollo/client';
import { Dropdown } from 'semantic-ui-react';
import { DELETE_POST, FETCH_POSTS_QUERY } from '../../gql/gql';

const PostCardMenu = (props) => {
  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost }} ){
      const { getPosts: cachedPostData } = cache.readQuery({
        query: FETCH_POSTS_QUERY
      });
      console.log(deletePost)
      const updatedPosts = cachedPostData.filter(val => val.id !== deletePost.id );
      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [...updatedPosts]
        }
      })
    },
    onError(err) {
      console.log('error');
      console.log(err)
    }
  });

  const handleDeleteClick = (event) => {
    event.preventDefault();
    deletePost({variables: { postId: props.postId }});
  };

  const dropdownItems = [
    { key: 'edit', icon:  {name: 'edit', color: 'grey'}, text: 'edit', value: 'edit', selected: false},
    { key: 'delete', onClick: handleDeleteClick, icon: {name: 'trash', color: 'grey'}, text: 'delete', value: 'delete', selected: false}
  ];
  
  return (
    <Dropdown
      loading={ loading }
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

export default PostCardMenu;