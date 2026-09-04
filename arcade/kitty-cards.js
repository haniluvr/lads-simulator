// kitty-cards.js — Kitty Cards Card Game
// Normal Mode: Number cards only, 3×3 board (center = shared deck)
// Advanced Mode: Number + Assist cards, two-phase turns

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════
  //  CONSTANTS & ASSET PATHS
  // ═══════════════════════════════════════════════════════

  const ASSET_BASE = '../assets/ui/arcade/kitty-cards';
  const SELECT_BASE = '../assets/ui/select';

  const CARD_COLORS = ['brown', 'green', 'purple', 'red'];
  const CUP_COLORS  = ['brown', 'green', 'purple', 'red', 'white'];
  const CARD_VALUES = [1, 2, 3, 4, 5, 6];

  // ── Assist Card Definitions ──────────────────────────────
  const ASSIST_CARD_TYPES = [
    { key: 'skip',       name: 'Skip',       img: `${ASSET_BASE}/assist/Skip Card.png`,       desc: 'Your opponent skips their Number Card Phase next turn.' },
    { key: 'freeze',     name: 'Freeze',     img: `${ASSET_BASE}/assist/Freeze Card.png`,     desc: 'Your opponent skips their Assist Card Phase next turn.' },
    { key: 'meow_this', name: 'Meow This!', img: `${ASSET_BASE}/assist/Meow This! Card.png`, desc: 'Cancel an opponent assist card when they play one.' },
    { key: 'cat_ching',  name: 'Cat-Ching!', img: `${ASSET_BASE}/assist/Cat-Ching Card.png`,  desc: 'Draw 2 Number Cards.' },
    { key: 'skip',       name: 'Skip',       img: `${ASSET_BASE}/assist/Skip Card.webp`,       desc: 'Your opponent skips their Number Card Phase next turn.' },
    { key: 'freeze',     name: 'Freeze',     img: `${ASSET_BASE}/assist/Freeze Card.webp`,     desc: 'Your opponent skips their Assist Card Phase next turn.' },
    { key: 'meow_this', name: 'Meow This!', img: `${ASSET_BASE}/assist/Meow This! Card.webp`, desc: 'Cancel an opponent assist card when they play one.' },
    { key: 'cat_ching',  name: 'Cat-Ching!', img: `${ASSET_BASE}/assist/Cat-Ching Card.webp`,  desc: 'Draw 2 Number Cards.' },
    { key: 'kitty_plot', name: 'Kitty Plot', img: `${ASSET_BASE}/assist/Kitty Plot Card.webp`, desc: 'Draw 2 Assist Cards, then discard 1 card.' },
    { key: 'purrceive',  name: 'Purrceive',  img: `${ASSET_BASE}/assist/Purrceive Card.webp`,  desc: 'See 3 random opponent cards and discard one.' },
    { key: 'meowster',   name: 'Meowster',   img: `${ASSET_BASE}/assist/Meowster Card.webp`,   desc: 'Pick from the last 5 assist cards your opponent played.' },
    { key: 'purrator',   name: 'Purrator',   img: `${ASSET_BASE}/assist/Purrator Card.webp`,   desc: 'Change a cup to any color.' },
    { key: 'kitty_pow',  name: 'Kitty Pow!', img: `${ASSET_BASE}/assist/Kitty Pow Card.webp`,  desc: 'Both players discard all their Number Cards.' },
    { key: 'magic_paw',  name: 'Magic Paw',  img: `${ASSET_BASE}/assist/Magic Paw Card.webp`,  desc: 'Reduce a kitty placed by your opponent to 1 point.' },
    { key: 'bye_bye',    name: 'Bye-Bye!',   img: `${ASSET_BASE}/assist/Bye-Bye Card.webp`,    desc: 'Discard a card placed on any cup.' },
    { key: 'paw_combo',  name: 'Paw Combo',  img: `${ASSET_BASE}/assist/Paw Combo Card.webp`,  desc: 'Play two Number Cards this turn.' },
  ];

  const assistCardImg = (key) => {
    const def = ASSIST_CARD_TYPES.find(c => c.key === key);
    return def ? def.img : '';
  };
  const assistCardBackImg = () => `${ASSET_BASE}/back/assist_card.webp`;

  // Card image path helper
  const cardImg = (color, value) =>
    `${ASSET_BASE}/numbers/${capitalize(color)}/${value}.png`;

  const cupImg = (color) =>
    `${ASSET_BASE}/cups/${color} cup.png`;

  const catImg = (color) =>
    `${ASSET_BASE}/${color} cat.png`;

  const cardBackImg = () =>
    `${ASSET_BASE}/back/number_card.png`;

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ═══════════════════════════════════════════════════════
  //  COMPANION DEFINITIONS
  // ═══════════════════════════════════════════════════════

  const AI_TRAITS = {
    xavier:  { scarcityWeight: 0.4, wasteAversion: 0.3, hoardAssist: 0.65, mercy: 0.4, meowGuard: 0.5 },
    zayne:   { scarcityWeight: 0.7, wasteAversion: 0.6, hoardAssist: 0.80, mercy: 0.0, meowGuard: 0.6 },
    rafayel: { scarcityWeight: 0.5, wasteAversion: 0.2, hoardAssist: 0.40, mercy: 0.0, meowGuard: 0.3 },
    sylus:   { scarcityWeight: 0.8, wasteAversion: 0.1, hoardAssist: 0.45, mercy: 0.15, meowGuard: 0.7 },
    caleb:   { scarcityWeight: 0.2, wasteAversion: 0.0, hoardAssist: 0.35, mercy: 0.0, meowGuard: 0.4 },
    valko:   { scarcityWeight: 0.9, wasteAversion: 0.5, hoardAssist: 0.55, mercy: 0.0, meowGuard: 0.9 },
  };

  const COMPANIONS = {
    xavier: {
      name: 'Xavier',
      color: '#8B6DC4',
      avatar: `${SELECT_BASE}/xavier.webp`,
      orderDialogues: [
        '"Hey... do you want to go first? I don\'t mind either way."',
        '"I\'ll leave it up to you. Though I might fall asleep if you take too long..."',
        '"After you, or shall I? I\'m flexible."',
      ],
      orderChoices: ['You go first', 'I\'ll go first'],
      orderLogic: (choice) => choice === 0 ? 'ai' : 'player', // "You go first" = AI first
      strategy: 'balanced',
      cheat: 'sleep',
      style: 'Xavier plays methodically, preferring matched cups for double points.',
    },
    zayne: {
      name: 'Zayne',
      color: '#2d5e8f',
      avatar: `${SELECT_BASE}/zayne.webp`,
      orderDialogues: [
        '"Who goes first is your call. Don\'t overthink it."',
        '"You can go first. I\'m not in a rush."',
        '"I\'ll let you decide. Though I have a feeling you\'ll make me go first regardless."',
      ],
      orderChoices: ['You go first', 'I\'ll go first'],
      orderLogic: (choice) => {
        // 20% chance Zayne insists player goes first
        if (Math.random() < 0.2) return 'player'; // Zayne insists
        return choice === 0 ? 'ai' : 'player';
      },
      orderInsistText: '"I\'ve already decided. You\'re going first."',
      strategy: 'conservative',
      cheat: 'trade',
      style: 'Zayne plays conservatively, saving cards and prioritizing end-game plays.',
    },
    rafayel: {
      name: 'Rafayel',
      color: '#E8A0B4',
      avatar: `${SELECT_BASE}/rafayel.webp`,
      orderDialogues: [
        '"Oh? Who goes first? Let\'s see... I\'ll let you choose."',
        '"You can go first if you want. Or I will. Doesn\'t matter to me~"',
        '"Hmm, decisions decisions. Fine, you pick."',
      ],
      orderChoices: ['You go first', 'I\'ll go first'],
      orderLogic: (choice) => {
        // 40% chance Rafayel decides to go first himself
        if (Math.random() < 0.40) return 'ai'; // Rafayel insists going first
        return choice === 0 ? 'ai' : 'player';
      },
      orderInsistText: '"Actually, I want to go first. Don\'t argue."',
      strategy: 'defensive',
      cheat: 'steal',
      style: 'Rafayel plays defensively, blocking colored cups even without scoring.',
    },
    sylus: {
      name: 'Sylus',
      color: '#C45A5A',
      avatar: `${SELECT_BASE}/sylus.webp`,
      orderDialogues: [
        '"You may choose."',
        '"First or second — whichever you prefer. I adapt."',
        '"Does it matter? I win either way."',
      ],
      orderChoices: ['You go first', 'I\'ll go first'],
      orderLogic: (choice) => choice === 0 ? 'ai' : 'player',
      strategy: 'locking',
      cheat: 'trade-forced',
      style: 'Sylus locks players out by claiming and marking cups early.',
    },
    caleb: {
      name: 'Caleb',
      color: '#D4845A',
      avatar: `${SELECT_BASE}/caleb.webp`,
      orderDialogues: [
        '"Rock paper scissors! Loser goes second, deal?"',
        '"Let\'s settle this properly. Rock paper scissors, one round!"',
        '"We can see who goes first with rock paper scissors."',
        '"Will you strike first or bide your time?"',
        '"I\'ll let you decide who goes first."',
        '"Do you want to go first, or should I?"'
      ],
      orderChoices: ['You go first', 'I\'ll go first'],
      orderLogic: (choice) => choice === 0 ? 'player' : 'ai',
      strategy: 'sneaky',
      cheat: 'draw',
      style: 'Caleb plays unpredictably, occasionally sneaking extra cards.',
    },
    valko: {
      name: 'Valko',
      color: '#c9a96e',
      avatar: `${SELECT_BASE}/valko.webp`,
      orderDialogues: [
        '"You decide. But if I go second... consider it a gift."',
        '"First or second? Choose wisely."',
        '"I\'ll follow your lead. For now."',
      ],
      orderChoices: ['You go first', 'I\'ll go first'],
      orderLogic: (choice) => {
        // If player lets Valko go first (ai goes first = choice 0), he steals a card
        return choice === 0 ? 'ai' : 'player';
      },
      secondPenaltyText: '"Stepped into my territory, did you? Hand one over."',
      strategy: 'predatory',
      cheat: 'cover-or-lock',
      style: 'Valko is predatory — hunts your highest-value cups and counter-attacks aggressively.',
    },
  };

  // ═══════════════════════════════════════════════════════
  //  DOM REFERENCES
  // ═══════════════════════════════════════════════════════

  const screen       = document.getElementById('kc-screen');

  // Screens
  const charSelectEl  = document.getElementById('kc-char-select');
  const orderScreenEl = document.getElementById('kc-order-screen');
  const rpsScreenEl   = document.getElementById('kc-rps-screen');
  const boardEl       = document.getElementById('kc-board');
  const resultsEl     = document.getElementById('kc-results-screen');

  // Char select
  const charGrid       = charSelectEl.querySelector('.kc-char-grid');
  const charConfirmBtn = document.getElementById('kc-char-confirm-btn');
  const exitCharBtn    = document.getElementById('kc-exit-char-btn');

  // Order screen
  const orderPortrait = document.getElementById('kc-order-portrait');
  const orderSpeaker  = document.getElementById('kc-order-speaker');
  const orderText     = document.getElementById('kc-order-text');
  const orderChoices  = document.getElementById('kc-order-choices');
  const backToCharBtn = document.getElementById('kc-back-to-char-btn');

  // RPS screen
  const rpsText        = document.getElementById('kc-rps-text');
  const rpsChoices     = document.getElementById('kc-rps-choices');
  const rpsResult      = document.getElementById('kc-rps-result');
  const rpsContinueBtn = document.getElementById('kc-rps-continue-btn');

  // Board
  const aiHandEl      = document.getElementById('kc-ai-hand');
  const cupGridEl     = document.getElementById('kc-cup-grid');
  const playerHandEl  = document.getElementById('kc-player-hand');
  const statusMsgEl   = document.getElementById('kc-status-msg');
  const gameExitBtn   = document.getElementById('kc-game-exit-btn');
  const passAssistBtn = document.getElementById('kc-adv-pass-assist-btn');
  const aiScoreEl     = document.getElementById('kc-ai-score');
  const playerScoreEl = document.getElementById('kc-player-score');
  const turnBadgeEl   = document.getElementById('kc-turn-badge');
  const aiAvatarEl    = document.getElementById('kc-ai-avatar');
  const aiNameLabel   = document.getElementById('kc-ai-name-label');
  const aiHandLabel   = document.getElementById('kc-ai-hand-label-name');

  // Results
  const winnerBannerEl  = document.getElementById('kc-winner-banner');
  const winnerTextEl    = document.getElementById('kc-winner-text');
  const winnerSubEl     = document.getElementById('kc-winner-sub');
  const resultPlayerPts = document.getElementById('kc-result-player-pts');
  const resultAiPts     = document.getElementById('kc-result-ai-pts');
  const resultAiAvatar  = document.getElementById('kc-result-ai-avatar');
  const resultAiName    = document.getElementById('kc-result-ai-name');
  const resultPlayerPanel = document.getElementById('kc-result-player-panel');
  const resultAiPanel     = document.getElementById('kc-result-ai-panel');
  const playAgainBtn    = document.getElementById('kc-play-again-btn');
  const resultsExitBtn  = document.getElementById('kc-results-exit-btn');

  // Cheat overlays
  const cheatXavier      = document.getElementById('kc-cheat-xavier');
  const cheatZayne       = document.getElementById('kc-cheat-zayne');
  const cheatZayneUndo   = document.getElementById('kc-cheat-zayne-undo');
  const cheatRafayel     = document.getElementById('kc-cheat-rafayel');
  const cheatRafayelCaught = document.getElementById('kc-cheat-rafayel-caught');
  const cheatRafayelPlayerSwap = document.getElementById('kc-cheat-rafayel-player-swap');
  const cheatSylusOffer = document.getElementById('kc-cheat-sylus-offer');
  const cheatSylus       = document.getElementById('kc-cheat-sylus');
  const cheatCaleb       = document.getElementById('kc-cheat-caleb');
  const cheatValko       = document.getElementById('kc-cheat-valko');

  // Mode Select & Match UI
  const modeNormalBtn    = document.getElementById('kc-mode-normal-btn');
  const modeAdvancedBtn  = document.getElementById('kc-mode-advanced-btn');
  const exitModeBtn      = document.getElementById('kc-exit-mode-btn');
  const matchTracker     = document.getElementById('kc-match-tracker');
  const matchWinsPlayerEl= document.getElementById('kc-match-wins-player');
  const matchWinsAiEl    = document.getElementById('kc-match-wins-ai');
  const matchRoundNumEl  = document.getElementById('kc-match-round-num');
  const matchAiNameEl    = document.getElementById('kc-match-tracker-ai-name');
  
  // Forfeit Dialog
  const cheatForfeit       = document.getElementById('kc-cheat-forfeit');
  const forfeitPortrait    = document.getElementById('kc-forfeit-portrait');
  const forfeitSpeaker     = document.getElementById('kc-forfeit-speaker');
  const forfeitDesc        = document.getElementById('kc-forfeit-desc');
  const forfeitAcceptBtn   = document.getElementById('kc-forfeit-accept-btn');
  const forfeitRefuseBtn   = document.getElementById('kc-forfeit-refuse-btn');

  // Toast
  const toastEl = document.getElementById('kc-toast');

  // ═══════════════════════════════════════════════════════
  //  GAME STATE
  // ═══════════════════════════════════════════════════════

  let state = {
    gameMode: null,        // 'normal' | 'advanced'
    currentRound: 1,       // 1, 2, 3
    matchWinsPlayer: 0,
    matchWinsAi: 0,
    initialFirstPlayer: null, // who started round 1
    companion: null,       // companion key
    firstPlayer: null,     // 'player' | 'ai'
    currentTurn: null,     // 'player' | 'ai'
    deck: [],              // remaining draw pile
    playerHand: [],        // player's number cards
    aiHand: [],            // ai's number cards
    cups: [],              // 8 cup objects: {color, card:null, owner:null}
    playerScore: 0,
    aiScore: 0,
    selectedCard: null,    // index in playerHand
    phase: 'mode-select',  // mode-select | select | order | rps | playing | cheat | results
    placingCard: false,    // true when player is choosing a cup to place in
    cheatActive: null,     // which cheat is showing
    aiAggressionLevel: 0,  // Valko only — tracks if counter-attack mode active
    zayneTradePending: null,
    zayneTradeHistory: null,
    xavierSwapFirst: null, // first cup selected for swap
    consecutiveAiTurns: 0, // Valko board-clearing tracking
    boardCleared: false,
    difficulty: 'normal',  // Zayne only: 'easy' | 'normal' | 'hell'
    // ── Advanced Mode ──
    assistDeck: [],          // assist card draw pile
    playerAssistHand: [],    // player's assist cards
    aiAssistHand: [],        // ai's assist cards (shown face-down)
    advancedPhase: 'assist', // 'assist' | 'number' — current sub-phase
    playerSkipNumber: false,
    playerSkipAssist: false,
    aiSkipNumber: false,
    aiSkipAssist: false,
    pawComboActive: false,
    pawComboCount: 0,
    playerAssistHistory: [], // last 5 assist cards played by player
    aiAssistHistory: [],     // last 5 assist cards played by ai
  };

  // ═══════════════════════════════════════════════════════
  //  UTILITY
  // ═══════════════════════════════════════════════════════

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  let toastTimer = null;
  function showToast(msg, dur = 2000) {
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), dur);
  }

  function setStatus(msg) {
    if (statusMsgEl) statusMsgEl.innerHTML = msg;
  }

  const zayneDiffScreenEl = document.getElementById('kc-zayne-diff-screen');

  function showScreen(name) {
    const modeSelectEl = document.getElementById('kc-mode-select');
    [modeSelectEl, charSelectEl, orderScreenEl, zayneDiffScreenEl, rpsScreenEl, boardEl, resultsEl].forEach(el => {
      if (el) el.classList.remove('active');
    });
    const map = {
      'mode-select': document.getElementById('kc-mode-select'),
      select: charSelectEl, order: orderScreenEl,
      zayne_diff: zayneDiffScreenEl,
      rps: rpsScreenEl, board: boardEl, results: resultsEl,
    };
    if (map[name]) map[name].classList.add('active');

    const screenEl = document.getElementById('kc-screen');
    if (name === 'board') {
      screenEl.classList.add('in-game');
    } else {
      screenEl.classList.remove('in-game');
    }

    // Re-apply lucide icons after DOM change
    setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 50);
  }

  function calcPoints(card, cup) {
    if (!card || !cup) return 0;
    if (cup.color === 'white') return card.value;
    if (card.color === cup.color) return card.value * 2;
    return 0;
  }

  function getCardImgSrc(card) {
    if (!card) return cardBackImg();
    return cardImg(card.color, card.value);
  }

  function applyCompanionTheme(key) {
    screen.dataset.companion = key;
    const c = COMPANIONS[key];
    document.documentElement.style.setProperty('--companion-color', c.color);
  }

  // ═══════════════════════════════════════════════════════
  //  DECK BUILDER
  // ═══════════════════════════════════════════════════════

  function buildDeck() {
    const cards = [];
    for (const color of CARD_COLORS) {
      for (const value of CARD_VALUES) {
        cards.push({ color, value });
      }
    }
    return shuffle(cards);
  }

  function buildCups() {
    // 8 cups total: 4 white, 4 random colored cups
    const colors = ['white', 'white', 'white', 'white'];
    
    // Add 4 random colored cups from the CARD_COLORS pool
    for (let i = 0; i < 4; i++) {
      colors.push(rand(CARD_COLORS));
    }
    
    const shuffledColors = shuffle(colors);
    return shuffledColors.map(color => ({ color, card: null, owner: null, sylvsMarked: false }));
  }

  // ═══════════════════════════════════════════════════════
  //  UI RENDERING
  // ═══════════════════════════════════════════════════════

  function renderCupGrid() {
    cupGridEl.innerHTML = '';
    // 3×3: positions 0-8, index 4 = center (deck)
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'kc-cup-cell';
      cell.dataset.pos = i;

      if (i === 4) {
        // Center cell: in normal mode = single number deck; in advanced = dual deck
        if (state.gameMode === 'advanced') {
          cell.classList.add('deck-cell', 'adv-deck-cell');
          renderAdvancedDeckCell(cell);
        } else {
          cell.classList.add('deck-cell');
          renderDeckCell(cell);
        }
      } else {
        // Cup cell
        const cupIdx = i < 4 ? i : i - 1; // map grid pos to cup index (skip center)
        const cup = state.cups[cupIdx];
        cell.dataset.cup = cupIdx;
        cell.dataset.cupColor = cup.color;
        renderCupCell(cell, cup, cupIdx);
      }

      cupGridEl.appendChild(cell);
    }
  }

  function renderAdvancedDeckCell(cell) {
    cell.innerHTML = '';
    
    // Check combined decks
    if (state.deck.length > 0 || state.assistDeck.length > 0) {
      const wrapper = document.createElement('div');
      wrapper.className = 'kc-adv-deck-wrapper';
      
      if (state.deck.length > 0) {
        const img = document.createElement('img');
        img.src = cardBackImg();
        img.alt = 'Draw pile';
        img.className = 'kc-deck-back-img kc-num-deck-img';
        img.draggable = false;
        wrapper.appendChild(img);
      }
      if (state.assistDeck.length > 0) {
        const imgAssist = document.createElement('img');
        imgAssist.src = assistCardBackImg();
        imgAssist.alt = 'Assist pile';
        imgAssist.className = 'kc-deck-back-img kc-assist-deck-img';
        imgAssist.draggable = false;
        wrapper.appendChild(imgAssist);
      }
      cell.appendChild(wrapper);
      
      // Draw action on click when it's player's turn and not placing
      // In advanced mode, drawing is only allowed during number phase
      if (state.currentTurn === 'player' && state.phase === 'playing' && !state.placingCard && state.advancedPhase === 'number') {
        if (state.playerSkipNumber) {
          cell.style.cursor = 'default';
        } else {
          cell.style.cursor = 'pointer';
          const badge = document.createElement('div');
          badge.className = 'kc-deck-draw-badge';
          badge.textContent = 'Draw';
          cell.appendChild(badge);
        }
      } else {
        cell.style.cursor = 'default';
      }
    } else {
      cell.innerHTML = '';
      cell.style.cursor = 'default';
      cell.classList.add('empty');
    }
  }

  function renderDeckCell(cell) {
    cell.innerHTML = '';
    if (state.deck.length > 0) {
      const img = document.createElement('img');
      img.src = cardBackImg();
      img.alt = 'Draw pile';
      img.className = 'kc-deck-back-img';
      img.draggable = false;
      cell.appendChild(img);

      if (state.currentTurn === 'player' && state.phase === 'playing' && !state.placingCard) {
        cell.style.cursor = 'pointer';
        const badge = document.createElement('div');
        badge.className = 'kc-deck-draw-badge';
        badge.textContent = 'Draw';
        cell.appendChild(badge);
      } else {
        cell.style.cursor = 'default';
      }
    } else {
      cell.innerHTML = '';
      cell.style.cursor = 'default';
      cell.classList.add('empty');
    }
  }

  function renderCupCell(cell, cup, cupIdx) {
    cell.innerHTML = '';
    cell.classList.remove('cup-available', 'cup-occupied', 'swap-candidate', 'swap-selected', 'sylus-locked', 'valko-locked', 'valko-target-glow');

    // Cup background tint via data attr handled by CSS
    cell.dataset.cupColor = cup.color;

    if (state._valkoTargetGlow && state._valkoTargetGlow.i === cupIdx) cell.classList.add('valko-target-glow');
    if (cup.sylvsMarked) cell.classList.add('sylus-locked');

    const cupI = document.createElement('img');
    cupI.src = cupImg(cup.color);
    cupI.alt = `${cup.color} cup`;
    cupI.className = 'kc-cup-img';
    cupI.draggable = false;
    cell.appendChild(cupI);

    if (cup.card) {
      cell.classList.add('cup-occupied');
      // Card overlay
      const overlay = document.createElement('div');
      overlay.className = 'kc-cup-card-overlay';
      const cardI = document.createElement('img');
      cardI.src = getCardImgSrc(cup.card);
      cardI.alt = `${cup.card.color} ${cup.card.value}`;
      cardI.className = 'kc-cup-card-img';
      cardI.draggable = false;
      overlay.appendChild(cardI);
      cell.appendChild(overlay);

      // Points badge
      const pts = calcPoints(cup.card, cup);
      const badge = document.createElement('span');
      badge.className = 'kc-cup-points-badge';
      if (cup.card.color === cup.color) {
        badge.classList.add('matched');
        badge.textContent = `${cup.card.value} × 2`;
      } else if (cup.color === 'white') {
        badge.classList.add('standard');
        badge.textContent = `+${pts}`;
      } else {
        badge.classList.add('zero');
        badge.textContent = '0';
      }
      cell.appendChild(badge);

      // Owner highlight
      const dot = document.createElement('div');
      dot.className = `kc-cup-owner-dot ${cup.owner}`;
      cell.insertBefore(dot, cell.firstChild);
    }

    // Highlight available cups during placement
    if (state.placingCard && !cup.card && state.currentTurn === 'player') {
      cell.classList.add('cup-available');
    }
  }

  function renderPlayerHand() {
    playerHandEl.innerHTML = '';
    
    if (state.gameMode === 'advanced') {
      const allCards = [
        ...state.playerHand.map((c, i) => ({ card: c, idx: i, isAssist: false })),
        ...state.playerAssistHand.map((c, i) => ({ card: c, idx: i, isAssist: true }))
      ];

      for (let i = 0; i < allCards.length; i += 5) {
        const rowEl = document.createElement('div');
        rowEl.className = 'kc-hand-row';
        rowEl.style.zIndex = Math.floor(i / 5) + 1;
        
        const chunk = allCards.slice(i, i + 5);
        chunk.forEach((item) => {
          let el;
          if (item.isAssist) {
            el = createCardElement(item.card, false, item.idx, true);
            const isMeowThis = item.card.key === 'meow_this';
            if (state.advancedPhase === 'assist' || isMeowThis) {
              el.addEventListener('click', () => onPlayerAssistCardClick(item.idx));
              // Dim unplayable assist cards so the player can tell at a glance
              const eligibility = canPlayAssistCard(item.card.key, false);
              if (!eligibility.playable && !isMeowThis) {
                el.classList.add('not-playable');
                el.title = eligibility.reason; // tooltip on hover
              }
            } else {
              el.classList.add('disabled');
            }
          } else {
            el = createCardElement(item.card, false, item.idx);
            if (state.advancedPhase === 'number') {
              el.addEventListener('click', () => onPlayerCardClick(item.idx));
            }
          }
          rowEl.appendChild(el);
        });
        playerHandEl.appendChild(rowEl);
      }
    } else {
      // Normal mode
      const hand = state.playerHand;
      for (let i = 0; i < hand.length; i += 5) {
        const rowEl = document.createElement('div');
        rowEl.className = 'kc-hand-row';
        rowEl.style.zIndex = Math.floor(i / 5) + 1;
        const chunk = hand.slice(i, i + 5);
        chunk.forEach((card, j) => {
          const idx = i + j;
          const el = createCardElement(card, false, idx);
          el.addEventListener('click', () => onPlayerCardClick(idx));
          rowEl.appendChild(el);
        });
        playerHandEl.appendChild(rowEl);
      }
    }
  }

  function renderAiHand() {
    aiHandEl.innerHTML = '';
    // In advanced mode: interleave number + assist cards face-down in deal order
    const totalAiCards = state.aiHand.length + (state.gameMode === 'advanced' ? state.aiAssistHand.length : 0);
    const allCards = [
      ...state.aiHand.map((c, i) => ({ isAssist: false, idx: i })),
      ...(state.gameMode === 'advanced' ? state.aiAssistHand.map((c, i) => ({ isAssist: true, idx: i })) : [])
    ];
    
    for (let i = 0; i < allCards.length; i += 5) {
      const rowEl = document.createElement('div');
      rowEl.className = 'kc-hand-row';
      rowEl.style.zIndex = Math.floor(i / 5) + 1;
      
      const chunk = allCards.slice(i, i + 5);
      chunk.forEach((item) => {
        let el;
        if (item.isAssist) {
          el = createCardElement(null, true, item.idx, true); // face-down
        } else {
          el = createCardElement(null, true, item.idx);
        }
        rowEl.appendChild(el);
      });
      aiHandEl.appendChild(rowEl);
    }
  }

  function createCardElement(card, faceDown, idx, isAssist = false) {
    const el = document.createElement('div');
    el.className = 'kc-card' + (faceDown ? ' face-down' : '');
    el.dataset.idx = idx;

    const img = document.createElement('img');
    if (faceDown) {
       img.src = isAssist ? assistCardBackImg() : cardBackImg();
       img.alt = isAssist ? 'Assist card' : 'card';
    } else {
       img.src = isAssist ? card.img : getCardImgSrc(card);
       img.alt = isAssist ? card.name : `${card.color} ${card.value}`;
       if (isAssist) el.title = `${card.name}: ${card.desc}`;
    }
    img.draggable = false;
    el.appendChild(img);

    if (!faceDown && ((!isAssist && idx === state.selectedCard) || (isAssist && idx === state.selectedAssistCard))) {
      el.classList.add('selected');
    }

    return el;
  }

  function renderScores() {
    playerScoreEl.textContent = state.playerScore;
    aiScoreEl.textContent = state.aiScore;
  }

  function updateTurnBadge() {
    if (state.currentTurn === 'player') {
      document.body.classList.remove('kc-ai-turn-active');
      let badgeText = 'Your Turn';
      if (state.gameMode === 'advanced') {
        badgeText += state.advancedPhase === 'assist' ? ' — Assist' : ' — Number';
        if (state.aiSkipNumber) badgeText += ' <span class="kc-skip-badge">SKIP PENDING</span>';
        if (state.aiSkipAssist) badgeText += ' <span class="kc-freeze-badge">FREEZE PENDING</span>';
      }
      turnBadgeEl.innerHTML = badgeText;
      turnBadgeEl.classList.add('your-turn');
    } else {
      document.body.classList.add('kc-ai-turn-active');
      turnBadgeEl.classList.remove('your-turn');
      const dots = `<span class="kc-thinking-dots"><span></span><span></span><span></span></span>`;
      turnBadgeEl.innerHTML = `${COMPANIONS[state.companion].name} ${dots}`;
    }
  }

  // ═══════════════════════════════════════════════════════
  //  GAME SETUP
  // ═══════════════════════════════════════════════════════

  function startGame(companionKey, firstPlayer, difficulty = 'normal') {
    const c = COMPANIONS[companionKey];
    
    // Initialize Match
    state.companion = companionKey;
    state.initialFirstPlayer = firstPlayer;
    state.difficulty = difficulty;
    state.matchWinsPlayer = 0;
    state.matchWinsAi = 0;
    state.currentRound = 1;

    // Apply companion theme
    applyCompanionTheme(companionKey);
    aiAvatarEl.src = c.avatar;
    aiAvatarEl.alt = c.name;
    resultAiAvatar.src = c.avatar;
    resultAiAvatar.alt = c.name;
    aiNameLabel.textContent = c.name;
    aiHandLabel.textContent = c.name + '\'s';
    matchAiNameEl.textContent = c.name;

    if (state.gameMode === 'normal') {
      matchTracker.style.display = 'flex';
      updateMatchTracker();
    } else {
      matchTracker.style.display = 'none';
    }

    startRound();
  }

  function startRound() {
    // Determine who goes first this round (alternates in normal mode)
    let currentFirst = state.initialFirstPlayer;
    if (state.gameMode === 'normal') {
      const flips = (state.currentRound - 1) % 2;
      if (flips === 1) {
        currentFirst = (state.initialFirstPlayer === 'player') ? 'ai' : 'player';
      }
    }

    state = {
      ...state,
      firstPlayer: currentFirst,
      currentTurn: currentFirst,
      deck: buildDeck(),
      playerHand: [],
      aiHand: [],
      cups: buildCups(),
      playerScore: 0,
      aiScore: 0,
      selectedCard: null,
      phase: 'playing',
      placingCard: false,
      cheatActive: null,
      aiAggressionLevel: 0,
      zayneTradePending: null,
      zayneTradeHistory: null,
      xavierSwapFirst: null,
      consecutiveAiTurns: 0,
      boardCleared: false,
      playerMoveCount: 0,
      playerTurnStartTime: 0,
      lastPlayerMoveDuration: 0,
      // Advanced mode state reset
      assistDeck: [],
      playerAssistHand: [],
      aiAssistHand: [],
      advancedPhase: 'assist',
      playerSkipNumber: false,
      playerSkipAssist: false,
      aiSkipNumber: false,
      aiSkipAssist: false,
      pawComboActive: false,
      pawComboCount: 0,
      playerAssistHistory: [],
      aiAssistHistory: [],
    };

    cheatSylusOffer.style.display = 'none';
    cheatSylus.style.display = 'none';

    updateMatchTracker();

    // Deal initial cards
    const firstGets2 = currentFirst;
    const firstCards = 2;
    const secondCards = 3;
    const firstHand  = firstGets2 === 'player' ? 'playerHand' : 'aiHand';
    const secondHand = firstGets2 === 'player' ? 'aiHand' : 'playerHand';

    for (let i = 0; i < firstCards; i++) state[firstHand].push(state.deck.pop());
    for (let i = 0; i < secondCards; i++) state[secondHand].push(state.deck.pop());

    // Advanced mode: build assist deck and deal 1 assist card each
    if (state.gameMode === 'advanced') {
      state.assistDeck = buildAssistDeck();
      // First player gets 1 assist card, second player gets 1 assist card
      const firstAssist = firstGets2 === 'player' ? 'playerAssistHand' : 'aiAssistHand';
      const secondAssist = firstGets2 === 'player' ? 'aiAssistHand' : 'playerAssistHand';
      if (state.assistDeck.length > 0) state[firstAssist].push(state.assistDeck.pop());
      if (state.assistDeck.length > 0) state[secondAssist].push(state.assistDeck.pop());
    }

    // Valko penalty: if Valko goes second (player goes first = ai second), he steals a player card
    if (state.companion === 'valko' && currentFirst === 'player' && state.currentRound === 1 && Math.random() < 0.50) {
      // Valko goes second — steal one player card
      if (state.playerHand.length > 0) {
        const stolen = state.playerHand.splice(Math.floor(Math.random() * state.playerHand.length), 1)[0];
        state.aiHand.push(stolen);
        showToast(`Valko: "Stepped into my territory." He pockets one of your cards!`, 3500);
      }
    }

    // Render board
    showScreen('board');
    renderAll();

    // Advanced mode: show pass button; start with assist phase
    const advPassRow = document.getElementById('kc-adv-pass-row');
    if (advPassRow) advPassRow.style.display = state.gameMode === 'advanced' ? 'flex' : 'none';

    if (state.gameMode === 'advanced') {
      setStatus('Advanced Mode! Get ready...');
      if (currentFirst === 'ai') {
        setTimeout(() => startAdvancedAiTurn(), 2000);
      } else {
        state.playerTurnStartTime = Date.now();
        setTimeout(() => startAdvancedPlayerTurn(), 1500);
      }
    } else {
      setStatus(`Round ${state.currentRound} begins!`);
      if (currentFirst === 'ai') {
        setTimeout(() => doAiTurn(), 4500);
      } else {
        state.playerTurnStartTime = Date.now();
        setStatus('Your turn — play a card or draw from the deck.');
      }
    }
  }

  function updateMatchTracker() {
    matchWinsPlayerEl.textContent = state.matchWinsPlayer;
    matchWinsAiEl.textContent = state.matchWinsAi;
    matchRoundNumEl.textContent = state.currentRound;
  }

  function renderAll() {
    renderCupGrid();
    renderPlayerHand();
    renderAiHand();
    renderScores();
    updateTurnBadge();
    updateStatusMarks();
  }

  function updateStatusMarks() {
    const pSkip = document.getElementById('kc-player-skip-badge');
    const pFreeze = document.getElementById('kc-player-freeze-badge');
    const aSkip = document.getElementById('kc-ai-skip-badge');
    const aFreeze = document.getElementById('kc-ai-freeze-badge');
    
    if (pSkip) pSkip.style.display = state.playerSkipNumber ? 'block' : 'none';
    if (pFreeze) pFreeze.style.display = state.playerSkipAssist ? 'block' : 'none';
    if (aSkip) aSkip.style.display = state.aiSkipNumber ? 'block' : 'none';
    if (aFreeze) aFreeze.style.display = state.aiSkipAssist ? 'block' : 'none';
  }

  // ═══════════════════════════════════════════════════════
  //  PLAYER ACTIONS
  // ═══════════════════════════════════════════════════════

  function onPlayerCardClick(idx) {
    if (state.currentTurn !== 'player' || state.phase !== 'playing') return;

    if (state.selectedCard === idx) {
      // Deselect
      state.selectedCard = null;
      state.placingCard = false;
    } else {
      // Select & start placing immediately
      state.selectedCard = idx;
      state.placingCard = true;
    }
    renderPlayerHand();
    renderCupGrid(); // re-render to show/hide available cup highlights

    if (state.selectedCard !== null) {
      setStatus('Choose a cup to place your card in!');
    } else {
      setStatus('Your turn — select a card or draw from the deck.');
    }
  }

  function onCupClickDuringPlacement(cupIdx) {
    if (!state.placingCard || state.currentTurn !== 'player') return;
    const cup = state.cups[cupIdx];
    if (cup.card) return;

    // Hide Sylus cheat offer if player ignores it
    cheatSylusOffer.style.display = 'none';
    cheatSylus.style.display = 'none';

    const card = state.playerHand.splice(state.selectedCard, 1)[0];
    cup.card = card;
    cup.owner = 'player';

    const pts = calcPoints(card, cup);
    state.playerScore += pts;

    // Floating points animation
    spawnFloatingPts(pts, cup, card);

    state.selectedCard = null;
    state.placingCard = false;
    state.playerMoveCount++;

    if (pts === 0) {
      setStatus(`Placed ${card.color} ${card.value} in ${cup.color} cup — no points (unmatched).`);
    } else if (cup.color === 'white') {
      setStatus(`Placed in white cup! +${pts} points.`);
    } else {
      setStatus(`Matched cup! ${card.color} on ${cup.color} — +${pts} points! ×2 bonus!`);
    }

    renderAll();
    if (checkGameOver()) return;
    checkCheatTrigger(() => endPlayerTurn());
  }

  function onDrawCard() {
    if (state.deck.length === 0 || state.currentTurn !== 'player' || state.phase !== 'playing') return;

    // Hide Sylus cheat offer if player ignores it
    cheatSylusOffer.style.display = 'none';
    cheatSylus.style.display = 'none';

    const card = state.deck.pop();
    let burned = false;
    if (state.playerHand.length >= 10) {
      showToast('Hand is full (max 10)! Drawn card is burned.', 3000);
      burned = true;
    } else {
      state.playerHand.push(card);
    }
    
    state.selectedCard = null;
    state.placingCard = false;
    state.playerMoveCount++;

    if (!burned) {
      setStatus(`You drew: ${card.color} ${card.value}.`);
    } else {
      setStatus(`You drew: ${card.color} ${card.value}, but your hand was full so it burned!`);
    }
    
    renderAll();
    checkCheatTrigger(() => endPlayerTurn());
  }

  function endPlayerTurn() {
    // Reset advancedPhase for next turn if advanced mode
    if (state.gameMode === 'advanced') {
      state.advancedPhase = 'assist';
    } else {
      state.lastPlayerMoveDuration = Date.now() - state.playerTurnStartTime;
    }
    
    state.currentTurn = 'ai';
    updateTurnBadge();
    renderAll();
    setStatus(`${COMPANIONS[state.companion].name} is thinking...`);
    if (checkGameOver()) return;
    
    const nextTurnFn = state.gameMode === 'advanced' ? startAdvancedAiTurn : doAiTurn;
    const baseDelay = state.gameMode === 'advanced' ? 1500 : (4000 + Math.random() * 1000);

    if (COMPANIONS[state.companion].cheat === 'draw' && Math.random() < 0.28 && state.deck.length > 0) {
      // Caleb's cheat triggers mid-think
      setTimeout(() => {
        const cheatDur = showCalebCheat(() => {});
        setTimeout(() => nextTurnFn(), cheatDur + Math.random() * 1000);
      }, 1000);
    } else {
      setTimeout(() => nextTurnFn(), baseDelay);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  AI TURN LOGIC
  // ═══════════════════════════════════════════════════════

  function doAiTurn() {
    if (state.currentTurn !== 'ai' || state.phase !== 'playing') return;

    // Force play if only 1 cup left to avoid unnecessary drawing and end the game
    const emptyCups = state.cups.map((c, i) => ({c, i})).filter(x => !x.c.card);
    
    // Set Hoard Mode for this turn
    state.aiHoardMode = emptyCups.length <= 4 || state.deck.length <= 4;

    if (emptyCups.length === 1 && state.aiHand.length > 0) {
      let bestScore = -1;
      let bestCardIdx = 0;
      const targetCup = emptyCups[0];
      state.aiHand.forEach((card, ci) => {
        const pts = calcPoints(card, targetCup.c);
        if (pts > bestScore) {
           bestScore = pts;
           bestCardIdx = ci;
        }
      });
      executeAiAction({ type: 'play', cardIdx: bestCardIdx, cupIdx: targetCup.i });
      return;
    }

    // Global rule: If player has 0 cards, AI draws since player can't retaliate next turn.
    if (state.playerHand.length === 0 && state.deck.length > 0) {
      executeAiAction({ type: 'draw' });
      return;
    }



    const strategy = COMPANIONS[state.companion].strategy;
    let action;

    switch (strategy) {
      case 'conservative': action = aiStrategyZayne(); break;
      case 'defensive':    action = aiStrategyRafayel(); break;
      case 'locking':      action = aiStrategySylus(); break;
      case 'predatory':    action = aiStrategyValko(); break;
      case 'sneaky':       action = aiStrategyCaleb(); break;
      default:             action = aiStrategyBalanced(); break;
    }

    executeAiAction(action);
  }

  function aiStrategyBalanced() {
    // Xavier: Patient counter-puncher. Defers on opening — he wants to see your move first.
    // If he goes first, he draws to build up a hand before committing.
    if (state.aiHand.length === 0) return { type: 'draw' };
    const isFirstMove = state.cups.every(c => !c.card); // all cups empty = very start of game
    if (isFirstMove && state.deck.length > 0 && Math.random() < 0.65) {
      return { type: 'draw' }; // Xavier dislikes going first — he prefers to react
    }
    const best = findBestAiPlay(state.aiHand, state.cups);
    if (!best || best.pts <= 0) {
      if (state.deck.length > 0 && Math.random() < AI_TRAITS.xavier.hoardAssist) return { type: 'draw' };
    }
    return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
  }

  function aiStrategyZayne() {
    if (state.aiHand.length === 0) return { type: 'draw' };
    const traits = AI_TRAITS.zayne;

    // Zayne is a conservative hoarder — always draws first to build a strong hand.
    // If he goes first, he definitely draws (he never shows his hand early).
    const isFirstMove = state.cups.every(c => !c.card);
    if (isFirstMove) return { type: 'draw' }; // Zayne always draws first
    
    // Zayne hoards cards until late game
    if (!state.aiHoardMode && state.aiHand.length < 5 && state.deck.length > 0) {
      if (Math.random() < traits.hoardAssist) return { type: 'draw' };
    }

    const best = findBestAiPlay(state.aiHand, state.cups);
    
    if (state.difficulty === 'easy' && Math.random() < traits.mercy) {
      if (state.deck.length > 0 && Math.random() < 0.5) return { type: 'draw' };
      const emptyCups = state.cups.map((c, i) => ({ c, i })).filter(({ c }) => !c.card);
      if (emptyCups.length > 0) return { type: 'play', cardIdx: 0, cupIdx: rand(emptyCups).i };
    }

    return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
  }

  function aiStrategyRafayel() {
    if (state.aiHand.length === 0) return { type: 'draw' };
    const traits = AI_TRAITS.rafayel;

    // Rafayel is impulsive. If he goes first, he plays immediately — he'd rather
    // act than think. He targets the rarest color cup on opening.
    const isFirstMove = state.cups.every(c => !c.card);
    if (isFirstMove && state.aiHand.length > 0) {
      // Play the card that matches the most scarce cup color (block player opening)
      const best = findBestAiPlay(state.aiHand, state.cups);
      if (best) return { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx };
    }
    
    // Rafayel heavily hoards number cards until late game
    if (!state.aiHoardMode && state.aiHand.length < 6 && state.deck.length > 0) {
      if (Math.random() < traits.hoardAssist + 0.3) return { type: 'draw' };
    }

    const best = findBestAiPlay(state.aiHand, state.cups);
    if (best && best.pts > 0) return { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx };

    // Targeted blocking
    const emptyColorCups = state.cups.map((c, i) => ({ c, i })).filter(({ c }) => !c.card && c.color !== 'white');
    if (emptyColorCups.length > 0) {
      // Find the most scarce color
      let rarestColor = null;
      let minCups = 999;
      emptyColorCups.forEach(({ c }) => {
        const count = state.cups.filter(cup => !cup.card && cup.color === c.color).length;
        if (count < minCups) { minCups = count; rarestColor = c.color; }
      });
      const targetCups = emptyColorCups.filter(({ c }) => c.color === rarestColor);
      const targetCup = rand(targetCups);
      
      let smallestIdx = 0;
      for (let i = 1; i < state.aiHand.length; i++) {
        if (state.aiHand[i].value < state.aiHand[smallestIdx].value) smallestIdx = i;
      }
      return { type: 'play', cardIdx: smallestIdx, cupIdx: targetCup.i };
    }
    
    return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
  }

  function aiStrategySylus() {
    if (state.aiHand.length <= 2 && state.deck.length > 0) return { type: 'draw' };
    if (state.aiHand.length === 0) return { type: 'draw' };

    const traits = AI_TRAITS.sylus;

    // Sylus is a color manipulator — if he goes first, he immediately claims
    // a colored cup (avoids white) to begin locking out the player.
    const isFirstMove = state.cups.every(c => !c.card);
    if (isFirstMove && state.aiHand.length > 0) {
      const coloredCups = state.cups.map((c, i) => ({ c, i })).filter(x => x.c.color !== 'white' && !x.c.card);
      if (coloredCups.length > 0) {
        let smallestIdx = 0;
        for (let i = 1; i < state.aiHand.length; i++) {
          if (state.aiHand[i].value < state.aiHand[smallestIdx].value) smallestIdx = i;
        }
        return { type: 'play', cardIdx: smallestIdx, cupIdx: rand(coloredCups).i };
      }
    }

    if (state.difficulty !== 'hell' && Math.random() < traits.mercy) {
      const emptyCups = state.cups.map((c, i) => ({c, i})).filter(x => !x.c.card);
      if (emptyCups.length > 0) {
        let lowestIdx = 0;
        for (let i = 1; i < state.aiHand.length; i++) {
          if (state.aiHand[i].value < state.aiHand[lowestIdx].value) lowestIdx = i;
        }
        return { type: 'play', cardIdx: lowestIdx, cupIdx: rand(emptyCups).i };
      }
    }

    const best = findBestAiPlay(state.aiHand, state.cups);
    
    // Sylus won't waste cards on 0 point plays early on if he can avoid it
    if (best && best.pts <= 0 && state.deck.length > 0 && Math.random() < traits.wasteAversion) {
      return { type: 'draw' };
    }
    
    return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
  }


  function aiStrategyValko() {
    if (state.aiHand.length === 0) return { type: 'draw' };

    // Valko is a hunter — if he goes first, he immediately claims the most
    // strategically valuable cup (highest potential match). Alpha territory.
    const isFirstMove = state.cups.every(c => !c.card);
    if (isFirstMove && state.aiHand.length > 0) {
      const best = findBestAiPlay(state.aiHand, state.cups);
      if (best && best.pts > 0) return { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx };
      // If he has no good play on opening turn, quietly build his hand
      if (state.deck.length > 0) return { type: 'draw' };
    }

    const traits = AI_TRAITS.valko || { wasteAversion: 0.5 };
    const best = findBestAiPlay(state.aiHand, state.cups);
    
    // Quiet early-game pace: Valko hoards cards to build a strong hand (up to 3 cards)
    // He will only break this hoarding phase early if he spots a massive play (10+ pts).
    if (state.aiHand.length < 3 && state.deck.length > 0) {
      if (!best || best.pts < 10) return { type: 'draw' };
    }

    // Even if hand is full enough, he prefers not to waste cards on 0-pt plays
    if (best && best.pts <= 0 && state.deck.length > 0 && Math.random() < traits.wasteAversion) {
      return { type: 'draw' };
    }
    
    return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
  }

  function aiStrategyCaleb() {
    if (state.aiHand.length === 0) return { type: 'draw' };

    // Caleb is unpredictable. If he goes first, there's a 50/50 whether
    // he plays immediately or draws — pure chaos.
    const isFirstMove = state.cups.every(c => !c.card);
    if (isFirstMove) {
      if (Math.random() < 0.5 && state.deck.length > 0) return { type: 'draw' };
    }

    // Assess game state
    const emptyCups = state.cups.filter(c => !c.card).length;
    const totalCups = state.cups.length;
    const isEarlyGame = emptyCups >= totalCups - 2; // first couple of cups
    const isLateGame = emptyCups <= 3 || state.deck.length <= 4;
    
    let best = findBestAiPlay(state.aiHand, state.cups);
    let worst = findWorstAiPlay(state.aiHand, state.cups); 

    if (isEarlyGame) {
      // Aggressive Opening: Always play the best possible card
      return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
    }
    
    if (isLateGame) {
      // Dismantling the board: play highest score possible
      return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
    }

    // Mid-game Mind Games (creating false sense of security)
    // 50% chance to draw a card and hoard it
    if (state.deck.length > 0 && Math.random() < 0.50) {
      return { type: 'draw' };
    }
    // Otherwise, play a sub-optimal card if possible, to let player build a lead
    if (worst && worst.pts < 4) {
      return { type: 'play', cardIdx: worst.cardIdx, cupIdx: worst.cupIdx };
    }
    return best ? { type: 'play', cardIdx: best.cardIdx, cupIdx: best.cupIdx } : { type: 'draw' };
  }

  function findWorstAiPlay(hand, cups) {
    let worstScore = Infinity;
    let worstCardIdx = -1;
    let worstCupIdx = -1;

    hand.forEach((card, ci) => {
      // Hoard high value cards (5,6)
      if (card.value >= 5) return; 
      cups.forEach((cup, ui) => {
        if (cup.card) return;
        // Mind Games: Caleb should not block colored cups (which is Rafayel's strategy).
        // He intentionally dumps small cards in white cups so the player can take the colored cups and build a lead.
        if (cup.color !== 'white') return;
        
        const pts = calcPoints(card, cup);
        if (pts < worstScore) {
          worstScore = pts;
          worstCardIdx = ci;
          worstCupIdx = ui;
        }
      });
    });

    if (worstCardIdx === -1) return null;
    return { cardIdx: worstCardIdx, cupIdx: worstCupIdx, pts: worstScore };
  }

  function evaluateMove(card, cup, cups, hand, traits) {
    const basePts = calcPoints(card, cup);

    // How many cups of this color remain unfilled (including this one)?
    const colorCupsLeft = cups.filter(c => !c.card && c.color === cup.color).length;
    // How many cards of this color does the AI still hold?
    const colorCardsInHand = hand.filter(c => c.color === card.color).length;

    // Scarcity bonus: claiming one of the last cups of a color is worth more
    // than the raw points, because it denies the opponent that match.
    const scarcity = cup.color !== 'white' && colorCupsLeft > 0 ? (1 / colorCupsLeft) * traits.scarcityWeight * 3 : 0;

    // Hoarding penalty: if this card doesn't match anything valuable, and the
    // bot has a hoarding trait, prefer NOT to burn a high-value card on a bad cup.
    const wastePenalty = (basePts === 0 && card.value >= 5) ? traits.wasteAversion * 15 : 0;

    // Add a tiny random jitter so identical moves don't always pick the top-leftmost cup
    const jitter = Math.random() * 0.1;

    return basePts + scarcity - wastePenalty + jitter;
  }

  function findBestAiPlay(hand, cups, aggressiveClaim = false) {
    let bestScore = -999;
    let bestCardIdx = -1;
    let bestCupIdx = -1;
    const traits = AI_TRAITS[state.companion] || AI_TRAITS.xavier;

    hand.forEach((card, ci) => {
      cups.forEach((cup, ui) => {
        if (cup.card) return;
        
        const pts = evaluateMove(card, cup, state.cups, hand, traits);
        if (pts > bestScore) {
          bestScore = pts;
          bestCardIdx = ci;
          bestCupIdx = ui;
        }
      });
    });

    if (bestCardIdx === -1) return null;
    return {
      cardIdx: bestCardIdx,
      cupIdx: bestCupIdx,
      pts: calcPoints(hand[bestCardIdx], cups[bestCupIdx]), // real score, for decision gating
      evalScore: bestScore,                                   // blended, only for picking the move
    };
  }

  function executeAiAction(action) {
    if (action.type === 'draw') {
      if (state.deck.length > 0) {
        // Rig draw for Caleb occasionally (Perceived RNG luck)
        if (state.companion === 'caleb' && Math.random() < 0.40) {
            const highIdx = state.deck.findIndex(c => c.value >= 5);
            if (highIdx !== -1) {
                const temp = state.deck[state.deck.length - 1];
                state.deck[state.deck.length - 1] = state.deck[highIdx];
                state.deck[highIdx] = temp;
            }
        }
        const card = state.deck.pop();
        if (state.aiHand.length >= 10) {
          setStatus(`${COMPANIONS[state.companion].name} drew a card, but their hand is full! It burned.`);
        } else {
          state.aiHand.push(card);
          setStatus(`${COMPANIONS[state.companion].name} draws a card.`);
        }
      } else {
        setStatus(`${COMPANIONS[state.companion].name} has no cards to draw!`);
      }
      renderAll();
      setTimeout(handleAiTurnEnd, 600);
    } else {
      // Valko: Colorblind cheat interception
      if (!action.isCheatConfirmed && state.companion === 'valko' && COMPANIONS['valko'].cheat === 'cover-or-lock') {
        const confusableColors = ['red', 'green', 'brown'];
        const targetCup = state.cups[action.cupIdx];
        
        // Only hesitate if he's about to play into a confusable cup and it's not the opening move
        if (state.playerMoveCount > 0 && confusableColors.includes(targetCup.color)) {
          const emptyCups = state.cups.filter(c => !c.card);
          const confusableEmpty = emptyCups.filter(c => confusableColors.includes(c.color)).length;
          const cheatRate = Math.min(0.55, 0.15 + confusableEmpty * 0.08);

          if (Math.random() < cheatRate) {
            state.phase = 'cheat';
            showValkoCheatIntercept(action, () => {
              // The callback is called after the cheat modal resolves
            });
            return;
          }
        }
      }

      // Play card
      const card = state.aiHand.splice(action.cardIdx, 1)[0];
      const cup  = state.cups[action.cupIdx];
      cup.card  = card;
      cup.owner = 'ai';
      


      const pts = calcPoints(card, cup);
      state.aiScore += pts;

      spawnFloatingPts(pts, cup, card, true);

      setStatus(`${COMPANIONS[state.companion].name} plays ${card.color} ${card.value} in the ${cup.color} cup. +${pts} pts`);

      // Valko: trigger aggression if player was ahead
      if (state.companion === 'valko' && state.playerScore > state.aiScore + 3) {
        state.aiAggressionLevel = Math.min(state.aiAggressionLevel + 1, 3);
      }

      renderAll();
      setTimeout(handleAiTurnEnd, 600);
    }
  }

  function handleAiTurnEnd() {
    if (checkGameOver()) return;
    if (state.pawComboActive && state.gameMode === 'advanced') {
      state.pawComboActive = false;
      setStatus(`${COMPANIONS[state.companion].name} uses Paw Combo to take another action!`);
      setTimeout(() => doAiTurn(), 800);
      return;
    }
    triggerAiCheatIfNeeded(() => endAiTurn());
  }

  function endAiTurn() {
    state.advancedPhase = 'assist'; // always reset phase on turn end
    state.currentTurn = 'player';
    state.consecutiveAiTurns = 0;
    state.playerTurnStartTime = Date.now();
    updateTurnBadge();
    if (!checkGameOver()) {
      if (state.gameMode === 'advanced') {
        setTimeout(() => startAdvancedPlayerTurn(), 800);
        return;
      }
      setStatus('Your turn — play a card or draw from the deck.');
      renderCupGrid(); // Re-render grid to show DRAW badge

      // Sylus: Show trade offer during player's turn (25% chance)
      if (COMPANIONS[state.companion].cheat === 'trade-forced' && state.aiHand.length >= 2) {
        if (Math.random() < 0.25) {
          showSylusCheatOffer();
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════
  //  CHEAT SYSTEM
  // ═══════════════════════════════════════════════════════

  // Called after player's turn ends — check if companion triggers their cheat
  function checkCheatTrigger(callback) {
    const companion = COMPANIONS[state.companion];
    let chance = 0;

    switch (companion.cheat) {
      case 'sleep':
        chance = (state.cups.filter(c => c && c.card).length >= 2) ? 0.18 : 0;
        break; // Xavier
      default:             chance = 0;    break;
    }

    if (Math.random() < chance && state.phase === 'playing') {
      state.phase = 'cheat';
      showCheatEvent(companion.cheat, callback);
    } else {
      callback();
    }
  }

  // Called after AI turn — check if AI companion triggers cheat against player
  function triggerAiCheatIfNeeded(callback) {
    const companion = COMPANIONS[state.companion];

    // Rafayel: Cheats if he holds a "perfect" card for an occupied cup he owns
    if (companion.cheat === 'steal' && state.aiHand.length > 0) {
      // Find occupied cups that belong to the AI
      const occupiedCups = state.cups.map((c, i) => ({c, i})).filter(x => x.c.card && x.c.owner === 'ai');
      let perfectTarget = null;

      for (let i = 0; i < state.aiHand.length; i++) {
        const handCard = state.aiHand[i];
        for (const cupObj of occupiedCups) {
          const cup = cupObj.c;
          const currentPts = calcPoints(cup.card, cup);
          const potentialPts = calcPoints(handCard, cup);

          // If his card yields more points in this cup than the current card, he swaps it!
          if (potentialPts > currentPts) {
            perfectTarget = { handIdx: i, cupIdx: cupObj.i };
            break;
          }
        }
        if (perfectTarget) break;
      }

      // If he finds a perfect target, high chance to cheat
      if (perfectTarget && Math.random() < 0.75) {
        state.phase = 'cheat';
        showRafayelCheat(perfectTarget, callback);
        return;
      }
    }

    // Zayne: trade cheat exactly every 2 player moves
    if (companion.cheat === 'trade' && state.playerMoveCount > 0 && state.playerMoveCount % 2 === 0) {
      state.playerMoveCount = 0; // Reset so it triggers exactly every 2 moves
      state.phase = 'cheat';
      showZayneCheat(callback);
      return;
    }




    callback();
  }

  function showCheatEvent(type, callback) {
    switch (type) {
      case 'sleep':        showXavierCheat(callback); break;
      case 'trade':        showZayneCheat(callback); break;
      case 'steal':        showRafayelCheat(callback); break;
      case 'trade-forced': showSylusCheat(callback); break;
      default: callback(); break;
    }
  }

  // ── Xavier: Asleep ──────────────────────────────────────
  function showXavierCheat(callback) {
    state.xavierSwapSelection = [];
    const xDesc = document.getElementById('kc-xavier-cheat-desc');
    const xSwapStatus = document.getElementById('kc-xavier-swap-status');
    const timerFill = document.getElementById('kc-xavier-timer');
    const skipBtn = document.getElementById('kc-xavier-skip-swap');
    const swapBtn = document.getElementById('kc-xavier-do-swap');
    
    xSwapStatus.textContent = 'Select first occupied cup...';
    cheatXavier.style.display = 'flex';
    swapBtn.disabled = true;

    // 12-second timer
    const timeLimit = 12000;
    const startTime = Date.now();
    let resolved = false;

    timerFill.style.width = '100%';
    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / timeLimit) * 100);
      timerFill.style.width = pct + '%';
      if (elapsed >= timeLimit && !resolved) {
        resolved = true;
        clearInterval(timerInterval);
        finishXavierSleepWithoutSwap();
      }
    }, 50);

    function finishXavierSleepWithoutSwap() {
      cleanUpXavierCheat();
      cupGridEl.removeEventListener('click', handleSwapClick);
      showToast('Xavier wakes up! He stretches with a yawn.', 3500);
      endCheat(callback);
    }

    skipBtn.onclick = () => {
      if (resolved) return;
      resolved = true;
      clearInterval(timerInterval);
      finishXavierSleepWithoutSwap();
    };
    
    swapBtn.onclick = () => {
      if (resolved || state.xavierSwapSelection.length !== 2) return;
      resolved = true;
      clearInterval(timerInterval);

      // Perform swap
      const cup1 = state.cups[state.xavierSwapSelection[0]];
      const cup2 = state.cups[state.xavierSwapSelection[1]];
      
      [cup1.card, cup2.card] = [cup2.card, cup1.card];
      [cup1.owner, cup2.owner] = [cup2.owner, cup1.owner];

      recalcScores();
      cleanUpXavierCheat();
      cupGridEl.removeEventListener('click', handleSwapClick);

      // Xavier might notice (25% chance)
      if (Math.random() < 0.25) {
        showToast(`Xavier stirs... "Hmm, did something change?" The cards are switched back!`, 3500);
        // Revert swap
        [cup1.card, cup2.card] = [cup2.card, cup1.card];
        [cup1.owner, cup2.owner] = [cup2.owner, cup1.owner];
        recalcScores();
      } else {
        showToast('Cards swapped while Xavier sleeps!');
      }
      endCheat(callback);
    };

    // Enable swap-candidate on all occupied cups
    document.querySelectorAll('.kc-cup-cell:not(.deck-cell)').forEach(cell => {
      const cupIdx = parseInt(cell.dataset.cup);
      const cup = state.cups[cupIdx];
      if (cup && cup.card) cell.classList.add('swap-candidate');
    });

    // Cup click handler for swap
    function handleSwapClick(e) {
      if (resolved) return;
      const cell = e.target.closest('.kc-cup-cell');
      if (!cell || cell.classList.contains('deck-cell')) return;
      const cupIdx = parseInt(cell.dataset.cup);
      const cup = state.cups[cupIdx];
      if (!cup || !cup.card) return;

      const selIdx = state.xavierSwapSelection.indexOf(cupIdx);
      if (selIdx > -1) {
        // Deselect
        state.xavierSwapSelection.splice(selIdx, 1);
        cell.classList.remove('swap-selected');
      } else {
        // Select if under 2
        if (state.xavierSwapSelection.length < 2) {
          state.xavierSwapSelection.push(cupIdx);
          cell.classList.add('swap-selected');
        }
      }

      // Update UI state
      if (state.xavierSwapSelection.length === 2) {
        xSwapStatus.textContent = 'Two cups selected. Swap them or wake him up.';
        swapBtn.disabled = false;
      } else if (state.xavierSwapSelection.length === 1) {
        xSwapStatus.textContent = 'Now select the second cup to swap with...';
        swapBtn.disabled = true;
      } else {
        xSwapStatus.textContent = 'Select first occupied cup...';
        swapBtn.disabled = true;
      }
    }

    cupGridEl.addEventListener('click', handleSwapClick);
  }

  function cleanUpXavierCheat() {
    cheatXavier.style.display = 'none';
    state.xavierSwapSelection = [];
    document.querySelectorAll('.kc-cup-cell').forEach(c => {
      c.classList.remove('swap-candidate', 'swap-selected');
    });
  }

  // ── Zayne: Trade ───────────────────────────────────────
  function showZayneCheat(callback) {
    // Zayne can refuse (15% chance)
    if (Math.random() < 0.15) {
      showToast('Zayne: "Actually, never mind. Not now."');
      endCheat(callback);
      return;
    }
    // Need at least 1 card from each
    if (state.playerHand.length === 0 || state.aiHand.length === 0) {
      endCheat(callback);
      return;
    }

    cheatZayne.style.display = 'flex';

    document.getElementById('kc-zayne-beg-btn').onclick = () => {
      cheatZayne.style.display = 'none';
      if (Math.random() < 0.882) {
        // SUCCESS (~88.2% chance here to make overall chance 75%)
        const originalPlayerHand = [...state.playerHand];
        const originalAiHand = [...state.aiHand];
        
        state.playerHand = [...originalAiHand];
        state.aiHand = [...originalPlayerHand];
        
        const successReplies = [
          "...Take it.",
          "Fine, have it your way.",
          "You leave me no choice.",
          "Just this once."
        ];
        document.getElementById('kc-zayne-beg-success-desc').textContent = successReplies[Math.floor(Math.random() * successReplies.length)];
        
        renderAll();
        
        const begConfirm = document.getElementById('kc-cheat-zayne-beg-confirm');
        begConfirm.style.display = 'flex';
        
        let resolved = false;
        const timeLimit = 6000;
        const startTime = Date.now();
        const timerFill = document.getElementById('kc-zayne-beg-timer');
        timerFill.style.width = '100%';
        
        const confirmSwap = () => {
          if (resolved) return;
          resolved = true;
          clearInterval(timerInterval);
          begConfirm.style.display = 'none';
          showToast("You took all of Zayne's cards!");
          endCheat(callback);
        };
        
        const cancelSwap = () => {
          if (resolved) return;
          resolved = true;
          clearInterval(timerInterval);
          state.playerHand = [...originalPlayerHand];
          state.aiHand = [...originalAiHand];
          renderAll();
          begConfirm.style.display = 'none';
          showToast("Swap cancelled.");
          endCheat(callback);
        };
        
        const timerInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const pct = Math.max(0, 100 - (elapsed / timeLimit) * 100);
          timerFill.style.width = pct + '%';
          if (elapsed >= timeLimit && !resolved) {
            confirmSwap(); // Auto-confirm on timeout
          }
        }, 50);
        
        document.getElementById('kc-zayne-beg-confirm-btn').onclick = confirmSwap;
        document.getElementById('kc-zayne-beg-cancel-btn').onclick = cancelSwap;
      } else {
        // FAIL (25%)
        const failReplies = [
          "I'll consider it if you try harder.",
          "Nice try, but no.",
          "Not going to work on me.",
          "Is that all you've got?"
        ];
        document.getElementById('kc-zayne-beg-fail-desc').textContent = failReplies[Math.floor(Math.random() * failReplies.length)];
        
        const begFail = document.getElementById('kc-cheat-zayne-beg-fail');
        begFail.style.display = 'flex';
        
        document.getElementById('kc-zayne-beg-fail-btn').onclick = () => {
          begFail.style.display = 'none';
          endCheat(callback);
        };
      }
    };
  }

  // ── Rafayel: Steal ─────────────────────────────────────
  function showRafayelCheat(perfectTarget, callback) {
    const cupIdx = perfectTarget.cupIdx;
    const handIdx = perfectTarget.handIdx;
    const targetCup = state.cups[cupIdx];
    const cardToSteal = targetCup.card;
    const perfectCard = state.aiHand[handIdx];

    // Find the cup cell element to get its screen position for the drag start
    const cupCells = document.querySelectorAll('.kc-cup-cell');
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    if (cupCells[cupIdx]) {
      const rect = cupCells[cupIdx].getBoundingClientRect();
      startX = rect.left + rect.width / 2 - 35; // center card
      startY = rect.top + rect.height / 2 - 48;
    }

    // Target: AI Hand label position
    let endX = window.innerWidth / 2 - 35;
    let endY = 20;
    const aiHandLabel = document.querySelector('.kc-ai-hand-label-wrap');
    if (aiHandLabel) {
       const rect = aiHandLabel.getBoundingClientRect();
       endX = rect.left + rect.width / 2 - 35;
       endY = rect.top + rect.height / 2 - 48;
    }

    const overlay = cheatRafayel;
    const dragCard = document.getElementById('kc-raf-drag-card');
    const cardFace = document.getElementById('kc-raf-drag-card-face');
    const gotchaBtn = document.getElementById('kc-gotcha-btn');

    // Set card face content to the card he is STEALING
    const colorEmojis = { red: '🔴', blue: '🔵', green: '🟢', yellow: '🟡', purple: '🟣', orange: '🟠', white: '⚪' };
    cardFace.innerHTML = `<span style="font-size:18px;">${colorEmojis[cardToSteal.color] || '🃏'}</span><span>${cardToSteal.value}</span>`;

    // Set start position
    dragCard.style.transition = 'none';
    dragCard.style.left = startX + 'px';
    dragCard.style.top = startY + 'px';

    overlay.style.display = 'block';

    const DRAG_DURATION = 2800;
    let caught = false;
    let rafSucceeded = false;

    // Animate card sliding to the AI deck corner
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dragCard.style.transition = `left ${DRAG_DURATION}ms linear, top ${DRAG_DURATION}ms linear, opacity 0.3s ease ${DRAG_DURATION - 300}ms`;
        dragCard.style.left = endX + 'px';
        dragCard.style.top = endY + 'px';
      });
    });

    // Timer: if player doesn't tap in time, Rafayel succeeds
    const failTimer = setTimeout(() => {
      if (caught) return;
      rafSucceeded = true;
      overlay.style.display = 'none';
      gotchaBtn.onclick = null;

      // Apply the swap
      const ptsToSubtract = calcPoints(cardToSteal, targetCup);
      if (targetCup.owner === 'ai') state.aiScore -= ptsToSubtract;
      else if (targetCup.owner === 'player') state.playerScore -= ptsToSubtract;
      
      state.aiHand.push(cardToSteal);
      state.aiHand.splice(handIdx, 1);
      targetCup.card = perfectCard;
      targetCup.owner = 'ai';
      
      const ptsToAdd = calcPoints(perfectCard, targetCup);
      state.aiScore += ptsToAdd;

      showToast(`Rafayel swapped the cup's card for his ${perfectCard.color} ${perfectCard.value}! +${ptsToAdd} pts`, 3500);
      renderAll();
      endCheat(callback);
    }, DRAG_DURATION);

    // GOTCHA! button handler
    gotchaBtn.onclick = () => {
      if (rafSucceeded) return;
      caught = true;
      clearTimeout(failTimer);
      overlay.style.display = 'none';
      dragCard.style.transition = 'none';
      gotchaBtn.onclick = null;
      showRafayelCaught(perfectTarget, callback);
    };
  }

  function showRafayelCaught(perfectTarget, callback) {
    const caughtOverlay = document.getElementById('kc-cheat-rafayel-caught');
    const caughtReactions = [
      '"...You saw that?" He looks momentarily flustered.',
      '"Hm. Sharper than I thought." He almost smiles.',
      '"...Fine. You win this round." He pulls back.',
    ];
    document.getElementById('kc-rafayel-caught-desc').textContent = rand(caughtReactions);
    caughtOverlay.style.display = 'flex';

    document.getElementById('kc-raf-stop-btn').onclick = () => {
      caughtOverlay.style.display = 'none';
      showToast('You stopped him! Rafayel huffs but backs off.', 2500);
      renderAll();
      endCheat(callback);
    };

    document.getElementById('kc-raf-let-slide-btn').onclick = () => {
      caughtOverlay.style.display = 'none';
      
      // Apply the swap
      const cupIdx = perfectTarget.cupIdx;
      const handIdx = perfectTarget.handIdx;
      const targetCup = state.cups[cupIdx];
      const cardToSteal = targetCup.card;
      const perfectCard = state.aiHand[handIdx];

      const ptsToSubtract = calcPoints(cardToSteal, targetCup);
      if (targetCup.owner === 'ai') state.aiScore -= ptsToSubtract;
      else if (targetCup.owner === 'player') state.playerScore -= ptsToSubtract;
      
      state.aiHand.push(cardToSteal);
      state.aiHand.splice(handIdx, 1);
      targetCup.card = perfectCard;
      targetCup.owner = 'ai';
      
      const ptsToAdd = calcPoints(perfectCard, targetCup);
      state.aiScore += ptsToAdd;

      showToast('You let it slide... Rafayel gives you a sly smile.', 2500);
      renderAll();
      endCheat(callback);
    };

    document.getElementById('kc-raf-also-swap-btn').onclick = () => {
      caughtOverlay.style.display = 'none';
      
      // Rafayel succeeds his swap first
      const cupIdx = perfectTarget.cupIdx;
      const handIdx = perfectTarget.handIdx;
      const targetCup = state.cups[cupIdx];
      const cardToSteal = targetCup.card;
      const perfectCard = state.aiHand[handIdx];

      const ptsToSubtract = calcPoints(cardToSteal, targetCup);
      if (targetCup.owner === 'ai') state.aiScore -= ptsToSubtract;
      else if (targetCup.owner === 'player') state.playerScore -= ptsToSubtract;
      
      state.aiHand.push(cardToSteal);
      state.aiHand.splice(handIdx, 1);
      targetCup.card = perfectCard;
      targetCup.owner = 'ai';
      
      const ptsToAdd = calcPoints(perfectCard, targetCup);
      state.aiScore += ptsToAdd;

      renderAll();
      // Then show player's counter-swap
      showRafayelPlayerSwap(callback);
    };
  }

  function showRafayelPlayerSwap(callback) {
    const swapOverlay = document.getElementById('kc-cheat-rafayel-player-swap');
    const confirmBtn  = document.getElementById('kc-raf-swap-confirm-btn');
    const discardBtn  = document.getElementById('kc-raf-swap-discard-btn');

    let selectedHandIdx = null;   // index into state.playerHand
    let selectedCupIdx  = null;   // index into state.cups

    confirmBtn.disabled = true;

    swapOverlay.style.display = 'flex';
    document.body.classList.add('kc-raf-swap-active');

    function updateConfirm() {
      confirmBtn.disabled = (selectedHandIdx === null || selectedCupIdx === null);
    }

    // Player hand: clicking a card selects it
    function onHandCardClick(e) {
      const cardEl = e.currentTarget;
      const idx = parseInt(cardEl.dataset.handIdx, 10);
      if (isNaN(idx)) return;
      // Deselect previous
      document.querySelectorAll('.kc-player-hand .kc-card').forEach(c => c.classList.remove('raf-swap-selected'));
      selectedHandIdx = idx;
      cardEl.classList.add('raf-swap-selected');
      updateConfirm();
    }

    // Board cups: clicking an occupied cup selects it
    function onCupClick(e) {
      const cupCell = e.currentTarget;
      const idx = parseInt(cupCell.dataset.cup, 10);
      if (isNaN(idx)) return;
      const cup = state.cups[idx];
      if (!cup || !cup.card || cup.owner !== 'player') return;
      document.querySelectorAll('.kc-cup-cell.has-card').forEach(c => c.classList.remove('raf-cup-selected'));
      selectedCupIdx = idx;
      cupCell.classList.add('raf-cup-selected');
      updateConfirm();
    }

    // Attach listeners (re-render first to get fresh elements)
    renderAll();
    setTimeout(() => {
      document.querySelectorAll('.kc-player-hand .kc-card').forEach((el, i) => {
        el.dataset.handIdx = i;
        el.addEventListener('click', onHandCardClick);
      });
      document.querySelectorAll('.kc-cup-cell').forEach((el) => {
        const cupIdxStr = el.dataset.cup;
        if (cupIdxStr === undefined) return;
        const i = parseInt(cupIdxStr, 10);
        if (state.cups[i] && state.cups[i].card && state.cups[i].owner === 'player') {
          el.classList.add('has-card');
          el.addEventListener('click', onCupClick);
        }
      });
    }, 50);

    function cleanUp() {
      document.body.classList.remove('kc-raf-swap-active');
      swapOverlay.style.display = 'none';
      document.querySelectorAll('.kc-player-hand .kc-card').forEach(el => {
        el.classList.remove('raf-swap-selected');
        el.removeEventListener('click', onHandCardClick);
      });
      document.querySelectorAll('.kc-cup-cell').forEach(el => {
        el.classList.remove('has-card', 'raf-cup-selected');
        el.removeEventListener('click', onCupClick);
      });
    }

    confirmBtn.onclick = () => {
      if (selectedHandIdx === null || selectedCupIdx === null) return;
      const handCard = state.playerHand.splice(selectedHandIdx, 1)[0];
      const cup      = state.cups[selectedCupIdx];
      const cupCard  = cup.card;
      const oldPts   = calcPoints(cupCard, cup);

      // Put player's hand card into the cup
      if (cup.owner === 'player') state.playerScore -= oldPts;
      else if (cup.owner === 'ai') state.aiScore -= oldPts;

      cup.card  = handCard;
      cup.owner = 'player';
      const newPts = calcPoints(handCard, cup);
      state.playerScore += newPts;

      // The old cup card goes to player's hand
      state.playerHand.push(cupCard);

      showToast(`You swapped ${handCard.color} ${handCard.value} into the ${cup.color} cup! +${newPts} pts`, 3000);
      cleanUp();
      renderAll();
      endCheat(callback);
    };

    discardBtn.onclick = () => {
      showToast('You let the swap go. The board stays as is.', 2000);
      cleanUp();
      renderAll();
      endCheat(callback);
    };
  }

  // ── Sylus: Forced Trade ────────────────────────────────
  function showSylusCheatOffer() {
    cheatSylusOffer.style.display = 'flex';

    document.getElementById('kc-sylus-offer-trade-btn').onclick = () => {
      cheatSylusOffer.style.display = 'none';
      showSylusCheat();
    };
  }

  function showSylusCheat() {
    if (state.aiHand.length < 2) {
      return;
    }

    const handSelectionEl = document.getElementById('kc-sylus-hand-selection');
    const confirmBtn = document.getElementById('kc-sylus-confirm-btn');
    handSelectionEl.innerHTML = '';
    confirmBtn.disabled = true;

    let selectedIndices = [];

    // Render face-down cards
    state.aiHand.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'kc-card';
      cardEl.style.width = '60px';
      cardEl.style.height = '85px';
      cardEl.style.backgroundImage = `url(${cardBackImg()})`;
      cardEl.style.backgroundSize = 'cover';
      cardEl.style.backgroundPosition = 'center';
      cardEl.style.borderRadius = '8px';
      cardEl.style.cursor = 'pointer';
      cardEl.style.transition = 'transform 0.2s, outline 0.2s';

      cardEl.onclick = () => {
        const selIdx = selectedIndices.indexOf(idx);
        if (selIdx > -1) {
          selectedIndices.splice(selIdx, 1);
          cardEl.style.outline = 'none';
          cardEl.style.transform = 'translateY(0)';
        } else {
          if (selectedIndices.length < 2) {
            selectedIndices.push(idx);
            cardEl.style.outline = '3px solid #8B6DC4';
            cardEl.style.outlineOffset = '2px';
            cardEl.style.transform = 'translateY(-4px)';
          }
        }
        confirmBtn.disabled = selectedIndices.length !== 2;
      };
      
      handSelectionEl.appendChild(cardEl);
    });

    cheatSylus.style.display = 'flex';

    confirmBtn.onclick = () => {
      let card1, card2;

      // If player is struggling, Sylus gives them his best cards
      if (state.playerScore < state.aiScore) {
        state.aiHand.sort((a, b) => b.value - a.value); // sort descending
        card1 = state.aiHand.splice(0, 1)[0];
        card2 = state.aiHand.splice(0, 1)[0];
      } else {
        // Otherwise, standard random pull based on what they clicked
        selectedIndices.sort((a, b) => b - a);
        card1 = state.aiHand.splice(selectedIndices[0], 1)[0];
        card2 = state.aiHand.splice(selectedIndices[1], 1)[0];
      }

      // Add to player hand temporarily
      state.playerHand.push(card1, card2);
      
      const totalCards = state.gameMode === 'advanced' ? (state.playerHand.length + state.playerAssistHand.length) : state.playerHand.length;
      if (totalCards > 10) {
        const excess = totalCards - 10;
        state.playerHand.splice(state.playerHand.length - excess, excess); // drop the extra cards that overflowed
        showToast('Hand capacity reached! Extra cards were burned.', 3000);
      }
      
      cheatSylus.style.display = 'none';

      // Show randomizer modal
      const stealOverlay = document.getElementById('kc-cheat-sylus-steal');
      const stealHandEl = document.getElementById('kc-sylus-steal-hand');
      stealOverlay.style.display = 'flex';
      stealHandEl.innerHTML = '';
      
      const cardEls = [];
      state.playerHand.forEach((card, i) => {
        const el = createCardElement(card, false, i);
        el.style.transition = 'box-shadow 0.1s, transform 0.1s';
        stealHandEl.appendChild(el);
        cardEls.push(el);
      });
      
      // Determine target index
      let targetIdx = 0;
      if (state.playerScore < state.aiScore) {
        let worstIdx = 0;
        for (let i = 1; i < state.playerHand.length; i++) {
          if (state.playerHand[i].value < state.playerHand[worstIdx].value) worstIdx = i;
        }
        targetIdx = worstIdx;
      } else {
        targetIdx = Math.floor(Math.random() * state.playerHand.length);
      }
      
      // Run randomizer animation
      let animTicks = 0;
      let lastHighlighted = -1;
      const maxTicks = 20; // ~2 seconds
      
      const animTimer = setInterval(() => {
        if (lastHighlighted > -1) {
          cardEls[lastHighlighted].style.boxShadow = 'none';
          cardEls[lastHighlighted].style.transform = 'translateY(0)';
        }
        
        animTicks++;
        if (animTicks >= maxTicks) {
          clearInterval(animTimer);
          // Highlight target definitively
          cardEls[targetIdx].style.boxShadow = '0 0 15px 4px #8B6DC4';
          cardEls[targetIdx].style.transform = 'translateY(-10px)';
          
          setTimeout(() => {
            const stolenCard = state.playerHand.splice(targetIdx, 1)[0];
            state.aiHand.push(stolenCard);
            stealOverlay.style.display = 'none';
            showToast(`You took 2 cards! Sylus took your ${stolenCard.color} ${stolenCard.value} in exchange.`, 4000);
            renderAll();
          }, 1200);
        } else {
          // Highlight a random card
          let r = Math.floor(Math.random() * cardEls.length);
          cardEls[r].style.boxShadow = '0 0 15px 4px #8B6DC4';
          cardEls[r].style.transform = 'translateY(-10px)';
          lastHighlighted = r;
        }
      }, 100);
    };
  }

  // ── Caleb: Sneak Draw ──────────────────────────────────
  function showCalebCheat(callback) {
    if (state.deck.length === 0) { callback(); return; }

    const calebNotices = Math.random() < 0.30;
    const holdDuration = 2000;
    const failDur = calebNotices ? 1500 : 6000;

    const toastText = rand([
      "He's very focused. I'll just draw another card.",
      "Let me draw another card. He won't notice."
    ]);
    showToast(toastText, failDur);

    const deckCell = document.querySelector('.deck-cell');
    if (deckCell) {
      const btn = document.createElement('div');
      btn.className = 'kc-caleb-deck-btn';
      btn.id = 'kc-playtricks-btn';
      
      const fill = document.createElement('div');
      fill.className = 'kc-caleb-deck-fill';
      btn.appendChild(fill);
      
      const txt = document.createElement('span');
      txt.id = 'kc-playtricks-text';
      txt.innerHTML = 'Play<br>Tricks';
      btn.appendChild(txt);
      
      deckCell.appendChild(btn);

      let holdStart = null;
      let holdTimer = null;
      let overallTimer = null;
      let resolved = false;

      const windowStart = Date.now();
      
      overallTimer = setInterval(() => {
        if (!btn.isConnected) {
           clearInterval(overallTimer);
           if (holdTimer) clearInterval(holdTimer);
           return;
        }
        const elapsed = Date.now() - windowStart;
        if (elapsed >= failDur && !resolved) {
          resolved = true;
          clearInterval(overallTimer);
          if (holdTimer) clearInterval(holdTimer);
          
          if (calebNotices && holdStart) {
            btn.classList.add('caught');
            txt.innerHTML = '<i data-lucide="alert-triangle" style="width:24px;height:24px;color:white;"></i>';
            if (window.lucide) lucide.createIcons();
            showToast('"Hey! I saw that!" Caleb catches you red-handed!', 5000);
            setTimeout(() => { btn.remove(); }, 1500);
          } else {
            btn.remove();
          }
        }
      }, 50);

      function onStart(e) {
        if (e.type !== 'mousedown' && e.type !== 'touchstart') return;
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        if (resolved || holdTimer) return;
        holdStart = Date.now();
        holdTimer = setInterval(() => {
          if (!btn.isConnected) {
            clearInterval(holdTimer);
            holdTimer = null;
            return;
          }
          const held = Date.now() - holdStart;
          const pct = Math.min(100, (held / holdDuration) * 100);
          fill.style.height = pct + '%';
          if (held >= holdDuration && !resolved) {
            resolved = true;
            clearInterval(holdTimer);
            clearInterval(overallTimer);
            
            const stolen = state.deck.pop();
            state.playerHand.push(stolen);
            showToast(`You sneak a ${stolen.color} ${stolen.value} from the deck!`, 4000);
            renderAll();
          }
        }, 30);
      }
      
      function onEnd(e) {
        if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
        if (!resolved) fill.style.height = '0%';
      }

      btn.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); });
      btn.addEventListener('mousedown', onStart);
      btn.addEventListener('touchstart', onStart, { passive: false });
      btn.addEventListener('mouseup', onEnd);
      btn.addEventListener('mouseleave', onEnd);
      btn.addEventListener('touchend', onEnd);
      btn.addEventListener('touchcancel', onEnd);
    }

    // Instantly return control to player, cheat is active in background!
    state.phase = 'playing';
    callback();
    return failDur;
  }

  // ── Valko: Colorblind Cheat ─────────────────────────────
  function showValkoCheatIntercept(action, callback) {
    const cardIdx = action.cardIdx;
    const cupIdx = action.cupIdx;
    const card = state.aiHand[cardIdx];
    const targetCup = { c: state.cups[cupIdx], i: cupIdx };

    // Apply glow
    state._valkoTargetGlow = targetCup;
    renderCupGrid();

    // Show modal
    const modal = document.getElementById('kc-cheat-valko-colorblind');
    const cardContainer = document.getElementById('kc-valko-colorblind-card-container');
    const cupContainer = document.getElementById('kc-valko-colorblind-cup-container');
    const timerBar = document.getElementById('kc-valko-colorblind-timer-bar');
    const timerText = document.getElementById('kc-valko-colorblind-timer-text');
    const yesBtn = document.getElementById('kc-valko-colorblind-yes');
    const noBtn = document.getElementById('kc-valko-colorblind-no');

    // Create card element
    cardContainer.innerHTML = '';
    const cardEl = createCardElement(card, false, -1);
    cardEl.style.pointerEvents = 'none'; // non-interactive
    cardContainer.appendChild(cardEl);

    // Create cup element representation
    cupContainer.innerHTML = '';
    const cupEl = document.createElement('div');
    cupEl.className = `kc-cup-cell cup-${targetCup.c.color}`;
    cupEl.dataset.cupColor = targetCup.c.color;
    cupEl.style.width = '70px';
    cupEl.style.height = '100px';
    cupEl.style.margin = '0';
    cupEl.style.transform = 'scale(1.2)';
    
    const cupI = document.createElement('img');
    cupI.src = cupImg(targetCup.c.color);
    cupI.alt = `${targetCup.c.color} cup`;
    cupI.className = 'kc-cup-img';
    cupI.draggable = false;
    cupEl.appendChild(cupI);
    
    cupContainer.appendChild(cupEl);

    modal.style.display = 'flex';

    // Timer setup
    const timeLimit = 5000;
    const startTime = Date.now();
    let resolved = false;
    let timerInterval;

    // Reset bar to full before starting
    timerBar.style.transition = 'none';
    timerBar.style.width = '100%';
    void timerBar.offsetWidth; // Force reflow
    timerBar.style.transition = 'width 0.05s linear';

    yesBtn.onclick = () => {
      if (resolved) return;
      resolved = true;
      clearInterval(timerInterval);
      handleValkoChoice(true);
    };

    noBtn.onclick = () => {
      if (resolved) return;
      resolved = true;
      clearInterval(timerInterval);
      handleValkoChoice(false);
    };

    timerInterval = setInterval(() => {
      if (!modal.isConnected || resolved) {
        clearInterval(timerInterval);
        return;
      }
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / timeLimit) * 100);
      timerBar.style.width = pct + '%';
      
      const secsLeft = Math.ceil((timeLimit - elapsed) / 1000);
      if (timerText) timerText.textContent = secsLeft > 0 ? `${secsLeft}s to decide` : 'Time\'s up!';

      if (elapsed >= timeLimit && !resolved) {
        clearInterval(timerInterval);
        resolved = true;
        handleValkoChoice(Math.random() > 0.5); // Random choice if timed out
      }
    }, 50);

    function handleValkoChoice(didPlayerSayYes) {
      modal.style.display = 'none';
      state._valkoTargetGlow = null;
      renderCupGrid();

      const isMatch = card.color === targetCup.c.color;

      endCheat(() => {
        if (didPlayerSayYes) {
          if (isMatch) showToast('"I knew it. Don\'t think I needed your help."', 3000);
          else showToast('"You lied to me. I won\'t forget this."', 3000);
          executeAiAction({ ...action, isCheatConfirmed: true });
        } else {
          if (isMatch) showToast('"Are you sure? Hmph, fine."', 3000);
          else showToast('"Good. I was just testing you."', 3000);
          
          // AI redecides: block this cup temporarily
          targetCup.c.card = { dummy: true };
          const newBest = findBestAiPlay(state.aiHand, state.cups);
          targetCup.c.card = null;

          if (newBest) {
            executeAiAction({ type: 'play', cardIdx: newBest.cardIdx, cupIdx: newBest.cupIdx, isCheatConfirmed: true });
          } else {
            executeAiAction({ type: 'draw', isCheatConfirmed: true });
          }
        }
      });
    }
  }

  function endCheat(callback) {
    state.phase = 'playing';
    state.cheatActive = null;
    callback();
  }

  // ── Hold Button Helper ─────────────────────────────────
  function startHoldButton(btnId, fillId, timerId, holdDuration, onSuccess, onFail) {
    const btn  = document.getElementById(btnId);
    const fill = document.getElementById(fillId);
    const timer = document.getElementById(timerId);

    let holdStart = null;
    let holdTimer = null;
    let timerInterval = null;
    let resolved = false;

    const windowDuration = holdDuration + 2000; // total window before fail
    const windowStart = Date.now();

    fill.style.width = '0%';
    timer.style.width = '100%';

    // Overall timer countdown
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - windowStart;
      const pct = Math.max(0, 100 - (elapsed / windowDuration) * 100);
      timer.style.width = pct + '%';
      if (elapsed >= windowDuration && !resolved) {
        clearInterval(timerInterval);
        resolved = true;
        clearHoldListeners();
        onFail();
      }
    }, 50);

    function onStart(e) {
      e.preventDefault();
      if (resolved) return;
      holdStart = Date.now();
      holdTimer = setInterval(() => {
        const held = Date.now() - holdStart;
        const pct = Math.min(100, (held / holdDuration) * 100);
        fill.style.width = pct + '%';
        if (held >= holdDuration && !resolved) {
          resolved = true;
          clearInterval(holdTimer);
          clearInterval(timerInterval);
          clearHoldListeners();
          onSuccess();
        }
      }, 30);
    }

    function onEnd() {
      if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
      holdStart = null;
      if (!resolved) fill.style.width = '0%';
    }

    btn.addEventListener('mousedown', onStart);
    btn.addEventListener('touchstart', onStart, { passive: false });
    btn.addEventListener('mouseup', onEnd);
    btn.addEventListener('mouseleave', onEnd);
    btn.addEventListener('touchend', onEnd);

    function clearHoldListeners() {
      btn.removeEventListener('mousedown', onStart);
      btn.removeEventListener('touchstart', onStart);
      btn.removeEventListener('mouseup', onEnd);
      btn.removeEventListener('mouseleave', onEnd);
      btn.removeEventListener('touchend', onEnd);
      if (holdTimer) clearInterval(holdTimer);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  SCORE RECALCULATION
  // ═══════════════════════════════════════════════════════

  function recalcScores() {
    state.playerScore = 0;
    state.aiScore = 0;
    state.cups.forEach(cup => {
      if (!cup.card) return;
      const pts = calcPoints(cup.card, cup);
      if (cup.owner === 'player') state.playerScore += pts;
      else if (cup.owner === 'ai') state.aiScore += pts;
    });
    renderScores();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME OVER
  // ═══════════════════════════════════════════════════════

  function checkGameOver() {
    const allFilled = state.cups.every(c => c.card);
    if (!allFilled) return false;

    state.phase = 'results';
    setTimeout(() => showResults(), 800);
    return true;
  }

  function showResults(forfeitedWinner = null) {
    const c = COMPANIONS[state.companion];
    
    // If a player forfeited, the other player automatically wins the match
    if (forfeitedWinner === 'player') {
      state.matchWinsPlayer = 3;
    } else if (forfeitedWinner === 'ai') {
      state.matchWinsAi = 3;
    } else {
      // Normal end of round
      if (state.playerScore > state.aiScore) state.matchWinsPlayer++;
      else if (state.aiScore > state.playerScore) state.matchWinsAi++;
    }

    const isMatchOver = (state.gameMode === 'normal' && (state.currentRound >= 3 || forfeitedWinner !== null)) || state.gameMode !== 'normal';
    
    const playerWins = state.playerScore > state.aiScore || forfeitedWinner === 'player';
    const tie = state.playerScore === state.aiScore && !forfeitedWinner;

    if (isMatchOver) {
      const matchWinner = state.matchWinsPlayer > state.matchWinsAi ? 'player' : (state.matchWinsAi > state.matchWinsPlayer ? 'ai' : 'tie');
      if (matchWinner === 'tie') {
        winnerTextEl.textContent = "Match Tie!";
        winnerSubEl.textContent = 'A perfectly balanced match.';
        winnerBannerEl.style.background = 'linear-gradient(135deg, #EDE4F8, #F8F4EE)';
      } else if (matchWinner === 'player') {
        winnerTextEl.textContent = 'You Win the Match! 🎉';
        winnerSubEl.textContent = `You outsmarted ${c.name}!`;
        winnerBannerEl.style.background = 'linear-gradient(135deg, #FFD6E0, #FFEAA0)';
      } else {
        winnerTextEl.textContent = `${c.name} Wins the Match!`;
        winnerSubEl.textContent = 'Better luck next time!';
        winnerBannerEl.style.background = 'linear-gradient(135deg, #EDE4F8, #D4C8F0)';
      }
      playAgainBtn.textContent = 'Play Again';
      playAgainBtn.onclick = () => {
        selectedCompanion = state.companion;
        applyCompanionTheme(state.companion);
        showOrderScreen(state.companion);
      };
    } else {
      // Round over
      if (tie) {
        winnerTextEl.textContent = `Round ${state.currentRound} Tie!`;
        winnerSubEl.textContent = 'Nobody wins this round.';
        winnerBannerEl.style.background = 'linear-gradient(135deg, #EDE4F8, #F8F4EE)';
      } else if (playerWins) {
        winnerTextEl.textContent = `You Win Round ${state.currentRound}!`;
        winnerSubEl.textContent = 'Great job!';
        winnerBannerEl.style.background = 'linear-gradient(135deg, #FFD6E0, #FFEAA0)';
      } else {
        winnerTextEl.textContent = `${c.name} Wins Round ${state.currentRound}!`;
        winnerSubEl.textContent = 'They took that one.';
        winnerBannerEl.style.background = 'linear-gradient(135deg, #EDE4F8, #D4C8F0)';
      }
      playAgainBtn.textContent = 'Next Round';
      playAgainBtn.onclick = prepareNextRound;
    }

    resultPlayerPts.textContent = state.playerScore;
    resultAiPts.textContent = state.aiScore;
    resultAiName.textContent = c.name;

    resultPlayerPanel.classList.toggle('winner', playerWins);
    resultAiPanel.classList.toggle('winner', !playerWins && !tie);

    showScreen('results');
  }

  const FORFEIT_DIALOGS_PLAYER_WINNING = {
    'xavier': "I surrender. The kitties are so fierce today.",
    'zayne': "You beat me. I surrender.",
    'rafayel': "You and the cats are big meanies. I'm done playing.",
    'sylus': "It's just a waste of time. We should go now.",
    'caleb': "I lost. I'm logging off.",
    'valko': "Alright, alright, I yield. I never realized cats could be this lethal."
  };

  const FORFEIT_DIALOGS_AI_WINNING = {
    'xavier': "Are you ready to admit defeat yet?",
    'zayne': "The outcome is certain, you can surrender now, if you'd like.",
    'rafayel': "Do you wanna give up?",
    'sylus': "You can surrender now sweetie. I'm giving you this opportunity.",
    'caleb': "If I surrender now, at least the score will stay at 0:2",
    'valko': "Accept the loss, or do you want to keep embarrassing yourself?"
  };

  function prepareNextRound() {
    state.currentRound++;
    
    // Check Forfeit condition at start of Round 3
    if (state.currentRound === 3 && (state.matchWinsPlayer === 2 || state.matchWinsAi === 2)) {
      showForfeitDialog();
    } else {
      startRound();
    }
  }

  function showForfeitDialog() {
    state.phase = 'cheat';
    const c = COMPANIONS[state.companion];
    forfeitPortrait.src = c.avatar;
    forfeitSpeaker.textContent = c.name;
    forfeitSpeaker.style.color = c.color;

    if (state.matchWinsPlayer === 2) {
      // Player is winning 2-0. AI offers to forfeit.
      forfeitDesc.textContent = `"${FORFEIT_DIALOGS_PLAYER_WINNING[state.companion]}"`;
      forfeitAcceptBtn.textContent = 'Accept their surrender';
      forfeitRefuseBtn.textContent = 'No, play the last round!';
      
      forfeitAcceptBtn.onclick = () => {
        cheatForfeit.style.display = 'none';
        showResults('player');
      };
    } else {
      // AI is winning 2-0. AI offers player to forfeit.
      forfeitDesc.textContent = `"${FORFEIT_DIALOGS_AI_WINNING[state.companion]}"`;
      forfeitAcceptBtn.textContent = 'Surrender';
      forfeitRefuseBtn.textContent = 'Never give up!';

      forfeitAcceptBtn.onclick = () => {
        cheatForfeit.style.display = 'none';
        showResults('ai');
      };
    }

    forfeitRefuseBtn.onclick = () => {
      cheatForfeit.style.display = 'none';
      startRound();
    };

    cheatForfeit.style.display = 'flex';
  }

  // ═══════════════════════════════════════════════════════
  //  FLOATING POINTS ANIMATION
  // ═══════════════════════════════════════════════════════

  function spawnFloatingPts(pts, cup, card, isAi = false) {
    if (pts === 0 && !isAi) return;
    const el = document.createElement('div');
    el.className = 'kc-floating-pts';

    if (pts === 0) { el.classList.add('zero'); el.textContent = '0'; }
    else if (card.color === cup.color) { el.classList.add('matched'); el.textContent = `+${pts} ×2!`; }
    else { el.classList.add('standard'); el.textContent = `+${pts}`; }

    // Position near the cup grid
    const gridRect = cupGridEl.getBoundingClientRect();
    el.style.left = `${gridRect.left + gridRect.width / 2}px`;
    el.style.top = `${gridRect.top + (isAi ? 0 : gridRect.height)}px`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  // ═══════════════════════════════════════════════════════
  //  CHARACTER SELECT SCREEN
  // ═══════════════════════════════════════════════════════

  let selectedCompanion = null;

  function buildCharSelect() {
    charGrid.innerHTML = '';
    Object.entries(COMPANIONS).forEach(([key, c]) => {
      const card = document.createElement('div');
      card.className = 'kc-char-card';
      card.dataset.key = key;
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <img src="${c.avatar}" alt="${c.name}" class="kc-char-avatar" draggable="false">
        <span class="kc-char-name">${c.name}</span>
      `;
      card.addEventListener('click', () => selectCompanion(key));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') selectCompanion(key); });
      charGrid.appendChild(card);
    });
  }

  function selectCompanion(key) {
    selectedCompanion = key;
    document.querySelectorAll('.kc-char-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.key === key);
    });
    // Apply temporary theme
    applyCompanionTheme(key);
    charConfirmBtn.style.display = 'flex';
    charConfirmBtn.textContent = `Play with ${COMPANIONS[key].name} →`;
  }

  charConfirmBtn.addEventListener('click', () => {
    if (!selectedCompanion) return;
    showOrderScreen(selectedCompanion);
  });

  exitCharBtn.addEventListener('click', () => {
    showScreen('mode-select');
  });

  backToCharBtn.addEventListener('click', () => {
    selectedCompanion = null;
    showScreen('select');
  });

  // ═══════════════════════════════════════════════════════
  //  ORDER SCREEN
  // ═══════════════════════════════════════════════════════

  function showOrderScreen(key) {
    const c = COMPANIONS[key];
    orderScreenEl.dataset.companion = key;
    applyCompanionTheme(key);

    orderPortrait.src = c.avatar;
    orderPortrait.alt = c.name;
    orderSpeaker.textContent = c.name;
    orderSpeaker.style.color = c.color;

    // Random dialogue
    const selectedDialogue = rand(c.orderDialogues);
    orderText.textContent = selectedDialogue;

    // Build choice buttons
    orderChoices.style.display = '';
    orderChoices.innerHTML = '';

    if (key === 'caleb' && selectedDialogue.toLowerCase().includes('rock paper scissors')) {
      // Caleb uses RPS — show button to go to RPS screen
      const btn = document.createElement('button');
      btn.className = 'kc-order-btn primary';
      btn.textContent = 'Let\'s play!';
      btn.addEventListener('click', () => showRpsScreen());
      orderChoices.appendChild(btn);
    } else {
      c.orderChoices.forEach((label, idx) => {
        const btn = document.createElement('button');
        btn.className = idx === 0 ? 'kc-order-btn primary' : 'kc-order-btn';
        btn.textContent = label;
        btn.addEventListener('click', () => handleOrderChoice(key, idx));
        orderChoices.appendChild(btn);
      });
    }

    showScreen('order');
  }

  function handleOrderChoice(key, choiceIdx) {
    const c = COMPANIONS[key];
    const result = c.orderLogic(choiceIdx);

    // Check if companion forced a different outcome
    const wasForced = (key === 'zayne' && choiceIdx === 0 && result === 'player') ||
                      (key === 'rafayel' && choiceIdx === 1 && result === 'ai');

    if (wasForced) {
      const insistText = c.orderInsistText || '';
      document.getElementById('kc-order-text').textContent = insistText;
      document.getElementById('kc-order-choices').style.display = 'none';
      setTimeout(() => {
        // Zayne: after insisting, 40% chance he also offers difficulty
        if (key === 'zayne' && Math.random() < 0.40) {
          showZayneDiffScreen(result);
        } else {
          startGame(key, result);
        }
      }, 2200);
    } else {
      // Zayne: 40% chance he also offers difficulty selection
      if (key === 'zayne' && Math.random() < 0.40) {
        showZayneDiffScreen(result);
      } else {
        startGame(key, result);
      }
    }
  }

  // ═══════════════════════════════════════════════════════
  //  ZAYNE DIFFICULTY SCREEN
  // ═══════════════════════════════════════════════════════

  const ZAYNE_DIFF_DIALOGUES = [
    '"One more thing — how difficult do you want this to be?"',
    '"Before we start... Easy, or something more... appropriate for you?"',
    '"I suppose I should give you a choice. Though I already know what you\'ll pick."',
    '"Difficulty. Choose wisely — or let me decide."',
  ];

  const ZAYNE_PICKS_EASY = [
    '"...Fine. I\'ll go easy on you this time. Don\'t get used to it."',
    '"Easy it is. Consider it a kindness."',
    '"Easy. You look like you could use a break."',
  ];

  const ZAYNE_PICKS_HELL = [
    '"Hell. Obviously."',
    '"I chose Hell. You wanted to play Kitty Cards, didn\'t you? Then play properly."',
    '"Hell. If you wanted easy, you shouldn\'t have let me decide."',
  ];

  let _zayneDiffFirstPlayer = null;

  function showZayneDiffScreen(firstPlayer) {
    _zayneDiffFirstPlayer = firstPlayer;
    document.getElementById('kc-zayne-diff-text').textContent = rand(ZAYNE_DIFF_DIALOGUES);
    document.getElementById('kc-zayne-picked-result').style.display = 'none';
    document.getElementById('kc-zayne-diff-continue').style.display = 'none';
    document.querySelectorAll('.kc-diff-btn').forEach(b => {
      b.disabled = false;
      b.classList.remove('selected');
    });
    showScreen('zayne_diff');
  }

  document.querySelectorAll('.kc-diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.diff;
      document.querySelectorAll('.kc-diff-btn').forEach(b => {
        b.disabled = true;
        b.classList.remove('selected');
      });
      btn.classList.add('selected');

      if (choice === 'zayne-pick') {
        // Show thinking state then reveal his pick
        const pickedEl = document.getElementById('kc-zayne-picked-result');
        const pickedTextEl = document.getElementById('kc-zayne-picked-text');
        pickedEl.style.display = 'block';
        pickedEl.innerHTML = '<div class="kc-zayne-thinking"><span class="kc-thinking-dots"><span></span><span></span><span></span></span>&nbsp;Zayne is deciding...</div>';
        // Re-create dots
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
          // Zayne picks randomly, slightly weighted toward hell
          const zaynePick = Math.random() < 0.60 ? 'hell' : 'easy';
          const pickText = zaynePick === 'hell'
            ? rand(ZAYNE_PICKS_HELL)
            : rand(ZAYNE_PICKS_EASY);

          pickedEl.innerHTML = '';
          const p = document.createElement('p');
          p.className = 'kc-dialogue-text';
          p.textContent = pickText;
          pickedEl.appendChild(p);

          // Highlight corresponding button
          document.querySelector(`.kc-diff-btn[data-diff="${zaynePick}"]`).classList.add('selected');

          const continueBtn = document.getElementById('kc-zayne-diff-continue');
          continueBtn.style.display = 'flex';
          continueBtn.onclick = () => startGame('zayne', _zayneDiffFirstPlayer, zaynePick);
        }, 2000);

      } else {
        // Easy or Hell — player chose
        const continueBtn = document.getElementById('kc-zayne-diff-continue');
        continueBtn.style.display = 'flex';
        continueBtn.onclick = () => startGame('zayne', _zayneDiffFirstPlayer, choice);
      }
    });
  });

  // ═══════════════════════════════════════════════════════
  //  RPS SCREEN (Caleb)
  // ═══════════════════════════════════════════════════════

  const RPS_WINS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
  const RPS_EMOJI = { rock: '✊', scissors: '✌️', paper: '🖐️' };

  function showRpsScreen() {
    rpsResult.textContent = '';
    rpsContinueBtn.style.display = 'none';
    document.querySelectorAll('.kc-rps-btn').forEach(btn => btn.disabled = false);
    rpsText.textContent = '"Best of one — winner goes first. Ready?"';
    showScreen('rps');
  }

  document.querySelectorAll('.kc-rps-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const playerChoice = btn.dataset.rps;
      let aiChoice = rand(['rock', 'paper', 'scissors']);
      
      // Caleb's perceived RNG luck in RPS
      if (state.companion === 'caleb' && Math.random() < 0.65) {
         aiChoice = Object.keys(RPS_WINS).find(k => RPS_WINS[k] === playerChoice);
      }

      document.querySelectorAll('.kc-rps-btn').forEach(b => b.disabled = true);

      rpsText.textContent = `You: ${RPS_EMOJI[playerChoice]} vs Caleb: ${RPS_EMOJI[aiChoice]}`;

      let firstPlayer;
      if (playerChoice === aiChoice) {
        const tieDialogues = [
          '"A tie? Tell you what, I\'ll let you go first this time.\nShow me what you\'ve got."',
          '"Looks like a draw. Since I\'m older, I\'ll let you take the lead."',
          '"We tied? Hah, go ahead and take the first turn.\nDon\'t say I never give you an advantage."',
          '"A tie? I\'ll let you go first.\nBut don\'t expect me to go easy on you after that."'
        ];
        rpsResult.innerHTML = `
          <div style="color:var(--caleb-color); font-style:italic; font-size:14px; margin-bottom:10px;">${rand(tieDialogues)}</div>
          <span style="color:#4A9060; font-weight:bold;">It's a tie! You go first!</span>
        `;
        firstPlayer = 'player';
      } else if (RPS_WINS[playerChoice] === aiChoice) {
        rpsResult.innerHTML = `<span style="color:#4A9060; font-weight:bold;">You win! You go first!</span>`;
        firstPlayer = 'player';
      } else {
        rpsResult.innerHTML = `<span style="color:var(--caleb-color); font-weight:bold;">Caleb wins! He goes first.</span>`;
        firstPlayer = 'ai';
      }

      rpsContinueBtn.style.display = 'flex';
      rpsContinueBtn.onclick = () => startGame('caleb', firstPlayer);
    });
  });

  // ═══════════════════════════════════════════════════════
  //  BOARD EVENT LISTENERS
  // ═══════════════════════════════════════════════════════

  // Removed button event listeners

  gameExitBtn.addEventListener('click', () => {
    if (confirm('Forfeit this game and return to character select?')) {
      // Reset and go back to character select
      state.phase = 'select';
      // Hide all cheats
      [cheatXavier, cheatZayne, cheatZayneUndo, cheatRafayel, cheatRafayelCaught,
       cheatSylus, cheatCaleb, cheatValko].forEach(el => el.style.display = 'none');
      playerHandEl.style.filter = '';
      selectedCompanion = null;
      showScreen('select');
    }
  });

  if (passAssistBtn) {
    passAssistBtn.addEventListener('click', () => {
      if (state.gameMode === 'advanced' && state.currentTurn === 'player' && state.advancedPhase === 'assist' && !state.placingCard) {
        advancedPlayerPassAssist();
      }
    });
  }

  // Cup grid clicks
  cupGridEl.addEventListener('click', (e) => {
    const cell = e.target.closest('.kc-cup-cell');
    if (!cell) return;

    // Deck cell click (draw)
    if (cell.classList.contains('deck-cell')) {
      if (state.currentTurn === 'player' && state.phase === 'playing' && !state.placingCard) {
        if (state.gameMode === 'advanced') {
          if (state.advancedPhase === 'number') {
            onAdvancedDrawNumber();
          } else {
            showToast('You already drew an Assist Card at the start of your turn!', 2000);
          }
        } else {
          onDrawCard();
        }
      }
      return;
    }

    const cupIdx = parseInt(cell.dataset.cup);
    if (isNaN(cupIdx)) return;

    // Xavier swap mode
    if (state.xavierSwapFirst !== null) return; // handled by swap listener

    // Cup placement mode
    if (state.placingCard && state.currentTurn === 'player') {
      onCupClickDuringPlacement(cupIdx);
    }
  });

  // Results buttons
  // (playAgainBtn onclick is handled dynamically in showResults)

  resultsExitBtn.addEventListener('click', () => {
    showScreen('mode-select');
  });

  // ═══════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════

  buildCharSelect();

  // Mode Select buttons
  modeNormalBtn.addEventListener('click', () => {
    state.gameMode = 'normal';
    showScreen('select');
  });

  modeAdvancedBtn.addEventListener('click', () => {
    state.gameMode = 'advanced';
    showScreen('select');
  });

  exitModeBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  showScreen('mode-select');

  // Re-create lucide icons after initial render
  setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 100);

  // ═══════════════════════════════════════════════════════
  //  ADVANCED MODE — CORE
  // ═══════════════════════════════════════════════════════

  function buildAssistDeck() {
    const cards = [];
    // 2 copies of each assist card
    for (const def of ASSIST_CARD_TYPES) {
      cards.push({ ...def });
      cards.push({ ...def });
    }
    return shuffle(cards);
  }

  // Deal 1 assist card to a hand (player or AI), burn if full
  function dealAssistCard(handKey) {
    if (state.assistDeck.length === 0) return;
    const totalCards = state[handKey].length + state[handKey === 'playerAssistHand' ? 'playerHand' : 'aiHand'].length;
    if (totalCards >= 10) {
      state.assistDeck.pop(); // burned
      if (handKey === 'playerAssistHand') showToast('Hand full! Assist Card burned.', 2500);
    } else {
      state[handKey].push(state.assistDeck.pop());
    }
  }

  function showAdvancedPhaseBanner(text, isNumber, callback) {
    const banner = document.getElementById('kc-adv-phase-banner');
    const bannerText = document.getElementById('kc-adv-phase-banner-text');
    bannerText.textContent = text;
    banner.style.display = 'block';
    banner.classList.remove('number-phase');
    if (isNumber) banner.classList.add('number-phase');
    // Slide in
    requestAnimationFrame(() => {
      banner.classList.add('show');
      setTimeout(() => {
        banner.classList.remove('show');
        setTimeout(() => { banner.style.display = 'none'; callback(); }, 450);
      }, 1400);
    });
  }

  function showAiAssistRevealModal(card, callback) {
    const modal = document.getElementById('kc-ai-assist-reveal');
    const title = document.getElementById('kc-ai-assist-reveal-title');
    const img = document.getElementById('kc-ai-assist-reveal-img');
    const desc = document.getElementById('kc-ai-assist-reveal-desc');

    title.textContent = `${COMPANIONS[state.companion].name} plays ${card.name}!`;
    img.src = card.img;
    desc.textContent = card.desc;

    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.display = 'none';
      callback();
    }, 2200);
  }


  // ── PLAYER ADVANCED TURN ──────────────────────────────────

  function startAdvancedPlayerTurn() {
    if (state.phase !== 'playing') return;
    // Deal 1 assist card at turn start
    dealAssistCard('playerAssistHand');
    renderAll();

    if (state.playerSkipAssist) {
      state.playerSkipAssist = false;
      showToast('Your Assist Phase was skipped! (Freeze)', 2500);
      showAdvancedPhaseBanner('❄️ Assist Phase Skipped!', false, () => startAdvancedNumberPhase('player'));
    } else {
      state.advancedPhase = 'assist';
      updateTurnBadge();
      renderAll();
      showAdvancedPhaseBanner('Assist Phase', false, () => {
        setStatus('Assist Phase: Play Assist Cards, draw one, or end phase.');
      });
    }
  }

  function startAdvancedNumberPhase(who) {
    if (who === 'player') {
      if (state.playerSkipNumber) {
        state.playerSkipNumber = false;
        showToast('Your Number Phase was skipped! (Skip)', 2500);
        state.advancedPhase = 'assist'; // reset for next turn
        checkCheatTrigger(() => endPlayerTurn());
        return;
      }
      state.advancedPhase = 'number';
      state.pawComboActive = false;
      state.pawComboCount = 0;
      updateTurnBadge();
      renderAll();
      showAdvancedPhaseBanner('Number Phase', true, () => {
        if (state.playerHand.length === 0 && state.deck.length === 0) {
          showToast('No cards left to play or draw — turn passes.', 3000);
          setTimeout(() => {
            state.advancedPhase = 'assist';
            checkCheatTrigger(() => endPlayerTurn());
          }, 2000);
          return;
        }
        setStatus('Number Phase: Play a Number Card or draw from the deck.');
      });
    }
  }

  function advancedPlayerPassAssist() {
    // Player passes assist phase
    state.advancedPhase = 'number';
    startAdvancedNumberPhase('player');
  }

  function canPlayAssistCard(cardKey, isAi = false) {
    const cardsOnBoard = state.cups.some(c => c.card);
    const playerCupsOccupied = state.cups.some(c => c.card && c.owner === 'player');
    const aiCupsOccupied = state.cups.some(c => c.card && c.owner === 'ai');
    const emptyCupsLeft = state.cups.filter(c => !c.card).length;
    const isEarlyGame = emptyCupsLeft >= 6; // first 2 cups haven't been filled yet

    if (cardKey === 'meow_this') {
      return { playable: false, reason: "Can only be played to interrupt your opponent's Assist Card." };
    }
    if (cardKey === 'magic_paw') {
      const opponent = isAi ? 'player' : 'ai';
      const hasOpponentCard = isAi ? playerCupsOccupied : aiCupsOccupied;
      return hasOpponentCard
        ? { playable: true }
        : { playable: false, reason: "The opponent hasn't placed any kitties yet." };
    }
    if (cardKey === 'bye_bye') {
      return cardsOnBoard
        ? { playable: true }
        : { playable: false, reason: "There are no kitties on the board to discard." };
    }
    if (cardKey === 'kitty_pow') {
      // Useless if no cards exist on the board AND both hands are empty
      const playerHasCards = state.playerHand.length > 0;
      const aiHasCards = state.aiHand.length > 0;
      return (playerHasCards || aiHasCards)
        ? { playable: true }
        : { playable: false, reason: "No Number Cards exist to discard right now." };
    }
    if (cardKey === 'purrceive') {
      const opponentNumCards = isAi ? state.playerHand.length : state.aiHand.length;
      const opponentAssistCards = isAi ? state.playerAssistHand.length : state.aiAssistHand.length;
      return (opponentNumCards + opponentAssistCards) > 0
        ? { playable: true }
        : { playable: false, reason: "The opponent has no cards to discard." };
    }
    if (cardKey === 'meowster') {
      const opponentHistory = isAi ? state.playerAssistHistory : state.aiAssistHistory;
      return opponentHistory.length > 0
        ? { playable: true }
        : { playable: false, reason: "The opponent hasn't played any Assist Cards yet." };
    }
    if (cardKey === 'kitty_plot') {
      return { playable: true };
    }
    if (cardKey === 'cat_ching') {
      return state.deck.length > 0
        ? { playable: true }
        : { playable: false, reason: "The Number Card deck is empty — there's nothing left to draw." };
    }
    if (cardKey === 'paw_combo') {
      const selfNumCards = isAi ? state.aiHand.length : state.playerHand.length;
      return (selfNumCards > 0 || state.deck.length > 0)
        ? { playable: true }
        : { playable: false, reason: "No Number Cards left to play — a combo needs something to play." };
    }
    // skip, freeze, purrator — always playable
    return { playable: true };
  }


  function onPlayerAssistCardClick(idx) {
    if (state.currentTurn !== 'player' || state.phase !== 'playing') return;
    if (state.advancedPhase !== 'assist') return;
    const card = state.playerAssistHand[idx];
    if (!card) return;

    state.selectedAssistCard = idx;
    renderPlayerHand();

    const inspectModal = document.getElementById('kc-player-assist-inspect');
    const title = document.getElementById('kc-player-assist-inspect-title');
    const img = document.getElementById('kc-player-assist-inspect-img');
    const desc = document.getElementById('kc-player-assist-inspect-desc');
    const errorTxt = document.getElementById('kc-player-assist-inspect-error');
    const useBtn = document.getElementById('kc-player-assist-use-btn');
    const cancelBtn = document.getElementById('kc-player-assist-cancel-btn');

    title.textContent = card.name;
    img.src = card.img;
    desc.textContent = card.desc;

    const check = canPlayAssistCard(card.key);
    if (!check.playable) {
      useBtn.disabled = true;
      useBtn.style.opacity = '0.5';
      errorTxt.textContent = check.reason;
      errorTxt.style.display = 'block';
    } else {
      useBtn.disabled = false;
      useBtn.style.opacity = '1';
      errorTxt.style.display = 'none';
    }

    useBtn.onclick = () => {
      inspectModal.style.display = 'none';
      playAssistCard('player', idx);
    };

    cancelBtn.onclick = () => {
      inspectModal.style.display = 'none';
      state.selectedAssistCard = null;
      renderPlayerHand();
    };

    inspectModal.style.display = 'flex';
  }

  function playAssistCard(who, idx) {
    const isPlayer = who === 'player';
    const hand = isPlayer ? state.playerAssistHand : state.aiAssistHand;
    const card = hand[idx];
    if (!card) return;

    // Remove from hand
    hand.splice(idx, 1);

    // Track history (for Meowster)
    const histKey = isPlayer ? 'playerAssistHistory' : 'aiAssistHistory';
    state[histKey].unshift(card);
    if (state[histKey].length > 5) state[histKey].pop();

    renderAll();

    const proceedWithPlay = () => {
      // Check if opponent has Meow This! to interrupt
      if (card.key !== 'meow_this') {
        const opponentMeowIdx = isPlayer
          ? state.aiAssistHand.findIndex(c => c.key === 'meow_this')
          : state.playerAssistHand.findIndex(c => c.key === 'meow_this');

        if (opponentMeowIdx >= 0) {
          showMeowThisInterrupt(card, who, opponentMeowIdx, (denied) => {
            if (denied) {
              setStatus(`${card.name} was cancelled by Meow This!`);
              if (isPlayer) {
                renderAll();
                setStatus('Assist Phase: Play another Assist Card, draw one, or end phase.');
              }
              else startAdvancedAiNumberPhase();
            } else {
              resolveAssistCard(card, who, () => {
                if (isPlayer) {
                  renderAll();
                  setStatus('Assist Phase: Play another Assist Card, draw one, or end phase.');
                }
                else startAdvancedAiNumberPhase();
              });
            }
          });
          return;
        }
      }

      resolveAssistCard(card, who, () => {
        if (isPlayer) {
          renderAll();
          setStatus('Assist Phase: Play another Assist Card, draw one, or end phase.');
        }
        else startAdvancedAiNumberPhase();
      });
    };

    if (!isPlayer) {
      showAiAssistRevealModal(card, proceedWithPlay);
    } else {
      proceedWithPlay();
    }
  }

  function onAdvancedDrawAssist() {
    if (state.currentTurn !== 'player' || state.advancedPhase !== 'assist') return;
    if (state.assistDeck.length === 0) { showToast('Assist Deck is empty!', 2000); return; }
    const totalCards = state.playerAssistHand.length + state.playerHand.length;
    if (totalCards >= 10) {
      showToast('Hand is full! Drawn Assist Card burned.', 2500);
      state.assistDeck.pop();
    } else {
      const card = state.assistDeck.pop();
      state.playerAssistHand.push(card);
      setStatus(`You drew: ${card.name}.`);
    }
    renderAll();
    startAdvancedNumberPhase('player');
  }

  function onAdvancedDrawNumber() {
    if (state.currentTurn !== 'player' || state.advancedPhase !== 'number') return;
    if (state.deck.length === 0) { showToast('Number Deck is empty!', 2000); return; }
    const totalCards = state.playerHand.length + state.playerAssistHand.length;
    if (totalCards >= 10) {
      showToast('Hand is full! Drawn Number Card burned.', 2500);
      state.deck.pop();
    } else {
      const card = state.deck.pop();
      state.playerHand.push(card);
      setStatus(`You drew: ${card.color} ${card.value}.`);
    }
    state.playerMoveCount++;
    renderAll();
    checkCheatTrigger(() => endPlayerTurn());
  }

  // Override cup click in advanced number phase for Paw Combo
  function onAdvancedCupClick(cupIdx) {
    if (!state.placingCard || state.currentTurn !== 'player' || state.advancedPhase !== 'number') return;
    const cup = state.cups[cupIdx];
    if (cup.card) return;

    cheatSylusOffer.style.display = 'none';
    cheatSylus.style.display = 'none';

    const card = state.playerHand.splice(state.selectedCard, 1)[0];
    cup.card = card;
    cup.owner = 'player';
    const pts = calcPoints(card, cup);
    state.playerScore += pts;
    spawnFloatingPts(pts, cup, card);
    state.selectedCard = null;
    state.placingCard = false;
    state.playerMoveCount++;

    if (pts === 0) setStatus(`Placed ${card.color} ${card.value} — no points.`);
    else if (cup.color === 'white') setStatus(`Placed in white cup! +${pts} pts.`);
    else setStatus(`Color match! ${card.color} on ${cup.color} — +${pts} pts! ×2!`);

    renderAll();
    if (checkGameOver()) return;

    state.pawComboCount++;
    if (state.pawComboActive && state.pawComboCount < 2 && state.playerHand.length > 0) {
      setStatus('Paw Combo: Play one more Number Card!');
      return; // wait for second pick
    }
    state.pawComboActive = false;
    state.pawComboCount = 0;
    checkCheatTrigger(() => endPlayerTurn());
  }

  // ── AI ADVANCED TURN ─────────────────────────────────────

  function startAdvancedAiTurn() {
    if (state.phase !== 'playing') return;
    dealAssistCard('aiAssistHand');
    renderAll();

    if (state.aiSkipAssist) {
      state.aiSkipAssist = false;
      setStatus(`${COMPANIONS[state.companion].name}'s Assist Phase was skipped! (Freeze)`);
      showAdvancedPhaseBanner('❄️ Assist Phase Skipped!', false, () => {
        setTimeout(() => startAdvancedAiNumberPhase(), 600);
      });
    } else {
      state.advancedPhase = 'assist';
      renderAll();
      showAdvancedPhaseBanner(`${COMPANIONS[state.companion].name}'s Assist Phase`, false, () => {
        setTimeout(() => doAiAssistPhase(), 1200);
      });
    }
  }

  function startAdvancedAiNumberPhase() {
    if (state.aiSkipNumber) {
      state.aiSkipNumber = false;
      setStatus(`${COMPANIONS[state.companion].name}'s Number Phase was skipped! (Skip)`);
      state.advancedPhase = 'assist';
      triggerAiCheatIfNeeded(() => endAiTurn());
      return;
    }
    state.advancedPhase = 'number';
    renderAll();
    showAdvancedPhaseBanner(`${COMPANIONS[state.companion].name}'s Number Phase`, true, () => {
      setTimeout(() => doAiTurn(), 1000);
    });
  }

  function doAiAssistPhase() {
    const hand = state.aiAssistHand;
    if (hand.length === 0) {
      // Draw an assist card if hand is empty and deck has cards
      if (state.assistDeck.length > 0) {
        dealAssistCard('aiAssistHand');
        renderAll();
      }
      setTimeout(() => startAdvancedAiNumberPhase(), 800);
      return;
    }

    // Decide which assist card to play (per-companion logic)
    const cardToPlayIdx = aiChooseAssistCard();

    if (cardToPlayIdx < 0) {
      // AI passes assist phase
      setStatus(`${COMPANIONS[state.companion].name} passes their Assist Phase.`);
      setTimeout(() => startAdvancedAiNumberPhase(), 1000);
      return;
    }

    const card = hand[cardToPlayIdx];
    setStatus(`${COMPANIONS[state.companion].name} plays ${card.name}!`);
    renderAll();
    setTimeout(() => playAssistCard('ai', cardToPlayIdx), 800);
  }

  // ── AI ASSIST CARD SELECTION (per companion) ────────────

  function aiChooseAssistCard() {
    const hand = state.aiAssistHand;
    if (hand.length === 0) return -1;
    const companion = state.companion;
    const playerAhead = state.playerScore > state.aiScore;
    const aiAhead = state.aiScore > state.playerScore;
    const scoreDiff = Math.abs(state.aiScore - state.playerScore);
    const emptyCupsLeft = state.cups.filter(c => !c.card).length;
    const isLateGame = state.aiHoardMode; // unified with Number phase hoard flag

    // Never play Meow This! proactively (it's reactive), and only play valid cards
    const eligibleHand = hand.map((c, i) => ({ c, i })).filter(x =>
      x.c.key !== 'meow_this' && canPlayAssistCard(x.c.key, true).playable
    );
    if (eligibleHand.length === 0) return -1;

    // Helper: find card index by key among eligible cards
    const findCard = (key) => {
      const match = eligibleHand.find(x => x.c.key === key);
      return match ? match.i : -1;
    };

    switch (companion) {
      case 'xavier': {
        // Counter-puncher / Patient Tactician:
        // Xavier hoards EVERYTHING early. He rarely strikes. When he does, he targets
        // the player's most valuable cup (bye_bye, magic_paw). He is "soft-hearted" —
        // if he's far ahead, he may pass entirely to drag the game out.
        if (!isLateGame && Math.random() < 0.75) return -1; // very patient early
        if (aiAhead && scoreDiff > 8 && Math.random() < 0.5) return -1; // soft-hearted, won't crush you
        // Prioritize disruption of player's high value plays
        const prefer = ['bye_bye', 'magic_paw', 'purrator', 'paw_combo', 'skip'];
        for (const key of prefer) { const i = findCard(key); if (i >= 0) return i; }
        return eligibleHand[0].i;
      }

      case 'zayne': {
        // Late-Game Ambush: hoards ALL assist cards until the very end, then drops them
        // back-to-back to flip colors and delete player kitties. Very high patience.
        if (!isLateGame && Math.random() < 0.90) return -1; // almost never plays early
        // Late game burst — prioritize maximum disruption
        const prefer = ['purrator', 'kitty_pow', 'magic_paw', 'bye_bye', 'skip', 'freeze'];
        for (const key of prefer) { const i = findCard(key); if (i >= 0) return i; }
        return eligibleHand[0].i;
      }

      case 'rafayel': {
        // Impulsive & Defensive: uses cards readily, especially when losing.
        // Prioritizes blocking the player. More reactive, less strategic.
        const playThreshold = playerAhead ? 0.25 : (aiAhead ? 0.65 : 0.45);
        if (Math.random() < playThreshold) return -1;
        // Prioritize destroying or denying player cups, then defensive draw
        const prefer = playerAhead
          ? ['bye_bye', 'magic_paw', 'purrator', 'purrceive', 'kitty_plot']
          : ['purrator', 'cat_ching', 'purrceive', 'meowster'];
        for (const key of prefer) { const i = findCard(key); if (i >= 0) return i; }
        return eligibleHand[0].i;
      }

      case 'sylus': {
        // Manipulative & Adaptable — uses color manipulation aggressively.
        // Paw Combo only when he has enough cards to actually use the extra action.
        // Otherwise he's lenient early and ruthless once ahead.
        if (!aiAhead && !isLateGame && Math.random() < 0.45) return -1;

        // Only use paw_combo if hand has 4+ number cards (otherwise waste)
        const pawComboReady = state.aiHand.length >= 4;
        
        if (aiAhead) {
          // Ruthless mode: lock board, deny player
          const prefer = [
            ...(pawComboReady ? ['paw_combo'] : []),
            'purrator', 'magic_paw', 'bye_bye', 'kitty_plot', 'meowster'
          ];
          for (const key of prefer) { const i = findCard(key); if (i >= 0) return i; }
        } else {
          // Survival mode: steal cards, reposition
          const prefer = ['purrator', 'purrceive', 'cat_ching', 'meowster', 'kitty_plot'];
          for (const key of prefer) { const i = findCard(key); if (i >= 0) return i; }
        }
        return eligibleHand[0].i;
      }

      case 'caleb': {
        // Mind games: unpredictable, but calculated chaos.
        // Never plays kitty_pow when no cards are on board (pointless).
        // Has a 35% chance to just pass and keep you guessing.
        if (Math.random() < 0.35) return -1;
        
        const cardsOnBoard = state.cups.some(c => c.card);
        const eligibleFiltered = eligibleHand.filter(x =>
          !(x.c.key === 'kitty_pow' && !cardsOnBoard)
        );
        if (eligibleFiltered.length === 0) return -1;

        // Early game: aggressive chaos to build a lead
        // Late game: more targeted disruption
        const prefer = isLateGame
          ? ['skip', 'freeze', 'magic_paw', 'bye_bye', 'paw_combo']
          : ['paw_combo', 'cat_ching', 'skip', 'freeze'];

        for (const key of prefer) {
          const match = eligibleFiltered.find(x => x.c.key === key);
          if (match) return match.i;
        }
        // Otherwise pick a random eligible card
        return eligibleFiltered[Math.floor(Math.random() * eligibleFiltered.length)].i;
      }

      case 'valko': {
        // Alpha Hunter: aggressive board control. Strikes when the player is ahead
        // or when key cups are at stake. Precise — only uses cards when they matter.
        // Never wastes cards early unless player is building a significant lead.
        if (!playerAhead && !isLateGame && scoreDiff < 5 && Math.random() < 0.60) return -1;
        // If player has multiple good cups, destroy the best one
        const prefer = playerAhead
          ? ['bye_bye', 'magic_paw', 'purrator', 'freeze', 'skip']
          : ['purrator', 'magic_paw', 'paw_combo', 'freeze'];
        for (const key of prefer) { const i = findCard(key); if (i >= 0) return i; }
        return eligibleHand[0].i;
      }

      default:
        if (Math.random() < 0.5) return -1;
        return eligibleHand[0].i;
    }
  }

  // ── MEOW THIS! INTERRUPT ─────────────────────────────────

  function showMeowThisInterrupt(card, attackedBy, opponentMeowIdx, callback) {
    const isPlayerDefending = attackedBy === 'ai'; // AI played, player defends
    const modal = document.getElementById('kc-adv-meow-interrupt');
    const cardImg = document.getElementById('kc-adv-meow-card-img');
    const desc = document.getElementById('kc-adv-meow-desc');
    const cancelBtn = document.getElementById('kc-adv-meow-cancel-btn');
    const allowBtn = document.getElementById('kc-adv-meow-allow-btn');

    if (isPlayerDefending) {
      // Player can use Meow This! to cancel AI's card
      cardImg.src = card.img;
      desc.textContent = `${COMPANIONS[state.companion].name} is playing ${card.name}! Use your Meow This! to cancel it?`;
      modal.style.display = 'flex';

      const timerBar = document.getElementById('kc-adv-meow-timer-bar');
      const timerText = document.getElementById('kc-adv-meow-timer-text');

      // Reset bar to full before starting
      timerBar.style.transition = 'none';
      timerBar.style.width = '100%';
      // Force reflow so the reset takes effect before re-enabling transition
      void timerBar.offsetWidth;
      timerBar.style.transition = 'width 0.05s linear';

      // Disable Use button if player doesn't actually have a Meow This! card
      const hasMeowThis = opponentMeowIdx >= 0;
      cancelBtn.disabled = !hasMeowThis;
      cancelBtn.style.opacity = hasMeowThis ? '1' : '0.4';

      let timerInterval;
      let resolved = false;
      const timeLimit = 5000;
      const startTime = Date.now();

      // Define handlers BEFORE the interval references them
      const onCancel = () => {
        if (resolved) return;
        resolved = true;
        clearInterval(timerInterval);
        modal.style.display = 'none';
        // Consume player's Meow This!
        state.playerAssistHand.splice(opponentMeowIdx, 1);
        const meowCard = ASSIST_CARD_TYPES.find(c => c.key === 'meow_this');
        if (meowCard) state.playerAssistHistory.unshift(meowCard);
        renderAll();
        callback(true); // denied
      };

      const onAllow = () => {
        if (resolved) return;
        resolved = true;
        clearInterval(timerInterval);
        modal.style.display = 'none';
        callback(false); // allowed
      };

      // Wire buttons
      cancelBtn.onclick = onCancel;
      allowBtn.onclick = onAllow;

      timerInterval = setInterval(() => {
        if (!modal.isConnected || resolved) {
          clearInterval(timerInterval);
          return;
        }
        const elapsed = Date.now() - startTime;
        const pct = Math.max(0, 100 - (elapsed / timeLimit) * 100);
        timerBar.style.width = pct + '%';
        const secsLeft = Math.ceil((timeLimit - elapsed) / 1000);
        if (timerText) timerText.textContent = secsLeft > 0 ? `${secsLeft}s to decide` : 'Time\'s up!';
        if (elapsed >= timeLimit && !resolved) {
          resolved = true;
          clearInterval(timerInterval);
          onAllow(); // Timer ran out — let the card through
        }
      }, 50);

    } else {
      // AI decides whether to Meow This! the player's card
      const aiWillCancel = aiShouldMeowThis(card);
      if (aiWillCancel) {
        // Consume AI's Meow This!
        state.aiAssistHand.splice(opponentMeowIdx, 1);
        const meowCard = ASSIST_CARD_TYPES.find(c => c.key === 'meow_this');
        state.aiAssistHistory.unshift(meowCard);
        
        showAiAssistRevealModal(meowCard, () => {
          showToast(`${COMPANIONS[state.companion].name} plays Meow This! — your ${card.name} is cancelled!`, 3000);
          renderAll();
          setTimeout(() => callback(true), 500);
        });
      } else {
        callback(false);
      }
    }
  }

  function aiShouldMeowThis(card) {
    const companion = state.companion;
    const traits = AI_TRAITS[companion] || AI_TRAITS.xavier;
    const aiAhead = state.aiScore > state.playerScore;
    const emptyCups = state.cups.filter(c => !c.card).length;
    const isEarlyGame = emptyCups >= 6;

    // Per-companion high-value card definitions (what each bot actually fears)
    const highValueCardsByCompanion = {
      xavier:  ['bye_bye', 'magic_paw', 'purrator', 'paw_combo'],
      zayne:   ['purrator', 'kitty_pow', 'magic_paw', 'bye_bye', 'paw_combo'],
      rafayel: ['bye_bye', 'kitty_pow', 'magic_paw'],
      sylus:   ['bye_bye', 'paw_combo', 'magic_paw', 'purrator'],
      caleb:   ['kitty_pow', 'paw_combo', 'purrator', 'bye_bye', 'magic_paw'],
      valko:   ['bye_bye', 'magic_paw', 'paw_combo', 'purrator', 'kitty_pow'],
    };
    const highValueCards = highValueCardsByCompanion[companion] || highValueCardsByCompanion.xavier;
    const isHighValue = highValueCards.includes(card.key);

    // Never burn Meow This early on low-value cards — patient tacticians wait
    if (isEarlyGame && !isHighValue) return false;

    let guardChance = isHighValue ? traits.meowGuard : (traits.meowGuard * 0.25);

    // Companion-specific personality adjustments
    if (companion === 'xavier') {
      // Xavier is "soft-hearted" — won't block if way ahead (lets player feel safe)
      if (aiAhead && Math.random() < traits.mercy) guardChance *= 0.4;
      // Xavier counter-punches — more likely to block when losing
      if (!aiAhead && isHighValue) guardChance = Math.min(1, guardChance * 1.4);
    }
    if (companion === 'zayne') {
      // Zayne is a precise counter — always blocks late-game high-value plays
      if (!isEarlyGame && isHighValue) guardChance = Math.min(1, guardChance * 1.3);
    }
    if (companion === 'rafayel') {
      // Rafayel is impulsive when losing — blocks more when behind
      if (!aiAhead) guardChance = Math.min(1, guardChance * 1.5);
    }
    if (companion === 'valko') {
      // Valko always blocks high-value threats — he doesn't tolerate disruption
      if (isHighValue) guardChance = 1.0;
    }
    if (companion === 'caleb') {
      // Caleb is chaotic — sometimes randomly blocks even low-value cards
      if (!isHighValue && Math.random() < 0.20) return true;
    }

    return Math.random() < guardChance;
  }


  // ── ASSIST CARD EFFECTS ──────────────────────────────────

  function resolveAssistCard(card, playedBy, callback) {
    const isPlayer = playedBy === 'player';
    const companionName = COMPANIONS[state.companion].name;

    // For AI plays, the modal was already shown by playAssistCard() before calling this.
    // Sequence for AI: modal shown → resolveAssistCard called → effect → toast
    // Sequence for player: resolveAssistCard called → effect → toast

    switch (card.key) {
      case 'skip':
        if (isPlayer) {
          state.aiSkipNumber = true;
          renderAll(); // update skip/freeze badges
          showToast(`⏭️ Skip used! ${companionName} will skip their next Number Phase.`, 3500);
        } else {
          state.playerSkipNumber = true;
          renderAll(); // update skip/freeze badges
          showToast(`⏭️ ${companionName} used Skip! You'll skip your next Number Phase.`, 3500);
        }
        setTimeout(callback, 1000);
        break;

      case 'freeze':
        if (isPlayer) {
          state.aiSkipAssist = true;
          renderAll();
          showToast(`❄️ Freeze used! ${companionName} will skip their next Assist Phase.`, 3500);
        } else {
          state.playerSkipAssist = true;
          renderAll();
          showToast(`❄️ ${companionName} used Freeze! You'll skip your next Assist Phase.`, 3500);
        }
        setTimeout(callback, 1000);
        break;

      case 'meow_this':
        // Played reactively — not through this path
        setTimeout(callback, 400);
        break;

      case 'cat_ching':
        resolveCardEffect_CatChing(isPlayer, callback);
        break;

      case 'kitty_plot':
        resolveCardEffect_KittyPlot(isPlayer, callback);
        break;

      case 'purrceive':
        resolveCardEffect_Purrceive(isPlayer, callback);
        break;

      case 'meowster':
        resolveCardEffect_Meowster(isPlayer, callback);
        break;

      case 'purrator':
        resolveCardEffect_Purrator(isPlayer, callback);
        break;

      case 'kitty_pow':
        resolveCardEffect_KittyPow(isPlayer, callback);
        break;

      case 'magic_paw':
        resolveCardEffect_MagicPaw(isPlayer, callback);
        break;

      case 'bye_bye':
        resolveCardEffect_ByeBye(isPlayer, callback);
        break;

      case 'paw_combo':
        state.pawComboActive = true;
        state.pawComboCount = 0;
        if (isPlayer) {
          showToast('🐾 Paw Combo! Play 2 Number Cards this turn!', 3500);
        } else {
          showToast(`🐾 ${companionName} used Paw Combo — they get an extra Number Card play!`, 3500);
        }
        setTimeout(callback, 800);
        break;

      default:
        setTimeout(callback, 400);
    }
    renderAll();
  }


  // Cat-Ching!: Draw 2 Number Cards
  function resolveCardEffect_CatChing(isPlayer, callback) {
    const handKey = isPlayer ? 'playerHand' : 'aiHand';
    const assistKey = isPlayer ? 'playerAssistHand' : 'aiAssistHand';
    const companionName = COMPANIONS[state.companion].name;
    let drawn = 0;
    for (let i = 0; i < 2; i++) {
      if (state.deck.length === 0) break;
      const total = state[handKey].length + state[assistKey].length;
      if (total >= 10) { state.deck.pop(); } // burned
      else { state[handKey].push(state.deck.pop()); drawn++; }
    }
    if (isPlayer) {
      showToast(`🎯 Cat-Ching! You drew ${drawn} Number Card${drawn !== 1 ? 's' : ''}.`, 3500);
    } else {
      showToast(`🎯 ${companionName} used Cat-Ching! They drew ${drawn} Number Card${drawn !== 1 ? 's' : ''}.`, 3500);
    }
    renderAll();
    setTimeout(callback, 1000);
  }

  // Kitty Plot: Draw 2 Assist Cards, discard 1 card
  function resolveCardEffect_KittyPlot(isPlayer, callback) {
    const handKey = isPlayer ? 'playerAssistHand' : 'aiAssistHand';
    const numKey = isPlayer ? 'playerHand' : 'aiHand';
    const companionName = COMPANIONS[state.companion].name;
    let drawn = 0;
    for (let i = 0; i < 2; i++) {
      if (state.assistDeck.length === 0) break;
      const total = state[handKey].length + state[numKey].length;
      if (total >= 10) { state.assistDeck.pop(); }
      else { state[handKey].push(state.assistDeck.pop()); drawn++; }
    }
    renderAll();
    if (!isPlayer) {
      // AI: discard the lowest-value number card, or first assist card
      if (state.aiHand.length > 0) state.aiHand.sort((a, b) => a.value - b.value).shift();
      else if (state.aiAssistHand.length > 0) state.aiAssistHand.shift();
      showToast(`📋 ${companionName} used Kitty Plot — drew ${drawn} Assist Card${drawn !== 1 ? 's' : ''} and discarded one.`, 3500);
      setTimeout(callback, 1000);
    } else {
      // Player: pick 1 card to discard — but only if they actually have something to discard
      const allCards = buildAllHandCards(true);
      if (allCards.length === 0) {
        showToast(`📋 Kitty Plot! Drew ${drawn} Assist Card${drawn !== 1 ? 's' : ''}.`, 3500);
        callback();
        return;
      }
      showAssistTargetModal(
        'Kitty Plot: Discard a card',
        'Choose 1 card from your hand to discard.',
        allCards,
        allCards.length === 0,
        (selectedIdx, isAssist) => {
          if (selectedIdx < 0) { callback(); return; }
          if (isAssist) state.playerAssistHand.splice(selectedIdx, 1);
          else state.playerHand.splice(selectedIdx, 1);
          renderAll();
          callback();
        }
      );
    }
  }

  // Purrceive: Show 3 random opponent cards, pick 1 to discard
  function resolveCardEffect_Purrceive(isPlayer, callback) {
    const opponentNumHand = isPlayer ? state.aiHand : state.playerHand;
    const opponentAssistHand = isPlayer ? state.aiAssistHand : state.playerAssistHand;
    const companionName = COMPANIONS[state.companion].name;
    const allOpponent = [
      ...opponentNumHand.map((c, i) => ({ card: c, idx: i, isAssist: false })),
      ...opponentAssistHand.map((c, i) => ({ card: c, idx: i, isAssist: true })),
    ];
    if (allOpponent.length === 0) { showToast('Opponent has no cards!', 2500); setTimeout(callback, 800); return; }
    const sample = shuffle(allOpponent).slice(0, 3);

    if (!isPlayer) {
      // AI: discard the most dangerous player card (highest value number card, or an assist)
      const numberCards = sample.filter(x => !x.isAssist);
      const target = numberCards.length > 0
        ? numberCards.reduce((best, x) => x.card.value > best.card.value ? x : best)
        : sample[0];
      const discardDesc = target.isAssist ? `${target.card.name} (Assist)` : `${capitalize(target.card.color)} ${target.card.value}`;
      if (target.isAssist) state.playerAssistHand.splice(target.idx, 1);
      else state.playerHand.splice(target.idx, 1);
      showToast(`👁️ ${companionName} used Purrceive — Discarded your ${discardDesc}!`, 3500);
      renderAll();
      setTimeout(callback, 1200);
    } else {
      showAssistTargetModal(
        'Purrceive',
        "You see 3 of your opponent's cards. Pick 1 to discard.",
        sample.map(x => ({ card: x.card, idx: x.idx, isAssist: x.isAssist })),
        false,
        (idx) => {
          const target = sample[idx];
          const discardDesc = target.isAssist ? `${target.card.name} (Assist)` : `${capitalize(target.card.color)} ${target.card.value}`;
          if (target.isAssist) state.aiAssistHand.splice(target.idx, 1);
          else state.aiHand.splice(target.idx, 1);
          showToast(`👁️ Purrceive! Discarded ${companionName}'s ${discardDesc}.`, 3500);
          renderAll();
          callback();
        }
      );
    }
  }

  // Meowster: Pick from last 5 opponent assist cards played (any amount in history)
  function resolveCardEffect_Meowster(isPlayer, callback) {
    const history = isPlayer ? state.aiAssistHistory : state.playerAssistHistory;
    const companionName = COMPANIONS[state.companion].name;
    if (history.length === 0) { showToast("No opponent Assist Cards have been played yet!", 2500); setTimeout(callback, 600); return; }
    // Randomize from whatever is in history (up to 5)
    const options = shuffle(history.slice(0, 5));

    if (!isPlayer) {
      // AI: pick highest priority card from options (based on companion preference)
      const aiPriorityKeys = ['bye_bye', 'magic_paw', 'purrator', 'paw_combo', 'skip', 'freeze', 'kitty_pow'];
      const picked = aiPriorityKeys.reduce((best, key) => {
        if (best) return best;
        return options.find(c => c.key === key) || null;
      }, null) || options[0];
      const total = state.aiAssistHand.length + state.aiHand.length;
      if (total < 10) state.aiAssistHand.push({ ...picked });
      showToast(`🌟 ${companionName} used Meowster!`, 3500);
      renderAll();
      setTimeout(callback, 1200);
    } else {
      showAssistTargetModal(
        'Meowster',
        "Pick one of your opponent's played Assist Cards to add to your hand.",
        options.map((c, i) => ({ card: c, idx: i, isAssist: true })),
        false,
        (idx) => {
          const picked = options[idx];
          const total = state.playerAssistHand.length + state.playerHand.length;
          if (total < 10) state.playerAssistHand.push({ ...picked });
          else showToast('Hand full! Card burned.', 2000);
          showToast(`🌟 Used Meowster!`, 3500);
          renderAll();
          callback();
        }
      );
    }
  }

  function animateCupColorRandomize(cupIdx, prevColor, callback) {
    const colors = ['brown', 'green', 'purple', 'red', 'white'];
    let changes = 0;

    // First change immediately
    state.cups[cupIdx].color = colors[Math.floor(Math.random() * colors.length)];
    renderAll();
    changes++;

    const interval = setInterval(() => {
      state.cups[cupIdx].color = colors[Math.floor(Math.random() * colors.length)];
      renderAll();
      changes++;
      
      if (changes >= 8) {
        clearInterval(interval);
        recalcScores();
        const newColor = state.cups[cupIdx].color;
        showToast(`🎨 ${capitalize(prevColor)} cup changed to ${capitalize(newColor)}!`, 3500);
        setTimeout(callback, 600);
      }
    }, 500);
  }

  // Purrator: Change a cup color
  function resolveCardEffect_Purrator(isPlayer, callback) {
    const companionName = COMPANIONS[state.companion].name;
    if (!isPlayer) {
      // AI: target highest-scoring player cup, or an empty cup
      const playerCups = state.cups.map((c, i) => ({ c, i })).filter(x => x.c.owner === 'player' && x.c.card);
      const emptyCups = state.cups.map((c, i) => ({ c, i })).filter(x => !x.c.card);
      let targetIdx = -1;

      if (playerCups.length > 0) {
        playerCups.sort((a, b) => calcPoints(b.c.card, b.c) - calcPoints(a.c.card, a.c));
        targetIdx = playerCups[0].i;
      } else if (emptyCups.length > 0) {
        targetIdx = emptyCups[Math.floor(Math.random() * emptyCups.length)].i;
      }

      if (targetIdx >= 0) {
        const prevColor = state.cups[targetIdx].color;
        setStatus(`${companionName} uses Purrator! Randomizing cup color...`);
        animateCupColorRandomize(targetIdx, prevColor, callback);
      } else {
        callback();
      }
    } else {
      // Player picks a cup
      const availableCups = state.cups.map((c, i) => ({ c, i }));
      showCupTargetModal('Purrator', 'Select a cup to randomize its color.', availableCups, (cupIdx) => {
        const prevColor = state.cups[cupIdx].color;
        setStatus('Purrator is randomizing the cup color...');
        animateCupColorRandomize(cupIdx, prevColor, callback);
      });
    }
  }

  // Kitty Pow!: Both players discard all number cards
  function resolveCardEffect_KittyPow(isPlayer, callback) {
    const companionName = COMPANIONS[state.companion].name;
    state.playerHand = [];
    state.aiHand = [];
    renderAll();
    showToast(`💥 Kitty Pow! Both players discard all Number Cards.`, 3500);
    setTimeout(callback, 1200);
  }

  // Magic Paw: Reduce opponent-owned cup card value to 1
  function resolveCardEffect_MagicPaw(isPlayer, callback) {
    const companionName = COMPANIONS[state.companion].name;
    if (!isPlayer) {
      const playerCups = state.cups.map((c, i) => ({ c, i })).filter(x => x.c.owner === 'player' && x.c.card);
      if (playerCups.length === 0) { setTimeout(callback, 400); return; }
      playerCups.sort((a, b) => calcPoints(b.c.card, b.c) - calcPoints(a.c.card, a.c));
      playerCups[0].c.card.value = 1;
      recalcScores();
      renderAll();
      showToast(`🐾 ${companionName} used Magic Paw — Reduced to 1!`, 3500);
      setTimeout(callback, 1200);
    } else {
      const aiCups = state.cups.map((c, i) => ({ c, i })).filter(x => x.c.owner === 'ai' && x.c.card);
      if (aiCups.length === 0) { showToast('No opponent kitties to target!', 2500); setTimeout(callback, 600); return; }
      showCupTargetModal('Magic Paw', "Select an opponent's placed kitty to reduce to 1 point.", aiCups, (cupIdx) => {
        state.cups[cupIdx].card.value = 1;
        recalcScores();
        renderAll();
        showToast(`🐾 Magic Paw! Reduced to 1!`, 3500);
        callback();
      });
    }
  }

  // Bye-Bye!: Remove a card from any occupied cup
  function resolveCardEffect_ByeBye(isPlayer, callback) {
    const companionName = COMPANIONS[state.companion].name;
    if (!isPlayer) {
      const playerCups = state.cups.map((c, i) => ({ c, i })).filter(x => x.c.owner === 'player' && x.c.card);
      if (playerCups.length === 0) { setTimeout(callback, 400); return; }
      playerCups.sort((a, b) => calcPoints(b.c.card, b.c) - calcPoints(a.c.card, a.c));
      const target = playerCups[0];
      const removedCard = target.c.card;
      const pts = calcPoints(removedCard, target.c);
      const cupColor = target.c.color;
      state.playerScore = Math.max(0, state.playerScore - pts);
      target.c.card = null;
      target.c.owner = null;
      renderAll();
      showToast(`👋 ${companionName} used Bye-Bye! Removed ${capitalize(removedCard.color)} ${removedCard.value} from the ${capitalize(cupColor)} cup.`, 4000);
      setTimeout(callback, 1400);
    } else {
      const occupiedCups = state.cups.map((c, i) => ({ c, i })).filter(x => x.c.card);
      if (occupiedCups.length === 0) { showToast('No cards on cups!', 2500); setTimeout(callback, 600); return; }
      showCupTargetModal('Bye-Bye!', 'Select any cup to remove the card placed there.', occupiedCups, (cupIdx) => {
        const cup = state.cups[cupIdx];
        const removedCard = cup.card;
        const pts = calcPoints(removedCard, cup);
        const cupColor = cup.color;
        if (cup.owner === 'player') state.playerScore = Math.max(0, state.playerScore - pts);
        else state.aiScore = Math.max(0, state.aiScore - pts);
        cup.card = null;
        cup.owner = null;
        renderAll();
        showToast(`👋 Bye-Bye! Removed ${capitalize(removedCard.color)} ${removedCard.value} from the ${capitalize(cupColor)} cup.`, 4000);
        callback();
      });
    }
  } // end resolveCardEffect_ByeBye

  // ── UI HELPER MODALS ────────────────────────────────────



  function buildAllHandCards(isPlayer) {
    const num = isPlayer ? state.playerHand : state.aiHand;
    const assist = isPlayer ? state.playerAssistHand : state.aiAssistHand;
    return [
      ...num.map((c, i) => ({ card: c, idx: i, isAssist: false })),
      ...assist.map((c, i) => ({ card: c, idx: i, isAssist: true })),
    ];
  }

  function showAssistTargetModal(title, desc, cards, allowPass, onConfirm) {
    const modal = document.getElementById('kc-adv-assist-target');
    const titleEl = document.getElementById('kc-adv-target-title');
    const descEl = document.getElementById('kc-adv-target-desc');
    const cardsEl = document.getElementById('kc-adv-target-cards');
    const confirmBtn = document.getElementById('kc-adv-target-confirm');
    const passBtn = document.getElementById('kc-adv-target-pass');
    const colorsEl = document.getElementById('kc-adv-target-colors');

    titleEl.textContent = title;
    descEl.textContent = desc;
    cardsEl.innerHTML = '';
    colorsEl.style.display = 'none';
    passBtn.style.display = allowPass ? 'block' : 'none';
    confirmBtn.disabled = true;
    modal.style.display = 'flex';

    let selectedIdx = -1;
    let selectedIsAssist = false;

    cards.forEach((item, i) => {
      let el;
      if (item.isAssist) {
        el = createCardElement(item.card, false, i, true);
      } else {
        el = createCardElement(item.card, false, i);
      }
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        cardsEl.querySelectorAll('.selected').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        selectedIdx = i;
        selectedIsAssist = item.isAssist;
        confirmBtn.disabled = false;
      });
      cardsEl.appendChild(el);
    });

    confirmBtn.onclick = () => {
      if (selectedIdx < 0) return;
      modal.style.display = 'none';
      onConfirm(selectedIdx, selectedIsAssist, cards[selectedIdx]?.idx);
    };
    if (allowPass) {
      passBtn.onclick = () => { modal.style.display = 'none'; onConfirm(-1, false, -1); };
    }
  }

  function showCupTargetModal(title, desc, cups, onConfirm) {
    // Temporarily enter "cup selection" mode using the board
    state._assistCupTarget = { cups, onConfirm };
    state.placingCard = true; // re-use placement highlight system
    setStatus(`${desc} Tap a highlighted cup.`);
    renderCupGrid();
    // Highlight only the provided cups
    cups.forEach(({ i }) => {
      const cell = cupGridEl.querySelector(`[data-cup="${i}"]`);
      if (cell) cell.classList.add('cup-available');
    });
  }


  // ── ADVANCED MODE EVENT WIRING ───────────────────────────

  // Wire cup grid clicks for advanced mode
  cupGridEl.addEventListener('click', (e) => {
    // Advanced mode: dual-deck draws
    if (state.gameMode === 'advanced') {
      const mini = e.target.closest('.kc-deck-mini');
      if (mini) {
        const type = mini.dataset.deckType;
        if (type === 'assist' && state.advancedPhase === 'assist' && state.currentTurn === 'player') {
          onAdvancedDrawAssist();
        } else if (type === 'number' && state.advancedPhase === 'number' && state.currentTurn === 'player') {
          onAdvancedDrawNumber();
        }
        return;
      }
      // Cup selection for assist card targeting
      if (state._assistCupTarget) {
        const cell = e.target.closest('.kc-cup-cell');
        if (!cell) return;
        const cupIdx = parseInt(cell.dataset.cup);
        if (isNaN(cupIdx)) return;
        const isValidTarget = state._assistCupTarget.cups.some(x => x.i === cupIdx);
        if (!isValidTarget) return;
        const cb = state._assistCupTarget.onConfirm;
        state._assistCupTarget = null;
        state.placingCard = false;
        renderCupGrid();
        cb(cupIdx);
        return;
      }
      // Advanced mode number phase cup placement
      if (state.advancedPhase === 'number' && state.placingCard && state.currentTurn === 'player') {
        const cell = e.target.closest('.kc-cup-cell');
        if (!cell) return;
        const cupIdx = parseInt(cell.dataset.cup);
        if (isNaN(cupIdx)) return;
        onAdvancedCupClick(cupIdx);
        return;
      }
    }
  }, true); // capture phase so it fires before the existing listener

  // Pass button for advanced assist phase
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.gameMode === 'advanced' && state.advancedPhase === 'assist' && state.currentTurn === 'player') {
      const inspectModal = document.getElementById('kc-player-assist-inspect');
      if (inspectModal && inspectModal.style.display !== 'none') {
        const cancelBtn = document.getElementById('kc-player-assist-cancel-btn');
        if (cancelBtn) cancelBtn.click();
        return;
      }
      const assistTargetModal = document.getElementById('kc-adv-assist-target');
      if (assistTargetModal && assistTargetModal.style.display !== 'none') {
        const passBtn = document.getElementById('kc-adv-target-pass');
        if (passBtn && passBtn.style.display !== 'none') passBtn.click();
        return;
      }
      advancedPlayerPassAssist();
    }
  });

  // Override endPlayerTurn for advanced mode
  const _origEndPlayerTurn = endPlayerTurn;
  // patch: in advanced mode, trigger correct AI next turn
  const _origEndAiTurn = endAiTurn;

}); // DOMContentLoaded

