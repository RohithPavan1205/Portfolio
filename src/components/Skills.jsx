import React from 'react';
import { Database, Zap, ShieldCheck, Cloud, Camera } from 'lucide-react';

const Skills = () => {
  return (
    <section id="skills">
      <div className="section-wrap">
        <div className="skills-layout">
          <div>
            <div className="sec-label fade-up">Technical Arsenal</div>
            <h2 className="sec-title fade-up">WHAT<br />I<br />WIELD</h2>
            <p className="skills-summary fade-up">From Salesforce's deepest architecture to pixel-level precision in design — every tool is deliberate, every skill earned through building real things.</p>
          </div>
          <div>
            <div className="skill-group fade-up">
              <h3 className="skill-group-title">Salesforce Ecosystem</h3>
              <div className="skill-pills">
                <div className="skill-pill"><i className="devicon-salesforce-plain colored"></i> <span>Apex ecosystem</span></div>
                <div className="skill-pill"><i className="devicon-javascript-plain colored"></i> <span>LWC Components</span></div>
                <div className="skill-pill"><Database className="icon-sm" /> <span>SOQL · SOSL</span></div>
                <div className="skill-pill"><Zap className="icon-sm" /> <span>Flow Automation</span></div>
                <div className="skill-pill"><ShieldCheck className="icon-sm" /> <span>Security Models</span></div>
                <div className="skill-pill"><Cloud className="icon-sm" /> <span>Experience Cloud</span></div>
              </div>
            </div>
            <div className="skill-group fade-up">
              <h3 className="skill-group-title">Programming & Frameworks</h3>
              <div className="skill-pills">
                <div className="skill-pill"><i className="devicon-python-plain colored"></i> <span>Python</span></div>
                <div className="skill-pill"><i className="devicon-java-plain colored"></i> <span>Java</span></div>
                <div className="skill-pill"><i className="devicon-cplusplus-plain colored"></i> <span>C++</span></div>
                <div className="skill-pill"><i className="devicon-django-plain colored"></i> <span>Django</span></div>
                <div className="skill-pill"><i className="devicon-flask-original colored"></i> <span>Flask</span></div>
                <div className="skill-pill"><i className="devicon-react-original colored"></i> <span>React</span></div>
              </div>
            </div>
            <div className="skill-group fade-up">
              <h3 className="skill-group-title">Creative Suite</h3>
              <div className="skill-pills">
                <div className="skill-pill"><i className="devicon-photoshop-plain colored"></i> <span>Photoshop</span></div>
                <div className="skill-pill"><Camera className="icon-sm" /> <span>Lightroom</span></div>
                <div className="skill-pill"><i className="devicon-premierepro-plain colored"></i> <span>Premiere Pro</span></div>
                <div className="skill-pill"><i className="devicon-aftereffects-plain colored"></i> <span>After Effects</span></div>
              </div>
            </div>
            <div className="skill-group fade-up">
              <h3 className="skill-group-title">Dev Tools & Platforms</h3>
              <div className="skill-pills">
                <div className="skill-pill"><i className="devicon-git-plain colored"></i> <span>Git · GitHub</span></div>
                <div className="skill-pill"><i className="devicon-vscode-plain colored"></i> <span>VS Code</span></div>
                <div className="skill-pill"><i className="devicon-docker-plain colored"></i> <span>Docker</span></div>
                <div className="skill-pill"><i className="devicon-amazonwebservices-plain-wordmark colored"></i> <span>AWS</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
