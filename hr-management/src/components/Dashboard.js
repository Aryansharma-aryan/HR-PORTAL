import React, { useEffect } from 'react';
import axios from '../axiosInstance';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';  // assuming you saved the CSS here

export default function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/protected'); // token automatically included
        console.log(res.data);
      } catch (err) {
        alert(err.response.data.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-links">
        <Link to='/candidate-list'>Candidates</Link>
        <Link to='/employee-list'>Employees</Link>
      </div>
    </div>
  );
}
