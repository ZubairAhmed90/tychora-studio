function icon(id, label, paths, fill = false) {
  const list = (Array.isArray(paths) ? paths : [paths]).map((p) =>
    typeof p === 'string' ? { d: p, fill } : p
  );
  return { id, label, paths: list };
}

export const ICONS = [
  icon('check', 'Check', 'M20 6 9 17l-5-5'),
  icon('x', 'Close', ['M18 6 6 18', 'M6 6l12 12']),
  icon('plus', 'Plus', ['M5 12h14', 'M12 5v14']),
  icon('minus', 'Minus', 'M5 12h14'),
  icon('arrow-right', 'Arrow', ['M5 12h14', 'M13 5l7 7-7 7']),
  icon('arrow-left', 'Arrow left', ['M19 12H5', 'M11 19l-7-7 7-7']),
  icon('arrow-up', 'Arrow up', ['M12 19V5', 'M5 12l7-7 7 7']),
  icon('arrow-down', 'Arrow down', ['M12 5v14', 'M19 12l-7 7-7-7']),
  icon('arrow-up-right', 'External', ['M7 17 17 7', 'M7 7h10v10']),
  icon('chevron', 'Chevron', 'M9 18l6-6-6-6'),
  icon('mail', 'Mail', ['M4 4h16v16H4z', 'M4 4l8 8 8-8']),
  icon(
    'phone',
    'Phone',
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'
  ),
  icon('globe', 'Globe', ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z']),
  icon('user', 'Person', ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8']),
  icon('users', 'Team', ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75']),
  icon('user-plus', 'Add person', ['M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M20 8v6', 'M23 11h-6']),
  icon('megaphone', 'Hiring', ['M3 11v2a1 1 0 0 0 1 1h1l6 5V6L5 11H4a1 1 0 0 0-1 1z', 'M15 8.5a6 6 0 0 1 0 7', 'M7 15v4']),
  icon('calendar', 'Calendar', ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z']),
  icon('clock', 'Clock', ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2']),
  icon('pin', 'Location', ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4']),
  icon('star', 'Star', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', true),
  icon('heart', 'Heart', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', true),
  icon('message', 'Chat', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
  icon('briefcase', 'Work', ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2']),
  icon('zap', 'Bolt', 'M13 2 3 14h9l-1 8 10-12h-9l1-8z', true),
  icon('file', 'File', ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6']),
  icon('chart', 'Chart', ['M18 20V10', 'M12 20V4', 'M6 20v-6', 'M4 20h16']),
  icon('link', 'Link', ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71']),
  icon('search', 'Search', ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.3-4.3']),
  icon('home', 'Home', ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10']),
  icon('building', 'Office', ['M6 22V4h12v18', 'M6 12h12', 'M9 8h.01', 'M15 8h.01', 'M9 16h.01', 'M15 16h.01', 'M10 22v-4h4v4']),
  icon('shield', 'Shield', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),
  icon('tag', 'Tag', ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01']),
  icon('camera', 'Camera', ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8']),
  icon('image', 'Image', ['M3 5h18v14H3z', 'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3', 'M21 15l-5-5L5 21']),
  icon('wifi', 'Wifi', ['M5 12.55a11 11 0 0 1 14.08 0', 'M1.42 9a16 16 0 0 1 21.16 0', 'M8.53 16.11a6 6 0 0 1 6.95 0', 'M12 20h.01']),
  icon('cloud', 'Cloud', 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'),
  icon('code', 'Code', ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6']),
  icon('layers', 'Layers', ['M12 2 2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5']),
  icon('sparkle', 'Sparkle', ['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'M6.3 6.3l2.8 2.8', 'M14.9 14.9l2.8 2.8', 'M17.7 6.3l-2.8 2.8', 'M9.1 14.9l-2.8 2.8']),
  icon('play', 'Play', 'M8 5v14l11-7z', true),
  icon('download', 'Download', ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']),
  icon('flag', 'Flag', ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7']),
  icon('send', 'Send', ['M22 2 11 13', 'M22 2l-7 20-4-9-9-4 20-7z']),
  icon('lock', 'Lock', ['M7 11V7a5 5 0 0 1 10 0v4', 'M5 11h14v10H5z']),
  icon('target', 'Target', ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']),
  icon('check-circle', 'Done', ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 12l3 3 5-6']),
  icon('alert', 'Alert', ['M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01']),
  icon('info', 'Info', ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16v-4', 'M12 8h.01']),
  icon('sliders', 'Settings', ['M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6']),
  icon('at', 'Email @', ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94']),
];

export const EMOJI_GROUPS = [
  {
    id: 'work',
    label: 'Work',
    items: ['💼', '📊', '📈', '📉', '💻', '🖥️', '📱', '📧', '📅', '⏰', '📁', '📌', '✏️', '📎', '🔗', '✅', '❌', '⚡', '🎯', '🏆', '💡', '🚀', '📦', '🗂️'],
  },
  {
    id: 'people',
    label: 'People',
    items: ['👤', '👥', '🤝', '👋', '🙋', '🧑‍💻', '👔', '🗣️', '🧠', '💪'],
  },
  {
    id: 'places',
    label: 'Places',
    items: ['🌍', '🏢', '🏙️', '📍', '🇵🇰', '🇸🇦', '✈️', '🏠', '🗺️', '🌐'],
  },
  {
    id: 'objects',
    label: 'Objects',
    items: ['✉️', '📞', '🔒', '🔑', '🛡️', '⭐', '❤️', '💬', '🔔', '📷', '🖼️', '☁️', '🔍', '⚙️', '✨', '🔥', '📝', '🖋️'],
  },
  {
    id: 'marks',
    label: 'Marks',
    items: ['➡️', '⬅️', '⬆️', '⬇️', '↗️', '➕', '➖', '✔️', '☑️', '🔴', '⚫', '⚪', '🟥', '⬛', '⬜', '💯'],
  },
];

export function getIcon(id) {
  return ICONS.find((item) => item.id === id);
}

export function firstGrapheme(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const first = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)][0];
    return first?.segment || '';
  }
  return [...text][0] || '';
}

export function drawIcon(ctx, el) {
  const iconDef = getIcon(el.icon);
  if (!iconDef) return;
  const pad = el.badge ? Math.min(el.w, el.h) * 0.22 : 0;
  if (el.badge) {
    ctx.fillStyle = el.badgeFill || el.color || '#C8102E';
    ctx.beginPath();
    ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.translate(el.x + pad, el.y + pad);
  const size = Math.min(el.w, el.h) - pad * 2;
  ctx.scale(size / 24, size / 24);
  const color = el.badge ? el.badgeInk || '#F7F5F1' : el.color || '#12151A';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = el.strokeWidth || 1.75;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  iconDef.paths.forEach((p) => {
    const path = new Path2D(p.d);
    if (p.fill) ctx.fill(path);
    else ctx.stroke(path);
  });
  ctx.restore();
}

export function drawEmoji(ctx, el) {
  const size = Math.min(el.w, el.h) * 0.86;
  ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(el.content || '', el.x + el.w / 2, el.y + el.h / 2 + size * 0.04);
}
