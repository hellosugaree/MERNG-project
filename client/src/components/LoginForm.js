import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from '../utilities/hooks';
import { LOGIN_USER } from '../gql/gql';
import { AuthContext } from '../context/auth';
import { ModalContext } from '../context/modal';
import { Form } from 'semantic-ui-react';
import FormError from './FormError';


const LoginForm = props => {
  // gives us access to our AuthContext object which conainers user propery and login and logout functions
  const context = useContext(AuthContext);
  const { closeModal } = useContext(ModalContext);
  // feed it the login callback which will be executed in onSubmit, and default values for the values in state
  // gets all of our event handlers and state management from useform
  const { setValues, handleChange, onSubmit, handleFormErrors, values, errors } = useForm(loginUserCallback, {username: '', password: ''});

  // state to show if login successful
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(_, result){ // called when executed successfully
      // call context.login with the user data returned from graphQL mutation to add it to state
      context.login(result.data.login);
      setLoginSuccess(true);
      setValues({username: '', password: ''});
      // close modal in case we are logging in from a modal
      setTimeout(() => closeModal(), 2000);

      // allow no redirect from props in case we render a login in a modal don't kick them off the page
      if (props.noRedirect) {
        return null;
      }
      // redirect if noRedirect prop not specified
      window.location.pathname='/';
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
    <div  style={{...props.style}}>
      <Form error={ errors ? true : false } onSubmit={onSubmit} className={loading ? 'loading' : ''}>
          <Form.Input 
            required 
            label='Username' 
            placeholder='Username' 
            type="text"
            name='username'
            autoComplete='username'
            value={values.username}
            onChange={handleChange}
            error={errors.errorFields && errors.errorFields.username}
          />
          <Form.Input required label='Password' placeholder='Password' 
            type="password"
            name='password'
            autoComplete='current-password'
            value={values.password}
            onChange={handleChange}
            error={errors.errorFields && errors.errorFields.password}
          />

        {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}
          <Form.Button fluid color='teal' type="submit" style={{fontSize: 20, padding: 10}}>Log in</Form.Button>
          <div style={{display: loginSuccess ? '' : 'none', border: '1px solid lightgrey', padding: 10, fontSize: '16px'}}>
            You have successfully logged in
          </div>
      </Form>
    </div>
  );


};


export default LoginForm