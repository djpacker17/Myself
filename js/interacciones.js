/* =========================================================
   Leo · Portafolio — Animaciones de interacción y de scroll
   - Al hacer clic: ondas en los botones, onda en la cuadrícula
     del fondo, ráfagas de cuadrados y rebotes.
   - Al bajar y subir: encabezado que se esconde, cinta que
     cambia de dirección, cuadrícula con profundidad, paralaje,
     títulos que aparecen palabra por palabra y botón para subir.
   Todo se desactiva si el visitante pide «reducir movimiento».
   ========================================================= */
(function () {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lang = () => (root.lang === "en" ? "en" : "es");
const TXT = { es: { top: "Volver arriba" }, en: { top: "Back to top" } };

/* ---------- Ráfaga de cuadrados (se usa en clics especiales) ---------- */
function burst(x, y, colors, n = 14, spread = 1) {
  if (reduce) return;
  const box = document.createElement("div");
  box.className = "fx-burst"; box.style.left = x + "px"; box.style.top = y + "px";
  document.body.appendChild(box);
  let alive = n;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i"), size = 6 + Math.random() * 7;
    const a = (Math.PI * 2 * i) / n + Math.random() * .5, d = (46 + Math.random() * 70) * spread;
    s.style.width = s.style.height = size + "px";
    s.style.background = colors[i % colors.length];
    box.appendChild(s);
    s.animate([
      { transform: "translate(-50%,-50%) scale(.4) rotate(0deg)", opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d * .8}px), calc(-50% + ${Math.sin(a) * d * .8}px)) scale(1.1) rotate(${(Math.random() - .5) * 200}deg)`, opacity: 1, offset: .55 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 22}px)) scale(.4) rotate(${(Math.random() - .5) * 320}deg)`, opacity: 0 }
    ], { duration: 650 + Math.random() * 350, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" }).onfinish = () => { if (--alive === 0) box.remove(); };
  }
}
window.LeoFX = { burst };

if (reduce) return;
root.classList.add("fx-on");

/* ---------- Onda al presionar botones, chips y pestañas ---------- */
const RIPPLE = ".btn,.chip,.tab,.theme,.lang,.msg-lang button,.rbx-play,.shop-add,.shop-wa,.shop-qty button,.bd-toggle,.faq summary,.sound,.intro-skip,footer button,.to-top,.service .ask";
document.addEventListener("pointerdown", e => {
  const el = e.target.closest(RIPPLE);
  if (!el || e.button > 0) return;
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  let wrap = el.querySelector(":scope > .rip-wrap");
  if (!wrap) { wrap = document.createElement("span"); wrap.className = "rip-wrap"; wrap.setAttribute("aria-hidden", "true"); el.appendChild(wrap); }
  const r = el.getBoundingClientRect(), size = Math.hypot(r.width, r.height) * 2;
  const dot = document.createElement("span");
  dot.className = "rip";
  dot.style.width = dot.style.height = size + "px";
  dot.style.left = (e.clientX - r.left - size / 2) + "px";
  dot.style.top = (e.clientY - r.top - size / 2) + "px";
  wrap.appendChild(dot);
  setTimeout(() => dot.remove(), 700);
}, { passive: true });

/* ---------- Onda en la cuadrícula del fondo al hacer clic ---------- */
const INTERACTIVE = "a,button,input,textarea,summary,label,[role=switch],[role=tab]";
document.addEventListener("pointerdown", e => {
  if (root.classList.contains("intro-on") || !window.LeoBG) return;
  const box = e.target.closest(".contact-box");
  if (box && LeoBG.cf) {
    const r = box.getBoundingClientRect();
    LeoBG.cf.pulse(e.clientX - r.left, e.clientY - r.top, .95, 420, 1000);
    return;
  }
  const onUI = e.target.closest(INTERACTIVE);
  LeoBG.bg.pulse(e.clientX, e.clientY, onUI ? .9 : 1.6, onUI ? 300 : 620, onUI ? 850 : 1300);
}, { passive: true });

/* ---------- Rebotes y destellos al tocar cosas ---------- */
document.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (chip) { chip.classList.remove("pop"); void chip.offsetWidth; chip.classList.add("pop"); }

  const pick = e.target.closest("[data-pick]");
  if (pick) {
    setTimeout(() => {
      const c = $(`#b-types [data-type="${pick.dataset.pick}"]`);
      if (c) { c.classList.remove("ping"); void c.offsetWidth; c.classList.add("ping"); }
    }, 850);
  }

  if (e.target.closest(".brand")) {
    $(".mark").animate([{ rotate: "0deg", scale: 1 }, { rotate: "-200deg", scale: .85, offset: .5 }, { rotate: "-360deg", scale: 1 }], { duration: 700, easing: "cubic-bezier(.3,1.3,.5,1)" });
  }

  const photo = e.target.closest(".profile .photo");
  if (photo) {
    photo.animate([{ scale: 1 }, { scale: .95, offset: .3 }, { scale: 1.025, offset: .7 }, { scale: 1 }], { duration: 520, easing: "ease-out" });
    const cs = getComputedStyle(root);
    burst(e.clientX, e.clientY, [cs.getPropertyValue("--accent").trim(), cs.getPropertyValue("--accent-2").trim(), "#ffffff"], 16, 1.2);
  }

  if (e.target.closest(".kit figure")) {
    const f = e.target.closest(".kit figure");
    f.animate([{ scale: 1 }, { scale: .97, offset: .35 }, { scale: 1 }], { duration: 380, easing: "ease-out" });
  }
});

