import React, { useContext, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import FormError from './FormError';
import { REGISTER_USER } from '../gql/gql';
import { useForm } from '../utilities/hooks';
import { AuthContext } from '../context/auth';

function RegisterForm(props) {
  // gives us access to our AuthContext object which conainers user propery and login and logout functions
  const context = useContext(AuthContext);

  // useForm hook for handling form data, submission, errors
  const { values, errors, onSubmit, handleChange, handleFormErrors } = useForm(registerUserCallback, { username: '', email: '', password: '', confirmPassword: ''});


  // state to show if registration successful
  const [registerSuccess, setRegisterSuccess] = useState(false);


  // graphQL mutation to database
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) { 
      setRegisterSuccess(true);
      context.login(result.data.register);
      props.history.push('/');
    },
    onError(err) {
      console.log(err);
      handleFormErrors(err);
    }
  });
  
  // elevate registerUser so we can use it as a callback in useForm
  function registerUserCallback() {
    registerUser({variables: values});
  }


  return (
    <div style={{ ...props.style }}>
      <Form fluid error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}>
          <Form.Input 
            required 
            label='Username' 
            placeholder='username' 
            type="text"
            name='username'
            value={values.username}
            onChange={handleChange}
            error={errors.errorFields && errors.errorFields.username}
          />
          <Form.Input required label='Email address' placeholder='email address' 
            type="email"
            name='email'
            value={values.email}
            onChange={handleChange}
            error={errors.errorFields && errors.errorFields.email}            
          />

          <Form.Input required label='Password' placeholder='password' 
            type="password"
            name='password'
            value={values.password}
            onChange={handleChange}
            error={errors.errorFields && errors.errorFields.password}
          />
          <Form.Input required label='Confirm password' placeholder='confirm password' 
            type="password"
            name='confirmPassword'
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.errorFields && errors.errorFields.confirmPassword}
          />
        
        {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}

        {/* <Form.Checkbox style={{}} label='I agree to the Terms and Conditions' /> */}
        <Form.Button fluid color='teal' type="submit" style={{fontSize: 20, padding: 10}} >Submit</Form.Button>
        <div style={{display: registerSuccess ? '' : 'none', border: '1px solid lightgrey', padding: 10, fontSize: '16px', marginBottom: 20}}>
          Account successfully created
        </div>
      </Form>
    </div>
  );
}

export default RegisterForm;