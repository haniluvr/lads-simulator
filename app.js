/* ============================================================
   LOVE AND DEEPSPACE — GACHA SIMULATOR
   Game Logic & Animation Engine
   ============================================================ */

'use strict';

// Global IntersectionObserver for lazy-loading media elements
window.mediaObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const src = el.getAttribute('data-src');
      if (src) {
        el.src = src;
        el.removeAttribute('data-src');
      }
      observer.unobserve(el);
    }
  });
}, { rootMargin: '200px' });

// ── CHARACTER DATA ─────────────────────────────────────────
const CHARACTERS = {
  xavier: {
    name:       'Xavier',
    initial:    'X',
    title:      'Deepspace Hunter',
    bgClass:    'cb-xavier',
    colorClass: 'cc-xavier',
    color:      '#4A90D9',
    glowColor:  'rgba(74,144,217,.55)',
  },
  zayne: {
    name:       'Zayne',
    initial:    'Z',
    title:      'Cardiothoracic Surgeon',
    bgClass:    'cb-zayne',
    colorClass: 'cc-zayne',
    color:      '#2DD4BF',
    glowColor:  'rgba(45,212,191,.55)',
  },
  rafayel: {
    name:       'Rafayel',
    initial:    'R',
    title:      'Renowned Artist',
    bgClass:    'cb-rafayel',
    colorClass: 'cc-rafayel',
    color:      '#F472B6',
    glowColor:  'rgba(244,114,182,.55)',
  },
  sylus: {
    name:       'Sylus',
    initial:    'S',
    title:      'Underground King',
    bgClass:    'cb-sylus',
    colorClass: 'cc-sylus',
    color:      '#EF4444',
    glowColor:  'rgba(239,68,68,.55)',
  },
  caleb: {
    name:       'Caleb',
    initial:    'C',
    title:      'Skywarden',
    bgClass:    'cb-caleb',
    colorClass: 'cc-caleb',
    color:      '#38BDF8',
    glowColor:  'rgba(56,189,248,.55)',
  },
  valko: {
    name:       'Valko',
    initial:    'V',
    title:      'Starbound Tempest',
    bgClass:    'cb-valko',
    colorClass: 'cc-valko',
    color:      '#22C55E',
    glowColor:  'rgba(34,197,94,.55)',
  },
};

const ALL_CHARS = Object.keys(CHARACTERS);

// ── GACHA CONSTANTS ────────────────────────────────────────
const LIMITED_FEATURED  = 'valko';
const HARD_PITY         = 70;        // guaranteed 5★ at this pull count
const SOFT_PITY_START   = 60;        // soft pity begins here
const SOFT_PITY_RATE    = 0.085;     // extra rate added per pull in soft pity zone
const BASE_RATE_5       = 0.01;      // 1% base 5★ rate
const BASE_RATE_4       = 0.07;      // 7% base 4★ rate
const MAX_DAILY_PULLS   = 250;       // per banner per day
// --- AUDIO SFX ---
let audioCtx = null;
const sfxBuffers = {};
const sfxUrls = {
  back: 'assets/audio-cue/back_cue.mp3',
  collectionModal: 'assets/audio-cue/collection_modal_cue.mp3',
  openWish: 'assets/audio-cue/open_wish_cue.mp3',
  pullReveal: 'assets/audio-cue/pull_reveal_cue.mp3',
  pullRevealGold: 'assets/audio-cue/open_wish_gold_cue.mp3',
  pullRevealAll: 'assets/audio-cue/pull_reveal_all_cue.mp3',
  select: 'assets/audio-cue/select_cue.mp3',
  pullStart: 'assets/audio-cue/pull_start_cue.mp3',
  pullStartGold: 'assets/audio-cue/pull_start_gold_cue.mp3'
};

async function initSFX() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  for (const [key, url] of Object.entries(sfxUrls)) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      sfxBuffers[key] = await audioCtx.decodeAudioData(arrayBuffer);
    } catch(e) {
      console.error("Failed to load sfx:", key, e);
    }
  }
}

const unlockAudio = () => {
  if (!audioCtx) initSFX();
  else if (audioCtx.state === 'suspended') audioCtx.resume();
};
document.addEventListener('click', unlockAudio, { once: true, capture: true });
document.addEventListener('pointerup', unlockAudio, { once: true, capture: true });
document.addEventListener('touchstart', unlockAudio, { once: true, capture: true });

function playSFX(name) {
  if (!audioCtx || !sfxBuffers[name]) {
    // If context not ready, try fallback
    if (!audioCtx) initSFX().then(() => playSFX(name));
    return;
  }
  const source = audioCtx.createBufferSource();
  source.buffer = sfxBuffers[name];
  
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gs.sfxVolume ?? 0.5;
  
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start(0);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, .banner-nav-item, .banner-card');
  if (btn) {
    const id = btn.id || '';
    const classList = btn.classList;
    
    if (id === 'collection-open-btn') {
      playSFX('collectionModal');
      return;
    } else if (id === 'close-modal-btn' || id === 'col-back-btn' || id === 'settings-close-btn' || id === 'skip-reveal-btn' || id === 'collect-btn') {
      playSFX('back');
      return;
    } else if (classList.contains('banner-nav-item') || classList.contains('banner-card')) {
      playSFX('openWish');
      return;
    }
  }
  // Fallback for random taps and any other unhandled buttons
  playSFX('select');
}, true);

function applyCursorClass(cursorName) {
  document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('cursor-')).join(' ');
  document.body.classList.add(`cursor-${cursorName}`);
}

function initSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = document.getElementById('settings-close-btn');

  // Toggle modal
  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = ''; // Remove display:none if set
    requestAnimationFrame(() => requestAnimationFrame(() => settingsModal.classList.add('active')));
  });
  
  const closeModal = () => {
    settingsModal.classList.remove('active');
    setTimeout(() => { settingsModal.style.display = 'none'; }, 300);
  };
  
  settingsClose.addEventListener('click', closeModal);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeModal();
  });

  // Accordion Logic
  const accordions = document.querySelectorAll('.settings-accordion');
  accordions.forEach(acc => {
    const summary = acc.querySelector('summary');
    const content = acc.querySelector('.accordion-content');
    
    summary.addEventListener('click', (e) => {
      e.preventDefault(); // Take over the toggle
      
      if (acc.hasAttribute('open')) {
        // Close this one with animation
        content.style.animation = 'slideUp 0.2s ease-in forwards';
        content.addEventListener('animationend', function handler() {
          acc.removeAttribute('open');
          content.style.animation = ''; // reset
          content.removeEventListener('animationend', handler);
        });
      } else {
        // Close others
        accordions.forEach(other => {
          if (other !== acc && other.hasAttribute('open')) {
            const otherContent = other.querySelector('.accordion-content');
            otherContent.style.animation = 'slideUp 0.2s ease-in forwards';
            otherContent.addEventListener('animationend', function handler() {
              other.removeAttribute('open');
              otherContent.style.animation = '';
              otherContent.removeEventListener('animationend', handler);
            });
          }
        });
        
        // Open this one
        acc.setAttribute('open', '');
        content.style.animation = 'slideDown 0.3s ease-out forwards';
      }
    });
  });

  // Audio Slider
  const volumeSlider = document.getElementById('volume-slider');
  volumeSlider.value = gs.volume ?? 0.4;
  volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    document.getElementById('bg-music').volume = vol;
    gs.volume = vol;
    saveState();
  });

  const sfxSlider = document.getElementById('sfx-slider');
  const initialSfxVol = gs.sfxVolume ?? 0.5;
  sfxSlider.value = initialSfxVol;
  
  sfxSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    gs.sfxVolume = vol;
    saveState();
  });

  // Cursor Buttons
  const cursorBtns = document.querySelectorAll('.cursor-btn');
  cursorBtns.forEach(btn => {
    if (btn.dataset.cursor === (gs.cursor || 'default')) {
      cursorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      cursorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cursorName = btn.dataset.cursor;
      gs.cursor = cursorName;
      saveState();
      applyCursorClass(cursorName);
    });
  });

  // Reset Button Inside Settings
  const resetConfirmModalHtml = `
      <style>
        .alert-overlay {
          position: fixed; inset: 0; z-index: 3000;
          background: rgba(5, 5, 15, 0.85); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
        }
        .alert-overlay.active { opacity: 1; pointer-events: all; }
        .alert-modal {
          width: 90%; max-width: 400px;
          background: rgba(20, 10, 10, 0.95);
          border: 1px solid rgba(255, 60, 60, 0.3); border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(255, 60, 60, 0.15);
          padding: 30px; text-align: center;
          transform: scale(0.95); transition: transform 0.25s ease;
        }
        .alert-overlay.active .alert-modal { transform: scale(1); }
        .alert-header { font-family: 'Cinzel', serif; font-size: 22px; color: #ff6b6b; letter-spacing: 0.1em; margin-bottom: 24px; }
        .alert-body { display: flex; flex-direction: column; gap: 24px; }
        .alert-danger-box { background: rgba(255, 60, 60, 0.08); border: 1px dashed rgba(255, 60, 60, 0.3); padding: 16px; border-radius: 8px; }
        .alert-danger-title { color: #ff6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }
        .alert-danger-text { color: var(--txt-2); font-size: 15px; font-weight: 500; letter-spacing: 0.03em; }
        .alert-btn {
          flex: 1; height: 44px; border-radius: 22px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
        }
        .alert-btn-cancel { background: transparent; color: var(--txt-2); border: 1px solid rgba(255,255,255,0.2); }
        .alert-btn-cancel:hover { background: rgba(255,255,255,0.05); color: var(--txt); }
        .alert-btn-confirm { background: rgba(255, 60, 60, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 60, 60, 0.4); }
        .alert-btn-confirm:hover { background: rgba(255, 60, 60, 0.2); border-color: rgba(255, 60, 60, 0.6); box-shadow: 0 0 12px rgba(255, 60, 60, 0.2); }
      </style>
      <div id="reset-confirm-modal" class="alert-overlay" aria-modal="true" role="dialog" style="display:none;">
        <div class="alert-modal">
          <div class="alert-header">RESET DATA</div>
          <div class="alert-body">
            <p style="color: var(--txt); font-size: 15px; line-height: 1.6; margin: 0;">
              Are you sure you want to completely reset all gacha data?
            </p>
            <div class="alert-danger-box">
              <span class="alert-danger-title">This will permanently delete:</span>
              <span class="alert-danger-text">Pulls, Pity, Wishes, and Collection</span>
            </div>
            <div style="display: flex; gap: 16px; justify-content: center;">
              <button id="reset-cancel-btn" class="alert-btn alert-btn-cancel">CANCEL</button>
              <button id="reset-confirm-action-btn" class="alert-btn alert-btn-confirm">CONFIRM</button>
            </div>
          </div>
        </div>
      </div>
  `;
  document.body.insertAdjacentHTML('beforeend', resetConfirmModalHtml);
  
  const resetBtn = document.getElementById('settings-reset-btn');
  const resetModal = document.getElementById('reset-confirm-modal');
  
  resetBtn.addEventListener('click', () => {
    resetModal.style.display = '';
    requestAnimationFrame(() => requestAnimationFrame(() => resetModal.classList.add('active')));
  });

  const closeResetModal = () => {
    resetModal.classList.remove('active');
    setTimeout(() => { resetModal.style.display = 'none'; }, 250);
  };

  document.getElementById('reset-cancel-btn').addEventListener('click', closeResetModal);
  resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) closeResetModal();
  });

  document.getElementById('reset-confirm-action-btn').addEventListener('click', () => {
    localStorage.removeItem(STATE_KEY);
    location.reload();
  });
}

// ── STATE ──────────────────────────────────────────────────
const APP_VERSION = 1; // For displaying notice on update
const STATE_KEY = 'lds_gacha_v1';

/** @returns {object} Default state object */
function defaultState() {
  return {
    lastNoticeVersion: 0,
    // 5★ pity counters (pulls since last 5★, resets on 5★)
    limitedPity5:   0,
    standardPity5:  0,
    // 4★ pity counters (pulls since last 4★ or 5★, resets on 4★+)
    limitedPity4:   0,
    standardPity4:  0,
    // 50/50 state for limited banner
    // true = user lost last 50/50 → next 5★ is GUARANTEED to be featured
    limitedGuarantee: false,
    // Precise Wish State
    preciseWishChar: null,
    preciseWishPoint: 0,
    // Daily pull tracking
    limitedPullsToday:  0,
    standardPullsToday: 0,
    lastResetTime: 0,
    // Collection Tracking: { "Card Name": count }
    collection: {},
    // Manual Rank Tracking: { "Card Name": rank }
    ranks: {},
    volume: 0.4,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (_) { /* ignore */ }
  return defaultState();
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(gs));
    if (typeof updateCollectionNotification === 'function') {
      updateCollectionNotification();
    }
  } catch (_) { /* ignore */ }
}

/**
 * Check if 24 hours have passed since last reset.
 * If so, reset daily pull counts.
 */
function checkDailyReset() {
  const now = new Date();
  const lastReset = gs.lastResetTime ? new Date(gs.lastResetTime) : null;

  if (!lastReset || lastReset.toDateString() !== now.toDateString()) {
    gs.limitedPullsToday   = 0;
    gs.standardPullsToday  = 0;
    gs.lastResetTime       = now.getTime();
    saveState();
  }
}

// ── GACHA ALGORITHM ────────────────────────────────────────
/**
 * Calculate 5★ rate for a given pity counter.
 * Soft pity: from pull 60 onward, rate ramps by +8.5% per pull.
 * Hard pity: guaranteed at pull 70 (handled by caller via pity4 guard).
 */
function get5StarRate(pity5) {
  if (pity5 < SOFT_PITY_START) return BASE_RATE_5;
  const extraPulls = pity5 - (SOFT_PITY_START - 1);
  return Math.min(1.0, BASE_RATE_5 + extraPulls * SOFT_PITY_RATE);
}