/* ---------- Pestañas de «Pruébalo»: indicador deslizante y código en cascada ---------- */
const tabsBox = $(".tabs"), pre = $("#code-pre");
if (tabsBox) {
  const ind = document.createElement("span");
  ind.className = "tab-ind"; ind.setAttribute("aria-hidden", "true");
  tabsBox.prepend(ind); tabsBox.classList.add("has-ind");
  const place = (instant) => {
    const t = $(".tab[aria-selected='true']", tabsBox); if (!t) return;
    if (instant) ind.style.transition = "none";
    ind.style.width = t.offsetWidth + "px";
    ind.style.transform = `translateX(${t.offsetLeft}px)`;
    if (instant) { void ind.offsetWidth; ind.style.transition = ""; }
  };
  let cascadeT;
  new MutationObserver(muts => {
    if (!muts.some(m => m.attributeName === "aria-selected" && m.target.getAttribute("aria-selected") === "true")) return;
    place();
    pre.classList.remove("cascade"); void pre.offsetWidth; pre.classList.add("cascade");
    clearTimeout(cascadeT); cascadeT = setTimeout(() => pre.classList.remove("cascade"), 1400);
  }).observe(tabsBox, { attributes: true, subtree: true, attributeFilter: ["aria-selected"] });
  place(true);
  addEventListener("resize", () => place(true));
  document.addEventListener("leo:lang", () => requestAnimationFrame(() => place()));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => place(true));
}

/* ---------- Preguntas: se abren y cierran suavemente ---------- */
$$(".faq details").forEach(d => {
  const s = $("summary", d), a = $(".ans", d);
  s.addEventListener("click", e => {
    e.preventDefault();
    if (d._anim) d._anim.cancel();
    const ease = "cubic-bezier(.2,.8,.2,1)";
    if (!d.open || d.classList.contains("closing")) {
      d.classList.remove("closing"); d.open = true;
      const h = a.offsetHeight;
      d._anim = a.animate([{ height: "0px", opacity: 0, paddingBottom: "0px" }, { height: h + "px", opacity: 1, paddingBottom: "22px" }], { duration: 420, easing: ease });
      d._anim.onfinish = () => { d._anim = null; };
    } else {
      const h = a.offsetHeight; d.classList.add("closing");
      d._anim = a.animate([{ height: h + "px", opacity: 1, paddingBottom: "22px" }, { height: "0px", opacity: 0, paddingBottom: "0px" }], { duration: 300, easing: "cubic-bezier(.4,0,.6,1)" });
      d._anim.onfinish = () => { d.open = false; d.classList.remove("closing"); d._anim = null; };
    }
  });
});

/* ---------- Títulos que aparecen palabra por palabra al bajar ---------- */
function splitWords(el) {
  let i = 0;
  [...el.childNodes].forEach(n => {
    if (n.nodeType !== 3) { if (n.nodeType === 1) { n.classList.add("tw"); n.style.setProperty("--i", i++); } return; }
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      const w = document.createElement("span"); w.className = "tw"; w.style.setProperty("--i", i++); w.textContent = part; frag.appendChild(w);
    });
    n.replaceWith(frag);
  });
}
$$(".title").forEach(splitWords);

/* ---------- Texto que se «decodifica» como código ---------- */
const GLYPHS = "<>/{}[]=+*#_01$&";
let gen = 0;
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function scramble(el, dur = 700) {
  if (el.children.length) return;
  const final = el.textContent; if (!final.trim()) return;
  const myGen = gen, start = performance.now();
  const at = [...final].map((c, i) => (c === " " ? 0 : .25 + Math.random() * .55 + (i / final.length) * .2));
  el.setAttribute("aria-label", final);
  const tick = now => {
    if (myGen !== gen) return;
    const p = (now - start) / dur;
    if (p >= 1) { el.textContent = final; el.removeAttribute("aria-label"); return; }
    let out = "";
    for (let i = 0; i < final.length; i++) out += p >= at[i] ? esc(final[i]) : `<span class="scr">${esc(GLYPHS[(Math.random() * GLYPHS.length) | 0])}</span>`;
    el.innerHTML = out;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };
if ("IntersectionObserver" in window) {
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    so.unobserve(e.target); setTimeout(() => scramble(e.target, 650), 120);
  }), { threshold: 1, rootMargin: "0px 0px -10% 0px" });
  $$(".block-head h2").forEach(h => so.observe(h));
}
document.addEventListener("leo:lang", e => {
  if (e.detail && e.detail.first) return;
  gen++;
  $$(".title").forEach(splitWords);
  $$(".block-head h2, .nav ul a, .status > span, .tab > span, .b-out-top h3, .result-top > span:last-child, .b-step legend > span:not(.n)")
    .filter(inView).forEach(el => scramble(el, 600));
  toTop.setAttribute("aria-label", TXT[lang()].top); toTop.title = TXT[lang()].top;
});

