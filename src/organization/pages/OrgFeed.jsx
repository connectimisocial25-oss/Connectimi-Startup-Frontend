import React from 'react';
import Feed from '../../components/home/Feed';
import './OrgPages.css';

const OrgFeed = () => {
    return (
        <div className="org-page-container">
            <div className="org-glass-card fade-in">
                <Feed />
            </div>
        </div>
    );
};

export default OrgFeed;
