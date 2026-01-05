import React from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/home/LeftSidebar';
import Feed from '../components/home/Feed';
import RightSidebar from '../components/home/RightSidebar';
import '../components/home/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content-grid">
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
