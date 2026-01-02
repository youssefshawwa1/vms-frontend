import { useState, useRef, useEffect } from "react";
import fekra from "../../../assets/logo.png";
import { useAuth } from "../../../Contexts/AuthContext";
import { Link, matchPath, useLocation } from "react-router-dom";
// MUI Icons
import {
  PersonOutline,
  Logout,
  KeyboardArrowDown,
  SettingsOutlined,
} from "@mui/icons-material";
import { Avatar, Divider } from "@mui/material";

const Header = () => {
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const routes = [
      { path: "/dashboard", title: "Dashboard" },
      { path: "/volunteers/*", title: "Volunteers" },
      { path: "/teams/*", title: "Teams" },
      { path: "/tasks/*", title: "Tasks" },
      { path: "/certificates/*", title: "Certificates" },
      { path: "/volunteering/*", title: "Volunteering" },
      { path: "/profile", title: "Your Profile" },
    ];

    const matchingRoute = routes.find((route) =>
      matchPath(route.path, pathname)
    );

    return matchingRoute?.title || "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    document.title = `${pageTitle} - FEKRA`;
  }, [pageTitle]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between ">
      {/* Brand Section */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="w-16 md:w-20 transition-transform hover:scale-105">
          <img
            src={fekra}
            alt="Fekra"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-10 w-[1px] bg-gray-200"></div>

        <div>
          <h2 className="text-base md:text-xl font-bold text-[#0d4461] tracking-tight capitalize">
            {pageTitle}
          </h2>
          <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            System / {pageTitle.toLowerCase()}
          </p>
        </div>
      </div>

      {/* User Actions Section */}
      <div className="relative flex items-center" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="group flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
        >
          <Avatar
            sx={{
              width: 35,
              height: 35,
              bgcolor: "#0b4e70",
              fontSize: "0.85rem",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(11, 78, 112, 0.2)",
            }}
          >
            {user?.userName?.substring(0, 2).toUpperCase()}
          </Avatar>

          <KeyboardArrowDown
            className={`text-gray-400 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            sx={{ fontSize: 18 }}
          />
        </button>

        {/* Professional Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="px-4 py-3 mb-1">
              <p className="text-[10px] font-black text-[#f59e0b] uppercase tracking-tighter">
                Current Session
              </p>
              <p className="text-sm font-bold text-[#0d4461] truncate">
                {user?.userName}
              </p>
            </div>

            <Divider sx={{ mb: 1, opacity: 0.6 }} />

            <Link
              to="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0b4e70] transition-colors"
            >
              <PersonOutline sx={{ fontSize: 20, opacity: 0.7 }} />
              <span className="font-medium">My Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0b4e70] transition-colors"
            >
              <SettingsOutlined sx={{ fontSize: 20, opacity: 0.7 }} />
              <span className="font-medium">Settings</span>
            </Link>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold"
            >
              <Logout sx={{ fontSize: 20 }} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
