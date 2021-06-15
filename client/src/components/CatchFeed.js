import React from 'react';
import { Grid, Dropdown, Transition } from 'semantic-ui-react';
import CatchCard from './CatchCard';
import CreateCatchForm from './CreateCatchForm';

const CatchFeed = (props) => {

  const catchSortOptions = [
    {
      key: 'Catch date ascending',
      text: 'Catch date ascending',
      value: 'Catch date ascending',
      icon: 'calendar plus outline',
    },

    {
      key: 'Catch date descending',
      text: 'Catch date descending',
      value: 'Catch date descending',
      icon: 'calendar minus outline'
    }
  ];

  return (
    <div>

      {(props.user && !props.feedCatchesLoading && !props.feedCatchesError && props.displayOptions.showCreateCatch) &&
        <Grid.Row>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <CreateCatchForm />
          </div>

        </Grid.Row>               
      }
      
      { props.feedCatchesLoading && (
                <Grid.Row>
                  <h1 className='page-title'>Loading catches...</h1>
                </Grid.Row>   
              )}

      {props.feedCatchesData && (
        <div>
          <Grid.Row>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Dropdown
                inline
                options={catchSortOptions}
                defaultValue={catchSortOptions[0].value}
              />
            </div>
          </Grid.Row>
          <Transition.Group animation='fly right' duration={600}>
            {props.feedCatchesData.getCatches.map(catchData => (
              <Grid.Row style={{padding: '10px 0px 0px 0px'}} key={catchData.id}>
                <CatchCard catch={catchData} />
              </Grid.Row>
            ))}
          </Transition.Group>
        </div>
      )
      }

    </div>
  )
}

export default CatchFeed;