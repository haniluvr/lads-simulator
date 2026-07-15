// collection.js

function injectCollectionModal() {
  const modalHtml = `
    <div id="collection-modal" class="col-modal-overlay" aria-modal="true" role="dialog">
      
      <!-- Frame from limited banner modal -->
      <div class="sf-frame" aria-hidden="true">
        <div class="sf-seg sf-seg-top"></div>
        <div class="sf-seg sf-seg-right"></div>
        <div class="sf-seg sf-seg-bottom"></div>
        <div class="sf-seg sf-seg-left"></div>

        <div class="sf-corner-tl">
          <div class="sf-l-bracket"></div>
          <div class="sf-c-dot"></div>
          <div class="sf-c-arc"></div>
        </div>

        <div class="sf-corner-br">
          <div class="sf-l-bracket"></div>
          <div class="sf-c-dot"></div>
          <div class="sf-c-arc"></div>
        </div>

        <div class="sf-arc-tr-s"></div>
        <div class="sf-arc-tr-d"></div>

        <div class="sf-arc-bl-s"></div>
        <div class="sf-arc-bl-d"></div>
      </div>

      <!-- Main container: arch header + content body -->
      <div class="col-modal-wrap">

        <!-- ── ARCH HEADER ─────────────────────────────── -->
        <div class="col-arch-outer">
          <!-- Planet ornament at the very top -->
          <div class="col-arch-planet" aria-hidden="true">
            <svg viewBox="0 0 70 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 6 24 A 29 9 0 0 1 64 24" stroke="#c9a96e" stroke-width="1" opacity="0.4" fill="none"/>
              <circle cx="35" cy="24" r="13" fill="#1a1308" stroke="#c9a96e" stroke-width="1.2"/>
              <circle cx="35" cy="24" r="8"  fill="none" stroke="rgba(201,169,110,0.22)" stroke-width="0.8"/>
              <path d="M 6 24 A 29 9 0 0 0 64 24" stroke="#c9a96e" stroke-width="1" opacity="0.88" fill="none"/>
              <circle cx="6"  cy="24" r="1.5" fill="#c9a96e" opacity="0.6"/>
              <circle cx="64" cy="24" r="1.5" fill="#c9a96e" opacity="0.6"/>
            </svg>
          </div>

          <div class="col-arch-inner">
            <!-- Divider + Title -->
            <div class="col-arch-divider" aria-hidden="true">
              <span class="col-div-line"></span>
              <span class="col-div-gem">✦</span>
              <span class="col-div-line"></span>
            </div>
            <h2 class="col-modal-title">Memories</h2>

            <!-- Character Tabs: 1 row on desktop, 2 on mobile via CSS grid -->
            <div class="col-char-tabs">
              <button class="col-char-tab" data-char="xavier">Xavier</button>
              <button class="col-char-tab" data-char="zayne">Zayne</button>
              <button class="col-char-tab" data-char="rafayel">Rafayel</button>
              <button class="col-char-tab" data-char="sylus">Sylus</button>
              <button class="col-char-tab" data-char="caleb">Caleb</button>
              <button class="col-char-tab" data-char="valko">Valko</button>
            </div>
          </div>
        </div>

        <!-- ── CONTENT BODY (below arch) ──────────────── -->
        <div class="col-body">
          <!-- Controls: All tab + Sort dropdown -->
          <div class="col-controls-row">
            <button class="col-all-tab active" id="col-all-tab">All</button>
            <div class="col-sort-wrap">
              <button class="col-sort-pill" id="col-sort-btn">
                <span id="col-sort-label">Rarity</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 7L1 3h8z"/></svg>
              </button>
              <div class="col-sort-dropdown" id="col-sort-dropdown" style="display:none;">
                <button class="col-sort-option" data-sort="rarity">Rarity</button>
                <button class="col-sort-option" data-sort="new">New</button>
              </div>
            </div>
          </div>

          <!-- Gold divider line -->
          <div class="col-divider-line"></div>

          <!-- Card Grid -->
          <div class="col-grid" id="collection-grid"></div>
        </div>

      </div><!-- /.col-modal-wrap -->
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function injectCardDetailsModal() {
  const modalHtml = `
    <div class="card-details-modal" id="card-details-modal" style="display: none;">
      <div class="cd-overlay" id="cd-overlay"></div>
      <div class="cd-wrapper">
        <div class="cd-art-wrap" id="cd-art-wrap"></div>
        <div class="cd-text-group">
          <div class="cd-header-char" id="cd-header-char"></div>
          <div class="cd-footer-name" id="cd-footer-name"></div>
        </div>
        <button class="rank-up-btn" id="rank-up-btn">Rank Up</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ── COLLECTION MODAL LOGIC ────────────────────────────────────
let activeDetailsCard = null; // Track which card is open in details

function initCollection() {
  injectCollectionModal();
  injectCardDetailsModal();

  const openBtn  = document.getElementById('collection-open-btn');
  const modal    = document.getElementById('collection-modal');
  const charTabs = document.querySelectorAll('.col-char-tab');
  const allTab   = document.getElementById('col-all-tab');
  const sortBtn  = document.getElementById('col-sort-btn');
  const sortDD   = document.getElementById('col-sort-dropdown');
  const sortLabel= document.getElementById('col-sort-label');

  let currentChar = 'all';
  let currentSort = 'rarity';

  function setCharFilter(char) {
    currentChar = char;
    charTabs.forEach(t => t.classList.remove('active'));
    allTab.classList.remove('active');
    if (char === 'all') {
      allTab.classList.add('active');
    } else {
      document.querySelector(`.col-char-tab[data-char="${char}"]`)?.classList.add('active');
    }
    renderCollection();
  }

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    renderCollection();
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  charTabs.forEach(tab => {
    tab.addEventListener('click', () => setCharFilter(tab.dataset.char));
  });
  allTab.addEventListener('click', () => setCharFilter('all'));

  sortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sortDD.style.display = sortDD.style.display === 'none' ? 'block' : 'none';
  });
  document.querySelectorAll('.col-sort-option').forEach(opt => {
    opt.addEventListener('click', () => {
      currentSort = opt.dataset.sort;
      sortLabel.textContent = currentSort === 'rarity' ? 'Rarity' : 'New';
      sortDD.style.display = 'none';
      renderCollection();
    });
  });
  document.addEventListener('click', () => { sortDD.style.display = 'none'; });

  // Card Details logic
  const detailsModal = document.getElementById('card-details-modal');
  const detailsOverlay = document.getElementById('cd-overlay');
  const rankUpBtn = document.getElementById('rank-up-btn');

  const closeDetails = () => { 
    detailsModal.style.display = 'none'; 
    activeDetailsCard = null; 
  };
  detailsOverlay.addEventListener('click', closeDetails);

  rankUpBtn.addEventListener('click', () => {
    if (!activeDetailsCard) return;
    const cardName = activeDetailsCard.cardName;
    const count = gs.collection[cardName] || 0;
    const currentRank = gs.ranks[cardName] || 0;
    if (count > currentRank + 1 && currentRank < 3) {
      gs.ranks[cardName] = currentRank + 1;
      saveState();
      renderCollection();
      openCardDetails(activeDetailsCard); // Refresh modal
    }
  });

  function renderCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    let cards = CARD_CATALOG.filter(c => (gs.collection[c.cardName] || 0) > 0);
    if (currentChar !== 'all') {
      cards = cards.filter(c => c.character === currentChar);
    }

    if (currentSort === 'rarity') {
      cards.sort((a, b) => b.rarity - a.rarity);
    } else {
      cards.sort((a, b) => {
        const aNew = gs.collection[a.cardName] === 1 ? 0 : 1;
        const bNew = gs.collection[b.cardName] === 1 ? 0 : 1;
        if (aNew !== bNew) return aNew - bNew;
        return b.rarity - a.rarity;
      });
    }

    if (cards.length === 0) {
      grid.innerHTML = '<div class="col-empty">No memories collected yet.</div>';
      return;
    }

    cards.forEach(card => {
      const count = gs.collection[card.cardName] || 0;
      const rank  = gs.ranks[card.cardName] || 0;
      const isNew = count === 1 && currentSort === 'new';
      const canRankUp = count > rank + 1 && rank < 3;
      const charCapitalized = card.character.charAt(0).toUpperCase() + card.character.slice(1);
      // 4-pointed sparkle star (image 2 style)
      const starSvg = `<svg class="col-star-icon" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z"/></svg>`;
      const starsHtml = starSvg.repeat(card.rarity);

      const typeIcon = card.type === 'solar'
        ? `<svg class="col-type-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.536-7.536l-1.414 1.414M7.879 16.121l-1.414 1.414M16.121 16.121l1.414 1.414M7.879 7.879L6.464 6.464"/></svg>`
        : `<svg class="col-type-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

      const artHtml = card.isVideo
        ? `<video src="${card.assetPath}" class="col-card-media" loop muted playsinline preload="metadata"></video>`
        : `<img src="${card.assetPath}" class="col-card-media" alt="${card.cardName}" loading="lazy">`;

      const item = document.createElement('div');
      const isMaxRank = rank >= 3;
      item.className = `col-card ${isMaxRank ? 'max-rank' : ''}`;
      item.innerHTML = `
        ${(isNew || canRankUp) ? '<div class="col-notif-dot"></div>' : ''}
        <div class="col-card-art">
          ${artHtml}
          <div class="col-card-grad"></div>
          <div class="col-card-type">${typeIcon}</div>
          <div class="col-card-stars">${starsHtml}</div>
          <!-- 3-Floating-Diamond rank indicator (Image 2 style) -->
          <svg class="col-rank-cube rank-${rank}" viewBox="0 0 100 100">
            <!-- Top diamond (45 deg) -->
            <rect class="cube-top"   x="37" y="17" width="26" height="26" rx="1" transform="rotate(45, 50, 30)" />
            <!-- Left diamond (49.3 deg) -->
            <rect class="cube-left"  x="1" y="45" width="26" height="26" rx="1" transform="rotate(45, 25, 70)" />
            <!-- Right diamond (45 deg) -->
            <rect class="cube-right" x="51" y="45" width="26" height="26" rx="1" transform="rotate(45, 75, 70)" />
          </svg>
        </div>
        <div class="col-card-label">${charCapitalized}: ${card.cardName}</div>
      `;
      
      item.addEventListener('click', () => openCardDetails(card));
      grid.appendChild(item);
    });
  }

  function openCardDetails(card) {
    activeDetailsCard = card;
    const detailsModal = document.getElementById('card-details-modal');
    const artWrap = document.getElementById('cd-art-wrap');
    const rankUpBtn = document.getElementById('rank-up-btn');
    
    const count = gs.collection[card.cardName] || 0;
    const rank = gs.ranks[card.cardName] || 0;
    const canRankUp = count > rank + 1 && rank < 3;
    const charCapitalized = card.character.charAt(0).toUpperCase() + card.character.slice(1);

    const starSvg = `<svg class="col-star-icon" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z"/></svg>`;
    const starsHtml = starSvg.repeat(card.rarity);
    const typeIcon = card.type === 'solar'
      ? `<svg class="col-type-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.536-7.536l-1.414 1.414M7.879 16.121l-1.414 1.414M16.121 16.121l1.414 1.414M7.879 7.879L6.464 6.464"/></svg>`
      : `<svg class="col-type-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

    const artHtml = card.isVideo
      ? `<video src="${card.assetPath}" class="cd-card-media" loop muted autoplay playsinline></video>`
      : `<img src="${card.assetPath}" class="cd-card-media" alt="${card.cardName}">`;

    document.getElementById('cd-header-char').textContent = charCapitalized;
    document.getElementById('cd-footer-name').textContent = card.cardName;

    artWrap.innerHTML = `
      ${artHtml}
      <div class="col-card-grad"></div>
      <div class="col-card-type">${typeIcon}</div>
      <div class="col-card-stars">${starsHtml}</div>
      <svg class="col-rank-cube rank-${rank}" viewBox="0 0 100 100">
        <rect class="cube-top"   x="37" y="17" width="26" height="26" rx="1" transform="rotate(45, 50, 30)" />
        <rect class="cube-left"  x="12" y="57" width="26" height="26" rx="1" transform="rotate(49.3, 25, 70)" />
        <rect class="cube-right" x="62" y="57" width="26" height="26" rx="1" transform="rotate(45, 75, 70)" />
      </svg>
    `;

    rankUpBtn.disabled = !canRankUp;

    detailsModal.style.display = 'flex';
  }
}
