import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { useAuth } from "../../context/AuthContext";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const user = authUser || JSON.parse(localStorage.getItem("connectimi_user") || "null");


  return (
    <aside className="left-sidebar-panel">
      {/* Profile Header Section */}
      <div className="sidebar-section profile-section">
        <div className="profile-header-row">
          <Avatar
            src={`${user.profileImage}`}
            size={60}
            className="sidebar-profile-avatar"
          />
          <div className="sidebar-profile-info">
            <h3
              className="sidebar-profile-name"
              onClick={() => navigate("/profile")}
            >
              {`${user.firstName} ${user.lastName}`}
            </h3>
            <p className="sidebar-profile-role">
              {user.headline}
            </p>
            {/* <p className="highlight-text" style={{ fontSize: '12px' }}>@{user.company}</p> */}
            <p className="sidebar-profile-sub">
              {user.skills?.slice(0, 3).join(" • ")}
            </p>
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
