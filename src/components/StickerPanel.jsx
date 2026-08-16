import React, { useState } from 'react';
import { EMOJI_GROUPS, ICONS, firstGrapheme } from '../lib/stickers';
import IconGlyph from './IconGlyph';

export default function StickerPanel({ onAddIcon, onAddEmoji }) {
  const [tab, setTab] = useState('icons');
  const [group, setGroup] = useState(EMOJI_GROUPS[0].id);
  const [custom, setCustom] = useState('');
  const emojis = EMOJI_GROUPS.find((g) => g.id === group)?.items || [];

  const addCustom = () => {
    const mark = firstGrapheme(custom);
    if (!mark) return;
    onAddEmoji(mark);
    setCustom('');
  };

  return (
    <div className="mt-5">
      <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-2">Icons & emojis</p>
      <div className="flex gap-1 mb-2">
        {['icons', 'emojis'].map((id) => (
          <button
            key={id}
            type="button"
            className={`flex-1 text-xs py-1 border ${tab === id ? 'border-ink bg-white' : 'border-line'}`}
            onClick={() => setTab(id)}
          >
            {id === 'icons' ? 'Icons' : 'Emojis'}
          </button>
        ))}
      </div>
      {tab === 'icons' ? (
        <div className="grid grid-cols-5 gap-1">
          {ICONS.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              className="aspect-square border border-line hover:border-ink hover:bg-white p-1.5 flex items-center justify-center"
              onClick={() => onAddIcon(item.id)}
            >
              <IconGlyph name={item.id} color="#12151A" className="w-5 h-5" />
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 mb-2">
            {EMOJI_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`text-[10px] px-1.5 py-0.5 border ${group === g.id ? 'border-ink' : 'border-line'}`}
                onClick={() => setGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {emojis.map((mark) => (
              <button
                key={mark}
                type="button"
                className="aspect-square border border-line hover:border-ink hover:bg-white text-lg leading-none"
                onClick={() => onAddEmoji(mark)}
              >
                {mark}
              </button>
            ))}
          </div>
          <div className="flex gap-1 mt-2">
            <input
              className="flex-1 border border-line px-2 py-1 bg-transparent text-sm min-w-0"
              placeholder="Paste emoji"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustom();
                }
              }}
            />
            <button type="button" className="border border-line px-2 text-xs" onClick={addCustom}>
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
}
