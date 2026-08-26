/* ============================================================
   COSMO PHOTOBOOTH — booth.js
   Full 5-phase state machine for the photobooth app
   ============================================================ */

'use strict';

// ============================================================
// CONSTANTS
// ============================================================

const CHARACTERS = {
  xavier:  { 
    name: 'Xavier',  color: '#C4B5FD', glow: 'rgba(196,181,253,0.6)', bg: 'linear-gradient(160deg, #C4B5FD 0%, rgba(196,181,253,0.3) 100%)',
    poses: [
      { id: 'elegant', label: 'Elegant' },
      { id: 'fallen king', label: 'Fallen King' },
      { id: 'gentle hold', label: 'Gentle Hold' },
      { id: 'hermit', label: 'Hermit' },
      { id: 'lumiere', label: 'Lumiere' },
      { id: 'morning daze', label: 'Morning Daze' },
      { id: 'nightfall', label: 'Nightfall' },
      { id: 'on the clock', label: 'On The Clock' },
      { id: 'parasol stroll', label: 'Parasol Stroll' },
      { id: 'purrfect', label: 'Purrfect' },
      { id: 'see through', label: 'See Through' },
      { id: 'shining prince', label: 'Shining Prince' },
      { id: 'sleepy', label: 'Sleepy' },
      { id: 'undone', label: 'Undone' },
      { id: 'veiled knight', label: 'Veiled Knight' },
      { id: 'wet look', label: 'Wet Look' },
      { id: 'workout', label: 'Workout' }
    ]
  },
  zayne:   { 
    name: 'Zayne',   color: '#93C5FD', glow: 'rgba(147,197,253,0.6)', bg: 'linear-gradient(160deg, #93C5FD 0%, rgba(147,197,253,0.3) 100%)',
    poses: [
      { id: 'ancient bond', label: 'Ancient Bond' },
      { id: 'darcy', label: 'Darcy' },
      { id: 'dawnbreaker', label: 'Dawnbreaker' },
      { id: 'doctor', label: 'Doctor' },
      { id: 'executive', label: 'Executive' },
      { id: 'fluffy', label: 'Fluffy' },
      { id: 'gala evening', label: 'Gala Evening' },
      { id: 'glacial warmth', label: 'Glacial Warmth' },
      { id: 'hidden edge', label: 'Hidden Edge' },
      { id: 'kawaii', label: 'Kawaii' },
      { id: 'morning kiss', label: 'Morning Kiss' },
      { id: 'private view', label: 'Private View' },
      { id: 'solitary vow', label: 'Solitary Vow' },
      { id: 'tender heart', label: 'Tender Heart' },
      { id: 'thinking', label: 'Thinking' },
      { id: 'unwind', label: 'Unwind' },
      { id: 'winter stroll', label: 'Winter Stroll' }
    ]
  },
  rafayel: { 
    name: 'Rafayel', color: '#C084FC', glow: 'rgba(192,132,252,0.6)', bg: 'linear-gradient(160deg, #C084FC 0%, rgba(192,132,252,0.3) 100%)',
    poses: [
      { id: 'art critic', label: 'Art Critic' },
      { id: 'center of attention', label: 'Center of Attention' },
      { id: 'classic charm', label: 'Classic Charm' },
      { id: 'crimson tide', label: 'Crimson Tide' },
      { id: 'deep sea', label: 'Deep Sea' },
      { id: 'desert mirage', label: 'Desert Mirage' },
      { id: 'gentle rain', label: 'Gentle Rain' },
      { id: 'invitation', label: 'Invitation' },
      { id: 'lazy morning', label: 'Lazy Morning' },
      { id: 'mischief', label: 'Mischief' },
      { id: 'night bloom', label: 'Night Bloom' },
      { id: "quick selfie", label: "Quick Selfie" },
      { id: 'rebel', label: 'Rebel' },
      { id: 'scene one', label: 'Scene One' },
      { id: 'sea god', label: 'Sea God' },
      { id: 'studio time', label: 'Studio Time' },
      { id: 'vibrant canvas', label: 'Vibrant Canvas' }
    ]
  },
  sylus:   { 
    name: 'Sylus',   color: '#F87171', glow: 'rgba(248,113,113,0.6)', bg: 'linear-gradient(160deg, #F87171 0%, rgba(248,113,113,0.3) 100%)',
    poses: [
      { id: 'after hours', label: 'After Hours' },
      { id: 'ancient echoes', label: 'Ancient Echoes' },
      { id: 'body tea', label: 'Body Tea' },
      { id: 'city shadows', label: 'City Shadows' },
      { id: 'dressed to kill', label: 'Dressed To Kill' },
      { id: 'executive order', label: 'Executive Order' },
      { id: 'fiendish form', label: 'Fiendish' },
      { id: 'formal offering', label: 'Formal Offering' },
      { id: 'golden hour', label: 'Golden Hour' },
      { id: 'mastermind', label: 'Mastermind' },
      { id: 'obsidian guard', label: 'Obsidian Guard' },
      { id: 'solemn vow', label: 'Solemn Vow' },
      { id: 'summer heat', label: 'Summer Heat' },
      { id: 'unbuttoned', label: 'Unbuttoned' },
      { id: 'untamed', label: 'Untamed' },
      { id: 'warm up', label: 'Warm Up' },
      { id: 'wild intent', label: 'Wild Intent' }
    ]
  },
  caleb:   { 
    name: 'Caleb',   color: '#FB923C', glow: 'rgba(251,146,60,0.6)',  bg: 'linear-gradient(160deg, #FB923C 0%, rgba(251,146,60,0.3) 100%)',
    poses: [
      { id: 'casual warmup', label: 'Casual Warmup' },
      { id: 'defiance', label: 'Defiance' },
      { id: 'hand to hand', label: 'Hand to Hand' },
      { id: 'incognito', label: 'Incognito' },
      { id: 'melancholy', label: 'Melancholy' },
      { id: 'misty stroll', label: 'Misty Stroll' },
      { id: 'mvp', label: 'MVP' },
      { id: 'ootd', label: 'OOTD' },
      { id: 'perfect fit', label: 'Perfect Fit' },
      { id: 'serenity', label: 'Serenity' },
      { id: 'silent vow', label: 'Silent Vow' },
      { id: 'sincere confession', label: 'Sincere Confession' },
      { id: 'smooth operator', label: 'Smooth Operator' },
      { id: 'spotting you', label: 'Spotting You' },
      { id: 'steamy shower', label: 'Steamy Shower' },
      { id: 'street style', label: 'Street Style' },
      { id: 'the colonel', label: 'The Colonel' }
    ]
  },
  valko:   { 
    name: 'Valko',   color: '#34D399', glow: 'rgba(52,211,153,0.6)',  bg: 'linear-gradient(160deg, #34D399 0%, rgba(52,211,153,0.3) 100%)',
    poses: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'blackout', label: 'Blackout' },
      { id: 'brooding', label: 'Brooding' },
      { id: 'casual', label: 'Casual' },
      { id: 'chairman', label: 'Chairman' },
      { id: 'charming', label: 'Charming' },
      { id: 'chef', label: 'Chef' },
      { id: 'confidence', label: 'Confidence' },
      { id: 'deadlock', label: 'Deadlock' },
      { id: 'deep focus', label: 'Deep Focus' },
      { id: 'direct', label: 'Direct' },
      { id: 'fine print', label: 'Fine Print' },
      { id: 'gotcha', label: 'Gotcha' },
      { id: 'intel', label: 'Intel' },
      { id: 'masked', label: 'Masked' },
      { id: 'predator', label: 'Predator' },
      { id: 'profiling', label: 'Profiling' },
      { id: 'rest stop', label: 'Rest Stop' },
      { id: 'standoff', label: 'Standoff' },
      { id: 'techwear', label: 'Techwear' },
      { id: 'unwavering', label: 'Unwavering' },
      { id: 'waiting', label: 'Waiting' }
    ]
  },
};

const POSES = [
  { id: 'neutral',  label: 'Neutral'  },
  { id: 'casual',   label: 'Casual'   },
  { id: 'happy',    label: 'Happy'    },
  { id: 'cool',     label: 'Cool'     },
  { id: 'romantic', label: 'Romantic' },
];

// Frame registry loaded from frames.json
// Shape: { stripType, frameCount, templateName, stripWidth, stripHeight, windows[], file }
let FRAMES_REGISTRY = null;
let selectedFrameConfig = null; // the active template config object

async function loadFramesRegistry() {
  if (FRAMES_REGISTRY) return FRAMES_REGISTRY;
  
  // If data was loaded via framesData.js script (for file:/// protocol support)
  if (window.FRAMES_REGISTRY_DATA) {
    FRAMES_REGISTRY = window.FRAMES_REGISTRY_DATA;
    return FRAMES_REGISTRY;
  }

  try {
    const resp = await fetch('./assets/frames/frames.json');
    FRAMES_REGISTRY = await resp.json();
  } catch (e) {
    console.warn('Could not load frames.json, using fallback:', e);
    FRAMES_REGISTRY = {};
  }
  return FRAMES_REGISTRY;
}

// Build flat list of all templates for Phase 1 UI
function getAllTemplates(registry) {
  const list = [];
  for (const [stripType, stripData] of Object.entries(registry)) {
    for (const [frameCount, frameCountData] of Object.entries(stripData.frames)) {
      for (const [tmplName, tmplData] of Object.entries(frameCountData.templates)) {
        list.push({
          key: `${stripType}|${frameCount}|${tmplName}`,
          stripType: stripType,
          frameCount: parseInt(frameCount.replace(' Frames', ''), 10),
          name: tmplName,
          file: tmplData.file,
          windows: tmplData.windows,
          stripWidth: tmplData.stripWidth || stripData.stripWidth,
          stripHeight: tmplData.stripHeight || stripData.stripHeight,
        });
      }
    }
  }
  return list;
}

const FILTERS = {
  none:    '',
  bloom:   'brightness(115%) saturate(120%) contrast(95%)',
  vintage: 'sepia(60%) contrast(110%) brightness(90%)',
  cool:    'hue-rotate(15deg) saturate(120%) brightness(105%)',
  rose:    'hue-rotate(-20deg) saturate(130%) brightness(105%)',
  bw:      'grayscale(100%) contrast(110%)',
  noir:    'grayscale(100%) contrast(130%) brightness(80%)',
};

const STICKERS = [
  { id: 'star',     symbol: '✦', label: 'Star' },
  { id: 'heart',    symbol: '♡', label: 'Heart' },
  { id: 'sparkle',  symbol: '✨', label: 'Sparkle' },
  { id: 'moon',     symbol: '☽', label: 'Moon' },
  { id: 'flower',   symbol: '✿', label: 'Flower' },
  { id: 'ribbon',   symbol: '🎀', label: 'Ribbon' },
  { id: 'crown',    symbol: '♛', label: 'Crown' },
  { id: 'notes',    symbol: '♪', label: 'Notes' },
  { id: 'diamond',  symbol: '◈', label: 'Diamond' },
  { id: 'infinity', symbol: '∞', label: 'Infinity' },
  { id: 'arrow',    symbol: '→', label: 'Arrow' },
  { id: 'swirl',    symbol: '❋', label: 'Swirl' },
];

// ============================================================
// STATE
// ============================================================

const state = {
  phase:          1,
  templateConfig: null,   // full config object from getAllTemplates()
  frames:         [],     // array of { chars: ['xavier', ...], poses: { xavier: 'neutral' } }
  currentFrame:   0,      // index during shoot
  capturedImages: [],     // dataURL per frame
  capturedImageElements: [], // HTMLImageElement per frame
  currentUploadedImage: null, // HTMLImageElement if user uploaded an image for current frame
  activeFilter:   'none',
  decorations:    [],
  history:        [],
  historyIndex:   -1,
  stripZoom:      1.0,
  photoTransforms: [],    // array of {x, y, scale} per window

  // Camera
  stream:         null,
  facingMode:     'user',
  countingDown:   false,

  // Storyboard UI
  selectedSbFrame: null,
};

// ============================================================
// DOM REFS
// ============================================================

const phases = {
  1: document.getElementById('phase-1'),
  2: document.getElementById('phase-2'),
  3: document.getElementById('phase-3'),
  4: document.getElementById('phase-4'),
};

// ============================================================
// PHASE TRANSITIONS
// ============================================================

