import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as UserService from "../services/UserService";
import "../styles/pages/Login.css";

export default function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await UserService.register(name, email, password);
      
      if (res.success) {
        const { token, ...userData } = res.data;
        login(userData, token); 
        navigate("/", { replace: true });
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Ai deja cont?{" "}
        <Link to="/login" style={{ color: "var(--primary-green)", fontWeight: 600 }}>
          Login
        </Link>
      </p>
    </div>
  );
}