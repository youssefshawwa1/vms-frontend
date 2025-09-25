import { useEffect } from "react";
import { useLoading } from "../contexts/LoadingContext";
import { LoadingTime } from "./Global/Global";
function Home() {
  const { hideLoading } = useLoading();
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
