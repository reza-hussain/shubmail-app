import React, { createContext, useContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
  const [activeEmail, setActiveEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inboxLoader, setInboxLoader] = useState(false);
  const [mailLoader, setMailLoader] = useState(false);
  const [emailLoader, setEmailLoader] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [pagination, setPagination] = useState(null);

  return (
    <StateContext.Provider
      value={{
        inbox,
        setInbox,
        activeEmail,
        setActiveEmail,
        currentPage,
        setCurrentPage,
        mailLoader,
        setMailLoader,
        emailLoader,
        setEmailLoader,
        inboxLoader,
        setInboxLoader,
        emailData,
        setEmailData,
        pagination,
        setPagination,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
