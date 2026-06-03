import { CheckCircle2, Circle } from "lucide-react";

export default function TaskCard({ task, canUpdate, onComplete }) {
  const completed = task.status === "completed";

  return (
    <article className="card task-card">
      <div>
        <div className={`status ${completed ? "done" : ""}`}>
          {completed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
          {task.status}
        </div>
        <h3>{task.title}</h3>
        <p>{task.description || "No description"}</p>
        <span>Assigned to {task.assignee_name || `user #${task.assigned_to}`}</span>
      </div>
      {canUpdate && !completed && (
        <button onClick={() => onComplete(task.id)}>
          <CheckCircle2 size={18} /> Complete
        </button>
      )}
    </article>
  );
}
