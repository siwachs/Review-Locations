import { useEffect, useState, useCallback } from "react";
let logOutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [uid, setUid] = useState(null);
  const [tokenExpDate, setTokenExpDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    const tokenExpDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(tokenExpDate);
    localStorage.setItem(
      "UserData",
      JSON.stringify({
        uid: uid,
        token: token,
        expiration: tokenExpDate.toISOString(),
      })
    );
    setUid(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUid(null);
    setTokenExpDate(null);
    localStorage.removeItem("UserData");
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("UserData"));
    if (data && data.token && new Date(data.expiration > new Date())) {
      login(data.uid, data.token, new Date(data.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainTime = tokenExpDate.getTime() - new Date();
      logOutTimer = setTimeout(logout, remainTime);
    } else {
      clearTimeout(logOutTimer);
    }
  }, [token, logout, tokenExpDate]);

  return { login, logout, token, uid };
};
