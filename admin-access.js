// Adds Admin link for authorized users (compat SDK)
(function(){
  const appReady = typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;
  const db = appReady ? (window.db || firebase.firestore()) : null;
  const auth = appReady ? (window.auth || firebase.auth()) : null;
  const UID_WHITELIST = ['c3qEzVVU52NddP2LmNQXAldCZ5C2'];

  async function isAdmin(uid) {
    if (!uid || !db) return false;
    if (UID_WHITELIST.includes(uid)) return true;
    try {
      const doc = await db.collection('admins').doc(uid).get();
      return doc.exists === true;
    } catch { return false; }
  }

  function showLinks() {
    document.querySelectorAll('[data-admin-link]')
      .forEach(el => el.classList.remove('hidden'));
  }

  function hideLinks() {
    document.querySelectorAll('[data-admin-link]')
      .forEach(el => el.classList.add('hidden'));
  }

  function init() {
    if (!auth) return; // no-op on pages without Firebase
    hideLinks();
    auth.onAuthStateChanged(async (user) => {
      if (!user) { hideLinks(); return; }
      const ok = await isAdmin(user.uid);
      if (ok) showLinks(); else hideLinks();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
