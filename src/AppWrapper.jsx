import { useLoading } from "./contexts/LoadingContext";
import Loading from "./components/Helpers/Loading";
import Message from "./components/Helpers/Message";
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
