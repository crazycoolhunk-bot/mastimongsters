/**
 * Gallery Interactive Float Wall & Lightbox Handler
 * Seeding photo cards, managing boundary drifts in "free" physics mode,
 * and initializing the lightbox modal popup.
 */

const GALLERY_DATA = [
  {
    id: 1,
    title: "Pondicherry road Trip",
    tag: "Meetup",
    date: "Oct 2012",
    imageUrl: "assets/gallery/pondy.jpg"
  },
  {
    id: 2,
    title: "Austin, Tx Meet up",
    tag: "Admin",
    date: "Uploaded in March 2015",
    imageUrl: "assets/gallery/austin.jpg"
  },
  {
    id: 3,
    title: "The WhatsApp Admin Meet",
    tag: "Chat Screenshot",
    date: "April 2025",
    bg: "linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)",
    svgSymbol: `
      <rect x="25" y="20" width="50" height="60" rx="6" fill="none" stroke="#fff" stroke-width="2"/>
      <line x1="32" y1="35" x2="68" y2="35" stroke="#fff" stroke-width="2" opacity="0.6"/>
      <line x1="32" y1="48" x2="58" y2="48" stroke="#fff" stroke-width="2" opacity="0.6"/>
      <circle cx="35" cy="62" r="4" fill="#25D366"/>
      <line x1="45" y1="62" x2="62" y2="62" stroke="#fff" stroke-width="2" opacity="0.6"/>
    `
  },
  {
    id: 4,
    title: "Late Night Chai Gathering",
    tag: "Meetup",
    date: "June 2025",
    bg: "linear-gradient(135deg, #ffe600 0%, #ff007f 100%)",
    svgSymbol: `
      <path d="M30,70 L70,70 A20,20 0 0,0 70,30 L30,30 Z" fill="none" stroke="#fff" stroke-width="2.5"/>
      <path d="M70,40 A8,8 0 0,1 70,60" fill="none" stroke="#fff" stroke-width="2.5"/>
      <path d="M40,22 Q45,12 43,5 M50,22 Q55,12 53,5 M60,22 Q65,12 63,5" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    `
  },
  {
    id: 5,
    title: "Sticker Spam Escalation",
    tag: "Meme",
    date: "August 2025",
    bg: "linear-gradient(135deg, #8a2be2 0%, #39ff14 100%)",
    svgSymbol: `
      <text x="35%" y="45%" font-size="28" text-anchor="middle">👽</text>
      <text x="65%" y="45%" font-size="28" text-anchor="middle">👾</text>
      <text x="50%" y="75%" font-size="32" text-anchor="middle">💥</text>
    `
  },
  {
    id: 6,
    title: "Annual Mongsters Gala",
    tag: "Meetup",
    date: "October 2025",
    bg: "linear-gradient(135deg, #00e5ff 0%, #ff4500 100%)",
    svgSymbol: `
      <polygon points="50,15 15,80 85,80" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.3"/>
      <circle cx="50" cy="50" r="12" fill="#fff" opacity="0.4"/>
      <line x1="50" y1="15" x2="50" y2="80" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 2"/>
    `
  },
  {
    id: 7,
    title: "Sunday Football Showdown",
    tag: "Meetup",
    date: "January 2026",
    bg: "linear-gradient(135deg, #ff007f 0%, #00e5ff 100%)",
    svgSymbol: `
      <circle cx="50" cy="50" r="25" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M35,35 L65,65 M35,65 L65,35 M50,25 L50,75 M25,50 L75,50" fill="none" stroke="#fff" stroke-width="1" opacity="0.5"/>
      <circle cx="50" cy="50" r="6" fill="#fff"/>
    `
  },
  {
    id: 8,
    title: "The Unread Messages Record",
    tag: "Chat Screenshot",
    date: "March 2026",
    bg: "linear-gradient(135deg, #ffe600 0%, #39ff14 100%)",
    svgSymbol: `
      <rect x="20" y="30" width="60" height="40" rx="20" fill="var(--neon-pink)" opacity="0.9"/>
      <text x="50%" y="55%" fill="#000" font-family="var(--font-display)" font-size="18" font-weight="800" text-anchor="middle" dominant-baseline="middle">999+ Msg</text>
    `
  }
];

class InteractiveGallery {
  constructor() {
    this.container = document.getElementById('gallery-canvas');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxClose = document.getElementById('lightbox-close');
    
    this.initGallery();
    this.initLightbox();
  }

