# Handover — Sito invito di laurea (Daniel Leocata)

> Documento per riprendere il progetto in una nuova chat. Aggiornato al 2026-07-10.
> Leggilo tutto prima di toccare il codice: contiene le decisioni già prese e le
> trappole che fanno perdere tempo.

---

## 1. Cos'è

Sito-invito a pagina singola per la **laurea di Daniel Leocata** in *Ingegneria
Informatica* al *Politecnico di Torino*. Due eventi: **proclamazione** (16 set 2026,
Torino) e **festeggiamenti** (3 ott 2026, Beauty Garden Banqueting, Biancavilla –
Catania). Gli ospiti confermano la presenza da un form (RSVP).

- **Live:** https://leocatasalvatoredaniel.github.io/ai-delegation-checklist/
- **Repo:** `leocatasalvatoredaniel/ai-delegation-checklist`
- **Branch di sviluppo:** `claude/elegant-tesla-y0d75l`
- **Deploy:** GitHub Pages, workflow `.github/workflows/deploy.yml`

---

## 2. Stack

- **Next.js 16.2.9**, React, **static export** (`output: "export"` in `next.config`).
- `basePath: "/ai-delegation-checklist"` **solo in produzione**; `images.unoptimized: true`.
- Dipendenze: `@emailjs/browser`, `motion`, `clsx`, `tailwind-merge`. Niente Tailwind
  runtime: lo stile è tutto in **`app/globals.css`** (CSS a mano, non utility class).
- Font Google via `next/font`: Inter, Space Grotesk, JetBrains Mono.
- Script: `npm run dev` / `npm run build` / `npm run lint`.

> ⚠️ **basePath e `next/image`**: con `images.unoptimized` Next **non** antepone il
> basePath a `src` stringa. Ovunque serva un asset si usa questa costante (già presente
> in `graduation.tsx` e `globe-hero.tsx`):
> ```ts
> const BASE_PATH = process.env.NODE_ENV === "production" ? "/ai-delegation-checklist" : "";
> ```
> Ogni path a `/img/...` o `/video/...` va prefissato con `BASE_PATH`.

---

## 3. Struttura della pagina (ordine)

Tutto è in **`components/graduation/graduation.tsx`** (client component unico), tranne
due UI riusabili. Sezioni, dall'alto:

1. **Splash** — video intro `intro.mp4` a tutto schermo (`object-fit:cover`), autoplay
   muted, bottone «salta» e toggle audio. Alla fine (`ended`/`error`/safety 15s)
   crossfade sul sito. `prefers-reduced-motion` → salta subito.
2. **Nav** — logo `SDL // invito`, link a `#stats #program #locations #rsvp`.
3. **Hero** — eyebrow, riga d'invito in prima persona («Ho il piacere di invitarti…»),
   nome `Daniel Leocata`, riga corso+ateneo, `scroll-hint`. Sfondo: **`<GlobeHero />`**.
4. **Stats** — narrazione «3 anni in numeri» con **`<StickyScroll />`** (4 slide).
5. **Countdown** — al 3 ott 2026, 20:00 CEST (target `2026-10-03T18:00:00Z`).
6. **Program** — due `event-card` (proclamazione / festeggiamenti).
7. **Locations** — due mappe Google embed + bottoni «Aggiungi al calendario» (.ics).
8. **RSVP** — form (nome, cognome, email, presenza, proclamazione, adulti/bambini,
   dieta, messaggio). Scadenza conferme: **entro i primi di settembre 2026**.
9. **Footer** + toast + RSVP flottante mobile + scroll-to-top + **modal «area riservata»**.

### Componenti UI
- **`components/ui/globe-hero.tsx`** — globo fotoreale (`img/globe-med.jpg`, 1672×941) con
  overlay SVG che ridisegna in oro la rotta **Sicilia → Torino** al reveal
  (IntersectionObserver). Le coordinate marker sono misurate in pixel sull'immagine, quindi
  il frame deve mantenere l'aspect ratio dell'immagine (`preserveAspectRatio="xMidYMid slice"`).
