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

  const asteroidDroppedRef = useRef(false);

  // Asteroid Animation VFX
  const dropAsteroid = useCallback(() => {
    // Prevent double execution in React StrictMode
    if (asteroidDroppedRef.current) return;
    asteroidDroppedRef.current = true;

    const btn = resumeBtnRef.current;
    const effectContainer = laserContainerRef.current;
    if (!btn || !effectContainer) return;

    const heroSection = btn.closest('#hero');
    if (!heroSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Button center position relative to hero
    const btnCenterX = btnRect.left - heroRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top - heroRect.top + btnRect.height / 2;

    // Start position: Far top right of the hero section
    const startX = heroRect.width - 50; 
    const startY = -200;

    // Calculate angle for the fire trail to point exactly away from movement path
    const dx = btnCenterX - startX;
    const dy = btnCenterY - startY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;

    // Create asteroid wrapper
    const asteroidWrapper = document.createElement('div');
    asteroidWrapper.className = 'asteroid-container';
    asteroidWrapper.style.cssText = `position:absolute;left:${startX}px;top:${startY}px;pointer-events:none;z-index:55;`;

    // Create fire trail
    const fireTrail = document.createElement('div');
    fireTrail.className = 'asteroid-fire-trail';
    fireTrail.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    asteroidWrapper.appendChild(fireTrail);

    // Create main rock
    const rock = document.createElement('div');
    rock.className = 'asteroid-rock';
    asteroidWrapper.appendChild(rock);

    effectContainer.appendChild(asteroidWrapper);

    // Create explosion container
    const explosionDiv = document.createElement('div');
    explosionDiv.className = 'asteroid-explosion';
    explosionDiv.style.cssText = `position:absolute;left:${btnCenterX}px;top:${btnCenterY}px;width:0;height:0;pointer-events:none;z-index:56;`;
    effectContainer.appendChild(explosionDiv);

    // --- ANIMATION TIMELINE ---
    const tl = gsap.timeline();

    // 1) Fall from sky
    tl.to(asteroidWrapper, {
      left: btnCenterX,
      top: btnCenterY,
      duration: 1.8, // Slower fall speed
      ease: 'power1.in'
    })
    // Spin rock while falling
    .to(rock, {
      rotation: -1080, // More spin
      duration: 1.8,
      ease: 'none'
    }, '<')

    // 2) Impact!
    .add(() => {
      // Aggressive screen shake
      gsap.to(heroSection, {
        x: 10, y: 6, duration: 0.05, yoyo: true, repeat: 11,
        onComplete: () => gsap.set(heroSection, { x: 0, y: 0 })
      });

      // Remove the falling asteroid
      asteroidWrapper.remove();

      // Create shockwave ring (Massive and intense)
      const ring = document.createElement('div');
      ring.className = 'impact-shockwave';
      explosionDiv.appendChild(ring);
      gsap.fromTo(ring, 
        { width: 0, height: 0, opacity: 1, borderWidth: 12 },
        { width: 450, height: 450, opacity: 0, borderWidth: 0, duration: 0.9, ease: 'power3.out',
          onComplete: () => ring.remove()
        }
      );

      // Create blast flash (Massive screen illumination)
      const blastFlash = document.createElement('div');
      blastFlash.className = 'blast-flash';
      explosionDiv.appendChild(blastFlash);
      gsap.fromTo(blastFlash,
        { scale: 0, opacity: 1 },
        { scale: 8, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => blastFlash.remove() }
      );

      // Asteroid Fragments (Rock breaking - Lots of shrapnel)
      for (let i = 0; i < 25; i++) {
        const frag = document.createElement('div');
        frag.className = 'asteroid-fragment';
        const size = 4 + Math.random() * 12; // Range from tiny to medium chunks
        frag.style.width = size + 'px';
        frag.style.height = size + 'px';
        frag.style.borderRadius = `${30 + Math.random()*40}% ${30 + Math.random()*40}% ${30 + Math.random()*40}% ${30 + Math.random()*40}%`;
        explosionDiv.appendChild(frag);

        const fAngle = (Math.random() * 360) * Math.PI / 180;
        const fDist = 120 + Math.random() * 300; // Fly MUCH further away
        const fx = Math.cos(fAngle) * fDist;
        const fy = Math.sin(fAngle) * fDist;

        gsap.to(frag, {
          x: fx, y: fy,
          rotation: Math.random() * 1440 - 720,
          opacity: 0,
          duration: 0.8 + Math.random() * 0.8,
          ease: 'power3.out',
          onComplete: () => frag.remove()
        });
      }

      // Fire/Plasma Particles (A massive fireball scatter)
      for (let i = 0; i < 45; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        const pSize = 3 + Math.random() * 10;
        particle.style.width = pSize + 'px';
        particle.style.height = pSize + 'px';
        explosionDiv.appendChild(particle);

        const pAngle = (Math.random() * 360) * Math.PI / 180;
        const pDist = 60 + Math.random() * 250; // Explode far out
        
        gsap.to(particle, {
          x: Math.cos(pAngle) * pDist,
          y: Math.sin(pAngle) * pDist,
          scale: 0,
          opacity: 0,
          duration: 0.5 + Math.random() * 0.7,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        });
      }
    })

    // 3) Button Reaction
    .to(btn, {
      boxShadow: '0 0 60px 20px rgba(255, 120, 0, 0.6), 0 0 100px 30px rgba(255, 60, 0, 0.3)',
      scale: 1.15,
      duration: 0.1,
      ease: 'power2.out'
    }, '-=0.05')

    // 4) Activate Button
    .add(() => {
      setBtnActivated(true);
    })
    .to(btn, {
      boxShadow: '0 0 30px 5px rgba(197, 160, 33, 0.3)',
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)'
    })

    // 5) Remove button glow after settling
    .to(btn, {
      boxShadow: '0 0 0 0 transparent',
      duration: 0.8,
      ease: 'power2.out'
    })

    // 6) Cleanup
    .add(() => {
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
      // Wait for the robot to settle, then drop asteroid
      .add(() => {
        // Delay for dramatic effect
        setTimeout(() => dropAsteroid(), 800);
      }, '+=0.5');

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [dropAsteroid]);

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
