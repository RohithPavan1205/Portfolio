import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { SplineScene } from './ui/SplineScene';
import { Spotlight } from './ui/Spotlight';

const Hero = ({ isLight }) => {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const footerRef = useRef(null);
  const n1Ref = useRef(null);
  const n2Ref = useRef(null);
  const resumeBtnRef = useRef(null);
  const laserContainerRef = useRef(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [btnActivated, setBtnActivated] = useState(false);
  const uniformsRef = useRef({
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_color: { type: "c", value: new THREE.Color(isLight ? 0x8A6D15 : 0xC5A021) }
  });

  useEffect(() => {
    uniformsRef.current.u_color.value.set(isLight ? 0x8A6D15 : 0xC5A021);
  }, [isLight]);

  // Laser beam animation
  const fireLaser = useCallback(() => {
    const btn = resumeBtnRef.current;
    const laserContainer = laserContainerRef.current;
    if (!btn || !laserContainer) return;

    const heroSection = btn.closest('#hero');
    if (!heroSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Robot eye position — approximate from the Spline scene (upper-right area)
    const eyeX = heroRect.width * 0.58;
    const eyeY = heroRect.height * 0.28;

    // Button center position relative to hero
    const btnCenterX = btnRect.left - heroRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top - heroRect.top + btnRect.height / 2;

    // Calculate angle and distance
    const dx = btnCenterX - eyeX;
    const dy = btnCenterY - eyeY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Create laser beam SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "laser-svg");
    svg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;overflow:visible;`;

    // Glow filter
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "laser-glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    const blur = document.createElementNS(svgNS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "6");
    blur.setAttribute("result", "coloredBlur");
    const merge = document.createElementNS(svgNS, "feMerge");
    const mn1 = document.createElementNS(svgNS, "feMergeNode");
    mn1.setAttribute("in", "coloredBlur");
    const mn2 = document.createElementNS(svgNS, "feMergeNode");
    mn2.setAttribute("in", "SourceGraphic");
    merge.appendChild(mn1);
    merge.appendChild(mn2);
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Main beam line (thick bright core)
    const beamCore = document.createElementNS(svgNS, "line");
    beamCore.setAttribute("x1", eyeX);
    beamCore.setAttribute("y1", eyeY);
    beamCore.setAttribute("x2", eyeX);
    beamCore.setAttribute("y2", eyeY);
    beamCore.setAttribute("stroke", "#E5C158");
    beamCore.setAttribute("stroke-width", "3");
    beamCore.setAttribute("stroke-linecap", "round");
    beamCore.setAttribute("filter", "url(#laser-glow)");
    beamCore.setAttribute("opacity", "0");
    svg.appendChild(beamCore);

    // Outer glow beam
    const beamGlow = document.createElementNS(svgNS, "line");
    beamGlow.setAttribute("x1", eyeX);
    beamGlow.setAttribute("y1", eyeY);
    beamGlow.setAttribute("x2", eyeX);
    beamGlow.setAttribute("y2", eyeY);
    beamGlow.setAttribute("stroke", "rgba(197, 160, 33, 0.4)");
    beamGlow.setAttribute("stroke-width", "12");
    beamGlow.setAttribute("stroke-linecap", "round");
    beamGlow.setAttribute("filter", "url(#laser-glow)");
    beamGlow.setAttribute("opacity", "0");
    svg.appendChild(beamGlow);

    // Eye flash circle
    const eyeFlash = document.createElementNS(svgNS, "circle");
    eyeFlash.setAttribute("cx", eyeX);
    eyeFlash.setAttribute("cy", eyeY);
    eyeFlash.setAttribute("r", "0");
    eyeFlash.setAttribute("fill", "#E5C158");
    eyeFlash.setAttribute("filter", "url(#laser-glow)");
    eyeFlash.setAttribute("opacity", "0");
    svg.appendChild(eyeFlash);

    laserContainer.appendChild(svg);

    // Create explosion particles container
    const explosionDiv = document.createElement('div');
    explosionDiv.className = 'laser-explosion';
    explosionDiv.style.cssText = `position:absolute;left:${btnCenterX}px;top:${btnCenterY}px;width:0;height:0;pointer-events:none;z-index:55;`;
    laserContainer.appendChild(explosionDiv);

    // --- ANIMATION TIMELINE ---
    const laserTL = gsap.timeline();

    // 1) Eye flash — charging up
    laserTL.to(eyeFlash, {
      attr: { r: 15, opacity: 1 },
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(eyeFlash, {
      attr: { r: 6 },
      duration: 0.15,
      ease: 'power2.in'
    })

    // 2) Fire the laser beam
    .to([beamCore, beamGlow], {
      attr: { opacity: 1 },
      duration: 0.05
    })
    .to([beamCore, beamGlow], {
      attr: { x2: btnCenterX, y2: btnCenterY },
      duration: 0.25,
      ease: 'power4.out'
    })

    // 3) Impact flash on button
    .add(() => {
      // Screen shake
      gsap.to(heroSection, {
        x: 3, duration: 0.05, yoyo: true, repeat: 5,
        onComplete: () => gsap.set(heroSection, { x: 0 })
      });

      // Create explosion ring
      const ring = document.createElement('div');
      ring.className = 'explosion-ring';
      explosionDiv.appendChild(ring);
      gsap.fromTo(ring, 
        { width: 0, height: 0, opacity: 1 },
        { width: 200, height: 200, opacity: 0, duration: 0.6, ease: 'power2.out',
          onComplete: () => ring.remove()
        }
      );

      // Create particles
      const particleCount = 16;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        const pAngle = (i / particleCount) * 360;
        const pDist = 40 + Math.random() * 80;
        const px = Math.cos(pAngle * Math.PI / 180) * pDist;
        const py = Math.sin(pAngle * Math.PI / 180) * pDist;
        const size = 2 + Math.random() * 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        explosionDiv.appendChild(particle);
        gsap.fromTo(particle,
          { x: 0, y: 0, opacity: 1, scale: 1 },
          { x: px, y: py, opacity: 0, scale: 0, duration: 0.5 + Math.random() * 0.4,
            ease: 'power3.out', onComplete: () => particle.remove()
          }
        );
      }

      // Create sparks (small lines)
      for (let i = 0; i < 8; i++) {
        const spark = document.createElement('div');
        spark.className = 'explosion-spark';
        const sAngle = (i / 8) * 360 + Math.random() * 30;
        const sDist = 60 + Math.random() * 60;
        const sx = Math.cos(sAngle * Math.PI / 180) * sDist;
        const sy = Math.sin(sAngle * Math.PI / 180) * sDist;
        spark.style.transform = `rotate(${sAngle}deg)`;
        explosionDiv.appendChild(spark);
        gsap.fromTo(spark,
          { x: 0, y: 0, opacity: 1 },
          { x: sx, y: sy, opacity: 0, duration: 0.4 + Math.random() * 0.3,
            ease: 'power2.out', onComplete: () => spark.remove()
          }
        );
      }
    })

    // 4) Flash the button white briefly
    .to(btn, {
      boxShadow: '0 0 60px 20px rgba(229, 193, 88, 0.8), 0 0 120px 40px rgba(197, 160, 33, 0.5)',
      scale: 1.15,
      duration: 0.15,
      ease: 'power2.out'
    })

    // 5) Activate the button — transform to primary
    .add(() => {
      setBtnActivated(true);
    })
    .to(btn, {
      boxShadow: '0 0 30px 5px rgba(197, 160, 33, 0.3)',
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1.2, 0.5)'
    })

    // 6) Fade out laser beam
    .to([beamCore, beamGlow, eyeFlash], {
      attr: { opacity: 0 },
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.3')

    // 7) Remove button glow shadow after settling
    .to(btn, {
      boxShadow: '0 0 0 0 transparent',
      duration: 0.8,
      ease: 'power2.out'
    })

    // 8) Cleanup
    .add(() => {
      svg.remove();
      explosionDiv.remove();
    });

  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = uniformsRef.current;

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec3 u_color;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv.x *= u_resolution.x / u_resolution.y;

          vec2 shiftedUv = uv + u_mouse * 0.05;

          float particles = 0.0;
          for(float i=1.0; i<4.0; i++) {
            vec2 p_uv = shiftedUv * (2.0 + i);
            p_uv.y += u_time * (0.1 / i);
            p_uv.x += sin(u_time * 0.2 + i) * 0.1;

            vec2 ip = floor(p_uv);
            vec2 fp = fract(p_uv);

            if(hash(ip) > 0.98) {
              float dist = length(fp - 0.5);
              particles += smoothstep(0.15, 0.0, dist) * (0.4 / i);
            }
          }

          vec3 finalColor = u_color * particles;
          gl_FragColor = vec4(finalColor, particles);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.u_resolution.value.x = renderer.domElement.width;
      uniforms.u_resolution.value.y = renderer.domElement.height;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      uniforms.u_mouse.value.x = (e.clientX / window.innerWidth) - 0.5;
      uniforms.u_mouse.value.y = (e.clientY / window.innerHeight) - 0.5;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.u_time.value += 0.015;
      renderer.render(scene, camera);
    };
    animate();

    // Entrance Animation — then fire laser
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to([n1Ref.current, n2Ref.current], { y: '0%', duration: 1.2, stagger: 0.15, ease: 'expo.out' })
      .to(eyebrowRef.current, { opacity: 1, x: 0, duration: 0.8 }, '-=0.8')
      .to(footerRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      // Wait for the robot to settle, then fire laser
      .add(() => {
        // Small delay for the Spline scene to fully render
        setTimeout(() => fireLaser(), 800);
      }, '+=0.5');

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [fireLaser]);

  return (
    <section id="hero" className="relative w-full overflow-hidden flex items-center min-h-[850px] lg:h-screen">
      <div id="hero-three-bg" ref={containerRef} className="absolute inset-0 pointer-events-none"></div>
      
      {!isLight && (
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
        />
      )}

      {/* Laser container — sits over everything in the hero */}
      <div ref={laserContainerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}></div>

      <div className="flex flex-col lg:flex-row h-full w-full max-w-[1440px] px-8 md:px-16 mx-auto relative z-10 pt-24 lg:pt-0">
        
        {/* Left content */}
        <div className="flex-1 lg:p-8 relative z-10 flex flex-col justify-center order-2 lg:order-1 mt-10 lg:mt-0 pb-16 lg:pb-0">
          <div ref={eyebrowRef} className="hero-eyebrow mb-6 text-[color:var(--amber)] tracking-[0.2em] uppercase" style={{ opacity: 0, transform: 'translateX(-20px)' }}>
            Salesforce Developer & Creative Visionary
          </div>
          <div className="hero-title-container mb-6">
            <h1 className="hero-name">
              <span className="hero-name-line block overflow-hidden">
                <span ref={n1Ref} id="n1" className="hero-glow-text block">ROHITH</span>
              </span>
              <span className="hero-name-line block overflow-hidden">
                <span ref={n2Ref} id="n2" className="block text-stroke">PAVAN</span>
              </span>
            </h1>
          </div>
          <div ref={footerRef} className="hero-footer" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <p className="hero-tagline">
              Building cloud architectures that scale.<br />
              <em>Creating visuals that linger.</em>
            </p>
            <div className="hero-btns flex gap-4">
              <button 
                ref={resumeBtnRef}
                onClick={() => setIsResumeOpen(true)}
                className={`btn ${btnActivated ? 'btn-primary' : 'btn-secondary'} laser-target-btn`}
              >
                View Resume
              </button>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
        </div>

        {/* Right content - Spline */}
        <div className="flex-1 relative order-1 lg:order-2 h-[300px] sm:h-[400px] lg:h-full w-full">
          <div className="absolute inset-0 pointer-events-auto">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      {isResumeOpen && (
        <div 
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-12"
          style={{ background: 'var(--glass)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
          onClick={() => setIsResumeOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl h-full flex flex-col bg-[color:var(--black)] border border-[color:var(--line)] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-[color:var(--line)]">
              <h3 className="font-barlow text-xl font-bold uppercase tracking-widest text-[color:var(--amber)]">Resume Preview</h3>
              <div className="flex gap-4">
                <a 
                  href="/Rohith_Pavan_CV.pdf" 
                  download="Rohith_Pavan_CV.pdf"
                  className="btn btn-primary !py-2 !px-6 !text-xs"
                >
                  Download
                </a>
                <button 
                  className="text-white text-3xl leading-none hover:text-[color:var(--amber)]"
                  onClick={() => setIsResumeOpen(false)}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="flex-1 w-full relative bg-white">
              <iframe 
                src="/Rohith_Pavan_CV.pdf#toolbar=0" 
                className="w-full h-full border-none"
                title="Resume Preview"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
