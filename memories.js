// collection.js

const CARD_CREDITS = {
  "Holydays": {
    artist: "Mephisto",
    x: "https://x.com/Harlock_Mephistokitten",
    ig: "https://instagram.com/Harlock_Mephistokitten",
    tiktok: "https://tiktok.com/@Harlock_Mephistokitten"
  },
  "Under The Moon": {
    artist: "Mephisto",
    x: "https://x.com/Harlock_Mephistokitten",
    ig: "https://instagram.com/Harlock_Mephistokitten",
    tiktok: "https://tiktok.com/@Harlock_Mephistokitten"
  },
  "Kitty's Affection": {
    artist: "KC_7385",
    x: "https://x.com/KC_7385"
  },
  "Unexpected Invitation": {
    artist: "KC_7385",
    x: "https://x.com/KC_7385"
  },
  "Temptation": {
    artist: "uulyaax",
    x: "https://x.com/uulyaax",
    ig: "https://instagram.com/uulyaax"
  },
  "Behind The Desk": {
    artist: "SpiritFucker93",
    x: "https://x.com/SpiritFucker93",
    tumblr: "https://SpiritFucker93.tumblr.com/"
  },
  "Behind Closed Doors": {
    artist: "SpiritFucker93",
    x: "https://x.com/SpiritFucker93",
    tumblr: "https://SpiritFucker93.tumblr.com/"
  },
  "Framing Perfection": {
    artist: "salad",
    x: "https://x.com/SALADYUMI",
    ig: "https://instagram.com/saladcorny",
    patreon: "https://www.patreon.com/cw/SaladCorny"
  },
  "A Piece Of Cake": {
    artist: "salad",
    x: "https://x.com/SALADYUMI",
    ig: "https://instagram.com/saladcorny",
    patreon: "https://www.patreon.com/cw/SaladCorny"
  },
  "Chocolate Milk & Charm": {
    artist: "salad",
    x: "https://x.com/SALADYUMI",
    ig: "https://instagram.com/saladcorny",
    patreon: "https://www.patreon.com/cw/SaladCorny"
  },
  "Tasting Victory": {
    artist: "jin",
    x: "https://x.com/starsxav"
  },
  "Point Blank Flirt": {
    artist: "jin",
    x: "https://x.com/starsxav"
  },
  "Morning Confessions": {
    artist: "b",
    ig: "https://www.instagram.com/beejaws",
    x: "https://x.com/beejawing"
  },
  "Pillow Talk": {
    artist: "b",
    ig: "https://www.instagram.com/beejaws",
    x: "https://x.com/beejawing"
  },
  "Restless Instincts": {
    artist: "b",
    ig: "https://www.instagram.com/beejaws",
    x: "https://x.com/beejawing"
  },
  "Insomnia's Embrace": {
    artist: "Meimei",
    x: "https://x.com/okojyomeimei"
  },
  "Chocolate Day": {
    artist: "Kihaiu",
    x: "https://x.com/Thekawacookiie"
  },
  "Butterfly Effect": {
    artist: "Aagknorr",
    x: "https://x.com/Aagknorr"
  },
  "Playful Plush": {
    artist: "Syer",
    x: "https://x.com/imuyumiii",
    ig: "https://instagram.com/imuyumiii",
    tumblr: "https://imuyumiii.tumblr.com/"
  },
  "Alpha's Restraint": {
    artist: "Nika",
    x: "https://x.com/WanderingNika"
  },
  "Tales From Winter": {
    artist: "ASH",
    x: "https://x.com/OrangeTart_",
    ig: "https://instagram.com/firadhl"
  },
  "Lone Wolf by the Moon": {
    artist: "godzileen",
    x: "https://x.com/godzileen",
    ig: "https://instagram.com/godzileen"
  },
  "The Scapegoat": {
    artist: "Cereza_cristal",
    x: "https://x.com/Cereza_cristal",
    tiktok: "https://www.tiktok.com/@cereza_cristal_"
  },
  "Sleeping Wolf": {
    artist: "raonnni",
    x: "https://x.com/raonnni",
    ig: "https://instagram.com/raonnniart"
  },
  "Tail Tells All": {
    artist: "raonnni",
    x: "https://x.com/raonnni",
    ig: "https://instagram.com/raonnniart"
  },
  "Sunkissed Wolf": {
    artist: "raonnni",
    x: "https://x.com/raonnni",
    ig: "https://instagram.com/raonnniart"
  },
  "Beware of the Night": {
    artist: "zeitvon",
    x: "https://x.com/zeitvon",
    ig: "https://instagram.com/zeitvon",
    bsky: "https://bsky.app/profile/zeitvon.bsky.social"
  },
  "My Lost Dog": {
    artist: "zeitvon",
    x: "https://x.com/zeitvon",
    ig: "https://instagram.com/zeitvon",
    bsky: "https://bsky.app/profile/zeitvon.bsky.social"
  },
  "Choco Comfort": {
    artist: "Lottie",
    x: "https://x.com/Starry_Lottie",
    ig: "https://instagram.com/starry.lottie"
  },
  "Iron Bite": {
    artist: "Lottie",
    x: "https://x.com/Starry_Lottie",
    ig: "https://instagram.com/starry.lottie"
  },
  "Steadfast Belief": {
    artist: "Lottie",
    x: "https://x.com/Starry_Lottie",
    ig: "https://instagram.com/starry.lottie"
  },
  "Friend Or Foe": {
    artist: "Lottie",
    x: "https://x.com/Starry_Lottie",
    ig: "https://instagram.com/starry.lottie"
  },
  "Tethered Alpha": {
    artist: "very_octoink",
    x: "https://x.com/very_octoink",
    telegram: "https://t.me/KladovkaAL"
  },
  "Notice Me": {
    artist: "n0niiiiii",
    x: "https://x.com/n0niiiiii"
  },
  "Beloved Wolflord": {
    artist: "Acolyptic",
    x: "https://x.com/acolyptic"
  },
  "Proof of My Sincerity": {
    artist: "Chel",
    x: "https://x.com/PencintaApelll"
  },
  "Scaredy Wolf": {
    artist: "Chel",
    x: "https://x.com/PencintaApelll"
  },
  "Square Up": {
    artist: "c0axyz",
    x: "https://x.com/c0axyz",
    ig: "https://instagram.com/c0axyz",
    tiktok: "https://www.tiktok.com/@c0axyz"
  },
  "Pouty": {
    artist: "c0axyz",
    x: "https://x.com/c0axyz",
    ig: "https://instagram.com/c0axyz",
    tiktok: "https://www.tiktok.com/@c0axyz"
  },
  "Daylight Questioning": {
    artist: "c0axyz",
    x: "https://x.com/c0axyz",
    ig: "https://instagram.com/c0axyz",
    tiktok: "https://www.tiktok.com/@c0axyz"
  },
  "Night Visitor": {
    artist: "c0axyz",
    x: "https://x.com/c0axyz",
    ig: "https://instagram.com/c0axyz",
    tiktok: "https://www.tiktok.com/@c0axyz"
  },
  "Night-time Territorial": {
    artist: "solisweirdddd",
    x: "https://x.com/solisweirdddd",
    tiktok: "https://www.tiktok.com/@solis_055"
  },
  "Lily Of The Valley Lover's": {
    artist: "pinkieplum",
    ig: "https://instagram.com/pinkieplum"
  },
  "Sweet Morning": {
    artist: "Yuhina.san",
    x: "https://x.com/YuhinaSan",
    ig: "https://instagram.com/Yuhina.san"
  },
  "Mating Dance": {
    artist: "Yuhina.san",
    x: "https://x.com/YuhinaSan",
    ig: "https://instagram.com/Yuhina.san"
  },
  "Revolution!": {
    artist: "Auniméa",
    x: "https://x.com/Aunimea",
    ig: "https://www.instagram.com/aunimea_/"
  },
  "Hot Deal": {
    artist: "Auniméa",
    x: "https://x.com/Aunimea",
    ig: "https://www.instagram.com/aunimea_/"
  },
  "Just A Bite": {
    artist: "CELYNSICAL",
    x: "https://x.com/CELYNSICAL",
    ig: "https://instagram.com/CELYNSICAL",
    tiktok: "https://www.tiktok.com/@CELYNSICAL"
  },
  "Sunlit Sovereign": {
    artist: "bones",
    x: "https://x.com/bonesandchocos"
  },
  "After Hours": {
    artist: "Morgenty",
    x: "https://x.com/fine_fiction"
  },
  "After Dark": {
    artist: "Morgenty",
    x: "https://x.com/fine_fiction"
  }
};

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
          <div class="cd-footer-credit" id="cd-footer-credit"></div>
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
  modal.addEventListener('click', (e) => { 
    if (!e.target.closest('.col-arch-outer') && !e.target.closest('.col-body')) {
      modal.classList.remove('active'); 
    }
  });

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
      playSFX('collectionModal');
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
        ? `<video data-src="${card.assetPath}#t=0.001" class="col-card-media lazy-media" loop muted playsinline preload="metadata" onloadedmetadata="this.currentTime=0.1;"></video>`
        : `<img data-src="${card.assetPath}" class="col-card-media lazy-media" alt="${card.cardName}" loading="lazy">`;

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
      
      const mediaEl = item.querySelector('.lazy-media');
      if (mediaEl && window.mediaObserver) {
        window.mediaObserver.observe(mediaEl);
      }
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
      ? `<video src="${card.assetPath}" class="cd-card-media" loop muted autoplay playsinline onloadedmetadata="this.currentTime=0.1;"></video>`
      : `<img src="${card.assetPath}" class="cd-card-media" alt="${card.cardName}">`;

    document.getElementById('cd-header-char').textContent = charCapitalized;
    document.getElementById('cd-footer-name').textContent = card.cardName;

    const cdCredit = document.getElementById('cd-footer-credit');
    const cred = CARD_CREDITS[card.cardName];
    if (cred) {
      const igIcon = cred.ig ? `
        <a href="${cred.ig}" target="_blank" title="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>` : '';
      const xIcon = cred.x ? `
        <a href="${cred.x}" target="_blank" title="X">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>` : '';
      const tumblrIcon = cred.tumblr ? `
        <a href="${cred.tumblr}" target="_blank" title="Tumblr">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14.56 22H11c-3.1 0-5-2.22-5-5.5V11H4V7.8c3.27-.47 4.54-3.16 4.7-5.8h3.33v4.61h3.76v3.38h-3.76v5.27c0 1.25.75 1.84 1.8 1.84h1.73V22z"/></svg>
        </a>` : '';
      const tiktokIcon = cred.tiktok ? `
        <a href="${cred.tiktok}" target="_blank" title="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.5-.18-1.45.14-2.95.95-4.17 1.25-1.92 3.52-3.13 5.86-3.17.2-.01.41 0 .61.02v4.06c-1.35.09-2.61.9-3.23 2.06-.52.95-.6 2.1-.2 3.12.39.99 1.29 1.8 2.33 2.01 1.05.21 2.19-.07 2.98-.75.76-.66 1.19-1.63 1.22-2.65.05-3.86.02-7.72.03-11.58.01-2.14.02-4.27.02-6.41z"/></svg>
        </a>` : '';
      const bskyIcon = cred.bsky ? `
        <a href="${cred.bsky}" target="_blank" title="Bluesky">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.096 1 2.227 1 4.542c0 2.224 1.408 5.766 2.083 6.914 1.054 1.794 3.018 2.378 4.607 1.954-2.224.286-4.99 1.134-4.99 3.522 0 1.967 2.112 3.824 4.591 4.904C9.563 22.825 11.233 22 12 20.316c.767 1.684 2.437 2.509 4.71 1.52 2.479-1.08 4.59-2.937 4.59-4.904 0-2.388-2.766-3.236-4.99-3.522 1.59.424 3.553-.16 4.607-1.954.675-1.148 2.083-4.69 2.083-6.914 0-2.315-1.566-3.446-4.202-1.737-2.752 1.942-5.711 5.881-6.798 7.995z"/></svg>
        </a>` : '';
      const telegramIcon = cred.telegram ? `
        <a href="${cred.telegram}" target="_blank" title="Telegram">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.97-.64-.34-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
        </a>` : '';
        
      cdCredit.innerHTML = `<span>Art by: ${cred.artist}</span> <span class="cd-credit-pipe">|</span> <div class="cd-credit-icons">${igIcon}${xIcon}${tumblrIcon}${tiktokIcon}${bskyIcon}${telegramIcon}</div>`;
      cdCredit.style.display = 'flex';
    } else {
      cdCredit.innerHTML = '';
      cdCredit.style.display = 'none';
    }

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

