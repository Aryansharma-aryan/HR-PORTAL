import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/CandidateList.css';

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
      const response = await fetch('http://localhost:4000/api/getAllCandidates', {
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
    if (!resumePath) {
      alert('No resume available for download.');
      return;
    }

    const downloadUrl = `http://localhost:4000/${resumePath}`;
    const filename = resumePath.split('/').pop();

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id, value) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No auth token found.');
      return;
    }

    try {
      if (value === 'selected') {
        const res = await fetch(`http://localhost:4000/api/candidatetoemployee/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to move candidate to employee: ${errText}`);
        }

        alert('Candidate successfully moved to employee.');
      }

      const statusRes = await fetch(`http://localhost:4000/api/updateCandidateStatus/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: value }),
      });

      if (!statusRes.ok) {
        const errMsg = await statusRes.text();
        throw new Error(`Failed to update status: ${errMsg}`);
      }

      fetchCandidates();
    } catch (err) {
      alert(err.message || 'Error updating status.');
      console.error(err);
    }
  };

  const handleEdit = (candidate) => {
    setEditRowId(candidate._id);
    setEditForm({
      name: candidate.name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      position: candidate.position || '',
      status: candidate.status || 'new',
    });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      status: '',
    });
  };

  const handleSave = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No auth token found.');

    try {
      const response = await fetch(`http://localhost:4000/api/updateCandidate/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Update failed: ${errText}`);
      }

      setEditRowId(null);
      fetchCandidates();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this candidate?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('No auth token found.');

    try {
      const response = await fetch(`http://localhost:4000/api/deleteCandidate/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Delete failed: ${errText}`);
      }

      alert('Candidate deleted successfully.');
      fetchCandidates();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="candidate-list-loading">Loading...</div>;
  if (error) return <div className="candidate-list-error">{error}</div>;

  return (
    <div className="candidate-list-container">
      <h2 className="candidate-list-title">Candidates</h2>

      {candidates.length === 0 ? (
        <p className="candidate-list-empty">No candidates found.</p>
      ) : (
        <div className="table-responsive">
          <table className="candidate-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Resume</th>
                <th style={{color:"green"}}>Status</th>
                <th style={{color:"red"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  {editRowId === candidate._id ? (
                    <>
                      <td><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                      <td><input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></td>
                      <td><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></td>
                      <td><input type="text" value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} /></td>
                      <td>
                        {candidate.resumePath ? (
                          <button className="btn-download" onClick={() => handleDownload(candidate.resumePath)}>Download</button>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                          <option value="new">New</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-save" onClick={() => handleSave(candidate._id)}>Save</button>
                        <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                        <button className="btn-delete" onClick={() => handleDelete(candidate._id)}>Delete</button>
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
                          <button className="btn-download" onClick={() => handleDownload(candidate.resumePath)}>Download</button>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <select value={candidate.status || 'new'} onChange={(e) => handleStatusChange(candidate._id, e.target.value)}>
                          <option value="new">New</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(candidate)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(candidate._id)}>Delete</button>
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
