import React, { useContext, useState } from 'react';
import { ModalContext } from '../../context/modal';
import { Button } from 'semantic-ui-react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';
import ModalFeaturesDemo from '../../components/ModalFeaturesDemo';
import '../../App.css';

const HomeSplashPage = (props) => {

  const { showCustomModal } = useContext(ModalContext);
  // state to toggle login and register form, default (true) shows login form and register button, false shows register form and login button
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className='home-page' style={{flexDirection: 'column', alignItems: 'center'}}>
      <h1 className='page-title' style={{padding: 20}}>Welcome to Fish Smart</h1>

      <div className='stack-reverse-mobile' style={{display: 'flex', justifyContent: 'space-around', width: '80%'}}>
          {/* Feature info div */}
          <div className='splash-page-features-container white-card' >
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <h1 style={{padding: 10}}>Maximize your time on the water!</h1>
            </div>
            {/* Feature links */}
            <div className='splash-page-link-container'>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={0} />)}><img src='/img/icons/small/Calico-Bass-Small.png' alt='calico bass' className='splash-page-link-icon' />Find nearby fish activity</div>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={1} />)}><img src='/img/icons/small/Yellowtail-Small.png' alt='yellotail' className='splash-page-link-icon' />Record and track catches</div>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={2} />)}><img src='/img/icons/small/Yellowfin-Small.png' alt='yellowfin tuna' className='splash-page-link-icon' />Never miss a perfect day</div>
              <div className='splash-page-link' onClick={() => showCustomModal(<ModalFeaturesDemo index={3} />)}><img src='/img/icons/small/Rockfish-Small.png' alt='rockfish' className='splash-page-link-icon' />Find places to fish</div>
            </div>
          </div>
          {/* Login / Register form container */}
          <div className='splash-page-login-container white-card'>
            {showLogin 
              ? <LoginForm style={{}} />
              : <RegisterForm />
            }
            <div style={{display: 'flex', justifyContent: 'center'}}>
              {showLogin
                ? <Button color='blue' style={{margin: 0}} onClick={() => setShowLogin(false)} >Register</Button>
                : <Button color='blue' style={{margin: 0}} onClick={() => setShowLogin(true)} >Login</Button>
              }
            </div>
          </div>
      </div>
    </div>
  )
};

export default HomeSplashPage;