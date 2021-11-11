import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUmbrellaBeach, faComments, faFish } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../context/auth';
import LoggedInRibbon from '../LoggedInRibbon';
import MobileNav from '../MobileNav';
import '../../App.css';

const logoStyle = {
  objectFit: 'cover',
  padding: '1px 0px'
};

const activeNavButtonStyle = {
  textDecoration: 'underline',
  textDecorationColor: 'rgb(123, 172, 189)'
};

const activeNavIconStyle = {
  color: 'rgb(123, 172, 189)',
};

function TopBar(props) {

  const path = props.location.pathname;
  const { user } = useContext(AuthContext);
  const [ showNavMenu, setShowNavMenu ] = useState(false);

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
  };

  const toggleNavMenu = () => {
    setShowNavMenu(prevState => !prevState);
  };

  return (
    <div style={{ position: 'relative' }}>
      {user && <LoggedInRibbon user={user} />}
      <div className='top-bar'>
        <img className='top-bar-logo' src='/img/logos/fs-logo-2.png' alt='yellowtail logo' onClick={() => props.history.push('/')} />
        {user && 
          <nav className='top-bar-nav-container'>
            <button 
              type='button' 
              name='userCatchMap' 
              className='top-bar-nav-button' 
              onClick={handleSidebarClick}
            >
              <FontAwesomeIcon className='top-bar-nav-icon' style={path === '/user/catchmap' ? { ...activeNavIconStyle, fontSize: '1.2em' } : { fontSize: '1.2em' }} icon={faFish} />
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
        }
        <div style={{ flexGrow: 1 }} />
        {user &&
          <button className='top-bar-menu-toggle' onClick={toggleNavMenu}><Icon size='big' name='bars' /></button>
        }
      </div>
      {showNavMenu && <MobileNav toggleNavMenu={toggleNavMenu} />}
    </div>
  ); 
}

export default withRouter(TopBar);