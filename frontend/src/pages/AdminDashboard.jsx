import { BarChart3, ClipboardList, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { to: "/tasks", icon: ClipboardList, title: "Tasks", text: "Create and review assignments" },
  { to: "/documents", icon: FileText, title: "Documents", text: "Upload knowledge files" },
  { to: "/search", icon: Search, title: "Search", text: "Query indexed document chunks" },
  { to: "/analytics", icon: BarChart3, title: "Analytics", text: "Track usage and workload" },
];

export default function AdminDashboard() {
  return (
    <section>
      <div className="page-heading">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="grid">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Link className="card action-card" to={item.to} key={item.to}>
              <Icon size={24} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
