import { uid } from './brand';

function ensureSlides(design) {
  if (!design) return design;
  if (design.slides?.length) {
    const i = Math.min(Math.max(0, design.slideIndex || 0), design.slides.length - 1);
    return {
      ...design,
      slideIndex: i,
      caption: design.caption || '',
      hashtags: design.hashtags || '',
    };
  }
  return {
    ...design,
    slideIndex: 0,
    slides: [{ id: uid(), background: design.background, elements: design.elements || [] }],
    caption: design.caption || '',
    hashtags: design.hashtags || '',
  };
}

export function normalizeDesign(raw) {
  const d = ensureSlides(raw);
  if (!d) return raw;
  const slide = d.slides[d.slideIndex || 0];
  return {
    ...d,
    background: slide.background,
    elements: slide.elements,
  };
}

export function syncSlide(design) {
  const d = ensureSlides(design);
  const i = d.slideIndex || 0;
  const slides = d.slides.map((slide, idx) =>
    idx === i ? { ...slide, background: d.background, elements: d.elements } : slide
  );
  return { ...d, slides };
}

function scaleEls(elements, sx, sy) {
  const s = Math.min(sx, sy);
  return (elements || []).map((el) => ({
    ...el,
    x: Math.round(el.x * sx),
    y: Math.round(el.y * sy),
    w: Math.round(el.w * sx),
    h: Math.round(el.h * sy),
    fontSize: el.fontSize ? Math.max(10, Math.round(el.fontSize * s)) : el.fontSize,
  }));
}

export function adaptFormat(design, size) {
  const d = syncSlide(design);
  const sx = size.w / d.format.w;
  const sy = size.h / d.format.h;
  const slides = d.slides.map((slide) => ({ ...slide, elements: scaleEls(slide.elements, sx, sy) }));
  const i = d.slideIndex || 0;
  return {
    ...d,
    format: { ...size },
    slides,
    elements: slides[i].elements,
    background: slides[i].background,
  };
}

export function addSlide(design) {
  const d = syncSlide(design);
  if (d.slides.length >= 8) return d;
  const current = d.slides[d.slideIndex || 0];
  const copy = {
    id: uid(),
    background: JSON.parse(JSON.stringify(current.background)),
    elements: JSON.parse(JSON.stringify(current.elements)).map((el) => ({ ...el, id: uid() })),
  };
  const slides = [...d.slides, copy];
  const i = slides.length - 1;
  return { ...d, slides, slideIndex: i, background: copy.background, elements: copy.elements };
}

export function duplicateSlide(design) {
  return addSlide(design);
}

export function removeSlide(design) {
  const d = syncSlide(design);
  if (d.slides.length <= 1) return d;
  const slides = d.slides.filter((_, idx) => idx !== d.slideIndex);
  const i = Math.min(d.slideIndex, slides.length - 1);
  return { ...d, slides, slideIndex: i, background: slides[i].background, elements: slides[i].elements };
}

export function goSlide(design, index) {
  const d = syncSlide(design);
  const i = Math.max(0, Math.min(index, d.slides.length - 1));
  const slide = d.slides[i];
  return { ...d, slideIndex: i, background: slide.background, elements: slide.elements };
}

export function moveSlide(design, dir) {
  const d = syncSlide(design);
  const i = d.slideIndex || 0;
  const j = i + dir;
  if (j < 0 || j >= d.slides.length) return d;
  const slides = [...d.slides];
  const tmp = slides[i];
  slides[i] = slides[j];
  slides[j] = tmp;
  return goSlide({ ...d, slides, slideIndex: i }, j);
}

export function fullCaption(design) {
  const cap = (design.caption || '').trim();
  const tags = (design.hashtags || '').trim();
  return [cap, tags].filter(Boolean).join('\n\n');
}

export function cloneIds(elements) {
  return (elements || []).map((el) => ({ ...el, id: uid() }));
}
