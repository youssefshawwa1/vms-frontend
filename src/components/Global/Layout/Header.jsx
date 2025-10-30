import { useState, useRef, useEffect } from "react";
import fekra from "../../../assets/logo.png";
import { useAuth } from "../../../Contexts/AuthContext";
import { Link, matchPath } from "react-router-dom";
const Header = () => {
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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

  // Update document title
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
      {/* Brand */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <h1 className="text-lg font-semibold text-gray-900 w-16 md:w-20">
          <img src={fekra} alt="Fekra" />
        </h1>
        <div className="border-l border-gray-300 pl-4 md:pl-6">
          <h2 className="text-base md:text-xl font-semibold text-gray-800 capitalize">
            {getPageTitle(location.pathname)}
          </h2>
          {/* Hide subtitle on mobile */}
          <p className="hidden md:block text-sm text-gray-500 mt-1">
            Manage {getPageTitle(location.pathname).toLowerCase()}.
          </p>
        </div>
      </div>

      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="cursor-pointer w-8 h-8 bg-[#0b4e70] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2"
        >
          <span className="text-white font-semibold text-xs uppercase">
            {user.username.substring(0, 2)}
          </span>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <Link
              to="/profile"
              onClick={() => {
                setIsDropdownOpen(false);
              }}
              className="cursor-pointer w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </Link>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="cursor-pointer w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
