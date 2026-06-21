import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  FiSearch, FiLock, FiUserCheck, FiFileText, 
  FiHelpCircle, FiChevronDown, FiClock, FiCheck, FiArrowLeft 
} from 'react-icons/fi';
import './Legal.css';

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab') || 'terms';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendlyMode, setFriendlyMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    'tos-1': true,
    'tos-2': true,
    'priv-1': true,
    'priv-2': true,
    'cook-1': true
  });
  const [expandedFaqs, setExpandedFaqs] = useState({});

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  // Sync state with URL search param
  useEffect(() => {
    if (tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // GSAP Animations on mount
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    tl.fromTo(cardsRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );
    tl.fromTo([tabsRef.current, contentRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power1.out' },
      '-=0.2'
    );
  }, []);

  // Transition animation when changing tabs
  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setActiveTab(tabName);
    setSearchQuery(''); // Clear search when switching tabs
    
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Content Data
  const termsOfService = [
    {
      id: 'tos-1',
      num: '01',
      title: 'Introduction & Agreement',
      friendly: 'Welcome to Connectimi! By using our website or mobile application, you agree to these terms. This is a binding legal contract between you and Connectimi.',
      friendlyBullets: [
        'Connectimi is a platform for students, creative professionals, and consultants.',
        'If you do not agree to these terms, please do not use our services.',
        'You must be at least 16 years old to create an account.'
      ],
      legal: `Welcome to Connectimi ("we", "us", "our"). These Terms of Service ("Terms") govern your access to and use of our platform, services, and applications (collectively, the "Services"). By registering an account or utilizing our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must immediately cease all access and use of the Services.`
    },
    {
      id: 'tos-2',
      num: '02',
      title: 'User Accounts & Profile Credential Integrity',
      friendly: 'Keep your account details secure and accurate. You are responsible for everything that happens on your profile. Do not share your login details.',
      friendlyBullets: [
        'You must provide honest, up-to-date information when registering.',
        'You are entirely responsible for keeping your password confidential.',
        'Notify us immediately if you suspect unauthorized access.'
      ],
      legal: `To access certain features of the Services, you must create a profile. You agree to provide accurate, current, and complete information during registration and keep it updated. You are solely responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. Connectimi will not be liable for any losses caused by unauthorized account access.`
    },
    {
      id: 'tos-3',
      num: '03',
      title: 'Intellectual Property & Content Ownership',
      friendly: 'What you post belongs to you. However, you grant us permission to display, share, and promote it on the app.',
      friendlyBullets: [
        'You own the copyrights to your resumes, posts, coursework, and CVs.',
        'You grant us a worldwide, royalty-free license to show your content to other users.',
        'Do not upload work that belongs to someone else without permission.'
      ],
      legal: `You retain all ownership rights in the content you submit, post, or display on or through the Services (including profile information, project descriptions, resumes, and messages). By submitting content, you grant Connectimi a worldwide, non-exclusive, royalty-free, sublicensable license to host, store, use, display, reproduce, modify, and distribute such content solely for the purpose of operating, developing, and improving our Services.`
    },
    {
      id: 'tos-4',
      num: '04',
      title: 'Acceptable Use & Platform Rules',
      friendly: 'Be professional and respectful. No spamming, scraping, hacking, or abusing other members of the community.',
      friendlyBullets: [
        'No hate speech, harassment, or abusive language.',
        'Do not use bots, scripts, or scrapers to extract user details.',
        'Do not distribute viruses or malicious code.'
      ],
      legal: `You agree not to engage in any prohibited activities, including: (a) copying, distributing, or disclosing any part of the Services in any medium; (b) using automated systems (e.g., robots, spiders, scrapers) to access the Services; (c) transmitting spam, chain letters, or unsolicited emails; (d) attempting to interfere with system integrity or security; (e) impersonating another person or misrepresenting your affiliation; or (f) posting harmful, unlawful, or defamatory material.`
    },
    {
      id: 'tos-5',
      num: '05',
      title: 'Termination of Services',
      friendly: 'You can leave anytime by deleting your account. We may suspend or terminate your account if you break the rules.',
      friendlyBullets: [
        'You can close your account through user profile settings at any time.',
        'We reserve the right to ban accounts that violate community safety rules.',
        'Suspension doesn\'t wipe outstanding fees if you signed up for paid features.'
      ],
      legal: `We may terminate or suspend your access to and use of the Services, at our sole discretion, at any time and without notice, including for violation of these Terms. Upon termination, your right to use the Services will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive (including ownership provisions, warranty disclaimers, and limitations of liability).`
    },
    {
      id: 'tos-6',
      num: '06',
      title: 'Limitations of Liability',
      friendly: 'We build our platform with care, but we provide it "as-is". We are not responsible for any direct or indirect business losses.',
      friendlyBullets: [
        'We don\'t guarantee the platform will be 100% online or error-free at all times.',
        'We aren\'t liable for connections or jobs you secure (or miss) on the app.',
        'Our liability is capped to the maximum extent permitted by law.'
      ],
      legal: `To the maximum extent permitted by applicable law, in no event shall Connectimi, its affiliates, directors, or employees be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or relating to the use of, or inability to use, the Services.`
    }
  ];

  const privacyPolicy = [
    {
      id: 'priv-1',
      num: '01',
      title: 'Information We Collect',
      friendly: 'We collect information you choose to give us, like your name, email, profile photo, and work history, as well as automatic technical details.',
      friendlyBullets: [
        'Account details (name, email, password, account type).',
        'Profile info (work experience, education, skills, CV uploads).',
        'Device logs (IP addresses, browser type, pages visited).'
      ],
      legal: `We collect information you provide directly, including: (a) registration information (name, email, credentials); (b) profile attributes (education, employment history, skills, resume uploads); and (c) communications sent through the platform. We also automatically log technical details such as your Internet Protocol (IP) address, operating system, browser details, and navigation data using cookies.`
    },
    {
      id: 'priv-2',
      num: '02',
      title: 'How We Use Your Information',
      friendly: 'We use your data to run our app, personalize your experience, match you with opportunities, and keep the network safe.',
      friendlyBullets: [
        'To recommend relevant connections, courses, and job listings.',
        'To send service notifications, security alerts, and support updates.',
        'To prevent fraud, spam, and malicious behavior.'
      ],
      legal: `Connectimi utilizes collected information to: (a) operate and maintain the Services; (b) customize profile recommendations; (c) facilitate networking actions between users and organizations; (d) communicate security patches, product announcements, and customer support messages; and (e) analyze usage metrics to improve system UX.`
    },
    {
      id: 'priv-3',
      num: '03',
      title: 'Information Sharing & Third Parties',
      friendly: 'We never sell your personal information. We only share it when you request (e.g., applying to a job) or with essential cloud providers.',
      friendlyBullets: [
        'Other members see what you choose to put on your public profile.',
        'Consultants/recruiters see your resume if you apply to their listings.',
        'We share details with trusted cloud hosts (like Vercel or AWS) to keep the app online.'
      ],
      legal: `We do not sell, rent, or lease your personal data. We disclose information to third parties only: (a) with your explicit consent (e.g., submitting job applications); (b) to trusted vendors acting as data processors under strict confidentiality contracts; or (c) when legally required by law, subpoena, or government authority.`
    },
    {
      id: 'priv-4',
      num: '04',
      title: 'Data Retention & Deletion Rights',
      friendly: 'Your data is yours. If you delete your account, we wipe your personal information from our active databases.',
      friendlyBullets: [
        'We store your information for as long as your account is active.',
        'You can request complete account deletion from the app settings.',
        'Backup archives may take up to 30 days to fully cycle and clear.'
      ],
      legal: `We retain personal data only as long as necessary to fulfill the purposes outlined in this Policy. You have the right to request deletion of your account and associated personal data at any time. Upon receiving a valid request, we will deactivate your account and purge active database records, though some cached files or database backups may persist for up to 30 days before permanent erasure.`
    },
    {
      id: 'priv-5',
      num: '05',
      title: 'Security Measures',
      friendly: 'We use industry-standard encryption to guard your credentials and files, though no internet system is 100% foolproof.',
      friendlyBullets: [
        'Passphrases are salted and hashed so they can\'t be read.',
        'Traffic is encrypted via Secure Socket Layer (HTTPS).',
        'We constantly review our code for software vulnerabilities.'
      ],
      legal: `Connectimi implements technical and organizational controls to secure your data. We encrypt data in transit via Secure Socket Layers (SSL/TLS) and hash passwords using cryptographic algorithms. However, no electronic transmission or storage method is completely secure; we cannot guarantee absolute security of information.`
    }
  ];

  const cookiePolicy = [
    {
      id: 'cook-1',
      num: '01',
      title: 'What Are Cookies?',
      friendly: 'Cookies are small text files placed on your computer by websites you visit. They help sites remember you and load faster.',
      friendlyBullets: [
        'Session cookies: Temporary and disappear when you close your browser.',
        'Persistent cookies: Remain on your browser to remember things like dark mode settings.',
        'They do not run code or deliver malware.'
      ],
      legal: `Cookies are small text files stored on your browser or device by web servers. They allow websites to store user preferences, manage active sessions, and track browsing trends. Cookies do not scan your device for personal information or execute harmful code.`
    },
    {
      id: 'cook-2',
      num: '02',
      title: 'How Connectimi Uses Cookies',
      friendly: 'We use cookies to keep you signed in, remember your light/dark theme preference, and see which sections are popular.',
      friendlyBullets: [
        'Authentication: Keeping you logged in as you navigate pages.',
        'Preferences: Keeping track of your visual preferences (like Dark Mode).',
        'Analytics: Aggregating traffic stats to find out which pages load slowly.'
      ],
      legal: `We use cookies for the following purposes: (a) Authentication and Security to verify your login session; (b) Preferences to remember settings such as language or system theme (e.g., ThemeContext persistence); and (c) Analytics to measure traffic patterns and improve performance.`
    },
    {
      id: 'cook-3',
      num: '03',
      title: 'Your Choices & Settings',
      friendly: 'You can control cookies through your web browser. Turning them off might mean you have to log in every single time you visit.',
      friendlyBullets: [
        'Check your browser settings (Chrome, Safari, Firefox) to disable cookies.',
        'Without authentication cookies, auto-login features will cease to function.'
      ],
      legal: `Most web browsers automatically accept cookies, but you can modify browser settings to decline them. Please note that disabling cookies may limit your access to key features of the Services, including maintaining an active login session.`
    }
  ];

  const faqs = [
    {
      q: 'Does Connectimi sell my personal data to advertisers?',
      a: 'Absolutely not. Connectimi is funded through student resources and premium consultant options. We do not participate in advertising data brokers. Your profile details, files, and CV uploads will never be sold.'
    },
    {
      q: 'How can I download a copy of the data I put on Connectimi?',
      a: 'You can request a full data export by navigating to Account Settings. Our support team will compile your profile fields, CVs, and posts into a portable JSON/ZIP format and deliver it to your verified email within 72 hours.'
    },
    {
      q: 'What happens when I upload a resume or CV file?',
      a: 'Files you upload are stored securely in encrypted cloud storage buckets. They are private by default. They are only shared when you apply to a consultant role or manually configure your profile page to make them visible to recruiters.'
    },
    {
      q: 'Can I delete my account entirely?',
      a: 'Yes, you have full ownership. You can delete your profile permanently under the account safety tab. This triggers an automated script that deletes your database row, references, and files from our primary servers.'
    }
  ];

  // Search Filter Logic
  const getFilteredItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.friendly.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.legal.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredTerms = getFilteredItems(termsOfService);
  const filteredPrivacy = getFilteredItems(privacyPolicy);
  const filteredCookies = getFilteredItems(cookiePolicy);

  // Helper to highlight matching search words
  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="highlight-match">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className="legal-wrapper" ref={containerRef}>
      <div className="legal-bg-decoration">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="legal-container">
        {/* Return Button */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <Link to="/" className="btn btn-outline-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}>
            <FiArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <header className="legal-header" ref={headerRef}>
          <h1 className="legal-title">
            Our <span className="text-gradient">Commitments</span> to You
          </h1>
          <p className="legal-subtitle">
            We believe in transparency. Read our formal terms, or toggle the "Plain English" switch to see simple, honest summaries.
          </p>
        </header>

        {/* Dashboard Cards */}
        <section className="legal-dashboard" ref={cardsRef}>
          <div className="dashboard-card">
            <div className="card-icon-wrapper"><FiLock /></div>
            <h3>Encryption & Privacy</h3>
            <p>Your passwords and files are fully encrypted. We never sell your personal information to third parties.</p>
          </div>
          <div className="dashboard-card">
            <div className="card-icon-wrapper"><FiUserCheck /></div>
            <h3>IP & Ownership</h3>
            <p>What you create and upload belongs to you. You retain 100% copyright ownership of your portfolios.</p>
          </div>
          <div className="dashboard-card">
            <div className="card-icon-wrapper"><FiFileText /></div>
            <h3>No Hidden Clauses</h3>
            <p>Everything is written in plain, legible terms. No fine print or tricks designed to catch you off guard.</p>
          </div>
        </section>

        {/* Navigation, Tabs & Search */}
        <div className="legal-nav-bar" ref={tabsRef}>
          <div className="legal-tabs">
            <button 
              className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => handleTabChange('terms')}
            >
              Terms of Service
            </button>
            <button 
              className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => handleTabChange('privacy')}
            >
              Privacy Policy
            </button>
            <button 
              className={`legal-tab-btn ${activeTab === 'cookies' ? 'active' : ''}`}
              onClick={() => handleTabChange('cookies')}
            >
              Cookie Policy
            </button>
            <button 
              className={`legal-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => handleTabChange('faq')}
            >
              Frequently Asked Qs
            </button>
          </div>

          {activeTab !== 'faq' && (
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder={`Search ${activeTab === 'terms' ? 'Terms' : activeTab === 'privacy' ? 'Privacy' : 'Cookies'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Legal Options / Modes */}
        {activeTab !== 'faq' && (
          <div className="legal-options-bar">
            <span className="last-updated">
              <FiClock style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Last updated: October 24, 2025
            </span>

            <div className="mode-toggle-wrapper">
              <span className="mode-toggle-label">Plain English Explainer</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={friendlyMode} 
                  onChange={(e) => setFriendlyMode(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        )}

        {/* Content Render Grid */}
        <main className="document-content-grid" ref={contentRef}>
          {/* TERMS OF SERVICE TAB */}
          {activeTab === 'terms' && (
            filteredTerms.length > 0 ? (
              filteredTerms.map((section) => (
                <div 
                  key={section.id} 
                  className={`legal-section-block ${expandedSections[section.id] ? 'expanded' : ''} ${searchQuery ? 'highlight' : ''}`}
                >
                  <div className="legal-section-header" onClick={() => toggleSection(section.id)}>
                    <div className="section-title-area">
                      <span className="section-num">{section.num}</span>
                      <h2>{highlightText(section.title, searchQuery)}</h2>
                    </div>
                    <FiChevronDown className="section-toggle-icon" size={20} />
                  </div>

                  {expandedSections[section.id] && (
                    <div className={`legal-section-body ${friendlyMode ? 'split-mode' : ''}`}>
                      {friendlyMode && (
                        <div className="plain-english-panel">
                          <span className="plain-english-badge">In Plain English</span>
                          <p>{section.friendly}</p>
                          {section.friendlyBullets && (
                            <ul>
                              {section.friendlyBullets.map((bullet, idx) => (
                                <li key={idx}>✓ {bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      <div className="formal-legal-panel">
                        {friendlyMode && <span className="plain-english-badge" style={{ background: 'rgba(71, 85, 105, 0.08)', color: 'var(--text-secondary)' }}>Full Legal Text</span>}
                        <p>{highlightText(section.legal, searchQuery)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState tab="Terms of Service" />
            )
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === 'privacy' && (
            filteredPrivacy.length > 0 ? (
              filteredPrivacy.map((section) => (
                <div 
                  key={section.id} 
                  className={`legal-section-block ${expandedSections[section.id] ? 'expanded' : ''} ${searchQuery ? 'highlight' : ''}`}
                >
                  <div className="legal-section-header" onClick={() => toggleSection(section.id)}>
                    <div className="section-title-area">
                      <span className="section-num">{section.num}</span>
                      <h2>{highlightText(section.title, searchQuery)}</h2>
                    </div>
                    <FiChevronDown className="section-toggle-icon" size={20} />
                  </div>

                  {expandedSections[section.id] && (
                    <div className={`legal-section-body ${friendlyMode ? 'split-mode' : ''}`}>
                      {friendlyMode && (
                        <div className="plain-english-panel">
                          <span className="plain-english-badge">In Plain English</span>
                          <p>{section.friendly}</p>
                          {section.friendlyBullets && (
                            <ul>
                              {section.friendlyBullets.map((bullet, idx) => (
                                <li key={idx}>✓ {bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      <div className="formal-legal-panel">
                        {friendlyMode && <span className="plain-english-badge" style={{ background: 'rgba(71, 85, 105, 0.08)', color: 'var(--text-secondary)' }}>Full Legal Text</span>}
                        <p>{highlightText(section.legal, searchQuery)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState tab="Privacy Policy" />
            )
          )}

          {/* COOKIE POLICY TAB */}
          {activeTab === 'cookies' && (
            filteredCookies.length > 0 ? (
              filteredCookies.map((section) => (
                <div 
                  key={section.id} 
                  className={`legal-section-block ${expandedSections[section.id] ? 'expanded' : ''} ${searchQuery ? 'highlight' : ''}`}
                >
                  <div className="legal-section-header" onClick={() => toggleSection(section.id)}>
                    <div className="section-title-area">
                      <span className="section-num">{section.num}</span>
                      <h2>{highlightText(section.title, searchQuery)}</h2>
                    </div>
                    <FiChevronDown className="section-toggle-icon" size={20} />
                  </div>

                  {expandedSections[section.id] && (
                    <div className={`legal-section-body ${friendlyMode ? 'split-mode' : ''}`}>
                      {friendlyMode && (
                        <div className="plain-english-panel">
                          <span className="plain-english-badge">In Plain English</span>
                          <p>{section.friendly}</p>
                          {section.friendlyBullets && (
                            <ul>
                              {section.friendlyBullets.map((bullet, idx) => (
                                <li key={idx}>✓ {bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      <div className="formal-legal-panel">
                        {friendlyMode && <span className="plain-english-badge" style={{ background: 'rgba(71, 85, 105, 0.08)', color: 'var(--text-secondary)' }}>Full Legal Text</span>}
                        <p>{highlightText(section.legal, searchQuery)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState tab="Cookie Policy" />
            )
          )}

          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="faq-section">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    <FiChevronDown style={{ transform: expandedFaqs[idx] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0, marginLeft: '12px' }} />
                  </button>
                  {expandedFaqs[idx] && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Read Confirmation (Interactive learning element) */}
        {activeTab !== 'faq' && (
          <div className="legal-sticky-footer">
            <div className="legal-footer-info">
              <label className="checkbox-container">
                I have read and understand the {activeTab === 'terms' ? 'Terms of Service' : activeTab === 'privacy' ? 'Privacy Policy' : 'Cookie Policy'}
                <input type="checkbox" />
                <span className="checkmark" />
              </label>
            </div>
            <button 
              className="btn" 
              onClick={() => {
                navigate('/');
              }}
            >
              Acknowledge Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }) {
  return (
    <div className="search-empty">
      <FiHelpCircle className="search-empty-icon" />
      <h3>No matches found</h3>
      <p>We couldn't find any clauses matching your query in the {tab}. Try searching for terms like "account", "data", "intellectual", or "security".</p>
    </div>
  );
}
