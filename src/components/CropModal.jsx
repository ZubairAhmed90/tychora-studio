import React, { useRef, useState } from 'react';

function clamp(n) {
  return Math.max(0, Math.min(1, n));
}

export default function CropModal({ el, onApply, onClose }) {
  const [zoom, setZoom] = useState(Math.max(1, el.zoom || 1));
  const [panX, setPanX] = useState(el.panX == null ? 0.5 : el.panX);
  const [panY, setPanY] = useState(el.panY == null ? 0.5 : el.panY);
  const drag = useRef(null);
  const frame = useRef(null);
  const aspect = Math.max(0.4, Math.min(2.4, el.w / Math.max(1, el.h)));
  const frameW = 420;
  const frameH = Math.round(frameW / aspect);

  const onMove = (e) => {
    if (!drag.current || !frame.current) return;
    const rect = frame.current.getBoundingClientRect();
    const dx = (e.clientX - drag.current.x) / rect.width;
    const dy = (e.clientY - drag.current.y) / rect.height;
    setPanX(clamp(drag.current.panX - dx));
    setPanY(clamp(drag.current.panY - dy));
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-paper border border-line max-w-lg w-full p-5" onClick={(e) => e.stopPropagation()}>
        <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-3">Crop photo</p>
        <p className="text-xs text-mute mb-3">Drag the photo to frame it. Zoom in, then apply.</p>
        <div
          ref={frame}
          className="relative overflow-hidden border border-line mx-auto bg-ink cursor-grab active:cursor-grabbing"
          style={{ width: frameW, height: frameH, maxWidth: '100%' }}
          onMouseDown={(e) => {
            e.preventDefault();
            drag.current = { x: e.clientX, y: e.clientY, panX, panY };
          }}
          onMouseMove={onMove}
          onMouseUp={() => {
            drag.current = null;
          }}
          onMouseLeave={() => {
            drag.current = null;
          }}
        >
          <img
            src={el.src}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
            style={{
              objectFit: 'cover',
              objectPosition: `${panX * 100}% ${panY * 100}%`,
              transform: `scale(${zoom})`,
              transformOrigin: `${panX * 100}% ${panY * 100}%`,
              filter: el.filter === 'grayscale' ? 'grayscale(1)' : undefined,
            }}
          />
        </div>
        <label className="text-xs text-mute block mt-4">
          Zoom
          <input type="range" min="1" max="3" step="0.05" className="w-full" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
        </label>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="flex-1 border border-ink py-2 text-sm"
            onClick={() => onApply({ fit: 'cover', zoom, panX, panY })}
          >
            Apply crop
          </button>
          <button type="button" className="flex-1 border border-line py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
