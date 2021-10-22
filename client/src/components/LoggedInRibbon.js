import React from 'react';
import { useQuery } from '@apollo/client';
import UserMenu from './UserMenu';
import { useDropdown } from '../utilities/hooks';
import { GET_USER_BASIC_DATA } from '../gql/gql';
import '../App.css';
const LoggedInRibbon = (props) => {

  const { showDropdown, toggleDropdown } = useDropdown();
  const { user } = props;

  const {
    loading: loadingUserBasicData,
    data: userBasicData,
  } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id },
    onError: err => console.log(err),
  });

  return (
    <div className='logged-in-bar'>
      <div className='user-menu-trigger' onClick={toggleDropdown}>
        {
          userBasicData && userBasicData.getUser.profilePhoto && userBasicData.getUser.profilePhoto.secure_url &&
          <img className='top-bar-profile' src={userBasicData.getUser.profilePhoto.secure_url} alt='profile' />
        }
        {user.username}
      </div>
      {showDropdown && <UserMenu />}
    </div> 
  ); 
};

export default LoggedInRibbon;