import { useEffect, useState } from "react";
import Header from "./Header";
import SidePanel from "./SidePanel";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";
const Layout = () => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsDone(true);
    }, 1000);
  }, []);
  const { showLoading } = useLoading();
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

          <div className="main-content flex">
            <Outlet />
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
