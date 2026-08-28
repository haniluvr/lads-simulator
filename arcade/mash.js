'use strict';

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  DATA POOLS
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
const DATA = {
  partner: [
    'Xavier', 'Zayne', 'Rafayel', 'Sylus', 'Caleb', 'Valko'
  ],
  transport: [
    'No need. Teleportation.', 'Spaceship', 'Train', 'Audi A6 45 TFSI',
    'Ferrari 250 GT Berlinetta Lusso', 'Mercedes-Benz AMG Gran Turismo',
    'Mercedes-Benz 300SL', 'Harley Davidson VRSC Nightrod',
    'Lamborghini Lanzador', 'Toyota', 'Honda', 'Nissan', 'Mitsubishi',
    'Hyundai', 'Kia', 'BYD', 'BMW', 'Mercedes-Benz', 'Audi',
    'Volkswagen', 'Volvo', 'Ferrari', 'Lamborghini', 'Ford', 'Chevrolet',
    'Tesla', 'Jeep'
  ],
  color: [
    'Blue', 'Yellow', 'Light Gold', 'Purple', 'Pink', 'Red', 'Black',
    'Dark Magenta', 'Orange Red', 'Teal', 'Green', 'White'
  ],
  job: [
    'Deepspace Hunter', 'King', 'Royalty', 'Knight', 'Vigilante',
    'Chief Cardiac Surgeon', 'Medical Researcher', 'Professor', 'Primary Physician',
    'Foreseer', 'Artist', 'Painter', 'Sea God', 'Leader of Onychinus',
    'Boss', 'Gangleader', 'Underling', 'Fruit Vendor', 'Fighter Pilot',
    'Farspace Fleet Colonel', 'Student', 'CEO', 'EonCore Tech Chairman'
  ],
  kids: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  location: [
    'Linkon City', 'Akso Hospital', 'Bloomshore District', 'Hat Island',
    "Meow's Caf\u00E9", 'Mo Art Studio', 'Skyhaven', 'The Arctic', 'The Nest',
    'Twinkle Toys', "The Hunter's Association", 'Central Business District',
    'Philee District', 'Lumiaestas District', 'Begonia District', 'Duskfall District',
    'Empyreal Ring', 'Eterno District', 'Newport District', 'Old District',
    'Shellbank District', 'Silverbay District', 'Universum', 'Whitesand Bay',
    'N109 Zone', 'Lemuria', 'Philos'
  ]
};

const MASH_OPTIONS = ['Mansion', 'Apartment', 'Shack', 'House'];
const MASH_EMOJIS = {
  'Mansion': '<i data-lucide="castle"></i>',
  'Apartment': '<i data-lucide="building"></i>',
  'Shack': '<i data-lucide="tent"></i>',
  'House': '<i data-lucide="house"></i>'
};

const DECREES = {
  Mansion: 'mash.decree_m',
  Apartment: 'mash.decree_a',
  Shack: 'mash.decree_s',
  House: 'mash.decree_h'
};

const CAT_META = {
  mash:      { labelKey: 'mash.cat_home',       icon: '<i data-lucide="house"></i>' },
  partner:   { labelKey: 'mash.cat_partner',    icon: '<i data-lucide="heart"></i>' },
  transport: { labelKey: 'mash.cat_car',  icon: '<i data-lucide="rocket"></i>' },
  color:     { labelKey: 'mash.cat_color', icon: '<i data-lucide="palette"></i>' },
  job:       { labelKey: 'mash.cat_job', icon: '<i data-lucide="briefcase"></i>' },
  kids:      { labelKey: 'mash.cat_kids',  icon: '<i data-lucide="baby"></i>' },
  location:  { labelKey: 'mash.cat_location',   icon: '<i data-lucide="map-pin"></i>' }
};

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  SPIRAL CANVAS
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
const spiralCanvas = document.getElementById('spiralCanvas');
const sctx = spiralCanvas.getContext('2d');
let spiralPoints = [];
let isDrawing = false;
let spiralN = 0;