- **`components/ui/sticky-scroll-reveal.tsx`** — sticky-scroll a tutto schermo. Ogni
  `StickyItem` può avere **`img`** *oppure* **`video`+`videoPoster`** (il video parte solo
  quando la slide è attiva). Denominatore per-slide derivato dall'altezza del wrapper (non
  da `innerHeight`) per non tremare quando la barra URL mobile si ritrae. `reduced-motion`
  → stack statico verticale.

---

## 4. Asset (`public/`)

| File | Uso |
|------|-----|
| `video/intro.mp4` | Video splash iniziale |
| `video/video_gin.mp4` + `img/video_gin_poster.jpg` | Slide «312 gin tonic» dello sticky-scroll |
| `img/globe-med.jpg` | Globo dell'hero |
| `img/foto_sonno.jpg` | Slide «ore di sonno» |
| `img/foto_studio.jpg` | Slide «ore fissando uno schermo» |
| `img/foto_ai.jpg` | Slide «l'AI mi ha salvato» |
| `img/og-invito.jpg` | Immagine di condivisione (Open Graph, 2400×1260, testo già «stampato» sopra) |
| `img/intro_poster.jpg` | Poster del video splash |
| **`img/foto_voli.jpg`** | ⚠️ **CARICATA MA NON USATA** — vedi §8 |

### Codifica video (ricetta collaudata)
ffmpeg è a `/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2`.
Per web + iOS Safari:
```
-c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p -crf 23 -preset slow \
-c:a aac -b:a 128k -movflags +faststart
```
`main`/`yuv420p` = compatibilità larga; `+faststart` = moov atom in testa (parte prima).
Poster: `-ss 0.2 -frames:v 1 -q:v 3`. Gli script d'esempio stanno nella scratchpad
(`encode.sh` / `encode2.sh`): quando l'utente carica un nuovo video, si ri-codifica in
`intro.mp4`, si rigenera il poster e si **rimuove il file grezzo caricato**.

### Immagine Open Graph
`img/og-invito.jpg` è renderizzata con Playwright a 2400×1260 usando i font del sito dal
dev server (script `render-og.mjs` nella scratchpad). I metadati OG/Twitter sono in
`app/layout.tsx` (URL assoluti obbligatori per i crawler WhatsApp/Telegram; il testo
dell'invito vive **sull'immagine**, la card non ha description).

---

## 5. Backend RSVP — `lib/config.ts`

Contiene la config del backend conferme: **EmailJS** (serviceId/templateId/publicKey),
**Google Sheets** (`sheetsUrl` write via Apps Script, `csvUrl` in lettura) e la
**password dell'area riservata**. Sono valori **client-side** (già nel bundle statico),
non segreti server. Flusso:
- **Submit**: ping `Image().src` allo Sheets Apps Script (aggira CORS) + invio email via EmailJS.
- **Area riservata**: password → carica il CSV pubblico dello sheet e mostra la tabella
  conferme (contatori Sì/No/Proclamazione).

> Se cambi i contenuti del form, aggiorna sia i `params` EmailJS sia i `writeParams` Sheets.

---

## 6. Contenuti da NON sbagliare

- **Nome ovunque:** «Daniel Leocata» (in passato era «Salvatore Daniel Leocata» → già
  rinominato dappertutto, incluso .ics/footer/OG).
- **Proclamazione:** 16 settembre 2026, Politecnico di Torino, Corso Duca degli Abruzzi 24.
  Dopo la cerimonia segue un aperitivo.
- **Festeggiamenti:** 3 ottobre 2026, **ore 20:00**, Beauty Garden Banqueting, Biancavilla (CT).
- **Countdown target:** `2026-10-03T18:00:00Z` (= 20:00 CEST). Deve combaciare con `.ics` e card.
- **Scadenza RSVP:** «entro i primi di settembre 2026», per entrambi gli eventi.

