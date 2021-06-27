import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { ModalContext } from '../context/modal';
import '../App.css';


const ModalFeaturesDemo = props => {
  const { closeModal } = useContext(ModalContext);
  const startIndex = props.index;
  /*
  active window indices: 
  0: track catches

  */
  const [activeInfoWindow, setActiveInfoWindow] = useState(startIndex);

  const renderTopInfo = () => {
    switch (activeInfoWindow) {
      case 0:
        return 'See fish activity near you'
      case 1:
        return 'Log and keep track of your catches'
  
    }
  };


  const renderMainImage = () => {
    switch (activeInfoWindow) {
      case 0:
        return (
          <img style={{height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: '100%'}} src='/img/nearby-catches-cropped-4.png'/>
        );
      case 1:
        return (
          <img style={{height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: '100%'}} src='/img/log-catch-large-cropped.png'/>
        );        
    }
  };

  const renderRadarSpots = () => {
    switch (activeInfoWindow) {
      case 0:
        return (
          <div style={{display: 'flex', alignItems: 'center', position: 'absolute', top: 50, left: 50, zIndex: 2}}>
            <svg height='15' width='15'><circle cx='50%' cy='50%' r='50%' fill='#FF0000' /></svg>
            <span style={{paddingLeft: 5, fontWeight: 'bold', color: 'red'}}>See local activity</span>
          </div>
        );
      case 1:
        return (
          <div style={{display: 'flex', alignItems: 'center', position: 'absolute', bottom: 80, right: 50, zIndex: 2}}>
            <span style={{paddingRight: 5, fontWeight: 'bold', color: 'blue'}}>Log your catches</span>
            <svg height='15' width='15'><circle cx='50%' cy='50%' r='50%' fill='#0000FF' /></svg>
          </div>
        );
    }

  };

  const handlePageChange = direction => {
    if (direction === 'forward') {
      if (activeInfoWindow < 3) {
        setActiveInfoWindow(prevValue => prevValue + 1);
      } else {
        setActiveInfoWindow(0);
      }
    }
    if (direction === 'back') {
      if (activeInfoWindow > 0) {
        setActiveInfoWindow(prevValue => prevValue - 1);
      } else {
        setActiveInfoWindow(4);
      }
    }

  };

  return (
    /* OUTER CONTAINER */
    <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {/* INNER MODAL WINDOW CONTAINER */}
        <div style={{width: 500, flexGrow: 1, maxWidth: '80%', backgroundColor: '#FDFCFA', border: '1px solid lightgray', borderRadius: 5, display: 'flex', flexDirection: 'column'}}>
          {/* INNER MODAL TOP ROW*/}
          <div style={{width: '100%', display: 'flex', color: '#555', justifyContent: 'center', padding: 5}}>
            <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
              <h1>{renderTopInfo()}</h1>
            </div>
            <div className='close-modal' onClick={closeModal} style={{padding: '0px 10px', display: 'flex', alignItems: 'center', fontSize: '25px'}}>&#10006;</div>

          </div>
          {/* MAIN CONTENT ROW WITH RADAR AND MAP*/}
          <div style={{display: 'flex'}}>

          {/* RADAR COLUMN */}
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

            <div style={{display: 'flex'}}>
              <div style={{margin: 'auto 0px',  padding: 5}}>
                <FontAwesomeIcon onClick={() => handlePageChange('back')} className='change-page' icon={faChevronCircleLeft} style={{ height: 40, width: 40 }}  />
              </div>
              {/* RADAR DIV */}

            </div>

          </div>  
          {/* MAP IMAGE COLUMN */}
          <div style={{flexGrow:1, maxWidth: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 10}}>
            <div style={{height: 'auto', width: 300, position: 'relative', backgroundColor: 'white'}}>
              <img src='/img/radar.svg' style={{height: '100%', width: '100%', zIndex: 1}} />
              {renderRadarSpots()}
            </div>
            <div style={{width: 100, flexGrow: 1}}>
              {renderMainImage()}
            </div>
          </div>
          <div style={{margin: 'auto 0px', padding: 5}}>
                <FontAwesomeIcon onClick={() => handlePageChange('forward')} className='change-page' icon={faChevronCircleRight} style={{ height: 40, width: 40 }} />
          </div> 

          </div>

          <div style={{width: '100%', height: 50}}>
    
          </div>
          
      </div>




    </div>
  );
};



export default ModalFeaturesDemo;