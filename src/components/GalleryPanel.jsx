import React, { useRef, useState } from 'react';
import { GALLERY } from '../lib/gallery';
import { MAX_GALLERY, addGalleryPhoto, loadGallery, removeGalleryPhoto } from '../lib/storage';
import { fileToDataUrl } from '../lib/exportPng';

export default function GalleryPanel({ onAddPhoto, onBackground }) {
  const [group, setGroup] = useState(GALLERY[0].id);
  const [mine, setMine] = useState(() => loadGallery());
  const fileRef = useRef(null);
  const items = GALLERY.find((g) => g.id === group)?.items || [];

  const upload = async (file) => {
    if (!file) return;
    const src = await fileToDataUrl(file);
    setMine(addGalleryPhoto(src));
    onAddPhoto(src);
  };

  return (
    <div className="mt-5">
      <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-2">Photo gallery</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {GALLERY.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`text-[10px] px-1.5 py-0.5 border ${group === g.id ? 'border-ink bg-white' : 'border-line'}`}
            onClick={() => setGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
        <button
          type="button"
          className={`text-[10px] px-1.5 py-0.5 border ${group === 'yours' ? 'border-ink bg-white' : 'border-line'}`}
          onClick={() => setGroup('yours')}
        >
          Yours
        </button>
      </div>
      {group === 'yours' ? (
        <>
          <button type="button" className="w-full text-xs border border-line py-1.5 mb-2 hover:border-ink" onClick={() => fileRef.current?.click()}>
            Upload photo ({mine.length}/{MAX_GALLERY})
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) upload(f);
            }}
          />
          <div className="grid grid-cols-2 gap-1">
            {mine.map((item) => (
              <div key={item.id} className="relative">
                <button type="button" className="block w-full aspect-square border border-line overflow-hidden" onClick={() => onAddPhoto(item.src)}>
                  <img src={item.src} alt="" className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-paper/90 text-primary-600 text-xs border border-line"
                  onClick={() => setMine(removeGalleryPhoto(item.id))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {mine.length === 0 && <p className="text-[11px] text-mute">Upload office or event photos. They stay in this browser.</p>}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <button
                type="button"
                title={`${item.label} — click to add`}
                className="block w-full aspect-square border border-line overflow-hidden hover:border-ink"
                onClick={() => onAddPhoto(item.src)}
              >
                <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
              </button>
              <button
                type="button"
                className="absolute bottom-0.5 left-0.5 text-[9px] px-1 bg-paper/90 border border-line"
                onClick={() => onBackground(item.src)}
              >
                BG
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-mute mt-1">Click a photo to place it. BG sets the canvas background.</p>
    </div>
  );
}
