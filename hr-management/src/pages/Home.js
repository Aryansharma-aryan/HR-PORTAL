import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/Home.css";

const Home = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch all candidates
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

  // Start editing
  const handleEditClick = (candidate) => {
    setEditId(candidate._id);
    setEditData({ ...candidate });
  };

  // Cancel editing
  const handleCancelClick = () => {
    setEditId(null);
    setEditData({});
  };

  // Save edited candidate
  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/updateCandidate/${editId}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI
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

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="top-bar" style={{ marginBottom: "10px" }}>
        <Link to="/add-candidate" className="add-candidate-btn">
          Add Candidate
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by candidate name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "15px" }}
      />

      <div className="candidate-table">
        <table>
          <thead>
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
                          value={editData.name}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="phone"
                          value={editData.phone}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="position"
                          value={editData.position}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <select
                          name="status"
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
                          value={editData.experience || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <button onClick={handleSaveClick}>Save</button>
                        <button
                          onClick={handleCancelClick}
                          style={{ marginLeft: "5px" }}
                        >
                          Cancel
                        </button>
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
                        <button onClick={() => handleEditClick(candidate)}>
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No candidates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
