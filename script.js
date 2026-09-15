/* =========================================================
   KRATOS'26 — opening sequence

   awaiting cartridge
     → drag and insert (seats flush in the port)
     → live campus map search  (coding / cat exam / assessment / project)
     → undefined signal → lock → Easwari Engineering College → ACCESS GRANTED
     → LOADING with a climbing percentage
     → intro video, full screen
     → end card inside the CRT, live red theme
   ========================================================= */

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const el = {
  hud:$('hud'), hudDot:$('hud-dot'), hudStat:$('hud-status'),
  rig:$('rig'), console:$('console'), tab:$('tab'), port:$('port'),
  dock:$('dock'), pillFill:$('pill-fill'),

  cart:$('cart'), cartHint:$('cart-hint'), cartBtn:$('cart-btn'),

  lAwait:$('l-await'), lMap:$('l-map'), lLoad:$('l-load'),

  signals:$('signals'), coords:$('coords'), detected:$('detected'),
  pin:$('pin'), place:$('place'), granted:$('granted'),

  loadPct:$('load-pct'), loadFill:$('load-fill'),

  flash:$('flash'), stageVideo:$('stage-video'), intro:$('intro'),
  skip:$('skip'), sound:$('sound'), replay:$('replay'),
  finale:$('finale')
};

/* =========================================================
   AUDIO — generated, no files
   ========================================================= */
let actx = null;
function audio() {
  if (!actx) {
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (_) { return null; }
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone({ freq = 440, dur = .12, type = 'sine', gain = .06, sweep = null }) {
  const ctx = audio(); if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  if (sweep) o.frequency.exponentialRampToValueAtTime(sweep, ctx.currentTime + dur);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(.0008, ctx.currentTime + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + dur + .02);
}
let pingTimer = null;
function startSearchSound() {
  stopSearchSound();
  const ping = () => tone({ freq: 880, sweep: 520, dur: .26, gain: .045 });
  ping();
  pingTimer = setInterval(ping, 560);
}
function stopSearchSound() { if (pingTimer) { clearInterval(pingTimer); pingTimer = null; } }
function blipSound()  { tone({ freq: 1320, dur: .07, type: 'triangle', gain: .05 }); }
function alertSound() {
  tone({ freq: 180, sweep: 90, dur: .5, type: 'sawtooth', gain: .07 });
  setTimeout(() => tone({ freq: 220, sweep: 110, dur: .4, type: 'sawtooth', gain: .05 }), 180);
}
function grantSound() {
  tone({ freq: 440, sweep: 880, dur: .3, gain: .07 });
  setTimeout(() => tone({ freq: 660, sweep: 1320, dur: .35, gain: .05 }), 150);
}
function clunk() { tone({ freq: 118, dur: .2, type: 'square', gain: .13 }); }

/* =========================================================
   INSERT — button only, no dragging.
   The dock is clipped at the port line, so the cartridge slides
   down and finishes flush against the shell every time.
   ========================================================= */
let inserted = false;

el.cartBtn.addEventListener('click', insert);
el.cartBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); insert(); }
});

function insert() {
  if (inserted) return;
  inserted = true;

  audio();                                  // unlock sound on the click
  el.cartBtn.classList.add('gone');
  el.cartHint.classList.add('gone');
  el.cart.classList.add('inserted');        // the side cartridge lifts away

  // 1 — it appears above the port mouth
  el.dock.classList.add('arming');
  el.port.classList.add('hot');

  // 2 — it slides all the way down into the port
  setTimeout(() => {
    el.dock.classList.remove('arming');
    el.dock.classList.add('seating');
    clunk();
  }, 420);

  setTimeout(() => el.port.classList.remove('hot'), 1050);
  setTimeout(run, 1120);
}

/* =========================================================
   SEQUENCE
   ========================================================= */
async function run() {
  el.tab.textContent = 'ACE MODULE LOCKED';
  el.tab.classList.add('locked');
  el.console.classList.add('live');
  el.hudDot.classList.add('live');
  el.hudStat.textContent = 'MODULE READ';
  el.pillFill.style.transform = 'scaleX(0.4)';

  el.lAwait.classList.remove('show');
  await wait(350);

  await campusScan();
  await loading();
  await playVideo();
  await endCard();
}

/* ---------------------------------------------------------
   Live campus map — positions are percentages inside the screen
   --------------------------------------------------------- */
const SIGNALS = [
  { tag:'CODING',     x:24, y:32 },
  { tag:'CAT EXAM',   x:73, y:27 },
  { tag:'ASSESSMENT', x:29, y:70 },
  { tag:'PROJECT',    x:70, y:67 }
];

