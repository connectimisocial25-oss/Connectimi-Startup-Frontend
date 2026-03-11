import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [verificationStep, setVerificationStep] = useState(null); // 'signup', 'verify-email', 'account-completion', 'active'
  const [tempData, setTempData] = useState(null); // { firstName, lastName, email, password }

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
    // Collect all profile data from additionalData and tempData
    const fullUser = {
      ...tempData,
      // Core profile fields
      headline: additionalData.headline || "",
      industry: additionalData.industry || "",
      location: additionalData.location || "",
      phone: additionalData.phone || "",
      website: additionalData.website || "",
      about: additionalData.about || "",
      skills: additionalData.skills || [],
      specialties: additionalData.specialties || [],
      companySize: additionalData.companySize || "",
      foundedDate: additionalData.foundedDate || "",
      profileImage: additionalData.profileImage || null,
      bannerImage: additionalData.bannerImage || null,

      // Detailed profile sections
      experience: additionalData.experience || [],
      projects: additionalData.projects || [],
      education: additionalData.education || [],
      services: additionalData.services || [],

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

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("connectimi_user", JSON.stringify(newUser));
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