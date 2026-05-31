import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { transformProfileToBackend, transformProfileToFrontend } from "../utils/adapters";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [verificationStep, setVerificationStep] = useState(null); // 'signup', 'verify-email', 'account-completion', 'active'
  const [tempData, setTempData] = useState(null); // { firstName, lastName, email, password }
  const [loading, setLoading] = useState(true);

  // Check for existing session in localStorage and fetch /me
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("connectimi_token");
      if (token) {
        try {
          const res = await API.get("/auth/me");
          const frontendUser = transformProfileToFrontend(res.data.user);
          setUser(frontendUser);
          setVerificationStep('active');
        } catch (err) {
          console.error("Session verification failed:", err.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const initiateSignup = async (data) => {
    try {
      const payload = {
        full_name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        email: data.email,
        password: data.password,
      };
      await API.post("/auth/signup", payload);
      setTempData(data);
      setVerificationStep('verify-email');
      console.log("Signup OTP sent for:", data.email);
    } catch (err) {
      console.error("Signup failed:", err.response?.data?.error || err.message);
      throw err;
    }
  };

  const verifyEmail = async (code) => {
    try {
      const res = await API.post("/auth/verify-email", {
        email: tempData?.email,
        code,
      });

      const { token, user: backendUser } = res.data;
      localStorage.setItem("connectimi_token", token);
      
      const frontendUser = transformProfileToFrontend(backendUser);
      setUser(frontendUser);
      setVerificationStep('account-completion');
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log("Email verified, proceeding to completion:", frontendUser.email);
    } catch (err) {
      console.error("OTP verification failed:", err.response?.data?.error || err.message);
      throw err;
    }
  };

  const completeAccount = async (additionalData) => {
    try {
      const completePayload = transformProfileToBackend({
        ...tempData,
        ...additionalData,
      });

      const res = await API.put("/profile/complete", completePayload);
      const frontendUser = transformProfileToFrontend(res.data.user);
      
      setUser(frontendUser);
      setVerificationStep('active');
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log("Account onboarding complete:", frontendUser.email);
    } catch (err) {
      console.error("Onboarding completion failed:", err.response?.data?.error || err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user: backendUser } = res.data;
      
      localStorage.setItem("connectimi_token", token);
      const frontendUser = transformProfileToFrontend(backendUser);
      
      setUser(frontendUser);
      setVerificationStep('active');
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log("Login successful:", frontendUser.email);
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      throw err;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const payload = transformProfileToBackend(updatedData);
      const res = await API.put("/profile/me", payload);
      const frontendUser = transformProfileToFrontend(res.data.user);
      
      setUser(frontendUser);
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log("Profile updated successfully:", frontendUser.email);
    } catch (err) {
      console.error("Profile update failed:", err.response?.data?.error || err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setVerificationStep(null);
    setTempData(null);
    localStorage.removeItem("connectimi_token");
    localStorage.removeItem("connectimi_user");
    // Optionally call logout endpoint synchronously to clear blacklists
    API.post("/auth/logout").catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      verificationStep, 
      tempData, 
      loading,
      initiateSignup, 
      verifyEmail, 
      completeAccount, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};