// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Project filter tabs
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

// One deliberate motion moment: count up the hero stats on load
const statNumbers = document.querySelectorAll('.stat-number');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

statNumbers.forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});

// Resume link placeholder guard
document.getElementById('resume-link').addEventListener('click', (e) => {
  if (e.currentTarget.getAttribute('href') === '#') {
    e.preventDefault();
    alert('Add your resume PDF link here — replace the href on #resume-link in index.html.');
  }
});
