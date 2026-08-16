import React, { useRef, useState } from 'react';
import { getIcon } from '../lib/stickers';
import IconGlyph from './IconGlyph';
import QrMark from './QrMark';
import { canvasBlendsWithUi } from '../lib/frame';
import FrameOverlay from './FrameOverlay';

function LogoMark({ el }) {
  const inverted = el.inverted;
  const h = Math.max(24, el.h);
  const mark = Math.round(Math.min(h * 0.92, el.w * 0.22, h));
  const titleSize = Math.max(12, Math.round(h * 0.3));
  const subSize = Math.max(8, Math.round(h * 0.155));
  return (
    <div className="flex items-center h-full select-none pointer-events-none overflow-visible" style={{ gap: Math.max(8, mark * 0.18), paddingLeft: 4, paddingRight: 8 }}>
      <span
        className="flex items-center justify-center shrink-0 rounded-[3px]"
        style={{
          width: mark,
          height: mark,
          background: inverted ? 'rgba(255,255,255,0.12)' : '#12151A',
        }}
      >
        <svg viewBox="0 0 40 40" className="w-[70%] h-[70%]" overflow="visible">
          <path d="M8 11h24M20 11v19" stroke={inverted ? '#F7F5F1' : '#E8E6E1'} strokeWidth="3.2" strokeLinecap="square" fill="none" />
        </svg>
      </span>
      <span className="shrink-0 leading-none">
        <span
          className="flex items-center font-semibold"
          style={{
            color: inverted ? '#F7F5F1' : '#12151A',
            fontSize: titleSize,
            letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
          }}
        >
          <span>TYCH</span>
          <span
            className="rounded-full bg-primary-600 shrink-0"
            style={{
              width: titleSize * 0.52,
              height: titleSize * 0.52,
              marginLeft: titleSize * 0.1,
              marginRight: titleSize * 0.1,
            }}
          />
          <span>RA</span>
        </span>
        <span
          className="block font-medium uppercase"
          style={{
            color: inverted ? 'rgba(247,245,241,0.6)' : '#5E6670',
            fontSize: subSize,
            letterSpacing: '0.2em',
            marginTop: Math.max(2, h * 0.04),
            whiteSpace: 'nowrap',
          }}
        >
          Technologies
        </span>
      </span>
    </div>
  );
}

