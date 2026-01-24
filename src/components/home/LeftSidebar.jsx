import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import Icon from "../Icon";

const LeftSidebar = () => {
  const navigate = useNavigate();

  const user = {
    name: "Alex Johnson",
    role: "Senior Software Engineer",
    company: "TechCorp",
    stack: "React • TypeScript • Engineer",
    location: "San Francisco",
    connections: "200+",
  };

  return (
    <aside className="left-sidebar-panel">
      {/* Profile Header Section */}
      <div className="sidebar-section profile-section">
        <div className="profile-header-row">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            size={60}
            className="sidebar-profile-avatar"
          />
          <div className="sidebar-profile-info">
            <h3
              className="sidebar-profile-name"
              onClick={() => navigate("/profile")}
            >
              {user.name}
            </h3>
            <p className="sidebar-profile-role">
              {user.role}{" "}
              <span className="highlight-text">@{user.company}</span>
            </p>
            <p className="sidebar-profile-sub">{user.stack}</p>
          </div>
        </div>
      </div>

      <div className="left-sidebar-details">
        {/* <div className="sidebar-divider"></div> */}

        {/* Profile Analytics Section */}
        <div className="sidebar-section analytics-section">
          <h4 className="sidebar-title">Profile Analytics</h4>
          <div className="stats-list">
            <div className="stat-row">
              <span>Profile View</span>
              <span className="stat-value">883</span>
            </div>
            <div className="stat-row">
              <span>Post Interactions</span>
              <span className="stat-value">1.22M</span>
            </div>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        {/* Resources Section */}
        <div className="sidebar-section resources-section">
          <h4 className="sidebar-title">Resources</h4>
          <div className="stats-list">
            <div className="stat-row">
              <span>Post Impressions</span>
              <span className="stat-value">3299</span>
            </div>
            <div className="stat-row">
              <span>Profile apppearances</span>
              <span className="stat-value">99</span>
            </div>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        {/* Mentorship Section */}
        <div className="sidebar-section mentorship-section">
          <h4 className="sidebar-title">Mentorship Opportunities</h4>
          <div className="mentorship-content">
            <div className="mentorship-row">
              <span>Webinar on Next.js</span>
              <span className="mentorship-val">$345.99</span>
            </div>
            <div className="mentorship-row">
              <span>Skils: Next.js + React + TypeScript</span>
            </div>
          </div>
          <div className="mentorship-footer">
            <span>Do a Confirmation</span>
            <Icon name="arrow-right" size={14} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