function getCanvasPos(e) {
  const rect = spiralCanvas.getBoundingClientRect();
  const scaleX = spiralCanvas.width / rect.width;
  const scaleY = spiralCanvas.height / rect.height;
  const src = e.touches ? e.touches[0] : e;
  return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
}

// Mouse events
spiralCanvas.addEventListener('mousedown',  e => { isDrawing = true; spiralPoints.push(getCanvasPos(e)); drawMidline(); });
spiralCanvas.addEventListener('mousemove',  e => {
  if (!isDrawing) return;
  const p = getCanvasPos(e);
  const last = spiralPoints[spiralPoints.length - 1];
  if (last) { drawSegment(last, p); }
  spiralPoints.push(p);
  refreshCount();
});
spiralCanvas.addEventListener('mouseup',    () => { isDrawing = false; });
spiralCanvas.addEventListener('mouseleave', () => { isDrawing = false; });

// Touch events
spiralCanvas.addEventListener('touchstart', e => { e.preventDefault(); isDrawing = true; spiralPoints.push(getCanvasPos(e)); drawMidline(); }, { passive: false });
spiralCanvas.addEventListener('touchmove',  e => {
  e.preventDefault();
  if (!isDrawing) return;
  const p = getCanvasPos(e);
  const last = spiralPoints[spiralPoints.length - 1];
  if (last) { drawSegment(last, p); }
  spiralPoints.push(p);
  refreshCount();
}, { passive: false });
spiralCanvas.addEventListener('touchend',   e => { e.preventDefault(); isDrawing = false; }, { passive: false });

function drawSegment(from, to) {
  sctx.beginPath();
  sctx.moveTo(from.x, from.y);
  sctx.lineTo(to.x, to.y);
  sctx.strokeStyle = '#C9A96E';
  sctx.lineWidth = 2.5;
  sctx.lineCap = 'round';
  sctx.lineJoin = 'round';
  sctx.stroke();
}

function drawMidline() {
  const midX = spiralCanvas.width / 2;
  sctx.save();
  sctx.setLineDash([6, 9]);
  sctx.beginPath();
  sctx.moveTo(midX, 0);
  sctx.lineTo(midX, spiralCanvas.height);
  sctx.strokeStyle = 'rgba(201, 169, 110, 0.22)';
  sctx.lineWidth = 1;
  sctx.stroke();
  sctx.setLineDash([]);
  sctx.restore();
}

function refreshCount() {
  const midX = spiralCanvas.width / 2;
  let count = 0;
  for (let i = 1; i < spiralPoints.length; i++) {
    const x1 = spiralPoints[i - 1].x;
    const x2 = spiralPoints[i].x;
    if ((x1 < midX && x2 >= midX) || (x1 >= midX && x2 < midX)) count++;
  }
  spiralN = count;
  const el = document.getElementById('loopCount');
  el.textContent = spiralN;
  el.style.transform = 'scale(1.3)';
  setTimeout(() => { el.style.transform = ''; }, 120);
}

function clearSpiral() {
  spiralPoints = [];
  spiralN = 0;
  sctx.clearRect(0, 0, spiralCanvas.width, spiralCanvas.height);
  drawMidline();
  document.getElementById('loopCount').textContent = '0';
}

