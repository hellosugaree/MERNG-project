import React from 'react';
import '../App.css';


const HomeSplashPage = (props) => {

  return (
    <div>
      <h1 className='page-title'>Welcome to Fish Smart</h1>
      <h2>Please <a href='/login'>login</a> or <a href='/register'>register</a> to continue</h2>
    </div>
  )
};

export default HomeSplashPage;