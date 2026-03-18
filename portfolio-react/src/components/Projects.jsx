import React, { useState } from 'react';
import gsap from 'gsap';
import project1 from '../assets/project_self_service_portal_1773339694953.png';
import project2 from '../assets/project_live_streaming_app_1773339717228.png';
import project3 from '../assets/project_salesforce_crm_portal_1773339739335.png';

const projects = [
  {
    title: "Customer Self-Service Portal",
    cat: "Salesforce · Experience Cloud",
    year: "2026",
    desc: "Scalable CRM portal on Experience Cloud. Layered security via OWD, Profiles, Permission Sets. Automated case routing reduced manual effort by 40%. Custom LWC components for real-time status tracking and Knowledge search.",
    tags: ["Experience Cloud", "LWC", "Apex", "Flow"],
    img: project1,
    tech: ["#Apex", "#LWC", "#Flow"]
  },
  {
    title: "Live Streaming Application",
    cat: "Fullstack · AI",
    year: "2025",
    desc: "GUI live streaming tool — 6 simultaneous inputs, dual-stream output, 100+ visual effects, 25+ real-time transitions, AI media generation. 20–30% performance gains through systematic optimisation and debug.",
    tags: ["PyQt", "FFmpeg", "Python", "AI"],
    img: project2,
    tech: ["#Python", "#FFmpeg", "#AI APIs"]
  },
  {
    title: "Cloud Intelligence Dashboard",
    cat: "Salesforce · Analytics",
    year: "2026",
    desc: "Fully responsive developer portfolio and CRM insight dashboard on Salesforce Experience Cloud. CMS collections for code-free updates, server-side validation, and real-time data visualisations.",
    tags: ["Experience Builder", "CMS", "Apex", "LWC"],
    img: project3,
    tech: ["#CMS", "#Apex", "#LWC"]
  }
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
    // Modal animation logic would go here or in a useEffect
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects">
      <div className="section-wrap">
        <div className="sec-label fade-up">Selected Work</div>
        <h2 className="sec-title fade-up">WHAT I<br />SHIPPED</h2>
        <div className="projects-grid">
          {projects.map((project, i) => (
            <div 
              key={i} 
              className="project-card tilt-card fade-up"
              onClick={() => openModal(project)}
            >
              <div className="project-img-wrap">
                <img src={project.img} alt={project.title} />
                <div className="project-overlay"><span className="btn-circle">View Details</span></div>
              </div>
              <div className="project-info">
                <div className="project-header">
                  <span className="project-cat">{project.cat}</span>
                  <span className="project-year">{project.year}</span>
                </div>
                <h3 className="project-title">{project.title}</h3>
                <div className="project-tech">
                  {project.tech.map((t, j) => <span key={j}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="project-modal" style={{ display: 'flex' }} onClick={(e) => { if(e.target.classList.contains('project-modal')) closeModal(); }}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <div className="modal-img"><img src={selectedProject.img} alt={selectedProject.title} /></div>
              <div className="modal-info">
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.desc}</p>
                <div className="modal-tags">
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="exp-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
