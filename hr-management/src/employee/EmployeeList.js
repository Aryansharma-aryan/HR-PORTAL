import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">Employee List</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or position"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {filteredEmployees.length === 0 ? (
        <p className="text-center text-muted">No employees found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
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
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
