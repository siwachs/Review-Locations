import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  uid: null,
  token: null,
  login: () => {},
  logout: () => {},
});
