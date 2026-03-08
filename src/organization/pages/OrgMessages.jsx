import React from 'react';
import Messaging from '../../pages/Messaging';
import './OrgPages.css';

const OrgMessages = () => {
    return (
        <div className="org-page-container">
            <div className="org-glass-card full-height">
                <Messaging embedded={true} />
            </div>
        </div>
    );
};

export default OrgMessages;
