import { uid, SIZES, INK, PAPER, RED, MUTE } from './brand';

function text(partial) {
  return {
    id: uid(),
    type: 'text',
    x: 80,
    y: 80,
    w: 400,
    h: 80,
    rotation: 0,
    z: 1,
    content: 'Text',
    fontSize: 32,
    fontWeight: 600,
    fontFamily: 'sans',
    color: INK,
    align: 'left',
    lineHeight: 1.2,
    ...partial,
  };
}

function shape(partial) {
  return {
    id: uid(),
    type: 'shape',
    x: 0,
    y: 0,
    w: 120,
    h: 8,
    rotation: 0,
    z: 1,
    shape: 'rect',
    fill: RED,
    ...partial,
  };
}

function logo(partial) {
  return {
    id: uid(),
    type: 'logo',
    x: 64,
    y: 48,
    w: 280,
    h: 56,
    rotation: 0,
    z: 10,
    inverted: false,
    ...partial,
  };
}

export function blankDesign(size = SIZES[0], name = 'Untitled post') {
  return {
    id: uid(),
    name,
    updatedAt: Date.now(),
    format: { ...size },
    caption: '',
    hashtags: '',
    background: { type: 'color', value: PAPER },
    elements: [
      logo({ x: 64, y: 48 }),
      text({
        content: 'Write your headline',
        x: 64,
        y: size.h / 2 - 60,
        w: size.w - 128,
        h: 90,
        fontSize: 52,
        fontFamily: 'serif',
        fontWeight: 400,
      }),
    ],
  };
}

function base(sizeId, name, background, elements) {
  const size = SIZES.find((s) => s.id === sizeId) || SIZES[0];
  return {
    id: uid(),
    name,
    updatedAt: Date.now(),
    format: { ...size },
    caption: '',
    hashtags: '',
    background,
    elements,
  };
}

