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
import Layout from './components/Layout'; // Import Layout

import './App.css';

function App() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');

  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {/* Direct pages without layout */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* All other pages inside layout */}
        {!hideNav && (
          <>
            <Route
              path="/"
              element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/candidate-list"
              element={<ProtectedRoute><Layout><CandidateList /></Layout></ProtectedRoute>}
            />
            <Route
              path="/candidates/:id"
              element={<ProtectedRoute><Layout><CandidateCard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/employee-list"
              element={<ProtectedRoute><Layout><EmployeeList /></Layout></ProtectedRoute>}
            />
            <Route
              path="/add-candidate"
              element={<ProtectedRoute><Layout><CandidateForm /></Layout></ProtectedRoute>}
            />
            <Route
              path="/attendence"
              element={<ProtectedRoute><Layout><Attendence /></Layout></ProtectedRoute>}
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
