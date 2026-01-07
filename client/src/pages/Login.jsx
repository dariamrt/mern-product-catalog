import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as UserService from "../services/UserService";
import "../styles/pages/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await UserService.login(email, password);
      if (res.success) {
        const { token, ...user } = res.data;
        login(user, token);
        navigate("/", { replace: true });
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Nu ai cont?{" "}
        <Link to="/register" style={{ color: "var(--primary-green)", fontWeight: 600 }}>
          Înregistrează-te
        </Link>
      </p>
    </div>
  );
}