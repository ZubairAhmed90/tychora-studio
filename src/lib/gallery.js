export function svgPhoto(markup) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">${markup}</svg>`
  )}`;
}

const brand = {
  paper: svgPhoto(
    `<rect width="1200" height="800" fill="#F7F5F1"/><path d="M0 720h1200" stroke="#C8102E" stroke-width="16"/><rect x="72" y="72" width="48" height="48" fill="#12151A"/>`
  ),
  ink: svgPhoto(
    `<rect width="1200" height="800" fill="#12151A"/><rect x="0" y="0" width="16" height="800" fill="#C8102E"/><circle cx="1080" cy="120" r="18" fill="#C8102E"/>`
  ),
  grid: svgPhoto(
    `<rect width="1200" height="800" fill="#F7F5F1"/><path d="M0 80h1200M0 160h1200M0 240h1200M0 320h1200M0 400h1200M0 480h1200M0 560h1200M0 640h1200M0 720h1200" stroke="#E4E0D8" stroke-width="1"/><path d="M80 0v800M160 0v800M240 0v800M320 0v800M400 0v800M480 0v800M560 0v800M640 0v800M720 0v800M800 0v800M880 0v800M960 0v800M1040 0v800M1120 0v800" stroke="#E4E0D8" stroke-width="1"/>`
  ),
  redField: svgPhoto(`<rect width="1200" height="800" fill="#C8102E"/><rect x="72" y="72" width="200" height="8" fill="#F7F5F1"/>`),
  split: svgPhoto(`<rect width="600" height="800" fill="#F7F5F1"/><rect x="600" width="600" height="800" fill="#12151A"/>`),
};

function unsplash(id, extra = '') {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80${extra}`;
}

export const GALLERY = [
  {
    id: 'brand',
    label: 'Brand',
    items: [
      { id: 'paper', label: 'Paper', src: brand.paper },
      { id: 'ink', label: 'Ink', src: brand.ink },
      { id: 'grid', label: 'Grid', src: brand.grid },
      { id: 'red', label: 'Red', src: brand.redField },
      { id: 'split', label: 'Split', src: brand.split },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      { id: 'team', label: 'Team', src: unsplash('photo-1522071820081-009f0129c71c') },
      { id: 'desk', label: 'At a desk', src: unsplash('photo-1573496359142-b8d87734a5a2') },
      { id: 'talk', label: 'Conversation', src: unsplash('photo-1551836022-d5d88e9218df') },
      { id: 'handshake', label: 'Handshake', src: unsplash('photo-1521791136064-7986c2920216') },
      { id: 'portrait', label: 'Portrait', src: unsplash('photo-1507003211169-0a1dd7228f2d') },
      { id: 'pair', label: 'Pair work', src: unsplash('photo-1519389950473-47ba0277781c') },
    ],
  },
  {
    id: 'office',
    label: 'Office',
    items: [
      { id: 'office', label: 'Office', src: unsplash('photo-1497366216548-37526070297c') },
      { id: 'laptop', label: 'Laptop', src: unsplash('photo-1517694712202-14dd9538aa97') },
      { id: 'meeting', label: 'Meeting', src: unsplash('photo-1552664730-d307ca884978') },
      { id: 'whiteboard', label: 'Whiteboard', src: unsplash('photo-1531482615713-2afd69097998') },
      { id: 'desk-top', label: 'Desk', src: unsplash('photo-1497215728101-856f4ea42174') },
      { id: 'city', label: 'City', src: unsplash('photo-1512453979798-5ea7f98d1e3e') },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    items: [
      { id: 'crowd', label: 'Room', src: unsplash('photo-1540575467063-178a50c2df87') },
      { id: 'stage', label: 'Talk', src: unsplash('photo-1475721027785-f74eccf877e2') },
      { id: 'workshop', label: 'Workshop', src: unsplash('photo-1558008258-3256797b43f3') },
      { id: 'notes', label: 'Notes', src: unsplash('photo-1434030216411-0b793f4b4173') },
      { id: 'coffee', label: 'Coffee', src: unsplash('photo-1511920170033-208997cb935b') },
      { id: 'evening', label: 'Evening', src: unsplash('photo-1492684223066-81342ee5ff30') },
    ],
  },
];

export function galleryItem(id) {
  for (const group of GALLERY) {
    const hit = group.items.find((item) => item.id === id);
    if (hit) return hit;
  }
  return GALLERY[0].items[0];
}
