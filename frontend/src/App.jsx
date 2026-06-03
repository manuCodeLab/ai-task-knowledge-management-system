import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Documents from "./pages/Documents.jsx";
import Login from "./pages/Login.jsx";
import Search from "./pages/Search.jsx";
import Tasks from "./pages/Tasks.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import { getSessionUser } from "./services/api.js";

function ProtectedRoute({ children, roles }) {
  const user = getSessionUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }
  return (
    <>
      <Navbar user={user} />
      <main className="app-shell">{children}</main>
    </>
  );
}

export default function App() {
  const user = getSessionUser();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user?.role === "admin" ? "/admin" : user ? "/user" : "/login"} />}
      />
    </Routes>
  );
}
