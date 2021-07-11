import React, { useContext, useState } from 'react';
import { ModalContext } from '../context/modal';
import { Button } from 'semantic-ui-react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ModalFeaturesDemo from '../components/ModalFeaturesDemo';
import '../App.css';


const HomeSplashPage = (props) => {

  const { showCustomModal } = useContext(ModalContext);
  // state to toggle login and register form, default (true) shows login form and register button, false shows register form and login button
  const [showLogin, setShowLogin] = useState(true);

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

//          <h2>Please <a href='/login'>login</a> or <a href='/register'>register</a> to continue</h2>       
