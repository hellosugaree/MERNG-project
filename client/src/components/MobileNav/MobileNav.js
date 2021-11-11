import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUmbrellaBeach, faComments, faFish } from '@fortawesome/free-solid-svg-icons'
import '../../App.css';

const activeNavButtonStyle = {
  textDecoration: 'underline',
  textDecorationColor: 'rgb(123, 172, 189)'
};

const activeNavIconStyle = {
  color: 'rgb(123, 172, 189)',
};

const MobileNav = (props) => {

  const path = props.location.pathname;

  const handleSidebarClick = (event) => {
    switch (event.currentTarget.name) {
      case 'userCatchMap':
        props.history.push('/user/catchmap');
      break;
      case 'home':
        props.history.push('/');
      break;
      case 'weather':
        props.history.push('/weather');
      break;
      case 'beaches':
        props.history.push('/beaches');
      break;
      case 'posts':
        props.history.push('/posts');
      break;
      case 'catchfeed':
        props.history.push('/catchfeed');
      break;   
      case 'settings':
        props.history.push('/settings');
      break;
      default:
        props.history.push('/');
      break;         
    }
    props.toggleNavMenu();
  };

  return (
    <nav className='mobile-nav'>
      <button 
        type='button' 
        name='userCatchMap' 
        className='top-bar-nav-button' 
        onClick={handleSidebarClick}
      >
        <FontAwesomeIcon className='top-bar-nav-icon' style={ path === '/user/catchmap' ? { ...activeNavIconStyle, fontSize: '1.2em' } : { fontSize: '1.2em' } } icon={faFish} />
        <span style={ path === '/user/catchmap' ? {...activeNavButtonStyle} : {} }>MY ACTIVITY</span>
      </button>

      <button 
        type='button' 
        name='posts' 
        className='top-bar-nav-button' 
        onClick={handleSidebarClick}
      >
        <FontAwesomeIcon className='top-bar-nav-icon' style={ path === '/posts' ? {...activeNavIconStyle} : {} } icon={faComments} />
        <span style={ path === '/posts' ? {...activeNavButtonStyle} : {} }>FEED</span>
      </button>

      <button 
        type='button' 
        name='weather' 
        className='top-bar-nav-button' 
        onClick={handleSidebarClick}
      >
        <Icon className='top-bar-nav-icon' name='sun' style={ path === '/weather' ? {...activeNavIconStyle} : {} } />
        <span style={ path === '/weather' ? {...activeNavButtonStyle} : {} }>WEATHER</span>
      </button>
      
      <button 
        type='button' 
        name='beaches' 
        className='top-bar-nav-button' 
        onClick={handleSidebarClick}
      >
        <FontAwesomeIcon className='top-bar-nav-icon' style={ path === '/beaches' ? { ...activeNavIconStyle, fontSize: '1em' } : { fontSize: '1em' } } icon={faUmbrellaBeach} />
        <span style={ path === '/beaches' ? {...activeNavButtonStyle} : {} }>BEACHES</span>
      </button>
    </nav>
  );
};

export default withRouter(MobileNav);