/**
 * Determine rarity for a single roll.
 * @param {number} pity5 - pulls since last 5★ (1-based: already incremented)
 * @param {number} pity4 - pulls since last 4★+ (1-based: already incremented)
 */
function rollRarity(pity5, pity4) {
  // Hard pity guarantees
  if (pity5 >= HARD_PITY) return '5star';
  if (pity4 >= 10)        return '4star';

  const roll  = Math.random();
  const rate5 = get5StarRate(pity5);

  if (roll < rate5)            return '5star';
  if (roll < rate5 + BASE_RATE_4) return '4star';
  return '3star';
}

/**
 * Resolve which CARD to award for a given rarity.
 * Applies 50/50 logic for limited 5★ pulls.
 */
function resolveCard(rarityStr, bannerType) {
  // Using CARD_CATALOG generated by build_catalog.js
  const pool = CARD_CATALOG.filter(c => c.rarityStr === rarityStr);
  if (pool.length === 0) {
    return { character: 'xavier', rarity: 3, rarityStr: rarityStr, assetPath: '', cardName: 'Placeholder', isVideo: false, charData: CHARACTERS['xavier'] };
  }

  let finalPool = pool;

  if (rarityStr === '5star') {
    if (bannerType === 'limited') {
      const limitedPool = pool.filter(c => c.bannerType === 'limited');
      const standardPool = pool.filter(c => c.bannerType === 'standard');

      if (gs.preciseWishChar && gs.preciseWishPoint >= 1) {
        const pwPool = limitedPool.filter(c => c.character === gs.preciseWishChar);
        finalPool = pwPool.length > 0 ? pwPool : limitedPool;
      } else {
        if (gs.limitedGuarantee || Math.random() < 0.5) {
          finalPool = limitedPool.length > 0 ? limitedPool : pool;
        } else {
          finalPool = standardPool.length > 0 ? standardPool : pool;
        }
      }
    } else {
      finalPool = pool.filter(c => c.bannerType === 'standard');
      if (finalPool.length === 0) finalPool = pool;
    }
  }

  let totalWeight = 0;
  const weights = finalPool.map(c => {
    const w = 1;
    totalWeight += w;
    return w;
  });

  let r = Math.random() * totalWeight;
  let selectedCard = finalPool[0];
  for (let i = 0; i < finalPool.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      selectedCard = finalPool[i];
      break;
    }
  }
  
  if (rarityStr === '5star' && bannerType === 'limited') {
    if (gs.preciseWishChar) {
      if (selectedCard.character === gs.preciseWishChar && selectedCard.bannerType === 'limited') {
        gs.preciseWishChar = null;
        gs.preciseWishPoint = 0;
        gs.limitedGuarantee = false;
      } else {
        gs.preciseWishPoint = 1;
        gs.limitedGuarantee = selectedCard.bannerType === 'standard';
      }
      updatePreciseWishUI();
    } else {
      gs.limitedGuarantee = selectedCard.bannerType === 'standard';
    }
  }

  return { ...selectedCard, charData: CHARACTERS[selectedCard.character] || CHARACTERS['xavier'] };
}

/**
 * Execute `count` pulls on `bannerType`.
 * @returns {Array<{rarity:string, character:string, charData:object}>}
 */
function performPulls(count, bannerType) {
  const pity5Key   = bannerType === 'limited' ? 'limitedPity5'        : 'standardPity5';
  const pity4Key   = bannerType === 'limited' ? 'limitedPity4'        : 'standardPity4';
  const pullsKey   = bannerType === 'limited' ? 'limitedPullsToday'   : 'standardPullsToday';

  const results = [];
  let hasFourPlusInBatch = false;

  for (let i = 0; i < count; i++) {
    gs[pity5Key]++;
    gs[pity4Key]++;

    let rarity = rollRarity(gs[pity5Key], gs[pity4Key]);

    // Safety net: guarantee at least one 4★ in a 10-pull batch
    // (the pity4 counter already handles this naturally, but this is a belt-and-suspenders check)
    if (count === 10 && i === count - 1 && !hasFourPlusInBatch && rarity === '3star') {
      rarity = '4star';
    }

    const card = resolveCard(rarity, bannerType);
    card.rarity = rarity; // ensure it matches expectations

    // Collection Tracker & Rank logic
    let isNew = false;
    let rankUp = 0;
    let refunded = false;
    
    const currentPulls = gs.collection[card.cardName] || 0;
    
    if (currentPulls === 0) {
      isNew = true;
      gs.collection[card.cardName] = 1;
    } else if (currentPulls < 4) {
      // It's a duplicate that can be used for rank up (max 3 ranks requires 4 total copies)
      rankUp = currentPulls; 
      gs.collection[card.cardName] = currentPulls + 1;
    } else {
      refunded = true;
      gs[pullsKey]--; // Refund the pull
    }
    
    card.isNew = isNew;
    card.rankUp = rankUp; // Used to indicate duplicate status
    card.refunded = refunded;

    // Update pity counters
    if (rarity === '5star') {
      gs[pity5Key] = 0;
      gs[pity4Key] = 0;
      hasFourPlusInBatch = true;
    } else if (rarity === '4star') {
      gs[pity4Key] = 0;
      hasFourPlusInBatch = true;
    }

    results.push(card);
  }

  gs[pullsKey] += count;
  saveState();
  return results;
}

// ── GLOBAL STATE & CANVAS REFS ─────────────────────────────
let gs;           // game state
let currentActiveCard = null;
let currentBanner = null;
let countdownInterval = null;

// Particle system
let particles      = [];
let particleAnimId = null;
let pCanvas, pCtx;

let activePreRevealCleanup = null;

