import React, { useState } from 'react';
import { X } from 'lucide-react';

const certsData = [
  {
    num: "01",
    name: "Oracle Cloud Infrastructure 2025 AI Foundations Associate",
    issuer: "Oracle",
    date: "September 2025",
    img: "/certificates/1.jpg"
  },
  {
    num: "02",
    name: "Full Stack Development with Django & AI Agents",
    issuer: "W3Grads",
    date: "July 2025",
    img: "/certificates/2.jpg"
  },
  {
    num: "03",
    name: "Data Structures & Algorithms using C++",
    issuer: "CipherSchools",
    date: "November 2024",
    img: "/certificates/3.jpg"
  }
];

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  React.useEffect(() => {
    if (selectedCert) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [selectedCert]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <style>{`
        .cert-tile-interactive {
          cursor: pointer;
        }
        .cert-hover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
          transform: scale(1.05);
          z-index: 0;
        }
        .cert-tile:hover .cert-hover-img {
          opacity: 1; /* Fully reveal the certificate */
          transform: scale(1);
        }
        .cert-tile-content {
          position: relative;
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .cert-tile:hover .cert-tile-content {
          opacity: 0; /* Hide text to cleanly show certificate */
        }
        .cert-tile::after {
          z-index: 1; /* Ensure gradient overlay sits above img to smoothen edges if needed, though we will just cover everything */
        }
        .cert-tile:hover::after {
          opacity: 0; /* remove bottom gradient on hover so image shines purely */
        }

        /* Certificate Modal Overlay */
         .cert-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1000000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          animation: modalFadeIn 0.3s forwards;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cert-modal-container {
          position: relative;
          background: var(--coal);
          border: 1px solid var(--line);
          border-radius: 8px;
          max-width: 1000px;
          width: 100%;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 80px rgba(0,0,0,0.9);
          overflow: hidden;
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .cert-modal-img {
          width: 100%;
          max-height: calc(95vh - 80px); /* Leave room for header */
          object-fit: contain;
          background: #000;
        }

        .cert-modal-header {
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--coal);
          border-bottom: 1px solid var(--line);
        }

        .cert-modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(20px, 3vw, 32px);
          color: var(--white);
          letter-spacing: 1.5px;
        }

        .cert-modal-close {
          background: var(--dim);
          border: 1px solid var(--line);
          color: var(--white);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .cert-modal-close:hover {
          background: var(--amber);
          border-color: var(--amber);
          color: var(--black);
        }
        .cert-hint {
          margin-top: 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: var(--amber);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.7;
          transition: transform 0.3s ease;
        }
        .cert-hint::before {
          content: '';
          width: 16px;
          height: 1px;
          background: currentColor;
        }
        .cert-tile:hover .cert-hint {
          transform: translateX(5px);
        }
      `}</style>
      
      <section id="certifications">
        <div className="section-wrap">
          <div className="sec-label fade-up">Credentials</div>
          <h2 className="sec-title fade-up">PROOF OF<br />MASTERY</h2>
          <div className="certs-grid">
            {certsData.map((cert) => (
              <div 
                key={cert.num}
                className="cert-tile cert-tile-interactive fade-up"
                onClick={() => setSelectedCert(cert)}
              >
                <img src={cert.img} alt={cert.name} className="cert-hover-img" />
                <div className="cert-tile-content">
                  <div className="cert-num">{cert.num}</div>
                  <div className="cert-name">{cert.name}</div>
                  <div className="cert-issuer">{cert.issuer}</div>
                  <div className="cert-date">{cert.date}</div>
                  <div className="cert-hint">Hover to View</div>
                </div>
              </div>
            ))}
          </div>
          

        </div>
      </section>

      {/* Modal Overlay */}
      {selectedCert && (
        <div 
          className="cert-modal-overlay"
          onClick={(e) => {
            if(e.target === e.currentTarget) setSelectedCert(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="cert-modal-container">
            <div className="cert-modal-header">
              <div className="cert-modal-title">{selectedCert.name}</div>
              <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>
                <X size={20} />
              </button>
            </div>
            <img src={selectedCert.img} alt={selectedCert.name} className="cert-modal-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default Certifications;
