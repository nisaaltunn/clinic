import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Appointment.css";
import { API_ENDPOINTS } from "../config/api";

const Appointment = () => {
  const bugun = new Date().toISOString().slice(0, 10);
  const [uygunDoktorlar, setUygunDoktorlar] = useState([]);
  const [doktorlarYukleniyor, setDoktorlarYukleniyor] = useState(false);
  const [doktorHatasi, setDoktorHatasi] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emergencySuccess, setEmergencySuccess] = useState(false);
  const [alternatifSaatler, setAlternatifSaatler] = useState([]);
  
  // Kayıt durumu
  const [isRegistered, setIsRegistered] = useState(false);
  const [patientId, setPatientId] = useState(null); // Hasta ID'si
  const [registrationData, setRegistrationData] = useState({
    tc: "",
    adSoyad: ""
  });
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false); // true: giriş, false: kayıt

  const [formData, setFormData] = useState({
    tedavi: "",
    doktorId: "",
    tarih: bugun,
    saat: "09:00",
    hastaAd: "",
    acil: false
  });

  const tedaviler = [
    { id: 1, ad: "Genel Muayene", sure: 15, specialty: "Genel Muayene" },
    { id: 2, ad: "Ortodonti", sure: 30, specialty: "Ortodonti" },
    { id: 3, ad: "Kanal Tedavisi (Endodonti)", sure: 60, specialty: "Kanal Tedavisi" },
    { id: 4, ad: "Diş Eti Tedavisi (Periodontoloji)", sure: 30, specialty: "Diş Eti Tedavisi" },
    { id: 5, ad: "Çocuk Diş (Pedodonti)", sure: 30, specialty: "Çocuk Diş" },
    { id: 6, ad: "Diş İmplantı", sure: 60, specialty: "İmplant" },
    { id: 7, ad: "Estetik Diş Hekimliği", sure: 60, specialty: "Estetik Diş" },
    { id: 8, ad: "Çene Cerrahisi", sure: 60, specialty: "Çene Cerrahisi" },
  ];

  // Branş seçildiğinde o specialty'ye göre doktorları API'den çek
  useEffect(() => {
    const fetchDoctorsBySpecialty = async () => {
      const secilenTedavi = tedaviler.find(t => t.id === parseInt(formData.tedavi));
      if (!formData.tedavi || !secilenTedavi || !secilenTedavi.specialty) {
        setUygunDoktorlar([]);
        setFormData(prev => ({ ...prev, doktorId: "" }));
        return;
      }

      try {
        setDoktorlarYukleniyor(true);
        setDoktorHatasi(null);
        const specialty = secilenTedavi.specialty;
        const response = await fetch(API_ENDPOINTS.DENTISTS_BY_SPECIALTY(specialty));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUygunDoktorlar(Array.isArray(data) ? data : []);
        // Doktor listesi değiştiğinde seçimi sıfırla
        setFormData(prev => ({ ...prev, doktorId: "" }));
      } catch (err) {
        console.error('Error fetching doctors by specialty:', err);
        setDoktorHatasi("Doktorlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        setUygunDoktorlar([]);
      } finally {
        setDoktorlarYukleniyor(false);
      }
    };

    fetchDoctorsBySpecialty();
  }, [formData.tedavi]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Hata ve success mesajlarını temizle
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(false);
    // Saat değiştiğinde alternatif saatleri temizle (yeni saat seçildi)
    if (name === 'saat' && alternatifSaatler.length > 0) {
      setAlternatifSaatler([]);
    }
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    // TC için sadece rakam kabul et
    if (name === 'tc') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 11) {
        setRegistrationData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
    } else {
      setRegistrationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (registrationError) setRegistrationError(null);
  };

  // TC ile hasta kontrolü (giriş)
  const handleLogin = async () => {
    setRegistrationError(null);

    // Validasyon
    if (!registrationData.tc || registrationData.tc.length !== 11) {
      setRegistrationError("TC Kimlik Numarası 11 haneli olmalıdır.");
      return;
    }

    try {
      setRegistrationLoading(true);
      
      // TC kimlik numarası validasyonu (basit kontrol)
      const tcDigits = registrationData.tc.split('').map(Number);
      if (tcDigits[0] === 0) {
        setRegistrationError("TC Kimlik Numarası 0 ile başlayamaz.");
        setRegistrationLoading(false);
        return;
      }

      // TC ile hasta kontrolü
      const response = await axios.get(API_ENDPOINTS.PATIENT_BY_TC(registrationData.tc));
      
      if (response.data) {
        // Hasta bulundu, giriş yap
        const patientData = response.data;
        const patientIdValue = patientData.patientId || patientData.id || patientData.patient_id;
        
        setPatientId(patientIdValue);
        setRegistrationData(prev => ({
          ...prev,
          adSoyad: patientData.fullName || patientData.name || patientData.adSoyad || ""
        }));
        setIsRegistered(true);
        setFormData(prev => ({
          ...prev,
          hastaAd: patientData.fullName || patientData.name || patientData.adSoyad || ""
        }));
      } else {
        setRegistrationError("Bu TC kimlik numarası ile kayıtlı hasta bulunamadı. Lütfen önce kayıt olun.");
      }

    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 404) {
        setRegistrationError("Bu TC kimlik numarası ile kayıtlı hasta bulunamadı. Lütfen önce kayıt olun.");
      } else {
        setRegistrationError("Giriş işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Yeni hasta kaydı
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError(null);

    // Validasyon
    if (!registrationData.tc || registrationData.tc.length !== 11) {
      setRegistrationError("TC Kimlik Numarası 11 haneli olmalıdır.");
      return;
    }

    if (!registrationData.adSoyad || registrationData.adSoyad.trim().length < 3) {
      setRegistrationError("Lütfen geçerli bir ad soyad giriniz (en az 3 karakter).");
      return;
    }

    try {
      setRegistrationLoading(true);
      
      // TC kimlik numarası validasyonu (basit kontrol)
      const tcDigits = registrationData.tc.split('').map(Number);
      if (tcDigits[0] === 0) {
        setRegistrationError("TC Kimlik Numarası 0 ile başlayamaz.");
        setRegistrationLoading(false);
        return;
      }

      // Backend'e hasta kaydı POST isteği
      const requestBody = {
        tcNo: registrationData.tc,
        firstName: registrationData.adSoyad.trim()
      };

      const response = await axios.post(API_ENDPOINTS.PATIENT_ADD, requestBody);

      // Kayıt başarılı - randevu formunu göster
      const patientData = response.data;
      const patientIdValue = patientData.patientId || patientData.id || patientData.patient_id;
      
      setPatientId(patientIdValue);
      setIsRegistered(true);
      // Hasta adını formData'ya da ekle
      setFormData(prev => ({
        ...prev,
        hastaAd: registrationData.adSoyad.trim()
      }));

    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.";
      
      // Eğer hasta zaten kayıtlıysa
      if (err.response?.status === 409 || errorMessage.includes("zaten") || errorMessage.includes("mevcut")) {
        setRegistrationError("Bu TC kimlik numarası ile zaten kayıtlı bir hasta var. Lütfen giriş yapın.");
        setIsLoginMode(true);
      } else {
        setRegistrationError(errorMessage);
      }
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validasyon
    if (!formData.tedavi) {
      setSubmitError("Lütfen bir branş seçiniz.");
      return;
    }

    if (!formData.doktorId) {
      setSubmitError("Lütfen bir doktor seçiniz.");
      return;
    }

    if (!formData.tarih) {
      setSubmitError("Lütfen bir tarih seçiniz.");
      return;
    }

    if (!formData.saat) {
      setSubmitError("Lütfen bir saat seçiniz.");
      return;
    }

    if (!patientId) {
      setSubmitError("Hasta bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      setSubmitLoading(true);

      // Seçilen tedavi bilgisini al
      const secilenTedavi = tedaviler.find(t => t.id === parseInt(formData.tedavi));
      const duration = secilenTedavi ? secilenTedavi.sure : 30;

      // Tarih ve saati birleştirip ISO formatına çevir (2025-12-20T14:00)
      const startTime = formatSaatToISO(formData.saat);

      const appointmentParams = {
        patientId: parseInt(patientId),
        dentistId: parseInt(formData.doktorId),
        startTime: startTime,
        durationMinutes: duration,
        urgent: false
      };

      // Axios ile POST isteği (body olarak gönder)
      await axios.post(API_ENDPOINTS.APPOINTMENTS, appointmentParams);

      setSubmitSuccess(true);
      
      // Formu temizle
      setFormData({
        tedavi: "",
        doktorId: "",
        tarih: bugun,
        saat: "09:00",
        hastaAd: "",
        acil: false
      });
      setUygunDoktorlar([]);
      setAlternatifSaatler([]);

      // 3 saniye sonra success mesajını gizle
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error creating appointment:', err);
      const errorData = err.response?.data || {};
      const errorMessage = errorData.message || err.message || "Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.";
      
      // Eğer alternatif saatler varsa, bunları saat seçimine ekle
      if (errorData.alternatives && Array.isArray(errorData.alternatives) && errorData.alternatives.length > 0) {
        // Alternatif saatleri formatla ve state'e ekle
        const formattedAlternatives = errorData.alternatives.map(alt => formatSaatFromISO(alt));
        setAlternatifSaatler(formattedAlternatives);
        // İlk alternatif saati otomatik seç
        setFormData(prev => ({
          ...prev,
          saat: formattedAlternatives[0]
        }));
        setSubmitError("Seçtiğiniz saat dolu. Lütfen aşağıdaki alternatif saatlerden birini seçiniz:");
      } else {
        setAlternatifSaatler([]);
        setSubmitError(errorMessage);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Acil randevu butonu
  const handleEmergencyAppointment = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setEmergencySuccess(false);

    if (!patientId) {
      setSubmitError("Hasta bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      setEmergencyLoading(true);

      // Acil randevu endpoint'ine istek at
      await axios.post(API_ENDPOINTS.EMERGENCY_ASSIGN(patientId));

      setEmergencySuccess(true);

      // 3 saniye sonra success mesajını gizle
      setTimeout(() => {
        setEmergencySuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error creating emergency appointment:', err);
      const errorMessage = err.response?.data?.message || err.message || "Acil randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.";
      setSubmitError(errorMessage);
    } finally {
      setEmergencyLoading(false);
    }
  };

  // ISO formatındaki saati görüntülemek için formatla (2025-01-10T10:15 -> 10:15)
  const formatSaatFromISO = (isoDateTime) => {
    const date = new Date(isoDateTime);
    const saat = date.getHours().toString().padStart(2, '0');
    const dakika = date.getMinutes().toString().padStart(2, '0');
    return `${saat}:${dakika}`;
  };

  // ISO formatına çevir (10:15 -> 2025-01-10T10:15)
  const formatSaatToISO = (saatStr) => {
    return `${formData.tarih}T${saatStr}:00`;
  };

  // Saat seçenekleri oluştur (09:00 - 17:30 arası, 30 dakika aralıklarla)
  const getSaatSecenekleri = () => {
    const saatler = [];
    for (let saat = 9; saat < 18; saat++) {
      saatler.push(`${saat.toString().padStart(2, '0')}:00`);
      if (saat < 17) {
        saatler.push(`${saat.toString().padStart(2, '0')}:30`);
      }
    }
    return saatler;
  };

  const saatSecenekleri = getSaatSecenekleri();
  const secilenTedavi = tedaviler.find(t => t.id === parseInt(formData.tedavi));

  // Kayıt formu gösteriliyorsa
  if (!isRegistered) {
    return (
      <div className="appointment-container">
        <div className="appointment-form-wrapper">
          <h2>{isLoginMode ? "Hasta Girişi" : "Hasta Kayıt"}</h2>
          <p className="form-description">
            {isLoginMode 
              ? "Randevu almak için TC kimlik numaranız ile giriş yapın." 
              : "Randevu almak için önce kayıt olmanız gerekmektedir."}
          </p>

          {/* Mod Değiştirme Butonları */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '20px',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(false);
                setRegistrationError(null);
                setRegistrationData(prev => ({ ...prev, adSoyad: "" }));
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: !isLoginMode ? '#005691' : '#fff',
                color: !isLoginMode ? '#fff' : '#005691',
                border: '1px solid #005691',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
            >
              Kayıt Ol
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(true);
                setRegistrationError(null);
                setRegistrationData(prev => ({ ...prev, adSoyad: "" }));
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: isLoginMode ? '#005691' : '#fff',
                color: isLoginMode ? '#fff' : '#005691',
                border: '1px solid #005691',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
            >
              Giriş Yap
            </button>
          </div>

          {isLoginMode ? (
            // Giriş Formu
            <div className="appointment-form">
              {/* TC Kimlik Numarası */}
              <div className="form-group">
                <label htmlFor="tc">
                  TC Kimlik Numarası <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="tc"
                  name="tc"
                  value={registrationData.tc}
                  onChange={handleRegistrationChange}
                  className="form-input"
                  placeholder="11 haneli TC Kimlik Numarası"
                  maxLength={11}
                  required
                  disabled={registrationLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLogin();
                    }
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Sadece rakam giriniz (11 haneli)
                </small>
              </div>

              {/* Hata Mesajı */}
              {registrationError && (
                <div className="form-error-alert">
                  <span>⚠️</span>
                  <span>{registrationError}</span>
                </div>
              )}

              {/* Giriş Button */}
              <button
                type="button"
                onClick={handleLogin}
                className="form-submit-btn"
                disabled={registrationLoading || !registrationData.tc || registrationData.tc.length !== 11}
              >
                {registrationLoading ? "Giriş Yapılıyor..." : "Giriş Yap ve Devam Et"}
              </button>
            </div>
          ) : (
            // Kayıt Formu
            <form onSubmit={handleRegistrationSubmit} className="appointment-form">
              {/* TC Kimlik Numarası */}
              <div className="form-group">
                <label htmlFor="tc">
                  TC Kimlik Numarası <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="tc"
                  name="tc"
                  value={registrationData.tc}
                  onChange={handleRegistrationChange}
                  className="form-input"
                  placeholder="11 haneli TC Kimlik Numarası"
                  maxLength={11}
                  required
                  disabled={registrationLoading}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Sadece rakam giriniz (11 haneli)
                </small>
              </div>

              {/* Ad Soyad */}
              <div className="form-group">
                <label htmlFor="adSoyad">
                  Ad Soyad <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adSoyad"
                  name="adSoyad"
                  value={registrationData.adSoyad}
                  onChange={handleRegistrationChange}
                  className="form-input"
                  placeholder="Adınız Soyadınız"
                  required
                  disabled={registrationLoading}
                />
              </div>

              {/* Hata Mesajı */}
              {registrationError && (
                <div className="form-error-alert">
                  <span>⚠️</span>
                  <span>{registrationError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="form-submit-btn"
                disabled={registrationLoading || !registrationData.tc || registrationData.tc.length !== 11 || !registrationData.adSoyad.trim()}
              >
                {registrationLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol ve Devam Et"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <div className="appointment-form-wrapper">
        <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#2e7d32' }}>Kayıtlı Hasta:</strong>
              <div style={{ color: '#333', marginTop: '5px' }}>
                {registrationData.adSoyad} - TC: {registrationData.tc}
              </div>
              {patientId && (
                <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '3px' }}>
                  Hasta ID: <strong>{patientId}</strong>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsRegistered(false);
                setPatientId(null);
                setRegistrationData({ tc: "", adSoyad: "" });
                setFormData({
                  tedavi: "",
                  doktorId: "",
                  tarih: bugun,
                  saat: "09:00",
                  hastaAd: "",
                  acil: false
                });
              }}
              style={{
                padding: '8px 16px',
                background: '#fff',
                border: '1px solid #c8e6c9',
                borderRadius: '6px',
                color: '#2e7d32',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Değiştir
            </button>
          </div>
        </div>

        <h2>Randevu Al</h2>
        <p className="form-description">Lütfen aşağıdaki bilgileri doldurarak randevu oluşturun.</p>

        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Branş Seçimi */}
          <div className="form-group">
            <label htmlFor="tedavi">
              Branş <span className="required">*</span>
            </label>
            <select
              id="tedavi"
              name="tedavi"
              value={formData.tedavi}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Branş Seçiniz</option>
              {tedaviler.map((tedavi) => (
                <option key={tedavi.id} value={tedavi.id}>
                  {tedavi.ad} ({tedavi.sure} dakika)
                </option>
              ))}
            </select>
      </div>

          {/* Doktor Seçimi */}
          <div className="form-group">
            <label htmlFor="doktorId">
              Doktor <span className="required">*</span>
            </label>
            <select
              id="doktorId"
              name="doktorId"
              value={formData.doktorId}
              onChange={handleInputChange}
              className="form-select"
              required
              disabled={!formData.tedavi || doktorlarYukleniyor}
            >
              <option value="">
                {doktorlarYukleniyor 
                  ? "Doktorlar yükleniyor..." 
                  : !formData.tedavi 
                    ? "Önce branş seçiniz" 
                    : uygunDoktorlar.length === 0
                      ? "Bu branş için doktor bulunamadı"
                      : "Doktor Seçiniz"}
              </option>
              {uygunDoktorlar.map((doktor) => (
                <option key={doktor.id} value={doktor.id}>
                  {doktor.fullName} - {doktor.title || 'Diş Hekimi'}
                </option>
              ))}
            </select>
            {doktorHatasi && (
              <div className="form-error-message">{doktorHatasi}</div>
            )}
        </div>

          {/* Tarih Seçimi */}
          <div className="form-group">
            <label htmlFor="tarih">
              Tarih <span className="required">*</span>
            </label>
            <input
              type="date"
              id="tarih"
              name="tarih"
              value={formData.tarih}
              onChange={handleInputChange}
              className="form-input"
              min={bugun}
              required
            />
      </div>

          {/* Saat Seçimi */}
          <div className="form-group">
            <label htmlFor="saat">
              Saat <span className="required">*</span>
              {alternatifSaatler.length > 0 && (
                <span style={{ fontSize: '0.85rem', color: '#005691', marginLeft: '8px', fontWeight: 'normal' }}>
                  (Alternatif saatler)
                  </span>
              )}
            </label>
            <select
              id="saat"
              name="saat"
              value={formData.saat}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              {alternatifSaatler.length > 0 ? (
                // Alternatif saatler varsa sadece onları göster
                <>
                  <option value="">Alternatif saatlerden birini seçiniz</option>
                  {alternatifSaatler.map((saat) => (
                    <option key={saat} value={saat}>
                      {saat}
                    </option>
                  ))}
                </>
              ) : (
                // Normal saatler
                saatSecenekleri.map((saat) => (
                  <option key={saat} value={saat}>
                    {saat}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Acil Randevu Butonu */}
          <div className="form-group">
            <button
              type="button"
              onClick={handleEmergencyAppointment}
              disabled={emergencyLoading || !patientId}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: '#c22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: emergencyLoading || !patientId ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: emergencyLoading || !patientId ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!emergencyLoading && patientId) {
                  e.target.style.background = '#a00';
                }
              }}
              onMouseLeave={(e) => {
                if (!emergencyLoading && patientId) {
                  e.target.style.background = '#c22';
                }
              }}
            >
              {emergencyLoading ? "Acil Randevu Oluşturuluyor..." : "🚨 Acil Randevu Al"}
            </button>
            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '8px', display: 'block', textAlign: 'center' }}>
              Acil durumlarda bu butona tıklayarak randevu alabilirsiniz
            </small>
          </div>

          {/* Hata Mesajı */}
          {submitError && (
            <div className="form-error-alert">
              <span>⚠️</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* Başarı Mesajı */}
          {submitSuccess && (
            <div className="form-success-alert">
              <span>✓</span>
              <span>Randevunuz başarıyla oluşturuldu!</span>
            </div>
          )}

          {/* Acil Randevu Başarı Mesajı */}
          {emergencySuccess && (
            <div className="form-success-alert" style={{ background: '#ffe0e0', border: '1px solid #c22' }}>
              <span>🚨</span>
              <span>Acil randevunuz başarıyla oluşturuldu!</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit-btn"
            disabled={submitLoading || !formData.tedavi || !formData.doktorId}
          >
            {submitLoading ? "Randevu Oluşturuluyor..." : "Randevu Oluştur"}
          </button>

          {/* Özet Bilgi */}
          {secilenTedavi && formData.doktorId && (
            <div className="appointment-summary">
              <h3>Randevu Özeti</h3>
              <div className="summary-item">
                <span className="summary-label">Branş:</span>
                <span className="summary-value">{secilenTedavi.ad}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Doktor:</span>
                <span className="summary-value">
                  {uygunDoktorlar.find(d => d.id === parseInt(formData.doktorId))?.fullName || "-"}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tarih:</span>
                <span className="summary-value">
                  {new Date(formData.tarih).toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                        </div>
              <div className="summary-item">
                <span className="summary-label">Saat:</span>
                <span className="summary-value">{formData.saat}</span>
                      </div>
              <div className="summary-item">
                <span className="summary-label">Süre:</span>
                <span className="summary-value">{secilenTedavi.sure} dakika</span>
              </div>
          </div>
        )}
        </form>
      </div>

    </div>
  );
};

export default Appointment;
