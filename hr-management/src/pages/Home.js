import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4000/api/getAllCandidates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  const handleEditClick = (candidate) => {
    setEditId(candidate._id);
    setEditData({ ...candidate });
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/updateCandidate/${editId}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCandidates((prev) =>
        prev.map((c) => (c._id === editId ? { ...editData } : c))
      );
      setEditId(null);
      setEditData({});
      alert("Candidate updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update candidate.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Candidate Management</h2>
        <Link to="/add-candidate" className="btn btn-success">
          Add Candidate
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by candidate name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Sr No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, index) => (
                <tr key={candidate._id}>
                  <td>{index + 1}</td>

                  {editId === candidate._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={editData.name}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={editData.email}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          value={editData.phone}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="position"
                          className="form-control"
                          value={editData.position}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <select
                          name="status"
                          className="form-select"
                          value={editData.status || "pending"}
                          onChange={handleChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="experience"
                          className="form-control"
                          value={editData.experience || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={handleSaveClick}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phone}</td>
                      <td>{candidate.position}</td>
                      <td>{candidate.status || "Pending"}</td>
                      <td>{candidate.experience || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEditClick(candidate)}
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-muted">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
