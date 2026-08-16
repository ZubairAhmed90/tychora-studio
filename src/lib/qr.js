import QRCode from 'qrcode';

const cache = new Map();

export const QR_PRESETS = [
  { label: 'Website', value: 'https://tychora.com' },
  { label: 'Email', value: 'mailto:hello@tychora.com' },
];

export function qrMatrix(value) {
  const text = String(value || 'https://tychora.com').trim() || 'https://tychora.com';
  if (cache.has(text)) return cache.get(text);
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const cells = [];
  for (let y = 0; y < size; y += 1) {
    const row = [];
    for (let x = 0; x < size; x += 1) row.push(qr.modules.get(x, y));
    cells.push(row);
  }
  const matrix = { size, cells };
  cache.set(text, matrix);
  return matrix;
}

export function drawQr(ctx, el) {
  const { size, cells } = qrMatrix(el.value);
  const pad = el.quiet == null ? 2 : el.quiet;
  const n = size + pad * 2;
  const cell = Math.min(el.w, el.h) / n;
  const ox = el.x + (el.w - cell * n) / 2;
  const oy = el.y + (el.h - cell * n) / 2;
  ctx.fillStyle = el.bg || '#F7F5F1';
  ctx.fillRect(el.x, el.y, el.w, el.h);
  ctx.fillStyle = el.color || '#12151A';
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (cells[y][x]) {
        ctx.fillRect(ox + (x + pad) * cell, oy + (y + pad) * cell, cell + 0.4, cell + 0.4);
      }
    }
  }
}
