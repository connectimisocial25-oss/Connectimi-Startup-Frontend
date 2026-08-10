import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Landing.css';
import Connectimi_logo from '../components/Connectimi_logo';
import { LoginForm } from './Login';
import { SignupForm } from './Signup';
import { FiDownload } from 'react-icons/fi';
import { 
    FiTerminal, 
    FiMessageSquare, 
    FiUsers, 
    FiUserCheck, 
    FiBriefcase, 
    FiShare2, 
    FiAward, 
    FiX, 
    FiCheck 
} from 'react-icons/fi';
import DownloadAppModal from '../components/DownloadAppModal';

const Landing = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        // 1. Check standalone / installation state
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        const isLocalInstalled = localStorage.getItem('connectimi_app_installed') === 'true';
        
        if (isStandalone || isLocalInstalled) {
            setIsInstalled(true);
        }

        // 2. Pick up prompt from main.jsx if available
        if (window.__deferredPrompt) {
            setDeferredPrompt(window.__deferredPrompt);
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            window.__deferredPrompt = e;
            setDeferredPrompt(e);
        };
        
        const handlePromptReady = () => {
            if (window.__deferredPrompt) {
                setDeferredPrompt(window.__deferredPrompt);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('pwa-prompt-ready', handlePromptReady);

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            window.__deferredPrompt = null;
            localStorage.setItem('connectimi_app_installed', 'true');
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        // GSAP Hero Entry Animation
        const tl = gsap.timeline();
        if (leftPanelRef.current) {
            tl.fromTo(leftPanelRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
            );
        }
        if (rightPanelRef.current) {
            tl.fromTo(rightPanelRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
                "-=0.6"
            );
        }

        // IntersectionObserver for subtle scroll reveal
        const reveals = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('pwa-prompt-ready', handlePromptReady);
            window.removeEventListener('appinstalled', handleAppInstalled);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(formRef.current,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [isLogin]);

    const handleSuccessfulInstall = () => {
        setIsInstalled(true);
        localStorage.setItem('connectimi_app_installed', 'true');
    };

    const scrollToAuth = (showSignUp = false) => {
        if (showSignUp) {
            setIsLogin(false);
        }
        if (rightPanelRef.current) {
            const yOffset = -100;
            const element = rightPanelRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-page-wrapper">
            {/* Background Ambient Glow Blobs */}
            <div className="landing-bg-blobs">
                <div className="blob blob-emerald"></div>
                <div className="blob blob-blue"></div>
            </div>

            {/* Sticky Navigation Bar */}
            <header className="landing-header">
                <div className="header-container">
                    <div className="brand-logo flex-center">
                        <Connectimi_logo />
                    </div>
                    <nav className="header-nav">
                        <a href="#product-features" className="nav-link">Platform</a>
                        <a href="#tier23-impact" className="nav-link">Tier 2/3 Talent</a>
                        <a href="#why-join" className="nav-link">Why Connectimi</a>
                        <a href="#team" className="nav-link">Team</a>
                    </nav>
                    <div className="header-cta flex-center">
                        {!isInstalled && (
                            <button className="download-pill-btn" onClick={() => setIsModalOpen(true)}>
                                <FiDownload />
                                <span>Install App</span>
                            </button>
                        )}
                        <button className="btn-emerald-sm" onClick={() => scrollToAuth(true)}>
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="landing-main-content">
                {/* 1. HERO SECTION (Split View) */}
                <section className="hero-section">
                    <div className="hero-left" ref={leftPanelRef}>
                        <div className="badge-pill">
                            <span className="badge-pulse"></span>
                            <span>🚀 OVER 10,000+ STUDENTS JOINED</span>
                        </div>
                        <h1 className="hero-title">
                            Stop Sending Resumes into the LinkedIn Void. <br />
                            <span className="text-gradient">Get Discovered Directly.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Where Ambition Meets Unfair Opportunity. The exclusive platform for Tier 2 &amp; Tier 3 college students to build, connect, and get discovered.
                        </p>

                        <div className="hero-actions">
                            <button className="shimmer-btn-lg" onClick={() => scrollToAuth(true)}>
                                Enter the Graph →
                            </button>
                            <div className="social-proof-stack">
                                <div className="avatar-group">
                                    <div className="avatar-circle av-1"></div>
                                    <div className="avatar-circle av-2"></div>
                                    <div className="avatar-circle av-3"></div>
                                    <div className="avatar-circle av-more">+10k</div>
                                </div>
                                <span className="proof-text">Join ambitious builders</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-right" ref={rightPanelRef}>
                        <div className="landing-auth-wrapper">
                            <div className="auth-card-glass" ref={formRef}>
                                <div className="auth-tabs">
                                    <button
                                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                                        onClick={() => setIsLogin(true)}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                                        onClick={() => setIsLogin(false)}
                                    >
                                        Join Now
                                    </button>
                                </div>

                                <div className="auth-header-minimal">
                                    <h2>{isLogin ? 'Welcome Back' : 'Create Free Account'}</h2>
                                    <p>{isLogin ? 'Enter your credentials to access your world.' : 'Claim your profile and start getting discovered.'}</p>
                                </div>

                                {isLogin ? (
                                    <LoginForm compact />
                                ) : (
                                    <SignupForm compact />
                                )}

                                <div className="auth-footer-minimal">
                                    <p>
                                        By continuing, you agree to our
                                        <span className="link-span"> Terms of Service</span> and
                                        <span className="link-span"> Privacy Policy</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. PRODUCT DESCRIPTION */}
                <section id="product-features" className="section-block reveal-on-scroll">
                    <div className="section-header text-center">
                        <h2 className="section-title">
                            Not Just Another Social Feed. <span className="text-gradient">Your Career Launchpad.</span>
                        </h2>
                        <p className="section-subtitle">
                            We are an ecosystem engineered to highlight actual skills, live repos, and proof of work over college pedigree.
                        </p>
                    </div>

                    <div className="grid-3-col">
                        <div className="glass-card feature-card">
                            <div className="card-icon-box">
                                <FiTerminal className="card-icon" />
                            </div>
                            <h3>Project Showcase</h3>
                            <p>Showcase proof of work, not just bullet points. Your live projects speak louder than paper resumes.</p>
                        </div>

                        <div className="glass-card feature-card featured-glow">
                            <div className="card-icon-box">
                                <FiMessageSquare className="card-icon" />
                            </div>
                            <h3>Direct Founder Ping</h3>
                            <p>Skip the middleman HR filter. Connect directly with founders and hiring teams actively looking for talent.</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="card-icon-box">
                                <FiUsers className="card-icon" />
                            </div>
                            <h3>Peer-to-Peer Cohorts</h3>
                            <p>Join ambitious builders. Find co-founders, mentors, and project collaborators in specialized cohorts.</p>
                        </div>
                    </div>
                </section>

                {/* 3. TIER 2 & TIER 3 SPOTLIGHT & IMPACT */}
                <section id="tier23-impact" className="section-block reveal-on-scroll">
                    <div className="glass-card hero-impact-card">
                        <div className="impact-glow-overlay"></div>
                        <h2 className="impact-headline">
                            Talent is everywhere. <br />
                            <span className="text-gradient">On-campus placement visits are not.</span>
                        </h2>
                        <p className="impact-subtext">
                            Top companies miss brilliant minds from non-metro campuses. Connectimi bridges that gap by putting your actual work directly in front of employers.
                        </p>

                        <div className="impact-stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">10k+</span>
                                <span className="stat-label">ACTIVE STUDENTS</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">HIRING STARTUPS</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">2.5k</span>
                                <span className="stat-label">PROJECTS SHIPPED</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. WHY MAKE AN ACCOUNT / UNFAIR ADVANTAGE GRID */}
                <section id="why-join" className="section-block reveal-on-scroll">
                    <div className="section-header text-center">
                        <h2 className="section-title">Your Unfair Advantage</h2>
                        <p className="section-subtitle">What you unlock the moment you create a free Connectimi account.</p>
                    </div>

                    <div className="grid-4-col">
                        <div className="glass-card advantage-card">
                            <FiUserCheck className="adv-icon" />
                            <h3>Instant Portfolio</h3>
                            <p>Auto-generated live developer and creator page ready to share everywhere.</p>
                        </div>
                        <div className="glass-card advantage-card">
                            <FiBriefcase className="adv-icon" />
                            <h3>Hidden Gig Board</h3>
                            <p>Access unlisted startup opportunities, freelance gigs, and project bounties.</p>
                        </div>
                        <div className="glass-card advantage-card">
                            <FiShare2 className="adv-icon" />
                            <h3>Network with 10k+</h3>
                            <p>Connect with high-intent peers across Tier 1, 2, &amp; 3 institutions in India.</p>
                        </div>
                        <div className="glass-card advantage-card">
                            <FiAward className="adv-icon" />
                            <h3>Skill Badges</h3>
                            <p>Earn verified proof of work badges that showcase your tech stack mastery.</p>
                        </div>
                    </div>
                </section>

                {/* 5. COMPARISON SECTION */}
                <section className="section-block reveal-on-scroll">
                    <div className="comparison-grid">
                        <div className="glass-card comparison-card traditional-card">
                            <h3 className="comp-title text-muted">Traditional Job Platforms</h3>
                            <ul className="comp-list">
                                <li><FiX className="icon-cross" /> HR Ghosting &amp; black hole resumes</li>
                                <li><FiX className="icon-cross" /> Endless feed noise &amp; humblebrags</li>
                                <li><FiX className="icon-cross" /> Pedigree &amp; Tier-1 college bias</li>
                            </ul>
                        </div>

                        <div className="glass-card comparison-card connectimi-card">
                            <div className="verified-badge">VERIFIED SOLUTION</div>
                            <h3 className="comp-title text-emerald">Connectimi</h3>
                            <ul className="comp-list">
                                <li><FiCheck className="icon-check" /> Direct Founder &amp; Manager Access</li>
                                <li><FiCheck className="icon-check" /> 100% Proof-of-Work focused</li>
                                <li><FiCheck className="icon-check" /> Skill-first matching for Tier 2/3 talent</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 6. MEET THE TEAM */}
                <section id="team" className="section-block reveal-on-scroll">
                    <div className="section-header text-center">
                        <h2 className="section-title">Meet the Team</h2>
                        <p className="section-subtitle">Built by builders who experienced the Tier 2 &amp; 3 placement gap firsthand.</p>
                    </div>

                    <div className="grid-4-col">
                        <div className="glass-card team-card">
                            <div className="team-avatar-box">
                                <img src="/images/Animesh.jpeg" alt="Animesh - CTO" className="team-avatar-img" />
                            </div>
                            <h3>Animesh</h3>
                            <span className="team-role">CTO</span>
                            <p className="team-bio">Leading tech architecture &amp; engineering innovation.</p>
                        </div>

                        <div className="glass-card team-card">
                            <div className="team-avatar-box">
                                <img src="/images/Suroj.jpeg" alt="Suroj - Developer" className="team-avatar-img" />
                            </div>
                            <h3>Suroj</h3>
                            <span className="team-role">Developer</span>
                            <p className="team-bio">Crafting real-time features &amp; interactive UI experiences.</p>
                        </div>

                        <div className="glass-card team-card">
                            <div className="team-avatar-box">
                                <img src="/images/Sanniv.jpeg" alt="Sanniv - Developer" className="team-avatar-img" />
                            </div>
                            <h3>Sanniv</h3>
                            <span className="team-role">Developer</span>
                            <p className="team-bio">Full-stack developer building core platform systems.</p>
                        </div>

                        <div className="glass-card team-card">
                            <div className="team-avatar-box">
                                <img src="/images/Arnab.png" alt="Arnab - Developer" className="team-avatar-img" />
                            </div>
                            <h3>Arnab</h3>
                            <span className="team-role">Developer</span>
                            <p className="team-bio">Engineering backend scalability &amp; performance optimizations.</p>
                        </div>
                    </div>
                </section>

                {/* 7. FINAL HIGH-CONVERSION CTA */}
                <section className="section-block final-cta-section reveal-on-scroll">
                    <div className="glass-card final-cta-card text-center">
                        <div className="cta-glow"></div>
                        <h2>Stop Waiting. Start Building.</h2>
                        <p>Join 10,000+ ambitious students taking control of their careers.</p>
                        <button className="shimmer-btn-lg" onClick={() => scrollToAuth(true)}>
                            Claim Your Profile Now
                        </button>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <span className="footer-logo">Connectimi</span>
                    </div>
                    <div className="footer-links">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#contact">Contact Us</a>
                    </div>
                    <div className="footer-copy">
                        © 2026 Connectimi. All rights reserved.
                    </div>
                </div>
            </footer>

            <DownloadAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                deferredPrompt={deferredPrompt}
                onSuccessfulInstall={handleSuccessfulInstall}
            />
        </div>
    );
};

export default Landing;
