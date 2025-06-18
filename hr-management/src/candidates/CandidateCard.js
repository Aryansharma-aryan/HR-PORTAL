import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CandidateCard = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No auth token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://hr-portal-1-xf68.onrender.com/api/getCandidateById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `Error: ${response.status}`);
        }

        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleDownload = () => {
    if (!candidate?.resume) {
      alert('No resume available');
      return;
    }

    const downloadUrl = `https://hr-portal-1-xf68.onrender.com/${candidate.resume}`;
    const filename = candidate.resume.split('/').pop();

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  if (!candidate) return <div className="text-center mt-5">No candidate found.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">{candidate.name}</h3>
        </div>
        <div className="card-body">
          <p><strong>Email:</strong> {candidate.email}</p>
          <p><strong>Phone:</strong> {candidate.phone}</p>
          <p><strong>Position Applied:</strong> {candidate.position}</p>

          {candidate.skills && (
            <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
          )}

          {candidate.experience && (
            <p><strong>Experience:</strong> {candidate.experience} years</p>
          )}

          {candidate.resume && (
            <button className="btn btn-success mt-3" onClick={handleDownload}>
              Download Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
