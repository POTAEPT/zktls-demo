import React, { useState, useEffect } from 'react';
import { X, MapPin, Send } from 'lucide-react';
import styles from '../styles/SOSModal.module.css';

interface SOSModalProps {
  onClose: () => void;
  // อัปเดต interface ให้รับ lat, lng
  onSubmit: (data: { needs: string[]; details: string; location: string; lat: number; lng: number }) => void;
}

const availableNeeds = [
  'Water', 'Food', 'Shelter', 'Medical Aid',
  'Rescue/Evacuation', 'Generator/Power', 'Boat/Transport', 'Communication'
];

export const SOSModal: React.FC<SOSModalProps> = ({ onClose, onSubmit }) => {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [details, setDetails] = useState('');
  const [currentLocation, setCurrentLocation] = useState('กำลังค้นหาพิกัด GPS...');
  // เพิ่ม state เก็บค่าพิกัดจริง
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // ใช้ Browser Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error("Location Error:", error);
          setCurrentLocation("ไม่สามารถระบุตำแหน่งได้ (ใช้พิกัดจำลอง)");
          // Fallback location (เช่น อนุสาวรีย์ชัยฯ) เพื่อไม่ให้แอปพังตอนเดโม
          setCoords({ lat: 13.7649, lng: 100.5383 });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setCurrentLocation("Browser ไม่รองรับ GPS");
    }
  }, []);

  const handleNeedToggle = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNeeds.length === 0) {
      alert('Please select at least one need');
      return;
    }
    
    // ใช้พิกัดจริง หรือ Fallback
    const finalCoords = coords || { lat: 13.7563, lng: 100.5018 };

    onSubmit({ 
      needs: selectedNeeds, 
      details, 
      location: currentLocation,
      lat: finalCoords.lat,
      lng: finalCoords.lng
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>Send Emergency SOS</h2>
            <p className={styles.modalSubtitle}>Help is on the way</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} color="#4B5563" />
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <label className={styles.sectionLabel}>What do you need immediately? *</label>
            <div className={styles.checkboxGrid}>
              {availableNeeds.map((need) => (
                <label key={need} className={`${styles.checkboxLabel} ${selectedNeeds.includes(need) ? styles.checkboxLabelActive : ''}`}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={selectedNeeds.includes(need)}
                    onChange={() => handleNeedToggle(need)}
                  />
                  <span className={styles.checkboxText}>{need}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.sectionLabel} htmlFor="details">Additional Details</label>
            <textarea
              id="details"
              className={styles.textarea}
              placeholder="Describe situation..."
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.sectionLabel}>Your Location</label>
            <div className={styles.locationDisplay}>
              <MapPin size={20} color="#E63946" />
              <span className={styles.locationText}>{currentLocation}</span>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={selectedNeeds.length === 0 || !coords}>
            <Send size={20} color="#FFFFFF" />
            <span>Broadcast Emergency Request</span>
          </button>
        </form>
      </div>
    </div>
  );
};