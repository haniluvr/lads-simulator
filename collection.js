function injectRealCollectionModal() {
  const modalHtml = `
    <div id="real-collection-modal" class="col-modal-overlay" aria-modal="true" role="dialog" style="display: none;">
      
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

          <div class="col-arch-inner" style="width: 100%; padding: 0 16px;">
            <!-- Divider -->
            <div class="col-arch-divider" aria-hidden="true">
              <span class="col-div-line"></span>
              <span class="col-div-gem">✦</span>
              <span class="col-div-line"></span>
            </div>
            
            <!-- Header Row -->
            <div style="display: flex; width: 100%; align-items: center; justify-content: space-between; margin-top: 12px; min-height: 28px;">
              <!-- Left: Back Button -->
              <div style="flex: 1; display: flex; justify-content: flex-start;">
                <button id="rc-back-btn" style="
                  display: none;
                  align-items: center;
                  gap: 4px;
                  background: none;
                  border: none;
                  color: var(--gold);
                  font-family: var(--font-c);
                  font-size: 14px;
                  cursor: pointer;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  padding: 4px;
                ">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><path d="M15 18l-6-6 6-6"/></svg>
                  Back
                </button>
              </div>

              <!-- Center: Title -->
              <div style="flex: 1; display: flex; justify-content: center; text-align: center;">
                <h2 class="col-modal-title" id="rc-modal-title" style="margin: 0; white-space: nowrap;">Collection</h2>
              </div>

              <!-- Right: Progress Pill -->
              <div style="flex: 1; display: flex; justify-content: flex-end;">
                <div id="rc-modal-subtitle" style="
                  display: none;
                  align-items: center;
                  justify-content: center;
                  color: var(--gold);
                  background: linear-gradient(180deg, rgba(201,169,110,0.1), rgba(201,169,110,0.25));
                  border: 1px solid rgba(201,169,110,0.5);
                  box-shadow: 0 2px 8px rgba(201,169,110,0.2);
                  border-radius: 99px;
                  padding: 4px 14px;
                  font-size: 13px;
                  font-family: var(--font-d);
                  font-weight: 500;
                  letter-spacing: 1px;
                  white-space: nowrap;
                "></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── CONTENT BODY (below arch) ──────────────── -->
        <div class="col-body">
          <div class="col-divider-line"></div>
          
          <div id="rc-view-main">
            <div class="li-grid">
              <div class="li-card" data-char="Xavier">
                <img src="assets/ui/select/xavier.webp" alt="Xavier">
              </div>
              <div class="li-card" data-char="Zayne">
                <img src="assets/ui/select/zayne.webp" alt="Zayne">
              </div>
              <div class="li-card" data-char="Rafayel">
                <img src="assets/ui/select/rafayel.webp" alt="Rafayel">
              </div>
              <div class="li-card" data-char="Sylus">
                <img src="assets/ui/select/sylus.webp" alt="Sylus">
              </div>
              <div class="li-card" data-char="Caleb">
                <img src="assets/ui/select/caleb.webp" alt="Caleb">
              </div>
              <div class="li-card" data-char="Valko">
                <img src="assets/ui/select/valko.webp" alt="Valko">
              </div>
            </div>
          </div>

          <div id="rc-view-char" style="display: none; height: 100%; flex-direction: column; flex: 1; min-height: 0;">
            <div class="col-grid" id="rc-char-grid"></div>
          </div>

        </div>
      </div><!-- /.col-modal-wrap -->
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function initRealCollection() {
  // Inject HTML first
  injectRealCollectionModal();

  const triggerBtn = document.getElementById('real-collection-btn');
  const modal = document.getElementById('real-collection-modal');
  const viewMain = document.getElementById('rc-view-main');
  const viewChar = document.getElementById('rc-view-char');
  const charGrid = document.getElementById('rc-char-grid');
  const modalTitle = document.getElementById('rc-modal-title');
  
  if (!triggerBtn || !modal) return;

  let currentView = 'main'; // 'main' or 'char'

  const openModal = () => {
    if (typeof playSFX === 'function') playSFX('click');
    modal.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('active')));
    
    // Always start in main view
    currentView = 'main';
    viewMain.style.transition = 'none';
    viewMain.style.opacity = '1';
    viewMain.style.display = 'block';
    viewChar.style.display = 'none';
    modalTitle.textContent = 'Collection';
    document.getElementById('rc-modal-subtitle').style.display = 'none';
    if (document.getElementById('rc-back-btn')) {
      document.getElementById('rc-back-btn').style.display = 'none';
    }
  };

  const closeModal = () => {
    if (typeof playSFX === 'function') playSFX('click');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  };

  triggerBtn.addEventListener('click', openModal);

  // Clicking outside modal content to close or go back
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('col-modal-wrap')) {
      if (currentView === 'char') {
        rcBackBtn.click();
      } else {
        closeModal();
      }
    }
  });

  const rcBackBtn = document.getElementById('rc-back-btn');
  rcBackBtn.addEventListener('click', () => {
    if (typeof playSFX === 'function') playSFX('click');
    
    viewChar.style.transition = 'opacity 0.2s ease';
    viewChar.style.opacity = '0';
    
    setTimeout(() => {
      currentView = 'main';
      viewChar.style.display = 'none';
      viewMain.style.display = 'block';
      modalTitle.textContent = 'Collection';
      rcBackBtn.style.display = 'none';
      document.getElementById('rc-modal-subtitle').style.display = 'none';
      
      viewMain.style.transition = 'opacity 0.2s ease';
      viewMain.style.opacity = '0';
      viewMain.getBoundingClientRect(); // force reflow
      viewMain.style.opacity = '1';
    }, 200);
  });

  modal.querySelectorAll('.li-card').forEach(card => {
    card.addEventListener('click', () => {
      if (typeof playSFX === 'function') playSFX('click');
      const charName = card.getAttribute('data-char');
      showCharacterCollection(charName);
    });
  });

  function showCharacterCollection(charName) {
    viewMain.style.transition = 'opacity 0.2s ease';
    viewMain.style.opacity = '0';
    
    setTimeout(() => {
      currentView = 'char';
      viewMain.style.display = 'none';
      viewChar.style.display = 'flex';
      modalTitle.textContent = charName;
      document.getElementById('rc-back-btn').style.display = 'flex';
      
      charGrid.innerHTML = '';
    
    const charCards = CARD_CATALOG.filter(c => c.character === charName.toLowerCase())
      .sort((a, b) => b.rarity - a.rarity);
      
    let owned = 0;
    charCards.forEach(card => {
      if ((gs.collection[card.cardName] || 0) > 0) owned++;
    });
    
    const subtitle = document.getElementById('rc-modal-subtitle');
    subtitle.textContent = `${owned}/${charCards.length}`;
    subtitle.style.display = 'block';
      
    charCards.forEach(card => {
      const count = gs.collection[card.cardName] || 0;
      const rank = gs.ranks[card.cardName] || 0;
      const isOwned = count > 0;
      
      const starSvg = `<svg class="col-star-icon" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z"/></svg>`;
      const starsHtml = starSvg.repeat(card.rarity);

      const typeIcon = card.type === 'solar'
        ? `<svg class="col-type-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.536-7.536l-1.414 1.414M7.879 16.121l-1.414 1.414M16.121 16.121l1.414 1.414M7.879 7.879L6.464 6.464"/></svg>`
        : `<svg class="col-type-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

      const artHtml = card.isVideo
        ? `<video data-src="${card.assetPath}#t=0.001" class="col-card-media lazy-media" loop muted playsinline preload="metadata" onloadedmetadata="this.currentTime=0.1;"></video>`
        : `<img data-src="${card.assetPath}" class="col-card-media lazy-media" alt="${card.cardName}" loading="lazy">`;

      const isMaxRank = rank >= 3;
      const item = document.createElement('div');
      item.className = `col-card ${isMaxRank ? 'max-rank' : ''}`;
      
      const inactiveClass = !isOwned ? 'card-inactive' : '';

      item.innerHTML = `
        <div class="col-card-art ${inactiveClass}">
          ${artHtml}
          <div class="col-card-grad"></div>
          <div class="col-card-type">${typeIcon}</div>
          <div class="col-card-stars">${starsHtml}</div>
        </div>
        <div class="col-card-label">${card.cardName}</div>
      `;

      if (card.isVideo && isOwned) {
        item.addEventListener('mouseenter', () => {
          const v = item.querySelector('video');
          if (v) v.play().catch(()=>{});
        });
        item.addEventListener('mouseleave', () => {
          const v = item.querySelector('video');
          if (v) { v.pause(); v.currentTime = 0.1; }
        });
      }

      charGrid.appendChild(item);
      
      const mediaEl = item.querySelector('.lazy-media');
      if (mediaEl && window.mediaObserver) {
        window.mediaObserver.observe(mediaEl);
      }
    });

    viewChar.style.transition = 'opacity 0.2s ease';
    viewChar.style.opacity = '0';
    viewChar.getBoundingClientRect(); // force reflow
    viewChar.style.opacity = '1';
  }, 200);
  }
}
