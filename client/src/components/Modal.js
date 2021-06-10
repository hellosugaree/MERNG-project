import React from 'react';
import ReactDom from 'react-dom';

// pass boolean value in props for showModal to determine whether to show or hide modal, will only show if the value is true
/*
Props:

width: specify width of modal, default 400
style: style object for main modal window
headerStyle: pass a style object to specify style, otherwise a default style will be applied
bodyStyle: pass a style object to specify body style, otherwise a deafult style will be applied
borderRadius: specify a border radius for outer edges of modal window
*/
const Modal = props => {
  // process our props
  const headerStyle = props.headerStyle ? props.headerStyle
    : { 
      height: 50, 
      backgroundColor: 'teal', 
      color: 'white', 
      fontSize: '20px', 
      // display: 'flex', 
      // alignItems: 'center',
      // justifyContent: 'center',
    };

  const bodyStyle = props.bodyStyle ? props.bodyStyle
    : {
      backgroundColor: 'white',  
      fontSize: '16px', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    };

  // not necessary, can just style modal window and do overflow hidden
  // const headerBorderRadius = props.borderRadius ? { borderTopRightRadius: props.borderRadius, borderTopLeftRadius: props.borderRadius } : {};
  // const headerBorder = props.border ? { borderTop: props.border, borderRight: props.border, borderLeft: props.border } : {};
  // const bodyBorder = props.border ? { borderBottom: props.border, borderRight: props.border, borderLeft: props.border } : {};
  // const bodyBorderRadius = props.borderRadius ? { borderBottomRightRadius: props.borderRadius, borderBottomLeftRadius: props.borderRadius } : {};

  // display: props.show ? '' : 'none',

  // render nothing if props.show is false
  if (!props.show) return null;

  return ReactDom.createPortal(
    <>
      /* OUTER MODAL CONTAINER */
      <div onClick={props.onClick} style={{ position: 'fixed', top:0, left: 0, zIndex: 999999999, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
        {/* INNER MODAL CONTAINER TO POSITION MODAL WINDOW */}
        <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
          {/* MODAL WINDOW */}
          <div style={{width: props.width ? props.width : 500, height: props.height ? props.height: '', ...props.style, overflow: 'hidden'}}>
            {/* HEADER */}
            <div style={{...headerStyle}}>
              <span>{props.headerContent && props.headerContent ? props.headerContent : 'Specify header content in props (headerContent)'}</span>  
            </div>
            <div style={{...bodyStyle}}>
              {props.bodyContent ? props.bodyContent : 'Please specify body content in props (bodyContent)'}
            </div>
          </div>
        </div>
      </div>
    </>
    , document.getElementById('portal')
  );
}


export default Modal;