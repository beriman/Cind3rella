/** @author Beriman Juliano — accessible, source-labelled visual gallery. */
import { element } from './icons';
export function setupGallery(): void {
  const cards = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-studio-index]'));
  const filters = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const dialog = element<HTMLDialogElement>('#art-dialog');
  const image = element<HTMLImageElement>('#art-image');
  const title = element('#art-title'), description = element('#art-description');
  const count = element('#art-count'), summary = element('#gallery-count');
  const allowed = new Set(cards.map(card => card.dataset.file));
  let visible = [...cards], position = 0, trigger: HTMLButtonElement | null = null;
  function display(index: number): void {
    if (!visible.length) return;
    position = (index + visible.length) % visible.length;
    const card = visible[position], file = card.dataset.file;
    if (!file || !allowed.has(file) || !/^[a-z0-9-]+\.webp$/.test(file)) return;
    image.src = `${import.meta.env.BASE_URL}images/2026/${file}`;
    image.alt = card.querySelector('img')?.alt || 'Visual Cind3rella';
    title.textContent = card.dataset.title || '';
    description.textContent = card.dataset.description || '';
    count.textContent = `${String(position + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
    visible = cards.filter(card => !card.hidden);
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    summary.textContent = `${visible.length} visual${category === 'all' ? '' : ' · ' + button.textContent}`;
  }));
  cards.forEach(card => card.addEventListener('click', () => {
    trigger = card; display(visible.indexOf(card));
    dialog.showModal(); document.body.classList.add('modal-open');
    element<HTMLButtonElement>('#art-close').focus();
  }));
  element('#art-prev').addEventListener('click', () => display(position - 1));
  element('#art-next').addEventListener('click', () => display(position + 1));
  element('#art-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); display(position + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open'); trigger?.focus({preventScroll:true});
  });
  image.addEventListener('error', () => { description.textContent = 'Gambar belum dapat dimuat. Coba gambar lainnya atau muat ulang halaman.'; });
  let startX = 0, startY = 0;
  image.addEventListener('touchstart', event => {
    startX = event.touches[0]?.clientX ?? 0; startY = event.touches[0]?.clientY ?? 0;
  }, {passive:true});
  image.addEventListener('touchend', event => {
    const touch = event.changedTouches[0]; if (!touch) return;
    const dx = touch.clientX - startX, dy = touch.clientY - startY;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) display(position + (dx < 0 ? 1 : -1));
  }, {passive:true});
}
