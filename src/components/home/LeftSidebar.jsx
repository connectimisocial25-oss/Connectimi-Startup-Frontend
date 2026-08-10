import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import { useAuth } from "../../context/AuthContext";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const user = authUser || JSON.parse(localStorage.getItem("connectimi_user") || "null");

  if (!user) {
    return null;
  }

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
    </aside>
  );
};

export default LeftSidebar;
