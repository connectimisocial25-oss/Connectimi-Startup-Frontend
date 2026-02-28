import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Landing.css';
import Icon from '../components/Icon';
import Connectimi_logo from '../components/Connectimi_logo';
import { LoginForm } from './Login';
import { SignupForm } from './Signup';

const Landing = () => {
    const [isLogin, setIsLogin] = useState(true);

    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(leftPanelRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power4.out' }
        );
        tl.fromTo(rightPanelRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power4.out' },
            "-=0.8"
        );
    }, []);

    useEffect(() => {
        gsap.fromTo(formRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
    }, [isLogin]);

    return (
        <div className="landing-container">
            {/* Left Panel: Inspiration */}
            <div className="landing-left" ref={leftPanelRef}>
                <div className="landing-content">
                    <div className="landing-logo-container">
                        <Connectimi_logo />
                    </div>
                    <h1 className="landing-title">
                        Where <span className="text-gradient">Ambition</span> <br />
                        Meets <span className="text-gradient">Opportunity</span>.
                    </h1>
                    <p className="landing-subtitle">
                        The exclusive platform for students and creative professionals to build,
                        share, and connect with purpose.
                    </p>

                    <div className="landing-features">
                        <div className="feature-item">
                            <div className="feature-icon"><Icon name="trending-up" /></div>
                            <div className="feature-text">
                                <h4>Growth Driven</h4>
                                <p>Accelerate your career with curated insights.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><Icon name="user-friends" /></div>
                            <div className="feature-text">
                                <h4>Elite Network</h4>
                                <p>Connect with industry leaders and peers.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="landing-bg-decoration">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </div>

            {/* Right Panel: Auth */}
            <div className="landing-right" ref={rightPanelRef}>
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
                        <h2>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
                        <p>{isLogin ? 'Enter your credentials to access your world.' : 'Create your account to start your journey.'}</p>
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
    );
};

export default Landing;
