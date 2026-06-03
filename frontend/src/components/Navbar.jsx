import { BarChart3, ClipboardList, FileText, LogOut, Search } from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../services/api.js";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <NavLink className="brand" to={user.role === "admin" ? "/admin" : "/user"}>
        AI Task Knowledge
      </NavLink>
      <nav>
        <NavLink to="/tasks">
          <ClipboardList size={18} /> Tasks
        </NavLink>
        <NavLink to="/documents">
          <FileText size={18} /> Documents
        </NavLink>
        <NavLink to="/search">
          <Search size={18} /> Search
        </NavLink>
        {user.role === "admin" && (
          <NavLink to="/analytics">
            <BarChart3 size={18} /> Analytics
          </NavLink>
        )}
      </nav>
      <button className="icon-button" title="Logout" onClick={logout}>
        <LogOut size={19} />
      </button>
    </header>
  );
}
