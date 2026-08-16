import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Landing.css';
import Connectimi_logo from '../components/Connectimi_logo';
import { LoginForm } from './Login';
import { SignupForm } from './Signup';
import {
    FiDownload, FiSun, FiMoon, FiFileText, FiLink2,
    FiLayers, FiImage, FiAward,
} from 'react-icons/fi';
import DownloadAppModal from '../components/DownloadAppModal';
import { useTheme } from '../context/ThemeContext';

/* ---------------------------------------------------------------------------
   Content lives up here so the copy is editable without reading JSX.

   Rule this page is written under: every claim below is something the codebase
   can actually back up. An earlier version advertised skill badges, a gig board
   and peer cohorts — none of which exist in this repo — plus three invented
   statistics. If you add a claim here, make sure the product does it first.
   ------------------------------------------------------------------------- */

// A stand-in profile for the hero animation. Deliberately a person, not a chart.
const SCAN_LINES = [
    { key: 'Advocate', val: 'Aarav Sharma', kind: 'identity' },
    { key: 'Degree', val: 'B.A. LL.B (Hons.) · 2026', kind: 'credential' },
    { key: 'College', val: 'Regional Law College · Non-NLU', kind: 'cut', tag: 'Cut' },
    { key: 'Rank', val: 'First Class · Bar Council Enrolled', kind: 'credential' },
    { key: 'Showcase', val: '3 Constitutional Briefs & PIL Drafts', kind: 'work', tag: 'Read' },
    { key: 'Domain', val: 'Art. 21 · Criminal Writs · High Court PIL · ADR', kind: 'work', tag: 'Read' },
    { key: 'Analysis', val: 'Judicial precedent critique & statutory ratio', kind: 'work', tag: 'Read' },
];

// The gates traditional chambers and law firms often apply. `id` maps to a checkbox.
const GATES = [
    { id: 'tier', rule: 'Tier-1 National Law University (NLU) only', you: 'I attend a top-tier NLU' },
    { id: 'rank', rule: 'Top 5% batch rank requirement', you: 'I am in the top 5% of my law class' },
    { id: 'legacy', rule: 'Chamber references / Family legacy', you: 'I have senior advocate connections' },
    { id: 'moot', rule: 'National Moot Court Winner trophy', you: 'I have won national/international moots' },
    { id: 'intern', rule: 'Tier-1 corporate law firm internship', you: "I've interned at Tier-1 law firms" },
];

// The five steps of the real showcase wizard, in order — src/pages/ProjectCreate.jsx
const WIZARD = [
    { name: 'Case & Brief Info', icon: FiFileText, fields: 'Title of your legal brief, case commentary, or constitutional analysis.' },
    { name: 'Citations & Sources', icon: FiLink2, fields: 'Links to judgment citations, legal research, or repository drafts.' },
    {
        name: 'Domain & Statutes', icon: FiLayers,
        fields: 'Legal domain, relevant constitutional articles, and statutory provisions.',
        enums: ['constitutional', 'criminal-law', 'civil-litigation', 'pil', 'moot-court', 'corporate-law', 'cyber-law', 'human-rights'],
    },
    { name: 'Documents & Briefs', icon: FiImage, fields: 'Up to three exhibits, draft snapshots, or cover graphics.' },
    { name: 'Key Arguments', icon: FiAward, fields: 'Core legal propositions, ratio decidendi, and constitutional learnings.' },
];

const SHIPPED = [
    { t: 'Legal & Case Showcase', d: 'The five-step wizard, judgment links, document previews, and a public page per brief.' },
    { t: 'Legal Discourse Feed', d: 'Constitutional arguments, case analysis, discussions, and peer commentary.' },
    { t: 'Legal Fraternity Network', d: 'Connect with fellow law students, advocates, chambers, and jurists.' },
    { t: 'Real-Time Messaging', d: 'Legal consultation, case discussions, typing indicators, and unread counts.' },
    { t: 'Live Notifications', d: 'Citations, peer commentary, connection requests, and discussion updates.' },
    { t: 'Advocate Profile & CV', d: 'Practice areas, bar admissions, moot achievements, and printable CV.' },
    { t: 'Install as an App', d: 'Access legal briefs and discussions straight from your device home screen.' },
    { t: 'Chambers & Law Firms', d: 'A separate portal with campaigns, research catalogs, and firm branding.' },
];

const NOT_YET = [
    { t: 'Jobs and internships', d: 'The board is written. It is not switched on, so we are not going to pretend it is.' },
    { t: 'Courses for students', d: 'The roadmap view works. The catalog page in front of it does not yet.' },
    { t: 'Search', d: 'The box in the app header does nothing right now.' },
];

/* Voice check: these are real people. Edit their lines to sound like them —
   placeholder wording from us is worse than plain wording from them. */
