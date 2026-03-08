import React from 'react';
import Notifications from '../../pages/Notifications';
import './OrgPages.css';

const OrgAlerts = () => {
    return (
        <div className="org-page-container">
            <div className="org-glass-card full-height">
                <Notifications embedded={true} />
            </div>
        </div>
    );
};

export default OrgAlerts;
