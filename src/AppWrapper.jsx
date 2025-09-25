import { useLoading } from "./contexts/LoadingContext";
import { Message, Loading } from "./components/Global/Helpers/OverLay.jsx";
import App from "./App";
import { useEffect } from "react";

const AppWrapper = () => {
  const { isLoading, isMessageVisible, hideLoading } = useLoading();
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
    }, 2000);
  }, []);
  return (
    <>
      {isLoading && <Loading />}
      {isMessageVisible && <Message />}
      <App />
    </>
  );
};
export default AppWrapper;
