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
  'top-right': { top: '10px', right: '10px', bottom: 'auto', left: 'auto' },
  'top-left': { top: '10px', left: '10px', bottom: 'auto', right: 'auto' },
  'bottom-right': { bottom: '10px', right: '10px', top: 'auto', left: 'auto' },
  'bottom-left': { bottom: '10px', left: '10px', top: 'auto', right: 'auto' },
};

const els = {
  size: document.getElementById('size'),
  opacity: document.getElementById('opacity'),
  opacityValue: document.getElementById('opacity-value'),
  position: document.getElementById('position'),
  visible: document.getElementById('visible'),
  badge: document.getElementById('preview-badge'),
};

function updatePreview(settings) {
  const s = SIZE_MAP[settings.size];
  const p = POS_MAP[settings.position];
  const bg = `rgba(0,0,0,${settings.opacity / 100})`;

  Object.assign(els.badge.style, s, p, {
    background: bg,
    display: settings.visible ? 'block' : 'none',
  });
}

function getSettings() {
  return {
    size: els.size.value,
    opacity: parseInt(els.opacity.value, 10),
    position: els.position.value,
    visible: els.visible.checked,
  };
}

function save() {
  const settings = getSettings();
  els.opacityValue.textContent = settings.opacity + '%';
  updatePreview(settings);
  chrome.storage.sync.set({ imgCounterSettings: settings });
}

chrome.storage.sync.get({ imgCounterSettings: DEFAULTS }, (data) => {
  const s = data.imgCounterSettings;
  els.size.value = s.size;
  els.opacity.value = s.opacity;
  els.opacityValue.textContent = s.opacity + '%';
  els.position.value = s.position;
  els.visible.checked = s.visible;
  updatePreview(s);
});

els.size.addEventListener('change', save);
els.opacity.addEventListener('input', save);
els.position.addEventListener('change', save);
els.visible.addEventListener('change', save);