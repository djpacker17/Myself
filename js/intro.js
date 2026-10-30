/* =========================================================
   Animación de apertura: tres ventanas escriben código
   (JavaScript, Luau y HTML/CSS), cada una muestra su resultado
   y la pantalla se deshace en los cuadrados del fondo.
   Se ve una vez por sesión, se puede saltar y respeta
   «reducir movimiento».
   ========================================================= */
(function () {
"use strict";
const root = document.documentElement;
const intro = document.getElementById("intro");
if (!intro) return;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hl = window.LeoHL || (s => s);
const canvas = document.getElementById("intro-canvas");
const ctx = canvas.getContext("2d");
const bgLayer = intro.querySelector(".intro-bg");
const pctEl = document.getElementById("intro-pct");
const track = document.getElementById("intro-track");

const CODE = {
  js: {
    es: ['const zypuc = crearTienda("Zypuc");', 'zypuc.ciudad = "Pucallpa";', 'zypuc.pedidos = "WhatsApp";', "zypuc.abrir();"],
    en: ['const zypuc = createStore("Zypuc");', 'zypuc.city = "Pucallpa";', 'zypuc.orders = "WhatsApp";', "zypuc.open();"]
  },
  luau: {
    es: ['local boton = Instance.new("TextButton")', 'boton.Text = "JUGAR"', "TweenService:Create(boton, info, {", "  Size = UDim2.fromOffset(200, 44)", "}):Play()"],
    en: ['local button = Instance.new("TextButton")', 'button.Text = "PLAY"', "TweenService:Create(button, info, {", "  Size = UDim2.fromOffset(200, 44)", "}):Play()"]
  },
  html: {
    es: ['<h1 class="hola">Hola, soy Leo.</h1>', ".hola {", "  animation: entrada .8s;", "}"],
    en: ['<h1 class="hello">Hi, I\'m Leo.</h1>', ".hello {", "  animation: intro .8s;", "}"]
  }
};
const LANG_OF = { js: "js", luau: "luau", html: "html" };

let wins = [], raf = 0, t0 = 0, wiping = false, running = false;

function setup() {
  const lang = root.lang === "en" ? "en" : "es";
  const mobile = matchMedia("(max-width: 720px)").matches;
  wins = [...intro.querySelectorAll(".iw")].filter(w => !(mobile && w.classList.contains("iw-html"))).map((el, i) => {
    const key = el.querySelector(".iw-code").dataset.code;
    const lines = CODE[key][lang];
    const total = lines.reduce((s, l) => s + l.length, 0) + lines.length - 1;
    el.classList.remove("on", "ran");
    el.querySelector(".iw-code").innerHTML = "";
    return { el, key, lines, total, typed: -1, appear: 60 + i * 150, start: 60 + i * 150 + 260, dur: mobile ? 1000 : 1150, ran: false, codeEl: el.querySelector(".iw-code") };
  });
  intro.querySelectorAll(".intro-langs span").forEach(s => s.classList.remove("ok"));
  const run = intro.querySelector(".iw-js .run"); if (run) run.textContent = lang === "en" ? "▸ zypuc.open()" : "▸ zypuc.abrir()";
  track.style.setProperty("--p", 0); pctEl.textContent = "0 %";
  intro.classList.remove("out");
  intro.style.background = "";
  bgLayer.style.display = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  wiping = false;
}

function renderCode(w, n) {
  let left = n, html = "";
  for (let i = 0; i < w.lines.length; i++) {
    const line = w.lines[i];
    if (left >= line.length) {
      html += hl(line, w.key) + (i < w.lines.length - 1 ? "\n" : "");
      left -= line.length + 1;
      if (left < 0) { html += '<span class="cur"></span>'; break; }
    } else {
      html += hl(line.slice(0, Math.max(0, left)), w.key) + '<span class="cur"></span>';
      break;
    }
  }
  if (n >= w.total) html = w.lines.map(l => hl(l, w.key)).join("\n");
  w.codeEl.innerHTML = html;
}

function markLang(k) {
  const s = intro.querySelector(`.intro-langs [data-l="${k}"]`);
  if (s) s.classList.add("ok");
}

function frame(now) {
  if (!running) return;
  const t = now - t0;
  let typedAll = 0, totalAll = 0, lastRan = 0;
  wins.forEach(w => {
    if (t >= w.appear) w.el.classList.add("on");
    const n = Math.max(0, Math.min(w.total, Math.round((t - w.start) / w.dur * w.total)));
    if (t >= w.start && n !== w.typed) { w.typed = n; renderCode(w, n); }
    typedAll += Math.max(0, w.typed); totalAll += w.total;
    const end = w.start + w.dur + 60;
    if (t >= end && !w.ran) {
      w.ran = true; w.el.classList.add("ran"); markLang(LANG_OF[w.key]);
      if (w.key === "html") markLang("css");
    }
    lastRan = Math.max(lastRan, end);
  });
  const brandAt = lastRan + 320;
  let p = typedAll / totalAll * .9;
  if (t >= brandAt) { p = 1; markLang("brand"); markLang("html"); markLang("css"); }
  track.style.setProperty("--p", p.toFixed(3));
  pctEl.textContent = Math.round(p * 100) + " %";
  if (t >= brandAt + 420) { wipe(); return; }
  raf = requestAnimationFrame(frame);
}

/* La pantalla se deshace en cuadrados, del centro hacia afuera */
function wipe() {
  if (wiping) return;
  wiping = true; running = false; cancelAnimationFrame(raf);
  root.classList.add("intro-reveal");
  intro.classList.add("out");
  const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const S = W < 720 ? 32 : 40, cols = Math.ceil(W / S), rows = Math.ceil(H / S);
  const cx = W / 2, cy = H * .46, maxD = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
  const cells = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const d = Math.hypot(x * S + S / 2 - cx, y * S + S / 2 - cy);
    cells.push({ x: x * S, y: y * S, delay: 120 + d / maxD * 560 + Math.random() * 140, tint: Math.random() > .82 });
  }
  const DUR = 320, start = performance.now();
  const draw = () => {
    ctx.fillStyle = "#070C17";
    for (const c of cells) ctx.fillRect(c.x, c.y, S + 1, S + 1);
  };
  draw();
  intro.style.background = "transparent";
  bgLayer.style.display = "none";
  const step = now => {
    const t = now - start; let alive = 0;
    ctx.clearRect(0, 0, W, H);
    for (const c of cells) {
      const k = (t - c.delay) / DUR;
      if (k >= 1) continue;
      alive++;
      if (k <= 0) { ctx.fillStyle = "#070C17"; ctx.fillRect(c.x, c.y, S + 1, S + 1); continue; }
      const e = k * k * (3 - 2 * k), s = S * (1 - e), o = (S - s) / 2;
      ctx.fillStyle = "#070C17"; ctx.fillRect(c.x + o, c.y + o, s, s);
      ctx.fillStyle = c.tint ? `rgba(45,212,191,${.4 * (1 - e)})` : `rgba(46,98,240,${.3 * (1 - e)})`;
      ctx.fillRect(c.x + o, c.y + o, s, s);
    }
    if (alive) requestAnimationFrame(step); else finish();
  };
  requestAnimationFrame(step);
}

function finish() {
  root.classList.remove("intro-on", "intro-reveal");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  try { sessionStorage.setItem("leo-intro", "1"); } catch (e) {}
  document.dispatchEvent(new CustomEvent("leo:intro-done"));
}

function skip() { if (running && !wiping) wipe(); }
intro.addEventListener("click", skip);
document.addEventListener("keydown", e => {
  if (!root.classList.contains("intro-on")) return;
  if (["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); skip(); }
});

function play() {
  if (reduce) return;
  cancelAnimationFrame(raf);
  root.classList.remove("intro-reveal");
  root.classList.add("intro-on");
  setup();
  running = true; t0 = performance.now();
  raf = requestAnimationFrame(frame);
}

window.LeoIntro = { play, skip };
if (root.classList.contains("intro-on")) {
  if (reduce) root.classList.remove("intro-on");
  else play();
}
})();
