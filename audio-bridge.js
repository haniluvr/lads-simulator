/**
 * audio-bridge.js — Unified BGM + Volume system for pseudo-gacha
 *
 * ── BGM State (localStorage key "ps_audio") ───────────────────────────────
 *   { bgmOn, activeTrack, bgmTime }
 *
 *   bgmOn:       bool   — universal mute preference, shared across all pages
 *   activeTrack: string — filename of the last active track (for change detection)
 *   bgmTime:     number — playback position for same-track continuity
 *
 * ── Volume State (localStorage key "lds_gacha_v1") ───────────────────────
 *   Stored inside the same object as the main app game state.
 *   { volume: 0-1, sfxVolume: 0-1 }
 *   Both pages read/write the SAME key so settings are always in sync.
 *
 * ── Track-Change Rules ────────────────────────────────────────────────────
 *   - Different track → reset: play from start, bgmOn = true
 *   - Same track      → restore: resume position, respect bgmOn
 *
 * ── API ───────────────────────────────────────────────────────────────────
 *   AudioBridge.init(audioEl, playIconEl, pauseIconEl)
 *   AudioBridge.toggle(audioEl, playIconEl, pauseIconEl)
 *   AudioBridge.initBtn(audioEl, btnEl)       — aria-pressed style
 *   AudioBridge.toggleBtn(audioEl, btnEl)
 *   AudioBridge.getVolume()   → number (bgm volume, 0-1)
 *   AudioBridge.getSfxVol()  → number (sfx volume, 0-1)
 *   AudioBridge.saveVolume(bgmVol, sfxVol)    — persist to localStorage
 */

