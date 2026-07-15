import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { FeedProvider } from "./context/FeedContext";
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

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeader = !['/', '/login', '/signup', '/forgot-password', '/verify-email', '/account-completion', '/org-account-completion'].includes(location.pathname) && !location.pathname.startsWith('/organization');

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
        <FeedProvider>
          <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/account-completion" element={<AccountCompletion />} />
              <Route path="/org-account-completion" element={<OrgAccountCompletion />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/work" element={<Work />} />
              <Route path="/mynetwork" element={<MyNetwork />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseRoadmap />} />

              {/* Organization Routes */}
              <Route path="/organization" element={<OrganizationLayout />}>
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
        </FeedProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
