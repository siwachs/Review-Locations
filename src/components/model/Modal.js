import React from "react";
import "./modal.scss";
import ReactDOM from "react-dom";
import Backdrop from "../utils/Backdrop/Backdrop";
import { CSSTransition } from "react-transition-group";

function ModalOverlay(props) {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal_header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal_content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal_footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal"));
}

function Modal(props) {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel}></Backdrop>}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="model"
      >
        <ModalOverlay {...props}></ModalOverlay>
      </CSSTransition>
    </React.Fragment>
  );
}

export default Modal;
