import React from 'react';
import { useMutation, gql } from '@apollo/client'
import { Form } from 'semantic-ui-react';
import { CREATE_COMMENT } from '../gql/gql';
import { useForm } from '../utilities/hooks';
import FormError from '../components/FormError';


const CreateComment = (props) => {

const { handleChange, onSubmit, handleFormErrors, values, errors } = useForm(createCommentCallback, {body: ''});

const [createPost, { loading }] = useMutation(CREATE_COMMENT, {
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
    <div style={{margin: '0px 10px 10px 10px'}}>
      <Form style={{margin: 0}}
        error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}
      >
        <div style={{display: 'flex', alignItems: 'flex-end'}}>
         <div style={{flexGrow: 1}}>
            <Form.TextArea
              style={{margin: 0}}
              rows={1}
              placeholder='comment...' 
              type="text"
              name='body'
              value={values.body}
              onChange={handleChange}
              error={(errors.errorFields && errors.errorFields.body) ? true : false}            
            />
          </div>

          <div >
            <Form.Button style={{margin: 0, minHeight: 40}} icon={{name: 'send'}} color='blue' type="submit" />
          </div>
        </div>
              {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}

      </Form>

    </div>
    
    
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