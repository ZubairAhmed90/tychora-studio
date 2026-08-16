import { INK, PAPER, RED } from './brand';

export const FRAME_STYLES = [
  { id: 'none', label: 'None' },
  { id: 'thin', label: 'Thin' },
  { id: 'thick', label: 'Thick' },
  { id: 'double', label: 'Double' },
  { id: 'inset', label: 'Inset' },
  { id: 'dashed', label: 'Dashed' },
  { id: 'corners', label: 'Corners' },
  { id: 'redbar', label: 'Red edge' },
];

export function defaultFrame() {
  return { style: 'none', color: INK, weight: 16 };
}

export function normalizeFrame(frame) {
  const f = frame || {};
  const known = FRAME_STYLES.some((s) => s.id === f.style);
  return {
    style: known ? f.style : 'none',
    color: f.color || (f.style === 'redbar' ? RED : INK),
    weight: Math.max(2, Math.min(80, Number(f.weight) || 16)),
  };
}

function parseHex(hex) {
  let h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length < 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}

function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/** True when a solid canvas fill would disappear against the paper UI. */
export function canvasBlendsWithUi(background) {
  if (background?.image) return false;
  if (background?.type === 'gradient') return false;
  const rgb = parseHex(background?.value || PAPER);
  if (!rgb) return true;
  const paper = parseHex(PAPER) || [247, 245, 241];
  return dist(rgb, paper) < 32 || dist(rgb, [255, 255, 255]) < 32;
}

export function frameMetrics(frame, w, h) {
  const f = normalizeFrame(frame);
  const t = f.weight;
  return {
    ...f,
    w,
    h,
    thin: Math.max(2, t * 0.35),
    thick: t,
    doubleOuter: Math.max(2, t * 0.28),
    doubleGap: t * 1.55,
    insetM: t * 2,
    insetLw: Math.max(3, t * 0.45),
    dashM: t,
    dashLw: Math.max(3, t * 0.4),
    dash: [t * 1.4, t * 0.8],
    cornerD: t,
    cornerLen: Math.max(36, t * 3.5),
    cornerLw: Math.max(4, t * 0.5),
    barW: Math.max(8, t),
  };
}

export function drawFrame(ctx, design) {
  const m = frameMetrics(design.frame, design.format.w, design.format.h);
  if (m.style === 'none') return;
  ctx.save();
  ctx.strokeStyle = m.color;
  ctx.fillStyle = m.color;
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'square';

  if (m.style === 'thin' || m.style === 'thick') {
    const lw = m.style === 'thick' ? m.thick : m.thin;
    ctx.lineWidth = lw;
    ctx.strokeRect(lw / 2, lw / 2, m.w - lw, m.h - lw);
  } else if (m.style === 'double') {
    ctx.lineWidth = m.doubleOuter;
    ctx.strokeRect(m.doubleOuter / 2, m.doubleOuter / 2, m.w - m.doubleOuter, m.h - m.doubleOuter);
    ctx.strokeRect(m.doubleGap, m.doubleGap, m.w - m.doubleGap * 2, m.h - m.doubleGap * 2);
  } else if (m.style === 'inset') {
    ctx.lineWidth = m.insetLw;
    ctx.strokeRect(m.insetM, m.insetM, m.w - m.insetM * 2, m.h - m.insetM * 2);
  } else if (m.style === 'dashed') {
    ctx.lineWidth = m.dashLw;
    ctx.setLineDash(m.dash);
    ctx.strokeRect(m.dashM, m.dashM, m.w - m.dashM * 2, m.h - m.dashM * 2);
  } else if (m.style === 'corners') {
    ctx.lineWidth = m.cornerLw;
    const { cornerD: d, cornerLen: len, w, h } = m;
    ctx.beginPath();
    ctx.moveTo(d, d + len);
    ctx.lineTo(d, d);
    ctx.lineTo(d + len, d);
    ctx.moveTo(w - d - len, d);
    ctx.lineTo(w - d, d);
    ctx.lineTo(w - d, d + len);
    ctx.moveTo(w - d, h - d - len);
    ctx.lineTo(w - d, h - d);
    ctx.lineTo(w - d - len, h - d);
    ctx.moveTo(d + len, h - d);
    ctx.lineTo(d, h - d);
    ctx.lineTo(d, h - d - len);
    ctx.stroke();
  } else if (m.style === 'redbar') {
    ctx.fillRect(0, 0, m.barW, m.h);
  }

  ctx.restore();
}
