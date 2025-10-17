import { useOverLay } from "./Contexts/OverLayContext.jsx";
import { Message, Loading } from "./Components/Global/OverLay.jsx";
import PopUp from "./Components/Global/PopUp.jsx";
import App from "./App";
import { useEffect } from "react";

const AppWrapper = () => {
  const { isLoading, isMessageVisible, hideLoading, popUpConfig } =
    useOverLay();
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
    }, 2000);
  }, []);
  return (
    <>
      {isLoading && <Loading />}
      {isMessageVisible && <Message />}
      {popUpConfig.isVisible && <PopUp />}
      <App />
    </>
  );
};
export default AppWrapper;
