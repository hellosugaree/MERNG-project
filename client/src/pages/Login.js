import React, { useContext } from 'react';
import FormError from '../components/FormError';
import { Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useForm } from '../utilities/hooks';
import { LOGIN_USER } from '../gql/gql';
import { AuthContext } from '../context/auth'; // allows us to access context to keep track of state across entire app

function Login(props) {
  // gives us access to our AuthContext object which conainers user propery and login and logout functions
  const context = useContext(AuthContext);

  // feed it the login callback which will be executed in onSubmit, and default values for the values in state
  // gets all of our event handlers and state management from useform
  const { handleChange, onSubmit, handleFormErrors, values, errors } = useForm(loginUserCallback, {username: '', password: ''});

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(_, result){ // called when executed successfully
      // call context.login with the user data returned from graphQL mutation to add it to state
      context.login(result.data.login);
      console.log(result.data.login);
      props.history.push('/');
    },
    onError(err) {
      handleFormErrors(err);
    }
  });

  // elevate our login function so we can use it in useForm 
  function loginUserCallback() {
    login({variables: values});
  }


  return (
    <div>
      <h1 className='page-title'>Login</h1>
      
      <Form error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <Form.Group style={{paddingBottom: 20}}>
          <Form.Input 
            required 
            label='Username' 
            placeholder='Username' 
            type="text"
            name='username'
            value={values.username}
            onChange={handleChange}
          />
          <Form.Input required label='Password' placeholder='Password' 
            type="password"
            name='password'
            value={values.password}
            onChange={handleChange}
          />
        </Form.Group>

        {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}

        <Form.Button type="submit">Submit</Form.Button>
        </Form>
 
    </div>
  );
}

export default Login;