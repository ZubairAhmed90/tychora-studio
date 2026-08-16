import React from 'react';
import { frameMetrics } from '../lib/frame';

function CornerMarks({ m }) {
  const { cornerD: d, cornerLen: len, w, h, cornerLw, color } = m;
  const common = { fill: 'none', stroke: color, strokeWidth: cornerLw, strokeLinecap: 'square', strokeLinejoin: 'miter' };
  return (
    <>
      <polyline {...common} points={`${d},${d + len} ${d},${d} ${d + len},${d}`} />
      <polyline {...common} points={`${w - d - len},${d} ${w - d},${d} ${w - d},${d + len}`} />
      <polyline {...common} points={`${w - d},${h - d - len} ${w - d},${h - d} ${w - d - len},${h - d}`} />
      <polyline {...common} points={`${d + len},${h - d} ${d},${h - d} ${d},${h - d - len}`} />
    </>
  );
}

export default function FrameOverlay({ frame, width, height }) {
  const m = frameMetrics(frame, width, height);
  if (m.style === 'none') return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-40 overflow-visible"
      width={m.w}
      height={m.h}
      viewBox={`0 0 ${m.w} ${m.h}`}
      aria-hidden
    >
      {m.style === 'thin' && (
        <rect x={m.thin / 2} y={m.thin / 2} width={m.w - m.thin} height={m.h - m.thin} fill="none" stroke={m.color} strokeWidth={m.thin} />
      )}
      {m.style === 'thick' && (
        <rect x={m.thick / 2} y={m.thick / 2} width={m.w - m.thick} height={m.h - m.thick} fill="none" stroke={m.color} strokeWidth={m.thick} />
      )}
      {m.style === 'double' && (
        <>
          <rect x={m.doubleOuter / 2} y={m.doubleOuter / 2} width={m.w - m.doubleOuter} height={m.h - m.doubleOuter} fill="none" stroke={m.color} strokeWidth={m.doubleOuter} />
          <rect x={m.doubleGap} y={m.doubleGap} width={m.w - m.doubleGap * 2} height={m.h - m.doubleGap * 2} fill="none" stroke={m.color} strokeWidth={m.doubleOuter} />
        </>
      )}
      {m.style === 'inset' && (
        <rect x={m.insetM} y={m.insetM} width={m.w - m.insetM * 2} height={m.h - m.insetM * 2} fill="none" stroke={m.color} strokeWidth={m.insetLw} />
      )}
      {m.style === 'dashed' && (
        <rect
          x={m.dashM}
          y={m.dashM}
          width={m.w - m.dashM * 2}
          height={m.h - m.dashM * 2}
          fill="none"
          stroke={m.color}
          strokeWidth={m.dashLw}
          strokeDasharray={m.dash.join(' ')}
        />
      )}
      {m.style === 'corners' && <CornerMarks m={m} />}
      {m.style === 'redbar' && <rect x={0} y={0} width={m.barW} height={m.h} fill={m.color} />}
    </svg>
  );
}
