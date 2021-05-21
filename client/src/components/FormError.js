//import { PromiseProvider } from 'mongoose';
import React from 'react'
import { Message } from 'semantic-ui-react';

const FormError = (props) => {
  // props.errors takes an array of strings with error messages to display from form validation
  let list = props.errors.map((error, index) => (<Message.Item key={index}>{error}</Message.Item>));
  
  return (
      <Message
        error
        size='small'
      >
        <Message.List>
          {list}
        </Message.List>       
      </Message>
  );

};

// note: if you want a title to error message, use header=

export default FormError;