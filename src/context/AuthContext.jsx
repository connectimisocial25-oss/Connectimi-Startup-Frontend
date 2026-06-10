import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import {
  transformProfileToBackend,
  transformProfileToFrontend,
} from "../utils/adapters";

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
          setVerificationStep("active");
        } catch (err) {
          console.error("Session verification failed:", err.message);
          // logout();
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
        account_type: data.accountType,
      };
      await API.post("/auth/signup", payload);
      setTempData(data);
      setVerificationStep("verify-email");
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
        account_type: tempData?.accountType,
      });

      const { token, user: backendUser } = res.data;
      localStorage.setItem("connectimi_token", token);

      // const frontendUser = transformProfileToFrontend(backendUser);
      // console.log(`backend user: ${backendUser} \n res: ${res.data}`);

      // setUser(frontendUser);
      setVerificationStep("account-completion");
      // localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log(
        "Email verified, proceeding to completion:",
        // frontendUser.email,
      );
    } catch (err) {
      console.error(
        "OTP verification failed:",
        err.response?.data?.error || err.message,
      );
      throw err;
    }
  };

  const resendOtp = async (email, account_type) => {
    try {
      await API.post("/auth/resend-otp", { email, account_type });
    } catch (err) {
      console.error(
        "Resend OTP failed:",
        err.response?.data?.error || err.message,
      );
      throw err;
    }
  };

  const completeAccount = async (additionalData) => {
    try {
      const isConsultant = tempData?.accountType === "consultant";
      const endpoint = isConsultant
        ? "/consultant/profile/complete"
        : "/profile/complete";

      let profilePictureUrl,
        bannerImageUrl = null;

      // Step 1 — upload image first if user selected one
      if (additionalData.profileImage) {
        const formData = new FormData();
        formData.append("image", additionalData.profileImage);

        const uploadRes = await API.put("/profile/me/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profilePictureUrl = uploadRes.data.profile_picture;
      }

      // Step 2 — upload banner image if user selected one
      if (additionalData.bannerImage) {
        const formData = new FormData();
        formData.append("image", additionalData.bannerImage);

        const uploadRes = await API.put("/profile/me/banner", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        bannerImageUrl = uploadRes.data.profile_picture;
      }

      // Step 3 — send profile completion with URL (not the file)
      const completePayload = transformProfileToBackend({
        ...tempData,
        ...additionalData,
        // override with the real Cloudinary URL if uploaded
        ...(profilePictureUrl && { profile_picture: profilePictureUrl }),
        ...(bannerImageUrl && { banner_image: bannerImageUrl }),
      });

      // remove the raw file — not serializable to JSON
      delete completePayload.avatarFile;
      delete completePayload.bannerFile;

      const res = await API.put(endpoint, completePayload);
      const frontendUser = transformProfileToFrontend(res.data.user);

      setUser(frontendUser);
      setVerificationStep("active");
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
    } catch (err) {
      console.error(
        "Onboarding completion failed:",
        err.response?.data?.error || err.message,
      );
      throw err;
    }
  };

  const login = async (email, password, account_type) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        account_type,
      });
      const { token, user: backendUser } = res.data;

      localStorage.setItem("connectimi_token", token);
      const frontendUser = transformProfileToFrontend(backendUser);
      console.log(res.data);

      setUser(frontendUser);
      setVerificationStep("active");
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log("Login successful:", frontendUser.email);
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      throw err;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const isConsultant = user?.account_type === "consultant";
      const endpoint = isConsultant ? "/consultant/profile/me" : "/profile/me";
      const payload = transformProfileToBackend(updatedData);

      const res = await API.put(endpoint, payload);

      const frontendUser = transformProfileToFrontend(res.data.user);

      setUser(frontendUser);
      localStorage.setItem("connectimi_user", JSON.stringify(frontendUser));
      console.log("Profile updated successfully:", frontendUser.email);
    } catch (err) {
      console.error(
        "Profile update failed:",
        err.response?.data?.error || err.message,
      );
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
    <AuthContext.Provider
      value={{
        user,
        verificationStep,
        tempData,
        loading,
        initiateSignup,
        verifyEmail,
        resendOtp,
        completeAccount,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth };
