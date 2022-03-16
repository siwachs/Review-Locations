import React, { useContext } from "react";
import "./navLinks.scss";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../components/utils/Context/Auth_Context";
import { Link } from "react-router-dom";

function NavLinks() {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav_links">
      <li>
        <NavLink to={"/"}>All Users</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.uid}/places`}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={"/places/new"}>New Place</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to={"/auth"}>Auth</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <Link to={"/"}>
          <button onClick={auth.logout}>Log Out</button>
        </Link>
      )}
    </ul>
  );
}

export default NavLinks;
