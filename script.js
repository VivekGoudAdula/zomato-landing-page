document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  const playPauseBtn = document.getElementById('playPause');
  const muteToggleBtn = document.getElementById('muteToggle');

  // Guard if elements are missing
  if (video) {
    // Initialize button states
    updatePlayPauseLabel();
    updateMuteLabel();

    // Play/Pause toggle
    playPauseBtn?.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      updatePlayPauseLabel();
    });

    // Mute/Unmute toggle
    muteToggleBtn?.addEventListener('click', () => {
      video.muted = !video.muted;
      updateMuteLabel();
    });

    // Update labels on state changes (e.g., autoplay restrictions)
    video.addEventListener('play', updatePlayPauseLabel);
    video.addEventListener('pause', updatePlayPauseLabel);
    video.addEventListener('volumechange', updateMuteLabel);

    // Spacebar toggles play/pause when focused on body
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        if (video.paused) video.play(); else video.pause();
        updatePlayPauseLabel();
      }
    });
  }

  function updatePlayPauseLabel() {
    if (!playPauseBtn || !video) return;
    playPauseBtn.textContent = video.paused ? 'Play' : 'Pause';
    playPauseBtn.setAttribute('aria-pressed', String(!video.paused));
  }

  function updateMuteLabel() {
    if (!muteToggleBtn || !video) return;
    muteToggleBtn.textContent = video.muted ? 'Unmute' : 'Mute';
    muteToggleBtn.setAttribute('aria-pressed', String(video.muted));
  }

  // Scroll reveal: mark target elements, then observe
  const revealTargets = [
    '.text-container h1',
    '.text-container p',
    '.burger',
    '.momos',
    '.pizza',
    '.tomato',
    '.tomato2',
    '.pudina'
  ];

  const candidates = document.querySelectorAll(revealTargets.join(','));
  candidates.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve once revealed for performance
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  candidates.forEach(el => io.observe(el));

  // Subtle parallax on decorative images
  const parallaxItems = [
    { sel: '.burger', factor: 0.15 },
    { sel: '.momos', factor: 0.12 },
    { sel: '.pizza', factor: 0.1 },
    { sel: '.tomato', factor: 0.2 },
    { sel: '.tomato2', factor: 0.18 },
    { sel: '.pudina', factor: 0.22 }
  ]
    .map(cfg => {
      const el = document.querySelector(cfg.sel);
      if (!el) return null;
      const base = el.getAttribute('data-base-transform') || '';
      return { ...cfg, el, base };
    })
    .filter(x => x && x.el);

  function onScroll() {
    const y = window.scrollY;
    parallaxItems.forEach(({ el, factor }) => {
      const base = el.getAttribute('data-base-transform') || '';
      const translate = `translateY(${y * factor}px)`;
      el.style.transform = base ? `${base} ${translate}` : translate;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
