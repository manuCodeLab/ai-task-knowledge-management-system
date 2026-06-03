import React from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/analytics").then(({ data }) => setAnalytics(data));
  }, []);

  if (!analytics) return <section className="page-heading"><h1>Analytics</h1></section>;

  const metrics = [
    ["Users", analytics.total_users],
    ["Tasks", analytics.total_tasks],
    ["Pending", analytics.pending_tasks],
    ["Completed", analytics.completed_tasks],
    ["Documents", analytics.total_documents],
    ["Activity Logs", analytics.total_activity_logs],
  ];

  return (
    <section>
      <div className="page-heading">
        <h1>Analytics</h1>
      </div>
      <div className="grid">
        {metrics.map(([label, value]) => (
          <article className="card metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
