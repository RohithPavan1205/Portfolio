import React from 'react';

const Education = () => {
  return (
    <section id="education">
      <div className="section-wrap">
        <div className="sec-label fade-up">Education History</div>
        <h2 className="sec-title fade-up">THE ACADEMIC<br />JOURNEY</h2>
        <div className="edu-timeline">
          <div className="edu-item fade-left">
            <div className="edu-dot"></div>
            <div className="edu-meta">
              <span className="edu-date">2023 – 2027</span>
              <span className="edu-type">Undergraduate</span>
            </div>
            <h3 className="edu-degree">B.Tech in Computer Science &amp; Engineering</h3>
            <p className="edu-school">Lovely Professional University, Punjab</p>
            <ul className="edu-details">
              <li>Specialisation in <strong>AI &amp; Machine Learning</strong></li>
              <li>Current CGPA: <strong>8.00 / 10.00</strong></li>
              <li>Core: Data Structures, Algorithms, Salesforce Dev, Database Management</li>
            </ul>
          </div>
          <div className="edu-item fade-left">
            <div className="edu-dot"></div>
            <div className="edu-meta">
              <span className="edu-date">2021 – 2023</span>
              <span className="edu-type">Senior Secondary</span>
            </div>
            <h3 className="edu-degree">MPC (Mathematics, Physics, Chemistry)</h3>
            <p className="edu-school">The Krishna Junior College, Andhra Pradesh</p>
            <ul className="edu-details">
              <li>Board of Intermediate Education: <strong>88%</strong></li>
              <li>Focused on logical reasoning and analytical problem solving.</li>
            </ul>
          </div>
          <div className="edu-item fade-left">
            <div className="edu-dot"></div>
            <div className="edu-meta">
              <span className="edu-date">2021 Graduated</span>
              <span className="edu-type">Secondary School</span>
            </div>
            <h3 className="edu-degree">SSC Grade X</h3>
            <p className="edu-school">Sri Krishna Vidya Vihar High School, Andhra Pradesh</p>
            <ul className="edu-details">
              <li>GPA: <strong>9.0 / 10.0</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
