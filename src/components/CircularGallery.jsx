import React, { useEffect, useRef, useState } from 'react';

const CircularGallery = ({ items, options = {} }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  
  const state = useRef({
    rotation: 0,
    targetRotation: 0,
    isDown: false,
    startX: 0,
    startRot: 0,
    hasMoved: false
  });

  const config = {
    scrollSpeed: options.scrollSpeed || 2.5,
    ease: options.scrollEase || 0.1,
    bend: options.bend || 3,
    spacing: 40,
    radius: 700,
    ...options
  };

  const totalRange = items.length * config.spacing;

  useEffect(() => {
    const container = containerRef.current;
    const cards = Array.from(wrapperRef.current.children);

    const update = () => {
      state.current.rotation += (state.current.targetRotation - state.current.rotation) * config.ease;

      cards.forEach((card, i) => {
        let totalAngle = (i * config.spacing) + state.current.rotation;
        
        // Infinite Loop Logic
        totalAngle = ((totalAngle + totalRange / 2) % totalRange + totalRange) % totalRange - totalRange / 2;

        const rad = totalAngle * (Math.PI / 180);
        
        const x = Math.sin(rad) * config.radius;
        const z = (Math.cos(rad) - 1) * config.radius;
        const y = Math.abs(x) * (config.bend * 0.1);

        const rotY = totalAngle;
        const rotZ = totalAngle * (config.bend * 0.05);

        card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        
        const distance = Math.abs(totalAngle);
        const opacity = Math.max(0, 1 - (distance / 90));
        card.style.opacity = opacity;
        card.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      });

      requestAnimationFrame(update);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      state.current.targetRotation -= e.deltaY * 0.05 * config.scrollSpeed;
    };

    const handleMouseDown = (e) => {
      state.current.isDown = true;
      container.style.cursor = 'grabbing';
      state.current.startX = e.clientX;
      state.current.startRot = state.current.targetRotation;
      state.current.hasMoved = false;
    };

    const handleMouseMove = (e) => {
      if (!state.current.isDown) return;
      const deltaX = Math.abs(e.clientX - state.current.startX);
      if (deltaX > 5) state.current.hasMoved = true;
      const delta = (e.clientX - state.current.startX) * 0.1 * config.scrollSpeed;
      state.current.targetRotation = state.current.startRot + delta;
    };

    const handleMouseUp = () => {
      state.current.isDown = false;
      container.style.cursor = 'grab';
    };

    const handleTouchStart = (e) => {
      state.current.isDown = true;
      state.current.startX = e.touches[0].clientX;
      state.current.startRot = state.current.targetRotation;
    };

    const handleTouchMove = (e) => {
      if (!state.current.isDown) return;
      const delta = (e.touches[0].clientX - state.current.startX) * 0.1 * config.scrollSpeed;
      state.current.targetRotation = state.current.startRot + delta;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    const animationId = requestAnimationFrame(update);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [items, config]);

  return (
    <>
      <div 
        ref={containerRef}
        className="circular-gallery"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1500px',
          overflow: 'hidden',
          cursor: 'grab',
          width: '100%',
          height: '100%'
        }}
      >
        <div 
          ref={wrapperRef}
          style={{
            position: 'relative',
            width: '200%',
            height: '100%',
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="gallery-card"
              onClick={() => {
                if (!state.current.hasMoved) {
                  setActiveImage(item);
                }
              }}
              style={{
                position: 'absolute',
                width: '350px',
                height: '450px',
                borderRadius: (config.borderRadius * 1000) || 50,
                overflow: 'hidden',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--black)',
                userSelect: 'none',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ width: '100%', height: '85%', overflow: 'hidden' }}>
                <img 
                  src={item.image} 
                  alt={item.text}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(20%)',
                    transition: 'transform 0.5s ease, filter 0.5s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.filter = 'grayscale(0%)';
                    e.currentTarget.parentElement.parentElement.style.borderColor = 'var(--amber)';
                    e.currentTarget.parentElement.parentElement.style.zIndex = '1000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'grayscale(20%)';
                    e.currentTarget.parentElement.parentElement.style.borderColor = 'var(--line)';
                    e.currentTarget.parentElement.parentElement.style.zIndex = '1';
                  }}
                />
              </div>
              {item.text && (
                <div style={{
                  height: '15%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: config.font || '700 1rem Barlow Condensed',
                  color: config.textColor || 'var(--amber)',
                  letterSpacing: '0.1em',
                  backgroundColor: 'var(--dim)'
                }}>
                  {item.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeImage && (
        <div 
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center p-4 md:p-8"
          style={{ background: 'var(--glass)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
          onClick={() => {
            setActiveImage(null);
            setZoom(1);
          }}
        >
          <div 
            className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center bg-[color:var(--black)] border border-[color:var(--line)] shadow-2xl relative rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="w-full flex justify-between items-center p-4 border-b border-[color:var(--line)] bg-[color:var(--dim)] z-[10]">
              <div className="flex gap-4">
                <button 
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--white)] hover:border-[color:var(--amber)] transition-colors"
                  onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                  title="Zoom In"
                >
                  +
                </button>
                <div className="flex items-center text-[color:var(--amber)] font-mono text-sm min-w-[3rem] justify-center">
                  {(zoom * 100).toFixed(0)}%
                </div>
                <button 
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--white)] hover:border-[color:var(--amber)] transition-colors"
                  onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                  title="Zoom Out"
                >
                  -
                </button>
                <button 
                  className="px-3 h-10 flex items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--white)] hover:border-[color:var(--amber)] transition-colors text-xs uppercase tracking-tighter"
                  onClick={() => setZoom(1)}
                >
                  Reset
                </button>
              </div>
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--white)] hover:border-[color:var(--amber)] hover:text-[color:var(--amber)] transition-colors text-2xl"
                onClick={() => {
                  setActiveImage(null);
                  setZoom(1);
                }}
              >
                &times;
              </button>
            </div>

            {/* Image Container */}
            <div className="flex-1 w-full overflow-auto flex items-center justify-center p-4 min-h-0 custom-scrollbar">
              <div className="relative inline-block transition-transform duration-300 ease-out" style={{ transform: `scale(${zoom})` }}>
                <img 
                  src={activeImage.image} 
                  alt={activeImage.text}
                  className="max-w-full max-h-[60vh] object-contain shadow-xl"
                  style={{ display: 'block' }}
                />
              </div>
            </div>

            {/* Footer Label */}
            {activeImage.text && (
              <div className="w-full p-4 text-center border-t border-[color:var(--line)] bg-[color:var(--dim)] text-[color:var(--amber)] font-barlow text-sm font-black uppercase tracking-[0.2em]">
                {activeImage.text}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CircularGallery;
