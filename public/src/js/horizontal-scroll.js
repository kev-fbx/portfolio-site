(function () {
  const WHEEL_MULTIPLIER = 5;
  const ITEMS = '.divider, .project-card';

  const content = document.querySelector('.project-content, .project-scroll-bar');

  if (!content) {
    return;
  }

  const stacked = window.matchMedia('(max-width: 1100px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behaviour = () => (reduced.matches ? 'auto' : 'smooth');

  window.addEventListener('wheel', (evt) => {
    const delta = Math.abs(evt.deltaY) > Math.abs(evt.deltaX) ? evt.deltaY : evt.deltaX;

    if (!delta || stacked.matches) {
      return;
    }

    const before = content.scrollLeft;
    content.scrollLeft += delta * WHEEL_MULTIPLIER;

    if (content.scrollLeft !== before) {
      evt.preventDefault();
    }
  }, { passive: false });

  const step = (direction) => {
    const origin = content.getBoundingClientRect().left + (parseFloat(getComputedStyle(content).paddingLeft) || 0);
    const offsets = Array.from(content.querySelectorAll(ITEMS), (item) => item.getBoundingClientRect().left - origin);

    const target = direction > 0 ? offsets.find((offset) => offset > 1) : offsets.filter((offset) => offset < -1).pop();

    if (target !== undefined) {
      content.scrollBy({ left: target, behavior: behaviour() });
    }
  };

  window.addEventListener('keydown', (event) => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;

    if (!direction || stacked.matches || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    step(direction);
  });

  const progress = document.getElementById('scroll-bar-progress');

  if (!progress) {
    return;
  }

  const update = () => {
    const travel = content.scrollWidth - content.clientWidth;
    const thumb = Math.min((content.clientWidth / content.scrollWidth) * 100, 100) || 100;

    progress.style.width = thumb + '%';
    progress.style.left = (travel > 0 ? content.scrollLeft / travel : 0) * (100 - thumb) + '%';
  };

  const track = progress.parentElement;
  let grab = 0;

  const seek = (evt) => {
    const bar = track.getBoundingClientRect();
    const span = bar.width - progress.offsetWidth;
    const ratio = span > 0 ? Math.min(Math.max((evt.clientX - bar.left - grab) / span, 0), 1) : 0;

    // 'instant' overrides the CSS smooth scrolling so the thumb tracks the pointer
    content.scrollTo({ left: ratio * (content.scrollWidth - content.clientWidth), behavior: 'instant' });
  };

  track.addEventListener('pointerdown', (evt) => {
    const thumb = progress.getBoundingClientRect();
    const onThumb = evt.clientX >= thumb.left && evt.clientX <= thumb.right;

    grab = onThumb ? evt.clientX - thumb.left : thumb.width / 2;
    track.setPointerCapture(evt.pointerId);
    seek(evt);
  });

  track.addEventListener('pointermove', (evt) => {
    if (track.hasPointerCapture(evt.pointerId)) {
      seek(evt);
    }
  });

  content.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();
