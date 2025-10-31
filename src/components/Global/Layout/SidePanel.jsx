import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidePanel.css";
import { MdVolunteerActivism } from "react-icons/md";
import { FaUsersCog, FaTasks } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaPeopleCarryBox, FaPeopleGroup } from "react-icons/fa6";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { PiCertificateBold } from "react-icons/pi";
import { useAuth } from "../../../Contexts/AuthContext";
import BackButton from "./BackButton";
const SidePanel = () => {
  const sideBarRef = useRef(null);
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };
  const navItems = [
    { path: "/", label: "Dashboard", icon: <BiSolidDashboard /> },
    { path: "/volunteers", label: "Volunteers", icon: <FaPeopleGroup /> },
    { path: "/teams", label: "Teams", icon: <FaPeopleCarryBox /> },
    {
      path: "/volunteering",
      label: "Volunteering",
      icon: <MdVolunteerActivism />,
    },
    { path: "/tasks", label: "Tasks", icon: <FaTasks /> },
    {
      path: "/certificates",
      label: "Certificates",
      icon: <PiCertificateBold />,
    },
    { path: "/users", label: "Users", icon: <FaUsersCog /> },
  ];
  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div
      className={`side-panel ${isExpanded ? "expanded" : "collapsed"} fixed`}
      ref={sideBarRef}
    >
      <BackButton showBackTo={isExpanded} />
      <div className="panel-header text-center">
        {isExpanded && <h2>Navigation</h2>}
        <button className="toggle-btn" onClick={togglePanel}>
          {isExpanded ? <MdNavigateBefore /> : <MdNavigateNext />}
        </button>
      </div>
      <nav className="panel-nav flex flex-col ">
        {navItems.map((item, index) => (
          <Link
            to={item.path}
            className={` nav-item ${isActive(item.path) ? " active" : ""}`}
            key={index}
          >
            <span className="nav-icon">{item.icon}</span>
            {isExpanded && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isExpanded && (
        <div className="panel-footer hover:bg-[#ffffff0c] transition-colors cursor-pointer">
          <Link to={"/profile"} className="user-info ">
            <div className="user-avatar uppercase bg-main">
              {user.username.substring(0, 2)}
            </div>
            <div className="user-details  ">
              <p className="user-name">{user.username}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
