import React, { useEffect } from "react";
import axios from "../axiosInstance";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/protected"); // token automatically included
        console.log(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Unauthorized");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-5 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center text-primary mb-4">Dashboard</h2>

        <div className="d-grid gap-3">
          <Link to="/candidate-list" className="btn btn-outline-primary btn-lg">
            View Candidates
          </Link>
          <Link to="/employee-list" className="btn btn-outline-success btn-lg">
            View Employees
          </Link>
        </div>
      </div>
    </div>
  );
}
