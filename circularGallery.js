
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

      // Create Items
      this.displayItems = this.items;
      this.cards = [];
      this.spacing = 40; // Angle between items
      this.totalRange = this.displayItems.length * this.spacing;

      this.displayItems.forEach((item, i) => {
        const card = document.createElement('div');
        card.style.position = 'absolute';
        card.style.width = '350px';
        card.style.height = '450px';
        card.style.borderRadius = (this.options.borderRadius * 1000) + 'px';
        card.style.overflow = 'hidden';
        card.style.border = '1px solid rgba(255, 238, 0, 0.2)';
        card.style.backgroundColor = '#0f0e0b';
        card.style.userSelect = 'none';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
        card.style.pointerEvents = 'auto'; // Enable pointer events for hover

        const imgGroup = document.createElement('div');
        imgGroup.style.width = '100%';
        imgGroup.style.height = '85%';
        imgGroup.style.overflow = 'hidden';
        imgGroup.style.transition = 'transform 0.5s ease';
        card.appendChild(imgGroup);

        const img = document.createElement('img');
        img.src = item.image;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        img.style.filter = 'grayscale(20%)';
        img.style.transition = 'transform 0.5s ease, filter 0.5s ease';
        imgGroup.appendChild(img);

        card.addEventListener('mouseenter', () => {
          img.style.transform = 'scale(1.1)';
          img.style.filter = 'grayscale(0%)';
          card.style.borderColor = 'rgba(255, 238, 0, 0.6)';
          card.style.zIndex = '1000';
        });

        card.addEventListener('mouseleave', () => {
          img.style.transform = 'scale(1)';
          img.style.filter = 'grayscale(20%)';
          card.style.borderColor = 'rgba(255, 238, 0, 0.2)';
          card.style.zIndex = '1';
        });

        if (item.text) {
          const txt = document.createElement('div');
          txt.textContent = item.text;
          txt.style.height = '15%';
          txt.style.display = 'flex';
          txt.style.alignItems = 'center';
          txt.style.justifyContent = 'center';
          txt.style.font = this.options.font || 'bold 20px Courier Prime';
          txt.style.color = this.options.textColor || '#ffee00';
          txt.style.letterSpacing = '0.1em';
          txt.style.backgroundColor = 'rgba(0,0,0,0.4)';
          card.appendChild(txt);
        }

        this.wrapper.appendChild(card);
        this.cards.push({
          el: card,
          baseAngle: i * this.spacing
        });
      });

      this.addEventListeners();
      this.update();
    }

    addEventListeners() {
      this.container.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.targetRotation -= e.deltaY * 0.05 * this.scrollSpeed;
      }, { passive: false });

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

      this.cards.forEach((card) => {
        let totalAngle = card.baseAngle + this.rotation;
        
        // Infinite Loop Logic: Wrap angles into a visible range
        // We want to keep angles roughly centered around 0 for rendering
        totalAngle = ((totalAngle + this.totalRange / 2) % this.totalRange + this.totalRange) % this.totalRange - this.totalRange / 2;

        const rad = totalAngle * (Math.PI / 180);
        
        const x = Math.sin(rad) * radius;
        const z = (Math.cos(rad) - 1) * radius;
        const y = Math.abs(x) * (this.bend * 0.1);

        const rotY = totalAngle;
        const rotZ = totalAngle * (this.bend * 0.05);

        card.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        
        const distance = Math.abs(totalAngle);
        const opacity = Math.max(0, 1 - (distance / 90));
        card.el.style.opacity = opacity;
        card.el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      });

      requestAnimationFrame(this.update.bind(this));
    }
  }

  window.initCircularGallery = function(container, options) {
    return new CircularGalleryDOM(container, options);
  };
})();
