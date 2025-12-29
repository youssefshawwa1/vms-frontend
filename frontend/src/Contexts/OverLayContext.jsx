// contexts/LoadingContext.js
import React, { createContext, useContext, useState } from "react";

const OverLayContext = createContext();

export const OverLayProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState();
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [popUpConfig, setPopUpConfig] = useState({
    isVisible: false,
    title: "",
    content: null, // This will hold the component
    onSubmit: null, // Submit callback
    onCancel: null, // Cancel callback
  });
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
  const showPopUp = (title, content) => {
    setPopUpConfig({
      isVisible: true,
      title,
      content,
    });
  };
  const hidePopUp = () => {
    setPopUpConfig({
      isVisible: false,
      title: "",
      content: null,
    });
  };

  const value = {
    //PupUp
    hidePopUp,
    showPopUp,
    popUpConfig,
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
    <OverLayContext.Provider value={value}>{children}</OverLayContext.Provider>
  );
};

export const useOverLay = () => {
  const context = useContext(OverLayContext);
  if (!context) {
    throw new Error("useOverLay must be used within a OverLayProvider");
  }
  return context;
};
