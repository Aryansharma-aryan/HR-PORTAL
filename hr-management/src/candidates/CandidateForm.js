import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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

      const res = await axios.post(
        'https://hr-portal-1-xf68.onrender.com/api/createCandidate',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <div className="container mt-5">
      <div className="card shadow p-4 bg-light">
        <h2 className="card-title mb-4 text-primary">Add Candidate</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={candidateData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={candidateData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={candidateData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Position</label>
              <input
                type="text"
                name="position"
                className="form-control"
                value={candidateData.position}
                onChange={handleChange}
                placeholder="Enter position"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Resume (PDF only)</label>
              <input
                type="file"
                name="resume"
                accept=".pdf"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Add Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
