import React, { useEffect, useState } from 'react';

function PlayGlyph({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function Poster({ el, onBroken }) {
  const [src, setSrc] = useState(el.poster || '');
  useEffect(() => {
    setSrc(el.poster || '');
  }, [el.poster]);
  if (!src) return <div className="w-full h-full bg-ink" />;
  return (
    <img
      src={src}
      alt=""
      className="w-full h-full pointer-events-none select-none"
      draggable={false}
      style={{ objectFit: el.fit || 'cover' }}
      onError={() => {
        if (el.provider === 'youtube' && el.videoId && src.includes('maxresdefault')) {
          const next = `https://i.ytimg.com/vi/${el.videoId}/hqdefault.jpg`;
          setSrc(next);
          return;
        }
        onBroken?.();
        setSrc('');
      }}
    />
  );
}

function Embed({ el, autoPlay }) {
  if (el.provider === 'youtube' && el.videoId) {
    const base = el.embedUrl || `https://www.youtube-nocookie.com/embed/${el.videoId}`;
    const src = `${base}?${autoPlay ? 'autoplay=1&' : ''}rel=0&modestbranding=1`;
    return (
      <iframe
        title={el.title || 'YouTube'}
        className="w-full h-full"
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{ border: 0 }}
      />
    );
  }
  if (el.provider === 'vimeo' && el.videoId) {
    const base = el.embedUrl || `https://player.vimeo.com/video/${el.videoId}`;
    return (
      <iframe
        title={el.title || 'Vimeo'}
        className="w-full h-full"
        src={`${base}?${autoPlay ? 'autoplay=1&' : ''}title=0&byline=0`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ border: 0 }}
      />
    );
  }
  if (el.src) {
    return (
      <video
        src={el.src}
        className="w-full h-full"
        style={{ objectFit: el.fit || 'cover' }}
        controls
        autoPlay={autoPlay}
        muted={!!el.muted}
        loop={!!el.loop}
        playsInline
        poster={el.poster || undefined}
      />
    );
  }
  return (
    <div className="w-full h-full bg-ink text-paper flex items-center justify-center text-xs px-3 text-center">
      Video file is not on this computer. Upload it again.
    </div>
  );
}

export default function VideoLayer({ el, playing, onPlay, onPause }) {
  const radius = el.radius || 0;

  return (
    <div className="w-full h-full relative overflow-hidden bg-ink" style={{ borderRadius: radius }}>
      {playing ? (
        <>
          <div
            className="absolute inset-0"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Embed el={el} autoPlay />
          </div>
          <button
            type="button"
            className="absolute top-1.5 right-1.5 z-10 bg-ink/80 text-paper text-[10px] px-2 py-1"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onPause?.();
            }}
          >
            Pause
          </button>
        </>
      ) : (
        <>
          <Poster el={el} />
          {el.showTitle !== false && el.title ? (
            <div className="absolute left-0 right-0 bottom-0 px-2 py-1.5 bg-ink/70 text-paper text-[10px] leading-tight pointer-events-none truncate">
              {el.title}
            </div>
          ) : null}
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            aria-label="Play video"
          >
            <span className="w-[22%] max-w-[72px] min-w-[40px] aspect-square rounded-full bg-primary-600 text-paper flex items-center justify-center shadow-sm">
              <PlayGlyph className="w-[42%] h-[42%] ml-[6%]" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}

export function VideoPlayer({ el, autoPlay = false }) {
  return (
    <div className="w-full aspect-video bg-ink overflow-hidden border border-line">
      <Embed el={el} autoPlay={autoPlay} />
    </div>
  );
}
