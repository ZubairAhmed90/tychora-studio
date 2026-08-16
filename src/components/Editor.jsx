import React, { useEffect, useRef, useState } from 'react';
import { CAPTIONS, COLORS, INK, PAPER, PHRASES, RED, SIZES, uid } from '../lib/brand';
import { MAX_SAVED, upsertPost } from '../lib/storage';
import { adaptFormat, addSlide, fullCaption, goSlide, moveSlide, normalizeDesign, removeSlide, syncSlide } from '../lib/design';
import { copyPngToClipboard, downloadDataUrl, exportCarouselZip, exportDesignPng, fileToDataUrl } from '../lib/exportPng';
import { EMOJI_GROUPS, ICONS, firstGrapheme } from '../lib/stickers';
import { QR_PRESETS } from '../lib/qr';
import CanvasBoard from './CanvasBoard';
import CropModal from './CropModal';
import IconGlyph from './IconGlyph';
import Preview from './Preview';
import StickerPanel from './StickerPanel';

const SNAP = 12;

export default function Editor({ design: initial, onBack, onSaved }) {
  const [design, setDesign] = useState(() => normalizeDesign(initial));
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(0.5);
  const [status, setStatus] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [showSafe, setShowSafe] = useState(false);
  const [guides, setGuides] = useState({});
  const [exportOpen, setExportOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [help, setHelp] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const history = useRef([normalizeDesign(initial)]);
  const histIndex = useRef(0);
  const fileRef = useRef(null);
  const bgFileRef = useRef(null);
  const clipRef = useRef(null);
  const designRef = useRef(design);
  designRef.current = design;

  useEffect(() => {
    setDesign(normalizeDesign(initial));
    history.current = [normalizeDesign(initial)];
    histIndex.current = 0;
  }, [initial.id]);

  const push = (next) => {
    const snapshot = syncSlide(typeof next === 'function' ? next(designRef.current) : next);
    const cut = history.current.slice(0, histIndex.current + 1);
    cut.push(snapshot);
    history.current = cut.slice(-50);
    histIndex.current = history.current.length - 1;
    setDesign(snapshot);
    setDirty(true);
    return snapshot;
  };

  const undo = () => {
    if (histIndex.current <= 0) return;
    histIndex.current -= 1;
    setDesign(history.current[histIndex.current]);
  };

  const redo = () => {
    if (histIndex.current >= history.current.length - 1) return;
    histIndex.current += 1;
    setDesign(history.current[histIndex.current]);
  };

  const selected = design.elements.find((el) => el.id === selectedId);

  const patchEl = (id, patch) => {
    push({
      ...designRef.current,
      elements: designRef.current.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    });
  };

  const livePatch = (id, patch, opts) => {
    const apply = (prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    });
    const next = apply(designRef.current);
    const el = next.elements.find((item) => item.id === id);
    const g = {};
    if (el) {
      const cx = Math.round((next.format.w - el.w) / 2);
      const cy = Math.round((next.format.h - el.h) / 2);
      if (Math.abs(el.x - cx) < SNAP) {
        el.x = cx;
        g.x = next.format.w / 2;
      }
      if (Math.abs(el.y - cy) < SNAP) {
        el.y = cy;
        g.y = next.format.h / 2;
      }
    }
    setGuides(g);
    setDesign(next);
    setDirty(true);
    if (!opts?.live) push(next);
  };

  const addEl = (el) => {
    const d = designRef.current;
    const maxZ = d.elements.reduce((m, item) => Math.max(m, item.z || 0), 0);
    const next = { ...el, z: maxZ + 1, opacity: el.opacity == null ? 1 : el.opacity, locked: false };
    push({ ...d, elements: [...d.elements, next] });
    setSelectedId(next.id);
  };

  const removeSelected = () => {
    const id = selectedId;
    if (!id) {
      flash('Select a layer first');
      return;
    }
    const d = designRef.current;
    push({ ...d, elements: d.elements.filter((item) => item.id !== id) });
    setSelectedId(null);
    flash('Deleted');
  };

  const removeLayer = (id) => {
    const d = designRef.current;
    push({ ...d, elements: d.elements.filter((item) => item.id !== id) });
    if (selectedId === id) setSelectedId(null);
    flash('Deleted');
  };

  const duplicateSelected = () => {
    if (!selected) return;
    addEl({ ...selected, id: uid(), x: selected.x + 24, y: selected.y + 24, locked: false });
  };

  const addText = (preset) => {
    addEl({
      id: uid(),
      type: 'text',
      x: 80,
      y: 200,
      w: 520,
      h: preset.h,
      rotation: 0,
      content: preset.content,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fontFamily: preset.fontFamily,
      color: design.background?.value === INK ? PAPER : INK,
      align: 'left',
      lineHeight: 1.2,
    });
  };

  const addShape = (kind) => {
    const circle = kind === 'circle';
    const round = kind === 'round';
    addEl({
      id: uid(),
      type: 'shape',
      shape: circle ? 'circle' : 'rect',
      x: 120,
      y: 160,
      w: circle ? 160 : round ? 280 : 240,
      h: circle ? 160 : round ? 160 : 16,
      fill: RED,
      rotation: 0,
      radius: round ? 16 : 0,
    });
  };

  const addImageFromFile = async (file) => {
    const src = await fileToDataUrl(file);
    addEl({ id: uid(), type: 'image', src, x: 80, y: 160, w: 480, h: 320, rotation: 0, fit: 'cover' });
  };

  const stickerBox = (size = 96) => ({
    x: Math.round((design.format.w - size) / 2),
    y: Math.round((design.format.h - size) / 2),
    w: size,
    h: size,
    rotation: 0,
  });

  const addIcon = (iconId) => {
    addEl({
      id: uid(),
      type: 'icon',
      icon: iconId,
      color: design.background?.value === INK ? PAPER : INK,
      badge: false,
      badgeFill: RED,
      badgeInk: PAPER,
      ...stickerBox(),
    });
  };

  const addEmoji = (mark) => {
    const content = firstGrapheme(mark);
    if (!content) return;
    addEl({
      id: uid(),
      type: 'emoji',
      content,
      ...stickerBox(112),
    });
  };

  const addQr = (value = 'https://tychora.com') => {
    addEl({
      id: uid(),
      type: 'qr',
      value,
      color: design.background?.value === INK ? PAPER : INK,
      bg: design.background?.value === INK ? INK : PAPER,
      ...stickerBox(180),
    });
  };

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(''), 2200);
  };

  const save = () => {
    const snapshot = syncSlide(designRef.current);
    setDesign(snapshot);
    const list = upsertPost(snapshot);
    onSaved(list);
    setDirty(false);
    flash(list.length >= MAX_SAVED ? `Saved (${list.length}/${MAX_SAVED})` : 'Saved on this computer');
  };

  const download = async (kind = 'png', scale = 1) => {
    flash('Preparing file…');
    const type = kind === 'jpg' ? 'image/jpeg' : 'image/png';
    const url = await exportDesignPng(designRef.current, { scale, type });
    const ext = kind === 'jpg' ? 'jpg' : 'png';
    downloadDataUrl(url, `${designRef.current.name.replace(/\s+/g, '-').toLowerCase()}${scale > 1 ? '@2x' : ''}.${ext}`);
    flash('Downloaded');
    setExportOpen(false);
  };

  const copyImage = async () => {
    try {
      const url = await exportDesignPng(designRef.current);
      await copyPngToClipboard(url);
      flash('Copied image');
    } catch {
      flash('Copy failed — download instead');
    }
  };

  const copyCaption = async () => {
    const text = fullCaption(design);
    if (!text) {
      flash('No caption yet');
      return;
    }
    await navigator.clipboard.writeText(text);
    flash('Caption copied');
  };

  const downloadCaption = () => {
    const text = fullCaption(designRef.current);
    if (!text) {
      flash('No caption yet');
      return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    downloadDataUrl(URL.createObjectURL(blob), `${designRef.current.name.replace(/\s+/g, '-').toLowerCase()}-caption.txt`);
    flash('Caption file downloaded');
    setExportOpen(false);
  };

  const downloadAllSlides = async () => {
    const d = syncSlide(designRef.current);
    flash('Exporting slides…');
    for (let i = 0; i < d.slides.length; i += 1) {
      const slide = d.slides[i];
      const one = { ...d, background: slide.background, elements: slide.elements };
      const url = await exportDesignPng(one);
      downloadDataUrl(url, `${d.name.replace(/\s+/g, '-').toLowerCase()}-slide-${i + 1}.png`);
    }
    flash('Slides downloaded');
    setExportOpen(false);
  };

  const downloadZip = async () => {
    flash('Building zip…');
    try {
      await exportCarouselZip(designRef.current);
      flash('Zip downloaded');
    } catch {
      flash('Zip failed — try All slides PNG');
    }
    setExportOpen(false);
  };

  useEffect(() => {
    if (!dirty) return undefined;
    const t = setTimeout(() => {
      const snapshot = syncSlide(designRef.current);
      const list = upsertPost(snapshot);
      onSaved(list);
      setDirty(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [design, dirty]);

  const alignTo = (where) => {
    if (!selected) return;
    const { w, h } = design.format;
    const patch = {};
    if (where === 'left') patch.x = 48;
    if (where === 'center') patch.x = Math.round((w - selected.w) / 2);
    if (where === 'right') patch.x = w - selected.w - 48;
    if (where === 'top') patch.y = 48;
    if (where === 'middle') patch.y = Math.round((h - selected.h) / 2);
    if (where === 'bottom') patch.y = h - selected.h - 48;
    patchEl(selected.id, patch);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      const d = designRef.current;
      const sel = d.elements.find((el) => el.id === selectedId);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        removeSelected();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        setHelp(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && sel) {
        clipRef.current = JSON.parse(JSON.stringify(sel));
        flash('Copied layer');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipRef.current) {
        e.preventDefault();
        addEl({ ...clipRef.current, id: uid(), x: clipRef.current.x + 24, y: clipRef.current.y + 24 });
      }
      if (sel && !sel.locked && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        patchEl(sel.id, { x: sel.x + dx, y: sel.y + dy });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const toolBtn = 'w-full text-left px-3 py-2 text-sm border border-line hover:border-ink hover:bg-white transition-colors';

  return (
    <div className="h-full flex flex-col">
      <header className="h-14 border-b border-line flex items-center gap-3 px-4 bg-paper shrink-0">
        <button type="button" onClick={onBack} className="text-sm text-mute hover:text-ink">
          ← Library
        </button>
        <input
          value={design.name}
          onChange={(e) => {
            setDesign({ ...design, name: e.target.value });
            setDirty(true);
          }}
          className="flex-1 max-w-xs bg-transparent font-semibold tracking-wide outline-none border-b border-transparent focus:border-ink"
        />
        <span className="text-xs text-mute hidden lg:inline">
          {design.format.label} · {design.format.w}×{design.format.h}
          {dirty ? ' · unsaved' : ''}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {status && <span className="text-xs text-mute">{status}</span>}
          <button type="button" onClick={() => setHelp(true)} className="px-2 py-1.5 text-sm border border-line hover:border-ink">
            ?
          </button>
          <button type="button" onClick={() => setPreview(true)} className="px-2 py-1.5 text-sm border border-line hover:border-ink">
            Preview
          </button>
          <button type="button" onClick={undo} className="px-2 py-1.5 text-sm border border-line hover:border-ink">
            Undo
          </button>
          <button type="button" onClick={redo} className="px-2 py-1.5 text-sm border border-line hover:border-ink">
            Redo
          </button>
          <button type="button" onClick={save} className="px-3 py-1.5 text-sm border border-ink hover:bg-ink hover:text-paper">
            Save
          </button>
          <div className="relative">
            <button type="button" onClick={() => setExportOpen((v) => !v)} className="px-3 py-1.5 text-sm bg-primary-600 text-white hover:bg-primary-700">
              Export
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 border border-line bg-paper z-40 text-sm">
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={() => download('png', 1)}>
                  PNG
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={() => download('png', 2)}>
                  PNG @2x
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={() => download('jpg', 1)}>
                  JPG
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={copyImage}>
                  Copy image
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={copyCaption}>
                  Copy caption
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={downloadCaption}>
                  Caption .txt
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={downloadZip}>
                  Carousel zip
                </button>
                <button type="button" className="block w-full text-left px-3 py-2 hover:bg-white" onClick={downloadAllSlides}>
                  All slides PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-11 border-b border-line flex items-center gap-2 px-4 bg-paper shrink-0 overflow-x-auto">
        <span className="text-[10px] tracking-[0.16em] uppercase text-mute shrink-0">Carousel</span>
        {(design.slides || []).map((slide, i) => (
          <button
            key={slide.id || i}
            type="button"
            className={`px-2.5 py-1 text-xs border shrink-0 ${i === (design.slideIndex || 0) ? 'border-ink bg-ink text-paper' : 'border-line'}`}
            onClick={() => {
              push(goSlide(design, i));
              setSelectedId(null);
            }}
          >
            {i + 1}
          </button>
        ))}
        <button type="button" className="px-2 py-1 text-xs border border-line shrink-0" onClick={() => { push(addSlide(design)); setSelectedId(null); }}>
          + Slide
        </button>
        <button type="button" className="px-2 py-1 text-xs border border-line shrink-0" onClick={() => push(moveSlide(design, -1))}>
          ←
        </button>
        <button type="button" className="px-2 py-1 text-xs border border-line shrink-0" onClick={() => push(moveSlide(design, 1))}>
          →
        </button>
        {(design.slides || []).length > 1 && (
          <button type="button" className="px-2 py-1 text-xs text-primary-600 shrink-0" onClick={() => { push(removeSlide(design)); setSelectedId(null); }}>
            Remove slide
          </button>
        )}
      </div>

      <div className="flex-1 flex min-h-0">
        <aside className="w-56 border-r border-line p-3 overflow-auto shrink-0 bg-paper">
          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-2">Add</p>
          <div className="flex flex-col gap-1.5">
            <button type="button" className={toolBtn} onClick={() => addText({ content: 'Headline', fontSize: 48, fontWeight: 400, fontFamily: 'serif', h: 80 })}>
              Headline
            </button>
            <button type="button" className={toolBtn} onClick={() => addText({ content: 'Body copy', fontSize: 22, fontWeight: 400, fontFamily: 'sans', h: 70 })}>
              Body text
            </button>
            <button type="button" className={toolBtn} onClick={() => addText({ content: 'hello@tychora.com', fontSize: 18, fontWeight: 600, fontFamily: 'sans', h: 40 })}>
              Contact line
            </button>
            <button type="button" className={toolBtn} onClick={() => fileRef.current?.click()}>
              Photo
            </button>
            <button type="button" className={toolBtn} onClick={() => addShape('rect')}>
              Bar
            </button>
            <button type="button" className={toolBtn} onClick={() => addShape('round')}>
              Rounded box
            </button>
            <button type="button" className={toolBtn} onClick={() => addShape('circle')}>
              Circle
            </button>
            <button type="button" className={toolBtn} onClick={() => addText({ content: '01', fontSize: 28, fontWeight: 700, fontFamily: 'sans', h: 48 })}>
              Number stamp
            </button>
            <button type="button" className={toolBtn} onClick={() => addText({ content: '→', fontSize: 64, fontWeight: 400, fontFamily: 'serif', h: 80 })}>
              Arrow
            </button>
            <button type="button" className={toolBtn} onClick={() => addText({ content: '“', fontSize: 96, fontWeight: 400, fontFamily: 'serif', h: 100 })}>
              Quote mark
            </button>
            <button
              type="button"
              className={toolBtn}
              onClick={() =>
                addEl({
                  id: uid(),
                  type: 'logo',
                  x: 64,
                  y: 48,
                  w: 300,
                  h: 56,
                  inverted: design.background?.value === INK,
                  rotation: 0,
                })
              }
            >
              Tychora logo
            </button>
            <button type="button" className={toolBtn} onClick={() => addQr('https://tychora.com')}>
              QR code
            </button>
          </div>
          <StickerPanel onAddIcon={addIcon} onAddEmoji={addEmoji} />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) addImageFromFile(f); }} />
          <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (!f) return; const src = await fileToDataUrl(f); push({ ...design, background: { ...design.background, image: src } }); }} />

          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mt-5 mb-2">Brand lines</p>
          <div className="flex flex-col gap-1">
            {PHRASES.map((p) => (
              <button key={p.label} type="button" className="text-left text-xs text-mute hover:text-ink" onClick={() => addText({ content: p.text, fontSize: 22, fontWeight: 400, fontFamily: 'sans', h: 80 })}>
                {p.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mt-5 mb-2">Background</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {COLORS.map((c) => (
              <button key={c} type="button" className="w-7 h-7 border border-line" style={{ background: c }} onClick={() => push({ ...design, background: { type: 'color', value: c, image: design.background?.image } })} />
            ))}
          </div>
          <button type="button" className={`${toolBtn} mt-1`} onClick={() => push({ ...design, background: { type: 'gradient', value: PAPER, value2: INK, image: design.background?.image } })}>
            Gradient paper → ink
          </button>
          <button type="button" className={`${toolBtn} mt-1`} onClick={() => push({ ...design, background: { type: 'gradient', value: INK, value2: RED, image: design.background?.image } })}>
            Gradient ink → red
          </button>
          <button type="button" className={`${toolBtn} mt-1`} onClick={() => bgFileRef.current?.click()}>
            Background photo
          </button>
          {design.background?.image && (
            <button type="button" className="mt-1 text-xs text-primary-600" onClick={() => push({ ...design, background: { ...design.background, image: null } })}>
              Remove background photo
            </button>
          )}

          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mt-5 mb-2">Size</p>
          <select
            className="w-full text-sm border border-line bg-transparent px-2 py-2"
            value={design.format.id}
            onChange={(e) => {
              const size = SIZES.find((s) => s.id === e.target.value);
              if (size) push(adaptFormat(design, size));
            }}
          >
            {SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mt-5 mb-2">View</p>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
            Grid
          </label>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" checked={showSafe} onChange={(e) => setShowSafe(e.target.checked)} />
            Safe margins
          </label>
          <div className="flex gap-1 mb-1">
            <button type="button" className="flex-1 border border-line text-xs py-1" onClick={() => setZoom(0.35)}>
              Fit
            </button>
            <button type="button" className="flex-1 border border-line text-xs py-1" onClick={() => setZoom(0.5)}>
              50%
            </button>
            <button type="button" className="flex-1 border border-line text-xs py-1" onClick={() => setZoom(1)}>
              100%
            </button>
          </div>
          <input type="range" min="0.2" max="1.2" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
        </aside>

        <CanvasBoard
          design={design}
          selectedId={selectedId}
          onSelect={setSelectedId}
          zoom={zoom}
          showGrid={showGrid}
          showSafe={showSafe}
          guides={guides}
          onDropFile={addImageFromFile}
          onEditText={(id) => {
            const el = design.elements.find((item) => item.id === id);
            if (!el) return;
            if (el.type === 'emoji') {
              const next = window.prompt('Change emoji', el.content);
              if (next != null) patchEl(id, { content: firstGrapheme(next) || el.content });
              return;
            }
            const next = window.prompt('Edit text', el.content);
            if (next != null) patchEl(id, { content: next });
          }}
          onChangeElement={(id, patch, opts) => livePatch(id, patch, opts)}
          onDragEnd={() => {
            setGuides({});
            push(designRef.current);
          }}
        />

        <aside className="w-72 border-l border-line p-4 overflow-auto shrink-0 bg-paper">
          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-2">Caption (LinkedIn / Facebook)</p>
          <textarea
            className="w-full border border-line p-2 bg-transparent text-sm min-h-[88px] mb-1"
            placeholder="Write the post text to paste with the image…"
            value={design.caption || ''}
            onChange={(e) => {
              const next = { ...designRef.current, caption: e.target.value };
              setDesign(next);
              setDirty(true);
            }}
          />
          <textarea
            className="w-full border border-line p-2 bg-transparent text-sm min-h-[52px] mb-1"
            placeholder="#Tychora #CRM"
            value={design.hashtags || ''}
            onChange={(e) => {
              const next = { ...designRef.current, hashtags: e.target.value };
              setDesign(next);
              setDirty(true);
            }}
          />
          <p className="text-[11px] text-mute mb-2">{fullCaption(design).length} characters with hashtags</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {CAPTIONS.map((c) => (
              <button
                key={c.name}
                type="button"
                className="text-xs border border-line px-2 py-1 hover:border-ink"
                onClick={() => {
                  setDesign({ ...design, caption: c.body, hashtags: c.tags });
                  setDirty(true);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {!selected ? (
            <div>
              <p className="text-sm text-mute mb-4">Select a layer. Drag to move. Arrow keys nudge. Drop a photo onto the canvas. Every layer can be edited, moved, or deleted. Save keeps the draft on this computer.</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-[10px] tracking-[0.2em] uppercase text-mute">{selected.type}</p>
              {selected.type === 'text' && (
                <>
                  <textarea className="w-full border border-line p-2 bg-transparent min-h-[90px]" value={selected.content} onChange={(e) => patchEl(selected.id, { content: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs text-mute">Size
                      <input type="number" className="w-full border border-line px-2 py-1 bg-transparent" value={selected.fontSize} onChange={(e) => patchEl(selected.id, { fontSize: Number(e.target.value) })} />
                    </label>
                    <label className="text-xs text-mute">Weight
                      <select className="w-full border border-line px-2 py-1 bg-transparent" value={selected.fontWeight} onChange={(e) => patchEl(selected.id, { fontWeight: Number(e.target.value) })}>
                        <option value={400}>Regular</option>
                        <option value={500}>Medium</option>
                        <option value={600}>Semibold</option>
                        <option value={700}>Bold</option>
                      </select>
                    </label>
                    <label className="text-xs text-mute">Line
                      <input type="number" step="0.1" className="w-full border border-line px-2 py-1 bg-transparent" value={selected.lineHeight || 1.2} onChange={(e) => patchEl(selected.id, { lineHeight: Number(e.target.value) })} />
                    </label>
                    <label className="text-xs text-mute">Tracking
                      <input type="number" className="w-full border border-line px-2 py-1 bg-transparent" value={selected.letterSpacing || 0} onChange={(e) => patchEl(selected.id, { letterSpacing: Number(e.target.value) })} />
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { fontFamily: 'sans' })}>Sans</button>
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { fontFamily: 'serif' })}>Serif</button>
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { italic: !selected.italic })}>Italic</button>
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { uppercase: !selected.uppercase })}>AA</button>
                  </div>
                  <div className="flex gap-1">
                    {['left', 'center', 'right'].map((align) => (
                      <button key={align} type="button" className="flex-1 border border-line py-1 capitalize" onClick={() => patchEl(selected.id, { align })}>{align}</button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!selected.shadow} onChange={(e) => patchEl(selected.id, { shadow: e.target.checked })} />
                    Shadow
                  </label>
                </>
              )}
              {(selected.type === 'text' || selected.type === 'shape') && (
                <>
                  <p className="text-xs text-mute">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button key={c} type="button" className="w-6 h-6 border border-line" style={{ background: c }} onClick={() => patchEl(selected.id, selected.type === 'text' ? { color: c } : { fill: c })} />
                    ))}
                    <input type="color" value={selected.type === 'text' ? selected.color : selected.fill} onChange={(e) => patchEl(selected.id, selected.type === 'text' ? { color: e.target.value } : { fill: e.target.value })} />
                  </div>
                </>
              )}
              {selected.type === 'shape' && selected.shape !== 'circle' && (
                <label className="text-xs text-mute block">Corner
                  <input type="range" min="0" max="80" className="w-full" value={selected.radius || 0} onChange={(e) => patchEl(selected.id, { radius: Number(e.target.value) })} />
                </label>
              )}
              {selected.type === 'logo' && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!selected.inverted} onChange={(e) => patchEl(selected.id, { inverted: e.target.checked })} />
                  Light logo
                </label>
              )}
              {selected.type === 'icon' && (
                <>
                  <p className="text-xs text-mute">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button key={c} type="button" className="w-6 h-6 border border-line" style={{ background: c }} onClick={() => patchEl(selected.id, { color: c })} />
                    ))}
                    <input type="color" value={selected.color || INK} onChange={(e) => patchEl(selected.id, { color: e.target.value })} />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!selected.badge} onChange={(e) => patchEl(selected.id, { badge: e.target.checked })} />
                    Circle badge
                  </label>
                  {selected.badge && (
                    <>
                      <p className="text-xs text-mute">Badge fill</p>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((c) => (
                          <button key={c} type="button" className="w-6 h-6 border border-line" style={{ background: c }} onClick={() => patchEl(selected.id, { badgeFill: c })} />
                        ))}
                      </div>
                    </>
                  )}
                  <label className="text-xs text-mute block">Size
                    <input
                      type="range"
                      min="40"
                      max="360"
                      className="w-full"
                      value={selected.w}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        patchEl(selected.id, { w: n, h: n });
                      }}
                    />
                  </label>
                  <p className="text-xs text-mute">Replace</p>
                  <div className="grid grid-cols-6 gap-1 max-h-36 overflow-auto">
                    {ICONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        title={item.label}
                        className={`aspect-square border p-1 flex items-center justify-center ${selected.icon === item.id ? 'border-ink' : 'border-line'}`}
                        onClick={() => patchEl(selected.id, { icon: item.id })}
                      >
                        <IconGlyph name={item.id} color={INK} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </>
              )}
              {selected.type === 'emoji' && (
                <>
                  <label className="text-xs text-mute block">Emoji
                    <input
                      className="w-full border border-line px-2 py-1 bg-transparent text-2xl"
                      value={selected.content}
                      onChange={(e) => patchEl(selected.id, { content: firstGrapheme(e.target.value) || selected.content })}
                    />
                  </label>
                  <label className="text-xs text-mute block">Size
                    <input
                      type="range"
                      min="40"
                      max="400"
                      className="w-full"
                      value={selected.w}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        patchEl(selected.id, { w: n, h: n });
                      }}
                    />
                  </label>
                  <p className="text-xs text-mute">Replace</p>
                  <div className="grid grid-cols-6 gap-1 max-h-40 overflow-auto">
                    {EMOJI_GROUPS.flatMap((g) => g.items).map((mark, i) => (
                      <button
                        key={`${mark}-${i}`}
                        type="button"
                        className={`aspect-square border text-lg ${selected.content === mark ? 'border-ink' : 'border-line'}`}
                        onClick={() => patchEl(selected.id, { content: mark })}
                      >
                        {mark}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {selected.type === 'image' && (
                <>
                  <button type="button" className="w-full border border-line py-2" onClick={() => fileRef.current?.click()}>Replace photo</button>
                  <div className="flex gap-1">
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { fit: 'cover' })}>Fill</button>
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { fit: 'contain' })}>Fit</button>
                    <button type="button" className="flex-1 border border-line py-1" onClick={() => patchEl(selected.id, { flipX: !selected.flipX })}>Flip</button>
                  </div>
                  <label className="text-xs text-mute block">Corner
                    <input type="range" min="0" max="80" className="w-full" value={selected.radius || 0} onChange={(e) => patchEl(selected.id, { radius: Number(e.target.value) })} />
                  </label>
                  <label className="text-xs text-mute block">Dark overlay
                    <input type="range" min="0" max="0.7" step="0.05" className="w-full" value={selected.overlayOpacity || 0} onChange={(e) => patchEl(selected.id, { overlay: '#12151A', overlayOpacity: Number(e.target.value) })} />
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.filter === 'grayscale'}
                      onChange={(e) => patchEl(selected.id, { filter: e.target.checked ? 'grayscale' : undefined })}
                    />
                    Grayscale
                  </label>
                  <button type="button" className="w-full border border-line py-2" onClick={() => setCropOpen(true)}>
                    Crop
                  </button>
                  <label className="text-xs text-mute block">Zoom
                    <input type="range" min="1" max="3" step="0.05" className="w-full" value={selected.zoom || 1} onChange={(e) => patchEl(selected.id, { zoom: Number(e.target.value), fit: 'cover' })} />
                  </label>
                  <label className="text-xs text-mute block">Pan X
                    <input type="range" min="0" max="1" step="0.01" className="w-full" value={selected.panX == null ? 0.5 : selected.panX} onChange={(e) => patchEl(selected.id, { panX: Number(e.target.value), fit: 'cover' })} />
                  </label>
                  <label className="text-xs text-mute block">Pan Y
                    <input type="range" min="0" max="1" step="0.01" className="w-full" value={selected.panY == null ? 0.5 : selected.panY} onChange={(e) => patchEl(selected.id, { panY: Number(e.target.value), fit: 'cover' })} />
                  </label>
                </>
              )}
              {selected.type === 'qr' && (
                <>
                  <label className="text-xs text-mute block">Link
                    <input
                      className="w-full border border-line px-2 py-1 bg-transparent"
                      value={selected.value || ''}
                      onChange={(e) => patchEl(selected.id, { value: e.target.value })}
                    />
                  </label>
                  <div className="flex gap-1">
                    {QR_PRESETS.map((p) => (
                      <button key={p.value} type="button" className="flex-1 border border-line py-1 text-xs" onClick={() => patchEl(selected.id, { value: p.value })}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-mute">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button key={c} type="button" className="w-6 h-6 border border-line" style={{ background: c }} onClick={() => patchEl(selected.id, { color: c })} />
                    ))}
                  </div>
                  <p className="text-xs text-mute">Background</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button key={`bg-${c}`} type="button" className="w-6 h-6 border border-line" style={{ background: c }} onClick={() => patchEl(selected.id, { bg: c })} />
                    ))}
                  </div>
                  <label className="text-xs text-mute block">Size
                    <input
                      type="range"
                      min="80"
                      max="420"
                      className="w-full"
                      value={selected.w}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        patchEl(selected.id, { w: n, h: n });
                      }}
                    />
                  </label>
                </>
              )}
              <div className="grid grid-cols-2 gap-2">
                {['x', 'y', 'w', 'h'].map((key) => (
                  <label key={key} className="text-xs text-mute uppercase">
                    {key}
                    <input
                      type="number"
                      className="w-full border border-line px-2 py-1 bg-transparent"
                      value={Math.round(selected[key] || 0)}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (['icon', 'emoji', 'qr'].includes(selected.type) && (key === 'w' || key === 'h')) {
                          patchEl(selected.id, { w: n, h: n });
                          return;
                        }
                        patchEl(selected.id, { [key]: n });
                      }}
                    />
                  </label>
                ))}
              </div>
              <label className="text-xs text-mute block">Rotate
                <input type="range" min="-180" max="180" className="w-full" value={selected.rotation || 0} onChange={(e) => patchEl(selected.id, { rotation: Number(e.target.value) })} />
              </label>
              <label className="text-xs text-mute block">Opacity
                <input type="range" min="0.1" max="1" step="0.05" className="w-full" value={selected.opacity == null ? 1 : selected.opacity} onChange={(e) => patchEl(selected.id, { opacity: Number(e.target.value) })} />
              </label>
              <p className="text-xs text-mute">Align to canvas</p>
              <div className="grid grid-cols-3 gap-1">
                {['left', 'center', 'right', 'top', 'middle', 'bottom'].map((w) => (
                  <button key={w} type="button" className="border border-line py-1 text-xs capitalize" onClick={() => alignTo(w)}>{w}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button type="button" className="border border-line py-2" onClick={() => patchEl(selected.id, { z: (selected.z || 1) + 1 })}>Forward</button>
                <button type="button" className="border border-line py-2" onClick={() => patchEl(selected.id, { z: Math.max(1, (selected.z || 1) - 1) })}>Back</button>
                <button type="button" className="border border-line py-2" onClick={() => patchEl(selected.id, { locked: !selected.locked })}>{selected.locked ? 'Unlock' : 'Lock'}</button>
                <button type="button" className="border border-line py-2" onClick={() => patchEl(selected.id, { hidden: !selected.hidden })}>{selected.hidden ? 'Show' : 'Hide'}</button>
                <button type="button" className="border border-line py-2" onClick={duplicateSelected}>Duplicate</button>
                <button
                  type="button"
                  className="border border-primary-600 text-primary-600 py-2"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={removeSelected}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
          <p className="text-[10px] tracking-[0.2em] uppercase text-mute mt-5 mb-2">Layers</p>
          <div className="flex flex-col gap-1">
            {[...design.elements].sort((a, b) => (b.z || 0) - (a.z || 0)).map((el) => (
              <div key={el.id} className="flex gap-1">
                <button
                  type="button"
                  className={`flex-1 text-left text-xs px-2 py-1.5 border min-w-0 ${el.id === selectedId ? 'border-ink' : 'border-line'}`}
                  onClick={() => setSelectedId(el.id)}
                >
                  {el.hidden ? '(hidden) ' : ''}
                  {el.locked ? '🔒 ' : ''}
                  {el.type === 'text' ? el.content.slice(0, 28) : el.type === 'emoji' ? el.content : el.type === 'icon' ? `icon · ${el.icon}` : el.type === 'qr' ? 'QR' : el.type}
                </button>
                <button
                  type="button"
                  className="px-2 border border-line text-primary-600 text-sm shrink-0"
                  title="Delete layer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => removeLayer(el.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
      {preview && <Preview design={design} onClose={() => setPreview(false)} />}
      {cropOpen && selected?.type === 'image' && (
        <CropModal
          el={selected}
          onClose={() => setCropOpen(false)}
          onApply={(patch) => {
            patchEl(selected.id, patch);
            setCropOpen(false);
          }}
        />
      )}
      {help && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-6" onClick={() => setHelp(false)}>
          <div className="bg-paper border border-line max-w-sm w-full p-5 text-sm" onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] tracking-[0.2em] uppercase text-mute mb-3">Shortcuts</p>
            <ul className="space-y-1 text-mute">
              <li>Ctrl+S save · autosave on</li>
              <li>Ctrl+Z undo · Ctrl+Y redo</li>
              <li>Ctrl+D duplicate · Ctrl+C / V copy layer</li>
              <li>Arrows nudge · Shift+arrows 10px</li>
              <li>Delete or × in Layers removes a layer (then Ctrl+Z to undo)</li>
              <li>Every layer is editable — text, logo, icon, photo, QR</li>
              <li>Save / autosave keeps the draft on this computer</li>
              <li>Click an icon or emoji to drop it on the canvas</li>
              <li>Icons and emojis stay square when you resize</li>
              <li>Double-click an emoji to change it</li>
              <li>Shift+resize keeps aspect ratio</li>
              <li>Drop a photo on the canvas</li>
              <li>Carousel: add slides, ← → to reorder</li>
              <li>Export → Carousel zip for all slides + caption</li>
              <li>QR code: website or email, drag and resize</li>
              <li>Photo: Crop, then drag to frame</li>
            </ul>
            <button type="button" className="mt-4 border border-ink px-3 py-1.5" onClick={() => setHelp(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
