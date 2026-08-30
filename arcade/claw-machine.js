/* ═══════════════════════════════════════════════════════════════
   COSMO CLAW — Claw Machine Game Logic
   
   State machine: IDLE → MOVING → DROPPING → GRIPPING → RISING → RESULT
   3D movement: X (left/right) + Z (forward/back) via CSS transforms
   Weekly limits: 3 rounds/week, 5 attempts/round (localStorage)
   Collection: 6 chars × 2 designs × 4 color variants (unlocked at 3/6/9)
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── CONSTANTS ─────────────────────────────────────────────────
  const MAX_ROUNDS_PER_WEEK = 5;
  const ATTEMPTS_PER_ROUND  = 5;
  const STORAGE_KEY = 'cm_state_v1';
  const MONDAY_MS   = 7 * 24 * 60 * 60 * 1000; // 1 week

  // Character color palettes (for placeholder blobs)
  const CHARACTERS = {
    xavier:  { label: 'Xavier',  colors: ['#5b8cde', '#3a6abf', '#82aae8', '#c4d8f8'] },
    zayne:   { label: 'Zayne',   colors: ['#b0c8f0', '#6a9ad4', '#d0e4fa', '#e8f0fb'] },
    rafayel: { label: 'Rafayel', colors: ['#c97bbf', '#a04d96', '#e4a8d8', '#f5d4ee'] },
    sylus:   { label: 'Sylus',   colors: ['#6b4c8e', '#4a3070', '#9b7dc8', '#c8b4e8'] },
    caleb:   { label: 'Caleb',   colors: ['#e8b84b', '#c49030', '#f0d080', '#faecc4'] },
    valko:   { label: 'Valko',   colors: ['#7ec8a0', '#4a9a70', '#a8e0bc', '#d4f0e0'] },
  };

  const CHAR_KEYS = Object.keys(CHARACTERS);

  // 2 plushie designs per character (just emoji + shape for placeholder)
  const PLUSHIE_DESIGNS = {
    xavier:  [
      { label: 'Bunbun', images: ['../assets/ui/arcade/claw-machine/collection/xavier/bunbun/bunbun.webp', '../assets/ui/arcade/claw-machine/collection/xavier/bunbun/teabun.webp', '../assets/ui/arcade/claw-machine/collection/xavier/bunbun/pinkbun.webp', '../assets/ui/arcade/claw-machine/collection/xavier/bunbun/blackbun.webp'] },
      { label: 'Kid', images: ['../assets/ui/arcade/claw-machine/collection/xavier/kid/galaxy kid.webp', '../assets/ui/arcade/claw-machine/collection/xavier/kid/gummy candy kid.webp', '../assets/ui/arcade/claw-machine/collection/xavier/kid/deepsea kid.webp', '../assets/ui/arcade/claw-machine/collection/xavier/kid/spring kid.webp'] }
    ],
    zayne:   [
      { label: 'Snowman', images: ['../assets/ui/arcade/claw-machine/collection/zayne/snowman/happy snowman.webp', '../assets/ui/arcade/claw-machine/collection/zayne/snowman/warm snowman.webp', '../assets/ui/arcade/claw-machine/collection/zayne/snowman/matcha snowman.webp', '../assets/ui/arcade/claw-machine/collection/zayne/snowman/spring snowman.webp'] },
      { label: 'Penguin', images: ['../assets/ui/arcade/claw-machine/collection/zayne/penguin/astro penguin.webp', '../assets/ui/arcade/claw-machine/collection/zayne/penguin/energetic penguin.webp', '../assets/ui/arcade/claw-machine/collection/zayne/penguin/spacewalker penguin.webp', '../assets/ui/arcade/claw-machine/collection/zayne/penguin/special agent penguin.webp'] }
    ],
    rafayel: [
      { label: 'Fish', images: ['../assets/ui/arcade/claw-machine/collection/rafayel/fish/boing fish.webp', '../assets/ui/arcade/claw-machine/collection/rafayel/fish/edgy fish.webp', '../assets/ui/arcade/claw-machine/collection/rafayel/fish/party fish.webp', '../assets/ui/arcade/claw-machine/collection/rafayel/fish/gemstone fish.webp'] },
      { label: 'Birb', images: ['../assets/ui/arcade/claw-machine/collection/rafayel/birb/artsy birb.webp', '../assets/ui/arcade/claw-machine/collection/rafayel/birb/milky birb.webp', '../assets/ui/arcade/claw-machine/collection/rafayel/birb/sooty birb.webp', '../assets/ui/arcade/claw-machine/collection/rafayel/birb/peach blossom birb.webp'] }
    ],
    sylus:   [
      { label: 'Crow', images: ['../assets/ui/arcade/claw-machine/collection/sylus/crow/grumpy crow.webp', '../assets/ui/arcade/claw-machine/collection/sylus/crow/snowfield crow.webp', '../assets/ui/arcade/claw-machine/collection/sylus/crow/blue crow.webp', '../assets/ui/arcade/claw-machine/collection/sylus/crow/headache crow.webp'] },
      { label: 'Dino', images: ['../assets/ui/arcade/claw-machine/collection/sylus/dino/smiley dino.webp', '../assets/ui/arcade/claw-machine/collection/sylus/dino/sunny dino.webp', '../assets/ui/arcade/claw-machine/collection/sylus/dino/azure dino.webp', '../assets/ui/arcade/claw-machine/collection/sylus/dino/grape dino.webp'] }
    ],
    caleb:   [
      { label: 'Plane', images: ['../assets/ui/arcade/claw-machine/collection/caleb/plane/azure plane.webp', '../assets/ui/arcade/claw-machine/collection/caleb/plane/kiddie plane.webp', '../assets/ui/arcade/claw-machine/collection/caleb/plane/melony plane.webp', '../assets/ui/arcade/claw-machine/collection/caleb/plane/banana plane.webp'] },
      { label: 'Apple', images: ['../assets/ui/arcade/claw-machine/collection/caleb/apple/sunny apple.webp', '../assets/ui/arcade/claw-machine/collection/caleb/apple/jolly apple.webp', '../assets/ui/arcade/claw-machine/collection/caleb/apple/celestial apple.webp', '../assets/ui/arcade/claw-machine/collection/caleb/apple/gilded apple.webp'] }
    ],
    valko:   [
      { label: 'Wolfie', images: ['../assets/ui/arcade/claw-machine/collection/valko/wolfie/no. 1 wolfie.webp', '../assets/ui/arcade/claw-machine/collection/valko/wolfie/choco wolfie.webp', '../assets/ui/arcade/claw-machine/collection/valko/wolfie/red wolfie.webp', '../assets/ui/arcade/claw-machine/collection/valko/wolfie/greyish wolfie.webp'] },
      { label: 'Hootie', images: ['../assets/ui/arcade/claw-machine/collection/valko/hootie/sleepless hootie.webp', '../assets/ui/arcade/claw-machine/collection/valko/hootie/cherry hootie.webp', '../assets/ui/arcade/claw-machine/collection/valko/hootie/mocha hootie.webp', '../assets/ui/arcade/claw-machine/collection/valko/hootie/serious hootie.webp'] }
    ],
  };

  // Unlock thresholds (# of plushies of that character)
  const UNLOCK_THRESHOLDS = [0, 3, 6, 9];

  // Claw prong paths: open vs closed states
  const CLAW_PRONGS = {
    open: {
      l: 'M24 12 Q10 25 8 44 Q6 48 10 46 Q14 44 22 30',
      c: 'M30 12 L30 40 Q30 46 30 48 Q30 50 30 48',
      r: 'M36 12 Q50 25 52 44 Q54 48 50 46 Q46 44 38 30',
    },
    closed: {
      l: 'M24 12 Q22 22 20 35 Q19 40 22 42 Q26 44 28 38',
      c: 'M30 12 L30 35 Q30 42 30 44 Q30 46 30 44',
      r: 'M36 12 Q38 22 40 35 Q41 40 38 42 Q34 44 32 38',
    },
  };

  // ── STATE ──────────────────────────────────────────────────────
  let state = 'INTRO'; // INTRO | IDLE | DROPPING | GRIPPING | RISING | WIN | MISS | ROUND_OVER | WEEKLY_LIMIT
  let paused = false;
  let railX = 50;   // percentage across the track (0–100)
  let armHeight = 60; // px, how far the arm extends downward
  const MIN_ARM = 40;
  const MAX_ARM = 220; // max drop before grip attempt
  let catchedPlushie = null;
  let roundCaught = 0;

  // plushies in the bin: array of { char, designIdx, colorIdx, el, body, grabbed }
  let binPlushies = [];

  // ── MATTER.JS PHYSICS ──────────────────────────────────────────
  const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Events = Matter.Events;

  let engine, world, runner;
  let ground, leftWall, rightWall;

  const PHYS_W = 1000;
  const PHYS_H = 1464;
  const PLUSHIE_RADIUS = 57;

  // ── WEEKLY TRACKING ────────────────────────────────────────────
  function getStorage() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  }
  function saveStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun
    const diff = (day === 0) ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function getWeeklyState() {
    const data = getStorage();
    const thisMonday = getMonday(Date.now());
    if (!data.weekStart || data.weekStart < thisMonday || (data.roundsLeft !== undefined && data.roundsLeft > MAX_ROUNDS_PER_WEEK)) {
      // New week, or testing override cleanup — reset
      return { roundsLeft: MAX_ROUNDS_PER_WEEK, weekStart: thisMonday };
    }
    return { roundsLeft: data.roundsLeft ?? MAX_ROUNDS_PER_WEEK, weekStart: data.weekStart };
  }

  function saveWeeklyState(ws) {
    const data = getStorage();
    data.weekStart  = ws.weekStart;
    data.roundsLeft = ws.roundsLeft;
    saveStorage(data);
  }

  function getCollection() {
    const data = getStorage();
    return data.collection || {};
    // structure: { xavier: { total: 0, d0: 0, d1: 0 }, ... }
  }

  function saveCollection(col) {
    const data = getStorage();
    data.collection = col;
    saveStorage(data);
  }

  function addToCollection(charKey, designIdx) {
    const col = getCollection();
    if (!col[charKey]) col[charKey] = { total: 0, d0: 0, d1: 0 };
    col[charKey].total++;
    col[charKey][`d${designIdx}`]++;
    saveCollection(col);
    return col[charKey].total; // return new total for that char
  }

  function getUnlockedVariants(total) {
    // returns 1, 2, 3, or 4 depending on thresholds met
    let unlocked = 1;
    for (let i = 1; i < UNLOCK_THRESHOLDS.length; i++) {
      if (total >= UNLOCK_THRESHOLDS[i]) unlocked = i + 1;
    }
    return unlocked;
  }

  // Next unlock threshold for a char's total
  function nextUnlockAt(total) {
    for (const t of UNLOCK_THRESHOLDS) {
      if (total < t) return t;
    }
    return null; // all unlocked
  }

  // ── DOM REFERENCES ─────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const el = {
    intro:           $('cm-intro'),
    startBtn:        $('cm-start-btn'),
    hud:             $('cm-hud'),
    pauseBtn:        $('cm-pause-btn'),
    pauseIcon:       $('cm-pause-icon'),
    playIcon:        $('cm-play-icon'),
    gameArea:        $('cm-game-area'),
    rail:            $('cm-rail'),
    arm:             $('cm-arm'),
    clawSvg:         $('cm-claw-svg'),
    prongL:          $('claw-prong-l'),
    prongC:          $('claw-prong-c'),
    prongR:          $('claw-prong-r'),
    prizeBin:        $('cm-prize-bin'),
    chuteFlash:      $('cm-chute-flash'),
    winScreen:       $('cm-win'),
    winPlushie:      $('cm-win-plushie'),
    winLabel:        $('cm-win-label'),
    missScreen:      $('cm-miss'),
    missAttempts:    $('cm-miss-attempts'),
    roundOverScreen: $('cm-round-over'),
    roundPlushiesDisplay: $('cm-round-plushies-display'),
    weeklyLimit:     $('cm-weekly-limit'),
    resetCountdown:  $('cm-reset-countdown'),
    pauseOverlay:    $('cm-pause-overlay'),
    controlsPanel:   $('cm-controls-panel'),
    belowExit:       $('cm-below-exit'),
    roundsDisplay:   $('cm-rounds-display'),
    attemptsLeft:    $('cm-attempts-left'),
    timerDisplay:    $('cm-timer'),
    collectedRow:    $('cm-collected-row'),
    joystickWrap:    $('cm-joystick-wrap'),
    joystickImg:     $('cm-joystick-img'),
    dropBtnWrap:     $('cm-drop-btn-wrap'),
    dropBtnImg:      $('cm-drop-btn-img'),
    collectionModal: $('cm-collection-modal'),
    charTabs:        $('cm-char-tabs'),
    collectionGrid:  $('cm-collection-grid'),
    nextRoundBtn:    $('cm-next-round-btn'),
    exitFromRound:   $('cm-exit-from-round-btn'),
    exitBtn:         $('cm-exit-btn'),
    resumeBtn:       $('cm-resume-btn'),
    endBtn:          $('cm-end-btn'),
    continueBtn:     $('cm-continue-btn'),
    toast:           $('toast'),
  };

  // ── SESSION ────────────────────────────────────────────────────
  let ws = getWeeklyState();
  let attemptsLeft = ATTEMPTS_PER_ROUND;
  let currentRound = MAX_ROUNDS_PER_WEEK - ws.roundsLeft + 1;

  // ── SHOW/HIDE HELPERS ──────────────────────────────────────────
  function showOnly(...elements) {
    const all = [el.intro, el.winScreen, el.missScreen, el.roundOverScreen, el.weeklyLimit, el.gameArea];
    all.forEach(e => { if (e) e.style.display = 'none'; });
    elements.forEach(e => { if (e) e.style.display = 'flex'; });
  }

  function toast(msg, duration = 2000) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    setTimeout(() => el.toast.classList.remove('show'), duration);
  }

  // ── CLAW ANIMATION ─────────────────────────────────────────────
  function setClawOpen(open) {
    const prongs = open ? CLAW_PRONGS.open : CLAW_PRONGS.closed;
    el.prongL.setAttribute('d', prongs.l);
    el.prongC.setAttribute('d', prongs.c);
    el.prongR.setAttribute('d', prongs.r);
  }

  function updateArmLength(h) {
    el.arm.style.height = h + 'px';
  }

  function updateRailPosition() {
    // X position along rail track
    el.rail.style.left = railX + '%';
    el.arm.style.marginTop = '0px';
  }

  // ── PLUSHIE GENERATION ─────────────────────────────────────────
  function makePlushieEl(char, designIdx, colorIdx) {
    const div = document.createElement('div');
    div.className = 'cm-plushie';
    const design = PLUSHIE_DESIGNS[char][designIdx];
    if (design.images) {
      div.style.backgroundImage = `url('${design.images[colorIdx]}')`;
      div.style.backgroundSize = 'contain';
      div.style.backgroundPosition = 'center';
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundColor = 'transparent';
      div.style.boxShadow = 'none';
    } else {
      div.style.background = CHARACTERS[char].colors[colorIdx];
      div.textContent = design.emoji;
    }
    div.dataset.char      = char;
    div.dataset.designIdx = designIdx;
    div.dataset.colorIdx  = colorIdx;
    return div;
  }

  function initPhysics() {
    if (engine) return;
    engine = Engine.create();
    world = engine.world;
    runner = Runner.create();

    const thick = 100;
    const floorY = PHYS_H * 0.6161;
    const leftX = PHYS_W * 0.1695;
    const rightX = PHYS_W * 0.8705;
    
    ground = Bodies.rectangle(PHYS_W / 2, floorY + thick / 2, PHYS_W, thick, { isStatic: true });
    leftWall = Bodies.rectangle(leftX - thick / 2, PHYS_H / 2, thick, PHYS_H, { isStatic: true });
    rightWall = Bodies.rectangle(rightX + thick / 2, PHYS_H / 2, thick, PHYS_H, { isStatic: true });

    Composite.add(world, [ground, leftWall, rightWall]);

    Events.on(engine, 'afterUpdate', updateDOMPositions);
    Runner.run(runner, engine);
  }

  function cleanupPhysics() {
    if (world) {
       Composite.clear(world, false);
       Composite.add(world, [ground, leftWall, rightWall]);
    }
  }

  function updateDOMPositions() {
    for (let i = 0; i < binPlushies.length; i++) {
      const p = binPlushies[i];
      if (p.grabbed || !p.body) continue;
      const xPct = (p.body.position.x / PHYS_W) * 100;
      const yPct = (p.body.position.y / PHYS_H) * 100;
      p.el.style.left = xPct + '%';
      p.el.style.top = yPct + '%';
      p.el.style.transform = `translate(-50%, -50%) rotate(${p.body.angle}rad)`;
    }
  }

  function populatePrizeBin() {
    binPlushies.forEach(p => { if (p.el && p.el.parentNode) p.el.remove(); });
    binPlushies = [];
    initPhysics();
    cleanupPhysics();

    const count = 12; // increased count to show stacking
    const leftX = PHYS_W * 0.1695;
    const rightX = PHYS_W * 0.8705;
    const spawnWidth = rightX - leftX - PLUSHIE_RADIUS * 4;

    const col = getCollection();
    for (let i = 0; i < count; i++) {
      const char      = CHAR_KEYS[Math.floor(Math.random() * CHAR_KEYS.length)];
      const designIdx = Math.floor(Math.random() * 2);
      
      const charTotal = col[char] ? col[char].total : 0;
      const unlocked  = getUnlockedVariants(charTotal);
      const colorIdx  = Math.floor(Math.random() * unlocked);

      const plushDiv = makePlushieEl(char, designIdx, colorIdx);
      plushDiv.style.zIndex = 20;
      el.gameArea.appendChild(plushDiv);

      const startX = leftX + PLUSHIE_RADIUS * 2 + Math.random() * spawnWidth;
      const startY = 100 + Math.random() * 200; // Drop from top
      
      const body = Bodies.circle(startX, startY, PLUSHIE_RADIUS, {
        restitution: 0.2,
        friction: 0.8,
        density: 0.05
      });
      
      Composite.add(world, body);
      binPlushies.push({ char, designIdx, colorIdx, body, el: plushDiv, grabbed: false });
    }
  }

  // ── DROP SEQUENCE (async state machine) ────────────────────────
  let dropping = false;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  let attemptTimer = 30;
  let timerInterval = null;

  function startTimer() {
    clearInterval(timerInterval);
    attemptTimer = 30;
    el.timerDisplay.textContent = attemptTimer;
    el.timerDisplay.style.color = '#8b6dc4';
    timerInterval = setInterval(() => {
      if (state !== 'IDLE' || paused) return;
      attemptTimer--;
      el.timerDisplay.textContent = attemptTimer;
      if (attemptTimer <= 5) {
        el.timerDisplay.style.color = '#ff4d4d';
      }
      if (attemptTimer <= 0) {
        clearInterval(timerInterval);
        doDrop();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  async function doDrop() {
    if (dropping || state !== 'IDLE' || paused) return;
    dropping = true;
    stopTimer();
    state = 'DROPPING';
    setDropBtnPressed(true);

    // 1. DROPPING — claw descends
    setClawOpen(true);
    
    const trackLeft = 202.1;
    const trackWidth = 593.7;
    const clawX = trackLeft + (railX / 100) * trackWidth;
    const clawStartLogicalY = 423; // top: 28.92% of 1464
    const floorY = PHYS_H * 0.6161;
    
    let hitY = floorY;
    let hitPlushie = null;
    let hitIdx = -1;
    const clawWidth = 80;

    for (let i = 0; i < binPlushies.length; i++) {
      const p = binPlushies[i];
      if (p.grabbed || !p.body) continue;
      if (Math.abs(p.body.position.x - clawX) < (PLUSHIE_RADIUS + clawWidth / 2)) {
        const topEdge = p.body.position.y - PLUSHIE_RADIUS;
        if (topEdge < hitY) {
          hitY = topEdge;
          hitPlushie = p;
          hitIdx = i;
        }
      }
    }

    const dropDistanceLogical = hitY - clawStartLogicalY;
    const dropDistancePct = dropDistanceLogical / PHYS_H;
    const gameAreaHeight = el.gameArea.clientHeight || 700; 
    const targetArmPx = Math.max(MIN_ARM, dropDistancePct * gameAreaHeight);

    const startArm = MIN_ARM;
    const dropDuration = 2000;
    await animateTo(startArm, targetArmPx, dropDuration, v => { armHeight = v; updateArmLength(v); });

    // 2. GRIPPING — claw closes, RNG determines success
    state = 'GRIPPING';
    setClawOpen(false);
    await sleep(600);

    const gripChance = 0.5; // 50% base chance
    const success = hitPlushie && Math.random() < gripChance;

    if (success) {
      catchedPlushie = hitPlushie;
      catchedPlushie.grabbed = true;
      Composite.remove(world, catchedPlushie.body);
      catchedPlushie.el.classList.add('grabbed');
      catchedPlushie.el.style.left = '50%';
      catchedPlushie.el.style.top = '100%';
      catchedPlushie.el.style.transform = 'translate(-50%, -10px) scale(1.15)';
      catchedPlushie.el.style.zIndex = '10';
      el.arm.appendChild(catchedPlushie.el);
    }

    // 3. RISING — claw rises back up
    state = 'RISING';
    const riseDuration = 2000; // Reduced speed
    await animateTo(targetArmPx, MIN_ARM, riseDuration, v => { armHeight = v; updateArmLength(v); });

    // 4. RESULT
    attemptsLeft--;
    el.attemptsLeft.textContent = attemptsLeft;

    if (success && catchedPlushie) {
      // Move claw to deposit position (far right)
      await animateTo(railX, 90, 1500, v => { railX = v; updateRailPosition(); }); // Reduced speed
      await sleep(200);

      // Deposit
      setClawOpen(true);
      catchedPlushie.el.style.transition = 'top 1s ease-in, transform 1s ease-in';
      catchedPlushie.el.style.top = '250px';
      catchedPlushie.el.style.transform = 'translate(-50%, -10px) scale(0.8)';
      
      el.chuteFlash.classList.add('flash');
      setTimeout(() => el.chuteFlash.classList.remove('flash'), 1000);
      
      await sleep(1000);
      
      catchedPlushie.el.remove();
      binPlushies.splice(hitIdx, 1);

      // Record in collection
      const { char, designIdx, colorIdx } = catchedPlushie;
      const newTotal = addToCollection(char, designIdx);
      roundCaught++;
      
      // Add to HUD
      let existingIcon = el.collectedRow.querySelector(`[data-char="${char}"][data-design="${designIdx}"]`);
      if (existingIcon) {
        let badge = existingIcon.querySelector('.badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'badge';
          badge.style.position = 'absolute';
          badge.style.bottom = '-4px';
          badge.style.right = '-4px';
          badge.style.background = '#e74c3c';
          badge.style.color = '#fff';
          badge.style.fontSize = '10px';
          badge.style.fontWeight = 'bold';
          badge.style.padding = '2px 4px';
          badge.style.borderRadius = '8px';
          badge.style.zIndex = '5';
          badge.style.lineHeight = '1';
          existingIcon.appendChild(badge);
          existingIcon.dataset.count = 1;
        }
        existingIcon.dataset.count = parseInt(existingIcon.dataset.count) + 1;
        badge.textContent = 'x' + existingIcon.dataset.count;
      } else {
        const pIcon = document.createElement('div');
        pIcon.dataset.char = char;
        pIcon.dataset.design = designIdx;
        pIcon.dataset.count = 1;
        pIcon.style.position = 'relative';
        pIcon.style.width = '32px';
        pIcon.style.height = '32px';
        const design = PLUSHIE_DESIGNS[char][designIdx];
        if (design.images) {
          pIcon.style.backgroundImage = `url('${design.images[colorIdx]}')`;
          pIcon.style.backgroundSize = 'contain';
          pIcon.style.backgroundPosition = 'center';
          pIcon.style.backgroundRepeat = 'no-repeat';
          pIcon.style.backgroundColor = 'transparent';
          pIcon.style.borderRadius = '0';
        } else {
          pIcon.style.background = CHARACTERS[char].colors[colorIdx];
          pIcon.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
          pIcon.style.borderRadius = '50%';
          pIcon.textContent = design.emoji;
        }
        pIcon.style.display = 'flex';
        pIcon.style.alignItems = 'center';
        pIcon.style.justifyContent = 'center';
        pIcon.style.fontSize = '20px';
        el.collectedRow.appendChild(pIcon);
      }

      // Show win screen
      showWinScreen(char, designIdx, newTotal, colorIdx);
    } else {
      setClawOpen(true);
      setDropBtnPressed(false);
      if (attemptsLeft <= 0) {
        showRoundOver();
      } else {
        showMiss();
      }
    }

    dropping = false;
    state = success ? 'WIN' : (attemptsLeft <= 0 ? 'ROUND_OVER' : 'MISS');
  }

  // Smooth animation helper
  function animateTo(from, to, duration, setter) {
    return new Promise(resolve => {
      const start = Date.now();
      function step() {
        const t = Math.min(1, (Date.now() - start) / duration);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out quad
        setter(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  // ── SHOW SCREENS ───────────────────────────────────────────────
  function setGameMode(active) {
    el.hud.style.display            = active ? 'flex' : 'none';
    el.pauseBtn.style.display       = active ? 'flex' : 'none';
    el.gameArea.style.display       = active ? 'block' : 'none';
    el.controlsPanel.classList.toggle('inactive', !active);
  }

  function showIntro() {
    state = 'INTRO';
    ws = getWeeklyState();
    setGameMode(false);

    if (ws.roundsLeft <= 0) {
      showWeeklyLimit();
      return;
    }

    el.roundsDisplay.textContent = ws.roundsLeft;
    showOnly(el.intro);
  }

  function startRound() {
    ws = getWeeklyState();
    if (ws.roundsLeft <= 0) { showWeeklyLimit(); return; }

    // Deduct a round immediately when it starts
    ws.roundsLeft--;
    saveWeeklyState(ws);

    attemptsLeft = ATTEMPTS_PER_ROUND;
    roundCaught  = 0;
    currentRound = MAX_ROUNDS_PER_WEEK - ws.roundsLeft;

    el.attemptsLeft.textContent = attemptsLeft;
    el.collectedRow.innerHTML = '';

    setGameMode(true);
    showOnly(el.gameArea);
    populatePrizeBin();

    railX = 50;
    armHeight = MIN_ARM;
    updateRailPosition();
    updateArmLength(MIN_ARM);
    setClawOpen(true);

    state = 'IDLE';
    startTimer();
  }

  function showWinScreen(char, designIdx, newTotal, colorIdx = 0) {
    const plushie  = PLUSHIE_DESIGNS[char][designIdx];
    const charData = CHARACTERS[char];

    let variantName = plushie.label;

    // Render caught plushie blob
    if (plushie.images) {
      const imgUrl = plushie.images[colorIdx];
      el.winPlushie.style.backgroundImage = `url('${imgUrl}')`;
      el.winPlushie.style.backgroundSize = 'contain';
      el.winPlushie.style.backgroundPosition = 'center';
      el.winPlushie.style.backgroundRepeat = 'no-repeat';
      el.winPlushie.style.backgroundColor = 'transparent';
      el.winPlushie.style.boxShadow = 'none';
      el.winPlushie.style.borderRadius = '0';
      el.winPlushie.textContent = '';
      
      // Extract variant name from file URL
      const filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('.'));
      if (window.i18n) {
        const key = "plushie." + filename.toLowerCase().replace(/\./g, '').replace(/ /g, '_');
        variantName = window.i18n.t(key);
        if (variantName === key) {
            variantName = filename.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      } else {
        variantName = filename.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    } else {
      el.winPlushie.style.background = charData.colors[colorIdx];
      el.winPlushie.style.backgroundImage = '';
      el.winPlushie.style.boxShadow = '';
      el.winPlushie.style.borderRadius = '50%';
      el.winPlushie.textContent = plushie.emoji;
    }
    el.winLabel.style.position = 'relative';
    el.winLabel.style.display = 'inline-block';
    if (newTotal === 1) {
      el.winLabel.innerHTML = `${variantName}<span style="position:absolute; top:-12px; right:-24px; color:white; text-shadow: 0 0 6px red, 0 0 12px red; transform:rotate(45deg); font-size:12px; font-weight:900; letter-spacing:1px;">NEW</span>`;
    } else {
      el.winLabel.innerHTML = variantName;
    }

    showOnly(el.winScreen);
    setDropBtnPressed(false);
  }

  function showMiss() {
    if (window.i18n && window.i18n.lang === 'zh') {
      el.missAttempts.textContent = attemptsLeft > 0
        ? `剩余 ${attemptsLeft} 次`
        : window.i18n.t('arcade.out_of_attempts');
    } else {
      const remainingText = window.i18n ? window.i18n.t('arcade.miss').toLowerCase() : 'remaining';
      const outText = window.i18n ? window.i18n.t('arcade.out_of_attempts') : 'No attempts left!';
      el.missAttempts.textContent = attemptsLeft > 0
        ? `${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} ${remainingText}`
        : outText;
    }
    showOnly(el.missScreen);
    setTimeout(() => {
      if (attemptsLeft > 0) {
        showOnly(el.gameArea);
        state = 'IDLE';
        startTimer();
      } else {
        showRoundOver();
      }
    }, 1200);
  }

  function showRoundOver() {
    el.roundPlushiesDisplay.innerHTML = el.collectedRow.innerHTML;
    const roundsLeft = getWeeklyState().roundsLeft;
    el.nextRoundBtn.style.display = roundsLeft > 0 ? 'flex' : 'none';
    showOnly(el.roundOverScreen);
    setGameMode(false);
    state = 'ROUND_OVER';
  }

  function showWeeklyLimit() {
    state = 'WEEKLY_LIMIT';
    setGameMode(false);
    showOnly(el.weeklyLimit);
    updateResetCountdown();
  }

  function updateResetCountdown() {
    const ws2 = getWeeklyState();
    const nextReset = ws2.weekStart + MONDAY_MS;
    const diff = nextReset - Date.now();
    if (diff <= 0) { el.resetCountdown.textContent = 'now!'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    el.resetCountdown.textContent = `${d}d ${h}h ${m}m`;
  }

  // ── CONTROLS ───────────────────────────────────────────────────
  const keys = {};
  let moveLoop = null;

  function startMoveLoop() {
    if (moveLoop) return;
    
    function loop() {
      moveLoop = requestAnimationFrame(loop);
      if (state !== 'IDLE' || paused) return;
      
      let speed = 0.4;
      let moved = false;
      
      if (keys['ArrowLeft']  || keys['KeyA'] || keys.left) { railX -= speed; moved = true; }
      if (keys['ArrowRight'] || keys['KeyD'] || keys.right) { railX += speed; moved = true; }
      if (joystickActive && Math.abs(joystickNormX) > 0.1) { 
        railX += joystickNormX * speed; 
        moved = true; 
      }
      
      if (moved) {
        railX = Math.max(5, Math.min(95, railX));
        updateRailPosition();
      }
    }
    moveLoop = requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', e => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (state !== 'IDLE' || paused) {
      if (e.code === 'Escape' && (state === 'IDLE' || state === 'DROPPING' || state === 'GRIPPING' || state === 'RISING')) {
        togglePause();
      }
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      keys.left = true;
      if (!joystickActive) el.joystickImg.style.transform = 'rotate(-30deg) scale(0.95)';
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      keys.right = true;
      if (!joystickActive) el.joystickImg.style.transform = 'rotate(30deg) scale(0.95)';
    }
    if (e.key === ' ' || e.key === 'Enter') {
      el.dropBtnWrap.classList.add('pressed');
      doDrop();
    }
  });

  document.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      keys.left = false;
      if (!joystickActive && !keys.right) el.joystickImg.style.transform = 'rotate(0deg) scale(1)';
      else if (!joystickActive && keys.right) el.joystickImg.style.transform = 'rotate(30deg) scale(0.95)';
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      keys.right = false;
      if (!joystickActive && !keys.left) el.joystickImg.style.transform = 'rotate(0deg) scale(1)';
      else if (!joystickActive && keys.left) el.joystickImg.style.transform = 'rotate(-30deg) scale(0.95)';
    }
    if (e.key === ' ' || e.key === 'Enter') {
      el.dropBtnWrap.classList.remove('pressed');
    }
  });

  // ── ON-SCREEN JOYSTICK ─────────────────────────────────────────
  let joystickActive = false;
  let joystickOrigin = { x: 0, y: 0 };
  let joystickNormX = 0;

  function joystickStart(clientX, clientY) {
    joystickActive = true;
    const rect = el.joystickWrap.getBoundingClientRect();
    joystickOrigin.x = rect.left + rect.width / 2;
    joystickOrigin.y = rect.top  + rect.height / 2;
    joystickNormX = 0;
  }

  function joystickMove(clientX, clientY) {
    if (!joystickActive) return;
    const dx = clientX - joystickOrigin.x;
    const maxDist = 28;

    // Tilt joystick image left/right
    let normX = dx / maxDist;
    if (normX > 1) normX = 1;
    if (normX < -1) normX = -1;
    
    joystickNormX = normX;

    const tiltAngle = normX * 30; // max 30 degrees tilt
    el.joystickImg.style.transform = Math.abs(dx) > 4 ? `rotate(${tiltAngle}deg) scale(0.95)` : 'rotate(0deg) scale(1)';
  }

  function joystickEnd() {
    joystickActive = false;
    joystickNormX = 0;
    el.joystickImg.style.transform = 'rotate(0deg) scale(1)';
  }

  el.joystickWrap.addEventListener('mousedown', e => { joystickStart(e.clientX, e.clientY); });
  document.addEventListener('mousemove', e => { joystickMove(e.clientX, e.clientY); });
  document.addEventListener('mouseup', () => { joystickEnd(); });
  document.addEventListener('mouseleave', () => { joystickEnd(); });

  el.joystickWrap.addEventListener('touchstart', e => {
    e.preventDefault();
    joystickStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  el.joystickWrap.addEventListener('touchmove', e => {
    e.preventDefault();
    joystickMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  el.joystickWrap.addEventListener('touchend', () => { joystickEnd(); });
  el.joystickWrap.addEventListener('touchcancel', () => { joystickEnd(); });

  // ── DROP BUTTON ────────────────────────────────────────────────
  function setDropBtnPressed(pressed) {
    el.dropBtnImg.src = pressed
      ? '../assets/ui/arcade/claw-machine/button-down.png'
      : '../assets/ui/arcade/claw-machine/button-up.png';
    el.dropBtnWrap.classList.toggle('pressed', pressed);
  }

  el.dropBtnWrap.addEventListener('click', () => {
    if (state === 'IDLE') doDrop();
  });

  el.dropBtnWrap.addEventListener('touchstart', e => {
    e.preventDefault();
    if (state === 'IDLE') doDrop();
  }, { passive: false });

  // ── PAUSE ──────────────────────────────────────────────────────
  function togglePause() {
    if (!['IDLE','DROPPING','GRIPPING','RISING'].includes(state)) return;
    paused = !paused;
    el.pauseOverlay.style.display = paused ? 'flex' : 'none';
    el.pauseBtn.classList.toggle('show-above', paused);
    el.pauseIcon.style.display = paused ? 'none' : '';
    el.playIcon.style.display  = paused ? '' : 'none';
  }

  el.pauseBtn.addEventListener('click', togglePause);
  el.resumeBtn.addEventListener('click', togglePause);
  el.endBtn.addEventListener('click', () => {
    paused = false;
    el.pauseOverlay.style.display = 'none';
    attemptsLeft = 0;
    showRoundOver();
  });

  // ── COLLECTION MODAL ───────────────────────────────────────────
  let activeCharTab = CHAR_KEYS[0];

  function openCollection() {
    renderCharTabs();
    renderCollectionGrid(activeCharTab);
    el.collectionModal.style.display = 'flex';
    lucide.createIcons();
  }

  function closeCollection() {
    el.collectionModal.style.display = 'none';
  }

  function renderCharTabs() {
    el.charTabs.innerHTML = '';
    CHAR_KEYS.forEach(key => {
      const tab = document.createElement('button');
      tab.className = 'cm-char-tab' + (key === activeCharTab ? ' active' : '');
      tab.textContent = window.i18n ? window.i18n.t(`char.${key}`) : CHARACTERS[key].label;
      tab.addEventListener('click', () => {
        activeCharTab = key;
        renderCharTabs();
        renderCollectionGrid(key);
      });
      el.charTabs.appendChild(tab);
    });
  }

  function renderCollectionGrid(charKey) {
    const col        = getCollection();
    const charCol    = col[charKey] || { total: 0, d0: 0, d1: 0 };
    const total      = charCol.total;
    const unlocked   = getUnlockedVariants(total);
    const nextAt     = nextUnlockAt(total);
    const charData   = CHARACTERS[charKey];
    const designs    = PLUSHIE_DESIGNS[charKey];

    el.collectionGrid.innerHTML = '';

    designs.forEach((design, dIdx) => {
      const caught = charCol[`d${dIdx}`] || 0;
      const group  = document.createElement('div');
      group.className = 'cm-design-group';
      const labelKey = `plushie.col_${design.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const translatedLabel = window.i18n ? window.i18n.t(labelKey) : design.label;
      group.innerHTML = `<p class="cm-design-label">${translatedLabel} (×${caught})</p>`;

      const row = document.createElement('div');
      row.className = 'cm-variants-row';

      for (let v = 0; v < 4; v++) {
        const isUnlocked = (v + 1) <= unlocked;
        const item = document.createElement('div');
        item.className = 'cm-variant-item';

        const plushie = document.createElement('div');
        plushie.className = 'cm-variant-plushie' + (isUnlocked ? '' : ' locked');
        
        let variantName = `Variant ${v + 1}`;
        
        if (design.images) {
          const imgUrl = design.images[v];
          plushie.style.backgroundImage = `url('${imgUrl}')`;
          plushie.style.backgroundSize = 'contain';
          plushie.style.backgroundPosition = 'center';
          plushie.style.backgroundRepeat = 'no-repeat';
          plushie.style.backgroundColor = 'transparent';
          plushie.style.border = 'none';
          plushie.style.boxShadow = 'none';
          
          if (imgUrl) {
            const filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('.'));
            if (window.i18n) {
              const vKey = "plushie." + filename.toLowerCase().replace(/\./g, '').replace(/ /g, '_');
              variantName = window.i18n.t(vKey);
              if (variantName === vKey) {
                variantName = filename.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              }
            } else {
              variantName = filename.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
          }
        } else {
          plushie.style.background = charData.colors[v];
          plushie.textContent = design.emoji;
        }

        if (!isUnlocked) {
          const lockIcon = document.createElement('div');
          lockIcon.className = 'lock-icon';
          lockIcon.innerHTML = '<i data-lucide="lock" style="width:16px;height:16px;"></i>';
          plushie.appendChild(lockIcon);
        }

        const label = document.createElement('div');
        label.className = 'cm-variant-label';
        if (isUnlocked) {
          label.textContent = variantName;
        } else {
          if (window.i18n && window.i18n.lang === 'zh') {
            label.textContent = `需要 ${UNLOCK_THRESHOLDS[v]} 个`;
          } else {
            label.textContent = `${UNLOCK_THRESHOLDS[v]} needed`;
          }
        }

        const countEl = document.createElement('div');
        countEl.className = 'cm-variant-count';
        countEl.textContent = isUnlocked ? (v === 0 ? `×${caught}` : '✦') : '';

        item.appendChild(plushie);
        item.appendChild(label);
        item.appendChild(countEl);
        row.appendChild(item);
      }

      group.appendChild(row);
      el.collectionGrid.appendChild(group);
    });

    lucide.createIcons();
  }

  $('cm-collection-close').addEventListener('click', closeCollection);
  $('cm-collection-btn-intro').addEventListener('click', openCollection);
  $('cm-collection-btn-limit').addEventListener('click', openCollection);

  // Close modal on backdrop click
  el.collectionModal.addEventListener('click', e => {
    if (e.target === el.collectionModal) closeCollection();
  });

  // ── EXIT ───────────────────────────────────────────────────────
  el.exitBtn.addEventListener('click', () => {
    if (state !== 'INTRO' && state !== 'WEEKLY_LIMIT' && state !== 'ROUND_OVER') {
      if (!confirm('Are you sure you want to leave? Your round progress and attempts will be lost.')) {
        return;
      }
    }
    window.location.href = '../index.html';
  });

  // ── BUTTON WIRING ──────────────────────────────────────────────
  el.startBtn.addEventListener('click', startRound);

  el.continueBtn.addEventListener('click', () => {
    if (attemptsLeft <= 0) {
      showRoundOver();
    } else {
      showOnly(el.gameArea);
      state = 'IDLE';
      startTimer();
    }
  });

  el.nextRoundBtn.addEventListener('click', () => {
    ws = getWeeklyState();
    if (ws.roundsLeft <= 0) { showWeeklyLimit(); return; }
    startRound();
  });

  el.exitFromRound.addEventListener('click', () => { showIntro(); });
  el.exitBtn.addEventListener('click', () => { window.location.href = '../index.html'; });

  // Weekly countdown update
  setInterval(updateResetCountdown, 60000);

  // ── INIT ───────────────────────────────────────────────────────
  startMoveLoop();
  showIntro();
  lucide.createIcons();

})();
