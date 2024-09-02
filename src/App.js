import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("PrivateRoute - user:", user); // Add this line
  return user?.role === "SHOP_OWNER" ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("App - user:", user); // Add this line
  }, [user]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user?.role === "SHOP_OWNER" ? <Navigate to="/dashboard" /> : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

export default AppWithAuth;
