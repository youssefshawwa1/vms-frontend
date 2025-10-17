import { useEffect, useState } from "react";
import Header from "./Header";
import SidePanel from "./SidePanel";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useOverLay } from "../../../contexts/OverLayContext";
import { LoadingTime } from "../Global";
const Layout = () => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsDone(true);
    }, LoadingTime);
  }, []);
  const { showLoading } = useOverLay();
  const location = useLocation();
  useEffect(() => {
    showLoading();
  }, [location.pathname]);

  return (
    <>
      {isDone && (
        <>
          <SidePanel userAvatar="YS" userRole="Admin" userName="joe" />
          <Header />

          <div className="main-content flex mx-0 px-0">
            <Outlet />
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
