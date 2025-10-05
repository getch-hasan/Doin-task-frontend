import React, { useState, useEffect } from "react";
import { getToken } from "../utils/helpers";
import { UserContext } from "./userContex";


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => !!getToken());

  useEffect(() => {
    setToken(!!getToken());
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
