import React, { useState, useContext } from 'react';
import { useDropdown } from '../utilities/hooks';
import { Icon } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

import '../App.css';



export default function TopBar() {

  const { logout, user } = useContext(AuthContext);

  // gets 'login' from '/login' etc
  const currentPath = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1,window.location.pathname.length); // get current path from window so we can set the state for active item based on current path
  // sets activeItem based on current path
  const [activeItem, setActiveItem] = useState(currentPath); 
  
  const { showDropdown, toggleDropdown } = useDropdown();

  // destructure name from target prop
  // const handleItemClick = (e, { name }) => setActiveItem(name);

  const handleLogout = () => {
    window.location.pathname='/';
    logout();
  }

  const logoStyle = {
    maxHeight: '100%',
    marginBottom: -5
    // display: 'block',
    // margin: '0 auto 0 auto',
    // padding: '5px 0 5px 100px'
  };

  const loggedInMenu = () => {
    return (
      <div style={{backgroundColor: '#f2fdff', height: 45, borderBottom: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

          <div style={{height: '150%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{color: 'black', fontSize: 30, fontFamily: 'Brush Script MT, cursive', paddingRight: 10}}>Fish</div>
          <img style={logoStyle} src='/img/icons/Leopard-Shark-3840-1920.svg' alt='Leopard Shark'/>
          <div style={{color: 'black', fontSize: 30, fontFamily: 'Brush Script MT, cursive'}}>Smart</div>
        </div>

        <div style={{height: '100%', width: 50, display: 'flex', alignItems: 'center', position: 'relative'}}>
          <button className='top-bar-button' onClick={e => toggleDropdown(e)} style={{display: user ? 'flex' : 'none' , alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: 'none', marginRight: 10, border: '1px solid lightgray', borderRadius: '50%'}}><Icon size='large' style={{margin: 0}} name='ellipsis vertical' /></button>
          {/* DROPDOWN CONTENT */}
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
        </div>
      </div>
    );
  }
//          content={context.user.username}
  const loggedOutMenu = () => {
    return (
      <div style={{backgroundColor: '#f2fdff', height: 45, borderBottom: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{height: '90%', flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
        <img style={logoStyle} src='/img/striped-bass-small.png' alt='striped bass'/> 
      </div>
      <div style={{height: '100%', display: 'flex', alignItems: 'center', position: 'relative'}}>
        <button className='top-bar-button' onClick={e => toggleDropdown(e)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: 'none', marginRight: 10, border: '1px solid lightgray', borderRadius: '50%'}}><Icon size='large' style={{margin: 0}} name='ellipsis vertical' /></button>
        {/* DROPDOWN CONTENT */}
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
      </div>
    </div>
    );
  }
  
  return (
    <div>
      {loggedInMenu()}
    </div>
  ); 
}

