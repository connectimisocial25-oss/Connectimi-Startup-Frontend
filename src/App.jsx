import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FeedProvider } from "./context/FeedContext";
import { ChatProvider } from "./context/ChatContext";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Work from "./pages/Work";
import MyNetwork from "./pages/MyNetwork";
import Notifications from "./pages/Notifications";
import VerifyEmail from "./pages/VerifyEmail";
import AccountCompletion from "./pages/AccountCompletion";

import Courses from "./pages/Courses";
import CourseRoadmap from "./pages/CourseRoadmap";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectEdit from "./pages/ProjectEdit";

import Navbar from "./components/Navbar";

// Organization Components
import OrganizationLayout from "./organization/OrganizationLayout";
import OrgFeed from "./organization/pages/OrgFeed";
import OrgProfile from "./organization/pages/OrgProfile";
import OrgAccountCompletion from "./organization/pages/OrgAccountCompletion";
import OrgMessages from "./organization/pages/OrgMessages";
import OrgAlerts from "./organization/pages/OrgAlerts";
import OrgCourses from "./organization/pages/OrgCourses";
import OrgAds from "./organization/pages/OrgAds";

// Consultant Booking feature
import ConsultantApply from "./pages/consultant/ConsultantApply";
import ConsultantDashboard from "./pages/consultant/ConsultantDashboard";
import Consultants from "./pages/consultant/Consultants";
import ConsultantProfile from "./pages/consultant/ConsultantProfile";
import BookingStatus from "./pages/consultant/BookingStatus";

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeader = !['/', '/forgot-password', '/verify-email', '/account-completion', '/org-account-completion'].includes(location.pathname)
    && !location.pathname.startsWith('/organization')
    && !location.pathname.startsWith('/consultants')
    && !location.pathname.startsWith('/booking-status');

  return (
    <>
      {showHeader && <Navbar />}
      {children}
    </>
  );
};

const NotFoundRedirect = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/" replace />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main, #0f172a)', color: 'var(--text-primary, #f8fafc)' }}>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user.accountCompleted) {
    if (user.accountType === "counsel") {
      return <Navigate to="/org-account-completion" replace />;
    } else {
      return <Navigate to="/account-completion" replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    return <Navigate to={user.accountType === "counsel" ? "/organization" : "/home"} replace />;
  }

  return children;
};

// Where an authenticated personal account lands when it hits a public route.
// VITE_DEV_LANDING lets dev sessions jump straight to a page under test.
const PERSONAL_LANDING =
  (import.meta.env.DEV && import.meta.env.VITE_DEV_LANDING) || "/home";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main, #0f172a)', color: 'var(--text-primary, #f8fafc)' }}>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>Loading...</div>
      </div>
    );
  }

  if (user) {
    if (!user.accountCompleted) {
      return <Navigate to={user.accountType === "counsel" ? "/org-account-completion" : "/account-completion"} replace />;
    }
    return <Navigate to={user.accountType === "counsel" ? "/organization" : PERSONAL_LANDING} replace />;
  }

  return children;
};

const CompletionRoute = ({ children, type }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main, #0f172a)', color: 'var(--text-primary, #f8fafc)' }}>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.accountCompleted) {
    return <Navigate to={user.accountType === "counsel" ? "/organization" : "/home"} replace />;
  }

  if (user.accountType !== type) {
    return <Navigate to={user.accountType === "counsel" ? "/org-account-completion" : "/account-completion"} replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FeedProvider>
          <BrowserRouter>
            <ChatProvider>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />

                {/* Completion Routes */}
                <Route path="/account-completion" element={<CompletionRoute type="personal"><AccountCompletion /></CompletionRoute>} />
                <Route path="/org-account-completion" element={<CompletionRoute type="counsel"><OrgAccountCompletion /></CompletionRoute>} />

                {/* Protected Personal Routes */}
                <Route path="/home" element={<ProtectedRoute allowedRoles={["personal"]}><Home /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute allowedRoles={["personal"]}><Profile /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute allowedRoles={["personal"]}><Profile /></ProtectedRoute>} />
                <Route path="/work" element={<ProtectedRoute allowedRoles={["personal"]}><Work /></ProtectedRoute>} />
                <Route path="/mynetwork" element={<ProtectedRoute allowedRoles={["personal"]}><MyNetwork /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute allowedRoles={["personal"]}><Notifications /></ProtectedRoute>} />
                <Route path="/courses" element={<ProtectedRoute allowedRoles={["personal"]}><Courses /></ProtectedRoute>} />
                <Route path="/courses/:courseId" element={<ProtectedRoute allowedRoles={["personal"]}><CourseRoadmap /></ProtectedRoute>} />
                <Route path="/projects/new" element={<ProtectedRoute allowedRoles={["personal"]}><ProjectCreate /></ProtectedRoute>} />
                <Route path="/projects/:id" element={<ProtectedRoute allowedRoles={["personal"]}><ProjectDetails /></ProtectedRoute>} />
                <Route path="/projects/:id/edit" element={<ProtectedRoute allowedRoles={["personal"]}><ProjectEdit /></ProtectedRoute>} />
                <Route path="/consultant/apply" element={<ProtectedRoute allowedRoles={["personal"]}><ConsultantApply /></ProtectedRoute>} />
                <Route path="/consultant/dashboard" element={<ProtectedRoute allowedRoles={["personal"]}><ConsultantDashboard /></ProtectedRoute>} />

                {/* Public Consultant Booking Routes — no login required */}
                <Route path="/consultants" element={<Consultants />} />
                <Route path="/consultants/:id" element={<ConsultantProfile />} />
                <Route path="/booking-status" element={<BookingStatus />} />
                <Route path="/booking-status/:bookingRef" element={<BookingStatus />} />

                {/* Organization Routes */}
                <Route path="/organization" element={<ProtectedRoute allowedRoles={["counsel"]}><OrganizationLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/organization/feed" replace />} />
                  <Route path="feed" element={<OrgFeed />} />
                  <Route path="profile" element={<OrgProfile />} />
                  <Route path="messages" element={<OrgMessages />} />
                  <Route path="alerts" element={<OrgAlerts />} />
                  <Route path="courses" element={<OrgCourses />} />
                  <Route path="ads" element={<OrgAds />} />
                </Route>

                {/* Catch-all Route */}
                <Route path="*" element={<NotFoundRedirect />} />
              </Routes>
            </Layout>
            </ChatProvider>
          </BrowserRouter>
        </FeedProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