export default function CanvasBoard({
  design,
  selectedId,
  onSelect,
  onChangeElement,
  onDropFile,
  onEditText,
  zoom,
  showGrid,
  showSafe,
  guides,
  onDragEnd,
  placeMode,
  onPlace,
}) {
  const drag = useRef(null);
  const [over, setOver] = useState(false);

  const startDrag = (e, el, mode) => {
    if (placeMode) {
      e.stopPropagation();
      e.preventDefault();
      if (mode === 'move') onPlace?.(el.x + el.w / 2, el.y + el.h / 2, el);
      return;
    }
    if (el.locked) {
      e.stopPropagation();
      onSelect(el.id);
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    onSelect(el.id);
    drag.current = {
      id: el.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      x: el.x,
      y: el.y,
      w: el.w,
      h: el.h,
      ratio: el.w / Math.max(1, el.h),
      lockRatio: el.type === 'icon' || el.type === 'emoji' || el.type === 'qr' || el.type === 'logo',
    };
  };

  const onMove = (e) => {
    if (!drag.current) return;
    const { id, mode, startX, startY, x, y, w, h, ratio, lockRatio } = drag.current;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;
    if (mode === 'move') {
      onChangeElement(id, { x: Math.round(x + dx), y: Math.round(y + dy) }, { live: true });
    } else if (e.shiftKey || lockRatio) {
      const nw = Math.max(24, Math.round(w + dx));
      onChangeElement(id, { w: nw, h: Math.max(24, Math.round(nw / ratio)) }, { live: true });
    } else {
      onChangeElement(id, { w: Math.max(24, Math.round(w + dx)), h: Math.max(24, Math.round(h + dy)) }, { live: true });
    }
  };

  const endDrag = () => {
    if (drag.current) onDragEnd?.();
    drag.current = null;
  };

  const layers = [...(design.elements || [])].filter((el) => !el.hidden).sort((a, b) => (a.z || 0) - (b.z || 0));
  const blends = canvasBlendsWithUi(design.background);

  return (
    <div
      className={`flex-1 overflow-auto p-8 flex items-start justify-center relative ${placeMode ? 'cursor-crosshair' : ''}`}
      style={{ background: '#EDE9E1' }}
      onMouseMove={onMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) onDropFile?.(file);
      }}
    >
      {over && (
        <div className="absolute inset-0 z-20 bg-ink/40 text-paper flex items-center justify-center text-sm tracking-wide pointer-events-none">
          Drop photo onto the canvas
        </div>
      )}
      <div className="flex flex-col items-center shrink-0">
      <div
        className="relative shrink-0"
        style={{
          width: design.format.w * zoom,
          height: design.format.h * zoom,
          background:
            design.background?.type === 'gradient'
              ? `linear-gradient(135deg, ${design.background.value}, ${design.background.value2 || '#12151A'})`
              : design.background?.value || '#FFFFFF',
          backgroundImage: design.background?.image
            ? `${design.background?.type === 'gradient' ? `linear-gradient(135deg, ${design.background.value}, ${design.background.value2 || '#12151A'}), ` : ''}url(${design.background.image})`
            : design.background?.type === 'gradient'
              ? `linear-gradient(135deg, ${design.background.value}, ${design.background.value2 || '#12151A'})`
              : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          outline: blends ? '2px solid #12151A' : '1px solid #C4BDB0',
          outlineOffset: 0,
          boxShadow: '0 12px 32px rgba(18,21,26,0.10)',
        }}
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (placeMode) {
            const rect = e.currentTarget.getBoundingClientRect();
            onPlace?.((e.clientX - rect.left) / zoom, (e.clientY - rect.top) / zoom, null);
            return;
          }
          onSelect(null);
        }}
      >
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'linear-gradient(#E4E0D8 1px, transparent 1px), linear-gradient(90deg, #E4E0D8 1px, transparent 1px)',
              backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            }}
          />
        )}
        {guides?.x != null && (
          <div className="absolute top-0 bottom-0 w-px bg-primary-600 z-30 pointer-events-none" style={{ left: guides.x * zoom }} />
        )}
        {guides?.y != null && (
          <div className="absolute left-0 right-0 h-px bg-primary-600 z-30 pointer-events-none" style={{ top: guides.y * zoom }} />
        )}
        {showSafe && (
          <div
            className="absolute border border-dashed border-primary-600/70 pointer-events-none z-20"
            style={{
              left: design.format.w * zoom * 0.06,
              top: design.format.h * zoom * 0.06,
              width: design.format.w * zoom * 0.88,
              height: design.format.h * zoom * 0.88,
            }}
          />
        )}
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: design.format.w,
            height: design.format.h,
            transform: `scale(${zoom})`,
          }}
          onMouseDown={(e) => {
            if (e.target !== e.currentTarget) return;
            e.stopPropagation();
            if (placeMode) {
              const rect = e.currentTarget.getBoundingClientRect();
              onPlace?.((e.clientX - rect.left) / zoom, (e.clientY - rect.top) / zoom, null);
              return;
            }
            onSelect(null);
          }}
        >
          {layers.map((el) => {
            const selected = el.id === selectedId;
            return (
              <div
                key={el.id}
                className="absolute"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                  transform: `${el.flipX ? 'scaleX(-1) ' : ''}${el.rotation ? `rotate(${el.rotation}deg)` : ''}`.trim() || undefined,
                  zIndex: el.z || 1,
                  outline: selected ? '2px solid #C8102E' : 'none',
                  cursor: placeMode ? 'crosshair' : el.locked ? 'default' : 'move',
                  opacity: el.opacity == null ? 1 : el.opacity,
                  overflow: el.type === 'logo' ? 'visible' : undefined,
                }}
                onMouseDown={(e) => startDrag(e, el, 'move')}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (el.type === 'text' || el.type === 'emoji' || el.type === 'shape' || el.type === 'image') {
                    onEditText?.(el.id);
                  }
                }}
              >
                {el.type === 'shape' && (
                  <div
                    className="w-full h-full"
                    style={{
                      background: el.fill,
                      borderRadius: el.shape === 'circle' ? '999px' : el.radius || 0,
                    }}
                  />
                )}
                {el.type === 'text' && (
                  <div
                    className="w-full h-full whitespace-pre-wrap break-words"
                    style={{
                      color: el.color,
                      fontSize: el.fontSize,
                      fontWeight: el.fontWeight,
                      fontFamily: el.fontFamily === 'serif' ? '"Instrument Serif", Georgia, serif' : '"IBM Plex Sans", sans-serif',
                      textAlign: el.align,
                      lineHeight: el.lineHeight || 1.2,
                      letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                      fontStyle: el.italic ? 'italic' : undefined,
                      textTransform: el.uppercase ? 'uppercase' : undefined,
                      textShadow: el.shadow ? '0 8px 18px rgba(18,21,26,0.28)' : undefined,
                      pointerEvents: 'none',
                    }}
                  >
                    {el.content}
                  </div>
                )}
                {el.type === 'image' && el.src && (
                  <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: el.radius || 0 }}>
                    <img
                      src={el.src}
                      alt=""
                      className="w-full h-full pointer-events-none select-none"
                      crossOrigin={el.src?.startsWith('http') ? 'anonymous' : undefined}
                      style={{
                        objectFit: el.fit || 'cover',
                        objectPosition: `${(el.panX == null ? 0.5 : el.panX) * 100}% ${(el.panY == null ? 0.5 : el.panY) * 100}%`,
                        transform: el.fit === 'contain' ? undefined : `scale(${Math.max(1, el.zoom || 1)})`,
                        transformOrigin: `${(el.panX == null ? 0.5 : el.panX) * 100}% ${(el.panY == null ? 0.5 : el.panY) * 100}%`,
                        filter: el.filter === 'grayscale' ? 'grayscale(1)' : undefined,
                      }}
                      draggable={false}
                    />
                    {el.overlayOpacity ? (
                      <div className="absolute inset-0 pointer-events-none" style={{ background: el.overlay || '#12151A', opacity: el.overlayOpacity }} />
                    ) : null}
                  </div>
                )}
                {el.type === 'logo' && <LogoMark el={el} />}
                {el.type === 'icon' && getIcon(el.icon) && (
                  <div
                    className="w-full h-full pointer-events-none"
                    style={{
                      background: el.badge ? el.badgeFill || el.color : undefined,
                      borderRadius: el.badge ? '999px' : 0,
                      padding: el.badge ? '22%' : 0,
                    }}
                  >
                    <IconGlyph name={el.icon} color={el.badge ? el.badgeInk || '#F7F5F1' : el.color || '#12151A'} className="w-full h-full" />
                  </div>
                )}
                {el.type === 'emoji' && (
                  <div
                    className="w-full h-full pointer-events-none flex items-center justify-center select-none leading-none"
                    style={{ fontSize: Math.min(el.w, el.h) * 0.82 }}
                  >
                    {el.content}
                  </div>
                )}
                {el.type === 'qr' && <QrMark el={el} />}
                {selected && !el.locked && (
                  <button
                    type="button"
                    className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-primary-600 border-2 border-white"
                    onMouseDown={(e) => startDrag(e, el, 'resize')}
                    aria-label="Resize"
                  />
                )}
              </div>
            );
          })}
          <FrameOverlay frame={design.frame} width={design.format.w} height={design.format.h} />
        </div>
      </div>
      {blends && (
        <p className="text-[10px] text-mute mt-2 tracking-wide">
          Edge is editor-only — not in the download
        </p>
      )}
      </div>
    </div>
  );
}
