import { useOverLay } from "./contexts/OverLayContext.jsx";
import { Message, Loading } from "./components/Global/Helpers/OverLay.jsx";
import PopUp from "./components/Global/PopUp.jsx";
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
