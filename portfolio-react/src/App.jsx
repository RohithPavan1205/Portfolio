import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FilmStrip from './components/FilmStrip'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Lens from './components/Lens'
import Certifications from './components/Certifications'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import SplashCursor from './components/SplashCursor'
import StarField from './components/StarField'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'


gsap.registerPlugin(ScrollTrigger)

function App() {
  const [loading, setLoading] = useState(true)
  const [isLight, setIsLight] = useState(localStorage.getItem('theme') === 'light')

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-theme')
      document.documentElement.classList.remove('dark')
    } else {
      document.body.classList.remove('light-theme')
      document.documentElement.classList.add('dark')
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark')
  }, [isLight])

  useEffect(() => {
    if (!loading) {
      document.body.classList.add('opened')
      
      // Global animations
      gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        })
      })

      gsap.utils.toArray('.fade-left').forEach(el => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out'
        })
      })

      gsap.utils.toArray('.fade-right').forEach(el => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out'
        })
      })

      gsap.utils.toArray('.fade-in').forEach(el => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          duration: 1.5,
          ease: 'power2.inOut'
        })
      })

      // Scroll Progress Bar
      gsap.to('.scroll-progress-bar', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        },
        width: '100%'
      })
    }
  }, [loading])

  return (
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <>
          <StarField isLight={isLight} />
          <div id="grain"></div>
          <div id="bar-top"></div>
          <div id="bar-bot"></div>
          
          <div className="scroll-progress-container">
            <div className="scroll-progress-bar"></div>
          </div>
          
          <Navbar isLight={isLight} setIsLight={setIsLight} />
          <CustomCursor />
          <SplashCursor />
          
          <main>
            <Hero isLight={isLight} />
            <FilmStrip />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Lens />
            <Certifications />
            <Education />
            <Contact />
          </main>
          
          <Footer />
        </>
      )}
    </>
  )
}

export default App
