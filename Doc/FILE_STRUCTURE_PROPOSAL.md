# File Structure Proposal

This repo currently keeps most HTML/CSS/JS at the root. To simplify maintenance and asset discovery, I propose the following non-breaking reorganization (only paths change; all references will be updated accordingly):

Proposed layout:

- `index.html`, `sitemap.xml`, `robots.txt`, `manifest.json`
- `pages/`
  - `contributions.html` (moved from root)
  - `account.html`, `profile.html`, `auth.html`, `register.html`, `login.html`
  - other feature/demo pages (e.g., `business.html`, `health.html`, tests)
- `assets/js/`
  - `script.js`, `auth.js`, `account-manager.js`, `language-toggle.js`, `contributions.js`, `easter-egg.js`
- `assets/css/`
  - `styles.css`, `account-enhanced.css`, `account-styles.css`, `verification-styles.css`
- `data/`
  - `course_data.json`
- `docs/` (alias of `Doc/`) – keep current content but optional rename
  - existing guides and readme files
- `static/`
  - `BingSiteAuth.xml`, `google*.html` and similar verification files

Notes:

- After moving, update all `<script src>`, `<link href>`, and internal links across pages to match new paths.
- Keep Firebase and Tailwind CDNs as-is; no build step required.
- We can do this in one commit to make diffs and rollbacks easy.

If approved, I can execute the moves and update references safely.

