import { ClipboardList, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  return (
    <section>
      <div className="page-heading">
        <h1>User Dashboard</h1>
      </div>
      <div className="grid two">
        <Link className="card action-card" to="/tasks">
          <ClipboardList size={24} />
          <h3>My Tasks</h3>
          <p>Review assigned work and mark tasks complete.</p>
        </Link>
        <Link className="card action-card" to="/search">
          <Search size={24} />
          <h3>Knowledge Search</h3>
          <p>Search uploaded documents with semantic AI matching.</p>
        </Link>
      </div>
    </section>
  );
}
