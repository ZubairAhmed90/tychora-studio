import { drawEmoji, drawIcon } from './stickers';
import { drawQr } from './qr';
import { fullCaption, syncSlide } from './design';
import { drawFrame } from './frame';

function wrapLines(ctx, text, maxWidth) {
  const paragraphs = String(text || '').split('\n');
  const lines = [];
  paragraphs.forEach((para) => {
    const words = para.split(' ');
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    lines.push(line);
  });
  return lines;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (/^https?:/i.test(src)) img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r || 0, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawLogo(ctx, el) {
  const ink = el.inverted ? '#F7F5F1' : '#12151A';
  const markFill = el.inverted ? 'rgba(255,255,255,0.12)' : '#12151A';
  const stroke = el.inverted ? '#F7F5F1' : '#E8E6E1';
  const pad = 4;
  const mark = Math.round(Math.min(el.h * 0.92, el.w * 0.22, el.h));
  const mx = el.x + pad;
  const my = el.y + (el.h - mark) / 2;
  ctx.fillStyle = markFill;
  ctx.fillRect(mx, my, mark, mark);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(2, mark * 0.08);
  ctx.lineCap = 'square';
  ctx.beginPath();
  ctx.moveTo(mx + mark * 0.22, my + mark * 0.28);
  ctx.lineTo(mx + mark * 0.78, my + mark * 0.28);
  ctx.moveTo(mx + mark * 0.5, my + mark * 0.28);
  ctx.lineTo(mx + mark * 0.5, my + mark * 0.78);
  ctx.stroke();

  const titleSize = Math.max(12, Math.round(el.h * 0.3));
  const subSize = Math.max(8, Math.round(el.h * 0.155));
  const tx = mx + mark + Math.max(8, mark * 0.18);
  const ty = el.y + el.h * 0.18;
  ctx.textBaseline = 'top';
  ctx.fillStyle = ink;
  ctx.font = `600 ${titleSize}px "IBM Plex Sans", sans-serif`;
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${Math.round(titleSize * 0.12)}px`;
  ctx.fillText('TYCH', tx, ty);
  const tychW = ctx.measureText('TYCH').width;
  const dot = titleSize * 0.52;
  const gap = titleSize * 0.1;
  ctx.fillStyle = '#C8102E';
  ctx.beginPath();
  ctx.arc(tx + tychW + gap + dot / 2, ty + titleSize * 0.42, dot / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.fillText('RA', tx + tychW + gap + dot + gap, ty);
  ctx.fillStyle = el.inverted ? 'rgba(247,245,241,0.6)' : '#5E6670';
  ctx.font = `500 ${subSize}px "IBM Plex Sans", sans-serif`;
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${Math.round(subSize * 0.2)}px`;
  ctx.fillText('TECHNOLOGIES', tx, ty + titleSize + Math.max(2, el.h * 0.04));
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
}

export async function exportDesignPng(design, { scale = 1, type = 'image/png', quality = 0.92 } = {}) {
  const w = Math.round(design.format.w * scale);
  const h = Math.round(design.format.h * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const bg = design.background || {};
  if (bg.type === 'gradient') {
    const g = ctx.createLinearGradient(0, 0, design.format.w, design.format.h);
    g.addColorStop(0, bg.value || '#F7F5F1');
    g.addColorStop(1, bg.value2 || '#12151A');
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = bg.value || '#F7F5F1';
  }
  ctx.fillRect(0, 0, design.format.w, design.format.h);
  if (design.background?.image) {
    try {
      const bg = await loadImage(design.background.image);
      ctx.drawImage(bg, 0, 0, design.format.w, design.format.h);
    } catch {
      /* keep fill */
    }
  }

  const layers = [...(design.elements || [])].filter((el) => !el.hidden).sort((a, b) => (a.z || 0) - (b.z || 0));
  for (const el of layers) {
    ctx.save();
    ctx.globalAlpha = el.opacity == null ? 1 : el.opacity;
    const cx = el.x + el.w / 2;
    const cy = el.y + el.h / 2;
    ctx.translate(cx, cy);
    if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
    if (el.flipX) ctx.scale(-1, 1);
    ctx.translate(-cx, -cy);

    if (el.type === 'shape') {
      ctx.fillStyle = el.fill || '#C8102E';
      if (el.shape === 'circle') {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        roundRect(ctx, el.x, el.y, el.w, el.h, el.radius || 0);
        ctx.fill();
      }
    }

    if (el.type === 'text') {
      const family = el.fontFamily === 'serif' ? '"Instrument Serif", Georgia, serif' : '"IBM Plex Sans", sans-serif';
      const italic = el.italic ? 'italic ' : '';
      ctx.fillStyle = el.color || '#12151A';
      ctx.font = `${italic}${el.fontWeight || 500} ${el.fontSize || 32}px ${family}`;
      ctx.textAlign = el.align || 'left';
      ctx.textBaseline = 'top';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${el.letterSpacing || 0}px`;
      const content = el.uppercase ? String(el.content || '').toUpperCase() : el.content;
      const lines = wrapLines(ctx, content, el.w);
      const lh = (el.fontSize || 32) * (el.lineHeight || 1.2);
      const startX = el.align === 'center' ? el.x + el.w / 2 : el.align === 'right' ? el.x + el.w : el.x;
      if (el.shadow) {
        ctx.shadowColor = 'rgba(18,21,26,0.35)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
      }
      lines.forEach((line, i) => ctx.fillText(line, startX, el.y + i * lh));
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    if (el.type === 'image' && el.src) {
      try {
        const img = await loadImage(el.src);
        ctx.save();
        if (el.filter === 'grayscale') ctx.filter = 'grayscale(1)';
        roundRect(ctx, el.x, el.y, el.w, el.h, el.radius || 0);
        ctx.clip();
        if (el.fit === 'contain') {
          const scaleFit = Math.min(el.w / img.width, el.h / img.height);
          const dw = img.width * scaleFit;
          const dh = img.height * scaleFit;
          ctx.drawImage(img, el.x + (el.w - dw) / 2, el.y + (el.h - dh) / 2, dw, dh);
        } else {
          const zoom = Math.max(1, Number(el.zoom) || 1);
          const panX = el.panX == null ? 0.5 : Number(el.panX);
          const panY = el.panY == null ? 0.5 : Number(el.panY);
          const scaleCover = Math.max(el.w / img.width, el.h / img.height) * zoom;
          const dw = img.width * scaleCover;
          const dh = img.height * scaleCover;
          ctx.drawImage(img, el.x + (el.w - dw) * panX, el.y + (el.h - dh) * panY, dw, dh);
        }
        if (el.overlayOpacity) {
          ctx.fillStyle = el.overlay || '#12151A';
          ctx.globalAlpha = el.overlayOpacity;
          ctx.fillRect(el.x, el.y, el.w, el.h);
          ctx.globalAlpha = el.opacity == null ? 1 : el.opacity;
        }
        ctx.restore();
      } catch {
        ctx.fillStyle = '#E4E0D8';
        ctx.fillRect(el.x, el.y, el.w, el.h);
      }
    }

    if (el.type === 'logo') {
      drawLogo(ctx, el);
    }

    if (el.type === 'icon') {
      drawIcon(ctx, el);
    }

    if (el.type === 'emoji') {
      drawEmoji(ctx, el);
    }

    if (el.type === 'qr') {
      drawQr(ctx, el);
    }

    if (el.type === 'video') {
      ctx.save();
      roundRect(ctx, el.x, el.y, el.w, el.h, el.radius || 0);
      ctx.clip();
      ctx.fillStyle = '#12151A';
      ctx.fillRect(el.x, el.y, el.w, el.h);
      if (el.poster) {
        try {
          const img = await loadImage(el.poster);
          const fit = el.fit || 'cover';
          if (fit === 'contain') {
            const scaleFit = Math.min(el.w / img.width, el.h / img.height);
            const dw = img.width * scaleFit;
            const dh = img.height * scaleFit;
            ctx.drawImage(img, el.x + (el.w - dw) / 2, el.y + (el.h - dh) / 2, dw, dh);
          } else {
            const scaleCover = Math.max(el.w / img.width, el.h / img.height);
            const dw = img.width * scaleCover;
            const dh = img.height * scaleCover;
            ctx.drawImage(img, el.x + (el.w - dw) / 2, el.y + (el.h - dh) / 2, dw, dh);
          }
        } catch {
          /* ink fill */
        }
      }
      const r = Math.min(36, Math.round(Math.min(el.w, el.h) * 0.12));
      ctx.fillStyle = '#C8102E';
      ctx.beginPath();
      ctx.arc(el.x + el.w / 2, el.y + el.h / 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F7F5F1';
      ctx.beginPath();
      ctx.moveTo(el.x + el.w / 2 - r * 0.28, el.y + el.h / 2 - r * 0.42);
      ctx.lineTo(el.x + el.w / 2 - r * 0.28, el.y + el.h / 2 + r * 0.42);
      ctx.lineTo(el.x + el.w / 2 + r * 0.48, el.y + el.h / 2);
      ctx.closePath();
      ctx.fill();
      if (el.showTitle !== false && el.title) {
        ctx.fillStyle = 'rgba(18,21,26,0.7)';
        ctx.fillRect(el.x, el.y + el.h - 36, el.w, 36);
        ctx.fillStyle = '#F7F5F1';
        ctx.font = '500 14px "IBM Plex Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(el.title).slice(0, 64), el.x + 12, el.y + el.h - 18, el.w - 24);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  drawFrame(ctx, design);

  return canvas.toDataURL(type, quality);
}

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function exportCarouselZip(design, { scale = 2 } = {}) {
  const JSZip = (await import('jszip')).default;
  const d = syncSlide(design);
  const zip = new JSZip();
  const slug = (d.name || 'tychora-post').replace(/\s+/g, '-').toLowerCase();
  for (let i = 0; i < d.slides.length; i += 1) {
    const slide = d.slides[i];
    const one = { ...d, background: slide.background, elements: slide.elements, frame: slide.frame || d.frame };
    const url = await exportDesignPng(one, { scale, type: 'image/png' });
    zip.file(`${slug}-${String(i + 1).padStart(2, '0')}.png`, url.split(',')[1], { base64: true });
  }
  const cap = fullCaption(d);
  if (cap) zip.file(`${slug}-caption.txt`, cap);
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${slug}.zip`);
}

export async function copyPngToClipboard(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

export async function fileToDataUrl(file, max = 1600) {
  const raw = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => resolve(raw);
    img.src = raw;
  });
}
