/**
 * Anti Gravity Physics Engine - High-Performance 2D Vector Physics
 * Specialized for floating weightless UI components, boundary collisions,
 * cursor repulsion, and touch/drag momentum throwing.
 */

class AntiGravityEngine {
  constructor() {
    this.elements = [];
    this.mouse = { x: 0, y: 0, px: 0, py: 0, isActive: false, radius: 150 };
    this.isMobile = window.innerWidth <= 768;
    this.animationFrameId = null;
    this.activeDragItem = null;
    
    // Bind event handlers
    this.handleStartDrag = this.handleStartDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleEndDrag = this.handleEndDrag.bind(this);
    this.loop = this.loop.bind(this);
    
    this.initEvents();
  }

  initEvents() {
    // Mouse / Touch movement tracking
    const updatePointer = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      this.mouse.px = this.mouse.x;
      this.mouse.py = this.mouse.y;
      this.mouse.x = clientX;
      this.mouse.y = clientY;
      this.mouse.isActive = true;
    };

    window.addEventListener('mousemove', updatePointer, { passive: true });
    window.addEventListener('touchmove', updatePointer, { passive: true });

    window.addEventListener('mouseleave', () => { this.mouse.isActive = false; });
    window.addEventListener('touchend', () => { this.mouse.isActive = false; });

    // Drag handlers
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('touchmove', this.handleDrag, { passive: false });
    window.addEventListener('mouseup', this.handleEndDrag);
    window.addEventListener('touchend', this.handleEndDrag);

