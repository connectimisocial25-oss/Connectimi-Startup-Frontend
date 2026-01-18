import React from 'react';
import Icon from '../Icon';
import Avatar from '../Avatar';

const RightSidebar = () => {
    const opportunities = [
        {
            id: 1,
            role: 'Design Lead @ InnovateX',
            desc: '1-click apply',
            img: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            type: 'featured'
        },
        {
            id: 2,
            name: 'Design Code bout',
            detail: 'Hardot Matt Open',
            connections: '5 mutual connections',
            img: 'https://i.pravatar.cc/150?u=designcode',
            type: 'person'
        },
        {
            id: 3,
            name: 'Phild Robertas',
            detail: 'Mt Sogimon at Open',
            img: 'https://i.pravatar.cc/150?u=phild',
            type: 'person'
        },
        {
            id: 4,
            name: 'Design Cognst lows',
            detail: 'Reapont dhasrdse Srtonen',
            connections: '3 mutual connections',
            img: 'https://i.pravatar.cc/150?u=cognt',
            type: 'person'
        },
        {
            id: 5,
            name: 'Dode Gogaentioed',
            detail: 'Hype Etus Dse',
            img: 'https://i.pravatar.cc/150?u=dode',
            type: 'person'
        }
    ];

    return (
        <aside className="right-sidebar-panel">
            <div className="sidebar-section">
                <h4 className="rail-title">MICRO OPPORTUNITY RAIL</h4>
            </div>

            {/* Featured Opportunity Card */}
            <div className="featured-section">
                <div className="featured-header">
                    <h3>Design Lead @ InnovateX</h3>
                    <span className="apply-tag">1-click apply</span>
                </div>

                <div className="featured-content">
                    <Avatar src={opportunities[0].img} size={32} />
                    <div className="featured-text">
                        <p>Jerald Harrison</p>
                        <p className="sub-text">| Open to remote</p>
                    </div>
                </div>

                <div className="featured-actions">
                    <button className="btn-coffee">Coffee Chat</button>
                </div>
            </div>

            <div className="sidebar-section">
                <h4 className="rail-title" style={{ marginTop: '20px' }}>MICRO OPPORTUNITY RAIL</h4>

                {/* List of People/Opportunities */}
                <div className="opp-list">
                    {opportunities.slice(1).map(opp => (
                        <div key={opp.id} className="person-row">
                            <div className="person-row-main">
                                <Avatar src={opp.img} size={40} />
                                <div className="person-info">
                                    <h5>{opp.name}</h5>
                                    <p>{opp.detail}</p>
                                </div>
                                <button className="btn-connect-pill">Connect</button>
                            </div>
                            {opp.connections && (
                                <div className="mutual-text">{opp.connections}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    );
};

export default RightSidebar;
