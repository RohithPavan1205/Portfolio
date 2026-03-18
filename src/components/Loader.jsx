import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    const tl = gsap.timeline();
    tl.to('.loader-title span', { y: '0%', duration: 1, ease: 'power4.out', delay: 0.2 });

    if (progress === 100) {
      tl.to('#loader', { opacity: 0, duration: 0.8, onComplete });
    }

    return () => clearInterval(interval);
  }, [progress, onComplete]);

  return (
    <div id="loader">
      <div className="loader-title">
        <span style={{ display: 'inline-block', transform: 'translateY(100%)' }}>ROHITH</span>
      </div>
      <div className="loader-sub">SYSTEMS & ARCHITECTURE</div>
      <div className="loader-progress">
        <div className="loader-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="loader-num">{progress}% COMPLETED</div>
    </div>
  );
};

export default Loader;
