import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Work from "./pages/Work";
import MyNetwork from "./pages/MyNetwork";
import Notifications from "./pages/Notifications";
import Course from "./pages/Course";
import Navbar from "./components/Navbar";

// Layout wrapper to handle global elements
const Layout = ({ children }) => {
  const location = useLocation();
  // Hide global navbar on auth pages
  const showHeader = !['/', '/signup'].includes(location.pathname);

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
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/work" element={<Work />} />
            <Route path="/mynetwork" element={<MyNetwork />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/course" element={<Course />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
