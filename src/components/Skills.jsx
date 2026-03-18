import React from 'react';
import { Database, Zap, ShieldCheck, Cloud, Layout, Monitor, Globe, Laptop } from 'lucide-react';

const Skills = () => {
  return (
    <section id="skills">
      <div className="section-wrap">
        <style>{`
          .skills-layout {
            display: grid;
            grid-template-columns: 1fr 1.6fr;
            gap: 120px;
          }
          .skills-summary {
            font-family: 'Outfit', sans-serif;
            font-size: 1.15rem;
            line-height: 1.8;
            color: var(--chalk);
            max-width: 500px;
            opacity: 0.8;
          }
          .skill-group {
            margin-bottom: 70px;
          }
          .skill-group-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 2rem;
            color: var(--white);
            letter-spacing: 2px;
            margin-bottom: 28px;
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .skill-group-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--line);
          }
          .skill-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
          }
          .skill-pill {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 24px;
            background: var(--coal);
            border: 1px solid var(--line);
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            font-weight: 500;
            color: var(--white);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          }
          .skill-pill:hover {
            border-color: var(--amber);
            background: var(--dim);
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(197, 160, 33, 0.2);
          }
          .skill-pill img {
            width: 18px;
            height: 18px;
            object-fit: contain;
          }
          .icon-sm {
            width: 18px;
            height: 18px;
            color: var(--amber);
          }

          @media (max-width: 1100px) {
            .skills-layout {
              grid-template-columns: 1fr;
              gap: 60px;
            }
          }
           @media (max-width: 600px) {
            .skill-pill {
              padding: 10px 16px;
              font-size: 11px;
            }
          }
        `}</style>

        <div className="skills-layout">
          <div>
            <div className="sec-label fade-up">Technical Arsenal</div>
            <h2 className="sec-title fade-up">WHAT I<br />WIELD</h2>
            <p className="skills-summary fade-up">From heavy-lifting Salesforce logic to precision-driven visual design — I bridge the gap between robust engineering and cinematic aesthetics.</p>
          </div>
          
          <div className="skills-grid-main">
            <div className="skill-group fade-up">
              <h3 className="skill-group-title"><Monitor size={22} className="icon-sm" /> Code & Frameworks</h3>
              <div className="skill-pills">
                <div className="skill-pill"><img src="https://api.iconify.design/logos:c.svg" alt="C"/> <span>C Lang</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:c-plusplus.svg" alt="C++"/> <span>C++</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:html-5.svg" alt="HTML5"/> <span>HTML5</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:css-3.svg" alt="CSS3"/> <span>CSS3</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:python.svg" alt="Python"/> <span>Python</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:java.svg" alt="Java"/> <span>Java</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:qt.svg" alt="Qt"/> <span>Qt</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:django-icon.svg" alt="Django"/> <span>Django</span></div>
              </div>
            </div>
            
            <div className="skill-group fade-up">
              <h3 className="skill-group-title"><Cloud size={22} className="icon-sm" /> Salesforce Cloud</h3>
              <div className="skill-pills">
                <div className="skill-pill"><img src="https://api.iconify.design/logos:salesforce.svg" alt="Salesforce"/> <span>Apex</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:javascript.svg" alt="LWC"/> <span>LWC Components</span></div>
                <div className="skill-pill"><Database className="icon-sm" /> <span>SOQL · SOSL</span></div>
                <div className="skill-pill"><Zap className="icon-sm" /> <span>Flow Automation</span></div>
                <div className="skill-pill"><ShieldCheck className="icon-sm" /> <span>Security Model</span></div>
                <div className="skill-pill"><Globe className="icon-sm" /> <span>Community Cloud</span></div>
              </div>
            </div>

            <div className="skill-group fade-up">
              <h3 className="skill-group-title"><Laptop size={22} className="icon-sm" /> Engineering Tools</h3>
              <div className="skill-pills">
                <div className="skill-pill"><img src="https://api.iconify.design/logos:visual-studio-code.svg" alt="VS Code"/> <span>VS Code</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:github-icon.svg" alt="GitHub"/> <span>GitHub</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:firebase.svg" alt="Firebase"/> <span>Firebase</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:postman-icon.svg" alt="Postman"/> <span>Postman</span></div>
              </div>
            </div>

            <div className="skill-group fade-up">
              <h3 className="skill-group-title"><Layout size={22} className="icon-sm" /> Design & Creative</h3>
              <div className="skill-pills">
                <div className="skill-pill"><img src="https://api.iconify.design/logos:figma.svg" alt="Figma"/> <span>Figma</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:adobe-photoshop.svg" alt="Photoshop"/> <span>Photoshop</span></div>
                <div className="skill-pill"><img src="https://api.iconify.design/logos:adobe-premiere.svg" alt="Premiere Pro"/> <span>Premiere Pro</span></div>
                <div className="skill-pill"><img src="https://cdn.simpleicons.org/davinciresolve" alt="DaVinci"/> <span>DaVinci Resolve</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
