import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Avatar from "./Avatar";
import Connectimi_logo from "./Connectimi_logo";
import { useTheme } from "../context/ThemeContext";
import { animateNavbarIn, addHoverAnimation } from "../utils/gsapAnimations";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const navItemsRef = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
    opacity: 0,
  });

  useEffect(() => {
    animateNavbarIn(navbarRef.current);
  }, []);

  // Update indicator to active item on mount and route change
  useEffect(() => {
    updateIndicatorToActive();
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // Get the index of the currently active nav item
  const getActiveIndex = () => {
    if (isActive("/home")) return 0;
    if (isActive("/mynetwork")) return 1;
    if (isActive("/work")) return 2;
    if (location.pathname.startsWith("/courses")) return 3;
    return -1; // No active item (e.g., on profile page)
  };

  // Update indicator to the active item position
  const updateIndicatorToActive = () => {
    const activeIndex = getActiveIndex();
    if (activeIndex >= 0) {
      const navItem = navItemsRef.current[activeIndex];
      if (navItem) {
        const { offsetLeft, offsetWidth } = navItem;
        setIndicatorStyle({
          width: offsetWidth,
          left: offsetLeft,
          opacity: 1,
        });
      }
    } else {
      // No active item in main nav, hide the indicator
      setIndicatorStyle((prev) => ({
        ...prev,
        opacity: 0,
      }));
    }
  };

  const handleMouseEnter = (index) => {
    const navItem = navItemsRef.current[index];
    if (navItem) {
      const { offsetLeft, offsetWidth } = navItem;
      setIndicatorStyle({
        width: offsetWidth,
        left: offsetLeft,
        opacity: 1,
      });
    }
  };

  const handleMouseLeave = () => {
    // Return to active item instead of hiding
    updateIndicatorToActive();
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-left">
        <Connectimi_logo />
        <div className="search-bar">
          <Icon name="search" className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

      <div className="navbar-center" onMouseLeave={handleMouseLeave}>
        <div
          ref={(el) => (navItemsRef.current[0] = el)}
          className={`nav-item ${isActive("/home") ? "active" : ""}`}
          onClick={() => navigate("/home")}
          onMouseEnter={() => handleMouseEnter(0)}
        >
          <div className="nav-icon">
            <Icon name="home" />
          </div>
          <span className="nav-label">Home</span>
        </div>

        <div
          ref={(el) => (navItemsRef.current[1] = el)}
          className={`nav-item ${isActive("/mynetwork") ? "active" : ""}`}
          onClick={() => navigate("/mynetwork")}
          onMouseEnter={() => handleMouseEnter(1)}
        >
          <div className="nav-icon">
            <Icon name="user-friends" />
          </div>
          <span className="nav-label">My Connection</span>
        </div>

        <div
          ref={(el) => (navItemsRef.current[2] = el)}
          className={`nav-item ${isActive("/work") ? "active" : ""}`}
          onClick={() => navigate("/work")}
          onMouseEnter={() => handleMouseEnter(2)}
        >
          <div className="nav-icon">
            <Icon name="briefcase" />
          </div>
          <span className="nav-label">Work</span>
        </div>
        <div
          ref={(el) => (navItemsRef.current[3] = el)}
          className={`nav-item ${location.pathname.startsWith("/courses") ? "active" : ""}`}
          onClick={() => navigate("/courses")}
          onMouseEnter={() => handleMouseEnter(3)}
        >
          <div className="nav-icon">
            <Icon name="course" />
          </div>
          <span className="nav-label">Courses</span>
        </div>

        <div
          ref={(el) => (navItemsRef.current[4] = el)}
          className="nav-item me-dropdown"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onMouseEnter={() => handleMouseEnter(4)}
        >
          <div className="nav-icon">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Me"
              role="professional"
              size={24}
              className="nav-profile-img"
            />
            <div className="nav-icon-badge">3</div>
          </div>
          <span className="nav-label">Me</span>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                View Profile
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/notifications")}
              >
                <Icon name="bell" />
                Notifications
                <span className="dropdown-badge">3 New</span>
              </div>
              <div className="dropdown-item" onClick={toggleTheme}>
                <Icon name={theme === "dark" ? "sun" : "moon"} />
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </div>
              <div
                className="dropdown-item signout-item"
                onClick={() => navigate("/")}
              >
                Sign Out
              </div>
            </div>
          )}
        </div>

        {/* Animated Mouse-Following Indicator */}
        <div
          className="mouse-indicator"
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`,
            opacity: indicatorStyle.opacity,
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
