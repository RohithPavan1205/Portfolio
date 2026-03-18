import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ChevronLeft, ChevronRight, X } from "lucide-react";
import { projectsData } from "../data/projectsData";

const SPRING = { type: "spring", stiffness: 180, damping: 28 };
const OFFSET = 12;
const SCALE_STEP = 0.07;
const DIM_STEP = 0.18;
const SWIPE_THRESHOLD = 60;

export default function ProjectsSection() {
  const [cards, setCards] = useState(projectsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDir, setDragDir] = useState(null);
  const [showMeta, setShowMeta] = useState(false);
  
  // Modal specific
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-200, 0, 200], [12, 0, -12]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProject]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  };

  const moveForward = useCallback(() => {
    setCards(prev => [...prev.slice(1), prev[0]]);
    setCurrentIndex(prev => (prev + 1) % projectsData.length);
  }, []);

  const moveBack = useCallback(() => {
    setCards(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setCurrentIndex(prev => (prev - 1 + projectsData.length) % projectsData.length);
  }, []);

  const handleDragEnd = useCallback((_, info) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.y) > SWIPE_THRESHOLD || Math.abs(velocity.y) > 500) {
      const goForward = offset.y < 0 || velocity.y < 0;
      setDragDir(goForward ? "up" : "down");
      setTimeout(() => {
        goForward ? moveForward() : moveBack();
        setDragDir(null);
      }, 140);
    }
    dragY.set(0);
  }, [moveForward, moveBack, dragY]);

  const front = cards[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

        @keyframes gridAnim {
          from { stroke-dashoffset: 80; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%       { transform: scale(1.2); opacity: 0.8; }
        }

        .proj-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: 1.5px;
          padding: 6px 12px;
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 2px;
          color: #a8860f;
          text-transform: uppercase;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        .proj-tag:hover {
          border-color: #f5c518;
          color: #f5c518;
          background: rgba(245,197,24,0.08);
        }
        .nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          border-radius: 4px;
          border: 1px solid rgba(245,197,24,0.2);
          background: #0f0f0f;
          color: #6a6a6a;
          cursor: pointer;
          transition: border-color .2s, color .2s, background .2s, transform .15s;
        }
        .nav-btn:hover {
          border-color: #f5c518;
          color: #f5c518;
          background: rgba(245,197,24,0.06);
          transform: scale(1.08);
        }
        .link-btn {
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 9px 16px;
          border-radius: 2px;
          border: 1px solid rgba(245,197,24,0.3);
          color: #a8860f;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: all .2s;
        }
        .link-btn:hover {
          border-color: #f5c518;
          color: #f5c518;
          background: rgba(245,197,24,0.08);
        }

        /* --- MODAL STYLES --- */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 999999;
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

        .modal-container {
          background: #080808;
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 12px;
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 30px 80px rgba(0,0,0,0.9);
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: 'Syne', sans-serif;
          scrollbar-width: thin;
          scrollbar-color: #f5c518 #111;
        }

        .modal-container::-webkit-scrollbar { width: 8px; }
        .modal-container::-webkit-scrollbar-track { background: #111; }
        .modal-container::-webkit-scrollbar-thumb {
          background: #f5c518;
          border-radius: 4px;
        }

        @keyframes modalSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: rgba(245,197,24,0.2);
          border-color: #f5c518;
          color: #f5c518;
          transform: scale(1.05);
        }

        .modal-header {
          padding: 50px 50px 30px 50px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .modal-badges {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .modal-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #f5c518;
          background: rgba(245,197,24,0.1);
          padding: 6px 14px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: 1px solid rgba(245,197,24,0.3);
        }

        .modal-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4CAF50;
          background: rgba(76, 175, 80, 0.1);
          padding: 6px 14px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 64px;
          color: #fff;
          letter-spacing: 1px;
          line-height: 1;
        }

        .modal-gallery {
          position: relative;
          background: #000;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(245,197,24,0.3);
          color: #fff;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }

        .gallery-nav:hover {
          background: rgba(245,197,24,1);
          color: #000;
        }

        .gallery-nav.prev { left: 24px; }
        .gallery-nav.next { right: 24px; }

        .modal-body {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 60px;
          padding: 50px;
        }

        .modal-text {
          font-size: 16px;
          color: #b0b0b0;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .modal-sidebar-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
        }

        .modal-tech-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 50px;
        }

        .modal-tech-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #ddd;
          background: rgba(255,255,255,0.03);
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .modal-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-features-list li {
          font-size: 15px;
          color: #bbb;
          line-height: 1.6;
          position: relative;
          padding-left: 24px;
        }

        .modal-features-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          top: 0;
          color: #f5c518;
          font-family: monospace;
        }

        @media (max-width: 900px) {
          .modal-body {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 30px;
          }
          .modal-gallery {
            height: 350px;
          }
          .modal-title {
            font-size: 48px;
          }
          .modal-header {
            padding: 40px 30px 24px 30px;
          }
        }

        @media (max-width: 600px) {
          .modal-overlay {
            padding: 10px;
          }
          .modal-container {
            height: 95vh;
          }
          .modal-header {
            padding: 30px 20px 20px 20px;
          }
          .modal-title {
            font-size: 32px;
          }
          .modal-gallery {
            height: 240px;
          }
          .modal-body {
            padding: 24px 20px;
            gap: 30px;
          }
          .modal-badges {
            flex-wrap: wrap;
            gap: 8px;
          }
          .modal-close {
            top: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
          }
          .gallery-nav {
            width: 40px;
            height: 40px;
          }
          .gallery-nav.prev { left: 12px; }
          .gallery-nav.next { right: 12px; }
          .modal-text {
            font-size: 14px;
          }
          .modal-sidebar-title {
            font-size: 24px;
          }
        }
      `}</style>

      <section id="projects" style={{
        position: "relative",
        background: "#080808",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Syne', sans-serif",
      }}>

        {/* ── Background grid ── */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
          <defs>
            <pattern id="pg" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f5c518" strokeWidth="0.6"
                strokeDasharray="80" style={{ animation: "gridAnim 3s linear infinite" }} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pg)" />
        </svg>

        {/* ── Ambient glow ── */}
        <div style={{
          position: "absolute", left: "-10%", top: "20%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
          animation: "orbPulse 9s ease-in-out infinite",
        }} />

        <div className="section-wrap" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* ── Title ── */}
          <div style={{ paddingBottom: 60, zIndex: 10 }}>
            <div className="sec-label fade-up">Selected Work</div>
            <h2 className="sec-title fade-up">WHAT I<br />SHIPPED</h2>
          </div>

          {/* ── Main content: Stack + Info panel ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
            flex: 1,
            zIndex: 10
          }}>

            {/* ── LEFT: Card Stack ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: 8 }}>
                {projectsData.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === currentIndex ? 28 : 6,
                      background: i === currentIndex ? "#f5c518" : "#2a2a2a",
                    }}
                    transition={{ duration: .3 }}
                    style={{ height: 4, borderRadius: 2 }}
                  />
                ))}
              </div>

              {/* Stack */}
              <div style={{ position: "relative", width: 560, height: 350, perspective: 900 }}>
                <AnimatePresence>
                  {cards.map((project, i) => {
                    const isFront = i === 0;
                    const brightness = Math.max(0.25, 1 - i * DIM_STEP);

                    return (
                      <motion.div
                        key={project.id}
                        className="draggable-project-card"
                        style={{
                          position: "absolute",
                          width: "100%", height: "100%",
                          borderRadius: 8,
                          overflow: "hidden",
                          cursor: isFront ? "grab" : "auto",
                          touchAction: "none",
                          border: `1px solid ${isFront ? project.accent + "55" : "rgba(245,197,24,0.1)"}`,
                          boxShadow: isFront
                            ? `0 28px 80px rgba(0,0,0,0.8), 0 0 40px ${project.accent}18`
                            : "0 8px 24px rgba(0,0,0,0.5)",
                          rotateX: isFront ? rotateX : 0,
                          transformPerspective: 900,
                        }}
                        animate={{
                          top: `${i * -OFFSET}%`,
                          y: 0,
                          scale: 1 - i * SCALE_STEP,
                          filter: `brightness(${brightness})`,
                          zIndex: projectsData.length - i,
                          opacity: dragDir && isFront ? 0 : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
                        transition={SPRING}
                        drag={isFront ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragSnapToOrigin={true}
                        dragElastic={0.65}
                        onDrag={(_, info) => { if (isFront) dragY.set(info.offset.y); }}
                        onDragEnd={handleDragEnd}
                        whileDrag={isFront ? { scale: 1.04, cursor: "grabbing", zIndex: 99 } : {}}
                        onHoverStart={() => isFront && setShowMeta(true)}
                        onHoverEnd={() => setShowMeta(false)}
                      >
                        {/* Card image */}
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none", pointerEvents: "none" }}
                          draggable={false}
                        />

                        {/* Overlay gradient */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                          pointerEvents: "none",
                        }} />

                        {/* Accent top line */}
                        <div style={{
                          position: "absolute", top: 0, left: 0, right: 0,
                          height: 2,
                          background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
                          pointerEvents: "none",
                        }} />

                        {/* Card label (always visible on front) */}
                        {isFront && (
                          <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            padding: "16px 20px",
                            pointerEvents: "none",
                          }}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: showMeta ? 1 : 0.7, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 14, letterSpacing: "2px",
                                color: project.accent,
                                textTransform: "uppercase",
                                marginBottom: 8,
                              }}>
                                {project.year} · {project.type}
                              </div>
                              <div style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 34, letterSpacing: "1px",
                                color: "#fff", lineHeight: 1,
                              }}>
                                {project.name}
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {/* Stat badge */}
                        {isFront && project.stat && (
                          <div style={{
                            position: "absolute", top: 14, right: 14,
                            background: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(8px)",
                            border: `1px solid ${project.accent}44`,
                            borderRadius: 4,
                            padding: "6px 12px",
                            pointerEvents: "none",
                          }}>
                            <div style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 28, color: project.accent, lineHeight: 1,
                            }}>
                              {project.stat.value}
                            </div>
                            <div style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 11, letterSpacing: "1.5px",
                              color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                            }}>
                              {project.stat.label}
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay interaction blocker/clicker for modal trigger */}
                        {isFront && (
                           <div 
                              style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, cursor: "grab"}}
                              onPointerDown={(e) => {
                                // Important: We let the drag handle grab event. But we can catch a light click if needed.
                              }}
                           />
                        )}
                        
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Nav controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="nav-btn" onClick={moveBack}><ChevronLeft size={18} /></button>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, letterSpacing: "2px",
                  color: "#4a4a4a",
                }}>
                  <span style={{ color: "#f5c518" }}>{String(currentIndex + 1).padStart(2, "0")}</span>
                  {" / "}
                  {String(projectsData.length).padStart(2, "0")}
                </span>
                <button className="nav-btn" onClick={moveForward}><ChevronRight size={18} /></button>
              </div>

              {/* Drag hint */}
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: "2.5px",
                color: "#333", textTransform: "uppercase",
              }}>
                ↕ drag · ← → navigate
              </p>
            </div>

            {/* ── RIGHT: Project Info Panel ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={front.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: 28 }}
              >
                {/* Type tag */}
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14, letterSpacing: "3px",
                  color: front.accent, textTransform: "uppercase",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{
                    display: "inline-block", width: 6, height: 6,
                    background: front.accent, borderRadius: "50%",
                    boxShadow: `0 0 8px ${front.accent}`,
                    animation: "orbPulse 2s infinite",
                  }} />
                  {front.type}
                </div>

                {/* Title */}
                <div>
                  <h3 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(54px, 6vw, 84px)",
                    color: "#fff", lineHeight: 0.92,
                    letterSpacing: "1px",
                    marginBottom: 10,
                  }}>
                    {front.name}
                  </h3>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16, letterSpacing: "2px",
                    color: "#4a4a4a", textTransform: "uppercase",
                  }}>
                    {front.category}
                  </p>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 18,
                  color: "#888",
                  lineHeight: 1.8,
                  borderLeft: `2px solid ${front.accent}44`,
                  paddingLeft: 20,
                }}>
                  {front.shortDescription}
                </p>

                {/* Tags mapped from tech Stack locally on frontend UI */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {front.techStack.map(tech => (
                    <span key={tech.name} className="proj-tag">{tech.name}</span>
                  ))}
                </div>

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: "linear-gradient(90deg, rgba(245,197,24,0.2), transparent)",
                }} />

                {/* Stat & Detail triggers */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    {front.stat && (
                      <>
                        <div style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 54, color: front.accent, lineHeight: 1,
                        }}>
                          {front.stat.value}
                        </div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 14, letterSpacing: "2px",
                          color: "#4a4a4a", textTransform: "uppercase",
                        }}>
                          {front.stat.label}
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button 
                      onClick={() => setSelectedProject(front)}
                      className="link-btn" 
                      style={{
                        background: `${front.accent}15`,
                        borderColor: `${front.accent}55`,
                        color: front.accent,
                      }}>
                      <ArrowUpRight size={13} />
                      Full Case Study
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* MODAL */}
      {selectedProject && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if(e.target === e.currentTarget) setSelectedProject(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-container">
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="modal-badges">
                <span className="modal-badge">{selectedProject.category}</span>
                <span className="modal-status">{selectedProject.status}</span>
              </div>
              <h2 className="modal-title">{selectedProject.name}</h2>
            </div>

            {/* Carousel */}
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="modal-gallery">
                {selectedProject.images.length > 1 && (
                  <button className="gallery-nav prev" onClick={prevImage}><ChevronLeft size={24} /></button>
                )}
                
                <img 
                  src={selectedProject.images[currentImageIndex]} 
                  alt={`${selectedProject.name} screenshot ${currentImageIndex + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {selectedProject.images.length > 1 && (
                  <button className="gallery-nav next" onClick={nextImage}><ChevronRight size={24} /></button>
                )}
              </div>
            )}

            <div className="modal-body">
              <div>
                <h3 className="modal-sidebar-title">Project Overview</h3>
                <div className="modal-text">
                  {selectedProject.fullDescription}
                </div>
              </div>

              <div>
                <h3 className="modal-sidebar-title">Key Features</h3>
                <ul className="modal-features-list" style={{ marginBottom: 50 }}>
                  {selectedProject.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>

                <h3 className="modal-sidebar-title">Tech Stack</h3>
                <div className="modal-tech-list">
                  {selectedProject.techStack.map((tech) => (
                    <div key={tech.name} className="modal-tech-item">
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        style={{ width: "20px", height: "20px", objectFit: "contain" }}
                      />
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
