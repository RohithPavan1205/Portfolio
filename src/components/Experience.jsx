import React, { useRef, useState, useEffect } from 'react';

const bullets = [
  "Developed an AR system for photo-to-video experiences",
  "Implemented on-device ML (.onnx) for real-time image recognition",
  "Designed pipeline to match physical photos using feature vectors",
  "Integrated Vimeo for flat-cost video streaming",
  "Built backend workflows with Supabase for fast vector querying",
  "Optimized system to avoid cloud ML and reduce operational costs",
];

const tags = ["AR / VR", "Edge AI", ".ONNX", "Supabase", "Vimeo API", "Computer Vision"];

const Experience = () => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredBullet, setHoveredBullet] = useState(null);

  // Scroll-triggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse glow follow
  const handleMouseMove = (e) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 150;
    const y = e.clientY - rect.top - 150;
    glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
    glowRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <section id="experience">
      <div className="section-wrap">
        <div className="sec-label fade-up">Work Experience</div>
        <h2 className="sec-title fade-up">CAREER<br /><span className="text-stroke">JOURNEY</span></h2>
      </div>
      
      <div className="exp-reel w-full flex justify-center" id="expReel" style={{marginTop: '48px', padding: '0 20px'}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

          @keyframes cardReveal {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseDot {
            0%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); }
            50%       { box-shadow: 0 0 0 6px rgba(197, 160, 33, 0); }
          }
          @keyframes topBorderReveal {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }

          .new-exp-card {
            position: relative;
            background: var(--coal);
            border: 1px solid var(--line);
            border-radius: 4px;
            padding: 40px 44px;
            overflow: hidden;
            max-width: 860px;
            width: 100%;
            opacity: 0;
            transform: translateY(40px);
            transition: border-color .3s, transform .3s;
            font-family: 'Syne', sans-serif;
            text-align: left;
           margin: 0 auto;
          }
          .new-exp-card.visible {
            animation: cardReveal .7s cubic-bezier(.22,1,.36,1) forwards;
          }
          .new-exp-card:hover {
            border-color: var(--amber);
            transform: translateY(-4px);
          }
          .new-exp-card-top-border {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--amber), transparent);
            transform: scaleX(0);
            transition: transform .4s ease;
            pointer-events: none;
          }
          .new-exp-card:hover .new-exp-card-top-border {
            transform: scaleX(1);
          }
          .new-exp-glow {
            position: absolute;
            width: 300px; height: 300px;
            background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            transition: opacity .3s;
            top: -100px; left: -100px;
          }
          .new-period-dot {
            display: inline-block;
            width: 6px; height: 6px;
            background: var(--amber);
            border-radius: 50%;
            animation: pulseDot 2s infinite;
            flex-shrink: 0;
          }
          .new-exp-bullet {
            transition: color .2s, padding-left .2s;
          }
          .new-exp-bullet:hover {
            color: var(--white) !important;
            padding-left: 26px !important;
          }
          .new-exp-tag {
            transition: background .2s, border-color .2s, color .2s;
          }
          .new-exp-tag:hover {
            background: var(--dim) !important;
            border-color: var(--amber) !important;
            color: var(--amber) !important;
          }
        `}</style>

        <div
          ref={cardRef}
          className={`new-exp-card${visible ? " visible" : ""}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Top border sweep */}
          <div className="new-exp-card-top-border" />

          {/* Glow blob */}
          <div ref={glowRef} className="new-exp-glow" />

          {/* Period */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "3px",
            color: "var(--amber)",
            textTransform: "uppercase",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span className="new-period-dot" />
            Jul 2025 — Present
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            letterSpacing: "1.5px",
            color: "var(--white)",
            lineHeight: 1,
            marginBottom: 6,
          }}>
            Associate Developer Intern
          </h2>

          {/* Company */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: "2px",
            color: "var(--stone)",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>
            AJS Innovations Pvt. Ltd.
          </p>

          {/* Quote */}
          <blockquote style={{
            borderLeft: "3px solid var(--amber)",
            padding: "12px 0 12px 20px",
            marginBottom: 28,
            fontSize: 15,
            fontStyle: "italic",
            color: "var(--white)",
            lineHeight: 1.7,
            opacity: 0.85,
          }}>
            "Built a cost-efficient AR platform for photography, eliminating cloud
            dependency using edge-based AI."
          </blockquote>

          {/* Bullets */}
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
            {bullets.map((b, i) => (
              <li
                key={i}
                className="new-exp-bullet"
                style={{
                  position: "relative",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  color: "var(--stone)",
                  padding: "6px 0 6px 20px",
                  borderBottom: "1px solid var(--line)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{
                  position: "absolute",
                  left: 0,
                  top: 8,
                  color: hoveredBullet === i ? "var(--amber)" : "var(--olive)",
                  fontSize: 10,
                  transition: "color .2s",
                }}
                  onMouseEnter={() => setHoveredBullet(i)}
                  onMouseLeave={() => setHoveredBullet(null)}
                >▸</span>
                {b}
              </li>
            ))}
          </ul>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags.map((tag) => (
              <span
                key={tag}
                className="new-exp-tag"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  padding: "5px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 2,
                  color: "var(--amber)",
                  textTransform: "uppercase",
                  cursor: "default",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
