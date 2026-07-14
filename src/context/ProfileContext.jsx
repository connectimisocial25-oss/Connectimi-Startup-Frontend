import { createContext, useContext, useState, useCallback } from "react";

import API from "../services/api";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [viewedProfile, setViewedProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // =====================================
  // COMPLETE PROFILE (ONBOARDING)
  // PUT /api/profile/complete
  // =====================================
  const completeProfile = async (profileData) => {
    try {
      setLoading(true);

      const { data } = await API.put("/profile/complete", profileData);

      setProfile(data.user);

      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GET PUBLIC PROFILE
  // GET /api/profile/:userId
  // =====================================
  const getProfile = useCallback(async (userId) => {
    try {
      setLoading(true);

      const { data } = await API.get(`/profile/${userId}`);

      setViewedProfile(data.user);

      return data.user;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================
  // UPDATE OWN PROFILE
  // PUT /api/profile/me
  // =====================================
  const updateProfile = async (payload) => {
    try {
      setLoading(true);

      const { data } = await API.put("/profile/me", payload);

      setProfile(data.user);

      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UPDATE AVATAR
  // PUT /api/profile/me/avatar
  // =====================================
  const updateAvatar = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", file);

      const res = await API.put("/profile/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile((prev) => ({
        ...prev,
        profile_picture: res.data.profile_picture,
      }));

      return res.data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UPDATE BANNER
  // PUT /api/profile/me/banner
  // =====================================
  const updateBanner = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", file);

      const { data } = await API.put("/profile/me/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((prev) => ({
        ...prev,
        banner_image: data.banner_image,
      }));

      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // RESET PROFILE STATE
  // =====================================
  const clearProfile = () => {
    setProfile(null);
    setViewedProfile(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,

        profile,
        setProfile,

        viewedProfile,
        setViewedProfile,

        completeProfile,
        getProfile,

        updateProfile,
        updateAvatar,
        updateBanner,

        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
};
