
(function() {
  class CircularGalleryDOM {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.items = options.items || [];
      this.scrollSpeed = options.scrollSpeed || 2.5;
      this.ease = options.scrollEase || 0.1;
      this.bend = options.bend || 3;
      
      this.rotation = 0;
      this.targetRotation = 0;
      this.isDown = false;
      this.startX = 0;
      
      this.init();
    }

    init() {
      // Setup Container
      this.container.innerHTML = '';
      this.container.style.display = 'flex';
      this.container.style.alignItems = 'center';
      this.container.style.justifyContent = 'center';
      this.container.style.perspective = '1500px';
      this.container.style.overflow = 'hidden';
      this.container.style.cursor = 'grab';

      // Setup Wrapper
      this.wrapper = document.createElement('div');
      this.wrapper.style.position = 'relative';
      this.wrapper.style.width = '200%';
      this.wrapper.style.height = '100%';
      this.wrapper.style.transformStyle = 'preserve-3d';
      this.wrapper.style.display = 'flex';
      this.wrapper.style.alignItems = 'center';
      this.wrapper.style.justifyContent = 'center';
      this.container.appendChild(this.wrapper);

      // Create Items (Multiply for infinite loop feel)
      this.displayItems = [...this.items, ...this.items, ...this.items];
      this.cards = [];

      const radius = 800; // Curve radius
      const spacing = 35; // Angle between items

      this.displayItems.forEach((item, i) => {
        const card = document.createElement('div');
        card.style.position = 'absolute';
        card.style.width = '350px';
        card.style.height = '450px';
        card.style.borderRadius = (this.options.borderRadius * 1000) + 'px';
        card.style.overflow = 'hidden';
        card.style.border = '1px solid rgba(200,133,42,0.2)';
        card.style.backgroundColor = '#0f0e0b';
        card.style.userSelect = 'none';
        card.style.pointerEvents = 'none'; // Keep drag smooth

        // Image
        const img = document.createElement('img');
        img.src = item.image;
        img.style.width = '100%';
        img.style.height = '85%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        img.style.filter = 'grayscale(20%)';
        card.appendChild(img);

        // Text
        if (item.text) {
          const txt = document.createElement('div');
          txt.textContent = item.text;
          txt.style.height = '15%';
          txt.style.display = 'flex';
          txt.style.alignItems = 'center';
          txt.style.justifyContent = 'center';
          txt.style.font = this.options.font || 'bold 20px Courier Prime';
          txt.style.color = this.options.textColor || '#c8852a';
          txt.style.letterSpacing = '0.1em';
          txt.style.backgroundColor = 'rgba(0,0,0,0.4)';
          card.appendChild(txt);
        }

        this.wrapper.appendChild(card);
        this.cards.push({
          el: card,
          baseAngle: (i - Math.floor(this.displayItems.length / 2)) * spacing
        });
      });

      this.addEventListeners();
      this.update();
    }

    addEventListeners() {
      // Wheel
      this.container.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.targetRotation -= e.deltaY * 0.05 * this.scrollSpeed;
      }, { passive: false });

      // Drag
      this.container.addEventListener('mousedown', (e) => {
        this.isDown = true;
        this.container.style.cursor = 'grabbing';
        this.startX = e.clientX;
        this.startRot = this.targetRotation;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDown) return;
        const delta = (e.clientX - this.startX) * 0.1 * this.scrollSpeed;
        this.targetRotation = this.startRot + delta;
      });

      window.addEventListener('mouseup', () => {
        this.isDown = false;
        this.container.style.cursor = 'grab';
      });

      // Touch
      this.container.addEventListener('touchstart', (e) => {
        this.isDown = true;
        this.startX = e.touches[0].clientX;
        this.startRot = this.targetRotation;
      });

      window.addEventListener('touchmove', (e) => {
        if (!this.isDown) return;
        const delta = (e.touches[0].clientX - this.startX) * 0.1 * this.scrollSpeed;
        this.targetRotation = this.startRot + delta;
      });

      window.addEventListener('touchend', () => {
        this.isDown = false;
      });
    }

    update() {
      this.rotation += (this.targetRotation - this.rotation) * this.ease;

      const radius = 700;
      const bendFactor = this.bend * 15;

      this.cards.forEach((card) => {
        const totalAngle = card.baseAngle + this.rotation;
        const rad = totalAngle * (Math.PI / 180);
        
        // Calculate position on an arch
        const x = Math.sin(rad) * radius;
        const z = (Math.cos(rad) - 1) * radius;
        const y = Math.abs(x) * (this.bend * 0.1); // Add the arch lift

        // Smooth rotation to face viewer
        const rotY = totalAngle;
        const rotZ = totalAngle * (this.bend * 0.05);

        card.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        
        // Dynamic opacity based on distance from center
        const distance = Math.abs(totalAngle);
        const opacity = Math.max(0, 1 - (distance / 90));
        card.el.style.opacity = opacity;
        card.el.style.visibility = opacity > 0 ? 'visible' : 'hidden';
      });

      requestAnimationFrame(this.update.bind(this));
    }
  }

  window.initCircularGallery = function(container, options) {
    return new CircularGalleryDOM(container, options);
  };
})();
