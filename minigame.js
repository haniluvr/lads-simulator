// minigame.js — Wishfall Frenzy

(function () {
  'use strict';

  // ── DOM References ────────────────────────────────────────────────
  const container    = document.getElementById('minigame-container');
  const canvas       = document.getElementById('minigame-canvas');
  const ctx          = canvas.getContext('2d');

  const introEl      = document.getElementById('minigame-intro');
  const countdownEl  = document.getElementById('minigame-countdown');
  const countdownTxt = document.getElementById('countdown-text');
  const gameoverEl   = document.getElementById('minigame-gameover');
  const pauseOverlay = document.getElementById('minigame-pause-overlay');
  const titleEl      = document.getElementById('wishfall-title-el');

  const dsScoreEl    = document.getElementById('minigame-ds-score');
  const emScoreEl    = document.getElementById('minigame-em-score');
  const timeEl       = document.getElementById('minigame-time');
  const pauseBtn     = document.getElementById('minigame-pause-btn');
  const pauseIcon    = document.getElementById('pause-icon');
  const playIcon     = document.getElementById('play-icon');
  const exitBtn      = document.getElementById('minigame-exit-btn');
  const startBtn     = document.getElementById('minigame-start-btn');
  const claimBtn     = document.getElementById('minigame-claim-btn');

  const rewardDsEl   = document.getElementById('reward-ds-count');
  const rewardEmEl   = document.getElementById('reward-em-count');

  // ── Audio ─────────────────────────────────────────────────────────
  const audio = {
    bgm:       new Audio('assets/ui/arcade/audio/claw-paradise.mp3'),
    bomb:      new Audio('assets/ui/arcade/audio/bomb-cue.mp3'),
    click:     new Audio('assets/ui/arcade/audio/click-tap-cue.mp3'),
    countdown: new Audio('assets/ui/arcade/audio/countdown-cue.mp3'),
    rewards:   new Audio('assets/ui/arcade/audio/rewards-cue.mp3'),
    wish:      new Audio('assets/ui/arcade/audio/wish-cue.mp3'),
  };
  audio.bgm.loop = true;
  window.updateMinigameVolume = function() {
    if (typeof gs !== 'undefined') {
      audio.bgm.volume = gs.volume ?? 0.5;
      const sfxVol = gs.sfxVolume ?? 0.5;
      Object.values(audio).forEach(a => { if (a !== audio.bgm) a.volume = sfxVol; });
    }
  };
  // Initialize immediately just in case
  window.updateMinigameVolume();

  // ── Arc Title Builder ─────────────────────────────────────────────
  // Splits "WISHFALL FRENZY" into per-letter spans with arc offset.
  // On mobile (<=480px) injects a line-break span between words.
  function buildArcTitle() {
    if (!titleEl) return;
    const words = ['WISHFALL', 'FRENZY'];
    const text  = 'WISHFALL FRENZY';
    const letters = text.split('');
    const total   = letters.filter(c => c !== ' ').length;
    // Arc amplitude in px — letters at edges drop down, center rises up
    const ARC = 10; // max vertical offset in px
    const isMobile = window.innerWidth <= 480;

    titleEl.innerHTML = '';
    let charIdx = 0;

    words.forEach((word, wi) => {
      // Add line-break between words on mobile
      if (wi > 0) {
        if (isMobile) {
          const br = document.createElement('span');
          br.className = 'arc-letter line-break';
          titleEl.appendChild(br);
        } else {
          const sp = document.createElement('span');
          sp.className = 'arc-letter';
          sp.textContent = '\u00A0'; // non-breaking space
          titleEl.appendChild(sp);
        }
      }
      word.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'arc-letter';
        span.textContent = ch;
        // Normalized position 0..1 across all non-space chars
        const t   = charIdx / (total - 1); // 0 at left, 1 at right
        // Arc: parabola, highest at center (t=0.5), lowest at edges
        const arc = -ARC * (4 * t * (1 - t) - 0); // 0 at edges, -ARC at center
        span.style.setProperty('--arc-y', `${arc}px`);
        titleEl.appendChild(span);
        charIdx++;
      });
    });
  }

  // Build immediately and on resize
  buildArcTitle();
  window.addEventListener('resize', buildArcTitle);


  function playSound(snd) {
    snd.currentTime = 0;
    snd.play().catch(() => {});
  }

  // ── Images ────────────────────────────────────────────────────────
  const imgDsWish = new Image(); imgDsWish.src = 'assets/ui/deepspace-wish.webp';
  const imgEmWish = new Image(); imgEmWish.src = 'assets/ui/empyrean-wish.webp';
  const imgBomb   = new Image(); imgBomb.src   = 'assets/ui/bomb.webp';

  // ── Game state ────────────────────────────────────────────────────
  let isPlaying    = false;
  let isPaused     = false;
  let animationId  = null;
  let lastTime     = 0;

  let dsScore = 0;
  let emScore = 0;

  const TOTAL_TIME = 90; // seconds
  let timeLeft     = TOTAL_TIME;

  // Falling items
  let items      = [];
  let itemTimer  = 0; // ms accumulator for next spawn

  // Basket
  const BASKET_SIZE     = 72; // px (natural scale, unscaled)
  const BASKET_SPEED_PX = 280; // px/sec — comfortable for the controlled frame
  let basket = {
    x:   0,
    y:   0,
    img: new Image(),
  };
  let selectedChar = 'xavier';

  // Keys
  const keys = { left: false, right: false };

  // Touch drag
  let isDragging  = false;
  let dragOffsetX = 0;

  // ── Canvas geometry ───────────────────────────────────────────────
  // The canvas element is positioned by CSS over the transparent frame zone.
  // We read its rendered width/height from getBoundingClientRect each resize.
  let CW = 0; // canvas render width
  let CH = 0; // canvas render height

  function syncCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    CW = rect.width;
    CH = rect.height;
    canvas.width  = CW;
    canvas.height = CH;
    // Reposition basket Y to bottom of play area (leaving a little gap)
    basket.y = CH - scaledSize(BASKET_SIZE) - 4;
    if (!isPlaying && !isPaused) {
      basket.x = CW / 2 - scaledSize(BASKET_SIZE) / 2;
    }
  }

  function scaledSize(naturalPx) {
    // Scale item sizes relative to canvas width (reference width = 300px)
    return naturalPx * (CW / 300);
  }

  window.addEventListener('resize', () => { if (container.style.display !== 'none') syncCanvasSize(); });

  // ── Input handling ────────────────────────────────────────────────
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

  // Touch / mouse on canvas
  canvas.addEventListener('touchstart', e => {
    if (!isPlaying || isPaused) return;
    e.preventDefault();
    const touch   = e.touches[0];
    const rect    = canvas.getBoundingClientRect();
    const touchX  = touch.clientX - rect.left;
    isDragging    = true;
    dragOffsetX   = touchX - basket.x;
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    if (!isPlaying || isPaused || !isDragging) return;
    e.preventDefault();
    const touch  = e.touches[0];
    const rect   = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    basket.x     = touchX - dragOffsetX;
    clampBasket();
  }, { passive: false });

  canvas.addEventListener('touchend',   () => { isDragging = false; });
  canvas.addEventListener('touchcancel',() => { isDragging = false; });

  canvas.addEventListener('mousedown', e => {
    if (!isPlaying || isPaused) return;
    const rect   = canvas.getBoundingClientRect();
    isDragging   = true;
    dragOffsetX  = e.clientX - rect.left - basket.x;
  });
  canvas.addEventListener('mousemove', e => {
    if (!isPlaying || isPaused || !isDragging) return;
    const rect = canvas.getBoundingClientRect();
    basket.x   = (e.clientX - rect.left) - dragOffsetX;
    clampBasket();
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  function clampBasket() {
    const bw = scaledSize(BASKET_SIZE);
    if (basket.x < 0)       basket.x = 0;
    if (basket.x > CW - bw) basket.x = CW - bw;
  }

  // ── Character selection ───────────────────────────────────────────
  document.querySelectorAll('.char-basket').forEach(el => {
    el.addEventListener('click', () => {
      playSound(audio.click);
      document.querySelectorAll('.char-basket').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      selectedChar = el.dataset.char;
    });
  });

  // ── Entry / Exit ──────────────────────────────────────────────────
  document.getElementById('arcade-open-btn').addEventListener('click', () => {
    if (window.pauseMainBGM) window.pauseMainBGM();

    // Mobile/Safari hack: unlock all audio contexts during this first user gesture
    Object.values(audio).forEach(a => {
      if (a !== audio.bgm && a !== audio.click) {
        const p = a.play();
        if (p !== undefined) {
          p.catch(() => {}).then(() => { a.pause(); a.currentTime = 0; });
        }
      }
    });

    playSound(audio.click);
    container.style.display = 'flex';
    introEl.style.display   = 'flex';
    gameoverEl.style.display = 'none';
    pauseOverlay.style.display = 'none';
    syncCanvasSize();
    // Auto-play BGM as soon as user enters the arcade page
    if (audio.bgm.paused) {
      audio.bgm.currentTime = 0;
      audio.bgm.play().catch(() => {});
    }
  });

  exitBtn.addEventListener('click', () => {
    playSound(audio.click);
    forceExit();
  });

  startBtn.addEventListener('click', () => {
    playSound(audio.click);
    introEl.style.display = 'none';
    startGame();
  });

  pauseBtn.addEventListener('click', () => {
    playSound(audio.click);
    if (!isPlaying) return;
    isPaused ? resumeGame() : pauseGame();
  });

  document.getElementById('minigame-resume-btn').addEventListener('click', () => {
    playSound(audio.click);
    if (isPaused) resumeGame();
  });

  document.getElementById('minigame-end-btn').addEventListener('click', () => {
    playSound(audio.click);
    if (isPaused) {
      pauseOverlay.style.display = 'none';
      endGame();
    }
  });

  claimBtn.addEventListener('click', () => {
    playSound(audio.click);
    if (window.addArcadeWishes) {
      window.addArcadeWishes(dsScore, emScore);
    }
    gameoverEl.style.display = 'none';
    container.style.display  = 'none';
    isPlaying = false;
    if (window.resumeMainBGM) window.resumeMainBGM();
  });

  // ── Countdown helper ──────────────────────────────────────────────
  function playCountdown(callback) {
    countdownEl.style.display = 'flex';
    // countdown-cue.mp3 timing: audio starts, "3" shows at ~1s in
    audio.countdown.currentTime = 0;
    audio.countdown.play().catch(() => {});

    countdownTxt.style.animation = 'none';
    countdownTxt.textContent = '';

    const steps = ['3', '2', '1', 'GO!'];
    let i = 0;

    function showStep() {
      if (i >= steps.length) {
        countdownEl.style.display = 'none';
        callback();
        return;
      }
      countdownTxt.textContent = steps[i];
      // Re-trigger animation
      countdownTxt.style.animation = 'none';
      void countdownTxt.offsetWidth; // reflow
      countdownTxt.style.animation = 'countPop 0.9s ease-out forwards';
      i++;
      setTimeout(showStep, 950);
    }

    setTimeout(showStep, 1000); // 1s delay for audio alignment
  }

  // ── Game flow ─────────────────────────────────────────────────────
  function startGame() {
    basket.img.src = `assets/ui/arcade/${selectedChar}-basket.webp`;
    dsScore   = 0;
    emScore   = 0;
    timeLeft  = TOTAL_TIME;
    items     = [];
    itemTimer = 0;
    isPaused  = false;

    updateHUD();
    syncCanvasSize();

    playCountdown(() => {
      isPlaying = true;
      lastTime  = performance.now();
      audio.bgm.play().catch(() => {});
      setPauseIcon(false);
      animationId = requestAnimationFrame(gameLoop);
    });
  }

  function pauseGame() {
    isPaused = true;
    setPauseIcon(true);
    cancelAnimationFrame(animationId);
    pauseOverlay.style.display = 'flex';
  }

  function resumeGame() {
    // Hide pause overlay then show countdown before resuming
    pauseOverlay.style.display = 'none';
    playCountdown(() => {
      isPaused = false;
      lastTime = performance.now();
      audio.bgm.play().catch(() => {});
      setPauseIcon(false);
      animationId = requestAnimationFrame(gameLoop);
    });
  }

  function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    audio.bgm.pause();

    rewardDsEl.textContent = dsScore;
    rewardEmEl.textContent = emScore;

    setTimeout(() => {
      audio.rewards.currentTime = 0;
      audio.rewards.play().catch(() => {});
      gameoverEl.style.display = 'flex';
    }, 200);
  }

  function forceExit() {
    isPlaying = false;
    isPaused  = false;
    cancelAnimationFrame(animationId);
    audio.bgm.pause();
    container.style.display    = 'none';
    gameoverEl.style.display   = 'none';
    pauseOverlay.style.display = 'none';
    introEl.style.display      = 'flex'; // reset for next open
    if (window.resumeMainBGM) window.resumeMainBGM();
  }

  // ── Pause icon toggle ─────────────────────────────────────────────
  function setPauseIcon(showPlay) {
    pauseIcon.style.display = showPlay ? 'none' : 'block';
    playIcon.style.display  = showPlay ? 'block' : 'none';
  }

  // ── HUD ───────────────────────────────────────────────────────────
  function updateHUD() {
    dsScoreEl.textContent = dsScore;
    emScoreEl.textContent = emScore;
    const m = Math.floor(timeLeft / 60);
    const s = Math.floor(timeLeft % 60);
    timeEl.textContent = `0${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // ── Pacing config ─────────────────────────────────────────────────
  // Returns { interval, minSpeed, maxSpeed, bombAllowed, alternate }
  // "alternate" = true means wishes and bombs take turns (not purely random)
  function getPacing(elapsed) {
    if (elapsed <= 15) {
      // 0–15s: slow, no bomb, steady (no alternating)
      return { interval: 1400, minSpeed: 30,  maxSpeed: 50, bombAllowed: false, alternate: false };
    } else if (elapsed <= 30) {
      // 16–30s: faster, no bomb, steady
      return { interval: 1050, minSpeed: 50, maxSpeed: 70, bombAllowed: false, alternate: false };
    } else if (elapsed <= 45) {
      // 31–45s: normal, bombs start, alternating begins
      return { interval: 800,  minSpeed: 70, maxSpeed: 90, bombAllowed: true,  alternate: true };
    } else if (elapsed <= 60) {
      // 46–60s: fast-ish, alternating
      return { interval: 620,  minSpeed: 90, maxSpeed: 110, bombAllowed: true,  alternate: true };
    } else if (elapsed <= 75) {
      // 61–75s: fast, alternating
      return { interval: 450,  minSpeed: 110, maxSpeed: 130, bombAllowed: true,  alternate: true };
    } else {
      // 76–90s: very fast, alternating
      return { interval: 310,  minSpeed: 130, maxSpeed: 150, bombAllowed: true,  alternate: true };
    }
  }

  // Track the last spawned category for alternating logic
  let lastSpawnWasWish = false;

  function spawnItem(pacing) {
    const { minSpeed, maxSpeed, bombAllowed, alternate } = pacing;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    const iSize = scaledSize(40); // item size scaled relative to canvas

    let type;
    if (!bombAllowed) {
      // Only wishes, no alternating needed — random ds or em
      type = Math.random() < 0.5 ? 'ds' : 'em';
    } else if (alternate) {
      // Alternating: if last was wish → now spawn bomb or wish (weighted)
      // If last was bomb → now spawn wish
      if (!lastSpawnWasWish) {
        // Force a wish this turn
        type = Math.random() < 0.5 ? 'ds' : 'em';
        lastSpawnWasWish = true;
      } else {
        // 35% chance of bomb, 65% wish
        type = Math.random() < 0.35 ? 'bomb' : (Math.random() < 0.5 ? 'ds' : 'em');
        lastSpawnWasWish = (type !== 'bomb');
      }
    } else {
      type = Math.random() < 0.5 ? 'ds' : 'em';
    }

    const img = type === 'ds' ? imgDsWish : type === 'em' ? imgEmWish : imgBomb;
    const x   = Math.random() * (CW - iSize);

    items.push({ type, x, y: -iSize, size: iSize, speed, img });
  }

  // ── Main game loop ────────────────────────────────────────────────
  function gameLoop(ts) {
    if (!isPlaying || isPaused) return;

    const dt = Math.min((ts - lastTime) / 1000, 0.05); // cap dt at 50ms
    lastTime = ts;

    // Countdown timer
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateHUD();
      endGame();
      return;
    }

    // Keyboard movement
    const spd = BASKET_SPEED_PX * (CW / 300) * dt;
    const bw  = scaledSize(BASKET_SIZE);
    if (keys.left)  { basket.x -= spd; }
    if (keys.right) { basket.x += spd; }
    clampBasket();

    // Spawn
    const elapsed = TOTAL_TIME - timeLeft;
    const pacing  = getPacing(elapsed);
    itemTimer += dt * 1000;
    if (itemTimer >= pacing.interval) {
      itemTimer = 0;
      spawnItem(pacing);
    }

    // Update items + collision
    const catchY = basket.y + bw * 0.2; // hit zone slightly above bottom of basket
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed * dt;

      // Simple AABB collision with basket
      const hitX = item.x < basket.x + bw && item.x + item.size > basket.x;
      const hitY = item.y + item.size > catchY && item.y < basket.y + bw;

      if (hitX && hitY) {
        if (item.type === 'ds') {
          dsScore++;
          playSound(audio.wish);
        } else if (item.type === 'em') {
          emScore++;
          playSound(audio.wish);
        } else if (item.type === 'bomb') {
          // -5 total penalty: take from the higher score first
          let penalty = 5;
          while (penalty > 0 && (dsScore > 0 || emScore > 0)) {
            if (dsScore >= emScore && dsScore > 0) {
              dsScore--;
            } else if (emScore > 0) {
              emScore--;
            }
            penalty--;
          }
          playSound(audio.bomb);
        }
        items.splice(i, 1);
        continue;
      }

      // Remove if off screen
      if (item.y > CH + 10) {
        items.splice(i, 1);
      }
    }

    updateHUD();
    draw();

    animationId = requestAnimationFrame(gameLoop);
  }

  // ── Draw ──────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, CW, CH);

    // Draw falling items (no stretching — keep natural aspect ratio via object-contain logic)
    items.forEach(item => {
      if (item.img.complete && item.img.naturalWidth > 0) {
        const nat   = item.img.naturalWidth / item.img.naturalHeight;
        let dw, dh;
        if (nat >= 1) { dw = item.size; dh = item.size / nat; }
        else           { dh = item.size; dw = item.size * nat; }
        const ox = item.x + (item.size - dw) / 2;
        const oy = item.y + (item.size - dh) / 2;
        
        if (item.type === 'bomb') {
          ctx.shadowColor = 'rgba(255, 60, 60, 0.9)';
          ctx.shadowBlur = 15;
        }
        ctx.drawImage(item.img, ox, oy, dw, dh);
        if (item.type === 'bomb') {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
      }
    });

    // Draw basket (no stretching)
    const bw = scaledSize(BASKET_SIZE);
    if (basket.img.complete && basket.img.naturalWidth > 0) {
      const nat   = basket.img.naturalWidth / basket.img.naturalHeight;
      let dw, dh;
      if (nat >= 1) { dw = bw; dh = bw / nat; }
      else           { dh = bw; dw = bw * nat; }
      const ox = basket.x + (bw - dw) / 2;
      const oy = basket.y + (bw - dh) / 2;
      ctx.drawImage(basket.img, ox, oy, dw, dh);
    }
  }

})();
