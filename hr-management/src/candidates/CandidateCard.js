import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/CandidateCard.css'

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
        const response = await fetch(`http://localhost:4000/api/getCandidateById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

    const downloadUrl = `http://localhost:4000/${candidate.resume}`;
    const filename = candidate.resume.split('/').pop();

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="candidate-card-loading">Loading...</div>;
  if (error) return <div className="candidate-card-error" style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;
  if (!candidate) return <div className="candidate-card-empty">No candidate found.</div>;

  return (
    <div
      className="candidate-card-container"
      style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '25px',
        borderRadius: '8px',
        backgroundColor: '#f5f7fa',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <h2 style={{ color: '#2c3e50', marginBottom: '15px', borderBottom: '2px solid #2980b9', paddingBottom: '8px' }}>
        {candidate.name}
      </h2>

      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: '0 0 4px 0', color: '#2980b9' }}>Email</h4>
        <p style={{ margin: 0, fontSize: '1rem' }}>{candidate.email}</p>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: '0 0 4px 0', color: '#2980b9' }}>Phone</h4>
        <p style={{ margin: 0, fontSize: '1rem' }}>{candidate.phone}</p>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: '0 0 4px 0', color: '#2980b9' }}>Position Applied</h4>
        <p style={{ margin: 0, fontSize: '1rem' }}>{candidate.position}</p>
      </div>


    </div>
  );
};

export default CandidateCard;
