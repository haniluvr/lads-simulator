/**
 * i18n.js
 * 
 * Lightweight localization engine for the Wish Simulator.
 * Loads the appropriate dictionary from locales/en.json or locales/zh.json
 * based on localStorage, and updates all DOM elements with data-i18n attributes.
 * 
 * Exposes a global window.i18n object.
 */

(function () {
  'use strict';

  // State keys
  const STATE_KEY = 'lds_gacha_v1';
  
  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {};
  }
  
  function saveState(patch) {
    const s = loadState();
    Object.assign(s, patch);
    try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (_) {}
  }

  const state = loadState();
  
  // Also check URL for lang parameter (e.g. ?lang=zh or ?lang=cn)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  let currentLang = 'en';
  
  if (urlLang === 'zh' || urlLang === 'cn') {
    currentLang = 'zh';
  } else if (urlLang === 'en') {
    currentLang = 'en';
  } else if (state.lang) {
    currentLang = state.lang;
  } else {
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    currentLang = browserLang.startsWith('zh') ? 'zh' : 'en';
  }
  let dict = {};

  // Resolve root path for locales
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const isSubpage = pathParts.length >= 2 &&
    (pathParts[pathParts.length - 2] === 'arcade' ||
     pathParts[pathParts.length - 2] === 'photobooth');
  const ROOT = isSubpage ? '../' : '';

  // Load dictionary for a specific language
  async function loadDictionary(lang) {
    try {
      const res = await fetch(`${ROOT}locales/${lang}.json?v=${Date.now()}`);
      if (res.ok) {
        dict = await res.json();
      } else {
        console.warn(`Failed to load ${lang}.json`);
      }
    } catch (e) {
      console.warn(`Error loading dictionary: ${e.message}`);
    }
  }

  // Apply translations to DOM elements with data-i18n
  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        // preserve inner HTML structure if it's not purely text (e.g., icons inside buttons)
        el.innerHTML = dict[key];
      }
    });

    // Special handlers for placeholders, if any
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.placeholder = dict[key];
    });
  }

  // Switch language globally
  async function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    currentLang = lang;
    saveState({ lang });
    
    // Update URL query parameter
    try {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('lang', lang);
      window.history.replaceState({}, '', newUrl);
    } catch (_) {}
    
    await loadDictionary(lang);
    applyTranslations();
    
    const logoImg = document.getElementById('arch-logo-img');
    if (logoImg) {
      if (currentLang === 'zh') {
        logoImg.src = 'assets/ui/love and deepspace_cn.png';
      } else {
        logoImg.src = 'assets/ui/love and deepspace.png';
      }
    }
    
    const pbLogoImg = document.getElementById('pb-title-logo-img');
    if (pbLogoImg) {
      if (currentLang === 'zh') {
        pbLogoImg.src = ROOT + 'assets/photobooth/love-and-deepspace-cn.webp';
      } else {
        pbLogoImg.src = ROOT + 'assets/photobooth/love-and-deepspace.webp';
      }
    }
    
    // Dispatch event so other scripts (like app.js) can re-render dynamic content
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }

  // Get card display name
  function getCardName(card) {
    if (!card) return '';
    return (currentLang === 'zh' && card.cardNameCN) ? card.cardNameCN : card.cardName;
  }

  // Get character display name
  function getCharName(charId) {
    if (!charId) return '';
    if (currentLang !== 'zh') return charId.charAt(0).toUpperCase() + charId.slice(1);
    const map = { xavier: '沈星回', zayne: '黎深', rafayel: '祁煜', sylus: '秦彻', caleb: '夏以昼', valko: '敖尹' };
    return map[charId.toLowerCase()] || charId;
  }

  // Get a specific translation by key
  function t(key) {
    return dict[key] || key; // fallback to key if missing
  }

  // Initialize
  window.i18n = {
    get lang() { return currentLang; },
    setLanguage,
    t,
    applyTranslations,
    getCardName,
    getCharName,
    init: async function() {
      await loadDictionary(currentLang);
      
      const onReady = () => {
        applyTranslations();
        
        const logoImg = document.getElementById('arch-logo-img');
        if (logoImg) {
          logoImg.src = currentLang === 'zh' ? 'assets/ui/love and deepspace_cn.png' : 'assets/ui/love and deepspace.png';
        }
        
        const pbLogoImg = document.getElementById('pb-title-logo-img');
        if (pbLogoImg) {
          pbLogoImg.src = currentLang === 'zh' ? ROOT + 'assets/photobooth/love-and-deepspace-cn.webp' : ROOT + 'assets/photobooth/love-and-deepspace.webp';
        }
        
        // Dispatch event so dynamic scripts re-render with loaded dictionary
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLang }));
      };

      // Wait for DOM to be ready before applying
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
      } else {
        onReady();
      }
    }
  };

  // Kickoff load immediately
  window.i18n.init();

})();
