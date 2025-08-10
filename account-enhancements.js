/*
 * Enhancements for the AccountManager to display contributions from
 * Firebase and localStorage. This script monkey‑patches the existing
 * `loadMyCourses` method to also fetch the count of courses added by
 * the current user in the Firestore collection (if Firebase is
 * available on the page). The count is displayed in an element with
 * id `total-firebase`. The original functionality remains intact.
 */

(() => {
  // Ensure AccountManager exists before patching
  if (typeof AccountManager === 'undefined') return;
  const originalLoad = AccountManager.prototype.loadMyCourses;
  AccountManager.prototype.loadMyCourses = async function(username) {
    // Call original implementation to handle localStorage display
    originalLoad.call(this, username);
    try {
      let firebaseCount = 0;
      // If a Firestore collection is available, query for documents added by the user
      if (window.coursesCollection && typeof window.coursesCollection.where === 'function') {
        const snapshot = await window.coursesCollection.where('addedBy', '==', username).get();
        firebaseCount = snapshot.size;
      }
      const firebaseEl = document.getElementById('total-firebase');
      if (firebaseEl) {
        firebaseEl.textContent = firebaseCount;
      }
    } catch (err) {
      console.warn('Failed to fetch Firebase contributions:', err);
    }
  };
})();