// ── STARFIELD ──────────────────────────────────────────────
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  const ctx    = canvas.getContext('2d');

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
    const isReveal = typeof revealState !== 'undefined' && revealState.active;
    const prob = isReveal ? 0.02 : 0.002;
    const maxShoots = isReveal ? 8 : 2;
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

    // Draw shooting stars
    maybeShoot();
    shoots = shoots.filter(s => s.life > 0);
    for (const s of shoots) {
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * s.tail, s.y - s.vy * s.tail);
      g.addColorStop(0, `rgba(255,255,220,${(s.life * 0.75).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255,255,220,0)');
      ctx.beginPath();
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.5;
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 18, s.y - s.vy * 18);
      ctx.stroke();
      s.x    += s.vx;
      s.y    += s.vy;
      s.life -= s.decay;
    }

    requestAnimationFrame(tick);
  }
  tick();
}

// ── PARTICLE SYSTEM ────────────────────────────────────────
function initParticleCanvas() {
  pCanvas = document.getElementById('particles-canvas');
  pCtx    = pCanvas.getContext('2d');
  resizeParticles();
  window.addEventListener('resize', resizeParticles);
}

function resizeParticles() {
  if (!pCanvas) return;
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}

let activeParticleCharacter = null;

function spawnParticle(character, isInitial = false) {
  const w = pCanvas.width;
  const h = pCanvas.height;
  let p = { type: character, op: 1, age: 0, life: Math.random() * 80 + 100 };
  
  switch(character) {
    case 'xavier': // Stars
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.vx = (Math.random() - 0.5) * 0.4;
      p.vy = (Math.random() - 0.5) * 0.4;
      p.size = Math.random() * 3 + 1.5;
      p.phase = Math.random() * Math.PI * 2;
      p.color = '#fff';
      break;
    case 'zayne': // Snowflakes
      p.x = Math.random() * w;
      p.y = isInitial ? Math.random() * h : -20;
      p.vx = 0;
      p.vy = Math.random() * 2 + 1;
      p.size = Math.random() * 3 + 1.5;
      p.phase = Math.random() * Math.PI * 2;
      p.color = '#e0f2fe';
      break;
    case 'rafayel': // Bubbles
      p.x = Math.random() * w;
      p.y = isInitial ? Math.random() * h : h + 20;
      p.vx = 0;
      p.vy = -(Math.random() * 2 + 1.5);
      p.size = Math.random() * 6 + 3;
      p.phase = Math.random() * Math.PI * 2;
      p.color = 'rgba(103,232,249,0.4)';
      break;
    case 'sylus': // Feathers
      p.x = Math.random() * w;
      p.y = isInitial ? Math.random() * h : -20;
      p.vx = (Math.random() - 0.5) * 1.5;
      p.vy = Math.random() * 1.5 + 1.5;
      p.size = Math.random() * 8 + 8;
      p.angle = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.04;
      p.color = '#1a0000'; // dark red/black
      break;
    case 'caleb': // Apples
      p.x = Math.random() * w;
      p.y = isInitial ? Math.random() * h : -20;
      p.vx = (Math.random() - 0.5) * 2;
      p.vy = Math.random() * 2;
      p.size = Math.random() * 6 + 6;
      p.angle = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.1;
      p.color = '#ef4444';
      break;
    case 'valko': // Leaves
      p.x = isInitial ? Math.random() * w : -20;
      p.y = Math.random() * h;
      p.vx = Math.random() * 6 + 4;
      p.vy = (Math.random() - 0.5) * 2;
      p.size = Math.random() * 5 + 4;
      p.angle = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.15;
      p.color = '#22c55e';
      break;
    default: // generic burst
      p.x = w/2; p.y = h/2;
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 5 + 2;
      p.vx = Math.cos(a)*s; p.vy = Math.sin(a)*s - 1.5;
      p.size = Math.random()*4+1;
      p.color = '#ffd700';
      break;
  }
  particles.push(p);
}

function triggerParticleBurst(character) {
  // Animations removed per request
  return;
}

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

  if (activeParticleCharacter && particles.length < 100) {
    spawnParticle(activeParticleCharacter, false);
    spawnParticle(activeParticleCharacter, false);
  }

  particles = particles.filter(p => p.op > 0);

  for (const p of particles) {
    p.age++;
    if (p.age > p.life * 0.8) {
      p.op -= 0.015;
    }

    if (p.op <= 0) continue;
    pCtx.globalAlpha = Math.max(0, p.op);

    p.x += p.vx;
    p.y += p.vy;

    switch(p.type) {
      case 'xavier':
        const alpha = 0.4 + 0.6 * Math.sin(p.phase + p.age * 0.08);
        pCtx.globalAlpha = Math.max(0, p.op * alpha);
        pCtx.beginPath();
        for(let j=0; j<5; j++) {
          pCtx.lineTo(p.x + Math.cos((18+j*72)*Math.PI/180)*p.size, p.y - Math.sin((18+j*72)*Math.PI/180)*p.size);
          pCtx.lineTo(p.x + Math.cos((54+j*72)*Math.PI/180)*p.size*0.4, p.y - Math.sin((54+j*72)*Math.PI/180)*p.size*0.4);
        }
        pCtx.closePath();
        pCtx.fillStyle = '#fff';
        pCtx.shadowBlur = 8; pCtx.shadowColor = '#fff';
        pCtx.fill();
        pCtx.shadowBlur = 0;
        break;
      case 'zayne':
        const sx = p.x + Math.sin(p.phase + p.age * 0.04) * 20;
        pCtx.beginPath();
        pCtx.arc(sx, p.y, p.size, 0, Math.PI*2);
        pCtx.fillStyle = '#fff';
        pCtx.shadowBlur = 6; pCtx.shadowColor = '#a5f3fc';
        pCtx.fill();
        pCtx.shadowBlur = 0;
        break;
      case 'rafayel':
        const rx = p.x + Math.sin(p.phase + p.age * 0.06) * 15;
        pCtx.beginPath();
        pCtx.arc(rx, p.y, p.size, 0, Math.PI*2);
        pCtx.strokeStyle = 'rgba(255,255,255,0.7)';
        pCtx.lineWidth = 1.5;
        pCtx.fillStyle = p.color;
        pCtx.fill(); pCtx.stroke();
        pCtx.beginPath();
        pCtx.arc(rx - p.size*0.3, p.y - p.size*0.3, p.size*0.2, 0, Math.PI*2);
        pCtx.fillStyle = 'rgba(255,255,255,0.9)';
        pCtx.fill();
        break;
      case 'sylus':
        p.angle += p.rotSpeed;
        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate(p.angle);
        pCtx.beginPath();
        pCtx.moveTo(0, -p.size);
        pCtx.quadraticCurveTo(p.size*0.6, 0, 0, p.size);
        pCtx.quadraticCurveTo(-p.size*0.3, 0, 0, -p.size);
        pCtx.fillStyle = p.color;
        pCtx.shadowBlur = 4; pCtx.shadowColor = '#000';
        pCtx.fill();
        pCtx.restore();
        break;
      case 'caleb':
        p.vy += 0.15; // gravity
        p.angle += p.rotSpeed;
        if (p.y > pCanvas.height - p.size) {
          p.y = pCanvas.height - p.size;
          p.vy *= -0.65;
        }
        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate(p.angle);
        pCtx.beginPath();
        pCtx.arc(0, 0, p.size, 0, Math.PI*2);
        pCtx.fillStyle = p.color;
        pCtx.fill();
        pCtx.beginPath();
        pCtx.ellipse(0, -p.size, p.size*0.5, p.size*0.25, -Math.PI/4, 0, Math.PI*2);
        pCtx.fillStyle = '#16a34a';
        pCtx.fill();
        pCtx.restore();
        break;
      case 'valko':
        p.angle += p.rotSpeed;
        p.vy += Math.sin(p.age * 0.05) * 0.05;
        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate(p.angle);
        pCtx.beginPath();
        pCtx.ellipse(0, 0, p.size, p.size*0.5, 0, 0, Math.PI*2);
        pCtx.fillStyle = p.color;
        pCtx.fill();
        pCtx.restore();
        break;
      default:
        p.vy += 0.14; p.vx *= 0.985; p.size *= 0.975;
        pCtx.beginPath(); pCtx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI*2);
        pCtx.fillStyle = p.color; pCtx.fill();
        break;
    }
  }

  pCtx.globalAlpha = 1;

  if (particles.length > 0) {
    particleAnimId = requestAnimationFrame(animateParticles);
  } else {
    particleAnimId = null;
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  }
}

function clearParticles() {
  activeParticleCharacter = null;
  particles.length = 0;
  if (pCtx) pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  if (particleAnimId) { cancelAnimationFrame(particleAnimId); particleAnimId = null; }
}

// ── SCREEN NAVIGATION ──────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${id}`).classList.add('active');
}