async function campusScan() {
  el.lMap.classList.add('show');
  el.hudStat.textContent = 'SEARCHING CAMPUS';
  el.coords.innerHTML = 'SEARCHING...';
  startSearchSound();
  await wait(500);

  for (let i = 0; i < SIGNALS.length; i++) {
    addSignal(SIGNALS[i], false);
    blipSound();
    el.coords.innerHTML = `SIGNALS FOUND<br>${i + 1} / 4`;
    await wait(480);
  }

  el.pillFill.style.transform = 'scaleX(0.58)';
  stopSearchSound();
  await wait(320);

  // the one that does not belong
  el.coords.innerHTML = 'UNDEFINED<br>SIGNAL';
  el.hudStat.textContent = 'UNDEFINED SIGNAL';
  addSignal({ tag:'UNDEFINED', x:50, y:46 }, true);
  alertSound();
  await wait(1100);

  el.hudStat.textContent = 'LOCKING TARGET';
  for (const p of [34, 72, 100]) {
    el.coords.innerHTML = `LOCKING<br>${p}%`;
    tone({ freq: 520 + p * 4, dur: .06, type: 'square', gain: .04 });
    await wait(270);
  }

  document.querySelectorAll('.signal').forEach(n => n.classList.add('out'));
  el.lMap.classList.add('locked');
  await wait(350);

  el.pin.classList.add('show');
  el.detected.classList.add('show');
  el.coords.innerHTML = '13.0320&deg; N<br>80.1794&deg; E';
  el.hudStat.textContent = 'TARGET ACQUIRED';
  el.pillFill.style.transform = 'scaleX(0.82)';
  await wait(600);

  el.place.classList.add('show');
  await wait(1500);

  el.granted.classList.add('show');
  el.hudStat.textContent = 'ACCESS GRANTED';
  grantSound();
  await wait(1300);

  el.lMap.classList.remove('show');
  await wait(350);
}

function addSignal(s, unknown) {
  const n = document.createElement('div');
  n.className = 'signal' + (unknown ? ' unknown' : '');
  n.style.left = s.x + '%';
  n.style.top  = s.y + '%';
  n.innerHTML = `<span class="s-ping"></span><span class="s-dot"></span><span class="s-tag">${s.tag}</span>`;
  el.signals.appendChild(n);
  requestAnimationFrame(() => n.classList.add('show'));
}

/* ---------------------------------------------------------
   LOADING — percentage climbs to 100
   --------------------------------------------------------- */
function loading() {
  return new Promise((resolve) => {
    el.lLoad.classList.add('show');
    el.hudStat.textContent = 'DECRYPTING';

    let pct = 0;
    const step = () => {
      // uneven steps read more like a real loader than a clean ramp
      pct += Math.random() * 5 + 2;
      if (pct >= 100) pct = 100;

      el.loadPct.textContent = Math.floor(pct) + '%';
      el.loadFill.style.transform = `scaleX(${pct / 100})`;
      el.pillFill.style.transform = `scaleX(${(82 + pct * 0.18) / 100})`;

      if (pct % 17 < 5) tone({ freq: 900 + pct * 6, dur: .03, type: 'square', gain: .025 });

      if (pct >= 100) {
        tone({ freq: 660, sweep: 1320, dur: .35, gain: .06 });
        setTimeout(resolve, 550);
      } else {
        setTimeout(step, 45 + Math.random() * 55);
      }
    };
    setTimeout(step, 250);
  });
}

/* ---------------------------------------------------------
   Intro video, full screen
   --------------------------------------------------------- */
function playVideo() {
  return new Promise((resolve) => {
    const v = el.intro;
    if (!v) return resolve(false);

    let done = false, started = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      el.skip.classList.remove('show');
      el.sound.classList.remove('show');
      // hold the last frame and cross-fade into the finale
      setTimeout(() => {
        el.stageVideo.classList.add('fading');
        setTimeout(() => el.stageVideo.classList.remove('is-active', 'fading'), 500);
        resolve(!!ok);
      }, 260);
    };

    v.addEventListener('ended', () => finish(true), { once:true });
    v.addEventListener('error', () => finish(false), { once:true });
    el.skip.addEventListener('click', () => { v.pause(); finish(true); }, { once:true });
    el.sound.addEventListener('click', () => {
      v.muted = !v.muted;
      el.sound.innerHTML = v.muted ? '&#128263; SOUND ON' : '&#128266; SOUND OFF';
    });

    const guard = setTimeout(() => { if (!started) finish(false); }, 3000);
    v.addEventListener('canplay', () => { started = true; clearTimeout(guard); }, { once:true });

    // dive into the screen, flash, then the video
    el.rig.classList.add('diving');
    setTimeout(() => {
      el.flash.classList.add('on');
      setTimeout(() => {
        el.hud.style.opacity = '0';
        el.stageVideo.classList.add('is-active');
        el.flash.classList.remove('on');
        el.skip.classList.add('show');
        el.sound.classList.add('show');
        v.play().catch(() => finish(false));
      }, 180);
    }, 480);
  });
}

/* ---------------------------------------------------------
   Finale — full screen, console gone
   --------------------------------------------------------- */
async function endCard() {
  // the console stays gone; the finale fades up on its own
  el.rig.style.display = 'none';
  el.hud.style.opacity = '0';
  document.body.classList.add('finale');

  el.finale.classList.add('is-active');
  await wait(40);
  el.finale.classList.add('show');
  await wait(280);

  el.finale.classList.add('go');
  await wait(1100);

  el.replay.classList.add('show');
}

el.replay.addEventListener('click', () => location.reload());


/* =========================================================
   BOOT — hold everything hidden until the art has decoded
   ========================================================= */
function boot() {
  el.lAwait.classList.add('show');
  document.body.classList.add('ready');
}
const art = [...document.images];
let left = art.length;
if (!left) boot();
else {
  const tick = () => { if (--left <= 0) boot(); };
  art.forEach(i => {
    if (i.complete) tick();
    else { i.addEventListener('load', tick, { once:true }); i.addEventListener('error', tick, { once:true }); }
  });
  setTimeout(boot, 2500);
}
