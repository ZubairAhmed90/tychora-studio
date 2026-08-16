import React from 'react';
import { qrMatrix } from '../lib/qr';

export default function QrMark({ el }) {
  const { size, cells } = qrMatrix(el.value);
  const pad = el.quiet == null ? 2 : el.quiet;
  const n = size + pad * 2;
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="w-full h-full pointer-events-none" aria-hidden>
      <rect width={n} height={n} fill={el.bg || '#F7F5F1'} />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x + pad} y={y + pad} width="1.05" height="1.05" fill={el.color || '#12151A'} /> : null
        )
      )}
    </svg>
  );
}
