import React from 'react';
import { Outlet } from 'react-router-dom';
import OrganizationNavbar from './components/OrganizationNavbar';

const OrganizationLayout = () => {
    return (
        <div className="organization-layout">
            <OrganizationNavbar />
            <div className="organization-content" style={{ paddingTop: '80px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default OrganizationLayout;