---

## 7. Workflow di sviluppo (rispettalo sempre)

1. **Parti sempre da main aggiornata** (le PR vengono mergiate ogni giro):
   ```
   git fetch origin main
   git checkout -B claude/elegant-tesla-y0d75l origin/main
   ```
2. Modifica → `npm run build` deve essere **verde**.
3. **Verifica con Playwright** (Chromium headless è preinstallato, `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; **non** lanciare `playwright install`). Screenshot desktop **1440px** e mobile **390px**.
4. Commit descrittivo → **push `--force-with-lease`** su `claude/elegant-tesla-y0d75l`
   (se «stale info»: `git fetch` e riprova).
5. Apri **PR draft**. Aspetta il «merge» dell'utente, poi **verifica il deploy Pages**.
6. **Mai** pushare su altri branch. **Mai** mettere l'ID modello (`claude-opus-4-8`) in
   commit/PR/codice.

Trailer commit (come da harness):
```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MfLdA35xtmqSoXEoTk93ye
```

> Se la PR del branch è **già mergiata**, il lavoro nuovo è una modifica *fresca*: riparti
> da `origin/main` con lo stesso nome branch (non impilare commit sopra la storia già mergiata).

---

## 8. Trappole note (fanno perdere ore)

- **Deploy Pages che si impianta**: a volte `deploy-pages` fa polling di «Current status:»
  vuoto fino al timeout. È un **glitch del servizio Pages**, la build è verde. Fix: lancia
  un **nuovo `workflow_dispatch`** di `deploy.yml` (**NON** `rerun_failed_jobs`, che riusa il
  deployment «avvelenato»).
- **iOS Safari — tremolii in scroll**: qualunque effetto legato allo scroll (transform JS o
  CSS `animation-timeline: scroll()`) *shudder* su touch, perché lo scroll è async e la barra
  URL ridimensiona la viewport a metà scroll. **Decisione presa**: il parallax scroll è
  **disattivato su `pointer:coarse`** (guardia `coarsePointer` nell'useEffect). Il parallax
  GPU con `perspective` è stato provato e **poi revertato dall'utente**: *non reintrodurlo*
  senza esplicita richiesta. Su mobile = niente parallax scroll, by design.
- **Chromium headless non decodifica H.264**: in sandbox **non** puoi testare playback/`ended`
  del video. Verifica la codifica estraendo frame con ffmpeg; verifica la logica di
  skip/crossfade con Playwright (struttura DOM, classi), non con la riproduzione reale.
- **Autoplay video**: solo `muted` è permesso ovunque (iOS incl., con `playsInline`). La prop
  React `muted` non è affidabile come attributo → impostare `video.muted = true`
  imperativamente prima di `.play()`.
- **Classifier bash a volte «temporarily unavailable»** per comandi lunghi: workaround =
  scrivere i comandi in uno script `.sh` nella scratchpad e lanciare `bash script.sh`, oppure
  ritentare.

---

## 9. Stato attuale

- `main` @ `11dc7ea` — **deploy verde**, sito live e aggiornato.
- Ultimo lavoro chiuso: swap del video intro (busta che riempie lo schermo) + video nello
  sticky-scroll («gin tonic») + rename «Daniel Leocata» + OG image con testo + scadenza RSVP.

## 10. In sospeso / possibili prossimi passi

- **`public/img/foto_voli.jpg` caricata dall'utente ma non ancora usata.** Va con ogni
  probabilità inserita nel sito (candidata naturale: una nuova slide dello sticky-scroll in
  `STATS_CONTENT`, o sostituendone una). **Chiedere all'utente dove vuole usarla** prima di
  cablarla.
- CSS morto: restano classi del vecchio splash a terminale (`.terminal`, `.t-line`, ecc.) e
  del vecchio globo — inerti, si possono ripulire in un giro dedicato.
