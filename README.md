# Tychora Studio

Browser tool for LinkedIn, Facebook, Instagram, and X posts. Brand colours and type are already in the templates. No account. No server.

Drafts stay in **this browser** (localStorage). Maximum **10**. Clearing site data deletes them.

## Run it

The Vite app lives in this folder (`package.json` is here). If you cloned the full Tychora repo, that path is `tychora-studio/tychora-studio`.

```bash
npm install
npm run dev
```

Open **http://localhost:5174**.

```bash
npm run build    # output in dist/
npm run preview  # serve the production build
```

Node 18 or newer.

## Make a post

1. On the library page, pick a **template** or a **blank size**.
2. Change the headline and body. Double-click text, or edit it in the right panel.
3. Add a photo from the left panel, or drop a file onto the canvas.
4. Write the **caption** and hashtags on the right (what you paste into LinkedIn / Facebook).
5. **Save** (also autosaves). Then **Export**.

Typical LinkedIn post: start from **Ready software**, **CRM highlight**, or **Ways to work — 3 slides**.

## Library

- Filter by platform at the top.
- Search templates by name.
- Open, duplicate, or delete a saved draft.
- Oldest drafts drop off when you go past 10.

## Editor

**Left — add**

- Headline, body, contact line, photo, bar, box, circle
- Number stamp, arrow, quote mark, Tychora logo
- **QR code** (website or email)
- **Icons & emojis** — click to drop on the canvas

**Canvas**

- Click a layer to select it. Drag to move. Corner handle to resize.
- Icons, emojis, and QR stay square when you resize. Hold **Shift** while resizing other layers to keep aspect ratio.
- Drop a photo onto the canvas to add it.
- **Grid** and **Safe margins** are under View (left). Safe margins keep type off the crop edge.

**Right — inspect**

- Caption + hashtag packs
- Layers list (click to select)
- Colour, type, rotate, opacity, lock, hide, duplicate, delete
- Photo: Fill / Fit / Flip, overlay, grayscale, **Crop** (drag to frame, then zoom)
- Icon: colour, optional circle badge
- QR: paste a URL, or Website / Email

Change the post size under the format list. Layers scale to the new size.

## Carousel

Use **Ways to work — 3 slides** or **CRM before / after**, or tap **Add slide**.

- Click a slide number to edit it.
- **← →** reorder the current slide.
- Max 8 slides.

## Export

| Menu item        | What you get                                      |
| ---------------- | ------------------------------------------------- |
| PNG / PNG @2x    | Current slide                                     |
| JPG              | Current slide                                     |
| Copy image       | PNG on the clipboard                              |
| Copy caption     | Caption + hashtags                                |
| Caption .txt     | Same text as a file                               |
| Carousel zip     | Every slide as PNG @2x + caption `.txt` in a zip  |
| All slides PNG   | One download per slide                            |

### Post a carousel on LinkedIn

1. Export → **Carousel zip**.
2. Unzip. Images are numbered in order.
3. Upload them in that order.
4. Paste the caption from the `.txt` (or Copy caption).

## Shortcuts

Press **?** in the editor.

| Key                         | Action              |
| --------------------------- | ------------------- |
| Ctrl/Cmd + S                | Save                |
| Ctrl/Cmd + Z / Y            | Undo / redo         |
| Ctrl/Cmd + D                | Duplicate layer     |
| Ctrl/Cmd + C / V            | Copy / paste layer  |
| Arrows                      | Nudge 1px           |
| Shift + arrows              | Nudge 10px          |
| Delete                      | Remove layer        |

## Deploy (Vercel)

Frontend only. Output is `dist`.

- **Root Directory:** the folder that contains this `package.json`
- **Build command:** `npm run build`
- **Output:** `dist`

No environment variables. Do not treat drafts as shared — each person has their own browser storage.

## Brand

- Paper `#F7F5F1` · Ink `#12151A` · Red `#C8102E` · Mute `#5E6670`
- Type: IBM Plex Sans and Instrument Serif
- Site: [tychora.com](https://tychora.com) · Email: hello@tychora.com
