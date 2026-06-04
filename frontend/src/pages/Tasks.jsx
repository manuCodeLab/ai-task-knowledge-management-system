import { Plus } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard.jsx";
import { api, getSessionUser } from "../services/api.js";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", assigned_to: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const user = getSessionUser();

  async function loadTasks() {
    setError("");
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load tasks");
    }
  }

  async function createTask(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const { data } = await api.post("/tasks", {
        ...form,
        assigned_to: Number(form.assigned_to),
      });
      setForm({ title: "", description: "", assigned_to: "" });
      await loadTasks();
      setMessage(`Task #${data.id} created`);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create task");
    } finally {
      setSaving(false);
    }
  }

  async function completeTask(taskId) {
    await api.patch(`/tasks/${taskId}`, { status: "completed" });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <h1>Tasks</h1>
      </div>

      {user?.role === "admin" && (
        <form className="task-form" onSubmit={createTask}>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Task title"
            required
          />
          <input
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Description"
          />
          <input
            type="number"
            value={form.assigned_to}
            onChange={(event) => setForm({ ...form, assigned_to: event.target.value })}
            placeholder="User ID, e.g. 2"
            required
          />
          <button disabled={saving}>
            <Plus size={18} /> {saving ? "Creating" : "Create"}
          </button>
        </form>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error task-error">{error}</p>}
      {tasks.length === 0 && !error && <p className="muted">No tasks found</p>}

      <div className="list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            canUpdate={user?.role === "user"}
            onComplete={completeTask}
          />
        ))}
      </div>
    </section>
  );
}
