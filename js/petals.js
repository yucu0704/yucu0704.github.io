/**
 * WARM INK — Falling Petals Canvas
 * Gentle falling petals in warm tones
 */

(function() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const petals = [];
  const colors = [
    'rgba(232, 165, 152, 0.35)',   // warm pink
    'rgba(212, 120, 79, 0.25)',    // warm orange
    'rgba(196, 69, 54, 0.2)',      // warm red
    'rgba(232, 184, 109, 0.3)',    // warm amber
    'rgba(212, 167, 106, 0.25)',   // gold
  ];
  const maxPetals = 35;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createPetal() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: Math.random() * 0.6 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * 2,
      swaySpeed: Math.random() * 0.01 + 0.005,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    // Draw petal shape
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Subtle vein line
    ctx.beginPath();
    ctx.moveTo(-p.size * 0.7, 0);
    ctx.lineTo(p.size * 0.7, 0);
    ctx.strokeStyle = 'rgba(139, 94, 60, 0.08)';
    ctx.lineWidth = 0.3;
    ctx.stroke();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new petals
    if (petals.length < maxPetals && Math.random() < 0.04) {
      petals.push(createPetal());
    }

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.x += p.speedX + Math.sin(p.sway) * 0.3;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.sway += p.swaySpeed;

      drawPetal(p);

      // Remove if off screen
      if (p.y > canvas.height + 20) {
        petals.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  // Handle visibility change to save CPU
  let animId;
  function startAnim() { animId = requestAnimationFrame(animate); }
  function stopAnim() { cancelAnimationFrame(animId); }

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAnim() : startAnim();
  });

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
  startAnim();
})();
