import React, { useState, useContext } from 'react';
import { Menu, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { menuColor } from '../../colors';
import { AuthContext } from '../../context/auth';
import '../../App.css';



export default function MenuBar() {

  const context = useContext(AuthContext);

  // gets 'login' from '/login' etc
  const currentPath = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1,window.location.pathname.length); // get current path from window so we can set the state for active item based on current path
  // sets activeItem based on current path
  const [activeItem, setActiveItem] = useState(currentPath); 
  
  // destructure name from target prop
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const handleLogout = () => {
    window.location.pathname='/';
    context.logout();
  }

  const logoStyle = {
    maxHeight: '50px',
    display: 'block',
    margin: '0 auto 0 auto',
    padding: '5px 0 5px 100px'
  };

  const loggedOutMenu = () => {
    return (
        <Menu size='huge' style={{backgroundColor: 'white', width: '100%'}} color={menuColor} tabular>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link} 
            to="/"    
          />
          
          <Image style={logoStyle} src='/img/striped-bass-small.png' alt='striped bass'/>
          
          {/*Link imported from react-router-dom */}
          {/* links to a path that gets picked up by router in App */}
          <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu>
    );
  }
//          content={context.user.username}
  const loggedInMenu = () => {
    return (
        <Menu size='huge' style={{backgroundColor: 'white', width: '100%'}} color={menuColor} tabular>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            content={context.user.username}
            as={Link} 
            to="/"    
          />
          
           <img style={logoStyle} src='/img/striped-bass-small.png' alt='striped bass'/>
      
          {/*Link imported from react-router-dom */}
          {/* links to a path that gets picked up by router in App */}
          <Menu.Menu position='right'>
            <Menu.Item
              name='preferences'
              onClick={handleItemClick}
              active={activeItem === 'preferences'}
              as={Link}
              to='/preferences'
            />
            <Menu.Item
              name='logout'
              onClick={handleLogout}
            />
        </Menu.Menu>
      </Menu>
    );
  }
  
  return (
    <div>
      {context.user
        ? loggedInMenu()
        : loggedOutMenu()
      }
    </div>
  ); 
}

    /*

            <Button
              circular
              compact
              size='mini'
              color='teal'
              name='home'
              onClick={handleItemClick}
              as={Link} 
              to="/"   
              content={context.user.username}
            />


    <Segment attached='bottom'>
      <img src='/images/wireframe/paragraph.png' />
    </Segment>
    -->
    */