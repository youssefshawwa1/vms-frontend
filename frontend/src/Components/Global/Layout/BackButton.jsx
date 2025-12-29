import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const BackButton = ({ showBackTo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Add current path to history when location changes
    setHistory((prev) => {
      // Don't add if it's the same as the last one
      if (prev[prev.length - 1] === location.pathname) return prev;
      return [...prev, location.pathname];
    });
  }, [location]);

  const handleGoBack = () => {
    if (history.length > 1) {
      navigate(-1);
      // Remove the current page from history
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const getPreviousPageName = () => {
    if (history.length < 2) return "Dashboard";

    const previousPath = history[history.length - 2];
    const pageNames = {
      "/dashboard": "Dashboard",
      "/volunteers": "Volunteers",
      "/teams": "Teams",
      "/tasks": "Tasks",
      "/certificates": "Certificates",
      "/volunteering": "Volunteering",
      "/profile": "Profile",
    };

    return pageNames[previousPath] || "Previous Page";
  };

  const canGoBack = history.length > 1;

  return (
    <>
      <button
        onClick={handleGoBack}
        disabled={!canGoBack}
        className={`flex items-center space-x-2 px-4 py-2 transition-colors nav-item ${
          canGoBack ? " can-go-back " : "text-gray-500 cursor-not-allowed "
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {showBackTo && (
          <span className="block w-full truncate">
            Back to {getPreviousPageName()}
          </span>
        )}
      </button>
    </>
  );
};
export default BackButton;
