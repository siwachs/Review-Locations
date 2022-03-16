import React from "react";
import "./navbar.scss";

function Navbar(props) {
  return <header className="main_header">{props.children}</header>;
}

export default Navbar;