// ── TOAST ──────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, ms = 3200) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

// ── FLASH ──────────────────────────────────────────────────
function triggerFlash(opacity) {
  const el = document.getElementById('reveal-flash');
  el.style.transition = 'opacity 80ms ease';
  el.style.opacity    = String(opacity);
  setTimeout(() => {
    el.style.transition = 'opacity 500ms ease';
    el.style.opacity    = '0';
  }, 120);
}

// ── UI: BANNER SELECT ──────────────────────────────────────
function refreshBannerSelect() {
  const lRem = MAX_DAILY_PULLS - gs.limitedPullsToday;
  const sRem = MAX_DAILY_PULLS - gs.standardPullsToday;

  document.getElementById('limited-pulls-display').innerHTML  = `<img src="assets/ui/deepspace-wish.webp" style="width: 14px; vertical-align: middle; margin-right: 4px;"> ${lRem}`;
  document.getElementById('standard-pulls-display').innerHTML = `<img src="assets/ui/empyrean-wish.webp" style="width: 14px; vertical-align: middle; margin-right: 4px;"> ${sRem}`;
  document.getElementById('limited-pity-display').textContent   = `${70 - gs.limitedPity5} pulls`;
  document.getElementById('standard-pity-display').textContent  = `${70 - gs.standardPity5} pulls`;
}

// ── UI: PULL SCREEN ────────────────────────────────────────
function setupPullScreen(bannerType) {
  currentBanner = bannerType;
  const isLim = bannerType === 'limited';
  const pity5  = isLim ? gs.limitedPity5      : gs.standardPity5;
  const pullsToday = isLim ? gs.limitedPullsToday : gs.standardPullsToday;
  const remaining  = MAX_DAILY_PULLS - pullsToday;

  // Toggle class for CSS overrides (button colours, pity bar colour)
  const screenEl = document.getElementById('screen-pull');
  screenEl.classList.toggle('banner-standard', !isLim);

  const pwContainer = document.getElementById('pw-container');
  if (pwContainer) {
    pwContainer.style.display = isLim ? 'flex' : 'none';
  }
  updatePreciseWishUI();

  // Background gradient
  document.getElementById('pull-bg').style.background = isLim
    ? 'linear-gradient(160deg,#1c1605 0%,#302409 30%,#110d02 65%,#020008 100%)'
    : 'linear-gradient(160deg,#06001a 0%,#100050 30%,#080030 65%,#020008 100%)';

  // Character showcase
  const showcase = document.getElementById('showcase-content');
  showcase.innerHTML = `
    <img src="assets/ui/planet-galaxy.svg" alt="Planet Galaxy" class="showcase-planet">
  `;

  // Panel header
  document.getElementById('panel-banner-title').textContent = isLim ? 'Heart in Orbit' : 'Xspace Echo';
  const tagEl = document.getElementById('panel-event-tag');
  tagEl.textContent  = isLim ? 'LIMITED EVENT' : 'STANDARD';
  tagEl.className    = `panel-event-tag ${isLim ? 'tag-lim' : 'tag-std'}`;

  // Wish row
  const wic = document.getElementById('wish-icon-circle');
  wic.textContent = isLim ? '✦' : '★';
  wic.className   = `wish-icon-circle ${isLim ? 'wic-gold' : 'wic-blue'}`;

  const wlbl = document.getElementById('wish-type-label');
  wlbl.textContent = isLim ? 'Deepspace Wishes' : 'Empyrean Wishes';
  wlbl.className   = `wish-type-label ${isLim ? 'lbl-gold' : 'lbl-blue'}`;

  document.getElementById('wish-remaining-count').textContent = `${remaining} / ${MAX_DAILY_PULLS} remaining`;

  // Pity bar
  updatePityUI(pity5, isLim);

  // 50/50 guarantee indicator (limited only)
  const gzone = document.getElementById('guarantee-zone');
  if (gzone) {
    gzone.innerHTML = '';
  }

  // Buttons
  document.getElementById('pull-1-btn').disabled  = remaining < 1;
  document.getElementById('pull-10-btn').disabled = remaining < 10;
}

function updatePityUI(pity5, isLim) {
  const pct = (pity5 / HARD_PITY) * 100;
  document.getElementById('pity-fill').style.width = `${pct}%`;
  document.getElementById('pity-counter').textContent = `${pity5} / 70`;

  // Shift pity fill colour as soft pity approaches
  const fill = document.getElementById('pity-fill');
  if (isLim) {
    fill.style.background = pity5 >= SOFT_PITY_START
      ? 'linear-gradient(90deg,var(--gold),#FF7A00)'
      : 'linear-gradient(90deg,var(--gold),var(--gold-lt))';
  }

  // Accessible progressbar value
  document.getElementById('pity-track-el').setAttribute('aria-valuenow', pity5);
}

// ── COUNTDOWN TIMER ────────────────────────────────────────
function getNextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

