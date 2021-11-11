import React from 'react';
import {  Grid } from 'semantic-ui-react';
import LoginForm from '../../components/LoginForm';

function Login(props) {
  return (
    <div >
    <Grid centered style={{margin: 0}}>
      
      <Grid.Row>
        <h1 className='page-title'>Login</h1>
      </Grid.Row>

      <Grid.Row>
        <LoginForm />
      </Grid.Row>
    </Grid>
    </div>
  );
}

export default Login;