function goToPhase(n) {
  if (n === 4) {
    // Show printing overlay first, then transition
    showPrintingOverlay();
    setTimeout(() => {
      hidePrintingOverlay();
      _actuallyGoToPhase(4);
    }, 3000);
    return;
  }
  _actuallyGoToPhase(n);
}

function _actuallyGoToPhase(n) {
  // Hide all phases
  Object.values(phases).forEach(el => el.classList.add('hidden'));
  // Show target
  const target = phases[n];
  if (!target) return;
  target.classList.remove('hidden');
  state.phase = n;
  // Phase-specific init
  if (n === 2) initPhase2();
  if (n === 3) initPhase3();
  if (n === 4) initPhase4();

  // Scroll to top
  target.scrollTop = 0;
}

// ============================================================
// PHASE 1 — LAYOUT & TEMPLATE
// ============================================================

async function initPhase1() {
  const registry   = await loadFramesRegistry();
  const allTmpls   = getAllTemplates(registry);
  const nextBtn    = document.getElementById('phase1-next');

  // Render a single grid of all available templates
  renderTemplateGrid(allTmpls);

  // Setup Carousel Nav
  const grid = document.getElementById('template-grid-dynamic');
  const navPrev = document.getElementById('layout-nav-prev');
  const navNext = document.getElementById('layout-nav-next');
  if (grid && navPrev && navNext) {
    navPrev.addEventListener('click', () => grid.scrollBy({ left: -180, behavior: 'smooth' }));
    navNext.addEventListener('click', () => grid.scrollBy({ left: 180, behavior: 'smooth' }));
  }

  nextBtn.addEventListener('click', () => {
    if (!state.templateConfig) return;
    const cfg = state.templateConfig;
    state.frames = Array.from({ length: cfg.windows.length }, () => ({
      chars: [],
      poses: {},
    }));
    state.capturedImages = Array(cfg.windows.length).fill(null);
    goToPhase(2);
  });
}

function renderTemplateGrid(allTmpls) {
  const grid = document.getElementById('template-grid-dynamic');
  if (!grid) return;
  grid.innerHTML = '';

  allTmpls.forEach((t, idx) => {
    const card = document.createElement('label');
    card.className = 'template-card template-card-dynamic';

    const input = document.createElement('input');
    input.type  = 'radio';
    input.name  = 'frame-template-dynamic';
    input.value = idx;
    input.hidden = true;

    // Image preview
    const preview = document.createElement('div');
    preview.className = 'template-preview-wrap';
    const img = document.createElement('img');
    img.src = `./assets/frames/${t.file}`;
    img.alt = t.name;
    img.loading = 'lazy';
    preview.appendChild(img);

    // Text information below the image
    const info = document.createElement('div');
    info.className = 'template-info';
    info.innerHTML = `
      <div class="t-name">${t.name}</div>
      <div class="t-meta">Size: ${t.stripType}</div>
      <div class="t-meta">Frames: ${t.frameCount}</div>
    `;

    card.appendChild(input);
    card.appendChild(preview);
    card.appendChild(info);

    input.addEventListener('change', () => {
      state.templateConfig = t;
      updatePhase1Next();
    });

    grid.appendChild(card);
  });
}

function updatePhase1Next() {
  const btn = document.getElementById('phase1-next');
  if (btn) {
    btn.disabled = !state.templateConfig;
    if (state.templateConfig) {
      btn.className = 'btn-primary';
    } else {
      btn.className = 'btn-secondary';
    }
  }
}




// ============================================================
// PHASE 3 — PHOTOSHOOT
// ============================================================

let captureCanvas, captureCtx;

function initPhase2() {
  state.currentFrame = 0;
  state.capturedImages = Array(state.templateConfig ? state.templateConfig.windows.length : 4).fill(null);
  state.capturedImageElements = [];
  state.currentUploadedImage = null;
  
  captureCanvas = document.getElementById('capture-canvas');
  captureCtx    = captureCanvas.getContext('2d');

  const cameraControls = document.querySelector('.camera-controls');
  if (cameraControls) cameraControls.style.display = 'flex';
  
  const retakeBtn = document.getElementById('retake-btn');
  const decorateBtn = document.getElementById('decorate-btn');
  if (retakeBtn) retakeBtn.disabled = true;
  if (decorateBtn) decorateBtn.disabled = true;

  const imgView = document.getElementById('camera-uploaded-image');
  if (imgView) imgView.style.display = 'none';
  const video = document.getElementById('camera-video');
  if (video) video.style.display = 'block';

  renderFrameDots();
  updateShootUI();
  startCamera();

  const shootBtn = document.getElementById('shoot-btn');
  if (shootBtn) shootBtn.onclick  = startCountdown;
  const skipBtn = document.getElementById('skip-frame');
  if (skipBtn) skipBtn.onclick = skipFrame;
  const toggleBtn = document.getElementById('toggle-camera');
  if (toggleBtn) toggleBtn.onclick = toggleCamera;

  const uploadBtn = document.getElementById('upload-btn');
  const uploadInput = document.getElementById('photo-upload-input');
  if (uploadBtn && uploadInput) {
    uploadBtn.onclick = () => uploadInput.click();
    // Remove old listeners to prevent duplicates
    const newUploadInput = uploadInput.cloneNode(true);
    uploadInput.parentNode.replaceChild(newUploadInput, uploadInput);
    
    newUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          state.currentUploadedImage = img;
          const video = document.getElementById('camera-video');
          const imgView = document.getElementById('camera-uploaded-image');
          if (video) video.style.display = 'none';
          if (imgView) {
            imgView.src = img.src;
            imgView.style.display = 'block';
          }
          const fallbackUI = document.getElementById('camera-fallback');
          if (fallbackUI) fallbackUI.style.display = 'none';
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const retryCameraBtn = document.getElementById('retry-camera-btn');
  if (retryCameraBtn) {
    retryCameraBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startCamera();
    });
  }

  const mirrorBtn = document.getElementById('mirror-camera');
  if (mirrorBtn) {
    mirrorBtn.onclick = () => {
      state.unmirrorCamera = !state.unmirrorCamera;
      mirrorBtn.classList.toggle('active', state.unmirrorCamera);
      const video = document.getElementById('camera-video');
      if (video) {
        video.style.transform = (state.facingMode === 'user' && !state.unmirrorCamera) ? 'scaleX(-1)' : 'scaleX(1)';
      }
    };
  }

  const flashBtn = document.getElementById('toggle-flash');
  if (flashBtn) {
    flashBtn.onclick = () => {
      state.flashOn = !state.flashOn;
      flashBtn.style.color = state.flashOn ? '#C8B87A' : '';
    };
  }
}

async function startCamera() {
  const video = document.getElementById('camera-video');
  const fallback = document.getElementById('camera-upload-fallback');

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('navigator.mediaDevices.getUserMedia is unsupported in this context (requires HTTPS or localhost).');
    }

    if (state.stream) {
      state.stream.getTracks().forEach(t => t.stop());
    }

    const constraints = {
      video: {
        width:  { ideal: 1280 },
        height: { ideal: 960 },
      }
    };
    if (state.facingMode) {
      constraints.video.facingMode = { ideal: state.facingMode };
    }
    
    state.stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    video.srcObject = state.stream;
    video.style.display = 'block';
    
    await video.play().catch(e => console.warn('Video play interrupted:', e));
    
    if (fallback) fallback.style.display = 'none';

  } catch (err) {
    console.warn('Camera error caught:', err);
    video.style.display = 'none';
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
}

async function toggleCamera() {
  state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
  const video = document.getElementById('camera-video');
  video.style.transform = state.facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
  await startCamera();
}

function stopCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach(t => t.stop());
    state.stream = null;
  }
}

function renderFrameDots() {
  const container = document.getElementById('shoot-frame-dots');
  container.innerHTML = '';
  const total = state.frames.length;
  for (let i = 0; i < total; i++) {
    const slot = document.createElement('div');
    slot.className = 'captured-slot';
    slot.textContent = i + 1;
    container.appendChild(slot);
  }
}

function updateShootUI(isFinished = false) {
  const total   = state.frames.length;
  // Cap the displayed current frame at total, so it doesn't show "3 / 2" if currentFrame increments past length
  const displayCurrent = Math.min(state.currentFrame, total);

  document.getElementById('shoot-frame-count').textContent = `${displayCurrent} / ${total}`;

  // Update captured slots
  document.querySelectorAll('.captured-slot').forEach((slot, i) => {
    slot.classList.remove('active', 'done');
    if (i === state.currentFrame && !isFinished) slot.classList.add('active');
    if (i < state.currentFrame) {
      slot.classList.add('done');
      if (state.capturedImages[i]) {
        slot.style.backgroundImage = `url(${state.capturedImages[i]})`;
      }
    } else {
      slot.style.backgroundImage = 'none';
    }
  });

  if (!isFinished) {
    // Render character overlays for this frame
    renderCharOverlays(state.currentFrame);

    // Render side panel
    renderShootSidePanel(state.currentFrame);
  } else {
    // Clear character overlays when finished
    document.getElementById('char-overlay-container').innerHTML = '';
  }
}

function renderCharOverlays(frameIdx) {
  const container = document.getElementById('char-overlay-container');
  container.innerHTML = '';

  const frame = state.frames[frameIdx];
  if (!frame || frame.chars.length === 0) return;

  const viewport = document.getElementById('camera-viewport');
  const vw = viewport.offsetWidth;
  const vh = viewport.offsetHeight;

  const charCount = frame.chars.length;

  frame.chars.forEach((char, i) => {
    const charData = CHARACTERS[char];
    const charW = Math.min(120, vw / charCount - 10);
    const charH = charW * 2;

    const overlay = document.createElement('div');
    overlay.className = 'char-overlay';
    overlay.id = `char-overlay-${char}`;
    overlay.style.setProperty('--char-glow', charData.glow);

    // Spread characters horizontally
    const spacing = vw / (charCount + 1);
    const startX  = spacing * (i + 1) - charW / 2;

    overlay.style.left = `${startX}px`;
    overlay.style.bottom = '0px';
    overlay.style.setProperty('--char-w', `${charW}px`);
    overlay.style.setProperty('--char-h', `${charH}px`);

    const body = document.createElement('div');
    body.className = 'char-overlay-body';
    body.style.borderRadius = '8px 8px 0 0';

    if (charData.poses) {
      body.style.background = 'transparent';
      const img = document.createElement('img');
      img.className = 'char-overlay-img';
      img.src = `assets/characters/${char}/${frame.poses[char]}.webp`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.pointerEvents = 'none'; // so we can drag the body easily
      body.appendChild(img);
    } else {
      body.style.background = charData.bg;
      // Pose indicator inside the placeholder
      const poseIndicator = document.createElement('div');
      poseIndicator.style.cssText = `
        width: 60%; height: 60%; margin: 10% auto 0;
        background: ${charData.color};
        border-radius: 50% 50% 40% 40%;
        opacity: 0.7;
      `;
      body.appendChild(poseIndicator);
    }

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.innerHTML = '&#x2197;';
    
    overlay.appendChild(body);
    overlay.appendChild(resizeHandle);

    makeDraggable(overlay, viewport);
    container.appendChild(overlay);
  });
}

