import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import DecryptedText from './DecryptedText';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Handle Progress Counter
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
    return () => clearInterval(interval);
  }, []);

  // Handle Exit
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        gsap.to('#loader', { opacity: 0, duration: 0.8, onComplete });
      }, 500); // Give it a moment to finish decrypting the name
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div id="loader">
      <div className="loader-title">
        <DecryptedText 
          text="ROHITH PAVAN"
          speed={40}
          maxIterations={20}
          animateOn="view"
          revealDirection="center"
          sequential
          className="revealed"
          encryptedClassName="encrypted"
        />
      </div>
      <div className="loader-sub">
        <DecryptedText 
          text="SYSTEMS & ARCHITECTURE"
          speed={30}
          maxIterations={15}
          animateOn="view"
          sequential
          className="revealed"
          encryptedClassName="encrypted"
        />
      </div>
      <div className="loader-progress">
        <div className="loader-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="loader-num">{progress}% COMPLETED</div>
    </div>
  );
};

export default Loader;
