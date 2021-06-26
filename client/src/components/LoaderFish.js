import React from 'react';
import '../App.css';
// can specify width from props and will scale appropriately
const LoaderFish = props => {
  return (
      <div style={{position: 'relative', width: props.width ? props.width: 200, height: props.width ? props.width / 2 : 100}} >
        <div className='loading-animation' style={{zIndex: 2, width: props.width ? props.width / 2 * 0.75 : 75, height: props.width ? props.width / 2 * 0.75 : 75 }} />
        <img alt='loading animation' style={{opacity: 0.4, zIndex: 1, position: 'absolute', height: 'auto', width: props.width ? props.width: 200, top: 0, left: 0}} src='/img/icons/Calico-Bass-3840-1920.svg'/>
      </div>
  )
};

export default LoaderFish;