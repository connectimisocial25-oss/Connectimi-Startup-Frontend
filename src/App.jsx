import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Work from "./pages/Work";
import MyNetwork from "./pages/MyNetwork";
import Notifications from "./pages/Notifications";
import OrganizationProfile from "./pages/OrganizationProfile";
import VerifyEmail from "./pages/VerifyEmail";
import AccountCompletion from "./pages/AccountCompletion";


import Courses from "./pages/Courses";
import CourseRoadmap from "./pages/CourseRoadmap";

import Navbar from "./components/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeader = !['/', '/login', '/signup', '/forgot-password', '/organization', '/verify-email', '/account-completion'].includes(location.pathname);

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
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/account-completion" element={<AccountCompletion />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/work" element={<Work />} />
              <Route path="/mynetwork" element={<MyNetwork />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseRoadmap />} />
              <Route path="/organization" element={<OrganizationProfile />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
