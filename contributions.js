// Contributions logic (localStorage-based)
(function() {
  function getCurrentUser() {
    try {
      const data = localStorage.getItem('courseApp_currentUser');
      return data ? JSON.parse(data) : null;
    } catch (_) {
      return null;
    }
  }

  function getUserContributions(uid) {
    const custom = JSON.parse(localStorage.getItem('customSubjects') || '[]');
    return custom.filter(s => s && s.createdBy === uid);
  }

  function getContributionSummary(uid) {
    const map = JSON.parse(localStorage.getItem('courseApp_contributions') || '{}');
    const entry = map[uid] || { count: 0, lastUpdated: null };
    return { count: entry.count || 0, lastUpdated: entry.lastUpdated || null };
  }

  function computeBadge(count) {
    if (count >= 20) return { tier: 'platinum', label: 'بلاتيني', icon: 'fa-crown', color: '#e5e4e2' };
    if (count >= 10) return { tier: 'gold', label: 'ذهبي', icon: 'fa-medal', color: '#ffd700' };
    if (count >= 5)  return { tier: 'silver', label: 'فضي', icon: 'fa-medal', color: '#c0c0c0' };
    if (count >= 1)  return { tier: 'bronze', label: 'برونزي', icon: 'fa-award', color: '#cd7f32' };
    return { tier: 'new', label: 'مبتدئ', icon: 'fa-user', color: '#94a3b8' };
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('ar-SA');
    } catch (_) {
      return '';
    }
  }

  // Expose to window
  window.Contrib = { getCurrentUser, getUserContributions, getContributionSummary, computeBadge, formatDate };
})();

