import React, { createContext, useContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
  return (
    <StateContext.Provider value={{ inbox, setInbox }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
