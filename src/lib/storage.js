import { normalizeDesign } from './design';

const KEY = 'tychora-studio-posts';
export const MAX_SAVED = 10;

export function loadPosts() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.map(normalizeDesign) : [];
  } catch {
    return [];
  }
}

export function savePosts(list) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
}

export function upsertPost(post) {
  const list = loadPosts();
  const next = { ...post, updatedAt: Date.now() };
  const index = list.findIndex((item) => item.id === next.id);
  if (index >= 0) {
    list[index] = next;
  } else {
    list.unshift(next);
  }
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  const trimmed = list.slice(0, MAX_SAVED);
  savePosts(trimmed);
  return trimmed;
}

export function deletePost(id) {
  const list = loadPosts().filter((item) => item.id !== id);
  savePosts(list);
  return list;
}

export function duplicatePost(post) {
  const copy = {
    ...JSON.parse(JSON.stringify(post)),
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${post.name} copy`,
    updatedAt: Date.now(),
  };
  return upsertPost(copy);
}

const GALLERY_KEY = 'tychora-studio-gallery';
export const MAX_GALLERY = 16;

export function loadGallery() {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function addGalleryPhoto(src) {
  const list = loadGallery();
  list.unshift({ id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, src });
  const next = list.slice(0, MAX_GALLERY);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(next));
  return next;
}

export function removeGalleryPhoto(id) {
  const next = loadGallery().filter((item) => item.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(next));
  return next;
}
