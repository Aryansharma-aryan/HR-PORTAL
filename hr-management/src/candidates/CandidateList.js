import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: '',
  });

  const fetchCandidates = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No auth token found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://hr-portal-1-xf68.onrender.com/api/getAllCandidates', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error: ${response.status} ${errText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCandidates(data);
      } else {
        throw new Error('Unexpected data format received.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDownload = (resumePath) => {
    if (!resumePath) return alert('No resume available.');
    const link = document.createElement('a');
    link.href = `https://hr-portal-1-xf68.onrender.com/${resumePath}`;
    link.download = resumePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id, value) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No auth token found.');

    try {
      if (value === 'selected') {
        const res = await fetch(`https://hr-portal-1-xf68.onrender.com/api/candidatetoemployee/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to convert candidate to employee.');
        alert('Moved to employee.');
      }

      const statusRes = await fetch(`https://hr-portal-1-xf68.onrender.com/api/updateCandidateStatus/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: value }),
      });

      if (!statusRes.ok) throw new Error('Failed to update status.');
      fetchCandidates();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (candidate) => {
    setEditRowId(candidate._id);
    setEditForm({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      status: candidate.status || 'new',
    });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditForm({ name: '', email: '', phone: '', position: '', status: '' });
  };

  const handleSave = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No auth token found.');

    try {
      const res = await fetch(`https://hr-portal-1-xf68.onrender.com/api/updateCandidate/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Update failed.');
      setEditRowId(null);
      fetchCandidates();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this candidate?')) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('No auth token found.');

    try {
      const res = await fetch(`https://hr-portal-1-xf68.onrender.com/api/deleteCandidate/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed.');
      alert('Candidate deleted.');
      fetchCandidates();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Candidate List</h2>
      {candidates.length === 0 ? (
        <p>No candidates available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  {editRowId === candidate._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          className="form-control"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.position}
                          onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        />
                      </td>
                      <td>
                        {candidate.resumePath ? (
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleDownload(candidate.resumePath)}>
                            Download
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                          <option value="new">New</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(candidate._id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm me-2" onClick={handleCancel}>
                          Cancel
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(candidate._id)}>
                          Delete
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phone}</td>
                      <td>{candidate.position}</td>
                      <td>
                        {candidate.resumePath ? (
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleDownload(candidate.resumePath)}>
                            Download
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={candidate.status || 'new'}
                          onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(candidate)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(candidate._id)}>
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
