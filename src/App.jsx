import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Connectimi_logo from "./components/Connectimi_logo";

import MyNetwork from "./pages/MyNetwork";

function App() {
  return (
    <BrowserRouter>
      <Connectimi_logo />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/mynetwork" element={<MyNetwork />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
