import React from 'react';
import { Mail, Linkedin, Github, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact">
      <div className="contact-bg-text">CONNECT</div>
      <div className="contact-inner">
        <div className="contact-pre fade-up">Ready To Start A Project?</div>
        <h2 className="contact-headline fade-up">LET'S BUILD<br />SOMETHING<br />LEGENDARY</h2>
        <p className="contact-tagline fade-up">Currently based in <em>Hyderabad</em>. Always open to Salesforce roles, development projects, or visual collaborations.</p>
        <div className="contact-grid">
          <a href="mailto:rohithpavan1205@gmail.com" className="contact-btn fade-up"><Mail /> <span>Email Me</span></a>
          <a href="https://linkedin.com/in/rohithpavanpothula" target="_blank" rel="noopener noreferrer" className="contact-btn fade-up"><Linkedin /> <span>LinkedIn</span></a>
          <a href="https://github.com/RohithPavan1205" target="_blank" rel="noopener noreferrer" className="contact-btn fade-up"><Github /> <span>GitHub</span></a>
          <a href="https://www.instagram.com/rohithpavan.p" target="_blank" rel="noopener noreferrer" className="contact-btn fade-up"><Instagram /> <span>Instagram</span></a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
