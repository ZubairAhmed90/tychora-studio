import React, { useEffect, useState } from 'react';
import { exportDesignPng } from '../lib/exportPng';
import { fullCaption } from '../lib/design';

export default function Preview({ design, onClose }) {
  const [img, setImg] = useState('');
  const caption = fullCaption(design);

  useEffect(() => {
    let live = true;
    exportDesignPng(design, { scale: 0.5 }).then((url) => {
      if (live) setImg(url);
    });
    return () => {
      live = false;
    };
  }, [design]);

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-paper border border-line max-w-lg w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-line flex items-center justify-between">
          <p className="text-[10px] tracking-[0.2em] uppercase text-mute">Feed preview</p>
          <button type="button" className="text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-4">
          <div className="border border-line bg-white">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-line">
              <span className="w-8 h-8 bg-ink rounded-full" />
              <div>
                <p className="text-sm font-semibold">Tychora Technologies</p>
                <p className="text-[11px] text-mute">Karachi · Software</p>
              </div>
            </div>
            {caption && <p className="px-3 py-2 text-sm whitespace-pre-wrap">{caption}</p>}
            {img ? <img src={img} alt="" className="w-full" /> : <div className="h-40 bg-line/40" />}
            <p className="px-3 py-2 text-[11px] text-mute">Like · Comment · Repost · Send</p>
          </div>
          <p className="text-xs text-mute mt-3">How the post reads on LinkedIn or Facebook. Copy the caption from Export.</p>
        </div>
      </div>
    </div>
  );
}
