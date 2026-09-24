import tracks from './tracks.json';
import { element, icon } from './icons';
const artUrl = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export function setupPlayer(): void {
  const list = element('#tracklist'), toggle = element<HTMLButtonElement>('#play-toggle');
  const title = element('#player-title'), state = element('#player-state'), message = element('#player-message');
  const seek = element<HTMLInputElement>('#seek'), elapsed = element('#elapsed'), duration = element('#preview-duration');
  const apple = element<HTMLAnchorElement>('#apple-link');
  const cover = element<HTMLImageElement>('#active-art'), vinyl = element<HTMLImageElement>('#vinyl-art');
  const audio = new Audio(); audio.preload = 'none'; audio.id = 'preview-audio'; document.body.append(audio);
  let current = 0, loaded = -1, request = 0;
  const normalNote = 'Cuplikan resmi dari Apple Music. Dengarkan versi lengkap di platform pilihanmu.';
  const buttons = tracks.map((track, index) => {
    const row = document.createElement('button'); row.type = 'button'; row.className = 'track-row';
    row.dataset.track = String(index); row.setAttribute('aria-label', `Putar cuplikan ${track.title}`);
    const number = document.createElement('span'); number.className = 'track-number'; number.textContent = String(index + 1).padStart(2, '0');
    const info = document.createElement('span'); info.className = 'track-info';
    const name = document.createElement('strong'); name.textContent = track.title;
    const meta = document.createElement('small'); meta.textContent = `${track.year} · ${track.id === 'bulan' ? 'Cover' : 'Single'}`;
    info.append(name, meta);
    const fullDuration = document.createElement('span'); fullDuration.className = 'track-duration'; fullDuration.textContent = track.duration;
    const glyph = document.createElement('span'); glyph.className = 'track-glyph icon'; glyph.innerHTML = icon('play');
    row.append(number, info, fullDuration, glyph); list.append(row);
    row.addEventListener('click', () => { if (index === current && !audio.paused) audio.pause(); else { select(index); void play(); } });
    return row;
  });
  function render(): void {
    const playing = loaded === current && !audio.paused;
    document.body.classList.toggle('is-playing', playing);
    toggle.innerHTML = icon(playing ? 'pause' : 'play');
    toggle.setAttribute('aria-label', `${playing ? 'Jeda' : 'Putar'} cuplikan ${tracks[current].title}`);
    buttons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === current));
      button.querySelector('.track-glyph')!.innerHTML = icon(index === current && playing ? 'pause' : 'play');
    });
    document.querySelectorAll<HTMLElement>('[data-play-track] .round-play').forEach(node => { node.innerHTML = icon(current === 0 && playing ? 'pause' : 'play'); });
  }
  function select(index: number): void {
    if (!tracks[index]) return;
    if (index !== current) { request++; audio.pause(); current = index; loaded = -1; seek.disabled = true; seek.value = '0'; elapsed.textContent = '0:00'; duration.textContent = '0:30'; }
    const track = tracks[current]; title.textContent = track.title; apple.href = track.apple;
    cover.src = artUrl(track.art); cover.alt = `Sampul ${track.title}`; vinyl.src = artUrl(track.art);
    state.textContent = 'CUPLIKAN APPLE MUSIC'; message.textContent = normalNote; render();
  }
  function failed(): void {
    state.textContent = 'CUPLIKAN TIDAK TERSEDIA';
    message.textContent = 'Cuplikan belum dapat diputar. Dengarkan lagu lengkap melalui tautan Apple Music.';
    render();
  }
  async function play(): Promise<void> {
    const token = ++request;
    if (loaded !== current) { audio.src = tracks[current].preview; loaded = current; }
    state.textContent = 'MEMUAT CUPLIKAN'; message.textContent = normalNote;
    try { await audio.play(); if (token === request) render(); }
    catch (error) { if (token === request && !(error instanceof DOMException && error.name === 'AbortError')) failed(); }
  }
  toggle.addEventListener('click', () => { if (audio.paused) void play(); else audio.pause(); });
  document.querySelectorAll<HTMLElement>('[data-play-track]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.playTrack);
    if (index === current && !audio.paused) audio.pause(); else { select(index); void play(); }
  }));
  audio.addEventListener('play', () => { state.textContent = 'MEMUTAR CUPLIKAN'; render(); });
  audio.addEventListener('pause', () => { state.textContent = 'CUPLIKAN DIJEDA'; render(); });
  audio.addEventListener('ended', () => { state.textContent = 'DENGARKAN VERSI LENGKAP'; render(); });
  audio.addEventListener('error', failed);
  audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(audio.duration)) { seek.max = String(audio.duration); duration.textContent = time(audio.duration); seek.disabled = false; }
  });
  audio.addEventListener('timeupdate', () => { seek.value = String(audio.currentTime); elapsed.textContent = time(audio.currentTime); });
  seek.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Math.min(Number(seek.value), audio.duration); });
  document.addEventListener('stop-audio', () => { request++; audio.pause(); });
  select(0);
}
