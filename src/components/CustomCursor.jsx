import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const moveDot = (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveDot);
    return () => window.removeEventListener('mousemove', moveDot);
  }, []);

  return (
    <div id="cursor-dot" ref={dotRef} style={{ translate: '-50% -50%' }}></div>
  );
};

export default CustomCursor;

