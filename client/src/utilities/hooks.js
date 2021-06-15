
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import { ModalContext } from '../context/modal';
import Login from '../pages/Login';
import '../App.css';

// takes a callback which will be our query or mutation function for that form which will be defined in that component
export const useForm = (callback, initialValues) => { // initial values and object to specify default values for form fields
  // import logout so we can logout user and clear all user data from our context if we get back an invalid or missing token from server
  const { logout, user } = useContext(AuthContext); 
  
  const { showModal, showLoginModal, closeModal } = useContext(ModalContext);

  // controlled form values
  const [ values, setValues ] = useState(initialValues);
  const [ errors, setErrors ] = useState({});

  // handle change in controlled form values
  const handleChange = event => {
    // update state when form values change
    setValues({...values, [event.target.name]: event.target.value});
  };

  // handle change in date selection fields
  const handleDateChange = (date, name) => {
    setValues(prevValues => ({...prevValues, [name]: date}));
  };

  // handle form submit
  const onSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    // execute our form submit callback
    console.log(user);
    callback();
  };


  // Error processing
  // takes and option callback for a setter to show an error modal window
  const handleFormErrors = (err) => {
    console.log(Object.keys(err));
    // array to return messages as strings from our error object
    const errorMessages = [];
    // object to return names of inputs with errors so we can highlight wrong input fields on the form
    const errorFields = {};
    // handle graphQLErrors
    if (err.graphQLErrors.length > 0) { 
      if (err.graphQLErrors[0].message === 'Authorization header missing') {
        // handle cases where user acesses and tries to use feature that requires login, but the token is missing so no header gets sent
        // redirect to login
        // errorMessages.push('You must be logged in to that')
        // Show the login modal
        showLoginModal();
        // logout();
        // return window.location.replace('/login')
      }
      if (err.graphQLErrors[0].message === 'Invalid/Expired token') {
        // handle cases where user acesses and tries to use feature that requires login, but the token is missing so no header gets sent
        // redirect to login
        // errorMessages.push('You must be logged in to that')
        // Show the login modal
        showLoginModal()
        // logout();
        // return window.location.replace('/login')
      }
  
      const graphQLErrors = err.graphQLErrors[0].extensions.exception;
      for (const key in graphQLErrors) {
        if (key !== 'stacktrace') {
          errorFields[key] = true;
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
    if (errorMessages.length > 0){
      setErrors({errorMessages, errorFields, ...err})
    }
  }              

  // return both functions and values (state) so we can use them in our components
  return {
    showModal,  // use this for the show prop in the Modal component within a form
    handleChange,
    handleDateChange,
    onSubmit,
    handleFormErrors,
    values,
    errors,
    setValues,   // ideally this would never be used outside of here, but it's necessary for a controlled AutoSearchInput    
    setErrors    // for when we use a modal to log user in based on user not logged in error
  };

};