function renderShootSidePanel(frameIdx) {
  const list = document.getElementById('shoot-char-list');
  list.innerHTML = '';
  
  const frame = state.frames[frameIdx];
  const allChars = Object.keys(CHARACTERS);

  if (state.openAccordion === undefined) {
    state.openAccordion = frame.chars.length > 0 ? frame.chars[0] : 'xavier';
  }

  const mobilePills = document.createElement('div');
  mobilePills.className = 'mobile-char-pills';

  const mobilePoses = document.createElement('div');
  mobilePoses.className = 'mobile-char-poses';

  const desktopAccordion = document.createElement('div');
  desktopAccordion.className = 'desktop-char-accordion';

  allChars.forEach(char => {
    const charData = CHARACTERS[char];
    const isActive = frame.chars.includes(char);
    const isOpen = state.openAccordion === char;

    // --- MOBILE PILL ---
    const pill = document.createElement('button');
    let pillClasses = 'char-filter-pill';
    if (isActive) pillClasses += ' active';
    if (isOpen) pillClasses += ' open';
    pill.className = pillClasses;
    pill.textContent = charData.name;
    pill.onclick = () => {
      state.openAccordion = char;
      renderShootSidePanel(frameIdx);
    };
    mobilePills.appendChild(pill);

    // If this character is open, render their poses into the mobile poses container
    if (isOpen) {
      const posesScrollMobile = document.createElement('div');
      posesScrollMobile.className = 'poses-horizontal-scroll';
      const charPoses = charData.poses || POSES;
      charPoses.forEach(pose => {
        const poseBtn = createPoseButton(char, pose, isActive, frame);
        posesScrollMobile.appendChild(poseBtn);
      });
      mobilePoses.appendChild(posesScrollMobile);
    }

    // --- DESKTOP ACCORDION ---
    const accItem = document.createElement('div');
    accItem.className = 'shoot-char-item';

    const btn = document.createElement('div');
    let btnClasses = 'shoot-char-toggle';
    if (isActive) btnClasses += ' active';
    if (isOpen) btnClasses += ' open';
    btn.className = btnClasses;
    btn.setAttribute('role', 'button');
    btn.tabIndex = 0;
    btn.innerHTML = `<span>${charData.name}</span> <span class="arrow"></span>`;

    const posesDiv = document.createElement('div');
    posesDiv.className = 'shoot-char-poses' + (isOpen ? ' open' : '');
    
    const posesScroll = document.createElement('div');
    posesScroll.className = 'poses-horizontal-scroll';
    
    const charPoses = charData.poses || POSES;
    charPoses.forEach(pose => {
      const poseBtn = createPoseButton(char, pose, isActive, frame);
      posesScroll.appendChild(poseBtn);
    });

    posesDiv.appendChild(posesScroll);

    const toggle = () => {
      if (state.openAccordion !== char) {
        state.openAccordion = char;
        renderShootSidePanel(frameIdx);
      }
    };

    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });

    accItem.appendChild(btn);
    accItem.appendChild(posesDiv);
    desktopAccordion.appendChild(accItem);
  });

  list.appendChild(mobilePills);
  list.appendChild(mobilePoses);
  list.appendChild(desktopAccordion);
}

function createPoseButton(char, pose, isActive, frame) {
  const poseBtn = document.createElement('div');
  poseBtn.className = 'pose-card-btn';
  if (isActive && frame.poses[char] === pose.id) {
    poseBtn.classList.add('selected');
  }
  
  const thumb = document.createElement('div');
  thumb.className = 'pose-thumb-small';
  
  // If the character has custom poses defined (like Caleb), load the actual webp image
  const charData = CHARACTERS[char];
  if (charData.poses) {
    const img = document.createElement('img');
    img.src = `assets/characters/${char}/${pose.id}.webp`;
    img.loading = 'lazy';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'top center';
    img.style.borderRadius = '4px';
    img.style.pointerEvents = 'none';
    img.style.display = 'block';
    
    thumb.appendChild(img);
    thumb.style.backgroundColor = 'transparent';
  }
  
  const lbl = document.createElement('div');
  lbl.className = 'pose-label-small';
  lbl.textContent = pose.label;
  
  poseBtn.appendChild(thumb);
  poseBtn.appendChild(lbl);
  
  poseBtn.onclick = () => {
    if (isActive && frame.poses[char] === pose.id) {
      // Deselect
      frame.chars = frame.chars.filter(c => c !== char);
      delete frame.poses[char];
    } else {
      if (!frame.chars.includes(char)) frame.chars.push(char);
      frame.poses[char] = pose.id;
    }
    renderCharOverlays(state.currentFrame);
    renderShootSidePanel(state.currentFrame);
  };
  return poseBtn;
}

function startCountdown() {
  if (state.countingDown) return;
  
  if (state.currentUploadedImage) {
    captureCurrentFrame();
    return;
  }

  state.countingDown = true;

  const shootBtn  = document.getElementById('shoot-btn');
  const countEl   = document.getElementById('countdown-number');
  const skipBtn   = document.getElementById('skip-frame');
  const display   = document.getElementById('shoot-countdown-display');

  shootBtn.disabled = true;
  if (skipBtn) skipBtn.disabled = true;
  if (display) display.style.display = 'flex';

  let count = 5;
  countEl.textContent = count;

  const tick = setInterval(() => {
    count--;
    if (count > 0) {
      countEl.textContent = count;
      // Pulse animation
      countEl.style.transform = 'scale(1.3)';
      setTimeout(() => { countEl.style.transform = 'scale(1)'; }, 150);
    } else {
      clearInterval(tick);
      countEl.textContent = '📸';
      captureCurrentFrame();
    }
  }, 1000);
}

function drawImageCover(ctx, img, targetW, targetH) {
  const imgW = img.videoWidth || img.width;
  const imgH = img.videoHeight || img.height;
  const imgAspect = imgW / imgH;
  const targetAspect = targetW / targetH;
  let drawW, drawH, drawX, drawY;

  if (imgAspect > targetAspect) {
    drawH = targetH;
    drawW = imgW * (targetH / imgH);
    drawX = (targetW - drawW) / 2;
    drawY = 0;
  } else {
    drawW = targetW;
    drawH = imgH * (targetW / imgW);
    drawX = 0;
    drawY = (targetH - drawH) / 2;
  }
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function drawCharOverlaysToContext(ctx, viewport, captureCanvas) {
  const overlays = document.querySelectorAll('#char-overlay-container .char-overlay');
  if (overlays.length === 0) return;

  const vw = viewport.offsetWidth;
  const vh = viewport.offsetHeight;
  const vpRect = viewport.getBoundingClientRect();
  
  const cw = captureCanvas.width;
  const ch = captureCanvas.height;
  
  const video = document.getElementById('camera-video');
  const videoW = video.videoWidth || vw;
  const videoH = video.videoHeight || vh;
  
  const scaleC = Math.max(cw / videoW, ch / videoH);
  const scaleV = Math.max(vw / videoW, vh / videoH);
  const ratio = scaleC / scaleV;
  
  overlays.forEach(overlay => {
    const charId = overlay.id.replace('char-overlay-', '');
    const charData = CHARACTERS[charId];
    if (!charData) return;
    
    const body = overlay.querySelector('.char-overlay-body');
    if (!body) return;
    
    const bodyRect = body.getBoundingClientRect();
    
    // Position relative to viewport center
    const cx_v = (bodyRect.left + bodyRect.width / 2) - vpRect.left - vw / 2;
    const cy_v = (bodyRect.top + bodyRect.height / 2) - vpRect.top - vh / 2;
    
    // Map to canvas center
    const cx_c = (cw / 2) + cx_v * ratio;
    const cy_c = (ch / 2) + cy_v * ratio;
    
    const bodyW = bodyRect.width * ratio;
    const bodyH = bodyRect.height * ratio;
    
    ctx.save();
    ctx.translate(cx_c, cy_c);
    
    // Check if we have an image
    const imgEl = body.querySelector('.char-overlay-img');
    if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
      // It's an image, draw with contain logic centered at (0,0)
      const imgW = imgEl.naturalWidth;
      const imgH = imgEl.naturalHeight;
      const imgAspect = imgW / imgH;
      const targetAspect = bodyW / bodyH;
      let drawW, drawH;
      
      if (imgAspect > targetAspect) {
        drawW = bodyW;
        drawH = bodyW / imgAspect;
      } else {
        drawH = bodyH;
        drawW = bodyH * imgAspect;
      }
      ctx.drawImage(imgEl, -drawW/2, -drawH/2, drawW, drawH);
    } else {
      // Draw body gradient fallback
      const grad = ctx.createLinearGradient(0, -bodyH/2, 0, bodyH/2);
      grad.addColorStop(0, charData.color);
      grad.addColorStop(1, charData.color + '4D'); // 30% opacity
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-bodyW/2, -bodyH/2, bodyW, bodyH, [8*ratio, 8*ratio, 0, 0]);
      } else {
        ctx.rect(-bodyW/2, -bodyH/2, bodyW, bodyH);
      }
      ctx.fill();
      
      // Draw pose indicator
      const piW = bodyW * 0.6;
      const piH = bodyH * 0.6;
      ctx.fillStyle = charData.color + 'B3'; // 70% opacity
      ctx.beginPath();
      const piCy = -bodyH/2 + bodyH*0.1 + piH/2;
      ctx.ellipse(0, piCy, piW/2, piH/2, 0, 0, Math.PI*2);
      ctx.fill();
    }
    
    ctx.restore();
  });
}

function captureCurrentFrame() {
  const video   = document.getElementById('camera-video');
  const flash   = document.getElementById('camera-flash');
  const captureCanvas = document.getElementById('capture-canvas');
  const captureCtx    = captureCanvas.getContext('2d');
  
  // Hide the countdown display (including the camera emoji)
  const display = document.getElementById('shoot-countdown-display');
  if (display) display.style.display = 'none';

  // Flash effect
  if (state.flashOn && flash) {
    flash.classList.add('flash');
    setTimeout(() => flash.classList.remove('flash'), 500);
  }

  // Determine capture dimensions from viewport aspect ratio
  const viewport = document.getElementById('camera-viewport');
  const vw = viewport.offsetWidth;
  const vh = viewport.offsetHeight;
  
  const targetW = 800;
  const targetH = Math.round(targetW * (vh / vw));
  captureCanvas.width  = targetW;
  captureCanvas.height = targetH;

  if (state.currentUploadedImage) {
    captureCtx.save();
    drawImageCover(captureCtx, state.currentUploadedImage, captureCanvas.width, captureCanvas.height);
    captureCtx.restore();
    
    drawCharOverlaysToContext(captureCtx, viewport, captureCanvas);

    state.capturedImages[state.currentFrame] = captureCanvas.toDataURL('image/jpeg', 0.92);
  } else if (video.srcObject && video.readyState >= 2) {
    captureCtx.save();
    const shouldMirror = (state.facingMode === 'user' && !state.unmirrorCamera);
    if (shouldMirror) {
      captureCtx.translate(captureCanvas.width, 0);
      captureCtx.scale(-1, 1);
    }
    drawImageCover(captureCtx, video, captureCanvas.width, captureCanvas.height);
    captureCtx.restore();
    
    drawCharOverlaysToContext(captureCtx, viewport, captureCanvas);

    state.capturedImages[state.currentFrame] = captureCanvas.toDataURL('image/jpeg', 0.92);
  } else {
    // No camera — create a placeholder gradient
    captureCtx.fillStyle = '#12122B';
    captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
    const frame = state.frames[state.currentFrame];
    if (frame && frame.chars && frame.chars.length > 0) {
      const charData = CHARACTERS[frame.chars[0]];
      if (charData) {
        const grad = captureCtx.createLinearGradient(0, captureCanvas.height, captureCanvas.width, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, charData.color + '33');
        captureCtx.fillStyle = grad;
        captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
      }
    }
    
    drawCharOverlaysToContext(captureCtx, viewport, captureCanvas);

    state.capturedImages[state.currentFrame] = captureCanvas.toDataURL('image/jpeg', 0.92);
  }

  // Fly animation
  const imgData = state.capturedImages[state.currentFrame];
  if (imgData) {
    const flyImg = document.createElement('div');
    flyImg.style.position = 'fixed';
    
    // Start from the camera viewport position
    const startRect = viewport.getBoundingClientRect();
    
    flyImg.style.left = startRect.left + 'px';
    flyImg.style.top = startRect.top + 'px';
    flyImg.style.width = startRect.width + 'px';
    flyImg.style.height = startRect.height + 'px';
    flyImg.style.backgroundImage = `url(${imgData})`;
    flyImg.style.backgroundSize = 'cover';
    flyImg.style.zIndex = '9999';
    flyImg.style.transition = 'all 0.5s ease-in-out';
    flyImg.style.borderRadius = '0px';
    flyImg.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    document.body.appendChild(flyImg);

    // Target the specific captured slot
    const slots = document.querySelectorAll('.captured-slot');
    const targetSlot = slots[state.currentFrame];
    const targetRect = targetSlot.getBoundingClientRect();

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyImg.style.left = targetRect.left + 'px';
        flyImg.style.top = targetRect.top + 'px';
        flyImg.style.width = targetRect.width + 'px';
        flyImg.style.height = targetRect.height + 'px';
        flyImg.style.opacity = '0.5';
        flyImg.style.borderRadius = '8px';
      });
    });

    setTimeout(() => {
      flyImg.remove();
      advanceFrame();
    }, 500);
  } else {
    advanceFrame();
  }
}

