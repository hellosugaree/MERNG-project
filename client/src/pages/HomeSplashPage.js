import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import '../App.css';


const HomeSplashPage = (props) => {

  return (
    <div className='register-page'>
        <Grid style={{marginTop: 0}}>
          <Grid.Column>
          <h1 className='page-title'>Welcome to Fish Smart</h1>
          <h2>Please <a href='/login'>login</a> or <a href='/register'>register</a> to continue</h2>
          </Grid.Column>
        </Grid>
    </div>
  )
};

export default HomeSplashPage;