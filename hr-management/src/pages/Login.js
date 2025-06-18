import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // ✅ Import your auth context
import "../css/Login.css"; // ✅ Import the CSS file

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://hr-portal-1-xf68.onrender.com/api/login", formData);

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update context
      login(res.data.token, res.data.user);

      // Navigate to homepage or dashboard
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container "
      style={{
        height: "400px",
        background: "linear-gradient(to right, lightgrey,cyan)",
        marginTop: "10%",
      }}
    >
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          style={{ width: "100%" }}
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          style={{ width: "100%" }}
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account? <Link to="/register">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
