import React, { useState } from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import PostFeed from '../components/PostFeed';
import CatchFeed from '../components/CatchFeed';
import WeatherFeed from '../components/WeatherFeed';
import BeachAccessLocations from '../components/BeachAccessLocations';
import '../App.css';


const DoubleFeed = props => {

  const { feedCatchesData, feedCatchesError, feedCatchesLoading, user, postsLoading, postsError, postsData } = props;
  const [displayOptions, setDisplayOptions] = useState({ showCreateCatch: false });
  // control for dropdown to select content on the left and right main panel, uses index of the options array
  const [leftMainContentPanelDropdownIndex, setLeftMainContentPanelDropdownIndex] = useState(0);
  const [rightMainContentPanelDropdownIndex, setRightMainContentPanelDropdownIndex] = useState(1);




  const leftMainContentPanelDropdownOptions = [
    {
      key: 'posts',
      value: 0,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center'}}>
        <div style={{height: 30, width: 50, backgroundColor: '#6795CE', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/post-icon-blue-small.jpg' alt='Posts feed icon' style={{maxHeight: '95%', margin: '0px auto 0px auto'}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Post feed</div>
        </div>
      )
    },

    {
      key: 'catches',
      value: 1,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center'}}>
        <div style={{height: 30, width: 50, backgroundColor: '#71B1AD', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/halibut-teal-background-tiny.jpg' alt='Catches feed icon' style={{maxHeight: '95%', margin: '0px auto 0px auto'}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Catch feed</div>
        </div>
      )
    },

    {
      key: 'weather',
      value: 2,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center'}}>
        <div style={{height: 30, width: 50, backgroundColor: '#2E69C2', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/weather-icon.png' alt='Weather feed icon' style={{ width: 50, margin: '0px auto 0px auto', borderRadius: 5}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Weather feed</div>
        </div>
      )
    },

    {
      key: 'beach access',
      value: 3,
      content: (
        <div style={{margin: '-8px 0px', display: 'flex', alignItems: 'center', width: 200 }}>
        <div style={{height: 30, width: 50, backgroundColor: '#2E69C2', borderRadius: 5, display:'flex'}}>
          <img src='/img/icons/beach-icon-small.jpg' alt='Beach access page icon' style={{ width: 50, margin: '0px auto 0px auto', borderRadius: 5}} />
        </div>
        <div style={{marginLeft: 10, fontSize: 18, fontWeight: 600}}>Beach Access Locations</div>
        </div>
      )
    }
  ];

  // handlers for the feed selection dropdowns on main content panels
  const handleLeftMainContentPanelDropdownChange = (event, { value }) => {
    setLeftMainContentPanelDropdownIndex(value);
  }
  const handleRightMainContentPanelDropdownChange = (event, { value }) => {
    setRightMainContentPanelDropdownIndex(value);
  }
  return (
    <div className='main-content-flex-container' style={{display: 'flex', overflowY: 'scroll', flexGrow: 1}}>

      <div className='left-main-content-flex-container' style={{display: 'flex',  flexDirection: 'column', flexGrow: 1}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
          <div style={{display: 'flex', flexGrow: 1, maxWidth: 400}}>
            <Dropdown
              fluid
              selection
              selectOnNavigation={false}
              options={leftMainContentPanelDropdownOptions}
              onChange={handleLeftMainContentPanelDropdownChange}
              value={leftMainContentPanelDropdownIndex}
              trigger={leftMainContentPanelDropdownOptions[leftMainContentPanelDropdownIndex].content}
              />
          </div>
        </div>
        <div style={{}}>
          {/* RENDER POST FEED IF SELECTED ON DROPDOWN */}
          {leftMainContentPanelDropdownIndex === 0 && (
            <PostFeed user={user} loading={postsLoading} error={postsError} data={postsData} />
          )}
          {/* RENDER CATCH FEED IF SELECTED ON DROPDOWN */}
          {leftMainContentPanelDropdownIndex === 1 && (
            <CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions}/>
          )}
          {leftMainContentPanelDropdownIndex === 2 && (
            <WeatherFeed />
          )}
          {leftMainContentPanelDropdownIndex === 3 && (
            <BeachAccessLocations />
          )}
        </div>
      </div>

      {/* SECOND MAIN CONTENT COLUMN -- CATCHES */}
      <div className='right-main-content-flex-container' style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
        <Grid.Row>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
          <div style={{display: 'flex', flexGrow: 1, maxWidth: 400}}>
            <Dropdown
              fluid
              selection
              selectOnNavigation={false}
              options={leftMainContentPanelDropdownOptions}
              onChange={handleRightMainContentPanelDropdownChange}
              value={rightMainContentPanelDropdownIndex}
              trigger={leftMainContentPanelDropdownOptions[rightMainContentPanelDropdownIndex].content}
            />
          </div>
        </div>
          </Grid.Row>
          {/* RENDER POST FEED IF SELECTED ON DROPDOWN */}
        {rightMainContentPanelDropdownIndex === 0 && (
          <PostFeed user={user} loading={postsLoading} error={postsError} data={postsData} />
        )}
        {/* RENDER CATCH FEED IF SELECTED ON DROPDOWN */}
        {rightMainContentPanelDropdownIndex === 1 && (
          <CatchFeed user={user} feedCatchesLoading={feedCatchesLoading} feedCatchesError={feedCatchesError} feedCatchesData={feedCatchesData} displayOptions={displayOptions}/>
        )}
        {rightMainContentPanelDropdownIndex === 2 && (
          <WeatherFeed />
        )}      
        {rightMainContentPanelDropdownIndex === 3 && (
          <BeachAccessLocations />
        )}    
      </div>
    </div>
  );


};


export default DoubleFeed;
