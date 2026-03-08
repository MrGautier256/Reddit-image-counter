(function () {
  const POLL_INTERVAL = 500;

  const DEFAULTS = {
    size: 'medium',
    opacity: 75,
    position: 'top-right',
    visible: true,
  };

  const SIZE_MAP = {
    small: { fontSize: '11px', padding: '3px 8px', borderRadius: '10px' },
    medium: { fontSize: '14px', padding: '4px 12px', borderRadius: '14px' },
    large: { fontSize: '18px', padding: '6px 16px', borderRadius: '18px' },
  };

  const POS_MAP = {
    'top-right': { top: '12px', right: '12px', bottom: 'auto', left: 'auto' },
    'top-left': { top: '12px', left: '12px', bottom: 'auto', right: 'auto' },
    'bottom-right': { bottom: '12px', right: '12px', top: 'auto', left: 'auto' },
    'bottom-left': { bottom: '12px', left: '12px', top: 'auto', right: 'auto' },
  };

  let settings = { ...DEFAULTS };

  chrome.storage.sync.get({ imgCounterSettings: DEFAULTS }, (data) => {
    settings = data.imgCounterSettings;
    processGalleryCarousels();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.imgCounterSettings) {
      settings = changes.imgCounterSettings.newValue;
      processGalleryCarousels();
    }
  });

  function applyStyle(counter) {
    const s = SIZE_MAP[settings.size];
    const p = POS_MAP[settings.position];
    const bg = `rgba(0,0,0,${settings.opacity / 100})`;

    Object.assign(counter.style, {
      position: 'absolute',
      zIndex: '10000',
      pointerEvents: 'none',
      fontWeight: '700',
      color: '#fff',
      whiteSpace: 'nowrap',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: bg,
      display: settings.visible ? 'block' : 'none',
      ...s,
      ...p,
    });
  }

  function processGalleryCarousels() {
    const galleries = document.querySelectorAll('gallery-carousel');

    galleries.forEach((gallery) => {
      const galleryShadow = gallery.shadowRoot;
      if (!galleryShadow) return;

      const faceplateCarousel = galleryShadow.querySelector('faceplate-carousel');
      if (!faceplateCarousel) return;

      const fcShadow = faceplateCarousel.shadowRoot;
      if (!fcShadow) return;

      const pagination = fcShadow.querySelector('faceplate-pagination-indicator');
      if (!pagination) return;

      const pages = parseInt(pagination.getAttribute('pages'), 10);
      const pageIndex = parseInt(pagination.getAttribute('page-index'), 10);

      if (!pages || pages <= 1) return;

      const current = pageIndex + 1;

      let counter = galleryShadow.querySelector('.reddit-img-counter');
      if (!counter) {
        counter = document.createElement('div');
        counter.className = 'reddit-img-counter';

        const container = galleryShadow.querySelector('.relative') || galleryShadow.firstElementChild;
        if (container) {
          container.style.position = 'relative';
          container.appendChild(counter);
        } else {
          galleryShadow.appendChild(counter);
        }
      }

      counter.textContent = `${current} / ${pages}`;
      applyStyle(counter);
    });
  }

  const observer = new MutationObserver(processGalleryCarousels);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(processGalleryCarousels, POLL_INTERVAL);
  processGalleryCarousels();
})();