  initGallery() {
    if (!this.container) return;

    const parentRect = this.container.getBoundingClientRect();
    
    GALLERY_DATA.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.setAttribute('data-id', item.id);
      
      // Calculate layout coordinates (scatter them nicely across the box)
      const isMobile = window.innerWidth <= 768;
      const cols = isMobile ? 2 : 4;
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // Create starting coordinates inside the grid cells
      const cellWidth = parentRect.width / cols;
      const cellHeight = parentRect.height / (GALLERY_DATA.length / cols);
      
      const itemWidth = 220;
      const itemHeight = 165;
      
      // Offset start coordinates
      const startX = col * cellWidth + (cellWidth - itemWidth) / 2 + (Math.random() - 0.5) * 40;
      const startY = row * cellHeight + (cellHeight - itemHeight) / 2 + (Math.random() - 0.5) * 40;

      // Inside card media representation (custom vector or image design)
      const mediaHTML = item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<svg viewBox="0 0 100 100" style="width: 50%; height: 50%;">
            ${item.svgSymbol}
          </svg>`;
      const itemBg = item.imageUrl ? 'transparent' : item.bg;

      el.innerHTML = `
        <div style="width: 100%; height: 100%; background: ${itemBg}; display: flex; align-items: center; justify-content: center; position: relative;">
          ${mediaHTML}
        </div>
        <div class="gallery-item-info">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-tag">${item.tag} • ${item.date}</div>
        </div>
      `;

      // Assign position
      el.style.left = '0px';
      el.style.top = '0px';

      this.container.appendChild(el);

      // Register with physics engine (free float mode, boundaries container is #gallery-canvas)
      window.AntiGravity.register(el, {
        mode: 'free',
        container: this.container,
        speed: 0.12 + Math.random() * 0.18,
        bounce: 0.9,
        friction: 0.98,
        repulsionStrength: 0.55
      });
      
      // Manually set initial coordinates in registered state
      const physicsItem = window.AntiGravity.elements.find(x => x.el === el);
      if (physicsItem) {
        physicsItem.x = Math.max(0, Math.min(parentRect.width - itemWidth, startX));
        physicsItem.y = Math.max(0, Math.min(parentRect.height - itemHeight, startY));
        // Add minor initial speed drift
        physicsItem.vx = (Math.random() - 0.5) * 0.8;
        physicsItem.vy = (Math.random() - 0.5) * 0.8;
      }

      // Open lightbox on tap/click
      el.addEventListener('click', (e) => {
        // Prevent click trigger if dragged
        if (physicsItem && Math.abs(physicsItem.vx) > 1.5 || Math.abs(physicsItem.vy) > 1.5) {
          return;
        }
        this.openLightbox(item);
      });
    });
  }

  initLightbox() {
    if (!this.lightbox || !this.lightboxClose) return;

    this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    
    // Close on clicking backdrop
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.closeLightbox();
      }
    });
  }

  openLightbox(item) {
    if (!this.lightbox || !this.lightboxImg || !this.lightboxCaption) return;

    // Create an inline SVG or image representation in the lightbox
    const mediaHTML = item.imageUrl
      ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 16px;">`
      : `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%; display: block;">
          ${item.svgSymbol}
        </svg>`;
    const containerBg = item.imageUrl ? 'transparent' : item.bg;

    // Rather than an image source, insert the media container dynamically
    const container = document.createElement('div');
    container.className = 'lightbox-media-container';
    container.style.width = '350px';
    container.style.height = '350px';
    container.style.maxWidth = '100%';
    container.style.borderRadius = '16px';
    container.style.background = containerBg;
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.boxShadow = '0 20px 50px rgba(0,0,0,0.8)';
    container.style.border = item.imageUrl ? 'none' : '2px solid rgba(255,255,255,0.1)';
    container.innerHTML = mediaHTML;

    // Replace or insert inside lightbox-content
    const existing = this.lightbox.querySelector('.lightbox-media-container');
    if (existing) {
      existing.remove();
    }
    
    this.lightboxImg.style.display = 'none'; // hide generic image element
    this.lightboxImg.parentElement.insertBefore(container, this.lightboxImg);

    this.lightboxCaption.innerHTML = `<strong>${item.title}</strong><br><span style="font-size:0.9rem; color:#777;">${item.tag} • ${item.date}</span>`;
    this.lightbox.classList.add('active');
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gallery-canvas')) {
    window.GalleryWall = new InteractiveGallery();
  }
});
