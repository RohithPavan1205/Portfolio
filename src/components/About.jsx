import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Award, Zap, GraduationCap } from 'lucide-react';
import profileImg from '../assets/profile.jpg';

const About = () => {
  const frameRef = useRef(null);
  
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const handleMouseMove = (e) => {
      const rect = frame.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      frame.style.setProperty('--mouse-x', `${x}%`);
      frame.style.setProperty('--mouse-y', `${y}%`);

      const rotateX = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = (e.clientX - rect.left) / rect.width - 0.5;
      gsap.to(frame, { rotateY: rotateY * 15, rotateX: -rotateX * 15, duration: 0.6, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power4.out' });
    };

    frame.addEventListener('mousemove', handleMouseMove);
    frame.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      frame.removeEventListener('mousemove', handleMouseMove);
      frame.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="about">
      <div className="section-wrap">
        <div className="about-layout">
          <div className="about-photo-col fade-left">
            <div className="about-photo-frame" ref={frameRef}>
              <div className="about-photo-inner">
                <img 
                  src={profileImg} 
                  alt="Rohith Pavan" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(100%) brightness(0.9)' }} 
                />
                <div id="about-photo-color" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.5s ease', zIndex: 3 }}>

                  <img 
                    src={profileImg} 
                    alt="Rohith Pavan" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      display: 'block', 
                      maskImage: 'radial-gradient(circle var(--r) at var(--mouse-x) var(--mouse-y), black 0%, black 25%, transparent 90%)',
                      WebkitMaskImage: 'radial-gradient(circle var(--r) at var(--mouse-x) var(--mouse-y), black 0%, black 25%, transparent 90%)'
                    }} 
                  />
                </div>
                <div id="about-photo-spotlight" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.5s ease', background: 'radial-gradient(circle var(--r) at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 60%)', zIndex: 4 }}></div>
              </div>
            </div>
            <p className="about-photo-caption">Rohith Pavan · LPU Jalandhar</p>
          </div>
          <div>
            <div className="sec-label fade-up">About</div>
            <h2 className="sec-title fade-up">THE<br />STRATEGIST</h2>
            <blockquote className="about-big-quote fade-up">"I build systems that are secure and scalable — and I shoot frames that don't forget."</blockquote>
            <div className="about-body">
              <p className="fade-up">A third-year <em>B.Tech CSE (AI & ML)</em> student at <strong>Lovely Professional University</strong>, I specialise in Salesforce — crafting Apex logic, designing LWC components, and securing CRM architectures enterprises trust.</p>
              <p className="fade-up">At <em>AJS Innovations</em>, I lead a team of 4, deliver full-stack applications, and integrate AI APIs into live media pipelines — reducing processing latency by <strong>20–30%</strong> through systematic tuning.</p>
              <p className="fade-up">Off-screen, I'm a photographer and editor who sees composition in everything. Photoshop, Lightroom, Premiere — I speak pixels as fluently as I speak <em>Apex</em>. I proved it by winning <strong>1st Prize at an institutional design competition.</strong></p>
            </div>
            <div className="about-stats">
              <div className="stat-cell fade-up">
                <div className="stat-icon"><Award /></div>
                <div className="stat-n">100+</div>
                <div className="stat-l">Trailhead Badges</div>
              </div>
              <div className="stat-cell fade-up">
                <div className="stat-icon"><Zap /></div>
                <div className="stat-n">50K+</div>
                <div className="stat-l">Points Earned</div>
              </div>
              <div className="stat-cell fade-up">
                <div className="stat-icon"><GraduationCap /></div>
                <div className="stat-n">8.00</div>
                <div className="stat-l">Current CGPA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
