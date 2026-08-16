import React from 'react';
import { getIcon } from '../lib/stickers';

export default function IconGlyph({ name, color = '#12151A', className = 'w-full h-full' }) {
  const icon = getIcon(name);
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {icon.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill ? color : 'none'}
          stroke={p.fill ? 'none' : color}
          strokeWidth={p.fill ? undefined : 1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
