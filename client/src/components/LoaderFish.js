import React from 'react';
import '../App.css';
const LoaderFish = props => {
  return (
    <div style={{ width: 100, height: 100, position: 'relative', ...props.style}} >
      <div className='loading-animation' style={{zIndex: 2, width: '75%', height: '75%', top: '15%', left: '15%'}} />
      <img alt='loading animation' style={{opacity: 0.4, zIndex: 1, position: 'absolute', height: '100%', width: 'auto', top: 0, left: '-50%'}} src='/img/icons/Calico-Bass-3840-1920.svg'/>
    </div>
  )
};

export default LoaderFish;