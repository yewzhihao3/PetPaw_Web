import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    if (token && userId && userRole) {
      setUser({ token, id: userId, role: userRole });
    }
    console.log("AuthProvider - Initial user:", {
      token,
      id: userId,
      role: userRole,
    }); // Add this line
  }, []);

  const login = (userData) => {
    console.log("AuthProvider - Login:", userData); // Add this line
    setUser({
      token: userData.access_token,
      id: userData.user_id,
      role: userData.role,
    });
    localStorage.setItem("userToken", userData.access_token);
    localStorage.setItem("userId", userData.user_id);
    localStorage.setItem("userRole", userData.role);
  };

  const logout = () => {
    console.log("AuthProvider - Logout"); // Add this line
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
