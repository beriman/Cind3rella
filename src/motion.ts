import { element } from './icons';
export function setupMotion(): void {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = element<HTMLButtonElement>('#motion-toggle');
  let savedOff = false, enabled = false, pending = false;
  try { savedOff = localStorage.getItem('cind3rella-motion') === 'off'; } catch { /* Storage can be disabled. */ }
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
  function frame(): void {
    pending = false;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--scroll', String(range > 0 ? window.scrollY / range : 0));
    if (!enabled) return;
    for (const layer of layers) {
      const parent = layer.parentElement; if (!parent) continue;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < -150 || rect.top > innerHeight + 150) continue;
      const speed = Number(layer.dataset.parallax) || 0;
      const shift = Math.max(-65, Math.min(65, (innerHeight / 2 - (rect.top + rect.height / 2)) * speed));
      layer.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
    }
  }
  function schedule(): void { if (!pending) { pending = true; requestAnimationFrame(frame); } }
  function apply(): void {
    enabled = !preference.matches && !savedOff;
    document.body.classList.toggle('motion-enabled', enabled);
    document.body.classList.toggle('motion-off', !enabled);
    document.documentElement.style.scrollBehavior = enabled ? 'smooth' : 'auto';
    toggle.textContent = enabled ? 'Gerakan: aktif' : 'Gerakan: nonaktif';
    toggle.setAttribute('aria-pressed', String(!enabled));
    toggle.setAttribute('aria-label', enabled ? 'Nonaktifkan gerakan' : 'Aktifkan gerakan');
    if (!enabled) layers.forEach(layer => layer.style.removeProperty('--parallax-y'));
    schedule();
  }
  toggle.addEventListener('click', () => {
    if (preference.matches) { toggle.textContent = 'Gerakan mengikuti pengaturan perangkat'; return; }
    savedOff = !savedOff;
    try { localStorage.setItem('cind3rella-motion', savedOff ? 'off' : 'on'); } catch { /* Optional preference only. */ }
    apply();
  });
  preference.addEventListener('change', apply);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  apply();
}
