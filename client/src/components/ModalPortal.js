import React, { useContext } from 'react';
import { ModalContext } from '../context/modal';
import ReactDom from 'react-dom';
import LoginModal from './LoginModal';

// pass boolean value in props for showModal to determine whether to show or hide modal, will only show if the value is true
/*
Props:

width: specify width of modal, default 400
style: style object for main modal window
headerStyle: pass a style object to specify style, otherwise a default style will be applied
bodyStyle: pass a style object to specify body style, otherwise a deafult style will be applied
borderRadius: specify a border radius for outer edges of modal window
*/
const ModalPortal = props => {
  // user context for closing login modal when user logs in
  // const { user } = useContext(AuthContext);
  const { showModal, modalContent } = useContext(ModalContext);

  // const closeModal = () => console.log('close modal');
  // const modalContent = 'LOGIN_MODAL';

  // process our modal content from context
  const processModalContent = () => {
    if (modalContent === 'LOGIN_MODAL') {
      return <LoginModal />
    }
    else return modalContent;
  };  


  // render nothing if props.show is false
  return showModal ? 
    ReactDom.createPortal(
      <div onClick={props.onClick} style={{ position: 'fixed', top:0, left: 0, zIndex: 999999999, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
        {processModalContent()}
      </div>
    , document.getElementById('portal')
    )
    : null;

}


export default ModalPortal;