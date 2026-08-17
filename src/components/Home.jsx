import React, { useMemo, useState } from 'react';
import { MAX_SAVED } from '../lib/storage';
import { SIZES, customFormat } from '../lib/brand';
import { TEMPLATES, emptyDesign } from '../lib/templates';
import IconGlyph from './IconGlyph';

function Mini({ design }) {
  const s = Math.min(220 / design.format.w, 140 / design.format.h);
  return (
    <div className="overflow-hidden border border-line bg-paper" style={{ width: design.format.w * s, height: design.format.h * s }}>
      <div
        className="relative origin-top-left pointer-events-none"
        style={{
          width: design.format.w,
          height: design.format.h,
          transform: `scale(${s})`,
          background: design.background?.value,
          backgroundImage: design.background?.image ? `url(${design.background.image})` : undefined,
          backgroundSize: 'cover',
        }}
      >
        {[...design.elements]
          .filter((el) => !el.hidden)
          .sort((a, b) => (a.z || 0) - (b.z || 0))
          .map((el) => (
            <div
              key={el.id}
              className="absolute overflow-hidden"
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                opacity: el.opacity,
                background: el.type === 'shape' ? el.fill : el.type === 'image' || el.type === 'video' ? '#1C2026' : 'transparent',
                borderRadius: el.shape === 'circle' ? 999 : el.radius || 0,
                color: el.color,
                fontSize: el.fontSize,
                fontFamily: el.fontFamily === 'serif' ? 'Instrument Serif, serif' : 'IBM Plex Sans, sans-serif',
              }}
            >
              {el.type === 'text' ? <span className="block leading-tight">{el.content}</span> : null}
              {el.type === 'image' && el.src ? <img src={el.src} alt="" className="w-full h-full object-cover" /> : null}
              {el.type === 'video' && (el.poster ? <img src={el.poster} alt="" className="w-full h-full object-cover" /> : null)}
              {el.type === 'icon' ? <IconGlyph name={el.icon} color={el.color || '#12151A'} className="w-full h-full" /> : null}
              {el.type === 'qr' ? <div className="w-full h-full" style={{ background: el.bg || '#F7F5F1' }} /> : null}
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Home({ posts, onNew, onOpen, onDelete, onDuplicate }) {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('All');
  const [customW, setCustomW] = useState(1080);
  const [customH, setCustomH] = useState(1080);
  const platforms = ['All', ...new Set(SIZES.map((s) => s.platform)), 'Video'];

  const templates = useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      const size = SIZES.find((s) => s.id === tpl.sizeId);
      const hit = !query || `${tpl.name} ${tpl.blurb} ${tpl.topic || ''}`.toLowerCase().includes(query.toLowerCase());
      const plat =
        platform === 'All' ||
        (platform === 'Video' && tpl.topic === 'video') ||
        (platform !== 'Video' && size?.platform === platform);
      return hit && plat;
    });
  }, [query, platform]);

  const sizes = SIZES.filter((s) => {
    if (platform === 'All') return true;
    if (platform === 'Video') return ['story', 'youtube', 'instagram', 'linkedin'].includes(s.id);
    return s.platform === platform;
  });

  return (
    <div className="min-h-full">
      <header className="border-b border-line px-6 py-5 flex items-center gap-3">
        <span className="w-9 h-9 bg-ink flex items-center justify-center rounded-[3px]">
          <svg viewBox="0 0 40 40" className="w-7 h-7">
            <path d="M12 12h16M20 12v17" stroke="#E8E6E1" strokeWidth="3.2" strokeLinecap="square" fill="none" />
          </svg>
        </span>
        <div className="flex-1">
          <p className="font-semibold tracking-[0.16em]">
            TYCH
            <span className="mx-[0.08em] mb-[0.1em] inline-block w-[0.55em] h-[0.55em] rounded-full bg-primary-600 align-middle" />
            RA STUDIO
          </p>
          <p className="text-[10px] tracking-[0.22em] uppercase text-mute">Posts and video covers for LinkedIn, Instagram, YouTube</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates"
          className="hidden md:block w-56 border border-line bg-transparent px-3 py-2 text-sm"
        />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-3">Start</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-3">Make a post. Keep it on brand.</h1>
        <p className="text-mute max-w-xl mb-8">
          Pick a size, drop in a photo, write the line and a caption. Video covers are stills for Reels, Stories, and YouTube — replace the portrait, keep the play mark. Save up to {MAX_SAVED} drafts on this computer.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {platforms.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 text-sm border ${platform === p ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-3">Empty canvas</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => onNew(emptyDesign(size, 'Empty canvas'))}
              className="border border-line p-3 text-left hover:border-ink hover:bg-white transition-colors"
            >
              <span className="block text-[10px] tracking-[0.16em] uppercase text-primary-600 mb-2">{size.platform}</span>
              <span className="block text-sm font-medium">{size.label}</span>
              <span className="block text-xs text-mute mt-1">
                {size.w}×{size.h}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-2 mb-12">
          <label className="text-xs text-mute">
            Width
            <input
              type="number"
              min="400"
              max="4096"
              className="block w-24 border border-line px-2 py-1.5 bg-transparent text-sm text-ink"
              value={customW}
              onChange={(e) => setCustomW(e.target.value)}
            />
          </label>
          <label className="text-xs text-mute">
            Height
            <input
              type="number"
              min="400"
              max="4096"
              className="block w-24 border border-line px-2 py-1.5 bg-transparent text-sm text-ink"
              value={customH}
              onChange={(e) => setCustomH(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="border border-ink px-3 py-1.5 text-sm hover:bg-ink hover:text-paper"
            onClick={() => onNew(emptyDesign(customFormat(customW, customH), 'Empty canvas'))}
          >
            Open custom size
          </button>
          <span className="text-xs text-mute">Empty. Resize later in the editor.</span>
        </div>

        <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-3">Templates</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onNew(tpl.make())}
              className="border border-line text-left hover:border-ink hover:bg-white transition-colors overflow-hidden"
            >
              <div className="h-36 flex items-center justify-center bg-ink/5 border-b border-line">
                <Mini design={tpl.make()} />
              </div>
              <div className="p-3">
                <p className="font-medium">{tpl.name}</p>
                <p className="text-xs text-mute mt-1">{tpl.blurb}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-3">
          Saved on this computer ({posts.length}/{MAX_SAVED})
        </p>
        {posts.length === 0 ? (
          <p className="text-sm text-mute border border-dashed border-line p-8">Nothing saved yet. Open a template, then hit Save in the editor.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-line bg-white/40">
                <button type="button" className="w-full p-3 flex justify-center border-b border-line" onClick={() => onOpen(post)}>
                  <Mini design={post} />
                </button>
                <div className="p-3">
                  <p className="font-medium text-sm">{post.name}</p>
                    <p className="text-xs text-mute">
                      {post.format?.label}
                      {(post.slides?.length || 1) > 1 ? ` · ${post.slides.length} slides` : ''}
                    </p>
                  <div className="flex gap-3 mt-2">
                    <button type="button" className="text-xs hover:underline" onClick={() => onOpen(post)}>
                      Edit
                    </button>
                    <button type="button" className="text-xs hover:underline" onClick={() => onDuplicate(post)}>
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="text-xs text-primary-600 hover:underline"
                      onClick={() => {
                        if (window.confirm(`Delete “${post.name}”?`)) onDelete(post.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
