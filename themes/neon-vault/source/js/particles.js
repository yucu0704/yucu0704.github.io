/**
 * NEON VAULT — Particle Network Background
 * Creates a dynamic particle network on canvas
 */

(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouseX = -1000;
  let mouseY = -1000;

  const config = {
    particleCount: 80,
    particleColor: 'rgba(0, 212, 255, 0.6)',
    lineColor: 'rgba(0, 212, 255, 0.08)',
    mouseLineColor: 'rgba(255, 45, 149, 0.15)',
    particleRadius: 1.5,
    lineWidth: 0.5,
    maxDistance: 150,
    mouseRadius: 200,
    speed: 0.4,
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < Math.min(count, config.particleCount); i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        radius: Math.random() * config.particleRadius + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0, 212, 255, 0.3)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          const opacity = (1 - dist / config.maxDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
        }
      }

      // Mouse interaction
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < config.mouseRadius) {
        // Draw connection to mouse
        const mOpacity = (1 - mDist / config.mouseRadius) * 0.25;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(255, 45, 149, ${mOpacity})`;
        ctx.lineWidth = config.lineWidth + 1;
        ctx.stroke();

        // Push particle away from mouse
        const force = (config.mouseRadius - mDist) / config.mouseRadius;
        p.vx += (mdx / mDist) * force * 0.02;
        p.vy += (mdy / mDist) * force * 0.02;
      }

      // Damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > config.speed * 2) {
        p.vx = (p.vx / speed) * config.speed * 2;
        p.vy = (p.vy / speed) * config.speed * 2;
      }
    }
  }

  function animate() {
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      createParticles();
    }, 250);
  });

  // Handle visibility change to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  // Init
  resize();
  createParticles();
  animate();
})();
