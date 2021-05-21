import React, { useContext } from 'react';
import { Form, Card } from 'semantic-ui-react';
import { useForm } from '../utilities/hooks';
import { useMutation, gql } from '@apollo/client';
import { CREATE_POST } from '../gql/gql';
import { AuthContext } from '../context/auth';
import FormError from '../components/FormError';

function CreatePost (props) {
  const { user } = useContext(AuthContext);
  // errors get processed by handleFormErrors
  const { handleChange,
          onSubmit,
          handleFormErrors,
          values,
          errors    
        } = useForm(createPostCallback, { title: '', body: '' });
  
  const [createPost, { loading, data }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost }}) {
      // update the cache when new post created so main page will render the post
      // see https://www.apollographql.com/docs/react/data/mutations/
      cache.modify({
        fields: {
          getPosts (existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql `
                fragment NewPostRef on Post {
                  id body createdAt username likeCount
                  likes {
                    username
                  }
                  commentCount
                  comments {
                    id username createdAt body
                  }
                }
              `
            });
            return [... existingPosts, newPostRef];
          }
        }
      })      
    },
    onError(err) {
      handleFormErrors(err);
    }
  });

  // elevate our createPost function so it can be called from useForm
  function createPostCallback() {
    createPost({variables: values});
  };

  return (
    <div style={{margin: '20px auto 10px auto', maxWidth: 400}}>
    <Card fluid  >
      <Card.Header style={{fontSize: 20, fontWeight: 'bold', padding: '10px 0px 0px 0px'}} textAlign='center' > 
        {user.username ? user.username : 'You must login to post'} 
      </Card.Header>
      <Card.Header content='Create a post' style={{fontSize: 20, fontWeight: 'bold', padding: '5px 0px 10px 0px'}} textAlign='center' /> 
    

      <Form fluid style={{width: 350, margin: '5px auto 20px auto', padding: '0px 10px 0px 10px'}} 
      error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}
      >
        <Form.Group fluid style={{paddingBottom: 10}}>
          <Form.Input
            width={16}  
            placeholder='post title' 
            type="text"
            name='title'
            value={values.title}
            onChange={handleChange}
            error={errors.title ? true : false}            
          />
        </Form.Group>
        <Form.Group >
          <Form.TextArea
            width={16}
            placeholder='post body'
            type='body'
            name='body'
            value={values.body}
            onChange={handleChange}
            error={errors.body ? true : false}
          />
        </Form.Group> 
        {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}
        <Form.Group style={{margin: '0px auto 0px auto'}}>
          <Form.Button color='blue' type="submit">Submit</Form.Button>
        </Form.Group> 

      </Form>
    </Card>
    </div>
  )
};


export default CreatePost;



// const ADD_TODO = gql`
//   mutation AddTodo($type: String!) {
//     addTodo(type: $type) {
//       id
//       type
//     }
//   }
// `;