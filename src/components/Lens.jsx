import React from 'react';
import CircularGallery from './CircularGallery';
import img1 from '../assets/Photos/1.jpg';
import img2 from '../assets/Photos/2.jpg';
import img3 from '../assets/Photos/3.png';
import img4 from '../assets/Photos/4.png';
import img5 from '../assets/Photos/5.jpg';
import img6 from '../assets/Photos/6.png';
import img7 from '../assets/Photos/7.jpg';
import img8 from '../assets/Photos/8.jpg';
import img9 from '../assets/Photos/9.jpg';
import img10 from '../assets/Photos/10.jpg';

const Lens = () => {
  const items = [
    { image: img1, text: 'FOCUS' },
    { image: img2, text: 'GLOW' },
    { image: img3, text: 'PERSPECTIVE' },
    { image: img4, text: 'VISION' },
    { image: img5, text: 'MOMENT' },
    { image: img6, text: 'STREET' },
    { image: img7, text: 'FRAME' },
    { image: img8, text: 'COMPOSITION' },
    { image: img9, text: 'LIGHT' },
    { image: img10, text: 'TEXTURE' }
  ];

  return (
    <section id="photography">
      <div className="section-wrap">
        <div className="sec-label fade-up">Through The Lens</div>
        <h2 className="sec-title fade-up">VISUAL<br />CRAFT</h2>
        
        <div className="photography-gallery-container" style={{ height: '600px', width: '100%', position: 'relative', marginBottom: '20px', zIndex: 100 }}>
          <CircularGallery 
            items={items} 
            options={{ 
              bend: 1.5, 
              textColor: 'var(--amber)', 
              borderRadius: 0.05, 
              font: '700 1.2rem Barlow Condensed' 
            }} 
          />
        </div>
        
        <div className="photo-intro-wrapper">
          <p className="photo-intro-text fade-up">Photography is not a hobby — it's how I understand <em>light, time, and composition</em>. The same eye I use to frame a shot is what I bring to designing interfaces: intentional, balanced, unforgettable.</p>
        </div>


      </div>
    </section>
  );
};

export default Lens;