const TEAM = [
    { name: 'Animesh', role: 'CTO', img: '/images/Animesh.jpeg', said: 'I own the architecture. If your conversation drops halfway through, that one is mine.' },
    { name: 'Suroj', role: 'Developer', img: '/images/Suroj.jpeg', said: 'I build the parts you actually touch — the feed and the chat, the things that have to feel instant.' },
    { name: 'Sanniv', role: 'Developer', img: '/images/Sanniv.jpeg', said: 'Full stack. Most of the project showcase is mine, including the wizard you are about to fill in.' },
    { name: 'Arnab', role: 'Developer', img: '/images/Arnab.png', said: 'Backend and performance. I care about the queries nobody ever sees.' },
];

const Landing = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Both of these are synchronous browser reads, so they seed state directly
    // rather than being set from an effect on the first render.
    const [isInstalled, setIsInstalled] = useState(() =>
        Boolean(
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone ||
            localStorage.getItem('connectimi_app_installed') === 'true'
        )
    );
    const [deferredPrompt, setDeferredPrompt] = useState(() => window.__deferredPrompt || null);

    // Which way the hero card is being read: 'scan' = recruiter, 'read' = here.
    // Anyone who asked for reduced motion starts on the second pass and stays.
    const [pass, setPass] = useState(() =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'read' : 'scan'
    );
    const [met, setMet] = useState({ clear: true });

    const headerRef = useRef(null);
    const heroRef = useRef(null);
    const authRef = useRef(null);
    const scanBodyRef = useRef(null);
    const sweepRef = useRef(null);

    const { theme, toggleTheme } = useTheme() || {};
    const cutCount = GATES.filter((g) => !met[g.id]).length;

    /* --- PWA install state (unchanged behaviour, still driven by main.jsx) -- */
    useEffect(() => {
        const onBeforeInstall = (e) => {
            e.preventDefault();
            window.__deferredPrompt = e;
            setDeferredPrompt(e);
        };
        const onPromptReady = () => {
            if (window.__deferredPrompt) setDeferredPrompt(window.__deferredPrompt);
        };
        const onInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            window.__deferredPrompt = null;
            localStorage.setItem('connectimi_app_installed', 'true');
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstall);
        window.addEventListener('pwa-prompt-ready', onPromptReady);
        window.addEventListener('appinstalled', onInstalled);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('is-visible');
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
            window.removeEventListener('pwa-prompt-ready', onPromptReady);
            window.removeEventListener('appinstalled', onInstalled);
            observer.disconnect();
        };
    }, []);

    /* --- entrance, matching the rest of the app ----------------------------
       Navbar.jsx and every page view use the same signature: y offset in,
       0.8s, power3.out, 0.1–0.15 stagger. Skipped entirely under reduced
       motion so nothing is left stranded at opacity 0.
       --------------------------------------------------------------------- */
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.fromTo(headerRef.current,
                    { y: -100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
            }
            if (heroRef.current) {
                gsap.fromTo(heroRef.current.children,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });
            }
        });
        return () => ctx.revert();
    }, []);

    /* --- the six-second scan ----------------------------------------------
       Two passes on a loop. The first is fast and stops at the campus line;
       the second is slow and reads everything. GSAP only moves the sweep bar
       and flips `pass` — all the dimming and redaction is CSS, so there is one
       source of truth for how a pass looks.
       --------------------------------------------------------------------- */
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const sweep = sweepRef.current;
        const body = scanBodyRef.current;
        if (!sweep || !body) return;

        const travel = () => body.offsetHeight + 80;
        const tl = gsap.timeline({ repeat: -1, delay: 1 });

        tl.call(() => setPass('scan'))
            .set(sweep, { opacity: 1, y: -80 })
            .to(sweep, { y: travel, duration: 0.7, ease: 'none' })
            .set(sweep, { opacity: 0 })
            .to({}, { duration: 2.0 })
            .call(() => setPass('read'))
            .set(sweep, { opacity: 1, y: -80 })
            .to(sweep, { y: travel, duration: 1.6, ease: 'power1.inOut' })
            .set(sweep, { opacity: 0 })
            .to({}, { duration: 3.4 });

        return () => tl.kill();
    }, []);

    const goToAuth = (signUp = false) => {
        if (signUp) setIsLogin(false);
        const el = authRef.current;
        if (!el) return;
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.pageYOffset - 100,
            behavior: 'smooth',
        });
    };

    return (
        <div className="ln-page">
            <header className="ln-header" ref={headerRef}>
                <div className="ln-brand">
                    <Connectimi_logo />
                </div>

                <nav className="ln-nav">
                    <a href="#filter">The filter</a>
                    <a href="#index">What we index</a>
                    <a href="#log">Build log</a>
                    <a href="#team">Team</a>
                </nav>

                <div className="ln-header-cta">
                    <button
                        className="ln-icon-btn"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </button>
                    {!isInstalled && (
                        <button
                            className="ln-icon-btn"
                            onClick={() => setIsModalOpen(true)}
                            aria-label="Install Connectimi as an app"
                        >
                            <FiDownload />
                        </button>
                    )}
                    <button className="ln-btn" onClick={() => goToAuth(true)}>
                        Create account
                    </button>
                </div>
            </header>

            {/* ---------------------------------------------------------- HERO */}
            <section className="ln-shell ln-hero">
                <div ref={heroRef}>
                    <span className="ln-badge">For aspiring advocates & guardians of the Constitution</span>

                    <h1 className="ln-h1">
                        Legal brilliance is proven by argument & analysis. Not{' '}
                        <span className="ln-struck">where you studied</span>.
                    </h1>

                    <p className="ln-hero-sub">
                        Connectimi is where law students and advocates publish their work — constitutional
                        briefs, landmark case analyses, moot court memorials, and legal research.
                    </p>

                    <div className="ln-hero-actions">
                        <button className="ln-btn ln-btn-lg" onClick={() => goToAuth(true)}>
                            Create a free account
                        </button>
                        <button className="ln-btn ln-btn-lg ln-btn-ghost" onClick={() => goToAuth(false)}>
                            I already have one
                        </button>
                    </div>

                    <div className="ln-card ln-scan" data-pass={pass}>
                        <div className="ln-scan-head">
                            <span className="ln-scan-mode">
                                {pass === 'scan' ? 'Pedigree screening' : 'Read in full'}
                            </span>
                            <span className="ln-scan-timer">
                                {pass === 'scan' ? '6 sec' : 'No limit'}
                            </span>
                        </div>

                        <div className="ln-scan-body" ref={scanBodyRef}>
                            <div className="ln-scan-sweep" ref={sweepRef} aria-hidden="true" />
                            {SCAN_LINES.map((l) => (
                                <div className="ln-scan-line" data-kind={l.kind} key={l.key}>
                                    <span className="ln-scan-key">{l.key}</span>
                                    <span className="ln-scan-val">{l.val}</span>
                                    {l.tag && <span className="ln-scan-tag">{l.tag}</span>}
                                </div>
                            ))}
                        </div>

                        <p className="ln-scan-foot">
                            {pass === 'scan'
                                ? 'Screened out on line three. The four lines of constitutional analysis were never reached.'
                                : 'Nothing was screened out. Your legal research and constitutional arguments take center stage.'}
                        </p>
                    </div>

                    <p className="ln-hero-note">Aarav is an example. The pedigree bias in the legal profession is real.</p>
                </div>

                {/* ------------------------------------------------- AUTH PANEL */}
                <div className="ln-card ln-auth" ref={authRef}>
                    <div className="ln-auth-head">
                        <div className="ln-tabs">
                            <button
                                className={`ln-tab ${isLogin ? 'is-on' : ''}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Sign in
                            </button>
                            <button
                                className={`ln-tab ${!isLogin ? 'is-on' : ''}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Join
                            </button>
                        </div>
                        <h2>{isLogin ? 'Welcome back' : 'Free, and about a minute'}</h2>
                    </div>

                    {isLogin ? <LoginForm compact /> : <SignupForm compact />}

                    <p className="ln-auth-fine">
                        Creating an account means you accept the terms of service and the
                        privacy policy.
                    </p>
                </div>
            </section>

            {/* -------------------------------------------------------- FILTER */}
            <section id="filter" className="ln-shell ln-section reveal-on-scroll">
                <div className="ln-section-head">
                    <span className="ln-badge">The filter</span>
                    <h2 className="ln-h2">The rejection happens before anyone opens your work.</h2>
                    <p className="ln-lede">
                        These are the gates a campus placement process runs first. They are
                        applied by a spreadsheet, in a second, with no one reading. Tell it about
                        yourself and watch which ones close.
                    </p>
                </div>

                <div className="ln-filter">
                    <div className="ln-card ln-gates">
                        {GATES.map((g, i) => (
                            <div className="ln-gate" data-cut={!met[g.id]} key={g.id}>
                                <span className="ln-gate-n">{String(i + 1).padStart(2, '0')}</span>
                                <span className="ln-gate-text">{g.rule}</span>
                                <span className="ln-gate-mark">
                                    {met[g.id] ? 'Pass' : 'Filtered'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="ln-card ln-you">
                        <p className="ln-label">About you</p>
                        {GATES.map((g) => (
                            <label className="ln-check" key={g.id}>
                                <input
                                    type="checkbox"
                                    checked={!!met[g.id]}
                                    onChange={() => setMet((m) => ({ ...m, [g.id]: !m[g.id] }))}
                                />
                                <span>{g.you}</span>
                            </label>
                        ))}

                        <p className="ln-tally" data-clear={cutCount === 0} aria-live="polite">
                            <b>{cutCount}</b>
                            {cutCount === 0
                                ? 'gates close on you. You are the exception, and you already know it.'
                                : `of ${GATES.length} gates close before a human sees anything you built.`}
                        </p>
                    </div>
                </div>

                <p className="ln-verdict">
                    Connectimi removes the pedigree filter. There is no college-tier barrier on this platform,
                    no legacy gate — because we believe your legal research, constitutional analysis, and
                    advocacy speak for themselves.
                </p>
            </section>

            {/* --------------------------------------------------- WHAT WE INDEX */}
            <section id="index" className="ln-shell ln-section reveal-on-scroll">
                <div className="ln-section-head">
                    <span className="ln-badge">What we index</span>
                    <h2 className="ln-h2">This is the whole form. Nothing else is asked.</h2>
                    <p className="ln-lede">
                        Publishing a project takes five steps. Here they are in full, in order,
                        so you know exactly what you are signing up to write.
                    </p>
                </div>

                <div className="ln-steps">
                    {WIZARD.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div className="ln-card ln-card-hover ln-step" key={s.name}>
                                <span className="ln-step-icon"><Icon /></span>
                                <div>
                                    <span className="ln-step-n">Step {String(i + 1).padStart(2, '0')}</span>
                                    <span className="ln-step-name">{s.name}</span>
                                </div>
                                <div className="ln-step-fields">
                                    {s.fields}
                                    {s.enums && (
                                        <div className="ln-enum">
                                            {s.enums.map((e) => <span key={e}>{e}</span>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ----------------------------------------------------- BUILD LOG */}
            <section id="log" className="ln-shell ln-section reveal-on-scroll">
                <div className="ln-section-head">
                    <span className="ln-badge">Build log</span>
                    <h2 className="ln-h2">What works today, and what doesn&apos;t yet.</h2>
                    <p className="ln-lede">
                        Most landing pages list the roadmap as though it already shipped. Here is
                        the real split. The right column is short on purpose — we would rather
                        you find it here than find it after you sign up.
                    </p>
                </div>

                <div className="ln-log">
                    <div className="ln-card ln-log-col" data-state="live">
                        <h3>Working now</h3>
                        {SHIPPED.map((x) => (
                            <div className="ln-log-item" key={x.t}>
                                <i />
                                <span>{x.t}<small>{x.d}</small></span>
                            </div>
                        ))}
                    </div>

                    <div className="ln-card ln-log-col" data-state="soon">
                        <h3>Not finished</h3>
                        {NOT_YET.map((x) => (
                            <div className="ln-log-item" key={x.t}>
                                <i />
                                <span>{x.t}<small>{x.d}</small></span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------- TEAM */}
            <section id="team" className="ln-shell ln-section reveal-on-scroll">
                <div className="ln-section-head">
                    <span className="ln-badge">Who is building it</span>
                    <h2 className="ln-h2">Four people. You can tell which part is whose.</h2>
                </div>

                <div className="ln-team">
                    {TEAM.map((p) => (
                        <div className="ln-card ln-card-hover ln-person" key={p.name}>
                            <img src={p.img} alt="" loading="lazy" />
                            <div>
                                <div className="ln-person-name">{p.name}</div>
                                <div className="ln-person-role">{p.role}</div>
                                <p className="ln-person-said">{p.said}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --------------------------------------------------------- CLOSE */}
            <section className="ln-shell ln-section reveal-on-scroll">
                <div className="ln-card ln-close">
                    <div className="ln-close-glow" />
                    <h2 className="ln-h2">Publish your first legal brief. Let the fraternity read it.</h2>
                    <p>
                        An account is free and takes a minute. Publishing a constitutional analysis or
                        case commentary builds your legal reputation before your first court appearance.
                    </p>
                    <button className="ln-btn ln-btn-lg" onClick={() => goToAuth(true)}>
                        Create a free account
                    </button>
                </div>
            </section>

            <footer className="ln-footer">
                <div className="ln-footer-in">
                    {/* the same component the header uses, so the wordmark and its
                        font stay identical to the navbar without being restyled here */}
                    <div className="ln-brand">
                        <Connectimi_logo />
                    </div>
                    <div className="ln-footer-links">
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <span>© 2026 Connectimi</span>
                </div>
            </footer>

            <DownloadAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                deferredPrompt={deferredPrompt}
                onSuccessfulInstall={() => {
                    setIsInstalled(true);
                    localStorage.setItem('connectimi_app_installed', 'true');
                }}
            />
        </div>
    );
};

export default Landing;
