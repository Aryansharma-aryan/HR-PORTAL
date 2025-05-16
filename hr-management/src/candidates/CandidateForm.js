// CandidateForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/CandidateForm.css'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

const CandidateForm = () => {
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCandidateData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authorization token not found!');
      return;
    }

    const formData = new FormData();
    Object.keys(candidateData).forEach((key) =>
      formData.append(key, candidateData[key])
    );

    try {
      setIsSubmitting(true);

      const res = await axios.post('http://localhost:4000/api/createCandidate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Candidate created successfully!');
      navigate('/candidate-list');

      setCandidateData({
        name: '',
        email: '',
        phone: '',
        position: '',
        resume: null,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error submitting form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="candidate-form-container"style={{backgroundColor:"lightcyan"}}>
      <h2 className="form-title">Add Candidate</h2>
      <form className="candidate-form" onSubmit={handleSubmit}>
        <div className="form-grid"style={{marginLeft:"30px"}}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={candidateData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={candidateData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={candidateData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={candidateData.position}
              onChange={handleChange}
              placeholder="Enter position"
              required
            />
          </div>

          <div className="form-group">
            <label>Resume (PDF only)</label>
            <input 
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}style={{marginBottomm:"520px",marginLeft:"20px"}}>
          {isSubmitting ? 'Submitting...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
