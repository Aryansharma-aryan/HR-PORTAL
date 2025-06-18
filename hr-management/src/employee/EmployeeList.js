import React, { useState, useEffect } from 'react';
import '../css/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch employees from the API
  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No auth token found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://hr-portal-1-xf68.onrender.com/api/getAllEmployee', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setEmployees(data);
        setFilteredEmployees(data);
      } else {
        setError('Unexpected data format received.');
      }
    } catch (err) {
      setError('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Search filter logic
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = employees.filter((employee) =>
      employee.name?.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.position?.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
  };

  // Delete employee
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No auth token found.');
      return;
    }

    try {
      const response = await fetch(`https://hr-portal-1-xf68.onrender.com/api/deleteCandidate/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        setFilteredEmployees((prev) => prev.filter((emp) => emp._id !== id));
      } else {
        setError(data.message || 'Failed to delete employee.');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting employee.');
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="employee-list-container">
      <h2 className="employee-list-title">Employee List</h2>
      

      <input
        type="text"
        placeholder="Search by name, email, or position"
        value={searchQuery}
        onChange={handleSearch}
        className="employee-search-input"
      />

      {filteredEmployees.length === 0 ? (
        <p className="no-employees">No employees found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
