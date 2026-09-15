# KRATOS'26 — preview page

Plain HTML / CSS / JS. No build step, no dependencies.

## Run it

1. Open this folder in VS Code (`File → Open Folder`).
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

The campus map is a live OpenStreetMap embed, so the page needs an internet
connection to show it. Everything else works offline.

## Sequence

1. **Awaiting cartridge** — console idle.
2. **Insert** — press the INSERT CARTRIDGE button. The cartridge rises to the
   port mouth, then slides all the way down until only its top edge shows.
   There is no dragging: the cartridge animates inside a dock that is clipped
   exactly at the port line, so it always finishes flush with no gap.
3. **Campus search** — a live map of Easwari Engineering College, Ramapuram,
   centred on 13.0320° N, 80.1794° E. Four signals resolve: CODING, CAT EXAM,
   ASSESSMENT, PROJECT.
4. **Undefined signal** — a fifth, crimson signal appears.
5. **Lock** — 34 → 72 → 100%, then the college crest marker resolves,
   `EASWARI ENGINEERING COLLEGE / RAMAPURAM · CHENNAI`, then `ACCESS GRANTED`.
6. **Loading** — the word LOADING with a percentage climbing to 100.
7. **Video** — `assets/intro.mp4` plays full screen with SKIP and SOUND controls.
8. **Finale** — the video holds on its last frame and cross-fades into a full
   screen finale with no console: the lion, the KRATOS'26 wordmark, and COMING
   SOON, on a deep red field.

## Changing things

| What | Where |
|---|---|
| Timing of any beat | `await wait(ms)` calls in `script.js` |
| Signal names and positions | the `SIGNALS` array in `script.js` |
| Map location | the `bbox` and `marker` values in the `<iframe>` in `index.html` |
| Map darkening | `.map-tint` in `styles.css` — the map itself is unfiltered |
| Palette | `:root` at the top of `styles.css` |
| Finale background | `.finale-stage` in `styles.css` |
| Watermark strength | `opacity` on `body::after` in `styles.css` |
| The video | replace `assets/intro.mp4` |

## Sound

All interface audio is generated in the browser with the Web Audio API — no sound
files. It starts from the first drag, which is the gesture browsers require before
audio is allowed.


## Mobile

The layout is built for phones as well as desktop.

- **Portrait** — the console sits at the top at full width, the cartridge beneath
  it. Everything fits one screen; the page does not scroll.
- **Landscape** — the cartridge moves back beside the console.
- **Dragging** — the drop zone scales with the screen, so on a phone you only need
  to get the cartridge roughly over the port. Page scrolling and pull-to-refresh
  are blocked while dragging so the gesture is never stolen by the browser.
- **Buttons** — SKIP, SOUND and REPLAY move to thumb-reachable positions with
  larger tap targets.
- **Heights** — uses `100dvh`, so the layout does not jump when the address bar
  hides or reappears.

Test in Chrome DevTools with the device toolbar, but check a real phone before
launch — touch dragging and video autoplay behave differently on real hardware.
