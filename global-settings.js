/**
 * global-settings.js
 * 
 * Injects the settings button + modal into every page.
 * Reads/writes to the shared lds_gacha_v1 localStorage key via AudioBridge.
 *
 * Usage: <script src="global-settings.js"></script> (or ../ for subpages)
 * Must be included AFTER audio-bridge.js.
 *
 * Cursor images are resolved relative to the site root automatically.
 */
(function () {
  'use strict';

  // ── Path Resolution ──────────────────────────────────────────
  // Determine the root prefix based on current page depth.
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  // If page is at /arcade/... or /photobooth/..., go up one level
  const isSubpage = pathParts.length >= 2 &&
    (pathParts[pathParts.length - 2] === 'arcade' ||
     pathParts[pathParts.length - 2] === 'photobooth');
  const ROOT = isSubpage ? '../' : '';

  // ── State ────────────────────────────────────────────────────
  const STATE_KEY = 'lds_gacha_v1';

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {};
  }

  function savePartial(patch) {
    const s = loadState();
    Object.assign(s, patch);
    try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (_) {}
  }

  // ── Cursor Helper ────────────────────────────────────────────
  function applyCursorClass(cursorName) {
    document.body.className = document.body.className
      .split(' ').filter(c => !c.startsWith('cursor-')).join(' ');
    document.body.classList.add(`cursor-${cursorName}`);
  }

  // Apply saved cursor immediately on load (no flash)
  const initState = loadState();
  if (initState.cursor) applyCursorClass(initState.cursor);

  // ── Inject HTML ──────────────────────────────────────────────
  const settingsHTML = `
  <!-- ── Global Settings Button ── -->
  <button id="settings-btn" class="sf-reset-btn global-settings-btn" aria-label="Settings" title="Open Settings">
    <i data-lucide="settings"></i>
  </button>

  <!-- ── Global Settings Modal ── -->
  <div id="settings-modal" class="settings-overlay" aria-modal="true" role="dialog" style="display:none;">
    <div class="settings-container">
      <div class="settings-header">
        <h2>SETTINGS</h2>
        <button id="settings-close-btn" class="settings-close" aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="settings-body">

        <details class="settings-accordion" open>
          <summary>Audio</summary>
          <div class="accordion-content">
            <p class="settings-desc">Adjust the volume for background music and sound effects.</p>
            <div class="slider-row">
              <span>Music</span>
              <input type="range" id="gs-volume-slider" class="settings-slider" min="0" max="1" step="0.01" value="1">
            </div>
            <div class="slider-row">
              <span>SFX</span>
              <input type="range" id="gs-sfx-slider" class="settings-slider" min="0" max="1" step="0.01" value="0.5">
            </div>
          </div>
        </details>

        <details class="settings-accordion" id="gs-cursor-section">
          <summary>Cursor</summary>
          <div class="accordion-content">
            <p class="settings-desc">Select your preferred mouse cursor.</p>
            <div class="cursor-options">
              <button class="cursor-btn active" data-cursor="default" aria-label="Reset Cursor" title="Reset Cursor">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button class="cursor-btn" data-cursor="xavier" title="Xavier"><img src="${ROOT}assets/ui/cursors/xavier_cursor.png" alt="Xavier"></button>
              <button class="cursor-btn" data-cursor="zayne" title="Zayne"><img src="${ROOT}assets/ui/cursors/zayne_cursor.png" alt="Zayne"></button>
              <button class="cursor-btn" data-cursor="rafayel" title="Rafayel"><img src="${ROOT}assets/ui/cursors/rafayel_cursor.png" alt="Rafayel"></button>
              <button class="cursor-btn" data-cursor="sylus" title="Sylus"><img src="${ROOT}assets/ui/cursors/sylus_cursor.png" alt="Sylus"></button>
              <button class="cursor-btn" data-cursor="caleb" title="Caleb"><img src="${ROOT}assets/ui/cursors/caleb_cursor.png" alt="Caleb"></button>
              <button class="cursor-btn" data-cursor="valko" title="Valko"><img src="${ROOT}assets/ui/cursors/valko_cursor.png" alt="Valko"></button>
            </div>
          </div>
        </details>

        <details class="settings-accordion">
          <summary>Reset Data</summary>
          <div class="accordion-content">
            <p class="settings-desc">Clear your local progress, pity, and collection completely.</p>
            <button id="gs-reset-btn" class="settings-action-btn">Reset Progress</button>
          </div>
        </details>

        <details class="settings-accordion">
          <summary>Information</summary>
          <div class="accordion-content info-content">
            <p class="settings-desc">A fan-made, beautifully crafted wish (gacha) simulator for the game <b>Love and Deepspace</b>. Test your luck without spending real money!</p>
            <p class="settings-desc">This project aims to recreate the authentic summoning experience from the game, featuring dynamic animations, a pity system, character collections, and a gorgeous, responsive UI built entirely with vanilla web technologies.</p>
            <p class="settings-desc">
              Acknowledgement:<br>
              Thank you to <a href="https://x.com/SkylusRose" target="_blank" style="color:inherit;">Chey</a>, <a href="https://x.com/Tashter" target="_blank" style="color:inherit;">Tasha</a>, and <a href="https://x.com/YuhinaSan" target="_blank" style="color:inherit;">Yuhina</a> for helping me gather the missing memories in my collection.
            </p>
            <p class="settings-desc">
              Fanart Credits:<br>
              <strong style="color:var(--gold-lt);">Cards:</strong> <a href="https://x.com/celh0_0" target="_blank" style="color:inherit;">Cee</a>, <a href="https://x.com/Harlock_Mephistokitten" target="_blank" style="color:inherit;">Mephisto</a>, <a href="https://x.com/KC_7385" target="_blank" style="color:inherit;">KC_7385</a>, <a href="https://x.com/uulyaax" target="_blank" style="color:inherit;">uulyaax</a>, <a href="https://x.com/SpiritFucker93" target="_blank" style="color:inherit;">SpiritFucker93</a>, <a href="https://x.com/SALADYUMI" target="_blank" style="color:inherit;">salad</a>, <a href="https://x.com/starsxav" target="_blank" style="color:inherit;">jin</a>, <a href="https://x.com/beejawing" target="_blank" style="color:inherit;">b</a>, <a href="https://x.com/okojyomeimei" target="_blank" style="color:inherit;">Meimei</a>, <a href="https://x.com/Thekawacookiie" target="_blank" style="color:inherit;">Kihaiu</a>, <a href="https://x.com/Aagknorr" target="_blank" style="color:inherit;">Aagknorr</a>, <a href="https://x.com/imuyumiii" target="_blank" style="color:inherit;">Syer</a>, <a href="https://x.com/WanderingNika" target="_blank" style="color:inherit;">Nika</a>, <a href="https://x.com/OrangeTart_" target="_blank" style="color:inherit;">ASH</a>, <a href="https://x.com/godzileen" target="_blank" style="color:inherit;">godzileen</a>, <a href="https://x.com/Cereza_cristal" target="_blank" style="color:inherit;">Cereza_cristal</a>, <a href="https://x.com/raonnni" target="_blank" style="color:inherit;">raonnni</a>, <a href="https://x.com/zeitvon" target="_blank" style="color:inherit;">zeitvon</a>, <a href="https://x.com/Starry_Lottie" target="_blank" style="color:inherit;">Lottie</a>, <a href="https://x.com/very_octoink" target="_blank" style="color:inherit;">very_octoink</a>, <a href="https://x.com/n0niiiiii" target="_blank" style="color:inherit;">n0niiiiii</a>, <a href="https://x.com/acolyptic" target="_blank" style="color:inherit;">Acolyptic</a>, <a href="https://x.com/PencintaApelll" target="_blank" style="color:inherit;">Chel</a>, <a href="https://x.com/c0axyz" target="_blank" style="color:inherit;">c0axyz</a>, <a href="https://x.com/solisweirdddd" target="_blank" style="color:inherit;">solisweirdddd</a>, <a href="https://instagram.com/pinkieplum" target="_blank" style="color:inherit;">pinkieplum</a>, <a href="https://x.com/YuhinaSan" target="_blank" style="color:inherit;">Yuhina.san</a>, <a href="https://x.com/Aunimea" target="_blank" style="color:inherit;">Auniméa</a>, <a href="https://x.com/CELYNSICAL" target="_blank" style="color:inherit;">CELYNSICAL</a>, <a href="https://x.com/bonesandchocos" target="_blank" style="color:inherit;">bones</a>, <a href="https://x.com/fine_fiction" target="_blank" style="color:inherit;">Morgenty</a>, <a href="https://x.com/ayushnz_/" target="_blank" style="color:inherit;">Ayu</a>, <a href="https://x.com/NheaLonn" target="_blank" style="color:inherit;">NheaLonn</a><br><br>
              <strong style="color:var(--gold-lt);">Stickers:</strong> <a href="https://xhslink.cn/m/8NTZMgjK6NN" target="_blank" style="color:inherit;">_Valko_</a>, <a href="https://x.com/Astareion" target="_blank" style="color:inherit;">Rei</a>, <a href="https://x.com/smallbento" target="_blank" style="color:inherit;">Bento</a>, <a href="https://x.com/fantasyartist26" target="_blank" style="color:inherit;">Ellie</a>
            </p>
            <p class="settings-desc" style="font-size: 11px;font-style: italic;">Disclaimer: This is an unofficial, fan-made web application and is not affiliated with, endorsed, sponsored, or approved by Papergames or Infold Games. Love and Deepspace, its characters, artwork, audio, and all associated intellectual property are the exclusive property of their respective copyright holders. This project is created strictly for entertainment and fan purposes, with no commercial intent. No copyright infringement is intended.</p>
          </div>
        </details>

        <details class="settings-accordion">
          <summary>Privacy Policy</summary>
          <div class="accordion-content info-content">
            <h3 style="color: var(--gold, #c9a96e); margin-bottom: 8px; font-size: 14px; font-family: var(--font-d); text-align: left;">1. Data Collection and Usage</h3>
            <p class="settings-desc">We do not collect, store, transmit, or share any of your personal information. This web application operates entirely on the client side (within your web browser). We do not have servers that record your gameplay, activity, or personal data.</p>
            
            <h3 style="color: var(--gold, #c9a96e); margin-bottom: 8px; font-size: 14px; font-family: var(--font-d); text-align: left;">2. Local Storage</h3>
            <p class="settings-desc">To save your simulator progress (such as your pull history, pity count, memory collection, and audio settings), this site uses your browser's Local Storage. This data is stored strictly on your device and never leaves it. You can delete this data at any time by using the "Reset Data" option in the Settings menu or by clearing your browser's cache and site data.</p>
            
            <h3 style="color: var(--gold, #c9a96e); margin-bottom: 8px; font-size: 14px; font-family: var(--font-d); text-align: left;">3. Photobooth & Images</h3>
            <p class="settings-desc">The photobooth feature processes images locally on your device. Any photos you take, upload, or edit within the photobooth are never uploaded to our servers (because we don't have any). Everything stays on your phone or computer.</p>
            
            <h3 style="color: var(--gold, #c9a96e); margin-bottom: 8px; font-size: 14px; font-family: var(--font-d); text-align: left;">4. Third-Party Hosting</h3>
            <p class="settings-desc">This website is hosted on GitHub Pages. While the simulator itself tracks nothing, GitHub may automatically collect standard web server logs (such as IP addresses) for security and operational purposes. You can read more about this in the GitHub Privacy Statement.</p>
            
            <h3 style="color: var(--gold, #c9a96e); margin-bottom: 8px; font-size: 14px; font-family: var(--font-d); text-align: left;">5. Contact</h3>
            <p class="settings-desc">If you have any questions or concerns about this project, you can reach out via <a href="https://discordapp.com/users/914445892180906005" target="_blank" style="color:inherit;">Discord</a>, <a href="https://github.com/haniluvr" target="_blank" style="color:inherit;">Github</a>, <a href="https://www.instagram.com/hvniluvr" target="_blank" style="color:inherit;">Instagram</a>, and <a href="https://x.com/hvnibun" target="_blank" style="color:inherit;">X/Twitter</a>.</p>
            
            <p class="settings-desc" style="font-size: 11px;font-style: italic;">Last Updated: August 2026</p>
          </div>
        </details>

      </div>

      <!-- Footer Info (Always visible) -->
      <div class="info-footer">
        <p class="info-copy">LADS Wish Simulator, Code and Design © 2026 haniluvr.<br>Assets copyrights belong to their respective owners.</p>
        <div class="info-socials">
          <a href="https://ko-fi.com/haniluvr" aria-label="Ko-fi"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.46-.091-3.71.951-1.252 2.771-1.082 3.839.055.05.048.093.094.135.14.041-.046.085-.092.135-.14 1.068-1.137 2.888-1.307 3.839-.055.95 1.25.218 2.745-.491 3.711zm9.589-2.023c-.22.955-1.42 1.442-2.316 1.547-.11.011-.22.016-.33.023V7.202c.866-.021 2.378-.061 3.036 1.261.262.525.257 1.487-.39 2.462z"/></svg></a>
          <a href="https://github.com/haniluvr" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg></a>
          <a href="https://x.com/hvnibun" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a href="https://discordapp.com/users/914445892180906005" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.05.05 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>
          <a href="https://www.instagram.com/hvniluvr" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
        </div>
      </div>

    </div>
  </div>

  <!-- ── Reset Confirm Alert ── -->
  <div id="gs-reset-confirm-modal" class="alert-overlay" aria-modal="true" role="dialog" style="display:none;">
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
          <button id="gs-reset-cancel-btn" class="alert-btn alert-btn-cancel">CANCEL</button>
          <button id="gs-reset-confirm-btn" class="alert-btn alert-btn-confirm">CONFIRM</button>
        </div>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', settingsHTML);

  // ── Inject alert styles (only once) ──────────────────────────
  if (!document.getElementById('gs-alert-styles')) {
    const style = document.createElement('style');
    style.id = 'gs-alert-styles';
    style.textContent = `

      .alert-overlay {
        position: fixed; inset: 0; z-index: 99999999;
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
      
      .settings-overlay {
        position: fixed; inset: 0; z-index: 9999999;
        background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
      }
      .settings-overlay.active { opacity: 1; pointer-events: auto; }
      
      .settings-container {
        width: 90%; max-width: 480px; background: #0e0e2e;
        border: 1px solid rgba(201, 169, 110, 0.42); border-radius: 12px;
        transform: translateY(-20px) scale(0.95); transition: transform 0.3s;
      }
      .settings-overlay.active .settings-container { transform: translateY(0) scale(1); }
      
      .settings-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 20px 24px; border-bottom: 1px solid rgba(201, 169, 110, 0.3);
        background: rgba(201, 169, 110, 0.05);
      }
      .settings-header h2 { font-family: 'Cinzel', serif; font-size: 18px; letter-spacing: 0.15em; color: var(--gold-lt, #e8cfa0); margin: 0; }
      .settings-close { width: 24px; height: 24px; color: rgba(237, 228, 255, 0.58); transition: color 0.2s; cursor: pointer; background: transparent; border: none; padding: 0; }
      .settings-close:hover { color: #fff; }
      
      .settings-body { padding: 16px 24px 10px 24px; max-height: 70vh; overflow-y: auto; padding-right: 12px; }
      .settings-body::-webkit-scrollbar { width: 6px; }
      .settings-body::-webkit-scrollbar-thumb { background: rgba(201, 169, 110, 0.3); border-radius: 3px; }
      
      .settings-accordion { border-bottom: 1px dashed rgba(201, 169, 110, 0.2); }
      .settings-accordion:last-child { border-bottom: none; }
      .settings-accordion summary {
        padding: 16px 0; font-size: 14px; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.1em; color: var(--txt, #ede4ff); list-style: none; display: flex; justify-content: space-between; cursor: pointer;
      }
      .settings-accordion summary::-webkit-details-marker { display: none; }
      .settings-accordion summary::after { content: '▼'; font-size: 10px; color: var(--gold, #c9a96e); transition: transform 0.3s; }
      .settings-accordion[open] summary::after { transform: rotate(180deg); }
      
      .accordion-content { padding-bottom: 20px; animation: slideDown 0.3s ease-out; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
      
      .settings-desc { font-size: 13px; color: var(--txt-2, rgba(237, 228, 255, 0.58)); margin-bottom: 24px; line-height: 1.5; text-align: left; }
      
      .slider-row { display: flex; align-items: center; gap: 16px; font-size: 14px; color: var(--txt, #ede4ff); margin-bottom: 24px; }
      .slider-row:last-child { margin-bottom: 0; }
      .slider-row span { width: 50px; display: inline-block; font-weight: 500; }
      
      .settings-slider { flex: 1; -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: rgba(201, 169, 110, 0.3); outline: none; }
      .settings-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--gold-lt, #e8cfa0); box-shadow: 0 0 6px rgba(201, 169, 110, 0.8); }
      
      .cursor-options { display: flex; gap: 8px; justify-content: space-between; overflow-x: auto; padding-bottom: 4px; }
      .cursor-btn { flex: 0 0 auto; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.05); color: var(--txt-2, rgba(237, 228, 255, 0.58)); border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s; padding: 0; cursor: pointer; }
      .cursor-btn img { max-width: 30px; max-height: 30px; pointer-events: none; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)); }
      .cursor-btn svg { pointer-events: none; }
      .cursor-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
      .cursor-btn.active { background: rgba(201, 169, 110, 0.15); border-color: var(--gold, #c9a96e); color: var(--gold-lt, #e8cfa0); box-shadow: inset 0 0 8px rgba(201, 169, 110, 0.2); }
      
      .settings-action-btn { width: 100%; padding: 12px; border-radius: 6px; background: rgba(255, 60, 60, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 60, 60, 0.4); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.2s; cursor: pointer; }
      .settings-action-btn:hover { background: rgba(255, 60, 60, 0.2); box-shadow: 0 0 12px rgba(255, 60, 60, 0.2); }
      
      .info-content { text-align: center; }
      .info-footer { padding: 0px 16px 16px 16px; }
      .info-copy { font-size: 10px; color: var(--txt-2, rgba(237, 228, 255, 0.58)); line-height: 1.4; margin-bottom: 16px; text-align: center; }
      .info-socials { display: flex; justify-content: center; gap: 20px; }
      .info-socials a { color: var(--txt-2, rgba(237, 228, 255, 0.58)); width: 20px; height: 20px; transition: color 0.2s, transform 0.2s; }
      .info-socials a:hover { color: var(--gold-lt, #e8cfa0); transform: scale(1.1); }
      
      @media (max-width: 800px) { #cursor-settings-section { display: none; } }
      @media (hover: none) and (pointer: coarse) { #cursor-settings-section { display: none; } }

      /* Button positioning */
      .sf-reset-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(201, 169, 110, .08);
        border: 1px solid rgba(201, 169, 110, .28);
        color: #e8cfa0;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: background 0.15s, box-shadow 0.15s;
        cursor: pointer;
      }
      .sf-reset-btn svg, .sf-reset-btn i { width: 16px; height: 16px; }
      .sf-reset-btn:hover { background: rgba(201, 169, 110, .16); box-shadow: 0 0 12px rgba(201, 169, 110, .38); }
      
      .global-settings-btn {
        position: fixed;
        top: 36px;
        right: 36px;
        z-index: 10001;
      }
    
    `;
    document.head.appendChild(style);
  }

  // ── Wire up events ───────────────────────────────────────────
  function init() {
    const settingsBtn   = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close-btn');

    const openModal = () => {
      settingsModal.style.display = '';
      requestAnimationFrame(() => requestAnimationFrame(() => settingsModal.classList.add('active')));
    };
    const closeModal = () => {
      settingsModal.classList.remove('active');
      setTimeout(() => { settingsModal.style.display = 'none'; }, 300);
    };

    settingsBtn.addEventListener('click', openModal);
    settingsClose.addEventListener('click', closeModal);
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && settingsModal.classList.contains('active')) closeModal();
    });

    // ── Accordion logic ──
    const accordions = settingsModal.querySelectorAll('.settings-accordion');
    accordions.forEach(acc => {
      const summary = acc.querySelector('summary');
      const content = acc.querySelector('.accordion-content');
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        if (acc.hasAttribute('open')) {
          content.style.animation = 'slideUp 0.2s ease-in forwards';
          content.addEventListener('animationend', function h() {
            acc.removeAttribute('open');
            content.style.animation = '';
            content.removeEventListener('animationend', h);
          });
        } else {
          accordions.forEach(other => {
            if (other !== acc && other.hasAttribute('open')) {
              const oc = other.querySelector('.accordion-content');
              oc.style.animation = 'slideUp 0.2s ease-in forwards';
              oc.addEventListener('animationend', function h() {
                other.removeAttribute('open');
                oc.style.animation = '';
                oc.removeEventListener('animationend', h);
              });
            }
          });
          acc.setAttribute('open', '');
          content.style.animation = 'slideDown 0.3s ease-out forwards';
        }
      });
    });

    // ── Volume sliders ──
    const bgMusic     = document.getElementById('bg-music');
    const volSlider   = document.getElementById('gs-volume-slider');
    const sfxSlider   = document.getElementById('gs-sfx-slider');

    if (typeof AudioBridge !== 'undefined') {
      if (volSlider) {
        volSlider.value = AudioBridge.getVolume();
        volSlider.addEventListener('input', (e) => {
          const vol = parseFloat(e.target.value);
          if (bgMusic) bgMusic.volume = vol;
          AudioBridge.saveVolume(vol, undefined);
          // Also update gs.volume if app.js is present
          if (window.gs) { window.gs.volume = vol; if (window.saveState) window.saveState(); }
          if (window.updateMinigameVolume) window.updateMinigameVolume();
        });
      }
      if (sfxSlider) {
        sfxSlider.value = AudioBridge.getSfxVol();
        sfxSlider.addEventListener('input', (e) => {
          const vol = parseFloat(e.target.value);
          AudioBridge.saveVolume(undefined, vol);
          if (window.gs) { window.gs.sfxVolume = vol; if (window.saveState) window.saveState(); }
          if (window.updateMinigameVolume) window.updateMinigameVolume();
          window.dispatchEvent(new CustomEvent('sfxvolumechange'));
        });
      }
    }

    // ── Cursor buttons ──
    const state = loadState();
    const cursorBtns = settingsModal.querySelectorAll('.cursor-btn');
    const savedCursor = state.cursor || 'default';
    cursorBtns.forEach(btn => {
      if (btn.dataset.cursor === savedCursor) {
        cursorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        cursorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cursorName = btn.dataset.cursor;
        applyCursorClass(cursorName);
        savePartial({ cursor: cursorName });
        // Also persist via app.js if available
        if (window.gs) { window.gs.cursor = cursorName; if (window.saveState) window.saveState(); }
      });
    });

    // ── Reset data ──
    const resetBtn   = document.getElementById('gs-reset-btn');
    const resetModal = document.getElementById('gs-reset-confirm-modal');
    const resetCancel  = document.getElementById('gs-reset-cancel-btn');
    const resetConfirm = document.getElementById('gs-reset-confirm-btn');

    const openReset  = () => {
      resetModal.style.display = '';
      requestAnimationFrame(() => requestAnimationFrame(() => resetModal.classList.add('active')));
    };
    const closeReset = () => {
      resetModal.classList.remove('active');
      setTimeout(() => { resetModal.style.display = 'none'; }, 250);
    };

    resetBtn.addEventListener('click', openReset);
    resetCancel.addEventListener('click', closeReset);
    resetModal.addEventListener('click', (e) => { if (e.target === resetModal) closeReset(); });
    resetConfirm.addEventListener('click', () => {
      localStorage.clear();
      sessionStorage.clear();
      const isSubpage = window.location.pathname.split('/').filter(Boolean).length >= 2;
      if (isSubpage) {
        window.location.href = '../index.html';
      } else {
        location.reload();
      }
    });

    // ── Lucide icons (re-render for injected content) ──
    if (window.lucide) window.lucide.createIcons();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
