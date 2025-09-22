// contexts/LoadingContext.js
import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState();
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState("");

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const showMessage = (text, type = "Success") => {
    setMessageText(text);
    setMessageType(type);
    setIsMessageVisible(true);
  };

  const hideMessage = () => {
    setIsMessageVisible(false);
    setMessageText("");
  };

  const value = {
    // Loading states
    isLoading,
    showLoading,
    hideLoading,

    // Message states
    messageText,
    messageType,
    isMessageVisible,
    showMessage,
    hideMessage,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