function updateCollectionNotification() {
  if (typeof CARD_CATALOG === 'undefined' || !gs || !gs.collection) return;
  let hasNotif = false;
  for (const card of CARD_CATALOG) {
    const isNew = gs.newCards && gs.newCards[card.cardName];
    if (isNew) {
      hasNotif = true;
      break;
    }
    const count = gs.collection[card.cardName] || 0;
    if (count > 0) {
      const rank = (gs.ranks && gs.ranks[card.cardName]) || 0;
      if (count > rank + 1 && rank < 3) {
        hasNotif = true;
        break;
      }
    }
  }
  
  const btn = document.getElementById('collection-open-btn');
  if (btn) {
    let dot = btn.querySelector('.col-notif-dot');
    if (hasNotif) {
      if (!dot) {
        dot = document.createElement('div');
        dot.className = 'col-notif-dot';
        btn.appendChild(dot);
      }
    } else {
      if (dot) dot.remove();
    }
  }

  updateCharTabNotifications();
}

function updateCharTabNotifications() {
  if (typeof CARD_CATALOG === 'undefined' || !gs || !gs.collection) return;
  const charTabs = document.querySelectorAll('.col-char-tab');
  if (!charTabs.length) return;

  const charNotifs = {};
  for (const card of CARD_CATALOG) {
    const count = gs.collection[card.cardName] || 0;
    if (count > 0) {
      const rank = (gs.ranks && gs.ranks[card.cardName]) || 0;
      if (count > rank + 1 && rank < 3) {
        charNotifs[card.character] = true;
      }
    }
  }

  charTabs.forEach(tab => {
    const char = tab.dataset.char;
    const hasNotif = !!charNotifs[char];
    let dot = tab.querySelector('.col-notif-dot');
    if (hasNotif) {
      if (!dot) {
        dot = document.createElement('div');
        dot.className = 'col-notif-dot';
        tab.appendChild(dot);
      }
    } else {
      if (dot) dot.remove();
    }
  });
}

