import React, { useContext } from 'react';
import { withRouter } from "react-router-dom";
import { Icon } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import '../App.css';

const UserMenu = (props) => {
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    props.history.push('/');
    logout();
  }

  return (
    <div className='user-menu'>
      {user.username}
      <div 
        className='user-menu-link'
        onClick={handleLogout}
      >
        <Icon name='log out' />
        <span >Logout</span>
      </div>
    </div>
  );
};

export default withRouter(UserMenu);