export const TEMPLATES = [
  {
    id: 'ready-software',
    name: 'Ready software',
    blurb: 'LinkedIn landscape',
    sizeId: 'linkedin',
    make: () =>
      base(
        'linkedin',
        'Ready software',
        { type: 'color', value: PAPER },
        [
          logo({ x: 64, y: 48 }),
          shape({ x: 64, y: 140, w: 72, h: 6, z: 2 }),
          text({
            content: 'Software for how\nthe business already runs.',
            x: 64,
            y: 180,
            w: 720,
            h: 220,
            fontSize: 48,
            fontFamily: 'serif',
            fontWeight: 400,
            z: 3,
          }),
          text({
            content: 'CRM · ERP · custom systems  ·  Karachi since 2017',
            x: 64,
            y: 500,
            w: 700,
            h: 40,
            fontSize: 18,
            fontWeight: 500,
            color: MUTE,
            z: 3,
          }),
          shape({ x: 920, y: 0, w: 280, h: 627, fill: INK, z: 1 }),
          text({
            content: 'TYCHORA',
            x: 940,
            y: 280,
            w: 240,
            h: 40,
            fontSize: 14,
            fontWeight: 600,
            color: PAPER,
            align: 'center',
            z: 4,
          }),
          text({
            content: 'hello@tychora.com',
            x: 940,
            y: 330,
            w: 240,
            h: 36,
            fontSize: 13,
            fontWeight: 400,
            color: '#E4E0D8',
            align: 'center',
            z: 4,
          }),
        ]
      ),
  },
  {
    id: 'three-ways',
    name: 'Product · Project · Team',
    blurb: 'Instagram square',
    sizeId: 'instagram',
    make: () =>
      base(
        'instagram',
        'Product · Project · Team',
        { type: 'color', value: INK },
        [
          logo({ x: 72, y: 64, inverted: true, w: 300, h: 56, z: 5 }),
          text({
            content: 'Three ways\nto work with us.',
            x: 72,
            y: 200,
            w: 920,
            h: 200,
            fontSize: 64,
            fontFamily: 'serif',
            color: PAPER,
            z: 3,
          }),
          text({
            content: '01  Product     02  Project     03  Team',
            x: 72,
            y: 820,
            w: 920,
            h: 50,
            fontSize: 22,
            fontWeight: 500,
            color: RED,
            z: 3,
          }),
          text({
            content: 'tychora.com',
            x: 72,
            y: 960,
            w: 400,
            h: 36,
            fontSize: 16,
            color: MUTE,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'quote',
    name: 'Quote card',
    blurb: 'Facebook post',
    sizeId: 'facebook',
    make: () =>
      base(
        'facebook',
        'Quote card',
        { type: 'color', value: PAPER },
        [
          shape({ x: 0, y: 0, w: 12, h: 630, fill: RED, z: 2 }),
          text({
            content: '“You talk to the people who ship.”',
            x: 80,
            y: 180,
            w: 1040,
            h: 180,
            fontSize: 52,
            fontFamily: 'serif',
            fontWeight: 400,
            z: 3,
          }),
          text({
            content: 'Tychora Technologies  ·  Karachi, Pakistan and Saudi Arabia',
            x: 80,
            y: 500,
            w: 800,
            h: 40,
            fontSize: 18,
            fontWeight: 500,
            color: MUTE,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'crm',
    name: 'CRM highlight',
    blurb: 'LinkedIn square',
    sizeId: 'linkedin-square',
    make: () =>
      base(
        'linkedin-square',
        'CRM highlight',
        { type: 'color', value: PAPER },
        [
          logo({ x: 72, y: 64 }),
          text({
            content: 'CRM',
            x: 72,
            y: 280,
            w: 400,
            h: 50,
            fontSize: 18,
            fontWeight: 600,
            color: RED,
            z: 3,
          }),
          text({
            content: 'Leads, follow-ups,\nand history.\nNot spreadsheets.',
            x: 72,
            y: 360,
            w: 900,
            h: 360,
            fontSize: 56,
            fontFamily: 'serif',
            z: 3,
          }),
          text({
            content: 'Ask if we have a fit  →  hello@tychora.com',
            x: 72,
            y: 940,
            w: 900,
            h: 40,
            fontSize: 20,
            fontWeight: 500,
            color: MUTE,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'story-cta',
    name: 'Story CTA',
    blurb: 'Instagram story',
    sizeId: 'story',
    make: () =>
      base(
        'story',
        'Story CTA',
        { type: 'color', value: INK },
        [
          logo({ x: 80, y: 120, inverted: true, w: 340, h: 64, z: 5 }),
          text({
            content: 'Need a CRM,\nERP, or extra\nengineers?',
            x: 80,
            y: 520,
            w: 920,
            h: 480,
            fontSize: 64,
            fontFamily: 'serif',
            color: PAPER,
            z: 3,
          }),
          shape({ x: 80, y: 1100, w: 80, h: 8, fill: RED, z: 3 }),
          text({
            content: 'Write to us.\nWe will say if we are a fit.',
            x: 80,
            y: 1160,
            w: 900,
            h: 120,
            fontSize: 28,
            fontWeight: 400,
            color: '#E4E0D8',
            z: 3,
          }),
          text({
            content: 'hello@tychora.com',
            x: 80,
            y: 1680,
            w: 900,
            h: 50,
            fontSize: 24,
            fontWeight: 600,
            color: RED,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'hiring',
    name: 'Staff augmentation',
    blurb: 'X / Twitter',
    sizeId: 'x',
    make: () =>
      base(
        'x',
        'Staff augmentation',
        { type: 'color', value: PAPER },
        [
          logo({ x: 72, y: 56 }),
          text({
            content: 'Add our engineers to your team.',
            x: 72,
            y: 280,
            w: 1100,
            h: 140,
            fontSize: 56,
            fontFamily: 'serif',
            z: 3,
          }),
          text({
            content: 'Extra hands. Not a whole new vendor. Compact team — we take work we can actually staff.',
            x: 72,
            y: 480,
            w: 1000,
            h: 90,
            fontSize: 24,
            fontWeight: 400,
            color: MUTE,
            z: 3,
          }),
          text({
            content: 'tychora.com',
            x: 72,
            y: 780,
            w: 400,
            h: 40,
            fontSize: 18,
            fontWeight: 600,
            color: RED,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'event',
    name: 'Announcement',
    blurb: 'LinkedIn landscape',
    sizeId: 'linkedin',
    make: () =>
      base(
        'linkedin',
        'Announcement',
        { type: 'color', value: INK },
        [
          text({
            content: 'ANNOUNCEMENT',
            x: 72,
            y: 80,
            w: 400,
            h: 36,
            fontSize: 14,
            fontWeight: 600,
            color: RED,
            z: 3,
          }),
          text({
            content: 'Tell us the problem.\nWe say if we are a fit.',
            x: 72,
            y: 180,
            w: 900,
            h: 220,
            fontSize: 48,
            fontFamily: 'serif',
            color: PAPER,
            z: 3,
          }),
          text({
            content: 'Product, project, or extra engineers. Karachi · Pakistan and Saudi Arabia.',
            x: 72,
            y: 480,
            w: 800,
            h: 50,
            fontSize: 20,
            color: MUTE,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'photo-frame',
    name: 'Photo frame',
    blurb: 'Instagram — drop in a photo',
    sizeId: 'instagram',
    make: () =>
      base(
        'instagram',
        'Photo frame',
        { type: 'color', value: INK },
        [
          shape({ x: 72, y: 180, w: 936, h: 700, fill: '#1C2026', z: 1 }),
          text({
            content: 'Replace this block with your photo',
            x: 72,
            y: 480,
            w: 936,
            h: 50,
            fontSize: 22,
            fontWeight: 500,
            color: MUTE,
            align: 'center',
            z: 2,
          }),
          logo({ x: 72, y: 64, inverted: true, z: 5 }),
          text({
            content: 'Tychora  ·  tychora.com',
            x: 72,
            y: 960,
            w: 900,
            h: 40,
            fontSize: 18,
            fontWeight: 500,
            color: PAPER,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'erp',
    name: 'ERP highlight',
    blurb: 'Instagram portrait',
    sizeId: 'ig-portrait',
    make: () =>
      base(
        'ig-portrait',
        'ERP highlight',
        { type: 'color', value: PAPER },
        [
          logo({ x: 72, y: 64 }),
          text({
            content: 'ERP',
            x: 72,
            y: 280,
            w: 400,
            h: 40,
            fontSize: 16,
            fontWeight: 600,
            color: RED,
            z: 3,
          }),
          text({
            content: 'Stock, purchasing,\nand finance.\nSame numbers.',
            x: 72,
            y: 360,
            w: 920,
            h: 420,
            fontSize: 56,
            fontFamily: 'serif',
            z: 3,
          }),
          shape({ x: 72, y: 860, w: 64, h: 6, z: 3 }),
          text({
            content: 'hello@tychora.com',
            x: 72,
            y: 1180,
            w: 800,
            h: 40,
            fontSize: 22,
            fontWeight: 600,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'banner',
    name: 'LinkedIn banner',
    blurb: 'Profile cover',
    sizeId: 'linkedin-cover',
    make: () =>
      base(
        'linkedin-cover',
        'LinkedIn banner',
        { type: 'color', value: INK },
        [
          logo({ x: 64, y: 40, inverted: true, z: 5 }),
          text({
            content: 'Ready software. Custom builds. Engineers on your team.',
            x: 64,
            y: 160,
            w: 1100,
            h: 90,
            fontSize: 36,
            fontFamily: 'serif',
            color: PAPER,
            z: 3,
          }),
          text({
            content: 'tychora.com',
            x: 64,
            y: 300,
            w: 400,
            h: 36,
            fontSize: 18,
            fontWeight: 600,
            color: RED,
            z: 3,
          }),
        ]
      ),
  },
  {
    id: 'testimonial',
    name: 'Proof line',
    blurb: 'Facebook post',
    sizeId: 'facebook',
    make: () =>
      base(
        'facebook',
        'Proof line',
        { type: 'color', value: PAPER },
        [
          logo({ x: 72, y: 48 }),
          text({
            content: 'A compact Karachi office.\nYou talk to the people who ship.',
            x: 72,
            y: 200,
            w: 1050,
            h: 200,
            fontSize: 42,
            fontFamily: 'serif',
            z: 3,
          }),
          text({
            content: 'Since 2017  ·  Pakistan and Saudi Arabia',
            x: 72,
            y: 500,
            w: 700,
            h: 40,
            fontSize: 18,
            color: MUTE,
            z: 3,
          }),
        ]
      ),
  },
];
