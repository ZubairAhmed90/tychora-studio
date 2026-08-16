export const INK = '#12151A';
export const PAPER = '#F7F5F1';
export const RED = '#C8102E';
export const MUTE = '#5E6670';
export const LINE = '#E4E0D8';
export const ACCENT = '#A66B3A';

export const SIZES = [
  { id: 'linkedin', label: 'LinkedIn post', platform: 'LinkedIn', w: 1200, h: 627 },
  { id: 'linkedin-square', label: 'LinkedIn square', platform: 'LinkedIn', w: 1080, h: 1080 },
  { id: 'linkedin-cover', label: 'LinkedIn banner', platform: 'LinkedIn', w: 1584, h: 396 },
  { id: 'facebook', label: 'Facebook post', platform: 'Facebook', w: 1200, h: 630 },
  { id: 'instagram', label: 'Instagram square', platform: 'Instagram', w: 1080, h: 1080 },
  { id: 'ig-portrait', label: 'Instagram portrait', platform: 'Instagram', w: 1080, h: 1350 },
  { id: 'story', label: 'Story / Reel cover', platform: 'Instagram', w: 1080, h: 1920 },
  { id: 'x', label: 'X / Twitter', platform: 'X', w: 1600, h: 900 },
];

export const COLORS = [INK, PAPER, RED, MUTE, LINE, ACCENT, '#FFFFFF', '#2F6B4F', '#1C2026'];

export const PHRASES = [
  { label: 'Headline', text: 'Software for how the business already runs.' },
  { label: 'CTA', text: 'Write to us. We will say if we are a fit.' },
  { label: 'Email', text: 'hello@tychora.com' },
  { label: 'Site', text: 'tychora.com' },
  { label: 'Ways', text: '01 Product   02 Project   03 Team' },
  { label: 'Place', text: 'Karachi · Pakistan and Saudi Arabia · Since 2017' },
  { label: 'CRM', text: 'Leads, follow-ups, and history. Not spreadsheets.' },
  { label: 'Team', text: 'Add our engineers to your team.' },
];

export const CAPTIONS = [
  {
    name: 'Product',
    body: 'CRM, ERP, and custom systems as a ready product, a build, or engineers on your team.\n\nA compact Karachi office. You talk to the people who ship.\n\nWrite to us — we will say if we are a fit.\nhello@tychora.com',
    tags: '#Tychora #CRM #ERP #CustomSoftware #Karachi',
  },
  {
    name: 'Hiring / team',
    body: 'Need extra engineers, not a whole new vendor?\n\nAdd our team to yours. Compact. We take the work we can actually staff.\n\ntychora.com',
    tags: '#StaffAugmentation #SoftwareTeam #Pakistan #SaudiArabia',
  },
  {
    name: 'Short CTA',
    body: 'Tell us the problem. We say if we are a fit.\n\nhello@tychora.com',
    tags: '#TychoraTechnologies',
  },
];

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
