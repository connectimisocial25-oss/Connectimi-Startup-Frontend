import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Work from "./pages/Work";
import MyNetwork from "./pages/MyNetwork";
import Notifications from "./pages/Notifications";
import Course from "./pages/Course";
import OrganizationProfile from "./pages/OrganizationProfile";


import Resources from "./pages/Resources";
import CourseRoadmap from "./pages/CourseRoadmap";

import Navbar from "./components/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeader = !['/', '/signup', '/forgot-password', '/organization'].includes(location.pathname);

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
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/work" element={<Work />} />
            <Route path="/mynetwork" element={<MyNetwork />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/course" element={<Course />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:courseId" element={<CourseRoadmap />} />
            <Route path="/organization" element={<OrganizationProfile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