function captureFrameFromImage(img) {
  const viewport = document.getElementById('camera-viewport');
  const vw = viewport.offsetWidth;
  const vh = viewport.offsetHeight;
  
  const targetW = 800;
  const targetH = Math.round(targetW * (vh / vw));

  const captureCanvas = document.getElementById('capture-canvas');
  const captureCtx    = captureCanvas.getContext('2d');
  captureCanvas.width  = targetW;
  captureCanvas.height = targetH;

  drawImageCover(captureCtx, img, captureCanvas.width, captureCanvas.height);
  
  drawCharOverlaysToContext(captureCtx, viewport, captureCanvas);
  
  state.capturedImages[state.currentFrame] = captureCanvas.toDataURL('image/jpeg', 0.92);

  // Hide upload fallback UI after capturing
  const fallbackUI = document.getElementById('camera-upload-fallback');
  if (fallbackUI) fallbackUI.style.display = 'none';

  advanceFrame();
}

function advanceFrame() {
  state.currentUploadedImage = null;
  const imgView = document.getElementById('camera-uploaded-image');
  if (imgView) imgView.style.display = 'none';
  const video = document.getElementById('camera-video');
  if (video) video.style.display = 'block';

  state.countingDown = false;
  const shootBtn = document.getElementById('shoot-btn');
  const skipBtn  = document.getElementById('skip-frame');
  const countEl  = document.getElementById('countdown-number');
  const display  = document.getElementById('shoot-countdown-display');

  shootBtn.disabled = false;
  if (skipBtn) skipBtn.disabled = false;
  countEl.textContent = '—';
  if (display) display.style.display = 'none';

  if (state.currentFrame < state.frames.length - 1) {
    state.currentFrame++;
    updateShootUI();
  } else {
    // All frames done — wait for user to retake or decorate
    state.currentFrame++;
    updateShootUI(true);

    const cameraControls = document.querySelector('.camera-controls');
    if (cameraControls) cameraControls.style.display = 'none';
    
    const retakeBtn = document.getElementById('retake-btn');
    const decorateBtn = document.getElementById('decorate-btn');
    if (retakeBtn) retakeBtn.disabled = false;
    if (decorateBtn) decorateBtn.disabled = false;
  }
}

function retakePhotos() {
  state.currentFrame = 0;
  state.capturedImages = Array(state.templateConfig ? state.templateConfig.windows.length : 4).fill(null);
  
  const cameraControls = document.querySelector('.camera-controls');
  if (cameraControls) cameraControls.style.display = 'flex';
  
  const retakeBtn = document.getElementById('retake-btn');
  const decorateBtn = document.getElementById('decorate-btn');
  if (retakeBtn) retakeBtn.disabled = true;
  if (decorateBtn) decorateBtn.disabled = true;
  
  updateShootUI();
}

function proceedToDecorate() {
  showDeveloping();
}

function skipFrame() {
  // Capture a blank for this frame
  const layoutCfg = LAYOUTS[state.layout];
  captureCanvas.width  = layoutCfg.frameW;
  captureCanvas.height = layoutCfg.frameH;
  captureCtx.fillStyle = '#12122B';
  captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
  state.capturedImages[state.currentFrame] = captureCanvas.toDataURL('image/jpeg', 0.92);
  advanceFrame();
}

function showDeveloping() {
  stopCamera();
  const overlay = document.getElementById('developing-overlay');
  const progress = document.getElementById('dev-progress');
  const devVideo = document.getElementById('developing-video');

  overlay.classList.remove('hidden');
  
  if (devVideo) {
    devVideo.currentTime = 0;
    devVideo.play().catch(e => console.warn('Could not play developing video:', e));
  }

  requestAnimationFrame(() => {
    progress.style.width = '100%';
  });

  setTimeout(() => {
    overlay.classList.add('hidden');
    goToPhase(3);
  }, 3000);
}

// ============================================================
// DRAGGABLE UTILITY (for character overlays & decorations)
// ============================================================


// ============================================================
// PHASE 4 — DECORATION STUDIO (frame-compositing engine)
// ============================================================

let studioCanvas, studioCtx;
let frameImage = null; // the loaded frame PNG/webp Image object
// Swap-mode state (module-level so drawStudioCanvas can read them)
let _isSwappingPhoto = false;
let _swapSourceIndex = -1;
let _swapTargetIndex = -1;
// All drag/interaction state — module-level so closures and drawStudioCanvas share them
let activeWindowIndex = -1;
let isDraggingPhoto = false;
let isDraggingDeco = false;
let isScalingDeco = false;
let scaleStartDist = 0;
let scaleStartValue = 1;
let isRotatingDeco = false;
let rotateStartAngle = 0;
let rotateStartValue = 0;
let dragStartX = 0;
let dragStartY = 0;
let hasMoved = false;
let swapGhostEl = null;


async function initPhase3() {
  studioCanvas = document.getElementById('studio-canvas');
  studioCtx    = studioCanvas.getContext('2d');
  state.decorations = [];
  state.history     = [];
  state.historyIndex = -1;
  frameImage = null;

  // Reset module-level interaction state
  activeWindowIndex = -1; isDraggingPhoto = false; isDraggingDeco = false;
  isScalingDeco = false; isRotatingDeco = false; hasMoved = false;
  _isSwappingPhoto = false; _swapSourceIndex = -1; _swapTargetIndex = -1;
  hideSwapGhost();

  // Default Zoom
  const wrap = document.querySelector('.studio-canvas-panel');
  if (wrap && state.templateConfig) {
    const padding = 40;
    state.stripZoom = (wrap.clientHeight - padding) / state.templateConfig.stripHeight;
    state.minStripZoom = state.stripZoom;
  }

  // Tab switching
  if (!window.hasInitializedStudioTabs) {
    document.querySelectorAll('.studio-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = document.getElementById('tab-' + tab.dataset.tab);
        const isActive = tab.classList.contains('active');
        
        // Close all tabs
        document.querySelectorAll('.studio-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });

        // If the clicked tab wasn't active, OR we are on a desktop screen, open it
        const isMobile = window.innerWidth <= 1024;
        if (!isActive || !isMobile) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          if (panel) {
            panel.classList.add('active');
            panel.style.display = 'block';
          }
        }
      });
    });
    window.hasInitializedStudioTabs = true;

    const isMobile = window.innerWidth <= 1024;
    if (!isMobile) {
      const filtersTab = document.querySelector('.studio-tab[data-tab="filters"]');
      if (filtersTab) filtersTab.click();
    }
  }
  
  const handleTouchAsMouse = (handler) => (e) => {
      if (!handler) return;
      if (e.touches && e.touches.length === 1) {
        handler({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          stopPropagation: () => e.stopPropagation(),
          preventDefault: () => e.preventDefault()
        });
      } else if (e.type === 'touchend' && e.touches.length === 0) {
        handler(e);
      }
    };
  
    if (studioCanvas) {
      studioCanvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && studioCanvas.onmousedown) {
          handleTouchAsMouse(studioCanvas.onmousedown)(e);
        }
      }, { passive: false });
    }
  
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && window.onmousemove) {
        if (typeof isDraggingDeco !== 'undefined' && (isDraggingDeco || isScalingDeco || isRotatingDeco || isDraggingPhoto)) {
          e.preventDefault(); // prevent scroll
        }
        handleTouchAsMouse(window.onmousemove)(e);
      }
    }, { passive: false });
  
    window.addEventListener('touchend', (e) => {
      if (window.onmouseup) handleTouchAsMouse(window.onmouseup)(e);
    });
  
    const decoRotateBtn = document.getElementById('deco-rotate');
    if (decoRotateBtn) {
      decoRotateBtn.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          e.preventDefault();
          if (decoRotateBtn.onmousedown) handleTouchAsMouse(decoRotateBtn.onmousedown)(e);
        }
      }, { passive: false });
    }
  
    const decoScaleBtn = document.getElementById('deco-scale');
    if (decoScaleBtn) {
      decoScaleBtn.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          e.preventDefault();
          if (decoScaleBtn.onmousedown) handleTouchAsMouse(decoScaleBtn.onmousedown)(e);
        }
      }, { passive: false });
    }
  
    // Pinch-to-zoom for mobile
  let initialPinchDistance = null;
  let initialStripZoom = null;
  let initialDecoScale = null;

  wrap.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      initialStripZoom = state.stripZoom;
      if (state.selectedDecoIndex >= 0) {
        initialDecoScale = state.decorations[state.selectedDecoIndex].scale;
      }
    }
  });

  wrap.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      e.preventDefault(); // Prevent page scroll
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const zoomFactor = currentDistance / initialPinchDistance;
      
      if (state.selectedDecoIndex >= 0 && initialDecoScale !== null) {
        const d = state.decorations[state.selectedDecoIndex];
        d.scale = Math.max(0.1, initialDecoScale * zoomFactor);
        drawStudioCanvas();
        updateDecoControls();
      } else {
        state.stripZoom = Math.min(Math.max(initialStripZoom * zoomFactor, state.minStripZoom || 0.2), 2.0);
        
        const cfg = state.templateConfig;
        if (cfg) {
          studioCanvas.style.width = (cfg.stripWidth * state.stripZoom) + 'px';
          studioCanvas.style.height = (cfg.stripHeight * state.stripZoom) + 'px';
          drawStudioCanvas();
          updateDecoControls();
          updateZoomState();
        }
      }
    }
  }, { passive: false });

  wrap.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      initialPinchDistance = null;
    }
  });

  // Set default tab visibility based on device
  if (window.matchMedia('(min-width: 1025px)').matches) {
    const filtersTab = document.getElementById('tab-btn-filters');
    if (filtersTab && !filtersTab.classList.contains('active')) {
      filtersTab.click();
    }
  } else {
    // on mobile, ensure all tabs are closed initially
    document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
  }

  // Initialize photo transforms
  const cfg = state.templateConfig;
  if (cfg) {
    state.photoTransforms = Array(cfg.windows.length).fill(null).map(() => ({ x: 0, y: 0, scale: 1 }));
  }

  // Pre-load all captured images so panning is fast
  state.capturedImageElements = [];
  for (let i = 0; i < state.capturedImages.length; i++) {
    if (state.capturedImages[i]) {
      try {
        state.capturedImageElements[i] = await loadImage(state.capturedImages[i]);
      } catch (e) {
        state.capturedImageElements[i] = null;
      }
    } else {
      state.capturedImageElements[i] = null;
    }
  }

    if (cfg && cfg.file) {
      try {
        frameImage = await loadImage('./assets/frames/' + cfg.file);
      } catch (e) {
        console.error("Failed to load frameImage", e);
      }
    }

  // Photo dragging interaction
  function clampPhotoTransform(index) {
  const t = state.photoTransforms[index];
  const win = state.templateConfig.windows[index];
  const img = state.capturedImageElements[index];
  if (!win || !img) return;
  
  let winW = win.shape === 'ellipse' ? win.rx * 2 : win.w;
  let winH = win.shape === 'ellipse' ? win.ry * 2 : win.h;
  
  const minScale = Math.max(winW / img.width, winH / img.height);
  const scale = minScale * t.scale;
  const dw = img.width * scale;
  const dh = img.height * scale;
  
  const maxX = (dw - winW) / 2;
  const maxY = (dh - winH) / 2;
  
  // Allow a bit of leeway for dragging off screen, or restrict fully to window
  if (t.x > maxX) t.x = maxX;
  if (t.x < -maxX) t.x = -maxX;
  if (t.y > maxY) t.y = maxY;
  if (t.y < -maxY) t.y = -maxY;
}

