// minigame.js — Wishfall Frenzy (arcade/wishfall-frenzy.html)

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

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

  const musicToggleBtn = document.getElementById('music-toggle');
  const musicIconPlay  = document.getElementById('music-icon-play');
  const musicIconPause = document.getElementById('music-icon-pause');

  const isWishfall = window.location.pathname.includes('wishfall-frenzy');
  const bgmSrc = isWishfall ? '../assets/ui/sunny-summer.mp3' : '../assets/ui/claw-paradise.mp3';

  const audio = {
    bgm:       new Audio(bgmSrc),
    bomb:      new Audio('../assets/ui/arcade/audio/bomb-cue.mp3'),
    click:     new Audio('../assets/ui/arcade/audio/click-tap-cue.mp3'),
    countdown: new Audio('../assets/ui/arcade/audio/countdown-cue.mp3'),
    rewards:   new Audio('../assets/ui/arcade/audio/rewards-cue.mp3'),
    wish:      new Audio('../assets/ui/arcade/audio/wish-cue.mp3'),
    claim:     new Audio('../assets/audio-cue/claim_cue.mp3'),
  };
  window.minigameAudio = audio;
  audio.bgm.loop = true;

  // Read volume from localStorage (same key the main app uses)
  function getVolumeSetting() {
    try {
      const saved = JSON.parse(localStorage.getItem('lds_gacha_v1') || '{}');
      return { bgm: saved.volume ?? 0.5, sfx: saved.sfxVolume ?? 0.5 };
    } catch { return { bgm: 0.5, sfx: 0.5 }; }
  }

  function applyVolume() {
    const vol = getVolumeSetting();
    audio.bgm.volume = vol.bgm;
    Object.values(audio).forEach(a => { if (a !== audio.bgm) a.volume = vol.sfx; });
  }
  applyVolume();

  // â”€â”€ Arc Title Builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function buildArcTitle() {
    if (!titleEl) return;
    const words = window.i18n ? window.i18n.t('arcade.wishfall').split(' ') : ['WISHFALL', 'FRENZY'];
    const text  = window.i18n ? window.i18n.t('arcade.wishfall') : 'WISHFALL FRENZY';
    const letters = text.split('');
    const total   = letters.filter(c => c !== ' ').length;
    const ARC = 10;
    const isMobile = window.innerWidth <= 480;

    titleEl.innerHTML = '';
    let charIdx = 0;

    words.forEach((word, wi) => {
      if (wi > 0) {
        if (isMobile) {
          const br = document.createElement('span');
          br.className = 'arc-letter line-break';
          titleEl.appendChild(br);
        } else {
          const sp = document.createElement('span');
          sp.className = 'arc-letter';
          sp.textContent = '\u00A0';
          titleEl.appendChild(sp);
        }
      }
      word.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'arc-letter';
        span.textContent = ch;
        const t   = charIdx / (total - 1);
        const arc = -ARC * (4 * t * (1 - t) - 0);
        span.style.setProperty('--arc-y', `${arc}px`);
        titleEl.appendChild(span);
        charIdx++;
      });
    });
  }

  buildArcTitle();
  window.addEventListener('languageChanged', buildArcTitle);
  window.addEventListener('resize', buildArcTitle);

  function playSound(snd) {
    snd.currentTime = 0;
    snd.muted = false;
    snd.play().catch(() => {});
  }

  // â”€â”€ Images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const imgDsWish = new Image(); imgDsWish.src = '../assets/ui/deepspace-wish.webp';
  const imgEmWish = new Image(); imgEmWish.src = '../assets/ui/empyrean-wish.webp';
  const imgBomb   = new Image(); imgBomb.src   = '../assets/ui/bomb.webp';

  // â”€â”€ Game state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let isPlaying    = false;
  let isPaused     = false;
  let animationId  = null;
  let lastTime     = 0;

  let dsScore = 0;
  let emScore = 0;

  const TOTAL_TIME = 90;
  let timeLeft     = TOTAL_TIME;

  let items      = [];
  let itemTimer  = 0;

  const BASKET_SIZE     = 72;
  const BASKET_SPEED_PX = 280;
  let basket = {
    x:   0,
    y:   0,
    img: new Image(),
  };
  let selectedChar = 'xavier';

  const keys = { left: false, right: false };

  let isDragging  = false;
  let dragOffsetX = 0;

  // â”€â”€ Canvas geometry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let CW = 0;
  let CH = 0;

  function syncCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    CW = rect.width;
    CH = rect.height;
    canvas.width  = CW * dpr;
    canvas.height = CH * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    basket.y = CH - scaledSize(BASKET_SIZE) - 4;
    if (!isPlaying && !isPaused) {
      basket.x = CW / 2 - scaledSize(BASKET_SIZE) / 2;
    }
  }

  function scaledSize(naturalPx) {
    return naturalPx * (CW / 300);
  }

  window.addEventListener('resize', syncCanvasSize);

  // â”€â”€ Input handling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

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

  // â”€â”€ Character selection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  document.querySelectorAll('.char-basket').forEach(el => {
    el.addEventListener('click', () => {
      playSound(audio.click);
      document.querySelectorAll('.char-basket').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      selectedChar = el.dataset.char;
    });
  });

  // â”€â”€ Entry / Exit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Standalone page: initialize on load (no arcade-open-btn needed)
  function initArcade() {
    // Pre-warm SFX elements on first touch (mobile AudioContext unlock)
    document.body.addEventListener('pointerdown', function unlockSFX() {
      Object.values(audio).forEach(a => {
        if (a !== audio.bgm && a !== audio.click) {
          a.muted = true;
          const p = a.play();
          if (p !== undefined) {
            p.catch(() => {}).then(() => { a.pause(); a.currentTime = 0; });
          } else {
            a.pause(); a.currentTime = 0;
          }
        }
      });
    }, { once: true });

    container.style.display = 'flex';
    introEl.style.display   = 'flex';
    gameoverEl.style.display = 'none';
    pauseOverlay.style.display = 'none';
    syncCanvasSize();

    // Use shared bridge: plays immediately if user has previously interacted
    // on this origin, waits for first click otherwise. Respects bgmOn preference.
    AudioBridge.init(audio.bgm, 'music-icon-play', 'music-icon-pause');
  }

  // â”€â”€ Music Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      AudioBridge.toggle(audio.bgm, 'music-icon-play', 'music-icon-pause');
    });
  }

  // â”€â”€ Page Visibility (Pause when leaving tab/locking screen) â”€â”€â”€â”€â”€â”€â”€
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause bgm
      window._minigameBgmPlayingBeforeHide = !audio.bgm.paused;
      audio.bgm.pause();

      // Pause the game loop if playing
      if (isPlaying && !isPaused) {
        pauseGame();
      }
    } else {
      if (window._minigameBgmPlayingBeforeHide) {
        // If the toggle was set to play, resume BGM
        if (musicIconPause && musicIconPause.style.display === 'block') {
          audio.bgm.play().catch(() => {});
        }
      }
    }
  });

  exitBtn.addEventListener('click', () => {
    playSound(audio.click);
    forceExit();
  });

  startBtn.addEventListener('click', () => {
    playSound(audio.click);
    // AudioBridge.init() already handles BGM on first interaction;
    // if somehow still paused (e.g. user muted then re-enabled), resume.
    if (audio.bgm.paused) {
      applyVolume();
      audio.bgm.play().catch(() => {});
    }
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
    playSound(audio.claim);
    // Apply rewards directly to localStorage (standalone, no app.js)
    addArcadeWishes(dsScore, emScore);
    gameoverEl.style.display = 'none';
    isPlaying = false;
    introEl.style.display = 'flex';
  });

  // â”€â”€ Reward claim: update localStorage directly â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function addArcadeWishes(dsTickets, emTickets) {
    try {
      const STATE_KEY = 'lds_gacha_v1';
      const saved = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
      // Same logic as the old window.addArcadeWishes in app.js
      saved.limitedPullsToday  = (saved.limitedPullsToday  ?? 0) - dsTickets;
      saved.standardPullsToday = (saved.standardPullsToday ?? 0) - emTickets;

      // Enforce 250 cap: remaining = 250 - pullsToday, so pullsToday cannot be < 0
      if (saved.limitedPullsToday < 0) saved.limitedPullsToday = 0;
      if (saved.standardPullsToday < 0) saved.standardPullsToday = 0;

      localStorage.setItem(STATE_KEY, JSON.stringify(saved));
    } catch (e) {
      console.warn('Could not save arcade rewards:', e);
    }
  }

  // â”€â”€ Countdown helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function playCountdown(callback) {
    countdownEl.style.display = 'flex';
    audio.countdown.currentTime = 0;
    audio.countdown.muted = false;
    audio.countdown.play().catch(() => {});

    countdownTxt.style.animation = 'none';
    countdownTxt.textContent = '';

    const goText = window.i18n ? window.i18n.t('wf.go') : 'GO!';
    const steps = ['3', '2', '1', goText];
    let i = 0;

    function showStep() {
      if (i >= steps.length) {
        countdownEl.style.display = 'none';
        callback();
        return;
      }
      countdownTxt.textContent = steps[i];
      countdownTxt.style.animation = 'none';
      void countdownTxt.offsetWidth;
      countdownTxt.style.animation = 'countPop 0.9s ease-out forwards';
      i++;
      setTimeout(showStep, 950);
    }

    setTimeout(showStep, 1000);
  }

  // â”€â”€ Game flow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function startGame() {
    basket.img.src = `../assets/ui/arcade/${selectedChar}-basket.webp`;
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

    rewardDsEl.textContent = dsScore;
    rewardEmEl.textContent = emScore;

    setTimeout(() => {
      audio.rewards.currentTime = 0;
      audio.rewards.muted = false;
      audio.rewards.play().catch(() => {});
      gameoverEl.style.display = 'flex';
    }, 200);
  }

  function forceExit() {
    isPlaying = false;
    isPaused  = false;
    cancelAnimationFrame(animationId);
    audio.bgm.pause();
    // Navigate back to the main home page
    window.location.href = '../index.html';
  }

  function setPauseIcon(showPlay) {
    pauseIcon.style.display = showPlay ? 'none' : 'block';
    playIcon.style.display  = showPlay ? 'block' : 'none';
  }

  // â”€â”€ HUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function updateHUD() {
    dsScoreEl.textContent = dsScore;
    emScoreEl.textContent = emScore;
    const m = Math.floor(timeLeft / 60);
    const s = Math.floor(timeLeft % 60);
    timeEl.textContent = `0${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // â”€â”€ Pacing config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function getPacing(elapsed) {
    if (elapsed <= 15) {
      return { interval: 1400, minSpeed: 30,  maxSpeed: 50, bombAllowed: false, alternate: false };
    } else if (elapsed <= 30) {
      return { interval: 1050, minSpeed: 50, maxSpeed: 70, bombAllowed: false, alternate: false };
    } else if (elapsed <= 45) {
      return { interval: 800,  minSpeed: 70, maxSpeed: 90, bombAllowed: true,  alternate: true };
    } else if (elapsed <= 60) {
      return { interval: 620,  minSpeed: 90, maxSpeed: 110, bombAllowed: true,  alternate: true };
    } else if (elapsed <= 75) {
      return { interval: 450,  minSpeed: 110, maxSpeed: 130, bombAllowed: true,  alternate: true };
    } else {
      return { interval: 310,  minSpeed: 130, maxSpeed: 150, bombAllowed: true,  alternate: true };
    }
  }

  let lastSpawnWasWish = false;

  function spawnItem(pacing) {
    const { minSpeed, maxSpeed, bombAllowed, alternate } = pacing;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    const iSize = scaledSize(40);

    let type;
    if (!bombAllowed) {
      type = Math.random() < 0.5 ? 'ds' : 'em';
    } else if (alternate) {
      if (!lastSpawnWasWish) {
        type = Math.random() < 0.5 ? 'ds' : 'em';
        lastSpawnWasWish = true;
      } else {
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

  // â”€â”€ Main game loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function gameLoop(ts) {
    if (!isPlaying || isPaused) return;

    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateHUD();
      endGame();
      return;
    }

    const spd = BASKET_SPEED_PX * (CW / 300) * dt;
    const bw  = scaledSize(BASKET_SIZE);
    if (keys.left)  { basket.x -= spd; }
    if (keys.right) { basket.x += spd; }
    clampBasket();

    const elapsed = TOTAL_TIME - timeLeft;
    const pacing  = getPacing(elapsed);
    itemTimer += dt * 1000;
    if (itemTimer >= pacing.interval) {
      itemTimer = 0;
      spawnItem(pacing);
    }

    const catchY = basket.y + bw * 0.2;
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed * dt;

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

      if (item.y > CH + 10) {
        items.splice(i, 1);
      }
    }

    updateHUD();
    draw();

    animationId = requestAnimationFrame(gameLoop);
  }

  // â”€â”€ Draw â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function draw() {
    ctx.clearRect(0, 0, CW, CH);

    items.forEach(item => {
      if (item.img.complete && item.img.naturalWidth > 0) {
        const nat   = item.img.naturalWidth / item.img.naturalHeight;
        let dw, dh;
        if (nat >= 1) { dw = item.size; dh = item.size / nat; }
        else           { dh = item.size; dw = item.size * nat; }
        const ox = Math.floor(item.x + (item.size - dw) / 2);
        const oy = Math.floor(item.y + (item.size - dh) / 2);

        if (item.type === 'bomb') {
          ctx.shadowColor = 'rgba(255, 60, 60, 0.9)';
          ctx.shadowBlur = 15;
        }
        ctx.drawImage(item.img, ox, oy, Math.floor(dw), Math.floor(dh));
        if (item.type === 'bomb') {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
      }
    });

    const bw = scaledSize(BASKET_SIZE);
    if (basket.img.complete && basket.img.naturalWidth > 0) {
      const nat   = basket.img.naturalWidth / basket.img.naturalHeight;
      let dw, dh;
      if (nat >= 1) { dw = bw; dh = bw / nat; }
      else           { dh = bw; dw = bw * nat; }
      const ox = Math.floor(basket.x + (bw - dw) / 2);
      const oy = Math.floor(basket.y + (bw - dh) / 2);
      ctx.drawImage(basket.img, ox, oy, Math.floor(dw), Math.floor(dh));
    }
  }

  // â”€â”€ Start the arcade on page load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  initArcade();

});
