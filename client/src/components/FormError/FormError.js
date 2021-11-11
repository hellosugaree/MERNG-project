import React from 'react'
import { Message } from 'semantic-ui-react';

const FormError = (props) => {
  const list = props.errors.map((error, index) => (<Message.Item key={index}>{error}</Message.Item>));
  
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

export default FormError;