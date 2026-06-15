import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Icon from "./Icon";
import "./ComingSoon.css";

/**
 * ComingSoon
 * Glassmorphism placeholder shown for pages/tabs whose backend is not
 * yet implemented. Drop this in place of the page/tab content.
 *
 * Props:
 *   icon  — Icon name from the Icon component (default: "clock")
 *   title — Heading text (default: "Coming Soon")
 *   text  — Supporting description text
 */
const ComingSoon = ({
    icon = "clock",
    title = "Coming Soon",
    text = "We're working hard to bring this feature to life. Stay tuned — it'll be available in a future update.",
}) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { y: 24, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    return (
        <div className="coming-soon-wrapper">
            <div className="coming-soon-card" ref={cardRef}>
                <div className="coming-soon-icon">
                    <Icon name={icon} size={32} />
                </div>
                <h2 className="coming-soon-title">{title}</h2>
                <p className="coming-soon-text">{text}</p>
                <span className="coming-soon-badge">In Development</span>
            </div>
        </div>
    );
};

export default ComingSoon;