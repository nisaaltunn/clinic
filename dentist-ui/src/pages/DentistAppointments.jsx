import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const DentistAppointments = () => {
  const { dentistId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [showPastOnly, setShowPastOnly] = useState(false);
  const [queueModal, setQueueModal] = useState({ open: false });
  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState(null);
  const [callingNext, setCallingNext] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        setError(null);
        // Fetch dentist name
        const docRes = await fetch(API_ENDPOINTS.DENTIST_BY_ID(dentistId));
        if (docRes.ok) {
          const docData = await docRes.json();
          setDoctorName(docData.fullName || "");
        }
    

        const res = await fetch(API_ENDPOINTS.DENTIST_APPOINTMENTS_SORTED(dentistId));
        if (!res.ok) throw new Error("Randevu listesi getirilemedi.");
        const data = await res.json();
        setAppointments(data);
      
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [dentistId]);

  const handleViewQueue = async () => {
    setQueueModal({ open: true });
    setQueueError(null);
    
    try {
      setQueueLoading(true);
      const response = await fetch(API_ENDPOINTS.EMERGENCY_QUEUE(dentistId));
      if (!response.ok) throw new Error("Kuyruk bilgisi alınamadı.");
      const data = await response.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      setQueueError("Kuyruk bilgisi yüklenirken hata oluştu.");
      setQueue([]);
    } finally {
      setQueueLoading(false);
    }
  };

  const handleCallNext = async () => {
    if (!window.confirm("Sıradaki hastayı çağırmak istediğinizden emin misiniz?")) {
      return;
    }

    try {
      setCallingNext(true);
      const response = await fetch(API_ENDPOINTS.EMERGENCY_NEXT(dentistId), {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error("Hasta çağırılamadı.");
      
      // Kuyruğu yenile
      const queueResponse = await fetch(API_ENDPOINTS.EMERGENCY_QUEUE(dentistId));
      if (queueResponse.ok) {
        const data = await queueResponse.json();
        setQueue(Array.isArray(data) ? data : []);
      }
      
      alert("Sıradaki hasta başarıyla çağrıldı!");
    } catch (err) {
      alert("Hasta çağrılırken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setCallingNext(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
      <Link to="/doctors" style={{ color: "#005691", textDecoration: "underline", marginBottom: 24, display: "inline-block" }}>
        &larr; Doktorlara Dön
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: "10px" }}>
        <h1 style={{ color: "#005691", margin: 0 }}>Dr. {doctorName} - Randevular</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            onClick={handleViewQueue}
            style={{
              padding: "10px 20px",
              background: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 600,
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#f57c00"}
            onMouseLeave={(e) => e.target.style.background = "#ff9800"}
          >
            🚨 Kuyruğu Gör
          </button>
          <button 
            onClick={() => setShowPastOnly(!showPastOnly)}
            style={{
              padding: "10px 20px",
              background: showPastOnly ? "#c22" : "#005691",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 600,
              transition: "background 0.2s"
            }}
          >
            {showPastOnly ? "Tüm Randevular" : "Geçen Randevular"}
          </button>
        </div>
      </div>
      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "#b71c1c" }}>{error}</p>}
      {!loading && appointments.length === 0 && !error && <p>Bu doktorun henüz randevusu yok.</p>}
      {!loading && (() => {
        const now = new Date();
        const filteredAppointments = showPastOnly 
          ? appointments.filter(app => {
              const end = app.endTime ? new Date(app.endTime) : null;
              return end && end < now;
            })
          : appointments.filter(app => {
              const end = app.endTime ? new Date(app.endTime) : null;
              return !end || end >= now;
            });
        
        if (filteredAppointments.length === 0) {
          return <p>{showPastOnly ? "Geçen randevu bulunmamaktadır." : "Gelecek randevu bulunmamaktadır."}</p>;
        }
        
        return (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 32, background: "#f9fafe", borderRadius: 8 }}>
          <thead style={{ background: "#e3f2fd" }}>
            <tr>
              <th style={thStyle}>Tarih</th>
              <th style={thStyle}>Saat</th>
              <th style={thStyle}>Hasta Adı</th>
              <th style={thStyle}>Tedavi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => {
              // date formatting
              const start = app.startTime ? new Date(app.startTime) : null;
              const end = app.endTime ? new Date(app.endTime) : null;
              let tarih = start ? start.toLocaleDateString() : "-";
              let saat = (start && end)
                ? `${String(start.getHours()).padStart(2,"0")}:${String(start.getMinutes()).padStart(2,"0")}	-	${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")}`
                : "-";
              let hastaAd = app.patient?.firstName || "-";
              let tedavi = app.description || "-";
              const isPast = end && end < now;
              return (
                <tr key={app.id} style={{ borderBottom: "1px solid #cfd8dc", background: isPast ? '#ffecec' : undefined }}>
                  <td style={tdStyle}>{tarih} {isPast && <span style={{fontSize:12, color:'#c22', fontWeight:600, marginLeft: 6}}>geçti</span>}</td>
                  <td style={tdStyle}>{saat}</td>
                  <td style={tdStyle}>{hastaAd}</td>
                  <td style={tdStyle}>{tedavi}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        );
      })()}

      {/* Kuyruk Modal */}
      {queueModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setQueueModal({ open: false })}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#005691', margin: 0 }}>
                🚨 Dr. {doctorName} - Acil Kuyruğu
              </h2>
              <button
                onClick={() => setQueueModal({ open: false })}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {queueLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '1.1rem', color: '#666' }}>Kuyruk yükleniyor...</div>
              </div>
            ) : queueError ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#c33' }}>
                ⚠️ {queueError}
              </div>
            ) : queue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Kuyrukta hasta bulunmamaktadır.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    background: '#fff3cd', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ffc107'
                  }}>
                    <strong style={{ color: '#856404' }}>
                      Kuyrukta {queue.length} hasta bulunmaktadır
                    </strong>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {queue.map((patient, index) => (
                      <div
                        key={patient.id || index}
                        style={{
                          padding: '15px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          background: index === 0 ? '#e3f2fd' : '#f9f9f9'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#333', marginBottom: '5px' }}>
                              #{index + 1} - {patient.firstName || patient.fullName || patient.name || 'İsimsiz Hasta'}
                            </div>
                            {patient.tcNo && (
                              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                TC: {patient.tcNo}
                              </div>
                            )}
                          </div>
                          {index === 0 && (
                            <span style={{
                              background: '#4caf50',
                              color: 'white',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}>
                              Sırada
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleCallNext}
                  disabled={callingNext || queue.length === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: callingNext || queue.length === 0 ? '#ccc' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: callingNext || queue.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!callingNext && queue.length > 0) {
                      e.target.style.background = '#45a049';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!callingNext && queue.length > 0) {
                      e.target.style.background = '#4caf50';
                    }
                  }}
                >
                  {callingNext ? 'Çağrılıyor...' : '📞 Sıradaki Hastayı Çağır'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: "12px 8px",
  textAlign: "left",
  fontWeight: 700,
  color: "#0d344f"
};
const tdStyle = {
  padding: "7px 8px",
  color: "#234"
};

export default DentistAppointments;