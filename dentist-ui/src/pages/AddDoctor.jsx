import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddDoctor.css";
import { API_ENDPOINTS } from "../config/api";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    ad: "",
    unvan: "",
    email: "",
    uzmanliklar: []
  });
  const [uzmanlikInput, setUzmanlikInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUzmanlik = () => {
    if (uzmanlikInput.trim() && !formData.uzmanliklar.includes(uzmanlikInput.trim())) {
      setFormData(prev => ({
        ...prev,
        uzmanliklar: [...prev.uzmanliklar, uzmanlikInput.trim()]
      }));
      setUzmanlikInput("");
    }
  };

  const handleRemoveUzmanlik = (index) => {
    setFormData(prev => ({
      ...prev,
      uzmanliklar: prev.uzmanliklar.filter((_, i) => i !== index)
    }));
  };

  const handleUzmanlikKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUzmanlik();
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!formData.ad.trim()) {
      setError("Doktor adı gereklidir");
      setLoading(false);
      return;
    }

    if (!formData.unvan.trim()) {
      setError("Bölüm gereklidir");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("E-posta gereklidir");
      setLoading(false);
      return;
    }

    try {
      
      const requestBody = {
        fullName: formData.ad.trim(),
        email: formData.email.trim(),
        title: formData.unvan.trim(),
        specialty: formData.uzmanliklar.length > 0 ? formData.uzmanliklar : []
      };
      
      console.log('Sending to backend:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(API_ENDPOINTS.DENTISTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess(true);
      
      // Formu temizle
      setFormData({
        ad: "",
        unvan: "",
        email: "",
        uzmanliklar: []
      });
      setUzmanlikInput("");

      // 2 saniye sonra doktorlar sayfasına yönlendir
      setTimeout(() => {
        navigate('/doctors');
      }, 2000);

    } catch (err) {
      console.error('Error adding doctor:', err);
      setError(err.message || "Doktor eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-doctor-wrapper">
      <div className="add-doctor-header">
        <h1>Yeni Doktor Ekle</h1>
        <p>Klinik kadrosuna yeni bir doktor ekleyin</p>
      </div>

      <div className="add-doctor-form-container">
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✓</span>
            <span>Doktor başarıyla eklendi! Doktorlar sayfasına yönlendiriliyorsunuz...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-doctor-form">
          <div className="form-group">
            <label htmlFor="ad">
              Doktor Adı Soyadı <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ad"
              name="ad"
              value={formData.ad}
              onChange={handleInputChange}
              placeholder="Örn: Dt. Ahmet Yılmaz"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="unvan">
              Ünvan <span className="required">*</span>
            </label>
            <input
              type="text"
              id="unvan"
              name="unvan"
              value={formData.unvan}
              onChange={handleInputChange}
              placeholder="Örn: Ortodonti, Pedodonti, Endodonti"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              E-posta <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="doktor@klinik.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="uzmanlik">
              Uzmanlık Alanları
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                id="uzmanlik"
                value={uzmanlikInput}
                onChange={(e) => setUzmanlikInput(e.target.value)}
                onKeyPress={handleUzmanlikKeyPress}
                placeholder="Uzmanlık alanı girin"
                disabled={loading}
                style={{ flex: 1, padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              />
              <button
                type="button"
                onClick={handleAddUzmanlik}
                disabled={loading || !uzmanlikInput.trim()}
                style={{
                  padding: '12px 24px',
                  background: '#005691',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading || !uzmanlikInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !uzmanlikInput.trim() ? 0.6 : 1
                }}
              >
                Ekle
              </button>
            </div>
            {formData.uzmanliklar.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {formData.uzmanliklar.map((uzmanlik, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      background: '#e3f2fd',
                      color: '#005691',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    {uzmanlik}
                    <button
                      type="button"
                      onClick={() => handleRemoveUzmanlik(index)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#005691',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        lineHeight: '1',
                        padding: '0',
                        marginLeft: '4px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/doctors')}
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !formData.ad.trim() || !formData.unvan.trim() || !formData.email.trim()}
            >
              {loading ? "Ekleniyor..." : "Doktor Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;