function updateDecoControls() {
    const decoControls = document.getElementById('deco-controls');
    if (state.selectedDecoIndex >= 0) {
      const d = state.decorations[state.selectedDecoIndex];
      if (!d || !d.hitW) {
        if (decoControls) decoControls.style.display = 'none';
        return;
      }
    
    const wrapRect = document.getElementById('studio-strip-wrap').getBoundingClientRect();
    const rect = studioCanvas.getBoundingClientRect();
    const displayScale = rect.width / studioCanvas.width;
    
    const offsetX = rect.left - wrapRect.left;
    const offsetY = rect.top - wrapRect.top;
    
    decoControls.style.display = 'block';
    decoControls.style.left = (offsetX + d.x * displayScale) + 'px';
    decoControls.style.top = (offsetY + d.y * displayScale) + 'px';
    decoControls.style.width = (d.hitW * d.scale * displayScale) + 'px';
    decoControls.style.height = (d.hitH * d.scale * displayScale) + 'px';
    decoControls.style.transform = `rotate(${d.rotation || 0}rad)`;

    if (d.type === 'text') {
      const input = document.getElementById('text-input');
      if (input && document.activeElement !== input) input.value = d.text;
            const fontSel = document.getElementById('text-font');
        if (fontSel) {
          if (d.font.includes('Cormorant')) fontSel.value = 'cormorant';
          else if (d.font.includes('Chakra')) fontSel.value = 'chakra';
          else if (d.font.includes('Roboto')) fontSel.value = 'roboto';
          else if (d.font.includes('Oswald')) fontSel.value = 'oswald';
          else if (d.font.includes('Pacifico')) fontSel.value = 'pacifico';
          else if (d.font.includes('Dancing')) fontSel.value = 'dancing';
          else if (d.font.includes('Playfair')) fontSel.value = 'playfair';
          else if (d.font.includes('Outfit')) fontSel.value = 'outfit';
          else if (d.font.includes('Caveat')) fontSel.value = 'caveat';
          else fontSel.value = 'inter';
        }
      
      document.querySelectorAll('.text-color-btn').forEach(b => b.classList.remove('active'));
      const colorBtn = document.querySelector(`.text-color-btn[data-color="${d.color}"]`);
      if (colorBtn) {
        colorBtn.classList.add('active');
      } else {
        const customPicker = document.getElementById('custom-text-color');
        if (customPicker) {
          customPicker.value = d.color;
          customPicker.parentElement.classList.add('active');
        }
      }
    }
  } else {
    if (decoControls) decoControls.style.display = 'none';
  }
}

  // (ghost/helper fns are module-level — see below initPhase3)


  studioCanvas.onmousedown = (e) => {
    const rect = studioCanvas.getBoundingClientRect();
    const scaleX = studioCanvas.width / rect.width;
    const scaleY = studioCanvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 1. Check decorations first (top-most first)
    for (let i = state.decorations.length - 1; i >= 0; i--) {
      const d = state.decorations[i];
      const dw = d.hitW * d.scale;
      const dh = d.hitH * d.scale;
      const cx = d.x + dw / 2;
      const cy = d.y + dh / 2;
      
      const rot = d.rotation || 0;
      const dx = x - cx;
      const dy = y - cy;
      const unrotatedX = dx * Math.cos(-rot) - dy * Math.sin(-rot);
      const unrotatedY = dx * Math.sin(-rot) + dy * Math.cos(-rot);

      if (unrotatedX >= -dw/2 && unrotatedX <= dw/2 && unrotatedY >= -dh/2 && unrotatedY <= dh/2) {
        state.selectedDecoIndex = i;
        isDraggingDeco = true;
        hasMoved = false;
        dragStartX = x;
        dragStartY = y;
        drawStudioCanvas();
        updateDecoControls();
        return;
      }
    }
    
    // Deselect if no decoration clicked
    if (state.selectedDecoIndex !== -1) {
      state.selectedDecoIndex = -1;
      updateDecoControls();
      drawStudioCanvas();
    }

    const cfg = state.templateConfig;
    if (!cfg) return;

    activeWindowIndex = -1;
    _isSwappingPhoto = false;
    _swapSourceIndex = -1;
    _swapTargetIndex = -1;
    for (let i = 0; i < cfg.windows.length; i++) {
      const win = cfg.windows[i];
      if (hitTestWindow(win, x, y)) {
        activeWindowIndex = i;
        _swapSourceIndex  = i;
        isDraggingPhoto   = true;
        hasMoved          = false;
        dragStartX        = x;
        dragStartY        = y;
        break;
      }
    }

    const zoomControls = document.getElementById('photo-zoom-controls');
    if (activeWindowIndex >= 0) {
      const win = cfg.windows[activeWindowIndex];
      const wrapRect = document.getElementById('studio-strip-wrap').getBoundingClientRect();
      const rect = studioCanvas.getBoundingClientRect();
      const scaleX = rect.width / studioCanvas.width;
      const scaleY = rect.height / studioCanvas.height;
      const offsetX = rect.left - wrapRect.left;
      const offsetY = rect.top - wrapRect.top;
      
      let winX = win.shape === 'ellipse' ? win.cx - win.rx : win.x;
      let winY = win.shape === 'ellipse' ? win.cy - win.ry : win.y;
      let winW = win.shape === 'ellipse' ? win.rx * 2 : win.w;
      let winH = win.shape === 'ellipse' ? win.ry * 2 : win.h;
      zoomControls.style.display = 'flex';
      zoomControls.style.left = (offsetX + (winX + winW / 2) * scaleX) + 'px';
      zoomControls.style.top = (offsetY + (winY + winH / 2) * scaleY) + 'px';
    } else {
      if (zoomControls) zoomControls.style.display = 'none';
    }
  };

  window.onmousemove = (e) => {
    if (!isDraggingPhoto && !isDraggingDeco && !isScalingDeco && !isRotatingDeco) return;
    
    const rect = studioCanvas.getBoundingClientRect();
    const scaleX = studioCanvas.width / rect.width;
    const scaleY = studioCanvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (isRotatingDeco && state.selectedDecoIndex >= 0) {
      const d = state.decorations[state.selectedDecoIndex];
      const cx = d.x + d.hitW * d.scale / 2;
      const cy = d.y + d.hitH * d.scale / 2;
      const currentAngle = Math.atan2(y - cy, x - cx);
      d.rotation = rotateStartValue + (currentAngle - rotateStartAngle);
      hasMoved = true;
      updateDecoControls();
      drawStudioCanvas();
      return;
    }

    if (isScalingDeco && state.selectedDecoIndex >= 0) {
      const d = state.decorations[state.selectedDecoIndex];
      const currentDist = Math.hypot(x - d.x, y - d.y);
      const ratio = currentDist / scaleStartDist;
      d.scale = Math.max(0.1, scaleStartValue * ratio);
      hasMoved = true;
      updateDecoControls();
      drawStudioCanvas();
      return;
    }

    if (isDraggingDeco && state.selectedDecoIndex >= 0) {
      if (!hasMoved) {
        if (Math.hypot(x - dragStartX, y - dragStartY) > 3) hasMoved = true;
        else return;
      }
      const dx = x - dragStartX;
      const dy = y - dragStartY;
      state.decorations[state.selectedDecoIndex].x += dx;
      state.decorations[state.selectedDecoIndex].y += dy;
      dragStartX = x;
      dragStartY = y;
      drawStudioCanvas();
      updateDecoControls();
      return;
    }
    
    if (activeWindowIndex < 0) return;

    if (!hasMoved) {
      if (Math.hypot(x - dragStartX, y - dragStartY) > 3) hasMoved = true;
      else return;
    }

    // Check if cursor has left the source window → enter swap mode
    const srcWin = cfg.windows[_swapSourceIndex];
    const stillInsideSrc = srcWin && hitTestWindow(srcWin, x, y);

    if (!stillInsideSrc && cfg.windows.length > 1) {
      // ── SWAP MODE ──
      _isSwappingPhoto = true;

      // Find which target window (if any) the cursor is over
      let found = -1;
      for (let i = 0; i < cfg.windows.length; i++) {
        if (i === _swapSourceIndex) continue;
        if (hitTestWindow(cfg.windows[i], x, y)) { found = i; break; }
      }
      _swapTargetIndex = found;

      // Move ghost with the actual clientX/clientY stored from the event
      showSwapGhost(e.clientX, e.clientY);
      drawStudioCanvas(); // redraw overlays
      return;
    }

    // ── PAN MODE (cursor still inside source window) ──
    if (_isSwappingPhoto) {
      // Came back inside — exit swap mode
      _isSwappingPhoto = false;
      _swapTargetIndex = -1;
      hideSwapGhost();
    }

    const dx = x - dragStartX;
    const dy = y - dragStartY;
    state.photoTransforms[activeWindowIndex].x += dx;
    state.photoTransforms[activeWindowIndex].y += dy;
    clampPhotoTransform(activeWindowIndex);

    dragStartX = x;
    dragStartY = y;

    drawStudioCanvas();
  };

  window.onmouseup = () => {
    if (isRotatingDeco) {
      isRotatingDeco = false;
      if (hasMoved) saveHistory();
    }
    if (isScalingDeco) {
      isScalingDeco = false;
      if (hasMoved) saveHistory();
    }
    if (isDraggingDeco) {
      isDraggingDeco = false;
      const d = state.decorations[state.selectedDecoIndex];
      if (d) {
        // If dragged completely out of bounds, delete it
        if (d.x > studioCanvas.width || d.x + d.hitW * d.scale < 0 || d.y > studioCanvas.height || d.y + d.hitH * d.scale < 0) {
          state.decorations.splice(state.selectedDecoIndex, 1);
          state.selectedDecoIndex = -1;
          updateDecoControls();
          saveHistory();
        } else if (hasMoved) {
          saveHistory();
        }
      }
      drawStudioCanvas();
    }
    if (isDraggingPhoto) {
      isDraggingPhoto = false;

      if (_isSwappingPhoto && _swapTargetIndex >= 0 && _swapTargetIndex !== _swapSourceIndex) {
        // ── Perform the swap ──
        const a = _swapSourceIndex, b = _swapTargetIndex;
        // Swap image data URLs
        [state.capturedImages[a], state.capturedImages[b]] =
          [state.capturedImages[b], state.capturedImages[a]];
        // Swap pre-loaded HTMLImageElements
        [state.capturedImageElements[a], state.capturedImageElements[b]] =
          [state.capturedImageElements[b], state.capturedImageElements[a]];
        // Swap pan/zoom transforms
        [state.photoTransforms[a], state.photoTransforms[b]] =
          [state.photoTransforms[b], state.photoTransforms[a]];
        saveHistory();
      } else if (hasMoved && !_isSwappingPhoto) {
        saveHistory();
      }

      // Cleanup swap state
      _isSwappingPhoto = false;
      _swapSourceIndex = -1;
      _swapTargetIndex = -1;
      hideSwapGhost();
      drawStudioCanvas();
    }
  };
  
  studioCanvas.onwheel = null; // Disabled for zoom buttons

  document.getElementById('photo-zoom-in').onclick = (e) => {
    e.stopPropagation();
    if (activeWindowIndex >= 0) {
      state.photoTransforms[activeWindowIndex].scale += 0.1;
      clampPhotoTransform(activeWindowIndex);
      drawStudioCanvas();
      saveHistory();
    }
  };
  document.getElementById('photo-zoom-out').onclick = (e) => {
    e.stopPropagation();
    if (activeWindowIndex >= 0) {
      state.photoTransforms[activeWindowIndex].scale -= 0.1;
      clampPhotoTransform(activeWindowIndex);
      drawStudioCanvas();
      saveHistory();
    }
  };

  
  document.getElementById('deco-delete').onclick = (e) => {
    e.stopPropagation();
    if (state.selectedDecoIndex >= 0) {
      state.decorations.splice(state.selectedDecoIndex, 1);
      state.selectedDecoIndex = -1;
      updateDecoControls();
      drawStudioCanvas();
      saveHistory();
    }
  };
  document.getElementById('deco-rotate').onmousedown = (e) => {
    e.stopPropagation();
    if (state.selectedDecoIndex >= 0) {
      isRotatingDeco = true;
      hasMoved = false;
      const d = state.decorations[state.selectedDecoIndex];
      const rect = studioCanvas.getBoundingClientRect();
      const scaleX = studioCanvas.width / rect.width;
      const scaleY = studioCanvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      const cx = d.x + d.hitW * d.scale / 2;
      const cy = d.y + d.hitH * d.scale / 2;
      rotateStartAngle = Math.atan2(y - cy, x - cx);
      rotateStartValue = d.rotation || 0;
    }
  };
  document.getElementById('deco-scale').onmousedown = (e) => {
    e.stopPropagation();
    if (state.selectedDecoIndex >= 0) {
      isScalingDeco = true;
      hasMoved = false;
      const d = state.decorations[state.selectedDecoIndex];
      const rect = studioCanvas.getBoundingClientRect();
      const scaleX = studioCanvas.width / rect.width;
      const scaleY = studioCanvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      scaleStartDist = Math.hypot(x - d.x, y - d.y);
      scaleStartValue = d.scale;
    }
  };

  document.getElementById('phase4-next').onclick = () => goToPhase(4);
  document.getElementById('phase4-back').onclick = () => goToPhase(2);
  document.getElementById('add-text-btn').onclick  = addTextDecoration;
  document.getElementById('undo-btn').onclick      = undo;
  document.getElementById('redo-btn').onclick      = redo;

  // Filter change
  document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.activeFilter = radio.value;
      drawStudioCanvas();
    });
  });

  // iOS Safari bulletproof fallback for label clicks
  document.querySelectorAll('.filter-option').forEach(label => {
    label.addEventListener('click', (e) => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        state.activeFilter = radio.value;
        drawStudioCanvas();
      }
    });
  });

  // Zoom controls
  function updateZoomState() {
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomOutBtn) {
      if (state.stripZoom <= (state.minStripZoom || 0.2) + 0.01) {
        zoomOutBtn.style.opacity = '0.5';
        zoomOutBtn.style.pointerEvents = 'none';
      } else {
        zoomOutBtn.style.opacity = '1';
        zoomOutBtn.style.pointerEvents = 'auto';
      }
    }
  }

  document.getElementById('zoom-in-btn').onclick = () => {
    state.stripZoom = Math.min(state.stripZoom + 0.1, 2.0);
    studioCanvas.style.width = (cfg.stripWidth * state.stripZoom) + 'px';
    studioCanvas.style.height = (cfg.stripHeight * state.stripZoom) + 'px';
    drawStudioCanvas();
    updateDecoControls();
    updateZoomState();
  };
  document.getElementById('zoom-out-btn').onclick = () => {
    state.stripZoom = Math.max(state.stripZoom - 0.1, state.minStripZoom || 0.2);
    studioCanvas.style.width = (cfg.stripWidth * state.stripZoom) + 'px';
    studioCanvas.style.height = (cfg.stripHeight * state.stripZoom) + 'px';
    drawStudioCanvas();
    updateDecoControls();
    updateZoomState();
  };

  updateZoomState();

  // Dynamic text editing
  const textInput = document.getElementById('text-input');
  const textFont = document.getElementById('text-font');
  const customTextColor = document.getElementById('custom-text-color');

  if (textInput) {
    textInput.addEventListener('input', () => {
      if (state.selectedDecoIndex >= 0) {
        const d = state.decorations[state.selectedDecoIndex];
        if (d && d.type === 'text') {
          d.text = textInput.value;
          drawStudioCanvas();
          updateDecoControls();
        }
      }
    });
    textInput.addEventListener('change', () => saveHistory());
  }

  if (textFont) {
    textFont.addEventListener('change', () => {
      if (state.selectedDecoIndex >= 0) {
        const d = state.decorations[state.selectedDecoIndex];
        if (d && d.type === 'text') {
          const font = textFont.value;
          const mappedFont = font === 'cormorant' ? '"Cormorant Garamond", serif' : 
                             font === 'chakra' ? '"Chakra Petch", monospace' : 
                             font === 'roboto' ? '"Roboto", sans-serif' :
                             font === 'oswald' ? '"Oswald", sans-serif' :
                             font === 'pacifico' ? '"Pacifico", cursive' :
                             font === 'dancing' ? '"Dancing Script", cursive' :
                             font === 'playfair' ? '"Playfair Display", serif' :
                             font === 'outfit' ? '"Outfit", sans-serif' :
                             font === 'caveat' ? '"Caveat", cursive' :
                             '"Inter", sans-serif';
          d.font = mappedFont;
          drawStudioCanvas();
          updateDecoControls();
          saveHistory();
        }
      }
    });
  }

  // Text color buttons
  document.querySelectorAll('.text-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Ignore click if it's the custom color picker label
      if (btn.classList.contains('color-picker-btn')) return;

      document.querySelectorAll('.text-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (state.selectedDecoIndex >= 0) {
        const d = state.decorations[state.selectedDecoIndex];
        if (d && d.type === 'text') {
          d.color = btn.dataset.color;
          drawStudioCanvas();
          saveHistory();
        }
      }
    });
  });

  if (customTextColor) {
    customTextColor.addEventListener('input', () => {
      const color = customTextColor.value;
      // Deselect preset buttons
      document.querySelectorAll('.text-color-btn:not(.color-picker-btn)').forEach(b => b.classList.remove('active'));
      customTextColor.parentElement.classList.add('active');

      if (state.selectedDecoIndex >= 0) {
        const d = state.decorations[state.selectedDecoIndex];
        if (d && d.type === 'text') {
          d.color = color;
          drawStudioCanvas();
        }
      }
    });
    customTextColor.addEventListener('change', () => {
      if (state.selectedDecoIndex >= 0) {
        const d = state.decorations[state.selectedDecoIndex];
        if (d && d.type === 'text') {
          saveHistory();
        }
      }
    });
  }

  renderStickerGrid();
  renderStudioStrip();
}

