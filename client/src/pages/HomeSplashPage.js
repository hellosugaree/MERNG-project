import React, { useState, useContext } from 'react';
import { ModalContext } from '../context/modal';
import { Button } from 'semantic-ui-react';
import LoginForm from '../components/LoginForm';
import ModalFeaturesDemo from '../components/ModalFeaturesDemo';
import '../App.css';


const HomeSplashPage = (props) => {

  const { showCustomModal, closeModal } = useContext(ModalContext);

  // const renderDefaultInfoWindow = () => {
  //   return (
  //     <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  //       <h1>Learn more</h1>
  //       <h2 style={{fontSize: 20}}>Click radar points to learn more</h2>
  //     </div>
  //   );
  // };


  // const renderInfoWindows = () => {
  //   switch (activeInfoWindow) {
  //     case 'default':
  //       return renderDefaultInfoWindow();
  //     default:
  //       return renderDefaultInfoWindow();  
  //   }
  // };




  return (
    <div className='home-page' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1 className='page-title' style={{padding: 20}}>Welcome to Fish Smart</h1>

      <div style={{display: 'flex', justifyContent: 'space-around', width: '80%'}}>
          {/* Feature info div */}
          <div style={{height: 300, width: 500, display: 'flex', flexDirection: 'column', backgroundColor: 'white', border: '1px solid lightgray', borderRadius: 5}}>
            <div style={{display: 'flex', justifyContent: 'center'}}><h1 style={{padding: '10px 0px'}}>Maximize your time on the water!</h1></div>

            {/* Feature links */}
            <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'space-evenly'}}>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={0} />)}><img src='/img/icons/small/Calico-Bass-Small.png' className='splash-page-link-icon' />Find nearby fish activity</div>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={1} />)}><img src='/img/icons/small/Yellowtail-Small.png' className='splash-page-link-icon' />Record and track catches</div>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={2} />)}><img src='/img/icons/small/Yellowfin-Small.png' className='splash-page-link-icon' />Never miss a perfect day</div>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={3} />)}><img src='/img/icons/small/Rockfish-Small.png' className='splash-page-link-icon' />Find places to fish</div>
            </div>
          </div>

          <div style={{width: 300, borderRadius: 5, backgroundColor: 'white', padding: '15px 20px 15px 20px', border: '1px solid lightgray', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <LoginForm style={{}} />
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button color='blue' style={{margin: 0}} onClick={() => props.history.push('/register')} >Register</Button>
            </div>
          </div>
      </div>

    </div>
  )
};

export default HomeSplashPage;

//          <h2>Please <a href='/login'>login</a> or <a href='/register'>register</a> to continue</h2>       
