import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const DentistAppointments = () => {
  const { dentistId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");

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

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
      <Link to="/doctors" style={{ color: "#005691", textDecoration: "underline", marginBottom: 24, display: "inline-block" }}>
        &larr; Doktorlara Dön
      </Link>
      <h1 style={{ color: "#005691", marginBottom: 16 }}>Dr. {doctorName} - Randevular</h1>
      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "#b71c1c" }}>{error}</p>}
      {!loading && appointments.length === 0 && !error && <p>Bu doktorun henüz randevusu yok.</p>}
      {!loading && appointments.length > 0 && (
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
            {appointments.map((app) => {
              // date formatting
              const start = app.startTime ? new Date(app.startTime) : null;
              const end = app.endTime ? new Date(app.endTime) : null;
              let tarih = start ? start.toLocaleDateString() : "-";
              let saat = (start && end)
                ? `${String(start.getHours()).padStart(2,"0")}:${String(start.getMinutes()).padStart(2,"0")}	-	${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")}`
                : "-";
              let hastaAd = app.patient?.firstName || "-";
              let tedavi = app.description || "-";
              return (
                <tr key={app.id} style={{ borderBottom: "1px solid #cfd8dc" }}>
                  <td style={tdStyle}>{tarih}</td>
                  <td style={tdStyle}>{saat}</td>
                  <td style={tdStyle}>{hastaAd}</td>
                  <td style={tdStyle}>{tedavi}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

