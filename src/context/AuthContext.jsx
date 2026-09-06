import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/users/me");

      setUser(res.data.user);

      return res.data.user;
    } catch (err) {
      console.error("fetchProfile error:", err);

      setUser(null);

      throw err;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetchProfile()
        .catch(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    await fetchProfile();
  };

  const signup = async (username, email, password) => {
    await api.post("/auth/register", {
      username,
      email,
      password,
    });
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (err) {}

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};