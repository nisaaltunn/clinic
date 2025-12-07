import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctors.css";
import { API_ENDPOINTS } from "../config/api";

const Doctors = () => {
  const navigate = useNavigate();
  const [doktorlar, setDoktorlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.DENTISTS);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDoktorlar(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError("Doktorlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "DR";
    const parts = name.trim().split(" ").filter(Boolean);
    let initials = "";
    for (let i = 0; i < parts.length && initials.length < 2; i++) {
      const c = parts[i][0];
      if (c && c.match(/[A-Za-zÇĞİÖŞÜçğıöşü]/)) {
        initials += c;
      }
    }
    return initials.toUpperCase() || "DR";
  };

  if (loading) {
    return (
      <div className="doctors-page-wrapper">
        <div className="doctors-header">
          <h1>Uzman Kadromuz</h1>
          <p>Yükleniyor...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>Doktorlar yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctors-page-wrapper">
        <div className="doctors-header">
          <h1>Uzman Kadromuz</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', color: '#c33', marginBottom: '20px' }}>⚠️ {error}</div>
          <button 
            className="add-doctor-btn"
            onClick={() => window.location.reload()}
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-page-wrapper">
      <div className="doctors-header">
        <h1>Uzman Kadromuz</h1>
        <p>Deneyimli ve uzman hekimlerimizle sağlığınız emin ellerde.</p>
        <button 
          className="add-doctor-btn"
          onClick={() => navigate('/doctors/add')}
        >
          + Yeni Doktor Ekle
        </button>
      </div>

      {doktorlar.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
            Henüz doktor eklenmemiş.
          </div>
        </div>
      ) : (
        <div className="doctors-grid">
          {doktorlar.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <div className="doc-avatar">
                {getInitials(doc.fullName || '')}
              </div>
              <div className="doc-info">
                <h3>{doc.fullName}</h3>
                <span className="doc-title">{doc.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;