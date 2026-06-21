import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import Legal from "./pages/Legal";

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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-color)",
        color: "var(--text-primary)",
        fontFamily: "Satoshi, sans-serif"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--border-color)",
            borderTopColor: "var(--primary-green)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ fontWeight: 600 }}>Verifying secure session...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-color)",
        color: "var(--text-primary)",
        fontFamily: "Satoshi, sans-serif"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--border-color)",
            borderTopColor: "var(--primary-green)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ fontWeight: 600 }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (user) {
    const isConsultant = user.account_type === "consultant" || user.accountType === "consultant";
    return <Navigate to={isConsultant ? "/organization" : "/home"} replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeader = !['/', '/login', '/signup', '/forgot-password', '/verify-email', '/account-completion', '/org-account-completion', '/legal'].includes(location.pathname) && !location.pathname.startsWith('/organization');

  return (
    <>
      {showHeader && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
             <Routes>
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
              <Route path="/account-completion" element={<PublicRoute><AccountCompletion /></PublicRoute>} />
              <Route path="/org-account-completion" element={<PublicRoute><OrgAccountCompletion /></PublicRoute>} />
              
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/work" element={<ProtectedRoute><Work /></ProtectedRoute>} />
              <Route path="/mynetwork" element={<ProtectedRoute><MyNetwork /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/courses/:courseId" element={<ProtectedRoute><CourseRoadmap /></ProtectedRoute>} />
              <Route path="/legal" element={<Legal />} />

              {/* Organization Routes */}
              <Route path="/organization" element={<ProtectedRoute><OrganizationLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/organization/feed" replace />} />
                <Route path="feed" element={<OrgFeed />} />
                <Route path="profile" element={<OrgProfile />} />
                <Route path="messages" element={<OrgMessages />} />
                <Route path="alerts" element={<OrgAlerts />} />
                <Route path="courses" element={<OrgCourses />} />
                <Route path="ads" element={<OrgAds />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
