import { useEffect } from "react";
import { useOverLay } from "../contexts/OverLayContext";
import { LoadingTime } from "./Global/Global";
function Home() {
  const { hideLoading } = useOverLay();
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
    }, LoadingTime);
  }, []);
  return (
    <>
      <h1>This is home</h1>
    </>
  );
}

export default Home;
