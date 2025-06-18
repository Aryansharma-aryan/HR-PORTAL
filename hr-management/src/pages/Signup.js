import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

    if (trimmedData.password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    if (trimmedData.password !== trimmedData.confirmPassword) {
      setError((prev) => ({
        ...prev,
        password: "Passwords do not match",
      }));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://hr-portal-1-xf68.onrender.com/api/register",
        {
          name: trimmedData.name,
          email: trimmedData.email,
          password: trimmedData.password,
          confirmPassword: trimmedData.confirmPassword,
          role: "employee",
        }
      );

      console.log("Signup Success:", response.data);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
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
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div
        className="card p-4 shadow-lg w-100"
        style={{ maxWidth: "450px", background: "linear-gradient(to right, lightgrey, cyan)" }}
      >
        <h2 className="text-center mb-4 text-primary">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error.password && (
            <div className="alert alert-danger py-2">{error.password}</div>
          )}
          {error.api && (
            <div className="alert alert-danger py-2">{error.api}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>

          <div className="mt-3 text-center">
            <p className="mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-bold text-decoration-none">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
