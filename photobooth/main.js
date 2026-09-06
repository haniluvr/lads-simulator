/* ============================================================
   COSMO PHOTOBOOTH — main.js (Landing Page)
   ============================================================ */

// ============================================================
// Entrance Animations (Intersection Observer)
// ============================================================
const observeEntrance = () => {
  const targets = document.querySelectorAll('.animate-fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  const flipTarget = document.querySelector('.flip-container');
  if (flipTarget) {
    const flipObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.7 });
    flipObserver.observe(flipTarget);
  }
};

// ============================================================
// Sample Strip Rotation (Printer Machine)
// ============================================================
const setupSampleCycler = () => {
  const stripImg = document.getElementById('sample-strip');
  const stripContainer = document.getElementById('emerging-strip');
  if (!stripImg || !stripContainer) return;

  const TOTAL_SAMPLES = 6;
  let currentSample = 1;

  // The CSS animation 'stripEmerge' loops every 12s. 
  // At the end of the loop (100%), the strip is fully hidden at translateY(-100%).
  stripContainer.addEventListener('animationiteration', () => {
    currentSample = currentSample >= TOTAL_SAMPLES ? 1 : currentSample + 1;
    stripImg.src = `../assets/photobooth/sample/sample_${currentSample}.webp`;
  });
};

// ============================================================
// Smooth Scroll for anchor links
// ============================================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

// ============================================================
// Duplicate showcase track for seamless infinite scroll
// ============================================================
const initInfiniteScroll = () => {
  const tracks = document.querySelectorAll('.samples-track');
  tracks.forEach(track => {
    // Clone all children and append for seamless loop
    const children = Array.from(track.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });
};

// ============================================================
// Nav scroll behavior (add background on scroll)
// ============================================================
const initNavScroll = () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(8, 8, 26, 0.95)';
    } else {
      nav.style.background = 'rgba(8, 8, 26, 0.7)';
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
};

// ============================================================
// 3D tilt effect on showcase strips (desktop only)
// ============================================================
const initTiltEffect = () => {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.showcase-strip').forEach(strip => {
    strip.addEventListener('mousemove', (e) => {
      const rect = strip.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      strip.style.transform = `translateY(-6px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
    });

    strip.addEventListener('mouseleave', () => {
      strip.style.transform = '';
    });
  });
};

// ============================================================
// CTA character ring — add CSS custom property polyfill
// for cos/sin (fallback for browsers without native support)
// ============================================================
const initCharRing = () => {
  const dots = document.querySelectorAll('.cta-char-dot');
  const radius = 80;
  dots.forEach((dot, i) => {
    const angle = (i / dots.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    dot.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    dot.style.top = '50%';
    dot.style.left = '50%';
  });
};

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  observeEntrance();
  setupSampleCycler();
  initSmoothScroll();
  initInfiniteScroll();
  initNavScroll();
  initTiltEffect();
  initCharRing();
  initAudio();
  // Settings modal events handled by global-settings.js
  initNoticeEvents();
  initStarfield();
});

// ============================================================
// Modal & Audio Logic
// ============================================================
function initAudio() {
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle');

  if (!bgMusic || !musicToggleBtn) return;
  // Volume is applied by AudioBridge.init() from the shared lds_gacha_v1 state.

  // AudioBridge handles track detection, position restore, volume, and autoplay.
  // Same track as booth.html → continues; different track → plays from start.
  AudioBridge.initBtn(bgMusic, musicToggleBtn);

  musicToggleBtn.addEventListener('click', () => {
    AudioBridge.toggleBtn(bgMusic, musicToggleBtn);
  });
}

// Settings modal events (open/close/sliders/cursor) are handled by global-settings.js
// This function is kept as a stub for backward compatibility.
function initSettings() {}

function initNoticeEvents() {
  const noticeBtn = document.getElementById('notice-btn');
  const noticeModal = document.getElementById('notice-modal');
  const noticeClose = document.getElementById('notice-close-btn');

  if (!noticeBtn || !noticeModal) return;

  const closeNoticeModal = () => {
    noticeModal.classList.remove('active');
    setTimeout(() => { noticeModal.style.display = 'none'; }, 300);
  };

  noticeBtn.addEventListener('click', () => {
    noticeModal.style.display = '';
    requestAnimationFrame(() => requestAnimationFrame(() => noticeModal.classList.add('active')));
  });
  
  if (noticeClose) noticeClose.addEventListener('click', closeNoticeModal);
  noticeModal.addEventListener('click', (e) => {
    if (e.target === noticeModal) closeNoticeModal();
  });
}

// ============================================================
// Starfield & Comets
// ============================================================
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Generate static star data (positions normalised 0-1)
  const stars = Array.from({ length: 280 }, () => ({
    nx:    Math.random(),
    ny:    Math.random(),
    size:  Math.pow(Math.random(), 2) * 1.8 + 0.2,
    base:  Math.random() * 0.55 + 0.1,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.012 + 0.004,
  }));

  // Shooting stars pool
  let shoots = [];

  function maybeShoot() {
    const prob = 0.003;
    const maxShoots = 3;
    if (Math.random() < prob && shoots.length < maxShoots) {
      const angle = (Math.random() * 30 + 20) * (Math.PI / 180); // 20°-50° diagonal
      const speed = Math.random() * 5 + 3;
      shoots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.018 + 0.012,
        tail: Math.random() * 90 + 40,
      });
    }
  }

  let t = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.008;

    // Draw stars
    for (const s of stars) {
      const alpha = s.base * (0.5 + 0.5 * Math.sin(t * s.speed * 7 + s.phase));
      ctx.beginPath();
      ctx.arc(s.nx * canvas.width, s.ny * canvas.height, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fill();
    }

    maybeShoot();

    // Draw shooting stars
    for (let i = shoots.length - 1; i >= 0; i--) {
      const sh = shoots[i];
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= sh.decay;

      if (sh.life <= 0 || sh.y > canvas.height || sh.x > canvas.width) {
        shoots.splice(i, 1);
        continue;
      }

      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * sh.tail, sh.y - sh.vy * sh.tail);
      grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * sh.tail, sh.y - sh.vy * sh.tail);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

// ============================================================
// AUDIO CUES
// ============================================================
const initAudioCues = () => {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .btn, .btn-ghost, .btn-solid, .shoot-btn, .pose-card-btn, .char-filter-pill, .shoot-char-toggle, .color-picker-btn, .text-color-btn, .template-card, .frame-option, .music-toggle-btn, .bgm-btn');
    if (!target) return;

    // Check if it's the booth link
    const isBoothLink = target.closest('a[href="booth.html"]');
    if (isBoothLink) {
      e.preventDefault();
      // Use AudioBridge if available to play gold SFX without delay
      if (window.AudioBridge && window.AudioBridge.playSfx) {
        window.AudioBridge.playSfx('../assets/audio-cue/open_wish_gold_cue.mp3');
      } else {
        const goldSfx = new Audio('../assets/audio-cue/open_wish_gold_cue.mp3');
        goldSfx.volume = window.AudioBridge ? window.AudioBridge.getSfxVol() : 0.6;
        goldSfx.play().catch(()=>{});
      }
      
      sessionStorage.setItem('gold_sfx_start', Date.now().toString());
      
      setTimeout(() => {
        window.location.href = isBoothLink.href;
      }, 100);
      return;
    }
  });
};

document.addEventListener('DOMContentLoaded', initAudioCues);
