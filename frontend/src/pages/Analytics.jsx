import React from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/analytics")
      .then(({ data }) => setAnalytics(data))
      .catch((err) => setError(err.response?.data?.detail || "Could not load analytics"));
  }, []);

  if (!analytics) {
    return (
      <section>
        <div className="page-heading">
          <h1>Analytics</h1>
        </div>
        {error ? <p className="error task-error">{error}</p> : <p className="muted">Loading analytics...</p>}
      </section>
    );
  }

  const metrics = [
    ["Users", analytics.total_users],
    ["Tasks", analytics.total_tasks],
    ["Pending", analytics.pending_tasks],
    ["Completed", analytics.completed_tasks],
    ["Documents", analytics.total_documents],
    ["Activity Logs", analytics.total_activity_logs],
    ["Searches", analytics.total_searches],
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
      {analytics.most_searched_queries?.length > 0 && (
        <div className="list analytics-list">
          {analytics.most_searched_queries.map((item) => (
            <article className="card" key={item.query}>
              <h3>{item.query}</h3>
              <span>{item.count} searches</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
