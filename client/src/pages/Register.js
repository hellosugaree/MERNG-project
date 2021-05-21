import React, { useContext } from 'react';
import { Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import FormError from '../components/FormError';
import { REGISTER_USER } from '../gql/gql';
import { useForm } from '../utilities/hooks';
import { AuthContext } from '../context/auth';

function Register(props) {
  // gives us access to our AuthContext object which conainers user propery and login and logout functions
  const context = useContext(AuthContext);

  // useForm hook for handling form data, submission, errors
  const { values, errors, onSubmit, handleChange, handleFormErrors } = useForm(registerUserCallback, { username: '', email: '', password: '', confirmPassword: ''});

  // graphQL mutation to database
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result) { // called if mutation successful, result is your data back from database
      // use login function in AuthContext and feed it our graphQL response containing user data to add this to context
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
    <div >
      <h1 className="page-title">Register</h1>
      {/* classname loading gives a spinner in semantic-ui */}
      <Form error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <Form.Group style={{paddingBottom: 20}}>
          <Form.Input 
            required 
            label='Username' 
            placeholder='username' 
            type="text"
            name='username'
            value={values.username}
            onChange={handleChange}
            error={errors.username ? true : false}
          />
          <Form.Input required label='Email address' placeholder='email address' 
            type="email"
            name='email'
            value={values.email}
            onChange={handleChange}
            error={errors.email ? true : false}            
          />
        </Form.Group>
        <Form.Group style={{paddingBottom: 20}}>
          <Form.Input required label='Password' placeholder='password' 
            type="password"
            name='password'
            value={values.password}
            onChange={handleChange}
            error={errors.password ? true : false}
          />
          <Form.Input required label='Confirm password' placeholder='confirm password' 
            type="password"
            name='confirmPassword'
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword ? true : false}
          />
        </Form.Group>
        
        {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}

        <Form.Checkbox style={{padding: 20}} label='I agree to the Terms and Conditions' />
        <Form.Button type="submit">Submit</Form.Button>
      </Form>

    </div>
  );
}

export default Register;