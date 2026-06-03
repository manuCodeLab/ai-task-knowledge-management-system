import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard.jsx";
import { api, getSessionUser } from "../services/api.js";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", assigned_to: "" });
  const user = getSessionUser();

  async function loadTasks() {
    const { data } = await api.get("/tasks");
    setTasks(data);
  }

  async function createTask(event) {
    event.preventDefault();
    await api.post("/tasks", {
      ...form,
      assigned_to: Number(form.assigned_to),
    });
    setForm({ title: "", description: "", assigned_to: "" });
    loadTasks();
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
            placeholder="User ID"
            required
          />
          <button>
            <Plus size={18} /> Create
          </button>
        </form>
      )}

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
