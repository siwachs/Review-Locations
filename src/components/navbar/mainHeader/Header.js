import React, { useState } from "react";
import Navbar from "./Navbar";
import "./header.scss";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "../sideDrawer/SideDrawer";
import Backdrop from "../../utils/Backdrop/Backdrop";

function Header() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawer}></Backdrop>}
      <SideDrawer onClick={closeDrawer} show={drawerIsOpen}>
        <nav className="main_navigation_drawer">
          <NavLinks></NavLinks>
        </nav>
      </SideDrawer>
      <Navbar>
        <button className="main_navigation_btn" onClick={openDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h2 className="main_navigation_title">
          <Link to={"/"}>Places</Link>
        </h2>
        <nav className="main_navigation_header">
          <NavLinks></NavLinks>
        </nav>
      </Navbar>
    </React.Fragment>
  );
}

export default Header;
