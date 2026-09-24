import { element } from './icons';
export function setupUI(): void {
  const menu = element<HTMLElement>('#mobile-menu'), menuButton = element<HTMLButtonElement>('.menu-toggle');
  const closeMenu = () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Buka menu'); };
  menuButton.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu'); });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });
  window.matchMedia('(min-width:701px)').addEventListener('change', closeMenu);
  const media = element<HTMLDialogElement>('#media-dialog');
  const content = element('#media-content'), caption = element('#media-caption');
  const booking = element<HTMLDialogElement>('#booking-dialog'), credits = element<HTMLDialogElement>('#credits-dialog');
  function show(dialog: HTMLDialogElement): void { closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }
  function dismiss(dialog: HTMLDialogElement): void {
    // Remove third-party media synchronously, before the native close event task.
    if (dialog === media) { content.replaceChildren(); caption.replaceChildren(); }
    document.body.classList.remove('modal-open');
    dialog.close();
  }
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(dialog); });
    dialog.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(button => button.addEventListener('click', () => dismiss(dialog)));
    dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dismiss(dialog); });
    dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (dialog === media) { content.replaceChildren(); caption.replaceChildren(); } });
  });
  const allowedVideos = new Set(['uwSyivDS8qY', '9YbxXu6Ac_M', 'Qj6BLHjouts', 'L7IZI6VNcyo']);
  document.querySelectorAll<HTMLAnchorElement>('[data-video]').forEach(link => link.addEventListener('click', event => {
    const id = link.dataset.video; if (!id || !allowedVideos.has(id)) return;
    event.preventDefault(); document.dispatchEvent(new Event('stop-audio'));
    const frame = document.createElement('iframe'); frame.title = link.dataset.videoTitle || 'Video resmi Cind3rella';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin'; content.replaceChildren(frame);
    const fallback = document.createElement('a'); fallback.href = link.href; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = 'Buka di YouTube';
    caption.textContent = `${frame.title} · Pemutaran mengikuti ketersediaan YouTube.`; caption.append(fallback); show(media);
  }));
  const allowedGallery = new Set(['live-crowd.webp', 'live-close-clean.webp']);
  document.querySelectorAll<HTMLButtonElement>('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    const asset = button.dataset.gallery; if (!asset || !allowedGallery.has(asset)) return;
    const figure = document.createElement('figure'), image = document.createElement('img');
    image.src = `${import.meta.env.BASE_URL}images/${asset}`; image.alt = button.querySelector('img')?.alt || 'Dokumentasi panggung Cind3rella';
    figure.append(image); content.replaceChildren(figure); caption.textContent = button.dataset.caption || ''; show(media);
  }));
  element('#open-booking').addEventListener('click', () => show(booking));
  element('#credits-button').addEventListener('click', () => show(credits));
  const form = element<HTMLFormElement>('#booking-form'), send = element<HTMLAnchorElement>('#booking-send');
  const status = element('#booking-status');
  const date = form.elements.namedItem('date') as HTMLInputElement;
  const now = new Date(); date.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  form.addEventListener('input', () => { send.hidden = true; send.removeAttribute('href'); status.textContent = 'Detail hanya diproses di browser ini. Pesan tidak dikirim otomatis.'; });
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = `Halo GiCi, saya ingin berdiskusi tentang booking Cind3rella.\n\nNama/penyelenggara: ${String(data.get('organizer')).trim()}\nJenis acara: ${data.get('eventType')}\nTanggal: ${data.get('date')}\nKota/lokasi: ${String(data.get('location')).trim()}\nDetail: ${String(data.get('message')).trim() || '-'}\n\nMohon informasi ketersediaan dan penawarannya. Terima kasih.`;
    send.href = `https://wa.me/6281807282200?text=${encodeURIComponent(text)}`; send.hidden = false;
    status.textContent = 'Pesan siap. Periksa detailmu lalu lanjutkan ke WhatsApp. Belum ada pesan yang dikirim.';
    send.focus();
  });
  element('#year').textContent = String(now.getFullYear());
}
