import { useEffect } from "react";
import { useLoading } from "../contexts/LoadingContext";
function Home() {
  const { hideLoading } = useLoading();
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
    }, 1000);
  }, []);
  return (
    <>
      <h1>This is home</h1>
    </>
  );
}

export default Home;