// Draw midline on load
drawMidline();

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  RANDOMIZER
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function randomizeAll() {
  const cats = ['partner', 'transport', 'color', 'job', 'kids', 'location'];
  for (const cat of cats) {
    const inputs = [...document.querySelectorAll(`.cat-inputs[data-cat="${cat}"] .mash-input`)];
    const picked = shuffle([...DATA[cat]]).slice(0, 4);
    inputs.forEach((inp, i) => {
      inp.value = picked[i] || '';
      inp.style.transition = 'background 0s';
      inp.style.background = 'rgba(201, 169, 110, 0.22)';
      inp.style.borderColor = 'var(--gold)';
      setTimeout(() => {
        inp.style.transition = 'background 0.6s, border-color 0.6s';
        inp.style.background = '';
        inp.style.borderColor = '';
      }, 50);
    });
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  GAME STATE
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
let gameItems    = [];
let gameResults  = {};
let gameScrollId = '';
let gameScrollDate = '';

function buildItems() {
  const items = [];
  let id = 0;

  // MASH (fixed options, part of elimination)
  for (const opt of MASH_OPTIONS) {
    items.push({ id: id++, category: 'mash', value: opt });
  }

  // User categories
  for (const cat of ['partner', 'transport', 'color', 'job', 'kids', 'location']) {
    document.querySelectorAll(`.cat-inputs[data-cat="${cat}"] .mash-input`).forEach(inp => {
      const v = inp.value.trim();
      if (v) items.push({ id: id++, category: cat, value: v });
    });
  }

  return items;
}

function showError(msg) {
  const el = document.getElementById('mashError');
  el.textContent = msg;
  el.style.display = 'block';
}

function clearError() {
  document.getElementById('mashError').style.display = 'none';
}

function validate() {
  clearError();
  if (spiralN < 2) {
    showError(window.i18n ? window.i18n.t('mash.err_spiral') : '\u2726 Draw a spiral on the canvas first \u2014 the crossing count is your magic number!');
    spiralCanvas.style.boxShadow = '0 0 18px rgba(255,107,138,0.5), 0 0 0 2px rgba(255,107,138,0.4)';
    setTimeout(() => { spiralCanvas.style.boxShadow = ''; }, 1800);
    return false;
  }
  for (const cat of ['partner', 'transport', 'color', 'job', 'kids', 'location']) {
    const filled = [...document.querySelectorAll(`.cat-inputs[data-cat="${cat}"] .mash-input`)]
      .filter(i => i.value.trim());
    if (filled.length === 0) {
      const catLabel = window.i18n ? window.i18n.t(CAT_META[cat].labelKey) : (CAT_META[cat].label || cat);
      showError(window.i18n ? window.i18n.t('mash.err_fill').replace('{L}', catLabel) : `\u2726 Please fill in at least one option for "${catLabel}"`);
      return false;
    }
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MASH ALGORITHM — classic counting elimination
// ═══════════════════════════════════════════════════════════════════════════════
function computeElimination(items, n) {
  const alive = items.map(item => ({ ...item, eliminated: false }));
  const categories = [...new Set(items.map(i => i.category))];
  const order = [];

  let lastId = null;

  while (true) {
    const notEliminated = alive.filter(i => !i.eliminated);
    const catCounts = {};
    for (const item of notEliminated) catCounts[item.category] = (catCounts[item.category] || 0) + 1;

    // Stop if all categories have exactly 1 (or 0) items left
    if (categories.every(cat => (catCounts[cat] || 0) <= 1)) break;

    // In MASH, you skip items whose categories are already decided
    const active = notEliminated.filter(i => catCounts[i.category] > 1);
    if (!active.length) break;

    let startIdx = 0;
    if (lastId) {
      // Find the next active item after the last eliminated one
      const origIdx = alive.findIndex(i => i.id === lastId);
      for (let i = 1; i <= alive.length; i++) {
        const nextItem = alive[(origIdx + i) % alive.length];
        const activeIdx = active.findIndex(a => a.id === nextItem.id);
        if (activeIdx !== -1) {
          startIdx = activeIdx;
          break;
        }
      }
    }

    const targetIdx = (startIdx + n - 1) % active.length;
    const target = active[targetIdx];

    alive.find(i => i.id === target.id).eliminated = true;
    order.push(target.id);
    lastId = target.id;
  }

  const results = {};
  for (const item of alive) {
    if (!item.eliminated) results[item.category] = item.value;
  }

  return { alive, order, results };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GAME FLOW
// ═══════════════════════════════════════════════════════════════════════════════
async function predictFuture() {
  if (!validate()) return;

  const items = buildItems();
  gameItems = items;

  const { alive, order, results } = computeElimination(items, spiralN);
  gameResults  = results;
  gameScrollId = 'MS-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  gameScrollDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Go to elimination phase
  document.getElementById('inputCard').style.display = 'none';
  const elimCard = document.getElementById('elimCard');
  elimCard.style.display = 'block';
  document.getElementById('elimN').textContent = spiralN;

  buildElimGrid(items);
  await animateElimination(items, order, results);
  showResult(results);
}

// \u2500\u2500 Build the elimination grid \u2500\u2500
function buildElimGrid(items) {
  const grid = document.getElementById('elimGrid');
  grid.innerHTML = '';
  const catOrder = ['partner', 'transport', 'color', 'job', 'kids', 'location'];

  for (const cat of catOrder) {
    const catItems = items.filter(i => i.category === cat);
    if (!catItems.length) continue;
    const meta = CAT_META[cat];

    const block = document.createElement('div');
    block.className = 'elim-category';
    const catLabel = window.i18n ? window.i18n.t(meta.labelKey) : (meta.label || cat);
    block.innerHTML =
      `<div class="elim-cat-title">${meta.icon} ${catLabel}</div>` +
      `<div class="elim-items" id="ec-${cat}">` +
        catItems.map(it => {
          const valLabel = (it.category === 'mash' && window.i18n) ? window.i18n.t('mash.label_' + it.value.toLowerCase().charAt(0)) : it.value;
          return `<div class="elim-item" id="ei-${it.id}" title="${valLabel}">${valLabel}</div>`;
        }).join('') +
      `</div>`;
    grid.appendChild(block);
  }
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// \u2500\u2500 Animate elimination sequence \u2500\u2500
async function animateElimination(items, order, results) {
  const label = document.getElementById('elimLabel');
  const total  = order.length;

  for (let step = 0; step < total; step++) {
    const id = order[step];
    const item = items.find(i => i.id === id);
    let el = null;
    if (item && item.category === 'mash') {
      const letter = item.value.charAt(0); // 'M', 'A', 'S', 'H'
      el = document.getElementById(`mbox-${letter}`);
    } else {
      el = document.getElementById(`ei-${id}`);
    }

    if (el) {
      el.classList.add('counting');
      await wait(180);
      el.classList.remove('counting');
      el.classList.add('eliminated');
    }
    const remaining = total - step - 1;
    label.textContent = remaining > 0
      ? (window.i18n ? window.i18n.t('mash.anim_remain').replace('{N}', remaining) : `${remaining} choice${remaining !== 1 ? 's' : ''} remain\u2026`)
      : (window.i18n ? window.i18n.t('mash.anim_decided') : 'Fate is decided\u2026');
    await wait(60);
  }

  // Highlight survivors
  for (const [cat, val] of Object.entries(results)) {
    const item = items.find(i => i.category === cat && i.value === val);
    if (!item) continue;
    
    let el = null;
    if (cat === 'mash') {
      const letter = item.value.charAt(0);
      el = document.getElementById(`mbox-${letter}`);
      if (el) { el.classList.remove('eliminated'); el.classList.add('winner'); }
    } else {
      el = document.getElementById(`ei-${item.id}`);
      if (el) { el.classList.remove('eliminated'); el.classList.add('survivor'); }
    }
    await wait(40);
  }

  label.textContent = window.i18n ? window.i18n.t('mash.anim_sealed') : '\u2726 Your destiny is sealed \u2726';
  await wait(700);
}

// \u2500\u2500 Render result scroll \u2500\u2500
function showResult(results) {
  document.getElementById('elimCard').style.display = 'none';
  const wrap = document.getElementById('resultWrap');
  wrap.style.display = 'block';

  const mash      = results.mash      || 'Shack';
  const partner   = results.partner   || '???';
  const transport = results.transport || '\u2014';
  const color     = results.color     || '\u2014';
  const job       = results.job       || '\u2014';
  const kids      = results.kids      || '\u2014';
  const loc       = results.location  || '\u2014';

  // Headline: "Partner, MASH, N kid(s)"
  const kidsNum  = parseInt(kids, 10);
  const mashLabel = window.i18n ? window.i18n.t('mash.label_' + mash.toLowerCase().charAt(0)) : mash;
  const kidLabel = !isNaN(kidsNum) 
    ? (window.i18n ? window.i18n.t('mash.kids_label').replace('{N}', kids) : `${kids} Kid${kidsNum !== 1 ? 's' : ''}`)
    : kids;
  document.getElementById('rHeadline').textContent =
    `${partner}, ${mashLabel}, ${kidLabel}`;

  // Summary sentence
  const decreeMsg = window.i18n && DECREES[mash] ? window.i18n.t(DECREES[mash]) : (DECREES[mash] || '');
  document.getElementById('rSummary').textContent =
    window.i18n ? window.i18n.t('mash.summary_text')
      .replace('{JOB}', job)
      .replace('{CAR}', transport)
      .replace('{COLOR}', color)
      .replace('{DECREE}', decreeMsg)
    : `A ${job.toLowerCase()} life. ${transport}. ${color} everything. ${decreeMsg}`;

  // Detail cards
  const cards = [
    { id: 'rPartner',   icon: '<i data-lucide="heart"></i>', label: window.i18n ? window.i18n.t('mash.cat_partner') : 'Partner',    value: partner },
    { id: 'rMash',      icon: MASH_EMOJIS[mash] || '<i data-lucide="house"></i>', label: window.i18n ? window.i18n.t('mash.cat_home') : 'Home', value: mashLabel },
    { id: 'rJob',       icon: '<i data-lucide="briefcase"></i>', label: window.i18n ? window.i18n.t('mash.cat_job') : 'Job', value: job },
    { id: 'rTransport', icon: '<i data-lucide="rocket"></i>', label: window.i18n ? window.i18n.t('mash.cat_car') : 'Car',  value: color + '  ' + transport },
    { id: 'rKids',      icon: '<i data-lucide="baby"></i>', label: window.i18n ? window.i18n.t('mash.cat_kids') : 'Kids',  value: kids },
    { id: 'rLocation',  icon: '<i data-lucide="map-pin"></i>', label: window.i18n ? window.i18n.t('mash.cat_location') : 'Location', value: loc }
  ];

  cards.forEach(c => {
    document.getElementById(c.id).innerHTML =
      `<div class="scroll-detail-label">${c.icon} ${c.label}</div><div class="scroll-detail-value">${c.value}</div>`;
  });

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('rDecree').textContent = decreeMsg;
  document.getElementById('rId').textContent   = gameScrollId;
  document.getElementById('rDate').textContent = gameScrollDate;

  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// \u2500\u2500 Reset \u2500\u2500
function resetGame() {
  // Reset MASH boxes
  ['M','A','S','H'].forEach(l => {
    const b = document.getElementById(`mbox-${l}`);
    if (b) b.classList.remove('winner', 'eliminated');
  });

  document.getElementById('resultWrap').style.display = 'none';
  document.getElementById('elimCard').style.display   = 'none';
  document.getElementById('inputCard').style.display  = 'block';
  document.querySelectorAll('.mash-input').forEach(i => { i.value = ''; });
  clearSpiral();
  clearError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════
//  CANVAS PNG DOWNLOAD
// ═══════════════════════════════════════════════
function buildResultCanvas(cb) {
  const node = document.querySelector('.result-scroll');
  const oldAnim = node.style.animation;
  const oldTransform = node.style.transform;
  
  // Temporarily reset animations/transforms for a clean, straight capture
  node.style.animation = 'none';
  node.style.transform = 'none';

  html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#2A2641' // inner card color
  }).then(canvas => {
    // Restore styling
    node.style.animation = oldAnim;
    node.style.transform = oldTransform;

    // Create a final canvas with plain purple padding
    const pad = 100; // 100px padding around the card
    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = canvas.width + pad * 2;
    paddedCanvas.height = canvas.height + pad * 2;
    const ctx = paddedCanvas.getContext('2d');

    // Fill plain purple background (matches Image 2 requested style)
    ctx.fillStyle = '#393452';
    ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

    // Draw the captured card with a shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    ctx.drawImage(canvas, pad, pad);

    cb(paddedCanvas);
  }).catch(err => {
    console.error("Canvas capture failed", err);
    node.style.animation = oldAnim;
    node.style.transform = oldTransform;
  });
}

// \u2500 Download \u2500
function downloadResult() {
  buildResultCanvas(c => {
    const link = document.createElement('a');
    const partnerSlug = (gameResults.partner || 'Result').replace(/\s+/g, '_');
    link.download = `MASH_${partnerSlug}.png`;
    link.href = c.toDataURL('image/png');
    link.click();
  });
}

// \u2500 Share \u2500
async function shareResult() {
  buildResultCanvas(c => {
    c.toBlob(async blob => {
      const file = new File([blob], 'MASH_result.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          const mashLabel = window.i18n ? window.i18n.t('mash.label_' + (gameResults.mash || 'Shack').toLowerCase().charAt(0)) : (gameResults.mash || 'Shack');
          await navigator.share({
            title: window.i18n ? window.i18n.t('mash.share_title') : 'My MASH Future!',
            text: window.i18n ? window.i18n.t('mash.share_text').replace('{MASH}', mashLabel).replace('{PARTNER}', gameResults.partner || '???') : `\uD83C\uDFE0 ${mashLabel} with ${gameResults.partner || '???'} \u2014 revealed by LADS SIMULATOR`,
            files: [file]
          });
        } catch (err) {
          if (err.name !== 'AbortError') fallbackShare();
        }
      } else { fallbackShare(); }
    });
  });
}

function fallbackShare() {
  const mashLabel = window.i18n ? window.i18n.t('mash.label_' + (gameResults.mash || 'Shack').toLowerCase().charAt(0)) : (gameResults.mash || 'Shack');
  const text = window.i18n ? window.i18n.t('mash.share_text_full').replace('{MASH}', mashLabel).replace('{PARTNER}', gameResults.partner || '???') : `\uD83C\uDFE0 ${mashLabel} with ${gameResults.partner || '???'} \u2014 my MASH destiny revealed at LADS SIMULATOR!`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert(window.i18n ? window.i18n.t('mash.copied') : '\u2726 Result text copied to clipboard!'));
  } else {
    alert(text);
  }
}

// ═══════════════════════════════════════════════
//  AUDIO BRIDGE
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic  = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');

  if (musicToggle) {
    if (typeof AudioBridge !== 'undefined') {
      AudioBridge.init(bgMusic, 'music-icon-play', 'music-icon-pause');
      musicToggle.addEventListener('click', () => {
        AudioBridge.toggle(bgMusic, 'music-icon-play', 'music-icon-pause');
      });
    } else {
      musicToggle.addEventListener('click', () => {
        const playSVG = document.getElementById('music-icon-play');
        const pauseSVG = document.getElementById('music-icon-pause');
        if (bgMusic.paused) {
          bgMusic.play().catch(() => {});
          if(playSVG) playSVG.style.display = 'none';
          if(pauseSVG) pauseSVG.style.display = '';
        } else {
          bgMusic.pause();
          if(playSVG) playSVG.style.display = '';
          if(pauseSVG) pauseSVG.style.display = 'none';
        }
      });
    }
  }
});
