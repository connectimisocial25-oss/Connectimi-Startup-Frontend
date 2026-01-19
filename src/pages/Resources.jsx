import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import './Resources.css';

const Resources = () => {
    const navigate = useNavigate();

    // Mock Data representing the tree structure
    // Level 1: Micro Projects (Foundation)
    // Level 2: Medium Projects (Integration)
    // Level 3: Capstone/Advanced (Mastery)

    const treeData = [
        {
            level: 1,
            title: "Foundation: Micro Projects",
            nodes: [
                { id: 'web-basics', title: "HTML/CSS Builder", type: "micro", desc: "Build a static landing page component.", status: "Unlocked" },
                { id: 'js-logic', title: "JS Logic calculator", type: "micro", desc: "Create a functional calculator with JS.", status: "Unlocked" },
                { id: 'react-intro', title: "React To-Do List", type: "micro", desc: "Simple state management app.", status: "Unlocked" }
            ]
        },
        {
            level: 2,
            title: "Integration: Medium Projects",
            nodes: [
                { id: 'weather-app', title: "Weather Dashboard", type: "medium", desc: "Fetch API data and visualize it.", status: "Locked" },
                { id: 'e-commerce-ui', title: "E-Commerce UI", type: "medium", desc: "Product grid with cart functionality.", status: "Locked" }
            ]
        },
        {
            level: 3,
            title: "Mastery: Capstone Project",
            nodes: [
                { id: 'full-stack-social', title: "Social Network Platform", type: "capstone", desc: "Full MERN stack application with auth.", status: "Locked" }
            ]
        }
    ];

    const handleNodeClick = (nodeId) => {
        navigate(`/resources/${nodeId}`);
    };

    return (
        <div className="resources-container">
            <header className="resources-header">
                <h1>Developer Roadmap</h1>
                <p>Master skills by building from Micro-projects to Full-scale Applications.</p>
            </header>

            <div className="roadmap-tree">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem', width: '100%' }}>

                    {treeData.map((level, index) => (
                        <div key={index} className="tree-level-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="level-label" style={{ marginBottom: '1.5rem', fontWeight: 'bold', color: '#888' }}>
                                {level.title}
                            </div>

                            <div className="tree-level">
                                {level.nodes.map(node => (
                                    <div
                                        key={node.id}
                                        className={`tree-node ${node.status === 'Locked' ? 'locked' : ''}`}
                                        onClick={() => handleNodeClick(node.id)}
                                    >
                                        <span className={`node-type type-${node.type}`}>{node.type} Project</span>
                                        <h3 className="node-title">{node.title}</h3>
                                        <p className="node-desc">{node.desc}</p>
                                        <div className="node-status">
                                            {node.status === 'Locked' ? <Icon name="lock" size={14} /> : <Icon name="check-circle" size={14} color="#83f28f" />}
                                            {node.status}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Vertical Connector to next level */}
                            {index < treeData.length - 1 && (
                                <div className="level-connector" style={{
                                    width: '2px',
                                    height: '4rem',
                                    backgroundColor: 'var(--border-color)',
                                    margin: '-2rem 0 -2rem 0',
                                    zIndex: 0
                                }}></div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Resources;
