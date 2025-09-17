import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidePanel.css";

const SidePanel = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/volunteers", label: "Volunteers", icon: "👥" },
    { path: "/tasks", label: "Tasks", icon: "✅" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`side-panel ${isExpanded ? "expanded" : "collapsed"} fixed`}
    >
      <div className="panel-header text-center">
        {isExpanded && <h2>Navigation</h2>}
        <button className="toggle-btn" onClick={togglePanel}>
          {isExpanded ? "◀" : "▶"}
        </button>
      </div>
      <nav className="panel-nav flex flex-col ">
        {navItems.map((item, index) => (
          <Link
            to={item.path}
            className={`nav-item ${
              location.pathname == item.path ? "active" : ""
            }`}
            key={index}
          >
            <span className="nav-icon">{item.icon}</span>
            {isExpanded && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isExpanded && (
        <div className="panel-footer">
          <div className="user-info">
            <div className="user-avatar">{props.userAvatar}</div>
            <div className="user-details">
              <p className="user-name">{props.userName}</p>
              <p className="user-role">{props.userRole}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
