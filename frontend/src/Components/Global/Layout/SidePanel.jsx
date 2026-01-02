import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  Group,
  Groups,
  VolunteerActivism,
  Assignment,
  CardMembership,
  ManageAccounts,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Tooltip, Avatar, IconButton } from "@mui/material";
import { useAuth } from "../../../Contexts/AuthContext";
import BackButton from "./BackButton";

const SidePanel = () => {
  const sideBarRef = useRef(null);
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Dashboard /> },
    { path: "/volunteers", label: "Volunteers", icon: <Group /> },
    { path: "/teams", label: "Teams", icon: <Groups /> },
    {
      path: "/volunteering",
      label: "Volunteering",
      icon: <VolunteerActivism />,
    },
    { path: "/tasks", label: "Tasks", icon: <Assignment /> },
    { path: "/certificates", label: "Certificates", icon: <CardMembership /> },
    { path: "/users", label: "Users", icon: <ManageAccounts /> },
  ];

  return (
    <div
      ref={sideBarRef}
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out flex flex-col shadow-2xl
        ${isExpanded ? "w-64 sm:w-64 w-full" : "w-20"} 
        bg-gradient-to-b from-[#0b4e70] to-[#0a3d58] text-white`}
    >
      {/* Header Section */}
      <div className="pt-16 px-4 pb-4 flex items-center justify-between border-b border-white/10">
        {isExpanded && (
          <h2 className="text-lg font-bold tracking-wider animate-fade-in">
            NAVIGATE
          </h2>
        )}
        <IconButton
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-white/10"
          sx={{ color: "white" }}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>

      <div className="p-2">
        <BackButton showBackTo={isExpanded} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 overflow-y-auto no-scrollbar">
        {navItems.map((item, index) => (
          <Tooltip
            key={index}
            title={!isExpanded ? item.label : ""}
            placement="right"
            arrow
          >
            <Link
              to={item.path}
              className={`flex items-center px-6 py-4 transition-all duration-200 group
                ${
                  isActive(item.path)
                    ? "bg-[#0d4461] text-white border-l-4 border-[#f59e0b]"
                    : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                }`}
            >
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive(item.path) ? "text-[#f59e0b]" : ""
                }`}
              >
                {item.icon}
              </div>
              {isExpanded && (
                <span className="ml-4 font-medium whitespace-nowrap overflow-hidden animate-fade-in">
                  {item.label}
                </span>
              )}
            </Link>
          </Tooltip>
        ))}
      </nav>

      {/* Footer Profile Section */}
      <div className="p-4 border-top border-white/10">
        <Link
          to="/profile"
          className={`flex items-center p-2 rounded-xl transition-colors hover:bg-white/10 
            ${isExpanded ? "justify-start" : "justify-center"}`}
        >
          <Avatar
            sx={{
              bgcolor: "#f59e0b",
              width: 40,
              height: 40,
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {user?.username?.substring(0, 2).toUpperCase()}
          </Avatar>

          {isExpanded && (
            <div className="ml-3 overflow-hidden animate-fade-in">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-white/50 truncate capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default SidePanel;