/* ---------- Botón para volver arriba con anillo de progreso ---------- */
const toTop = document.createElement("button");
toTop.type = "button"; toTop.className = "to-top"; toTop.id = "to-top";
toTop.setAttribute("aria-label", TXT[lang()].top); toTop.title = TXT[lang()].top;
toTop.innerHTML = '<svg class="tt-ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="tt-bg" cx="24" cy="24" r="21"/><circle class="tt-fg" cx="24" cy="24" r="21"/></svg><svg class="ico tt-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
document.body.appendChild(toTop);
const ringC = 2 * Math.PI * 21, ringFg = $(".tt-fg", toTop);
ringFg.style.strokeDasharray = ringC;
toTop.addEventListener("click", () => {
  toTop.classList.remove("launch"); void toTop.offsetWidth; toTop.classList.add("launch");
  scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- Todo lo que reacciona al scroll ---------- */
const nav = $("#nav"), grid = $(".bg-grid"), g1 = $(".glow.g1"), g2 = $(".glow.g2");
const profWrap = $(".profile-wrap"), heroSec = $(".hero"), shot = $(".case .browser");
const kitFigs = $$(".kit figure"), mcta = $("#m-cta");
let lastY = scrollY, ticking = false, scrollVel = 0, scrollDir = -1;

function onScrollFrame() {
  ticking = false;
  const y = scrollY, dy = y - lastY; lastY = y;
  if (Math.abs(dy) > 0) { scrollVel = Math.min(60, scrollVel + Math.abs(dy) * .9); scrollDir = dy > 0 ? -1 : 1; }

  /* Encabezado: se esconde al bajar y vuelve al subir */
  if (!nav.contains(document.activeElement)) {
    if (y > 320 && dy > 6) nav.classList.add("hide");
    else if (dy < -6 || y < 120) nav.classList.remove("hide");
  }

  /* Cuadrícula del fondo con profundidad */
  if (window.LeoBG) grid.style.setProperty("--gy", LeoBG.bg.scroll(y, .3).toFixed(2) + "px");

  /* Luces del fondo y tarjeta de perfil (paralaje) */
  g1.style.translate = `0 ${(y * -.12).toFixed(1)}px`;
  g2.style.translate = `0 ${(y * .08).toFixed(1)}px`;
  if (y < heroSec.offsetHeight * 1.2) profWrap.style.translate = `0 ${(y * .1).toFixed(1)}px`;

  /* Captura de Zypuc y kit de marca se mueven a distinta velocidad */
  const vh = innerHeight;
  if (shot) { const r = shot.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh) shot.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -.05).toFixed(1)}px`; }
  kitFigs.forEach((f, i) => {
    const r = f.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
    f.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * [-.03, -.06, -.045, -.02][i % 4]).toFixed(1)}px`;
  });

  /* Botón para subir: aparece al bajar y muestra el progreso */
  const max = document.documentElement.scrollHeight - vh, p = max > 0 ? y / max : 0;
  toTop.classList.toggle("show", y > vh * 1.1);
  toTop.classList.toggle("lift", mcta && mcta.classList.contains("show"));
  ringFg.style.strokeDashoffset = (ringC * (1 - p)).toFixed(1);
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); } }, { passive: true });
onScrollFrame();

/* ---------- Cinta de herramientas: acelera con el scroll y cambia de dirección ---------- */
const track = $("#marquee"), mq = $(".marquee");
if (track && mq) {
  let x = 0, dirF = -1, hover = false, visible = true, prev = performance.now(), half = track.scrollWidth / 2;
  mq.addEventListener("mouseenter", () => hover = true);
  mq.addEventListener("mouseleave", () => hover = false);
  addEventListener("resize", () => { half = track.scrollWidth / 2; });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { half = track.scrollWidth / 2; });
  if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => visible = e.isIntersecting)).observe(mq);
  const loop = now => {
    const dt = Math.min(.05, (now - prev) / 1000); prev = now;
    scrollVel *= Math.pow(.04, dt);
    dirF += (scrollDir - dirF) * Math.min(1, dt * 4);
    if (visible && half > 0) {
      const base = half / 40, speed = hover ? base * .15 : base * (1 + scrollVel / 6);
      x += dirF * speed * dt;
      if (x <= -half) x += half; else if (x > 0) x -= half;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
})();
