/*
 * Easter Egg script to unlock hidden games.
 *
 * Listens for sequences of key presses on any page to unlock different games:
 * - Type 'games' to go to Games Hub (all games)
 * - Type 'tictac' to go to Tic Tac Toe
 * - Type 'dots' to go to Dot Collector Game  
 * - Type 'break' to go to Breakout Game
 * This provides fun secrets for users who explore the site.
 */

(() => {
  const secrets = {
    'games': 'games-hub.html',
    'tictac': 'hidden-games.html',
    'dots': 'snake-game.html',
    'break': 'breakout-game.html'
  };
  
  let buffer = [];
  let searchInput = null;
  
  // Function to check for secret codes
  function checkSecrets(text) {
    const sortedSecrets = Object.entries(secrets).sort((a, b) => b[0].length - a[0].length);
    
    for (const [secret, page] of sortedSecrets) {
      if (text.toLowerCase().includes(secret)) {
        // Clear search if it's from search box
        if (searchInput && searchInput.value.toLowerCase() === secret) {
          searchInput.value = '';
          // Hide search results
          const searchResults = document.getElementById('search-results');
          if (searchResults) {
            searchResults.classList.add('hidden');
          }
        }
        // Reset buffer
        buffer = [];
        // Navigate to game page
        window.location.href = page;
        return true;
      }
    }
    return false;
  }
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    searchInput = document.getElementById('courseSearch');
    
    // Monitor search input for secret codes
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase().trim();
        if (value && checkSecrets(value)) {
          e.preventDefault();
          return;
        }
      });
      
      // Also check on Enter key
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const value = e.target.value.toLowerCase().trim();
          if (value && checkSecrets(value)) {
            e.preventDefault();
          }
        }
      });
    }
  });
  
  // Original keyup listener for typing anywhere else
  document.addEventListener('keyup', (e) => {
    // Skip if typing in input fields (except our search)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Append current key to buffer
    buffer.push(e.key.toLowerCase());
    
    // Keep only last 10 characters to avoid memory issues
    if (buffer.length > 10) buffer.shift();
    
    // Check buffer for secrets
    const bufferText = buffer.join('');
    checkSecrets(bufferText);
  });
})();
