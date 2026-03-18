import React from 'react';
import { ClipPathLinks } from './ui/ClipPathLinks';

const Contact = () => {
  return (
    <section id="contact">
      <div className="contact-bg-text">CONNECT</div>
      <div className="contact-inner">
        <div className="contact-pre fade-up">Ready To Start A Project?</div>
        <h2 className="contact-headline fade-up">LET'S BUILD<br />SOMETHING<br />LEGENDARY</h2>
        <div className="fade-up">
           <ClipPathLinks />
        </div>
        <p className="contact-tagline fade-up mt-12">Currently based in <em>Hyderabad</em>. Always open to Salesforce roles, development projects, or visual collaborations.</p>
      </div>
    </section>
  );
};

export default Contact;