    // Resize event
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.elements.forEach(item => this.recalculateBoundaries(item));
    });
  }

  /**
   * Register an element to float.
   * @param {HTMLElement} el - The DOM element
   * @param {Object} options - Configuration options
   */
  register(el, options = {}) {
    if (!el) return;

    // Set element initial style to prevent jerky jumping
    el.style.willChange = 'transform';

    const rect = el.getBoundingClientRect();
    const parent = el.offsetParent || document.body;
    const parentRect = parent.getBoundingClientRect();

    const defaults = {
      mode: 'local', // 'local' (float around origin) or 'free' (float inside container)
      driftRadius: this.isMobile ? 20 : 35, // float boundary for local mode
      speed: 0.15 + Math.random() * 0.15, // float speed scaling factor
      friction: 0.96, // speed dampening
      repulsionStrength: 0.4, // cursor push factor
      bounce: 0.85, // energy retention on hitting boundaries
      container: parent, // for 'free' mode
      angle: Math.random() * Math.PI * 2, // initial direction
      rotSpeed: (Math.random() - 0.5) * 0.2, // rotation speed
    };

    const config = { ...defaults, ...options };
    
    // Calculate coordinates
    let x = 0;
    let y = 0;
    
    if (config.mode === 'free') {
      // For free floaters, set random initial position inside the container
      const limitX = parentRect.width - rect.width;
      const limitY = parentRect.height - rect.height;
      x = Math.random() * limitX;
      y = Math.random() * limitY;
    }

    const item = {
      el,
      mode: config.mode,
      container: config.container,
      driftRadius: config.driftRadius,
      speed: config.speed,
      friction: config.friction,
      repulsionStrength: config.repulsionStrength,
      bounce: config.bounce,
      rotSpeed: config.rotSpeed,
      
      // Physics state vectors
      x: x, 
      y: y,
      vx: (Math.random() - 0.5) * config.speed * 4,
      vy: (Math.random() - 0.5) * config.speed * 4,
      
      // Home anchor coordinates (local mode)
      homeX: 0,
      homeY: 0,
      
      // Rotational state
      rotation: (Math.random() - 0.5) * 4, // degrees
      vrot: 0,
      
      // Dimensions
      width: rect.width,
      height: rect.height,
      
      // Noise phase for smooth organic drift
      phaseX: Math.random() * 100,
      phaseY: Math.random() * 100,
      
      // Interaction state
      isDragged: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      dragHistory: []
    };

    // Attach local mousedown/touchstart for drag and toss controls
    el.addEventListener('mousedown', (e) => this.handleStartDrag(e, item));
    el.addEventListener('touchstart', (e) => this.handleStartDrag(e, item), { passive: true });

    this.elements.push(item);
    this.recalculateBoundaries(item);

    // Auto-start loop if not running
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  recalculateBoundaries(item) {
    const rect = item.el.getBoundingClientRect();
    item.width = rect.width;
    item.height = rect.height;
    
    if (item.mode === 'free') {
      const containerRect = item.container.getBoundingClientRect();
      item.maxX = containerRect.width - item.width;
      item.maxY = containerRect.height - item.height;
    }
  }

  handleStartDrag(e, item) {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input')) {
      // Do not hijack standard clickables
      return;
    }
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Get actual current element offset
    const elRect = item.el.getBoundingClientRect();
    
    item.isDragged = true;
    item.dragOffsetX = clientX - elRect.left;
    item.dragOffsetY = clientY - elRect.top;
    item.dragHistory = [{ x: clientX, y: clientY, t: Date.now() }];
    
    this.activeDragItem = item;
    item.el.style.cursor = 'grabbing';
    item.el.style.zIndex = '100';
  }

  handleDrag(e) {
    const item = this.activeDragItem;
    if (!item || !item.isDragged) return;

    // Prevent default if it's a touch gesture to prevent scrolling while dragging physics object
    if (e.cancelable && e.touches) {
      e.preventDefault();
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate position relative to container
    const parentRect = item.el.parentElement.getBoundingClientRect();
    const newX = clientX - parentRect.left - item.dragOffsetX;
    const newY = clientY - parentRect.top - item.dragOffsetY;

    // Track movement history for tossing velocity calculations
    item.dragHistory.push({ x: clientX, y: clientY, t: Date.now() });
    if (item.dragHistory.length > 5) item.dragHistory.shift();

    item.x = newX;
    item.y = newY;
    item.vx = 0;
    item.vy = 0;
  }

  handleEndDrag() {
    const item = this.activeDragItem;
    if (!item) return;

    item.isDragged = false;
    item.el.style.cursor = 'grab';
    item.el.style.zIndex = '';

    // Calculate tossing velocity based on historical coordinates
    if (item.dragHistory.length >= 2) {
      const first = item.dragHistory[0];
      const last = item.dragHistory[item.dragHistory.length - 1];
      const dt = last.t - first.t;
      
      if (dt > 10) {
        // Tossing speed scale
        const scale = 0.85;
        item.vx = ((last.x - first.x) / dt) * 16.6 * scale;
        item.vy = ((last.y - first.y) / dt) * 16.6 * scale;
        
        // Dynamic rotational spin based on push direction
        item.vrot = (last.x - first.x) * 0.15;
      }
    }

    this.activeDragItem = null;
  }

  loop() {
    // Run physics update step
    this.update();
    
    // Run browser paint step
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  update() {
    const time = Date.now() * 0.001;

    for (let i = 0; i < this.elements.length; i++) {
      const item = this.elements[i];
      if (item.isDragged) continue;

      // 1. Organic Weightless Drift (Sine/Cosine simulation of noise)
      item.phaseX += item.speed * 0.05;
      item.phaseY += item.speed * 0.06;
      
      let driftX = Math.sin(item.phaseX) * 0.03;
      let driftY = Math.cos(item.phaseY) * 0.03;
      
      item.vx += driftX;
      item.vy += driftY;

      // 2. Cursor Repulsion Force (Push items away if cursor gets close)
      if (this.mouse.isActive) {
        // Get absolute center of the element
        const rect = item.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = centerX - this.mouse.x;
        const dy = centerY - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius && dist > 10) {
          // Linear power falloff
          const force = (1 - dist / this.mouse.radius) * item.repulsionStrength;
          const forceX = (dx / dist) * force * 1.5;
          const forceY = (dy / dist) * force * 1.5;
          
          item.vx += forceX;
          item.vy += forceY;
          item.vrot += forceX * 0.8;
        }
      }

      // Apply drag friction (dampening)
      item.vx *= item.friction;
      item.vy *= item.friction;
      item.vrot *= 0.95;

      // Update position
      item.x += item.vx;
      item.y += item.vy;
      
      // Update rotation
      item.rotation += item.vrot;
      // Add natural gentle rotation oscillation
      item.rotation += Math.sin(item.phaseX * 0.3) * item.rotSpeed * 0.1;

      // 3. Boundary Collisions
      if (item.mode === 'local') {
        // Local mode: float and bounce inside a bubble around the starting point (0, 0)
        const distFromHome = Math.sqrt(item.x * item.x + item.y * item.y);
        if (distFromHome > item.driftRadius) {
          // Push back toward home
          const returnForce = 0.06;
          item.vx -= (item.x / distFromHome) * returnForce;
          item.vy -= (item.y / distFromHome) * returnForce;
          
          // Speed limit
          item.vx *= 0.9;
          item.vy *= 0.9;
        }
      } else if (item.mode === 'free') {
        // Free mode: bounce off the container box walls
        if (item.x < 0) {
          item.x = 0;
          item.vx = -item.vx * item.bounce;
          item.vrot = -item.vrot * 0.5;
        } else if (item.x > item.maxX) {
          item.x = item.maxX;
          item.vx = -item.vx * item.bounce;
          item.vrot = -item.vrot * 0.5;
        }

        if (item.y < 0) {
          item.y = 0;
          item.vy = -item.vy * item.bounce;
          item.vrot = -item.vrot * 0.5;
        } else if (item.y > item.maxY) {
          item.y = item.maxY;
          item.vy = -item.vy * item.bounce;
          item.vrot = -item.vrot * 0.5;
        }
      }
    }
  }

  render() {
    for (let i = 0; i < this.elements.length; i++) {
      const item = this.elements[i];
      // Limit rotation degrees to avoid massive numbers
      const angle = item.rotation % 360;
      
      // Apply GPU accelerated translate3d & rotate
      item.el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0px) rotate(${angle.toFixed(2)}deg)`;
    }
  }

  /**
   * Reset coordinate system when content is searched/filtered in directories
   */
  resetHome(el) {
    const item = this.elements.find(x => x.el === el);
    if (item) {
      item.x = 0;
      item.y = 0;
      item.vx = 0;
      item.vy = 0;
      item.rotation = 0;
      item.vrot = 0;
      this.recalculateBoundaries(item);
    }
  }

  /**
   * Unregister an element to stop tracking it
   */
  unregister(el) {
    const index = this.elements.findIndex(x => x.el === el);
    if (index !== -1) {
      this.elements[index].el.style.transform = '';
      this.elements.splice(index, 1);
    }
  }

  /**
   * Unregister all elements
   */
  clear() {
    this.elements.forEach(item => {
      item.el.style.transform = '';
    });
    this.elements = [];
  }
}

// Export single shared engine instance to the window global scope
window.AntiGravity = new AntiGravityEngine();
