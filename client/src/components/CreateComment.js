import React from 'react';
import { useMutation, gql } from '@apollo/client'
import { Form } from 'semantic-ui-react';
import { CREATE_COMMENT, FETCH_POSTS_QUERY } from '../gql/gql';
import { useForm } from '../utilities/hooks';
import FormError from '../components/FormError';


const CreateComment = (props) => {

const { handleChange, onSubmit, handleFormErrors, values, errors } = useForm(createCommentCallback, {body: ''});

const [createPost, { loading }] = useMutation(CREATE_COMMENT, {
  // destructure createComment from data.createComment and assign to commentCreated
  update(cache, { data: { createComment : commentCreated }}) {
    // get just the comments from this specific post from the cache as a fragment so we can add the new comment
    const { comments: cachedComments, commentCount } = cache.readFragment({
      id: `Post:${props.postId}`,
      fragment: gql `
        fragment AddCommentFragment on Post {
          comments {
            id,
            body,
            username,
            createdAt
          }
          commentCount
        }
      `
    });
    // increase the comment count
    const newCommentCount = commentCount + 1;
    // write the single Post fragment back to the cache with the new comment included
    cache.writeFragment({
      id: `Post:${props.postId}`,
      fragment: gql `
        fragment AddCommentFragment on Post {
          comments {
            id,
            body,
            username,
            createdAt
          }
          commentCount
        }
      `,
      data: {
        comments: [commentCreated, ...cachedComments],
        commentCount: newCommentCount
      } 
    });
    
    // reset our input to empty
    values.body='';
  },
  onError(err){
    handleFormErrors(err);
  }
});

function createCommentCallback() {
  createPost({ variables: { ...values, postId: props.postId } })
}


  return (
    <Form style={{margin: '5px auto 0 auto', padding: '0px 10px 0px 10px'}} 
    error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}
    >
      <Form.Group inline>
      <Form.TextArea
          style={{display: 'inline-block', float: 'left'}}
          width={16}
          rows={1}
          placeholder='comment...' 
          type="text"
          name='body'
          value={values.body}
          onChange={handleChange}
          error={(errors.errorFields && errors.errorFields.body) ? true : false}            
        />
         <Form.Button style={{display: 'inline-block', float: 'right'}} icon={{name: 'send'}} fluid color='blue' type="submit" />
      </Form.Group>
      
      {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}
    </Form>
  );
};


export default CreateComment;


/*

        <Form.Input
          width={16}  
          placeholder='comment...' 
          type="text"
          name='body'
          value={values.body}
          onChange={handleChange}
          error={(errors.errorFields && errors.errorFields.body) ? true : false}            
        />

*/