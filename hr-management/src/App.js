import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CandidateList from './candidates/CandidateList';
import CandidateCard from './candidates/CandidateCard';
import EmployeeList from './employee/EmployeeList';

import CandidateForm from './candidates/CandidateForm';
import Attendence from './pages/Attendence';
import ProtectedRoute from './components/protectedRoute';

import './App.css';

function App() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');

  // 🛑 Hide Navbar and Sidebar on login or register page
  const hideNavAndSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {/* Navbar */}
      {isAuthenticated && !hideNavAndSidebar && <Navbar />}

      {/* Sidebar and Main Content */}
      <div style={{ display: 'flex' }}>
        

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/candidate-list" element={<ProtectedRoute><CandidateList /></ProtectedRoute>} />
            <Route path="/candidates/:id" element={<ProtectedRoute><CandidateCard /></ProtectedRoute>} />
            <Route path="/employee-list" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
            <Route path="/add-candidate" element={<ProtectedRoute><CandidateForm /></ProtectedRoute>} />
            <Route path="/attendence" element={<ProtectedRoute><Attendence /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
