import { useEffect } from "react";
import { useOverLay } from "../Contexts/OverLayContext";
import { LoadingTime } from "../Components/Global/Global";
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
