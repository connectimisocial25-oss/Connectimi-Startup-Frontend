import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Connectimi_logo from "./components/Connectimi_logo";



// Layout wrapper to handle global elements
const Layout = ({ children }) => {
  const location = useLocation();
  // Hide global logo on auth pages
  const showHeader = !['/', '/signup'].includes(location.pathname);

  return (
    <>
      {showHeader && <Connectimi_logo />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
