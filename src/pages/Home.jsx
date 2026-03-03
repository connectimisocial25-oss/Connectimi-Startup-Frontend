import React, { useEffect, useRef } from 'react';
import LeftSidebar from '../components/home/LeftSidebar';
import Feed from '../components/home/Feed';
import '../components/home/Home.css';
import { gsap } from 'gsap';

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.home-content-grid > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        clearProps: 'all'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="home-container" ref={containerRef}>
      <div className="home-content-grid">
        <LeftSidebar />
        <Feed />
      </div>
    </div>
  );
};

export default Home;
