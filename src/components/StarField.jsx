import React, { useRef, useEffect, useCallback } from 'react'

const StarField = ({ isLight }) => {
  const canvasRef = useRef(null)
  const animFrame = useRef(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const stars = useRef([])
  const shootingStars = useRef([])
  const asteroids = useRef([])
  const lastShootTime = useRef(0)
  const lastAsteroidTime = useRef(0)

  // Performance: reduce counts, simpler effects
  const STAR_COUNT = 120
  const SHOOTING_STAR_INTERVAL = 2200
  const MAX_SHOOTING_STARS = 4
  const MAX_ASTEROIDS = 2

  const createStar = useCallback((w, h) => {
    const depth = Math.random()
    return {
      worldX: Math.random() * w * 1.2 - w * 0.1,
      worldY: Math.random() * h * 5,
      baseRadius: 0.4 + depth * 1.4,
      depth,
      twinkleSpeed: 0.5 + Math.random() * 2.0,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleMin: 0.15 + Math.random() * 0.2,
      twinkleMax: 0.7 + Math.random() * 0.3,
      driftX: (Math.random() - 0.5) * 0.04,
      driftY: (Math.random() - 0.5) * 0.02,
      type: Math.random(),
    }
  }, [])

  const createShootingStar = useCallback((w, h) => {
    const variant = Math.random()
    let startX, startY, angle

    if (variant < 0.5) {
      startX = Math.random() * w * 0.8 + w * 0.1
      startY = -10
      angle = (Math.PI / 4) + Math.random() * (Math.PI / 3)
    } else if (variant < 0.75) {
      startX = -10
      startY = Math.random() * h * 0.4
      angle = (Math.PI / 8) + Math.random() * (Math.PI / 4)
    } else {
      startX = w + 10
      startY = Math.random() * h * 0.3
      angle = Math.PI - (Math.PI / 8) - Math.random() * (Math.PI / 4)
    }

    const speed = 5 + Math.random() * 10
    const isBright = Math.random() > 0.6

    return {
      x: startX, y: startY, angle, speed,
      life: 1.0,
      decay: isBright ? 0.005 : (0.008 + Math.random() * 0.012),
      width: isBright ? 1.5 + Math.random() * 1.5 : 0.6 + Math.random() * 1,
      trail: [],
      isBright,
    }
  }, [])

  const createAsteroid = useCallback((w, h) => {
    const numVertices = 6 + Math.floor(Math.random() * 4)
    const baseSize = 3 + Math.random() * 7
    const vertices = []
    for (let i = 0; i < numVertices; i++) {
      const a = (Math.PI * 2 * i) / numVertices
      const r = baseSize * (0.6 + Math.random() * 0.5)
      vertices.push({ angle: a, radius: r })
    }

    const fromLeft = Math.random() > 0.5
    return {
      x: fromLeft ? -30 : w + 30,
      y: -30 - Math.random() * 80,
      vertices, baseSize,
      moveAngle: fromLeft
        ? (Math.PI / 5) + Math.random() * (Math.PI / 3)
        : (Math.PI / 2) + (Math.PI / 5) + Math.random() * (Math.PI / 3),
      speed: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.3 + Math.random() * 0.3,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    let w, h, dpr

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const initStars = () => {
      stars.current = Array.from({ length: STAR_COUNT }, () => createStar(w, h))
    }

    resize()
    initStars()

    let resizeTimer
    const resizeHandler = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => { resize(); initStars() }, 150)
    }
    window.addEventListener('resize', resizeHandler)

    // Throttle mouse tracking
    let mouseThrottle = false
    const handleMouseMove = (e) => {
      if (mouseThrottle) return
      mouseThrottle = true
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      requestAnimationFrame(() => { mouseThrottle = false })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Pre-compute colors
    const getColors = (light) => {
      if (!light) {
        return {
          star: 'rgba(249,247,242,',
          gold: 'rgba(197,160,33,',
          blue: 'rgba(100,160,255,',
          asteroid: [120, 105, 80],
          astHi: [160, 140, 100],
          astSh: [60, 50, 35],
          fire: [255, 130, 40],
        }
      }
      return {
        star: 'rgba(30,28,24,',
        gold: 'rgba(138,109,21,',
        blue: 'rgba(50,70,150,',
        asteroid: [80, 70, 55],
        astHi: [110, 95, 70],
        astSh: [50, 40, 30],
        fire: [200, 90, 20],
      }
    }

    let colors = getColors(isLight)
    let scrollY = 0

    // Efficient scroll tracking
    const handleScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', handleScroll, { passive: true })
    scrollY = window.scrollY

    const animate = (time) => {
      ctx.clearRect(0, 0, w, h)

      const mouseX = mouse.current.x
      const mouseY = mouse.current.y
      const t = time * 0.001 // Convert to seconds for cleaner math

      // ============================
      // --- Stars (optimized: no gradients, simple fills) ---
      // ============================
      const nearCursorStars = []

      for (let i = 0; i < stars.current.length; i++) {
        const s = stars.current[i]

        // Drift
        s.worldX += s.driftX
        s.worldY += s.driftY
        if (s.worldX < -15) s.worldX = w + 15
        if (s.worldX > w + 15) s.worldX = -15

        // Parallax
        const parallaxRate = 0.15 + s.depth * 0.3
        const viewY = s.worldY - scrollY * parallaxRate
        const wrapH = h + 80
        const screenY = ((viewY % wrapH) + wrapH) % wrapH - 40
        const screenX = s.worldX

        if (screenY < -20 || screenY > h + 20) continue

        // Twinkle (simple sin)
        const twinkle = s.twinkleMin + (s.twinkleMax - s.twinkleMin) *
          (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase))

        // Mouse interaction (only if close enough — skip if far)
        let brightness = twinkle
        let drawX = screenX
        let drawY = screenY

        const dx = screenX - mouseX
        const dy = screenY - mouseY
        const distSq = dx * dx + dy * dy // Avoid sqrt for distance check
        const interactRadiusSq = 32400 // 180²

        if (distSq < interactRadiusSq) {
          const dist = Math.sqrt(distSq)
          const factor = 1 - dist / 180
          brightness = Math.min(1, twinkle + factor * 0.5)
          const push = factor * 10 * s.depth
          if (dist > 1) {
            drawX += (dx / dist) * push
            drawY += (dy / dist) * push
          }
          if (s.depth > 0.4) {
            nearCursorStars.push({ x: drawX, y: drawY })
          }
        }

        const r = s.baseRadius * (0.8 + s.depth * 0.3)

        // Pick color prefix
        let colorStr
        if (s.type > 0.88) colorStr = colors.blue
        else if (s.type > 0.75) colorStr = colors.gold
        else colorStr = colors.star

        // Simple glow: just a larger, dimmer circle (much cheaper than gradient)
        if (r > 1.0 && brightness > 0.4) {
          ctx.beginPath()
          ctx.arc(drawX, drawY, r * 3, 0, Math.PI * 2)
          ctx.fillStyle = colorStr + (brightness * 0.08) + ')'
          ctx.fill()
        }

        // Star core
        ctx.beginPath()
        ctx.arc(drawX, drawY, r, 0, Math.PI * 2)
        ctx.fillStyle = colorStr + brightness + ')'
        ctx.fill()

        // Simple cross spikes (2 lines, no save/restore)
        if (r > 1.2 && brightness > 0.5) {
          const spikeLen = r * 2.5
          ctx.strokeStyle = colorStr + (brightness * 0.25) + ')'
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(drawX - spikeLen, drawY)
          ctx.lineTo(drawX + spikeLen, drawY)
          ctx.moveTo(drawX, drawY - spikeLen)
          ctx.lineTo(drawX, drawY + spikeLen)
          ctx.stroke()
        }
      }

      // ============================
      // --- Constellation lines (limited to nearby stars only) ---
      // ============================
      if (nearCursorStars.length > 1 && nearCursorStars.length < 12) {
        ctx.strokeStyle = colors.gold + '0.12)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        for (let i = 0; i < nearCursorStars.length; i++) {
          for (let j = i + 1; j < nearCursorStars.length; j++) {
            const a = nearCursorStars[i]
            const b = nearCursorStars[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            if (dx * dx + dy * dy < 10000) { // 100²
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
            }
          }
        }
        ctx.stroke()

        // Cursor-to-star lines
        ctx.strokeStyle = colors.gold + '0.08)'
        ctx.lineWidth = 0.3
        ctx.beginPath()
        for (const s of nearCursorStars) {
          ctx.moveTo(mouseX, mouseY)
          ctx.lineTo(s.x, s.y)
        }
        ctx.stroke()
      }

      // ============================
      // --- Shooting Stars (simplified — no per-segment gradients) ---
      // ============================
      if (time - lastShootTime.current > SHOOTING_STAR_INTERVAL + Math.random() * 1500) {
        if (shootingStars.current.length < MAX_SHOOTING_STARS) {
          const burst = Math.random() > 0.7 ? 2 : 1
          for (let b = 0; b < burst; b++) {
            shootingStars.current.push(createShootingStar(w, h))
          }
        }
        lastShootTime.current = time
      }

      for (let i = shootingStars.current.length - 1; i >= 0; i--) {
        const ss = shootingStars.current[i]

        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.life -= ss.decay

        ss.trail.push({ x: ss.x, y: ss.y })
        const maxTrail = ss.isBright ? 28 : 16
        if (ss.trail.length > maxTrail) ss.trail.shift()

        if (ss.life <= 0 || ss.x > w + 40 || ss.y > h + 40 || ss.x < -40) {
          shootingStars.current.splice(i, 1)
          continue
        }

        // Draw trail as a single tapered path (much cheaper than per-segment gradients)
        if (ss.trail.length > 2) {
          const trailLen = ss.trail.length

          // Draw trail from thin tail to thick head
          for (let t = 1; t < trailLen; t++) {
            const p0 = ss.trail[t - 1]
            const p1 = ss.trail[t]
            const progress = t / trailLen
            const alpha = progress * ss.life * (ss.isBright ? 0.7 : 0.4)

            ctx.strokeStyle = colors.star + alpha + ')'
            ctx.lineWidth = ss.width * progress
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(p0.x, p0.y)
            ctx.lineTo(p1.x, p1.y)
            ctx.stroke()
          }

          // Head glow — simple circle, no gradient
          const glowRad = ss.isBright ? 6 : 3
          ctx.beginPath()
          ctx.arc(ss.x, ss.y, glowRad, 0, Math.PI * 2)
          ctx.fillStyle = colors.star + (ss.life * 0.5) + ')'
          ctx.fill()

          ctx.beginPath()
          ctx.arc(ss.x, ss.y, glowRad * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = colors.gold + (ss.life * 0.1) + ')'
          ctx.fill()

          // Bright stars leave a few sparkle dots (no particle system - just 2-3 static dots)
          if (ss.isBright && trailLen > 5) {
            for (let sp = 0; sp < 3; sp++) {
              const ti = Math.floor(trailLen * (0.3 + sp * 0.2))
              if (ti < trailLen) {
                const tp = ss.trail[ti]
                const sparkAlpha = ss.life * 0.3 * (1 - sp * 0.25)
                ctx.beginPath()
                ctx.arc(
                  tp.x + (Math.sin(t * 3 + sp) * 3),
                  tp.y + (Math.cos(t * 2 + sp) * 3),
                  0.8, 0, Math.PI * 2
                )
                ctx.fillStyle = colors.gold + sparkAlpha + ')'
                ctx.fill()
              }
            }
          }
        }
      }

      // ============================
      // --- Asteroids (simplified — no particle system, just shape + simple trail) ---
      // ============================
      if (time - lastAsteroidTime.current > 7000 + Math.random() * 6000) {
        if (asteroids.current.length < MAX_ASTEROIDS) {
          asteroids.current.push(createAsteroid(w, h))
        }
        lastAsteroidTime.current = time
      }

      for (let i = asteroids.current.length - 1; i >= 0; i--) {
        const ast = asteroids.current[i]

        ast.x += Math.cos(ast.moveAngle) * ast.speed
        ast.y += Math.sin(ast.moveAngle) * ast.speed
        ast.rotation += ast.rotationSpeed

        if (ast.x > w + 80 || ast.x < -80 || ast.y > h + 80) {
          asteroids.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(ast.x, ast.y)
        ctx.rotate(ast.rotation)
        ctx.globalAlpha = ast.opacity

        // Rock shape
        ctx.beginPath()
        for (let v = 0; v < ast.vertices.length; v++) {
          const vt = ast.vertices[v]
          const px = Math.cos(vt.angle) * vt.radius
          const py = Math.sin(vt.angle) * vt.radius
          if (v === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()

        // Simple solid fill with highlight (no gradient)
        ctx.fillStyle = `rgb(${ast.baseSize > 6 ? colors.astHi.join(',') : colors.asteroid.join(',')})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${colors.astHi.join(',')},0.4)`
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Simple fire tail (just a few circles behind, no particle system)
        ctx.globalAlpha = ast.opacity * 0.4
        const tailX = -Math.cos(0) * ast.baseSize * 0.6
        const tailY = -Math.sin(0) * ast.baseSize * 0.6
        for (let f = 0; f < 3; f++) {
          const fx = tailX - (f + 1) * 3
          const fy = tailY + (Math.sin(t * 4 + f * 2)) * 2
          const fr = (3 - f) * 1.2
          ctx.beginPath()
          ctx.arc(fx, fy, fr, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colors.fire[0]},${colors.fire[1]},${colors.fire[2]},${0.3 - f * 0.08})`
          ctx.fill()
        }

        ctx.restore()
      }

      animFrame.current = requestAnimationFrame(animate)
    }

    animFrame.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrame.current)
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLight, createStar, createShootingStar, createAsteroid])

  return (
    <canvas
      ref={canvasRef}
      id="star-field"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  )
}

export default StarField
