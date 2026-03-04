import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [verificationStep, setVerificationStep] = useState(null); // 'signup', 'verify-email', 'account-completion', 'active'
  const [tempData, setTempData] = useState(null); // { firstName, lastName, email }

  // Check for existing session in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("connectimi_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setVerificationStep('active');
    }
  }, []);

  const initiateSignup = (data) => {
    setTempData(data);
    setVerificationStep('verify-email');
    console.log("Signup initiated for:", data.email);
    // In a real app, this would call the API to send a verification email
  };

  const verifyEmail = () => {
    setVerificationStep('account-completion');
    console.log("Email verified for:", tempData?.email);
    // In a real app, the token from the URL would be verified here
  };

  const completeAccount = (additionalData) => {
    const fullUser = {
      ...tempData,
      ...additionalData,
      id: Math.random().toString(36).substr(2, 9),
      joinedAt: new Date().toISOString()
    };
    
    // Simulate API call and login
    setUser(fullUser);
    setVerificationStep('active');
    localStorage.setItem("connectimi_user", JSON.stringify(fullUser));
    console.log("Account completed for:", fullUser.email);
  };

  const login = (email, password) => {
    // Mock login
    const mockUser = {
      email,
      firstName: "User",
      lastName: "Test",
      id: "mock_id_123"
    };
    setUser(mockUser);
    setVerificationStep('active');
    localStorage.setItem("connectimi_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setVerificationStep(null);
    setTempData(null);
    localStorage.removeItem("connectimi_user");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      verificationStep, 
      tempData, 
      initiateSignup, 
      verifyEmail, 
      completeAccount, 
      login, 
      logout 
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
