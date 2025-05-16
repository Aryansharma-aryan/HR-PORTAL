import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError((prev) => ({ ...prev, [event.target.name]: "", api: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };

    // Basic frontend validations
    if (trimmedData.password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    if (trimmedData.password !== trimmedData.confirmPassword) {
      setError((prev) => ({ ...prev, password: "Passwords do not match" }));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/register", {
        name: trimmedData.name,
        email: trimmedData.email,
        password: trimmedData.password,
        confirmPassword: trimmedData.confirmPassword,
        role: "employee",
      });

      console.log("Signup Success:", response.data);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login"); // Redirect after successful signup
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      setError((prev) => ({
        ...prev,
        api:
          error.response?.data?.message ||
          "Failed to register. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        background: "linear-gradient(to right,lightgrey,cyan)",
        marginTop: "10%",
      }}
    >
      <h1>Signup Form</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Error messages */}
        {error.password && <p className="error-message">{error.password}</p>}
        {error.api && <p className="error-message">{error.api}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
