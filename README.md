# جسر · Gesr

**Instant translator between Egyptian Arabic, English, and Brazilian Portuguese** — text, voice, image (OCR), and full auto-conversation mode. Installable PWA that works offline.

![Gesr](icons/icon-512.png)

## Why it exists

Standard translators speak Modern Standard Arabic, not the way Egyptians actually talk. Gesr uses Claude to produce natural Egyptian dialect on the Arabic side, and works in the three languages a Cairo → São Paulo move actually needs.

## Features

- **Live text translation** with debounced auto-detect between three languages
- **Voice input & output** — device speech recognition + TTS voices
- **Auto-conversation mode** — both people press their mic, the app listens, detects who spoke which language, translates, and speaks the other side out loud automatically
- **Image OCR** — Tesseract.js reads text in a photo, then translates. Download the translated image or text
- **Camera capture** — snap a menu / sign / paper directly instead of picking a file
- **Phrasebook** with 40+ entries per language, organised for someone actually landing in Brazil: bank, rent, doctor, food, transport, work, emergency
- **Favorites** — star translations to keep them separate from history
- **History** — last 20 translations in `localStorage`
- **Export / Import** — full JSON backup of history + favorites
- **Web Share API** — send a translation to WhatsApp/anywhere in one tap
- **Dark / Light theme** toggle
- **Two translation backends**:
  - **Claude API** (paid, best quality, natural Egyptian dialect) — you provide your own key
  - **MyMemory** (free, weaker on dialect) — automatic fallback if no key
- **Fully installable PWA** — works offline for the app shell, cross-origin API calls still need network

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl` + `Enter` | Translate + speak immediately (skip the 600ms debounce) |
| `Ctrl` + `Shift` + `S` | Swap languages |
| `Ctrl` + `/` | Toggle dark / light theme |
| `Esc` | Close any open modal |

## Run

Any static file server works. From this folder:

```bash
python -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080/`. HTTPS (or `localhost`) is required for the microphone.

## Set up the Claude API key (optional but recommended)

1. Get a key from [console.anthropic.com](https://console.anthropic.com/settings/keys). You need Billing credit — even a few dollars is enough.
2. Open Gesr → tap ⚙ → paste the key → pick a model → **Save**.

The key is stored in your browser's `localStorage` only. It never touches any server other than Anthropic's API directly.

**Available models:**

- **Sonnet 4.5** — the balanced default. Fast enough, good dialect.
- **Haiku 4.5** — cheapest and fastest; good for short casual chat.
- **Opus 4.5** — highest quality for long or nuanced text.

## File layout

```
index.html          Whole app — markup, styles, and script (single file on purpose)
sw.js               Service worker (network-first for shell, passthrough for APIs)
manifest.json       PWA manifest
icons/              192×192 and 512×512 icons (used by PWA + og:image)
.github/workflows/  GitHub Pages deploy
```

## Tech

- Vanilla HTML + CSS + JS. No framework, no build step.
- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR (loaded from CDN, ~2MB).
- Web Speech API for STT + TTS.
- Anthropic Messages API (`claude-sonnet-4-5` by default) for translation.
- Service Worker with network-first shell caching.

## Privacy

- API key lives only in `localStorage` on your device.
- History and favorites live only in `localStorage`.
- OCR runs in the browser (Tesseract.js) — image never leaves your device.
- Translation text goes to whichever backend you chose (Anthropic or MyMemory).

## License

[MIT](LICENSE) — free to use, modify, and ship.

---

Built by [Girgis2005](https://github.com/Girgis2005).