// ─── Swap / window helper functions (module-level) ───────────────────────────

function getSwapGhost() {
  if (!swapGhostEl) {
    swapGhostEl = document.createElement('div');
    swapGhostEl.id = 'swap-ghost';
    swapGhostEl.textContent = '\u21c4';
    swapGhostEl.style.cssText = [
      'position:absolute',
      'pointer-events:none',
      'z-index:100',
      'width:32px',
      'height:32px',
      'border-radius:50%',
      'background:rgba(255,255,255,0.92)',
      'color:#1a1a2e',
      'font-size:16px',
      'font-weight:700',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'box-shadow:0 2px 12px rgba(0,0,0,0.4)',
      'transform:translate(-50%,-50%)',
      'transition:opacity 0.1s'
    ].join(';');
    const wrap = document.getElementById('studio-strip-wrap');
    if (wrap) wrap.appendChild(swapGhostEl);
  }
  return swapGhostEl;
}

function showSwapGhost(clientX, clientY) {
  const ghost = getSwapGhost();
  if (!ghost) return;
  const wrapRect = document.getElementById('studio-strip-wrap').getBoundingClientRect();
  ghost.style.left = (clientX - wrapRect.left) + 'px';
  ghost.style.top  = (clientY - wrapRect.top)  + 'px';
  ghost.style.display = 'flex';
}

function hideSwapGhost() {
  if (swapGhostEl) swapGhostEl.style.display = 'none';
}

function getWindowBounds(win) {
  if (win.shape === 'ellipse') {
    return { x: win.cx - win.rx, y: win.cy - win.ry, w: win.rx * 2, h: win.ry * 2 };
  }
  return { x: win.x, y: win.y, w: win.w, h: win.h };
}

function hitTestWindow(win, cx, cy) {
  const b = getWindowBounds(win);
  return cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h;
}

