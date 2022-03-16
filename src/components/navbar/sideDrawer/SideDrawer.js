import React from "react";
import "./sideDrawer.scss";
import ReactDom from "react-dom";
import { CSSTransition } from "react-transition-group";

function SideDrawer(props) {
  const drawer = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames={"slide-in-left"}
      mountOnEnter
      unmountOnExit
    >
      <aside onClick={props.onClick} className="side_drawer">
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDom.createPortal(drawer, document.getElementById("drawer"));
}

export default SideDrawer;
