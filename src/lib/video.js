const DB_NAME = 'tychora-studio';
const STORE = 'videos';
export const MAX_VIDEO_MB = 48;

const objectUrls = new Map();

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putVideoBlob(id, blob) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVideoBlob(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getVideoObjectUrl(id) {
  if (!id) return '';
  if (objectUrls.has(id)) return objectUrls.get(id);
  const blob = await getVideoBlob(id);
  if (!blob) return '';
  const url = URL.createObjectURL(blob);
  objectUrls.set(id, url);
  return url;
}

export function parseVideoLink(raw) {
  const input = String(raw || '').trim();
  if (!input) return null;
  let url;
  try {
    url = new URL(input.includes('://') ? input : `https://${input}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  const path = url.pathname;

  let youtubeId = '';
  if (host === 'youtu.be') youtubeId = path.split('/').filter(Boolean)[0] || '';
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
    youtubeId = url.searchParams.get('v') || '';
    const parts = path.split('/').filter(Boolean);
    if (!youtubeId && ['embed', 'shorts', 'live', 'v'].includes(parts[0]) && parts[1]) youtubeId = parts[1];
  }
  youtubeId = youtubeId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
  if (youtubeId.length >= 8) {
    const shorts = path.includes('/shorts/');
    return {
      provider: 'youtube',
      videoId: youtubeId,
      pageUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      poster: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      aspect: shorts ? 'portrait' : 'landscape',
    };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = path.match(/(\d{6,})/);
    if (m) {
      return {
        provider: 'vimeo',
        videoId: m[1],
        pageUrl: `https://vimeo.com/${m[1]}`,
        embedUrl: `https://player.vimeo.com/video/${m[1]}`,
        poster: '',
        aspect: 'landscape',
      };
    }
  }

  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(path)) {
    return {
      provider: 'url',
      videoId: '',
      pageUrl: url.href,
      embedUrl: '',
      src: url.href,
      poster: '',
      aspect: 'landscape',
    };
  }

  return null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('lookup failed');
  return res.json();
}

export async function resolveVideoLink(raw) {
  const parsed = parseVideoLink(raw);
  if (!parsed) {
    throw new Error('Paste a YouTube, Vimeo, or .mp4 link');
  }
  let title = '';
  let poster = parsed.poster || '';
  try {
    if (parsed.provider === 'youtube') {
      try {
        const o = await fetchJson(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(parsed.pageUrl)}`);
        title = o?.title || '';
        poster = o?.thumbnail_url || parsed.poster;
      } catch {
        const o = await fetchJson(`https://noembed.com/embed?url=${encodeURIComponent(parsed.pageUrl)}`);
        title = o?.title || '';
        poster = o?.thumbnail_url || parsed.poster;
      }
    } else if (parsed.provider === 'vimeo') {
      const o = await fetchJson(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(parsed.pageUrl)}`);
      title = o?.title || '';
      poster = o?.thumbnail_url || '';
    }
  } catch {
    /* keep parsed poster */
  }
  return { ...parsed, title, poster };
}

export function captureVideoPoster(fileOrUrl) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    const revoke = fileOrUrl instanceof Blob;
    const src = revoke ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
    let done = false;
    const finish = (value) => {
      if (done) return;
      done = true;
      if (revoke) URL.revokeObjectURL(src);
      resolve(value || '');
    };
    const grab = () => {
      try {
        if (!video.videoWidth) {
          finish('');
          return;
        }
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 960 / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        finish(canvas.toDataURL('image/jpeg', 0.82));
      } catch {
        finish('');
      }
    };
    video.addEventListener('seeked', grab, { once: true });
    video.addEventListener('error', () => finish(''), { once: true });
    video.addEventListener('loadeddata', () => {
      try {
        const t = Math.min(0.35, (video.duration || 1) * 0.08);
        video.currentTime = t;
      } catch {
        grab();
      }
    }, { once: true });
    setTimeout(() => finish(''), 4000);
    video.src = src;
    video.load();
  });
}

function mapEls(elements, fn) {
  return (elements || []).map(fn);
}

export function stripVideoBlobs(design) {
  if (!design) return design;
  const mapEl = (el) => {
    if (!el || el.type !== 'video') return el;
    const next = { ...el };
    if (next.src && (String(next.src).startsWith('blob:') || String(next.src).startsWith('data:video'))) {
      delete next.src;
    }
    return next;
  };
  return {
    ...design,
    elements: mapEls(design.elements, mapEl),
    slides: (design.slides || []).map((slide) => ({ ...slide, elements: mapEls(slide.elements, mapEl) })),
  };
}

export async function hydrateDesignVideos(design) {
  if (!design) return design;
  const mapEl = async (el) => {
    if (!el || el.type !== 'video' || el.provider !== 'file' || !el.mediaId) return el;
    const src = await getVideoObjectUrl(el.mediaId);
    return src ? { ...el, src } : el;
  };
  const elements = await Promise.all(mapEls(design.elements, mapEl));
  const slides = await Promise.all(
    (design.slides || []).map(async (slide) => ({
      ...slide,
      elements: await Promise.all(mapEls(slide.elements, mapEl)),
    }))
  );
  return { ...design, elements, slides };
}

export function designVideos(design) {
  return (design?.elements || []).filter((el) => el.type === 'video' && !el.hidden);
}