// Helper: load an Image from a URL and return a Promise<HTMLImageElement>
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (window.location.protocol !== 'file:' && !src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload  = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function renderStudioStrip() {
  const cfg = state.templateConfig;
  if (!cfg) return;

  studioCanvas.width  = cfg.stripWidth;
  studioCanvas.height = cfg.stripHeight;

  studioCanvas.style.width  = (cfg.stripWidth  * state.stripZoom) + 'px';
  studioCanvas.style.height = (cfg.stripHeight * state.stripZoom) + 'px';

  drawStudioCanvas();
  saveHistory();
}

async function drawStudioCanvas() {
  const cfg = state.templateConfig;
  if (!cfg || !studioCtx) return;

  studioCtx.clearRect(0, 0, studioCanvas.width, studioCanvas.height);
  
  // 📷 Step 1: For each window, draw the corresponding photo clipped to that shape
  for (let i = 0; i < cfg.windows.length; i++) {
    const win     = cfg.windows[i];
    const img     = state.capturedImageElements[i];
    const frame   = state.frames[i];
    const t       = state.photoTransforms[i] || {x: 0, y: 0, scale: 1};

    studioCtx.save();

    // Apply rotation if window has one
    if (win.rotation) {
      const cx = win.shape === 'ellipse' ? win.cx : win.x + win.w / 2;
      const cy = win.shape === 'ellipse' ? win.cy : win.y + win.h / 2;
      studioCtx.translate(cx, cy);
      studioCtx.rotate((win.rotation * Math.PI) / 180);
      studioCtx.translate(-cx, -cy);
    }

    // Clip to the window shape
    studioCtx.beginPath();
    if (win.shape === 'ellipse') {
      studioCtx.ellipse(win.cx, win.cy, win.rx, win.ry, 0, 0, Math.PI * 2);
    } else {
      // rect — optionally with rounded corners
      const r = win.radius || 0;
      if (r) {
        studioCtx.roundRect(win.x, win.y, win.w, win.h, r);
      } else {
        studioCtx.rect(win.x, win.y, win.w, win.h);
      }
    }
    studioCtx.clip();

    if (img) {
      let sourceImg = img;
      // Apply CSS filter using an offscreen canvas to bypass iOS Safari clip+filter bug
      if (state.activeFilter && FILTERS[state.activeFilter]) {
        const off = document.createElement('canvas');
        const imgW = img.naturalWidth || img.width || 800;
        const imgH = img.naturalHeight || img.height || 1200;
        off.width = imgW;
        off.height = imgH;
        const oCtx = off.getContext('2d');
        oCtx.filter = FILTERS[state.activeFilter];
        oCtx.drawImage(img, 0, 0, imgW, imgH);
        oCtx.filter = 'none';
        sourceImg = off;
      }

      let winX, winY, winW, winH;
      if (win.shape === 'ellipse') {
        winX = win.cx - win.rx; winY = win.cy - win.ry;
        winW = win.rx * 2;      winH = win.ry * 2;
      } else {
        winX = win.x; winY = win.y; winW = win.w; winH = win.h;
      }
      
      const minScale = Math.max(winW / img.width, winH / img.height);
      const scale = minScale * t.scale;
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = winX + (winW - dw) / 2 + t.x;
      const dy = winY + (winH - dh) / 2 + t.y;

      studioCtx.drawImage(sourceImg, dx, dy, dw, dh);
    } else {
      drawWindowPlaceholder(studioCtx, win, frame);
    }

    studioCtx.restore();
  }

  // Step 2: Draw frame image on top
  if (frameImage) {
    studioCtx.save();
    studioCtx.globalCompositeOperation = 'source-over';
    studioCtx.drawImage(frameImage, 0, 0, studioCanvas.width, studioCanvas.height);
    studioCtx.restore();
  }

  // Step 2b: Swap-mode overlays (source dim + target highlight)
  if (_isSwappingPhoto) {
    const drawWinPath = (win) => {
      studioCtx.beginPath();
      if (win.shape === 'ellipse') {
        studioCtx.ellipse(win.cx, win.cy, win.rx, win.ry, 0, 0, Math.PI * 2);
      } else {
        studioCtx.rect(win.x, win.y, win.w, win.h);
      }
    };

    // Dim source window
    if (_swapSourceIndex >= 0 && cfg.windows[_swapSourceIndex]) {
      studioCtx.save();
      drawWinPath(cfg.windows[_swapSourceIndex]);
      studioCtx.fillStyle = 'rgba(0, 0, 0, 0.40)';
      studioCtx.fill();
      studioCtx.restore();
    }

    // Highlight target window
    if (_swapTargetIndex >= 0 && cfg.windows[_swapTargetIndex]) {
      studioCtx.save();
      drawWinPath(cfg.windows[_swapTargetIndex]);
      studioCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      studioCtx.lineWidth = 4;
      studioCtx.setLineDash([12, 8]);
      studioCtx.stroke();
      studioCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      studioCtx.fill();
      studioCtx.setLineDash([]);
      studioCtx.restore();
    }
  }

  // Step 3: Draw decorations
  for (let i = 0; i < state.decorations.length; i++) {
    const d = state.decorations[i];
    studioCtx.save();
    
    const cx = d.x + d.hitW * d.scale / 2;
    const cy = d.y + d.hitH * d.scale / 2;
    studioCtx.translate(cx, cy);
    if (d.rotation) studioCtx.rotate(d.rotation);
    studioCtx.scale(d.scale, d.scale);
    
    if (d.type === 'sticker' && d.img) {
      studioCtx.drawImage(d.img, -d.w / 2, -d.h / 2, d.w, d.h);
      if (!d.hitW) { d.hitW = d.w; d.hitH = d.h; }
    } else if (d.type === 'text') {
      studioCtx.font = `${d.size}px ${d.font}`;
      studioCtx.fillStyle = d.color;
      studioCtx.textBaseline = 'top';
      studioCtx.shadowColor = 'rgba(0,0,0,0.8)';
      studioCtx.shadowBlur = 8;
      studioCtx.shadowOffsetY = 2;
      studioCtx.fillText(d.text, -d.hitW / 2, -d.hitH / 2);
      const metrics = studioCtx.measureText(d.text);
      d.hitW = metrics.width;
      d.hitH = d.size;
    }
    
    // Draw bounding box if selected
    if (i === state.selectedDecoIndex) {
      studioCtx.shadowColor = 'transparent';
      studioCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      studioCtx.lineWidth = 2 / d.scale;
      studioCtx.setLineDash([5 / d.scale, 5 / d.scale]);
      studioCtx.strokeRect(-d.hitW / 2 - 2, -d.hitH / 2 - 2, d.hitW + 4, d.hitH + 4);
    }
    studioCtx.restore();
  }

}

// Draw a placeholder inside a window when no photo is captured yet
function drawWindowPlaceholder(ctx, win, frame) {
  let cx, cy;
  if (win.shape === 'ellipse') {
    ctx.fillStyle = '#12122B';
    ctx.ellipse(win.cx, win.cy, win.rx, win.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    cx = win.cx; cy = win.cy;
  } else {
    ctx.fillStyle = '#12122B';
    ctx.fillRect(win.x, win.y, win.w, win.h);
    cx = win.x + win.w / 2; cy = win.y + win.h / 2;
  }

  if (frame && frame.chars.length > 0) {
    const charData = CHARACTERS[frame.chars[0]];
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, (win.rx || win.w / 2));
    grad.addColorStop(0, charData.color + '44');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    if (win.shape === 'ellipse') {
      ctx.beginPath();
      ctx.ellipse(win.cx, win.cy, win.rx, win.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(win.x, win.y, win.w, win.h);
    }
  }

  // "Add photo" icon text
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = `14px "Chakra Petch", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAP TO SHOOT', cx, cy);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawCharOverlaysOnCanvas(frame, fx, fy, fw, fh) {
  if (!frame.chars.length) return;

  const charCount = frame.chars.length;
  const charW = fw / charCount;
  const charH = fh * 0.8;

  frame.chars.forEach((char, ci) => {
    const charData = CHARACTERS[char];
    const cx = fx + charW * ci;
    const cy = fy + (fh - charH);

    const grad = studioCtx.createLinearGradient(cx, cy, cx + charW, cy + charH);
    grad.addColorStop(0, charData.color + 'CC');
    grad.addColorStop(1, charData.color + '22');

    // Rounded silhouette
    studioCtx.fillStyle = grad;
    studioCtx.beginPath();
    studioCtx.roundRect(cx + 4, cy, charW - 8, charH, 8);
    studioCtx.fill();

    // Head circle
    const headR = charW * 0.2;
    studioCtx.fillStyle = charData.color + 'AA';
    studioCtx.beginPath();
    studioCtx.arc(cx + charW / 2, cy + headR + 6, headR, 0, Math.PI * 2);
    studioCtx.fill();

    // Name label
    studioCtx.fillStyle = 'rgba(0,0,0,0.6)';
    studioCtx.fillRect(cx + 2, fy + fh - 22, charW - 4, 20);
    studioCtx.fillStyle = charData.color;
    studioCtx.font = `bold ${Math.max(9, charW * 0.12)}px "Chakra Petch", monospace`;
    studioCtx.textAlign = 'center';
    studioCtx.fillText(charData.name.toUpperCase(), cx + charW / 2, fy + fh - 8);
    studioCtx.textAlign = 'left';
  });
}

// ============================================================
// STICKERS
// ============================================================

function renderStickerGrid() {
  const container = document.getElementById('sticker-grid');
  container.innerHTML = '';
  container.style.display = 'block';

  if (!window.STICKERS_DATA) return;

  const categoryOrder = [
    'lads', 'xavier', 'zayne', 'rafayel', 'sylus', 'caleb', 'valko',
    'kid', 'snowman', 'birb', 'crow', 'apple', 'cat', 'bear', 'duck', 'puppy',
    'green & pink', 'red', 'cottagecore', 'junk journal', 'kawaii', 'kawaii café',
    'valentine', 'vintage', 'washi tape'
  ];

  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'mobile-sticker-layout';
  const desktopContainer = document.createElement('div');
  desktopContainer.className = 'desktop-sticker-layout';

  // --- Mobile Rendering ---
  const nav = document.createElement('div');
  nav.className = 'sticker-nav';
  
  const content = document.createElement('div');
  content.className = 'sticker-scroll-content';
  
  let activeBtn = null;

  const renderContent = (category) => {
    content.innerHTML = '';
    const stickers = window.STICKERS_DATA[category];
    if (!stickers) return;
    stickers.forEach(stickerPath => {
      const btn = document.createElement('button');
      btn.className = 'sticker-btn';
      btn.style.cssText = 'background: transparent; border: none; padding: 4px; cursor: pointer; transition: transform 0.2s;';
      const img = document.createElement('img');
      img.src = stickerPath;
      img.draggable = false;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; pointer-events: none;';
      btn.appendChild(img);
      
      btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
      btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
      btn.addEventListener('click', () => addSticker(stickerPath));
      content.appendChild(btn);
    });
  };

  categoryOrder.forEach((category, i) => {
    const stickers = window.STICKERS_DATA[category];
    if (!stickers || stickers.length === 0) return;
    
    const btn = document.createElement('button');
    btn.className = 'sticker-nav-btn' + (i === 0 ? ' active' : '');
    btn.textContent = category;
    
    if (i === 0) activeBtn = btn;
    
    btn.addEventListener('click', () => {
      if (activeBtn) activeBtn.classList.remove('active');
      btn.classList.add('active');
      activeBtn = btn;
      renderContent(category);
    });
    
    nav.appendChild(btn);
  });

  mobileContainer.appendChild(nav);
  mobileContainer.appendChild(content);

  if (categoryOrder.length > 0) {
    renderContent(categoryOrder[0]);
  }

  // --- Desktop Rendering ---
  categoryOrder.forEach(category => {
    const stickers = window.STICKERS_DATA[category];
    if (!stickers || stickers.length === 0) return;

    const group = document.createElement('div');
    group.className = 'sticker-group';
    group.style.marginBottom = '8px';

    const header = document.createElement('div');
    header.className = 'sticker-group-header';
    header.textContent = category;
    header.style.cssText = 'padding: 8px 12px; background: rgba(200,184,122,0.1); border-radius: 6px; cursor: pointer; font-family: "Chakra Petch", monospace; font-size: 0.75rem; text-transform: uppercase; color: #C8B87A; font-weight: 700; user-select: none;';
    
    const groupContent = document.createElement('div');
    groupContent.className = 'sticker-group-content';
    groupContent.style.cssText = 'display: none; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 8px 0;';
    
    header.addEventListener('click', () => {
      const isHidden = groupContent.style.display === 'none';
      groupContent.style.display = isHidden ? 'grid' : 'none';
    });

    stickers.forEach(stickerPath => {
      const btn = document.createElement('button');
      btn.className = 'sticker-btn';
      const img = document.createElement('img');
      img.src = stickerPath;
      img.draggable = false;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; pointer-events: none;';
      btn.appendChild(img);
      btn.addEventListener('click', () => addSticker(stickerPath));
      groupContent.appendChild(btn);
    });

    group.appendChild(header);
    group.appendChild(groupContent);
    desktopContainer.appendChild(group);
  });

  container.appendChild(mobileContainer);
  container.appendChild(desktopContainer);
}

let isAddingSticker = false;
function addSticker(stickerPath) {
  if (isAddingSticker) return;
  isAddingSticker = true;
  const img = new Image();
  img.src = stickerPath;
  img.onload = () => {
    isAddingSticker = false;
    state.decorations.push({
      type: 'sticker',
      img: img,
      src: stickerPath,
      x: studioCanvas.width / 2 - 120,
      y: studioCanvas.height / 2 - 120,
      w: 240,
      h: 240 * (img.height / img.width),
      scale: 1,
      hitW: 240,
      hitH: 240 * (img.height / img.width)
    });
    state.selectedDecoIndex = state.decorations.length - 1;
    saveHistory();
    drawStudioCanvas();
    updateDecoControls();
  };
  img.onerror = () => {
    isAddingSticker = false;
  };
}

// ============================================================
// TEXT DECORATIONS
// ============================================================

function addTextDecoration() {
  const input    = document.getElementById('text-input');
  const fontSel  = document.getElementById('text-font');
  const colorBtn = document.querySelector('.text-color-btn.active');

  const text  = input.value.trim();
  if (!text) return;

  const font  = fontSel.value;
  const size  = 60; // Hardcoded since slider is removed
  const color = colorBtn ? colorBtn.dataset.color : '#FFFFFF';

  const mappedFont = font === 'cormorant' ? '"Cormorant Garamond", serif' : 
                     font === 'chakra' ? '"Chakra Petch", monospace' : 
                     font === 'roboto' ? '"Roboto", sans-serif' :
                     font === 'oswald' ? '"Oswald", sans-serif' :
                     font === 'pacifico' ? '"Pacifico", cursive' :
                     font === 'dancing' ? '"Dancing Script", cursive' :
                     font === 'playfair' ? '"Playfair Display", serif' :
                     font === 'outfit' ? '"Outfit", sans-serif' :
                     font === 'caveat' ? '"Caveat", cursive' :
                     '"Inter", sans-serif';

  state.decorations.push({
    type: 'text',
    text: text,
    font: mappedFont,
    color: color,
    size: size,
    x: studioCanvas.width / 2 - 50,
    y: studioCanvas.height / 2 - 25,
    scale: 1,
    w: 0,
    h: 0,
    hitW: 0,
    hitH: 0
  });
  
  state.selectedDecoIndex = state.decorations.length - 1;
  input.value = '';
  
  saveHistory();
  drawStudioCanvas();
  updateDecoControls();
}

// ============================================================
// TABS (Phase 4)
// ============================================================

function initTabs() {
  const tabs   = document.querySelectorAll('.studio-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.style.display = 'block';
    });
  });
}

// ============================================================
// UNDO / REDO
// ============================================================

function saveHistory() {
  const snapshot = {
    decorations:      state.decorations.map(d => ({ ...d })),
    capturedImages:   [...state.capturedImages],
    photoTransforms:  state.photoTransforms ? state.photoTransforms.map(t => ({ ...t })) : [],
    selectedDecoIndex: state.selectedDecoIndex
  };
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snapshot);
  state.historyIndex++;
  updateHistoryBtns();
}

function undo() {
  if (state.historyIndex <= 0) return;
  state.historyIndex--;
  restoreHistory();
}

function redo() {
  if (state.historyIndex >= state.history.length - 1) return;
  state.historyIndex++;
  restoreHistory();
}

function restoreHistory() {
  const snap = state.history[state.historyIndex];
  // Deep clone decorations and ensure images are loaded
  state.decorations = snap.decorations.map(d => {
    if (d.type === 'sticker') {
      const img = new Image();
      img.src = d.src;
      return { ...d, img: img }; // img will load synchronously if cached, or asynchronously
    }
    return { ...d };
  });
  state.capturedImages = [...snap.capturedImages];
  if (snap.photoTransforms) {
    state.photoTransforms = snap.photoTransforms.map(t => ({ ...t }));
  }

  // Re-load image elements to match the (possibly swapped) capturedImages order
  const reloadImages = async () => {
    for (let i = 0; i < state.capturedImages.length; i++) {
      if (state.capturedImages[i]) {
        try {
          state.capturedImageElements[i] = await loadImage(state.capturedImages[i]);
        } catch (_) {
          state.capturedImageElements[i] = null;
        }
      } else {
        state.capturedImageElements[i] = null;
      }
    }
    drawStudioCanvas();
    state.selectedDecoIndex = snap.selectedDecoIndex !== undefined ? snap.selectedDecoIndex : -1;
    updateDecoControls();
  };
  reloadImages();

  updateHistoryBtns();
}

function updateHistoryBtns() {
  document.getElementById('undo-btn').disabled = state.historyIndex <= 0;
  document.getElementById('redo-btn').disabled = state.historyIndex >= state.history.length - 1;
}

// ============================================================
// PHASE 5 — EXPORT
// ============================================================

function initPhase4() {
  // Copy studio canvas to export canvas
  const exportCanvas = document.getElementById('export-canvas');
  const exportCtx    = exportCanvas.getContext('2d');

  exportCanvas.width  = studioCanvas.width;
  exportCanvas.height = studioCanvas.height;

  // Scale for display inside the printer strip-clip-window
  const is6x4 = state.templateConfig && state.templateConfig.stripType === '6x4 Strip';
  const isMobile = window.innerWidth <= 767;
  const maxDisplayW = isMobile ? 140 : (is6x4 ? 280 : 140);

  const printerWrap = document.querySelector('.export-printer-wrap');
  if (printerWrap) {
    if (is6x4 && !isMobile) printerWrap.classList.add('printer-6x4');
    else printerWrap.classList.remove('printer-6x4');
  }

  const dispScale = Math.min(1, maxDisplayW / studioCanvas.width);
  exportCanvas.style.width  = (studioCanvas.width * dispScale) + 'px';
  exportCanvas.style.height = (studioCanvas.height * dispScale) + 'px';

  // Dynamically set the printer tray height to match the aspect-ratio of the strip
  const trayH = Math.round(studioCanvas.height * dispScale);
  const stripOutput = document.querySelector('.export-printer-wrap .strip-clip-window');
  if (stripOutput) stripOutput.style.setProperty('--strip-tray-h', trayH + 'px');

  // Clear any active sticker selection before exporting so the dashed border doesn't show
  state.selectedDecoIndex = -1;
  renderStudioStrip();

  // Composite: studio canvas + any DOM decorations
  exportCtx.drawImage(studioCanvas, 0, 0);

  // Draw DOM overlay elements onto the export canvas
  const overlayItems = document.querySelectorAll('#overlay-layer > *');
  overlayItems.forEach(item => {
    const rect      = item.getBoundingClientRect();
    const stripRect = document.querySelector('.studio-strip-wrap').getBoundingClientRect();
    const relX = rect.left - stripRect.left;
    const relY = rect.top  - stripRect.top;

    const displayW = parseFloat(studioCanvas.style.width);
    const pxScale  = studioCanvas.width / displayW;

    const cx = relX * pxScale;
    const cy = relY * pxScale;

    const text = item.textContent;
    if (!text) return;

    const fontSize = parseFloat(getComputedStyle(item).fontSize) * pxScale;
    const color    = getComputedStyle(item).color;
    const fontFam  = getComputedStyle(item).fontFamily;

    exportCtx.font      = `${fontSize}px ${fontFam}`;
    exportCtx.fillStyle = color;
    exportCtx.textBaseline = 'top';
    exportCtx.shadowColor   = 'rgba(0,0,0,0.8)';
    exportCtx.shadowBlur    = 8;
    exportCtx.fillText(text, cx, cy);
    exportCtx.shadowBlur = 0;
  });

  // Re-trigger the strip emerge animation
  const stripAnimate = document.getElementById('export-strip-animate');
  if (stripAnimate) {
    stripAnimate.style.animation = 'none';
    void stripAnimate.offsetHeight;
    stripAnimate.style.animation = '';
  }

  // === 1. Download — immediate, no overlay ===
  document.getElementById('download-strip').onclick = () => downloadStrip(exportCanvas);

  // === 2. Print — open browser print dialog directly ===
  document.getElementById('print-strip').onclick = () => {
    const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 1000);
      }, 500); // Give image a moment to render
    };
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><title>Cosmo Photostrip</title><style>@page { margin: 0; size: auto; } body { margin: 0; padding-top: 1cm; text-align: center; background: white; overflow: hidden; } img { height: 6in; width: auto; max-width: 100%; display: block; margin: 0 auto; border: 1px solid black; box-sizing: border-box; }</style></head><body><img src="${dataUrl}" /></body></html>`);
    doc.close();
  };

// 3. Share (Native Web Share API)
  document.getElementById('share-strip').onclick = async () => {
    const btn = document.getElementById('share-strip');
    const originalContent = btn.innerHTML;

    try {
      btn.innerHTML = 'Preparing...';
      btn.style.pointerEvents = 'none';

      const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'cosmo-photostrip.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Cosmo Photostrip',
          text: '#ValkoIsLoved #BringValkoBack — My Cosmo Photostrip'
        });
      } else {
        // Fallback for browsers that don't support file sharing
        showToast("Sharing is not supported on your browser. Please download the strip instead.");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        showToast('Sharing cancelled or failed.');
      }
    } finally {
      btn.innerHTML = originalContent;
      btn.style.pointerEvents = 'auto';
    }
  };

  // 4. Enter Photobooth Again
  document.getElementById('print-again').onclick = resetBooth;

  // 5. Hashtag copy block
  const hashtagBtn = document.getElementById('hashtag-copy-btn');
  if (hashtagBtn) {
    hashtagBtn.onclick = async () => {
      const text = document.getElementById('hashtag-copy-text').textContent;
      try {
        await navigator.clipboard.writeText(text);
        const icon = hashtagBtn.querySelector('.hashtag-copy-icon');
        hashtagBtn.style.borderColor = '#4ade80';
        hashtagBtn.style.color = '#4ade80';
        if (icon) icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
          hashtagBtn.style.borderColor = '';
          hashtagBtn.style.color = '';
          if (icon) icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        }, 2000);
      } catch (e) {
        showToast('Could not copy — please copy manually.');
      }
    };
  }
}

