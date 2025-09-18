import { useEffect } from "react";
import Header from "./Header";
import SidePanel from "./SidePanel";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";
const Layout = () => {
  const { showLoading } = useLoading();
  const location = useLocation();
  useEffect(() => {
    showLoading();
    console.log(location);
  }, [location]);
  return (
    <>
      <Header />
      <SidePanel userAvatar="YS" userRole="Admin" userName="joe" />
      <div className="main-content flex">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