(function () {
  'use strict';

  // ── Storage keys ──────────────────────────────────────────────────────────
  const BGM_KEY   = 'ps_audio';
  const STATE_KEY = 'lds_gacha_v1';   // shared with app.js / main game state

  // ── BGM prefs helpers ─────────────────────────────────────────────────────
  function readBgm() {
    try { return JSON.parse(localStorage.getItem(BGM_KEY) || '{}'); }
    catch { return {}; }
  }

  function writeBgm(patch) {
    try { localStorage.setItem(BGM_KEY, JSON.stringify(Object.assign(readBgm(), patch))); }
    catch {}
  }

  // ── Volume helpers (shared with app.js via lds_gacha_v1) ─────────────────
  function readState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); }
    catch { return {}; }
  }

  function getVolume()  { return readState().volume    ?? 0.4; }
  function getSfxVol()  { return readState().sfxVolume ?? 0.5; }

  function saveVolume(bgmVol, sfxVol) {
    try {
      const state = readState();
      if (bgmVol  !== undefined) state.volume    = bgmVol;
      if (sfxVol  !== undefined) state.sfxVolume = sfxVol;
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {}
  }

  // ── Utilities ─────────────────────────────────────────────────────────────
  function trackId(src) {
    try { return (src || '').split('/').pop().split('?')[0]; }
    catch { return src || ''; }
  }

  function setIcons(play, pause, isPlaying) {
    const playEl = typeof play === 'string' ? document.getElementById(play) : play;
    const pauseEl = typeof pause === 'string' ? document.getElementById(pause) : pause;
    if (playEl)  playEl.style.display  = isPlaying ? 'none'  : 'block';
    if (pauseEl) pauseEl.style.display = isPlaying ? 'block' : 'none';
  }

  function setBtn(btn, isPlaying) {
    const btnEl = typeof btn === 'string' ? document.getElementById(btn) : btn;
    if (btnEl) btnEl.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
  }

  function tryPlay(audioEl, onSuccess, onFail) {
    audioEl.play().then(() => {
      if (onSuccess) onSuccess();
    }).catch(() => {
      if (onFail) onFail();
    });
  }

  function onFirstGesture(audioEl, onSuccess) {
    const handler = () => {
      if (readBgm().bgmOn !== false && audioEl.paused) {
        tryPlay(audioEl, onSuccess, null);
      }
    };
    document.addEventListener('pointerdown', handler, { once: true, capture: true });
    document.addEventListener('keydown',     handler, { once: true, capture: true });
  }

  function setupPositionSaving(audioEl) {
    let timer = null;
    audioEl.addEventListener('timeupdate', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!audioEl.paused) writeBgm({ bgmTime: audioEl.currentTime });
      }, 2000);
    });
    const saveNow = () => {
      if (!audioEl.ended) writeBgm({ bgmTime: audioEl.currentTime });
    };
    window.addEventListener('beforeunload', saveNow);
    window.addEventListener('pagehide', saveNow);
  }

  // ── Core initializer ──────────────────────────────────────────────────────
  function initCore(audioEl, onPlay, onPause) {
    if (!audioEl) return;

    // Apply saved volume immediately
    audioEl.volume = getVolume();

    const track = trackId(audioEl.src);
    const prefs = readBgm();

    if (prefs.activeTrack !== track) {
      // Different track → new context: play from start, reset mute state
      audioEl.currentTime = 0;
      writeBgm({ bgmOn: true, activeTrack: track, bgmTime: 0 });

      tryPlay(audioEl, onPlay, () => {
        onPause();
        onFirstGesture(audioEl, onPlay);
      });

    } else {
      // Same track → restore position and respect bgmOn
      if (prefs.bgmTime) audioEl.currentTime = prefs.bgmTime;

      if (prefs.bgmOn === false) {
        onPause();
        return;
      }

      tryPlay(audioEl, onPlay, () => {
        onPause();
        onFirstGesture(audioEl, onPlay);
      });
    }

    setupPositionSaving(audioEl);

    // Pause music when tab is hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        audioEl.pause();
        onPause();
      } else {
        if (readBgm().bgmOn !== false) {
          tryPlay(audioEl, onPlay, null);
        }
      }
    });

    // Native audio event listeners to guarantee icons stay synced
    // even if audioEl.play() or audioEl.pause() are called directly
    // in minigame logic.
    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('pause', onPause);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  function init(audioEl, playIcon, pauseIcon) {
    initCore(audioEl,
      () => setIcons(playIcon, pauseIcon, true),
      () => setIcons(playIcon, pauseIcon, false)
    );
  }

  function initBtn(audioEl, btnEl) {
    initCore(audioEl,
      () => setBtn(btnEl, true),
      () => setBtn(btnEl, false)
    );
  }

  function toggle(audioEl, playIcon, pauseIcon) {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
      setIcons(playIcon, pauseIcon, true);
      writeBgm({ bgmOn: true });
    } else {
      audioEl.pause();
      setIcons(playIcon, pauseIcon, false);
      writeBgm({ bgmOn: false });
    }
  }

  function toggleBtn(audioEl, btnEl) {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
      setBtn(btnEl, true);
      writeBgm({ bgmOn: true });
    } else {
      audioEl.pause();
      setBtn(btnEl, false);
      writeBgm({ bgmOn: false });
    }
  }

  // "?"? Zero-Latency SFX System "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let sfxCtx = null;
  const sfxBuffers = {};

  async function loadSfx(url) {
    if (!sfxCtx) sfxCtx = new AudioContext();
    if (sfxBuffers[url]) return sfxBuffers[url];
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await sfxCtx.decodeAudioData(arrayBuffer);
      sfxBuffers[url] = audioBuffer;
      return audioBuffer;
    } catch (e) {
      console.warn('Failed to load sfx:', url);
    }
  }

  function playSfx(url) {
    if (!sfxCtx) sfxCtx = new AudioContext();
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    const buffer = sfxBuffers[url];
    if (!buffer) {
      loadSfx(url).then(buf => { if (buf) playSfx(url); });
      return;
    }
    const source = sfxCtx.createBufferSource();
    source.buffer = buffer;
    const gainNode = sfxCtx.createGain();
    gainNode.gain.value = getSfxVol();
    source.connect(gainNode);
    gainNode.connect(sfxCtx.destination);
    source.start(0);
  }

  // Determine root path for audio cues
  const isSubpage = window.location.pathname.split('/').filter(Boolean).length >= 2;
  const sfxRoot = isSubpage ? '../assets/audio-cue/' : 'assets/audio-cue/';
  const selectCue = sfxRoot + 'select_cue.mp3';
  const backCue = sfxRoot + 'back_cue.mp3';

  // Preload UI sounds
  window.addEventListener('DOMContentLoaded', () => {
    loadSfx(selectCue);
    loadSfx(backCue);
  });

  // Global UI Click Listener
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .btn, .btn-ghost, .btn-solid, .shoot-btn, .pose-card-btn, .char-filter-pill, .shoot-char-toggle, .color-picker-btn, .text-color-btn, .template-card, .frame-option, .music-toggle-btn, .bgm-btn, .home-img-btn, .sf-reset-btn');
    if (!target) return;
    
    // Ignore specific elements
    const isIgnore = target.closest('#sample-strip, .canvas-container, .strip-animate');
    if (isIgnore) return;

    // Check if back button
    const isBack = target.closest('#back-btn, .back-btn, #booth-back, .booth-back-btn, #shoot-back, #phase4-back, [href="../index.html"], [href="index.html"]');
    
    if (isBack) {
      playSfx(backCue);
    } else {
      playSfx(selectCue);
    }

    // Defer navigation for local anchor tags to allow SFX to play
    if (target.tagName.toLowerCase() === 'a') {
      const href = target.getAttribute('href');
      const isExternal = target.getAttribute('target') === '_blank';
      const isHash = href && href.startsWith('#');
      const isDownload = target.hasAttribute('download');
      const isDataUri = href && (href.startsWith('data:') || href.startsWith('blob:'));
      const hasSpecialAction = target.closest('a[href="booth.html"]');
      
      if (href && !isExternal && !isHash && !isDownload && !isDataUri && !hasSpecialAction) {
        e.preventDefault();
        setTimeout(() => {
          window.location.href = href;
        }, 150);
      }
    }
  });

  window.AudioBridge = { init, toggle, initBtn, toggleBtn, getVolume, getSfxVol, saveVolume, playSfx, loadSfx };
})();
