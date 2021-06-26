import { createContext, useState } from 'react';
import '../App.css';

const ModalContext = createContext({
  showModal: false,
  modalContent: null,
  successfulLogin: false,
  showLoginModal: () => {},
  closeModal: () => {}
});


const ModalProvider = props => {

  // initial state for our modal
  const initialState = {
    showModal: false,
    modalContent: null
  };

  const [state, setState] = useState(initialState);

  // login modal predefined type
  const showLoginModal = () => {
    setState({ ...state, modalContent: 'LOGIN_MODAL', showModal: true });
  };

  const showCustomModal = content => {
    setState({ ...state, modalContent: content, showModal: true })
  };

  const closeModal = () => {
    setState({ ...state, modalContent: null, showModal: false });
  };


  return (<ModalContext.Provider value={{ showModal: state.showModal, modalContent: state.modalContent, closeModal, showCustomModal, showLoginModal }} { ...props } />)
};

export { ModalProvider, ModalContext };

  // process our props
  // const headerStyle = props.headerStyle ? props.headerStyle
  //   : { 
      // height: 50, 
      // backgroundColor: 'teal', 
      // color: 'white', 
      // fontSize: '20px', 
  //     // display: 'flex', 
  //     // alignItems: 'center',
  //     // justifyContent: 'center',
  //   };

  // const bodyStyle = props.bodyStyle ? props.bodyStyle
  //   : {
      // backgroundColor: 'white',  
      // fontSize: '16px', 
      // display: 'flex', 
      // alignItems: 'center',
      // justifyContent: 'center',
      // padding: 20,
  //   };

  // not necessary, can just style modal window and do overflow hidden
  // const headerBorderRadius = props.borderRadius ? { borderTopRightRadius: props.borderRadius, borderTopLeftRadius: props.borderRadius } : {};
  // const headerBorder = props.border ? { borderTop: props.border, borderRight: props.border, borderLeft: props.border } : {};
  // const bodyBorder = props.border ? { borderBottom: props.border, borderRight: props.border, borderLeft: props.border } : {};
  // const bodyBorderRadius = props.borderRadius ? { borderBottomRightRadius: props.borderRadius, borderBottomLeftRadius: props.borderRadius } : {};

  // display: props.show ? '' : 'none',




/*






              <Modal 
                show={showModal}
                bodyContent={modalContent.body} headerContent={modalContent.header} 
                style={{borderRadius: 5, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}
              />

*/


        // {/* INNER MODAL CONTAINER TO POSITION MODAL WINDOW */}
        // <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        //   {/* MODAL WINDOW */}
        //   <div style={{width: props.width ? props.width : 500, height: props.height ? props.height: '', ...props.style, overflow: 'hidden'}}>
        //     {/* HEADER */}
        //     <div style={{...headerStyle}}>
        //       <span>{props.headerContent && props.headerContent ? props.headerContent : 'Specify header content in props (headerContent)'}</span>  
        //     </div>
        //     <div style={{...bodyStyle}}>
        //       {props.bodyContent ? props.bodyContent : 'Please specify body content in props (bodyContent)'}
        //     </div>
        //   </div>
        // </div>