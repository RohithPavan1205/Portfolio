import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const achievements = [
  {
    id: 'sf',
    date: "Feb 2026",
    num: "Salesforce",
    icon: "🌟",
    title: "Salesforce Trailhead Ranger",
    body: "Achieved Ranger — the top Trailhead rank — with 100+ badges and 50,000+ points. A comprehensive mastery of the Salesforce ecosystem recognised globally.",
    images: ["/achievements/sf/1.jpeg", "/achievements/sf/2.png"]
  },
  {
    id: 'ps',
    date: "Mar 2024",
    num: "Photoshop",
    icon: "🥇",
    title: "Photoshop Master — 1st Prize",
    body: "Won first place in an institutional-level design competition, demonstrating advanced visual composition, digital manipulation, and creative direction.",
    images: ["/achievements/ps/1.jpeg", "/achievements/ps/2.jpeg"]
  }
];

const Achievements = () => {
  const [activeGallery, setActiveGallery] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const openGallery = (ach) => {
    setActiveGallery(ach);
    setCurrentIdx(0);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setActiveGallery(null);
    document.body.style.overflow = "unset";
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentIdx(prev => (prev + 1) % activeGallery.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentIdx(prev => (prev - 1 + activeGallery.images.length) % activeGallery.images.length);
  };

  return (
    <>
      <style>{`
        .achieve-card {
          background: var(--coal);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 60px;
          transition: border-color 0.3s;
          position: relative;
          overflow: hidden;
        }
        .achieve-card:hover {
          border-color: var(--amber);
        }
        .achieve-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ach-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--amber);
          margin-bottom: 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .ach-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          color: var(--white);
          line-height: 1;
          margin-bottom: 24px;
        }
        .ach-body {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--stone);
          max-width: 500px;
        }
        .ach-gallery-mini {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid var(--line);
        }
        .ach-img-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .ach-gallery-mini:hover .ach-img-main {
          transform: scale(1.05);
        }
        .ach-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ach-gallery-mini:hover .ach-overlay {
          opacity: 1;
        }
        .ach-view-btn {
          background: var(--amber);
          color: var(--black);
          padding: 8px 16px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Full Gallery modal */
        .gal-modal {
          position: fixed;
          inset: 0;
          z-index: 1000000;
          background: rgba(0,0,0,0.98);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gal-content {
          width: 90vw;
          height: 80vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gal-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border: 1px solid var(--line);
          box-shadow: 0 0 50px rgba(0,0,0,1);
        }
        .gal-close {
          position: absolute;
          top: -40px;
          right: 0;
          color: var(--white);
          cursor: pointer;
        }
        .gal-nav {
          position: absolute;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 40px;
          pointer-events: none;
        }
        .gal-btn {
          width: 60px;
          height: 60px;
          background: var(--dim);
          border: 1px solid var(--line);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.2s;
        }
        .gal-btn:hover {
          background: var(--amber);
          color: var(--black);
          border-color: var(--amber);
        }

        @media (max-width: 1000px) {
          .achieve-card {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 30px;
          }
        }
      `}</style>

      <section id="achievements">
        <div className="section-wrap">
          <div className="sec-label fade-up">Milestones</div>
          <h2 className="sec-title fade-up">BEYOND<br />EXPECTATIONS</h2>
          
          <div className="achieve-container">
            {achievements.map((ach) => (
              <div key={ach.id} className="achieve-card fade-up">
                <div className="achieve-info">
                  <div className="ach-label">{ach.date} · {ach.num}</div>
                  <div className="ach-title">{ach.icon} {ach.title}</div>
                  <div className="ach-body">{ach.body}</div>
                </div>
                
                <div className="ach-gallery-mini" onClick={() => openGallery(ach)}>
                  <img src={ach.images[0]} alt={ach.title} className="ach-img-main" />
                  <div className="ach-overlay">
                    <div className="ach-view-btn">
                      <Maximize2 size={16} />
                      View Gallery
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {activeGallery && (
        <div className="gal-modal" onClick={closeGallery}>
          <div className="gal-content" onClick={e => e.stopPropagation()}>
            <button className="gal-close" onClick={closeGallery}>
              <X size={32} />
            </button>
            <img src={activeGallery.images[currentIdx]} alt="Gallery" className="gal-img" />
            
            {activeGallery.images.length > 1 && (
              <div className="gal-nav">
                <button className="gal-btn" onClick={prevImg}>
                  <ChevronLeft size={32} />
                </button>
                <button className="gal-btn" onClick={nextImg}>
                  <ChevronRight size={32} />
                </button>
              </div>
            )}
            
            <div style={{ position: 'absolute', bottom: '-40px', color: 'var(--amber)', fontFamily: 'JetBrains Mono' }}>
              IMAGE {currentIdx + 1} / {activeGallery.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Achievements;
