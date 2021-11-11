import React, { useContext } from 'react';
import { ModalContext } from '../../context/modal';
import Login from '../../pages/Login';


const LoginModal = props => {
  const { closeModal } = useContext(ModalContext);

  return ( 
    <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      {/* MODAL WINDOW */}
      <div style={{width: 500, overflow: 'hidden'}}>
        {/* HEADER */}
        <div style={{ height: 50, backgroundColor: 'teal', color: 'white', fontSize: '20px' }}>
          <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flexGrow: 1}}>Not Authorized</div>
          <div className='close-modal' onClick={closeModal} style={{ alignSelf: 'flex-start', padding: 5, fontSize: '25px'}}>&#10006;</div>
        </div>
        </div>
        <div style={{ backgroundColor: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,}}>
          <div>
            Please log in to continue...
            <Login noRedirect={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;