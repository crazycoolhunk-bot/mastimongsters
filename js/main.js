/**
 * Global UI Script & Page Bootstrapper
 * Manages responsive layouts, common header/footer logic,
 * and background neon paint splash generators.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  generatePaintSplashes();
  initGlobalPhysics();
  initActiveLinks();
});

/**
 * Mobile responsive drawer navigation toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isExpanded = navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isExpanded);
    toggle.innerHTML = isExpanded ? '✕' : '☰';
    
    // Disable scrolling when menu is active
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  });

  // Close menu on link clicks (useful for page transitions)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.innerHTML = '☰';
      document.body.style.overflow = '';
    });
  });
}

/**
 * Generates organic SVG neon paint splatters in the background
 */
function generatePaintSplashes() {
  const container = document.createElement('div');
  container.className = 'ambient-bg';
  
  // Create 3 blur glow orbs (defined in css)
  const colors = ['green', 'pink', 'blue'];
  colors.forEach(col => {
    const orb = document.createElement('div');
    orb.className = `glow-orb ${col}`;
    container.appendChild(orb);
  });

  // SVG paint splash path library
  const splatterPaths = [
    "M25,-5 C35,15 50,-10 65,10 C80,30 90,60 70,80 C50,100 20,95 5,80 C-10,65 -5,35 5,10 C15,-15 15,-25 25,-5 Z", // blob 1
    "M30,10 C45,15 55,5 70,20 C85,35 80,65 65,85 C50,105 10,95 5,70 C0,45 10,25 20,5 C30,-15 15,5 30,10 Z",  // blob 2
    "M40,20 C50,20 65,10 75,25 C85,40 70,70 55,80 C40,90 20,85 10,65 C0,45 5,30 15,15 C25,0 30,20 40,20 Z"    // blob 3
  ];

  const splashColors = [
    'var(--neon-green)',
    'var(--neon-pink)',
    'var(--electric-blue)',
    'var(--vivid-yellow)'
  ];

  // Number of splatters to spawn (fewer on mobile for performance)
  const isMobile = window.innerWidth <= 768;
  const count = isMobile ? 3 : 6;

  for (let i = 0; i < count; i++) {
    const splash = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    splash.setAttribute("viewBox", "0 0 100 100");
    splash.setAttribute("class", "paint-splash");
    
    // Random styling & layout
    const pathIndex = Math.floor(Math.random() * splatterPaths.length);
    const color = splashColors[i % splashColors.length];
    const size = isMobile ? (60 + Math.random() * 80) : (120 + Math.random() * 180);
    
    splash.style.width = `${size}px`;
    splash.style.height = `${size}px`;
    splash.style.color = color;
    
    // Position randomly in viewport
    splash.style.left = `${Math.random() * 90}%`;
    splash.style.top = `${Math.random() * 85}%`;
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", splatterPaths[pathIndex]);
    splash.appendChild(path);
    container.appendChild(splash);
  }

  document.body.prepend(container);

  // Register background paint splashes to float weightlessly
  const splats = container.querySelectorAll('.paint-splash');
  splats.forEach(splat => {
    window.AntiGravity.register(splat, {
      mode: 'local',
      driftRadius: 50,
      speed: 0.05 + Math.random() * 0.05,
      repulsionStrength: 0.15
    });
  });
}

/**
 * Initializes generic gravity items like header logo widgets or CTA buttons
 */
function initGlobalPhysics() {
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    window.AntiGravity.register(navCta, {
      mode: 'local',
      driftRadius: 10,
      speed: 0.3,
      repulsionStrength: 0.2
    });
  }

  // Floating pages subtitles
  const subtitle = document.querySelector('.page-subtitle');
  if (subtitle) {
    window.AntiGravity.register(subtitle, {
      mode: 'local',
      driftRadius: 15,
      speed: 0.1,
      repulsionStrength: 0.1
    });
  }
}

/**
 * Highlight active page navigation link
 */
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Common Header and Footer Loader
 * Facilitates code reuse across all pages.
 */
function createSharedComponents(activePageName) {
  // Navigation structure template
  const headerHTML = `
    <div class="nav-container">
      <a href="index.html" class="logo-link">
        <div class="logo-icon">
          <img src="assets/logo.png" alt="Masti Mongsters Logo">
        </div>
        <div class="logo-text">Masti <span>Mongsters</span></div>
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-label="Toggle navigation">☰</button>
      <ul class="nav-links">
        <li><a href="index.html" class="${activePageName === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="about.html" class="${activePageName === 'about' ? 'active' : ''}">About Us</a></li>
        <li><a href="members.html" class="${activePageName === 'members' ? 'active' : ''}">Members</a></li>
        <li><a href="gallery.html" class="${activePageName === 'gallery' ? 'active' : ''}">Gallery</a></li>
        <li><a href="rules.html" class="${activePageName === 'rules' ? 'active' : ''}">Rules</a></li>
        <li><a href="contact.html" class="nav-cta ${activePageName === 'contact' ? 'active' : ''}">Join Us</a></li>
      </ul>
    </div>
  `;

  // Footer template
  const footerHTML = `
    <div class="footer-content">
      <div class="footer-logo">
        <div class="logo-link" style="padding: 0;">
          <div class="logo-icon" style="width: 44px; height: 44px; box-shadow: none; border-radius: 50%; background: transparent;">
            <img src="assets/logo.png" alt="Masti Mongsters Logo">
          </div>
          <div class="logo-text" style="font-size: 1.6rem; letter-spacing: -1px;">Masti <span style="color: var(--neon-green);">Mongsters</span></div>
        </div>
        <p>© 2026 Masti Mongsters. Built on weightless physics.</p>
      </div>
      <div class="footer-socials">
        <a href="#" aria-label="WhatsApp Group Link">💬</a>
        <a href="#" aria-label="Instagram">📸</a>
        <a href="#" aria-label="Telegram">✈️</a>
        <a href="#" aria-label="YouTube">▶️</a>
      </div>
    </div>
  `;

  const headerEl = document.querySelector('header');
  const footerEl = document.querySelector('footer');

  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;
}

window.createSharedComponents = createSharedComponents;
