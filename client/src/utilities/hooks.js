
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth';
// takes a callback which will be our query or mutation function for that form which will be defined in that component
export const useForm = (callback, initialValues) => { // initial values and object to specify default values for form fields
  // controlled form values
  const [ values, setValues ] = useState(initialValues);
  const [ errors, setErrors ] = useState({});
  // import logout so we can logout user and clear all user data from our context if we get back an invalid or missing token from server
  const { logout } = useContext(AuthContext); 
  const handleChange = event => {
    // update state when form values change
    setValues({...values, [event.target.name]: event.target.value});
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    callback();
  };

  // Error processing
  const handleFormErrors = (err) => {
    console.log(Object.keys(err));
    console.log(err.graphQLErrors[0].message)
    const errorMessages = [];
    // handle graphQLErrors
    if (err.graphQLErrors.length > 0) { 
      if (err.graphQLErrors[0].message === 'Authorization header missing') {
        // handle cases where user acesses and tries to use feature that requires login, but the token is missing so no header gets sent
        // redirect to login
        console.log('missing auth');
        logout();
        return window.location.replace('/login')
      }
      if (err.graphQLErrors[0].message === 'Invalid/Expired token') {
        // handle cases where user acesses and tries to use feature that requires login, but the token is missing so no header gets sent
        // redirect to login
        console.log('invalid token')
        logout();
        return window.location.replace('/login')
      }

      console.log(err.graphQLErrors[0].extensions.exception)
      const graphQLErrors = err.graphQLErrors[0].extensions.exception;
      for (const key in graphQLErrors) {
        if (key !== 'stacktrace') {
          console.log(graphQLErrors[key]);
          errorMessages.push(graphQLErrors[key]);
        }
      }
    }
    // handle network errors
    if (err.networkError){
      errorMessages.push(`Server error - ${err.message}`);
    }
    errorMessages.forEach(val => console.log(val));
    // set errors so form can update
    // in future need to add which input fields generated errors to highlight input fields
    setErrors({errorMessages, ...err})
  }              

  // return both functions and values (state) so we can use them in our components
  return {
    handleChange,
    onSubmit,
    handleFormErrors,
    values,
    errors    
  };

};

