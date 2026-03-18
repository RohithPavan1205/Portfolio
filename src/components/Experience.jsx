import React, { useEffect, useRef } from 'react';
import { Layout, Cloud, Camera } from 'lucide-react';
import gsap from 'gsap';

const experiences = [
  {
    num: '01',
    icon: <Layout />,
    role: 'Associate Developer',
    co: 'AJS Innovations Pvt. Ltd.',
    date: 'Jul 2025 – Present',
    body: 'Led a team of 4 to deliver full-stack live streaming solutions. Engineered PyQt tools with 100+ effects and AI API integrations.',
    tags: ['PyQt', 'FFmpeg', 'Python', 'AI']
  },
  {
    num: '02',
    icon: <Cloud />,
    role: 'Salesforce Developer',
    co: 'Trailhead Ranger',
    date: '2024 – Present',
    body: 'Architecting complex CRM solutions. Expert in Apex, LWC, and secure Experience Cloud implementations.',
    tags: ['Apex', 'LWC', 'SOQL', 'Flow']
  },
  {
    num: '03',
    icon: <Camera />,
    role: 'Creative Lead',
    co: 'Visual Craft',
    date: '2021 – Present',
    body: 'Mastering visual storytelling through Photoshop, Lightroom, and Premiere Pro. 1st Prize design winner.',
    tags: ['Photoshop', 'Premiere', 'Motion']
  }
];

const Experience = () => {
  const reelRef = useRef(null);

  useEffect(() => {
    const cards = Array.from(reelRef.current.children);
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 15, rotateX: -y * 15, duration: 0.6, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power4.out' });
      });
    });
  }, []);

  return (
    <section id="experience">
      <div className="section-wrap">
        <div className="sec-label fade-up">Work Experience</div>
        <h2 className="sec-title fade-up">THE REEL<br /><span className="text-stroke">OF WORK</span></h2>
      </div>
      <div className="exp-reel" id="expReel" ref={reelRef}>
        {experiences.map((exp, i) => (
          <div key={i} className="exp-card tilt-card fade-in">
            <div className="exp-num">{exp.num}</div>
            <div className="exp-icon">{exp.icon}</div>
            <div className="exp-role">{exp.role}</div>
            <div className="exp-co">{exp.co}</div>
            <div className="exp-date">{exp.date}</div>
            <div className="exp-body">{exp.body}</div>
            <div className="exp-tags">
              {exp.tags.map((tag, j) => (
                <span key={j} className="exp-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