function startCountdown() {
  function tick() {
    const now  = Date.now();
    const next = getNextMidnight();
    const rem  = Math.max(0, next - now);

    if (rem === 0) {
      checkDailyReset();
      refreshBannerSelect();
    }

    const h   = Math.floor(rem / 3_600_000);
    const m   = Math.floor((rem % 3_600_000) / 60_000);
    const s   = Math.floor((rem % 60_000)    / 1_000);
    const fmt = n => String(n).padStart(2, '0');
    document.getElementById('reset-countdown').textContent = `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
  }
  tick();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(tick, 1000);
}

// ── CARD BUILDER ───────────────────────────────────────────
/**
 * Build a card DOM element for the reveal screen.
 * @param {{rarity:string, charData:object}} result
 * @param {number} layout - 1 or 10
 */
function buildCard(result, layout) {
  const { rarity, charData, cardName, assetPath, isVideo, type } = result;
  const rNum  = rarity === '5star' ? '5' : rarity === '4star' ? '4' : '3';
  
  const wrapper = document.createElement('div');
  wrapper.className = 'reveal-card-wrapper';

  const artHtml = isVideo
    ? `<video src="${assetPath}" autoplay muted loop playsinline class="card-asset-video"></video>`
    : `<img src="${assetPath}" class="card-asset-img" alt="${cardName}" />`;

  let badgeHtml = '';
  if (result.isNew) {
    badgeHtml = `
      <div class="badge-new-stylized">
        <span class="new-text">New</span>
        <svg class="new-sparkle" viewBox="0 0 24 24"><path fill="#fff" d="M12 0l3.5 8.5L24 12l-8.5 3.5L12 24l-3.5-8.5L0 12l8.5-3.5z"/></svg>
      </div>`;
  }

  // Same star SVGs from collection
  const starSvg = `<svg class="reveal-star-icon" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z"/></svg>`;
  const starsHtml = starSvg.repeat(+rNum);

  // Solar/Lunar SVG from collection
  const typeIcon = type === 'solar'
    ? `<svg class="reveal-type-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.536-7.536l-1.414 1.414M7.879 16.121l-1.414 1.414M16.121 16.121l1.414 1.414M7.879 7.879L6.464 6.464"/></svg>`
    : `<svg class="reveal-type-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  wrapper.innerHTML = `
    <div class="reveal-card" aria-label="${cardName} — ${rNum} star">
      <div class="card-face card-back" aria-hidden="true">
        <div class="card-back-star" aria-hidden="true">✦</div>
      </div>
      <div class="card-face card-front r${rNum}">
        <div class="card-art ${charData.bgClass}">
          ${artHtml}
          <div class="card-art-grad" aria-hidden="true"></div>
          ${rarity === '5star' ? '<div class="sheen-5" aria-hidden="true"></div>' : ''}
          ${badgeHtml}
          
          <div class="card-reveal-info">
            <div class="card-reveal-stars" aria-hidden="true">${starsHtml}</div>
            <div class="card-reveal-title">
              <span class="char-name">${charData.name}: ${cardName}</span>
              ${typeIcon}
            </div>
            <div class="card-reveal-line"></div>
          </div>
        </div>
      </div>
      <div class="card-glow cg-${rNum}" aria-hidden="true"></div>
    </div>
  `;
  return wrapper;
}

// ── REVEAL ANIMATION ───────────────────────────────────────
let revealState = {
  active: false,
  results: [],
  currentIndex: 0,
  layout: 1,
  skipMode: false,
  timeouts: []
};

function clearRevealTimeouts() {
  revealState.timeouts.forEach(clearTimeout);
  revealState.timeouts = [];
}

function pushTimeout(fn, delay) {
  const id = setTimeout(fn, delay);
  revealState.timeouts.push(id);
  return id;
}

function showReveal(results) {
  revealState.active = true;
  revealState.results = results;
  revealState.currentIndex = 0;
  revealState.layout = results.length;
  revealState.skipMode = false;
  clearRevealTimeouts();

  const singleStage = document.getElementById('single-card-stage');
  const summaryStage = document.getElementById('summary-card-stage');
  const collectBtn = document.getElementById('collect-btn');
  const summary = document.getElementById('result-summary');
  const skipBtn = document.getElementById('skip-reveal-btn');
  const overlay = document.getElementById('reveal-click-overlay');

  singleStage.innerHTML = '';
  summaryStage.innerHTML = '';
  singleStage.style.display = 'flex';
  summaryStage.style.display = 'none';
  collectBtn.classList.remove('visible');
  
  const collectText = document.getElementById('collect-btn-text');
  if (collectText) {
    collectText.textContent = revealState.layout === 1 ? 'Collect' : 'Collect All';
  }

  skipBtn.style.display = revealState.layout === 1 ? 'none' : 'block';
  overlay.style.display = 'block'; // Always show overlay for click-to-skip
  
  clearParticles();

  summary.textContent = '';

  showScreen('reveal');
  resizeParticles();
  
  if (revealState.layout === 1) {
    playPreRevealVideo(results[0], () => {
      if (!revealState.active) return;
      playSingleCardAnimation(results[0], singleStage, () => {
        collectBtn.classList.add('visible');
      });
    });
  } else {
    playNextCardInSequence();
  }
}

function playPullStartVideo(results, onComplete) {
  const container = document.getElementById('pull-start-video-container');
  const video = document.getElementById('pull-start-video');
  const bgMusic = document.getElementById('bg-music');
  const skipBtn = document.getElementById('skip-pull-start-btn');

  if (skipBtn) skipBtn.style.display = 'none';

  const tapHandler = (e) => {
    if (skipBtn && !e.target.closest('#skip-pull-start-btn')) {
      skipBtn.style.display = 'flex';
    }
  };
  
  container.addEventListener('pointerup', tapHandler);
  container.addEventListener('click', tapHandler);

  container.style.display = 'block';
  // Force reflow
  container.offsetHeight;
  container.classList.add('active');

  const hasFiveStar = results.some(r => r.rarity === '5star');
  video.src = hasFiveStar ? 'assets/ui/animations/pull_start_gold.mp4' : 'assets/ui/animations/pull_start.mp4';
  video.muted = true;
  video.load();
  if (hasFiveStar) {
    playSFX('pullStartGold');
  } else {
    playSFX('pullStart');
  }
  
  const finish = () => {
    video.removeEventListener('ended', finish);
    container.removeEventListener('pointerup', tapHandler);
    container.removeEventListener('click', tapHandler);
    if (skipBtn) {
      skipBtn.removeEventListener('click', finishSkip);
      skipBtn.removeEventListener('pointerup', finishSkip);
    }
    video.pause();
    video.removeAttribute('src');
    video.load();
    
    container.classList.remove('active');
    setTimeout(() => {
      container.style.display = 'none';
      onComplete();
    }, 500); // fade out duration
  };

  const finishSkip = (e) => {
    e.stopPropagation();
    e.preventDefault();
    finish();
  };

  if (skipBtn) {
    skipBtn.addEventListener('click', finishSkip);
    skipBtn.addEventListener('pointerup', finishSkip);
  }

  video.addEventListener('ended', finish);

  video.play().catch(e => {
    console.warn("Pull start video failed to play:", e);
    finish();
  });
}

function playPreRevealVideo(result, onComplete) {
  if (result.rarity !== '5star') {
    return onComplete();
  }

  const isMobile = window.innerWidth <= 600;
  const suffix = isMobile ? '_mobile.mp4' : '.mp4';

  const videoPaths = {
    'xavier': `assets/ui/animations/xavier_animation${suffix}`,
    'zayne': `assets/ui/animations/zayne_animation${suffix}`,
    'sylus': `assets/ui/animations/sylus_animation${suffix}`,
    'rafayel': `assets/ui/animations/rafayel_animation${suffix}`,
    'caleb': `assets/ui/animations/caleb_animation${suffix}`,
    'valko': `assets/ui/animations/valko_animation${suffix}`
  };

  const path = videoPaths[result.character.toLowerCase()];
  if (!path) {
    return onComplete();
  }

  const container = document.getElementById('pre-reveal-video-container');
  const video = document.getElementById('pre-reveal-video');
  video.src = path;
  video.muted = true;
  video.load();
  container.style.display = 'block';
  
  requestAnimationFrame(() => requestAnimationFrame(() => {
    container.classList.add('active');
  }));

  const cleanup = (force = false) => {
    activePreRevealCleanup = null;
    container.classList.remove('active');
    
    if (force) {
      container.style.display = 'none';
      video.pause();
      video.src = '';
      onComplete();
    } else {
      setTimeout(() => {
        if (!revealState.active) return; // double check
        container.style.display = 'none';
        video.src = '';
        onComplete();
      }, 500);
    }
  };

  activePreRevealCleanup = cleanup;
  video.onended = () => cleanup(false);

  video.play().catch(e => {
    console.warn('Pre-reveal video autoplay failed:', e);
    cleanup(true);
  });
}

function playSingleCardAnimation(result, container, onComplete) {
  container.innerHTML = '';
  const wrapper = buildCard(result, 1);
  container.appendChild(wrapper);

  pushTimeout(() => triggerFlash(0.45), 200);

  pushTimeout(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wrapper.classList.add('visible');
    }));
  }, 380);

  pushTimeout(() => {
    wrapper.querySelector('.reveal-card').classList.add('flipped');
    if (result.rarity === '5star') {
      playSFX('pullRevealGold');
    } else {
      playSFX('pullReveal');
    }
  }, 830);

  pushTimeout(() => {
    wrapper.querySelector('.card-glow').classList.add('visible');
    if (result.rarity === '5star') {
      triggerParticleBurst(result.character);
      triggerFlash(0.18);
    }
  }, 1310);

  if (onComplete) pushTimeout(onComplete, 2000);
}

function playNextCardInSequence() {
  if (revealState.currentIndex >= revealState.layout) {
    showSummaryScreen();
    return;
  }

  clearRevealTimeouts();
  clearParticles();

  const singleStage = document.getElementById('single-card-stage');
  const result = revealState.results[revealState.currentIndex];

  playPreRevealVideo(result, () => {
    if (!revealState.active) return;
    playSingleCardAnimation(result, singleStage, null);
  });
}

function showSummaryScreen() {
  clearRevealTimeouts();
  clearParticles();
  
  const singleStage = document.getElementById('single-card-stage');
  const summaryStage = document.getElementById('summary-card-stage');
  const collectBtn = document.getElementById('collect-btn');
  const skipBtn = document.getElementById('skip-reveal-btn');
  const overlay = document.getElementById('reveal-click-overlay');

  singleStage.style.display = 'none';
  skipBtn.style.display = 'none';
  
  summaryStage.style.display = 'grid';
  summaryStage.innerHTML = '';

  revealState.results.forEach((result, i) => {
    const wrapper = buildCard(result, 10);
    summaryStage.appendChild(wrapper);
    
    wrapper.classList.add('visible');
    wrapper.querySelector('.reveal-card').classList.add('flipped');
    wrapper.querySelector('.card-glow').classList.add('visible');
  });

  playSFX('pullRevealAll');
  collectBtn.classList.add('visible');
}

// ── EVENT LISTENERS ────────────────────────────────────────
function initEvents() {
  // Banner card click (entire card acts as button)
  const makeCardClick = (banner) => (e) => {
    if (!e.target.closest('button')) {
      setupPullScreen(banner);
      showScreen('pull');
    }
  };
  document.getElementById('banner-card-limited').addEventListener('click',  makeCardClick('limited'));
  document.getElementById('banner-card-standard').addEventListener('click', makeCardClick('standard'));

  // Keyboard accessibility for banner cards
  document.querySelectorAll('.banner-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  // Enter Banner -> Pull Screen
  document.getElementById('banner-card-limited').addEventListener('click', e => {
    e.stopPropagation();
    currentBanner = 'limited';
    setupPullScreen('limited');
    showScreen('pull');
  });
  document.getElementById('banner-card-standard').addEventListener('click', e => {
    e.stopPropagation();
    currentBanner = 'standard';
    setupPullScreen('standard');
    showScreen('pull');
  });

  // Click outside to exit
  document.getElementById('screen-pull').addEventListener('click', (e) => {
    if (e.target.closest('.pull-modal-outer') || e.target.closest('.toast')) return;
    refreshBannerSelect();
    showScreen('select');
  });

  // Settings Modal & Reset
  initSettings();

  // Pull x1
  document.getElementById('pull-1-btn').addEventListener('click', (e) => {
    e.currentTarget.blur();
    const rem = getRemainingPulls();
    if (rem < 1) { showToast('No pulls remaining today! Reset in ' + getCountdownStr()); return; }
    const results = performPulls(1, currentBanner);
    playPullStartVideo(results, () => {
      showReveal(results);
    });
  });

  // Pull ×10
  document.getElementById('pull-10-btn').addEventListener('click', (e) => {
    e.currentTarget.blur();
    const rem = getRemainingPulls();
    if (rem < 10) {
      showToast(`Need 10 pulls — only ${rem} remaining today.`);
      return;
    }
    const results = performPulls(10, currentBanner);
    playPullStartVideo(results, () => {
      showReveal(results);
    });
  });

  let skipFired = false;
  const handleSkipBtn = () => {
    if (skipFired) return;
    skipFired = true;
    setTimeout(() => skipFired = false, 300);

    // DO NOT allow skipping while a 5-star video is playing
    if (activePreRevealCleanup) {
      return;
    }

    if (revealState.layout === 1) {
      // 1-pull skip
      clearRevealTimeouts();
      const singleStage = document.getElementById('single-card-stage');
      const wrapper = singleStage.querySelector('.reveal-card-wrapper');
      if (wrapper) {
        wrapper.classList.add('visible');
        wrapper.querySelector('.reveal-card').classList.add('flipped');
        wrapper.querySelector('.card-glow').classList.add('visible');
      }
      document.getElementById('skip-reveal-btn').style.display = 'none';
      document.getElementById('collect-btn').classList.add('visible');
      revealState.active = false;
      return;
    }

    // 10-pull skip
    revealState.skipMode = true;
    document.getElementById('skip-reveal-btn').style.display = 'none';
    
    // find the next 5-star AFTER the current one
    const next5 = revealState.results.findIndex((r, i) => i > revealState.currentIndex && r.rarity === '5star');
    if (next5 !== -1) {
      revealState.currentIndex = next5;
      playNextCardInSequence();
    } else {
      showSummaryScreen();
    }
  };

  document.getElementById('skip-reveal-btn').addEventListener('click', handleSkipBtn);
  document.getElementById('skip-reveal-btn').addEventListener('pointerup', handleSkipBtn);

  document.getElementById('reveal-click-overlay').addEventListener('pointerup', () => {
    if (!revealState.active) return;
    
    const collectBtn = document.getElementById('collect-btn');
    if (collectBtn && collectBtn.classList.contains('visible')) {
      // Directly call the collect logic instead of .click() to avoid listener issues
      if (window.performCollect) window.performCollect();
      return;
    }
    
    if (activePreRevealCleanup) {
      activePreRevealCleanup(true);
      return;
    }
    
    if (revealState.layout > 1) {
      revealState.currentIndex++;
      if (revealState.skipMode) {
        const next5 = revealState.results.findIndex((r, i) => i >= revealState.currentIndex && r.rarity === '5star');
        if (next5 !== -1) {
          revealState.currentIndex = next5;
          playNextCardInSequence();
        } else {
          showSummaryScreen();
        }
      } else {
        playNextCardInSequence();
      }
    } else {
      // 1-pull skip
      clearRevealTimeouts();
      const singleStage = document.getElementById('single-card-stage');
      const wrapper = singleStage.querySelector('.reveal-card-wrapper');
      if (wrapper) {
        wrapper.classList.add('visible');
        wrapper.querySelector('.reveal-card').classList.add('flipped');
        wrapper.querySelector('.card-glow').classList.add('visible');
      }
      document.getElementById('skip-reveal-btn').style.display = 'none';
      document.getElementById('collect-btn').classList.add('visible');
      revealState.active = false; // Prevent multiple skips
    }
  });

  // Collect all back to pull screen
  window.performCollect = () => {
    playSFX('back');
    clearParticles();
    setupPullScreen(currentBanner);
    showScreen('pull');
  };

  let collectFired = false;
  const handleCollectBtn = (e) => {
    if (collectFired) return;
    collectFired = true;
    setTimeout(() => collectFired = false, 300);
    window.performCollect();
  };

  document.getElementById('collect-btn').addEventListener('click', handleCollectBtn);
  document.getElementById('collect-btn').addEventListener('pointerup', handleCollectBtn);
}

// ── HELPERS ────────────────────────────────────────────────
function getRemainingPulls() {
  if (!currentBanner) return 0;
  const used = currentBanner === 'limited' ? gs.limitedPullsToday : gs.standardPullsToday;
  return MAX_DAILY_PULLS - used;
}

function getCountdownStr() {
  const rem = Math.max(0, getNextMidnight() - Date.now());
  const h   = Math.floor(rem / 3_600_000);
  const m   = Math.floor((rem % 3_600_000) / 60_000);
  const s   = Math.floor((rem % 60_000)    / 1_000);
  const fmt = n => String(n).padStart(2, '0');
  return `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
}

function initAudio() {
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicIconPlay = document.getElementById('music-icon-play');
  const musicIconPause = document.getElementById('music-icon-pause');

  bgMusic.volume = gs.volume ?? 0.4;

  // Attempt autoplay on load
  bgMusic.play().then(() => {
    musicIconPlay.style.display = 'none';
    musicIconPause.style.display = 'block';
  }).catch((e) => {
    console.log("Autoplay blocked by browser. User interaction required.");
    musicIconPlay.style.display = 'block';
    musicIconPause.style.display = 'none';
  });

  musicToggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(e => console.error("Audio play failed:", e));
      musicIconPlay.style.display = 'none';
      musicIconPause.style.display = 'block';
    } else {
      bgMusic.pause();
      musicIconPlay.style.display = 'block';
      musicIconPause.style.display = 'none';
    }
  });
}

