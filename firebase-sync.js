// firebase-sync.js
// Handles Auth (Google, Guest, Twitter, Microsoft, Facebook) and Firestore sync.

(function() {
  if (!window.firebase || !window.db || !window.auth) {
    console.error("Firebase is not initialized.");
    return;
  }

  // --- Auth Providers ---
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const twitterProvider = new firebase.auth.TwitterAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();

  let currentUser = null;
  let isInitialLoad = true;
  let syncTimeout = null;

  // Allowed keys for this app to prevent cross-contamination from other localhost projects
  const ALLOWED_KEYS = ['lds_gacha_v1', 'ps_audio', 'cm_state_v1'];

  // --- Sync Logic ---
  const syncToFirestore = async () => {
    if (!currentUser) return;
    
    // Gather only allowed local storage data
    const storageData = {};
    for (const key of ALLOWED_KEYS) {
      const val = localStorage.getItem(key);
      if (val !== null) {
        storageData[key] = val;
      }
    }

    try {
      await window.db.collection("users").doc(currentUser.uid).set({
        storage: storageData,
        lastSynced: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log("☁️ Synced to Firebase successfully.");
    } catch (err) {
      console.error("Firebase sync failed:", err);
    }
  };

  const debouncedSync = () => {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncToFirestore, 2000); // 2 second debounce
  };

  // Override localStorage.setItem to auto-trigger sync
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (!isInitialLoad && ALLOWED_KEYS.includes(key)) {
      debouncedSync();
    }
  };

  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function(key) {
    originalRemoveItem.apply(this, arguments);
    if (!isInitialLoad) {
      debouncedSync();
    }
  };

  const originalClear = localStorage.clear;
  localStorage.clear = function() {
    originalClear.apply(this, arguments);
    if (!isInitialLoad) {
      debouncedSync();
    }
  };

  // --- Auth Listener ---
  window.auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    if (user) {
      console.log("User logged in:", user.uid);
      try {
        const doc = await window.db.collection("users").doc(user.uid).get();
        if (doc.exists) {
          const data = doc.data();
          if (data.storage) {
            // Restore cloud data to local storage
            for (const [key, value] of Object.entries(data.storage)) {
              originalSetItem.call(localStorage, key, value);
            }
            console.log("☁️ Pulled cloud save to local storage.");
            
            // If this is the initial load and the app relies on reloading to apply imported state
            if (isInitialLoad && !sessionStorage.getItem('fb_synced')) {
              sessionStorage.setItem('fb_synced', '1');
              location.reload();
            }
          }
        } else {
          // New user (or first time logging in) -> push current local storage to cloud
          console.log("New user detected, pushing current local storage to cloud...");
          await syncToFirestore();
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    } else {
      console.log("No user logged in.");
    }
    isInitialLoad = false;
    
    // Dispatch an event so the UI knows Auth state is ready
    window.dispatchEvent(new CustomEvent('firebase-auth-ready', { detail: { user } }));
  });

  // --- Auth Methods (Exposed Globally) ---
  window.FirebaseSync = {
    loginGoogle: () => window.auth.signInWithPopup(googleProvider).catch(e => alert("Google Login Error: " + e.message)),
    loginTwitter: () => window.auth.signInWithPopup(twitterProvider).catch(e => alert("X Login Error: " + e.message)),
    loginFacebook: () => window.auth.signInWithPopup(facebookProvider).catch(e => alert("Facebook Login Error: " + e.message)),
    loginGuest: () => window.auth.signInAnonymously(),
    logout: async () => {
      await window.auth.signOut();
      sessionStorage.removeItem('fb_synced');
      location.reload();
    },
    updateUsername: async (rawUsername) => {
      if (!currentUser) return;
      if (!rawUsername || rawUsername.trim() === '') throw new Error("Username cannot be empty");
      
      const newUsername = rawUsername.toLowerCase().trim();
      const validRegex = /^[a-z0-9_]{3,15}$/;
      if (!validRegex.test(newUsername)) {
        throw new Error("Username must be 3-15 characters and can only contain lowercase letters, numbers, and underscores (no spaces or special symbols).");
      }
      
      // Check for uniqueness
      const snapshot = await window.db.collection("users").where("username", "==", newUsername).get();
      const isTaken = !snapshot.empty && snapshot.docs.some(doc => doc.id !== currentUser.uid);
      
      if (isTaken) {
        throw new Error("This username is already taken. Please choose another one.");
      }

      await window.db.collection("users").doc(currentUser.uid).set({
        username: newUsername
      }, { merge: true });
    },
    getUsername: async () => {
      if (!currentUser) return "Guest";
      const doc = await window.db.collection("users").doc(currentUser.uid).get();
      return (doc.exists && doc.data().username) ? doc.data().username : "Hunter";
    }
  };

})();