function showPrintingOverlay() {
  const overlay = document.getElementById('printing-overlay');
  const video   = document.getElementById('printing-video');
  const progress = document.getElementById('print-progress');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  if (video) { video.currentTime = 0; video.play().catch(() => {}); }
  if (progress) {
    progress.style.width = '0%';
    requestAnimationFrame(() => { progress.style.width = '100%'; });
  }
}

function hidePrintingOverlay() {
  const overlay = document.getElementById('printing-overlay');
  const video   = document.getElementById('printing-video');
  if (overlay) overlay.classList.add('hidden');
  if (video) video.pause();
}

function showToast(msg) {
  let toast = document.getElementById('booth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'booth-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(20,16,40,0.95);border:1px solid rgba(200,184,122,0.4);color:#C8B87A;font-family:"Chakra Petch",monospace;font-size:0.8rem;letter-spacing:0.05em;padding:10px 20px;border-radius:999px;z-index:10000;transition:opacity 0.3s ease;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.style.opacity = '0', 2800);
}

function downloadStrip(canvas) {
  try {
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'cosmo-photobooth.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    alert("Download error: " + e.message);
  }
}


function resetBooth() {
  // Stop camera if running
  stopCamera();

  // Reset state
  state.layout         = null;
  state.frameTemplate  = null;
  state.frames         = [];
  state.currentFrame   = 0;
  state.capturedImages = [];
  state.activeFilter   = 'none';
  state.decorations    = [];
    state.selectedDecoIndex = -1;
  state.history        = [];
  state.historyIndex   = -1;
  state.selectedSbFrame = null;

  // Reset Phase 1 form
  state.templateConfig = null;
  document.querySelectorAll('input[name="layout"]').forEach(r => r.checked = false);
  document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
  updatePhase1Next();

  // Reset filter
  const noneFilter = document.getElementById('filter-none');
  if (noneFilter) noneFilter.checked = true;

  // Clear overlay layer
  const overlay = document.getElementById('overlay-layer');
  if (overlay) overlay.innerHTML = '';

  goToPhase(1);
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Phase 1 (active by default)
  initPhase1();

  // Warn before leaving if in progress
  window.addEventListener('beforeunload', (e) => {
    if (state.phase > 1) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Handle booth back link
  document.getElementById('booth-back')?.addEventListener('click', (e) => {
    if (state.phase > 1) {
      if (!confirm('Leave the booth? Your current session will be lost.')) {
        e.preventDefault();
      } else {
        stopCamera();
      }
    }
  });

  // Background Music
  const bgMusic = document.getElementById('bg-music');
  const bgmToggle = document.getElementById('bgm-toggle');

  if (bgMusic && bgmToggle) {
    bgMusic.volume = 0.4;

    // AudioBridge handles track detection, position restore, and autoplay.
    // Same track as photobooth/index.html → continues from saved position.
    AudioBridge.initBtn(bgMusic, bgmToggle);

    bgmToggle.addEventListener('click', () => {
      AudioBridge.toggleBtn(bgMusic, bgmToggle);
    });
  }
});



function makeDraggable(el, bounds) {
  let startX, startY, origX, origY;
  let isDragging = false;
  let isResizing = false;
  let startScale = 1.0;
  
  // For pinch-to-zoom
  let initialDist = null;
  let initialScale = 1.0;
  
  const getXY = (e) => {
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX, y: src.clientY };
  };
  
  const getDist = (touches) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };
  
  el.addEventListener('mousedown', dragStart);
  el.addEventListener('touchstart', dragStart, { passive: false });
  
  function dragStart(e) {
    if (e.target.classList.contains('resize-handle')) {
      isResizing = true;
      const match = el.style.transform.match(/scale\(([^)]+)\)/);
      startScale = match ? parseFloat(match[1]) : 1.0;
    } else if (e.touches && e.touches.length === 2) {
      initialDist = getDist(e.touches);
      const match = el.style.transform.match(/scale\(([^)]+)\)/);
      initialScale = match ? parseFloat(match[1]) : 1.0;
      isDragging = false;
    } else {
      isDragging = true;
    }
    
    if (isDragging || isResizing) {
      e.preventDefault();
      const pos = getXY(e);
      startX = pos.x;
      startY = pos.y;
      origX = parseFloat(el.style.left) || 0;
      origY = parseFloat(el.style.bottom) || 0; // It uses bottom initially
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }
  
  function drag(e) {
    if (e.touches && e.touches.length === 2 && initialDist) {
      e.preventDefault();
      const dist = getDist(e.touches);
      const scale = initialScale * (dist / initialDist);
      el.style.transform = `scale(${Math.max(0.1, scale)})`;
      return;
    }
    
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    
    const pos = getXY(e);
    const dx = pos.x - startX;
    const dy = pos.y - startY;
    
    if (isResizing) {
      const scale = startScale + (dx - dy) * 0.01;
      el.style.transform = `scale(${Math.max(0.1, scale)})`;
    } else if (isDragging) {
      el.style.left = (origX + dx) + 'px';
      // moving up (negative dy) increases bottom
      el.style.bottom = (origY - dy) + 'px';
    }
  }
  
  function dragEnd() {
    isDragging = false;
    isResizing = false;
    initialDist = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
    // Triggers camera feed update because overlay positions changed
    // We can rely on the continuous requestAnimationFrame loop in updateCameraFeed
    // Actually, drawCharOverlaysToContext is called inside updateCameraFeed which is a loop!
  }
}

// Re-render shoot side panel on resize to handle mobile <-> desktop structure changes
window.addEventListener('resize', () => {
  if (state.phase === 2) {
    const isMobile = window.innerWidth <= 767;
    if (state.lastIsMobile !== isMobile) {
      state.lastIsMobile = isMobile;
      renderShootSidePanel(state.currentFrame);
    }
  }
});

// ============================================================
// AUDIO VISIBILITY PAUSE/RESUME
// ============================================================
document.addEventListener('visibilitychange', () => {
  const bgm = document.getElementById('bg-music');
  const bgmToggle = document.getElementById('bgm-toggle');
  
  if (bgm) {
    if (document.hidden) {
      bgm.pause();
    } else {
      // Only resume if it wasn't manually paused by the user
      if (!bgmToggle || bgmToggle.getAttribute('aria-pressed') !== 'false') {
        bgm.play().catch(err => {
          console.warn('Audio resume prevented by browser policy:', err);
        });
      }
    }
  }
});

// ============================================================
// AUDIO CUES
// ============================================================
const initAudioCues = () => {
  // Check if we need to resume the gold SFX from landing page
  const goldStartStr = sessionStorage.getItem('gold_sfx_start');
  if (goldStartStr) {
    sessionStorage.removeItem('gold_sfx_start');
    const goldStart = parseInt(goldStartStr, 10);
    const elapsed = (Date.now() - goldStart) / 1000;
    
    if (elapsed < 5) {
      const goldSfx = new Audio('assets/audio-cue/open_wish_gold_cue.mp3');
      goldSfx.volume = 0.6;
      goldSfx.currentTime = elapsed;
      goldSfx.play().catch(()=>{});
    }
  }
};

document.addEventListener('DOMContentLoaded', initAudioCues);
