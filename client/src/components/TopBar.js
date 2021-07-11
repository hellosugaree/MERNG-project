import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useDropdown } from '../utilities/hooks';
import { Icon } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import '../App.css';

function TopBar(props) {

  const { logout, user } = useContext(AuthContext);

  const { showDropdown, toggleDropdown } = useDropdown();

  const handleLogout = () => {
    props.history.push('/');
    logout();
  }

  const logoStyle = {
    maxHeight: '100%',
    padding: '1px 0px'
  };

  const loggedInMenu = () => {
    return (
      <div className='dropdown-menu'>
      <ul style={{
        display: showDropdown ? 'block' : 'none',
        width: 150, 
        right: 10, 
        top: '100%'
      }}>
        <li style={{height: 40}}><button onClick={handleLogout} className='dropdown-button'>Logout <Icon name='log out' style={{marginRight: 5, marginLeft: 'auto'}} /> </button></li>
      </ul>
    </div>
    );
  }

  //'#f2fdff' old bg color
//00cccc
//C9E0E1
//#b4eded
  const menuBar = () => {
    return (
      <div style={{backgroundColor: '#4CA4A0', height: 45, borderBottom: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          
          {/* <div style={{height: '100%', padding: '2px 0px 2px 2px'}}>
            <img src='/img/logos/radar-icon-white-teal-sweep-teal-circle-border.svg' alt='logo of radar displaying fish location' style={{width: 'auto', height: '100%'}} />
          </div> */}
          {/* radar-teal-square.svg */}

          <div style={{height: '100%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{color: 'black', fontSize: 30, fontFamily: 'Brush Script MT, cursive', paddingRight: 10}}>Fish</div>
            <img style={logoStyle} src='/img/Leopard-Shark-Cropped-3840-1920.svg' alt='Leopard Shark'/>
          <div style={{color: 'black', fontSize: 30, fontFamily: 'Brush Script MT, cursive', paddingLeft: 5}}>Smart</div>
        </div>

        <div style={{height: '100%', width: 50, display: 'flex', alignItems: 'center', position: 'relative'}}>
          <button className='top-bar-button' onClick={e => toggleDropdown(e)} style={{display: user ? 'flex' : 'none' , alignItems: 'center', justifyContent: 'center', width: 40, height: 40, marginRight: 10, border: '1px solid lightgray', borderRadius: '50%'}}><Icon size='large' style={{margin: 0}} name='ellipsis vertical' /></button>
          {/* DROPDOWN CONTENT */}
          {user && loggedInMenu()}
        </div>
      </div>
    );
  }

  return (
    <div>
      {menuBar()}
    </div>
  ); 
}


export default withRouter(TopBar);