import React, { useEffect, useMemo, useState } from 'react';
import { exportDesignPng } from '../lib/exportPng';
import { fullCaption } from '../lib/design';
import { designVideos } from '../lib/video';
import { VideoPlayer } from './VideoLayer';

export default function Preview({ design, onClose }) {
  const [img, setImg] = useState('');
  const [play, setPlay] = useState(false);
  const caption = fullCaption(design);
  const videos = useMemo(() => designVideos(design), [design]);

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
            {play && videos[0] ? (
              <VideoPlayer el={videos[0]} autoPlay />
            ) : img ? (
              <img src={img} alt="" className="w-full" />
            ) : (
              <div className="h-40 bg-line/40" />
            )}
            <p className="px-3 py-2 text-[11px] text-mute">Like · Comment · Repost · Send</p>
          </div>
          {videos.length > 0 && (
            <div className="mt-3 flex gap-2">
              <button type="button" className="border border-ink px-3 py-1.5 text-sm" onClick={() => setPlay((v) => !v)}>
                {play ? 'Show still' : 'Play video'}
              </button>
              {videos.length > 1 && <p className="text-xs text-mute self-center">{videos.length} videos on this slide</p>}
            </div>
          )}
          {play && videos.slice(1).map((el) => (
            <div key={el.id} className="mt-3">
              <p className="text-xs text-mute mb-1 truncate">{el.title || 'Video'}</p>
              <VideoPlayer el={el} />
            </div>
          ))}
          <p className="text-xs text-mute mt-3">How the post reads on LinkedIn or Facebook. Copy the caption from Export. Play is a preview — the download is still the image.</p>
        </div>
      </div>
    </div>
  );
}
