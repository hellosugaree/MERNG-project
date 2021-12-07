import React, { useContext } from 'react';
import { ModalContext } from '../../context/modal';

const ModalSingleImage = props => {
  const { closeModal } = useContext(ModalContext);

  return ( 
    <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{maxWidth: '80%', overflow: 'hidden'}}>
          <div style={{position: 'relative'}}>
            <img src={props.src} alt={props.alt} style={{borderRadius: 5 }} />
            <div className='close-modal' onClick={closeModal} style={{ position: 'absolute', top: 20, right: 20, padding: 10, fontSize: '25px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)'}}>&#10006;</div>
          </div>
      </div>
    </div>
  );
}

export default ModalSingleImage;