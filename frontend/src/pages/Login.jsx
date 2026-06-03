import { LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveSession } from "../services/api.js";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      saveSession(data);
      navigate(data.user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={submit}>
        <h1>AI Task Knowledge</h1>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button>
          <LogIn size={18} /> Login
        </button>
      </form>
    </main>
  );
}
