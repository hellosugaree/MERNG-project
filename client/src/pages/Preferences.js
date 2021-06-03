import React from 'react';
import { Grid } from 'semantic-ui-react';





function Preferences() {
  return (
    <div className='preferences-page'>
      <Grid columns={1} style={{marginTop: 0}}>
        <Grid.Column>
         <h1 className='page-title'>Preferences</h1>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Preferences;