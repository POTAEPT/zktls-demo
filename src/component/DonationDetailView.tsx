import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/DonationDetail.module.css';
import { 
  ChevronLeft, MapPin, Clock, AlertTriangle, 
  Droplets, Utensils, Stethoscope, Zap, HeartHandshake 
} from 'lucide-react';

interface DonationDetailViewProps {
  onBack: () => void;
}

export const DonationDetailView: React.FC<DonationDetailViewProps> = ({ onBack }) => {
  
  // --- 1. ระบบ Drag Logic (เอาใส่กลับมาแล้วครับ) ---
  const [panelHeight, setPanelHeight] = useState(450); // ความสูงเริ่มต้น
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleDragStart = (clientY: number) => {
    isDragging.current = true;
    startY.current = clientY;
    startHeight.current = panelHeight;
    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDragging.current) return;
      const delta = startY.current - clientY; // ลากขึ้น = บวก
      const newHeight = startHeight.current + delta;
      
      // ลิมิตความสูง: ต่ำสุด 200px, สูงสุด 90% ของหน้าจอ
      if (newHeight > 200 && newHeight < window.innerHeight * 0.95) {
        setPanelHeight(newHeight);
      }
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
    };

    // Events
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const onTouchEnd = () => handleEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Mock Data
  const request = {
    userName: 'Sarah Johnson',
    time: '5 min ago',
    distance: '0.3 km away',
    description: 'Trapped on second floor with family of 4. Water rising quickly. Need immediate evacuation and supplies.',
    address: '123 Main St, Los Angeles, CA',
    coords: '34.0522° N, 118.2437° W',
    needs: ['Water', 'Food', 'First Aid', 'Generator']
  };

  const getNeedIcon = (need: string) => {
    switch (need.toLowerCase()) {
      case 'water': return <Droplets size={20} color="#3B82F6" />;
      case 'food': return <Utensils size={20} color="#F59E0B" />;
      case 'first aid': return <Stethoscope size={20} color="#EF4444" />;
      case 'generator': return <Zap size={20} color="#EAB308" />;
      default: return <AlertTriangle size={20} color="#6B7280" />;
    }
  };

  return (
    <div className={styles.detailView}>
      
      {/* --- ส่วน Header & Background Map (อยู่ด้านหลัง ตรึงไว้) --- */}
      <div className={styles.fixedBackground}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
            <ChevronLeft size={24} color="#374151" />
          </button>
          <h1 className={styles.headerTitle}>Request Details</h1>
          <div className={styles.headerSpacer}></div>
        </header>

        {/* พื้นหลังสีม่วง (Map Placeholder) */}
        <div className={styles.mapSnippet}>
          <div className={styles.mapPlaceholder}>
             <MapPin size={48} color="white" fill="rgba(255,255,255,0.2)" />
             <span className={styles.mapLabel}>Incident Location</span>
          </div>
        </div>
      </div>

      {/* --- ส่วน Bottom Sheet ที่ลากได้ (Draggable Area) --- */}
      <div 
        className={styles.draggableSheet} 
        style={{ height: `${panelHeight}px` }} // ควบคุมความสูงตรงนี้
      >
        {/* ตัวจับลาก (Handle) */}
        <div 
          className={styles.handleArea}
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        >
          <div className={styles.handleBar}></div>
        </div>

        {/* เนื้อหาข้างใน (Scroll ได้) */}
        <div className={styles.scrollContent}>
          
          {/* User Section */}
          <div className={styles.userSection}>
            <img src="https://i.pravatar.cc/150?img=5" alt="User" className={styles.userAvatar} />
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{request.userName}</h2>
              <div className={styles.userMeta}>
                <span className={styles.metaItem}><Clock size={14} /> {request.time}</span>
                <span className={styles.metaItem}><MapPin size={14} /> {request.distance}</span>
              </div>
            </div>
          </div>

          {/* Urgency Banner */}
          <div className={styles.urgencyBanner}>
            <AlertTriangle size={20} color="white" fill="white" />
            <span className={styles.urgencyText}>CRITICAL URGENCY</span>
          </div>

          {/* Situation */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Situation</h3>
            <p className={styles.description}>{request.description}</p>
          </div>

          {/* Needs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Needed Items</h3>
            <div className={styles.needsGrid}>
              {request.needs.map((need, index) => (
                <div key={index} className={styles.needItem}>
                  <div className={styles.needIcon}>{getNeedIcon(need)}</div>
                  <span className={styles.needText}>{need}</span>
                </div>
              ))}
            </div>
          </div>
          
           {/* Space for bottom button */}
           <div style={{ height: '100px' }}></div>
        </div>

        {/* Fixed Button at Bottom of Sheet */}
        <div className={styles.actionSection}>
          <button className={styles.donateButton}>
            <HeartHandshake size={20} />
            <span>Donate to Help</span>
          </button>
          <p className={styles.actionNote}>Secure P2P transfer via Ethereum Network</p>
        </div>
      </div>

    </div>
  );
};