// ── INIT ───────────────────────────────────────────────────
function init() {
  gs = loadState();
  checkDailyReset();

  initStarfield();
  initParticleCanvas();
  
  // Apply initial global cursor
  applyCursorClass(gs.cursor || 'default');

  initEvents();
  initAudio();
  initCollection();
  if (typeof initRealCollection === 'function') initRealCollection();
  initPreciseWishEvents();
  initNoticeEvents();
  refreshBannerSelect();
  startCountdown();

  updateCurrencyUI();
  updatePityUI();
  
  // Show initial screen
  showScreen('screen-select');
  
  if (typeof updateCollectionNotification === 'function') {
    updateCollectionNotification();
  }

  // Auto-open notice modal if version is new
  if (gs.lastNoticeVersion < APP_VERSION) {
    const noticeModal = document.getElementById('notice-modal');
    if (noticeModal) {
      noticeModal.style.display = '';
      requestAnimationFrame(() => requestAnimationFrame(() => noticeModal.classList.add('active')));
      gs.lastNoticeVersion = APP_VERSION;
      saveState();
    }
  }
}

document.addEventListener('DOMContentLoaded', init);

// ── PRECISE WISH LOGIC ──────────────────────────────────────
function updatePreciseWishUI() {
  const triggerBtnText = document.getElementById('pw-status-text');
  const currentWishText = document.getElementById('pw-current-wish');
  const pointsDisplay = document.getElementById('pw-points-display');
  const cancelBtn = document.getElementById('pw-cancel-choice-btn');
  const confirmBtn = document.getElementById('pw-confirm-btn');

  if (!triggerBtnText) return;

  if (gs.preciseWishChar) {
    const charName = CHARACTERS[gs.preciseWishChar]?.name || gs.preciseWishChar;
    triggerBtnText.textContent = `${charName} (${gs.preciseWishPoint}/1)`;
    currentWishText.textContent = charName;
    pointsDisplay.textContent = `${gs.preciseWishPoint}/1`;
    cancelBtn.style.display = 'inline-block';
  } else {
    triggerBtnText.textContent = 'None';
    currentWishText.textContent = 'None';
    pointsDisplay.textContent = '0/1';
    cancelBtn.style.display = 'none';
  }

  // Deselect all buttons in grid
  document.querySelectorAll('.pw-char-btn').forEach(btn => {
    if (btn.dataset.char === gs.preciseWishChar) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  if (confirmBtn) confirmBtn.disabled = true; // reset until a new selection is made
}

function initPreciseWishEvents() {
  const modal = document.getElementById('precise-wish-modal');
  const triggerBtn = document.getElementById('pw-trigger-btn');
  const closeBtn = document.getElementById('pw-close-btn');
  const charBtns = document.querySelectorAll('.pw-char-btn');
  const confirmBtn = document.getElementById('pw-confirm-btn');
  const cancelBtn = document.getElementById('pw-cancel-choice-btn');

  let tempSelectedChar = null;

  if (!modal) return;

  const openModal = () => {
    playSFX('click');
    tempSelectedChar = gs.preciseWishChar;
    updatePreciseWishUI();
    modal.style.display = '';
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('active')));
  };

  const closeModal = () => {
    playSFX('click');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  };

  triggerBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  charBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSFX('click');
      charBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempSelectedChar = btn.dataset.char;
      confirmBtn.disabled = tempSelectedChar === gs.preciseWishChar;
    });
  });

  confirmBtn.addEventListener('click', () => {
    if (tempSelectedChar && tempSelectedChar !== gs.preciseWishChar) {
      playSFX('click');
      gs.preciseWishChar = tempSelectedChar;
      gs.preciseWishPoint = 0; // changing choice resets points
      saveState();
      updatePreciseWishUI();
      closeModal();
    }
  });

  cancelBtn.addEventListener('click', () => {
    playSFX('click');
    gs.preciseWishChar = null;
    gs.preciseWishPoint = 0;
    saveState();
    updatePreciseWishUI();
    closeModal();
  });
}

function initNoticeEvents() {
  const noticeBtn = document.getElementById('notice-btn');
  const noticeModal = document.getElementById('notice-modal');
  const noticeClose = document.getElementById('notice-close-btn');

  if (!noticeBtn || !noticeModal) return;

  const openNoticeModal = () => {
    playSFX('click');
    noticeModal.style.display = '';
    requestAnimationFrame(() => requestAnimationFrame(() => noticeModal.classList.add('active')));
  };

  const closeNoticeModal = () => {
    playSFX('click');
    noticeModal.classList.remove('active');
    setTimeout(() => { noticeModal.style.display = 'none'; }, 300);
  };

  noticeBtn.addEventListener('click', openNoticeModal);
  noticeClose.addEventListener('click', closeNoticeModal);
  noticeModal.addEventListener('click', (e) => {
    if (e.target === noticeModal) closeNoticeModal();
  });
}
