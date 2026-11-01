/* =========================================================
   Leo · Portafolio
   Configuración: cambia tus enlaces aquí.
   ========================================================= */
const CONFIG = {
  fiverr: "https://es.pro.fiverr.com/s/EmmQYNe",
  github: "https://github.com/djpacker17",
  goatcounter: ""   // Opcional: tu código de GoatCounter (por ejemplo "leo-dev") para contar visitas
};

(function () {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

$$(".js-fiverr").forEach(a => a.href = CONFIG.fiverr);
$$(".js-github").forEach(a => a.href = CONFIG.github);
$("#year").textContent = new Date().getFullYear();

/* ---------- Textos que cambian con JavaScript ---------- */
const STR = {
  es: {
    title: "Leo | Desarrollador web, de apps y diseñador de marca",
    lang: "Cambiar idioma", theme: "Cambiar entre modo claro y oscuro",
    sound: "Activar sonido", soundOff: "Silenciar",
    copied: c => `Copiado: ${c}`,
    nRbx: "Recreación web de una interfaz hecha en Roblox Studio. Prueba los interruptores y el botón.",
    nShop: "Así funciona el carrito de Zypuc. En la tienda real, el botón abre WhatsApp con el pedido listo.",
    nBrand: "El kit de marca de Zypuc. Toca un color para copiarlo.",
    dark: "Ver en fondo oscuro", light: "Ver en fondo claro",
    waMsg: (q, t) => `Hola Zypuc, quiero:\n${q} × Audífonos JBL Tune 520BT\nTotal: S/ ${t}`,
    pickFirst: "Primero elige qué necesitas en el paso 1.",
    msgCopied: "Mensaje copiado. En Fiverr toca «Contactar» y pégalo.",
    msgCopiedOnly: "Mensaje copiado.",
    copyFail: "No se pudo copiar. Selecciona el texto y cópialo a mano.",
    placeholder: "Elige al menos una opción en el paso 1 y aquí aparecerá tu mensaje, listo para pegar en Fiverr.",
    copiedBtn: "¡Copiado!"
  },
  en: {
    title: "Leo | Web and app developer, brand designer",
    lang: "Change language", theme: "Switch between light and dark mode",
    sound: "Turn sound on", soundOff: "Mute",
    copied: c => `Copied: ${c}`,
    nRbx: "Web recreation of an interface built in Roblox Studio. Try the switches and the button.",
    nShop: "This is how the Zypuc cart works. In the real store, the button opens WhatsApp with the order ready.",
    nBrand: "The Zypuc brand kit. Tap a color to copy it.",
    dark: "View on dark background", light: "View on light background",
    waMsg: (q, t) => `Hi Zypuc, I'd like:\n${q} × JBL Tune 520BT headphones\nTotal: S/ ${t}`,
    pickFirst: "First choose what you need in step 1.",
    msgCopied: "Message copied. On Fiverr, tap “Contact” and paste it.",
    msgCopiedOnly: "Message copied.",
    copyFail: "Couldn't copy. Select the text and copy it by hand.",
    placeholder: "Choose at least one option in step 1 and your message will appear here, ready to paste on Fiverr.",
    copiedBtn: "Copied!"
  }
};
let LANG = root.lang === "en" ? "en" : "es";
const S = () => STR[LANG];

/* ---------- Avisos ---------- */
const toastEl = $("#toast"); let toastT;
function toast(msg) {
  toastEl.textContent = msg; toastEl.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 2600);
}
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((res, rej) => {
    const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); } finally { ta.remove(); }
  });
}

/* ---------- Resaltado de código (Luau, JavaScript, CSS, HTML) ---------- */
const KW = {
  luau: "local function end if then else elseif for in do while return not and or true false nil",
  js: "const let var function return if else for of in new true false null undefined",
  css: "",
  html: ""
};
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function scan(line, rules) {
  let out = "", i = 0;
  outer: while (i < line.length) {
    for (const [re, cls] of rules) {
      re.lastIndex = i; const m = re.exec(line);
      if (m && m.index === i && m[0].length) {
        out += typeof cls === "function" ? cls(m) : cls ? `<span class="${cls}">${esc(m[0])}</span>` : esc(m[0]);
        i += m[0].length; continue outer;
      }
    }
    out += esc(line[i]); i++;
  }
  return out;
}
const CSS_RULES = [
  [/\/\*.*?(?:\*\/|$)/y, "t-com"], [/"[^"]*"|'[^']*'/y, "t-str"], [/#[0-9A-Fa-f]{3,8}\b/y, "t-num"],
  [/--[a-z-]+/y, "t-prop"], [/\d*\.?\d+(?:px|s|ms|%|em|rem)?\b/y, "t-num"], [/[a-z-]+(?=\s*:\s)/y, "t-kw"],
  [/[.:][a-z][a-z-]*/y, "t-fn"], [/[a-z]+(?=\()/y, "t-fn"], [/[{}();:,]/y, "t-pun"], [/\s+/y, null], [/[A-Za-z_-]+/y, null]
];
const HTML_RULES = [
  [/<\/?([a-z0-9]+)/y, m => `<span class="t-pun">${esc(m[0].slice(0, m[0].length - m[1].length))}</span><span class="t-tag">${m[1]}</span>`],
  [/[a-z-]+(?==)/y, "t-prop"], [/"[^"]*"/y, "t-str"], [/[>=]/y, "t-pun"], [/\s+/y, null], [/[^<>"=\s]+/y, null]
];
function highlight(line, lang) {
  if (lang === "css") return scan(line, CSS_RULES);
  if (lang === "html") return /^\s*</.test(line) ? scan(line, HTML_RULES) : scan(line, CSS_RULES);
  const kws = new Set(KW[lang].split(" "));
  const com = lang === "luau" ? "--" : "//";
  let out = "", i = 0;
  let ci = -1;
  for (let k = line.indexOf(com); k >= 0; k = line.indexOf(com, k + 1)) {
    const before = line.slice(0, k);
    if (['"', "'", "`"].every(q => before.split(q).length % 2 === 1)) { ci = k; break; }
  }
  const code = ci >= 0 ? line.slice(0, ci) : line;
  const rest = code === line ? "" : line.slice(code.length);
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_"'`]+)/g;
  let m;
  while ((m = re.exec(code))) {
    if (m[1]) out += `<span class="t-str">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="t-num">${m[2]}</span>`;
    else if (m[3]) {
      const w = m[3], next = code.slice(re.lastIndex), prev = code.slice(0, m.index);
      if (kws.has(w)) out += `<span class="t-kw">${w}</span>`;
      else if (/^\s*\(/.test(next)) out += `<span class="t-fn">${w}</span>`;
      else if (/[.:]$/.test(prev)) out += `<span class="t-prop">${w}</span>`;
      else if (/^[A-Z]/.test(w)) out += `<span class="t-fn">${w}</span>`;
      else out += w;
    }
    else if (m[4]) out += m[4];
    else out += `<span class="t-pun">${esc(m[5])}</span>`;
  }
  if (rest) out += `<span class="t-com">${esc(rest)}</span>`;
  return out;
}
window.LeoHL = highlight;

/* ---------- Título palabra por palabra ---------- */
function splitTitle() {
  const h = $("[data-split]"); let i = 0;
  h.classList.add("ready");
  [...h.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement("span"); s.className = "w"; s.style.setProperty("--i", i++); s.textContent = part; frag.appendChild(s);
      });
      n.replaceWith(frag);
    } else if (n.classList && n.classList.contains("grad")) {
      n.classList.add("w"); n.style.setProperty("--i", i++); n.style.whiteSpace = "normal"; n.style.display = "inline";
    }
  });
}

/* ---------- Idiomas ---------- */
const ES = {};
$$("[data-i18n]").forEach(el => ES[el.dataset.i18n] = el.innerHTML);
$$("[data-i18n-alt]").forEach(el => ES[el.dataset.i18nAlt] = el.alt);
$$("[data-i18n-ph]").forEach(el => ES[el.dataset.i18nPh] = el.placeholder);
function setLang(l, first) {
  LANG = l === "en" ? "en" : "es";
  const dict = LANG === "en" ? (window.LEO_EN || {}) : ES;
  root.lang = LANG;
  $$("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
  $$("[data-i18n-alt]").forEach(el => { const v = dict[el.dataset.i18nAlt]; if (v != null) el.alt = v; });
  $$("[data-i18n-ph]").forEach(el => { const v = dict[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
  document.title = S().title;
  $("#lang").setAttribute("aria-label", S().lang);
  $("#theme").setAttribute("aria-label", S().theme);
  const h = $("[data-split]");
  if (!first) h.classList.add("done");
  splitTitle();
  syncSound(); renderDemo(); syncBrandToggle();
  if (!builder.touchedLang) builder.msgLang = LANG;
  renderExtras(); renderMsg();
  try { localStorage.setItem("leo-lang", LANG); } catch (e) {}
  document.dispatchEvent(new CustomEvent("leo:lang", { detail: { lang: LANG, first: !!first } }));
}
$("#lang").addEventListener("click", () => setLang(LANG === "es" ? "en" : "es"));

/* ---------- Tema claro / oscuro ---------- */
$("#theme").addEventListener("click", e => {
  const btn = e.currentTarget;
  const apply = () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("leo-theme", root.dataset.theme); } catch (e) {}
    if (window.__recolor) window.__recolor();
  };
  btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
  if (!document.startViewTransition || reduce) { apply(); return; }
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => root.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
    { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)", pseudoElement: "::view-transition-new(root)" }
  )).catch(() => {});
});

/* ---------- Barra superior, progreso y línea de tiempo ---------- */
const nav = $("#nav"), prog = $("#progress"), tl = $("#timeline"), tlItems = $$("li", tl);
const mcta = $("#m-cta"); let contactVisible = false;
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 8);
  const max = document.documentElement.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  const r = tl.getBoundingClientRect(), mid = innerHeight * .6;
  tl.style.setProperty("--p", Math.max(0, Math.min(1, (mid - r.top) / r.height)));
  tlItems.forEach(li => li.classList.toggle("lit", li.getBoundingClientRect().top < mid));
  mcta.classList.toggle("show", scrollY > innerHeight * .9 && !contactVisible);
}
addEventListener("scroll", onScroll, { passive: true });

/* ---------- Revelado, contadores y menú activo ---------- */
const countUp = el => {
  const end = +el.dataset.count, t0 = performance.now(), dur = 1300;
  if (reduce) { el.textContent = end; return; }
  const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); $$("[data-count]", e.target).forEach(countUp); io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach(el => io.observe(el));
  const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); so.disconnect(); } }), { threshold: .4 });
  so.observe($("#steps"));
  const links = $$(".nav ul a");
  const mo = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(l => { const s = $(l.getAttribute("href")); if (s) mo.observe(s); });
  new IntersectionObserver(es => es.forEach(e => { contactVisible = e.isIntersecting; onScroll(); }), { threshold: .2 }).observe($("#contacto"));
} else {
  $$("[data-reveal]").forEach(el => el.classList.add("in"));
  $$("[data-count]").forEach(el => el.textContent = el.dataset.count);
}

/* ---------- Cinta de herramientas infinita ---------- */
const mq = $("#marquee"), n0 = mq.children.length;
mq.innerHTML += mq.innerHTML;
[...mq.children].slice(n0).forEach(s => s.setAttribute("aria-hidden", "true"));

/* ---------- Tarjeta de perfil, botones magnéticos y brillo ---------- */
if (finePointer && !reduce) {
  const prof = $("#profile"), hero = $(".hero");
  hero.addEventListener("mousemove", e => {
    const r = prof.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    prof.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    prof.style.setProperty("--sx", ((e.clientX - r.left) / r.width * 100) + "%");
    prof.style.setProperty("--sy", ((e.clientY - r.top) / r.height * 100) + "%");
  });
  hero.addEventListener("mouseleave", () => prof.style.transform = "");
  $$(".magnetic").forEach(b => {
    b.addEventListener("mousemove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
    });
    b.addEventListener("mouseleave", () => b.style.transform = "");
  });
}
$$(".spot").forEach(c => c.addEventListener("mousemove", e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
}));

/* ---------- Video de la marca ---------- */
const vid = $("#intro-video"), soundBtn = $("#sound");
function syncSound() {
  const on = !vid.muted;
  soundBtn.setAttribute("aria-pressed", on);
  soundBtn.innerHTML = `<svg class="ico"><use href="#i-${on ? "sound" : "mute"}"/></svg><span>${on ? S().soundOff : S().sound}</span>`;
}
soundBtn.addEventListener("click", () => { vid.muted = !vid.muted; if (vid.paused) vid.play().catch(() => {}); syncSound(); });
if ("IntersectionObserver" in window) {
  new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting && !reduce) { vid.preload = "auto"; vid.play().catch(() => {}); } else vid.pause();
  }), { threshold: .4 }).observe(vid);
}
if (reduce) vid.setAttribute("controls", "");

/* ---------- Colores copiables ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]"); if (!b) return;
  const c = b.dataset.copy;
  copyText(c).then(() => toast(S().copied(c))).catch(() => toast(c));
  b.classList.remove("copied"); void b.offsetWidth; b.classList.add("copied");
  clearTimeout(b._ct); b._ct = setTimeout(() => b.classList.remove("copied"), 900);
  flash("colors");
});

/* =========================================================
   Pruébalo: código a la izquierda, resultado a la derecha
   ⟦clave⟧ al final de una línea la conecta con un control.
   ========================================================= */
const DEMOS = {
  rbx: { file: "Ajustes.client.luau", lang: "Luau", hl: "luau", note: "nRbx", code: {
    es: `local TweenService = game:GetService("TweenService")
local menu = script.Parent
local tema = Color3.fromRGB(0, 162, 255)

local function alternar(boton, activo)
  local color = activo and tema or Color3.fromRGB(58, 66, 82)
  TweenService:Create(boton, TweenInfo.new(0.25), {BackgroundColor3 = color}):Play()
end

menu.Musica.Activated:Connect(function() ⟦music⟧
  ajustes.musica = not ajustes.musica ⟦music⟧
  alternar(menu.Musica, ajustes.musica) ⟦music⟧
end) ⟦music⟧

menu.Sombras.Activated:Connect(function() ⟦shadow⟧
  game.Lighting.GlobalShadows = not game.Lighting.GlobalShadows ⟦shadow⟧
  alternar(menu.Sombras, game.Lighting.GlobalShadows) ⟦shadow⟧
end) ⟦shadow⟧

Deslizador.Cambio:Connect(function(valor) ⟦sens⟧
  UserInputService.MouseDeltaSensitivity = valor / 5 ⟦sens⟧
end) ⟦sens⟧

for _, boton in menu.Temas:GetChildren() do ⟦theme⟧
  boton.Activated:Connect(function() tema = boton.BackgroundColor3 end) ⟦theme⟧
end ⟦theme⟧

menu.Jugar.Activated:Connect(function() ⟦play⟧
  local info = TweenInfo.new(0.4, Enum.EasingStyle.Back) ⟦play⟧
  TweenService:Create(menu.Jugar, info, {Size = UDim2.fromOffset(240, 56)}):Play() ⟦play⟧
  empezarPartida() ⟦play⟧
end) ⟦play⟧` } },
  shop: { file: "tienda.js", lang: "JavaScript", hl: "js", note: "nShop", code: {
    es: `const carrito = [];
const producto = { nombre: "Audífonos JBL Tune 520BT", precio: 164.90 };
let cantidad = 1;

function cambiarCantidad(paso) { ⟦qty⟧
  cantidad = Math.max(1, cantidad + paso); ⟦qty⟧
  pintar("#cantidad", cantidad); ⟦qty⟧
} ⟦qty⟧

function agregar() { ⟦add⟧
  carrito.push({ ...producto, cantidad }); ⟦add⟧
  animar("#carrito", "rebote"); ⟦add⟧
} ⟦add⟧

function pedirPorWhatsApp() { ⟦wa⟧
  const lineas = carrito.map(p => \`\${p.cantidad} × \${p.nombre}\`); ⟦wa⟧
  const texto = \`Hola Zypuc, quiero:\\n\${lineas.join("\\n")}\\nTotal: S/ \${total(carrito)}\`; ⟦wa⟧
  abrir(\`https://wa.me/51939670295?text=\${encodeURIComponent(texto)}\`); ⟦wa⟧
} ⟦wa⟧

const total = lista =>
  lista.reduce((suma, p) => suma + p.precio * p.cantidad, 0).toFixed(2);` } },
  brand: { file: "marca-zypuc.css", lang: "CSS", hl: "css", note: "nBrand", code: {
    es: `/* Colores y tipografías del manual de marca */
:root {
  --azul-electrico: #0B5ED7; ⟦colors⟧
  --turquesa: #14B8A6; ⟦colors⟧
  --ambar: #F59E0B; ⟦colors⟧
  --azul-noche: #0F172A; ⟦colors⟧
  --blanco: #FFFFFF; ⟦colors⟧
  --titulos: "Fredoka", sans-serif; ⟦type⟧
  --textos: "Nunito Sans", sans-serif; ⟦type⟧
}

.logo { height: 64px; } ⟦logo⟧
.modo-oscuro .logo { content: url("logo-oscuro.png"); } ⟦dark⟧
.modo-oscuro .tarjeta { background: var(--azul-noche); } ⟦dark⟧

.eslogan { ⟦type⟧
  font-family: var(--titulos); ⟦type⟧
  color: var(--azul-noche); ⟦type⟧
} ⟦type⟧
.eslogan em { color: var(--turquesa); font-style: normal; } ⟦type⟧` } }
};
DEMOS.rbx.code.en = DEMOS.rbx.code.es; DEMOS.shop.code.en = DEMOS.shop.code.es;
DEMOS.brand.code.en = DEMOS.brand.code.es.replace("/* Colores y tipografías del manual de marca */", "/* Colors and fonts from the brand manual */");
let current = "rbx";
const pre = $("#code-pre");
function renderDemo() {
  const d = DEMOS[current];
  $("#code-file").textContent = d.file; $("#code-lang").textContent = d.lang;
  pre.innerHTML = d.code[LANG].split("\n").map((raw, i) => {
    const m = raw.match(/\s*⟦([a-z]+)⟧\s*$/);
    const line = m ? raw.slice(0, m.index) : raw;
    return `<span class="ln"${m ? ` data-k="${m[1]}"` : ""} data-n="${i + 1}" style="--n:${i}">${highlight(line, d.hl) || " "}</span>`;
  }).join("");
  $("#result-note").textContent = S()[d.note];
}
let flashT;
function flash(key) {
  const lines = $$(`.ln[data-k="${key}"]`, pre); if (!lines.length) return;
  $$(".ln.hl", pre).forEach(l => l.classList.remove("hl"));
  lines.forEach(l => l.classList.add("hl"));
  const first = lines[0], box = pre.getBoundingClientRect(), r = first.getBoundingClientRect();
  if (r.top < box.top || r.bottom > box.bottom) pre.scrollTo({ top: first.offsetTop - 30, behavior: reduce ? "auto" : "smooth" });
  clearTimeout(flashT); flashT = setTimeout(() => lines.forEach(l => l.classList.remove("hl")), 1600);
}
const tabs = $$(".tab");
function selectTab(t, focus) {
  current = t.dataset.demo;
  tabs.forEach(x => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
  $("#lab").setAttribute("aria-labelledby", t.id);
  $$(".demo").forEach(d => d.hidden = d.dataset.demo !== current);
  renderDemo(); if (focus) t.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); selectTab(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true); }
  });
});

/* Demo Roblox */
const rbx = $("#rbx");
$$(".rbx-toggle", rbx).forEach(b => b.addEventListener("click", () => {
  b.setAttribute("aria-checked", b.getAttribute("aria-checked") !== "true"); flash(b.dataset.line);
}));
$(".rbx-range", rbx).addEventListener("input", () => flash("sens"));
$$(".rbx-colors button", rbx).forEach(b => b.addEventListener("click", () => {
  $$(".rbx-colors button", rbx).forEach(x => x.setAttribute("aria-pressed", x === b));
  rbx.style.setProperty("--rc", b.dataset.c); flash("theme");
}));
const play = $(".rbx-play", rbx);
play.addEventListener("click", e => {
  play.classList.remove("pop"); void play.offsetWidth; play.classList.add("pop"); flash("play");
  const r = play.getBoundingClientRect(), c = getComputedStyle(rbx).getPropertyValue("--rc").trim() || "#00A2FF";
  if (window.LeoFX) LeoFX.burst(r.left + r.width / 2, r.top + r.height / 2, [c, "#2DD4BF", "#FFB020", c], 24, 1.5);
});

/* Demo tienda */
let qty = 1, cart = 0;
const PRICE = 164.9;
$$("[data-q]").forEach(b => b.addEventListener("click", () => { qty = Math.max(1, qty + +b.dataset.q); $("#shop-qty").textContent = qty; flash("qty"); }));
function flyTo(src, dst, done) {
  if (reduce || !src || !dst) { done(); return; }
  const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
  const ghost = src.cloneNode(true);
  Object.assign(ghost.style, { position: "fixed", left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", margin: 0, zIndex: 130, pointerEvents: "none", borderRadius: "12px", objectFit: "contain", background: "#fff", boxShadow: "0 18px 40px -12px rgba(11,94,215,.5)" });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const s = Math.max(.08, 22 / a.width);
  const anim = ghost.animate([
    { transform: "translate(0,0) scale(1)", opacity: 1 },
    { transform: `translate(${dx * .45}px, ${dy * .45 - 90}px) scale(.55) rotate(-8deg)`, opacity: 1, offset: .45 },
    { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(-14deg)`, opacity: .2 }
  ], { duration: 720, easing: "cubic-bezier(.45,0,.2,1)" });
  anim.onfinish = () => { ghost.remove(); done(); };
}
$("#shop-add").addEventListener("click", () => {
  cart += qty; flash("add");
  const btn = $("#shop-add"); btn.classList.remove("pressed"); void btn.offsetWidth; btn.classList.add("pressed");
  flyTo($(".shop-img img"), $("#shop-badge"), () => {
    const badge = $("#shop-badge"); badge.textContent = cart;
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    $("#shop-wa").disabled = false;
  });
});
let waT;
$("#shop-wa").addEventListener("click", () => {
  const bub = $("#wa-bubble"); flash("wa"); clearTimeout(waT);
  bub.hidden = false; bub.classList.add("typing"); bub.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  waT = setTimeout(() => { bub.classList.remove("typing"); bub.textContent = S().waMsg(cart, (cart * PRICE).toFixed(2)); }, reduce ? 0 : 900);
});

/* Demo marca */
const brand = $("#brand"), bdt = $("#bd-toggle");
function syncBrandToggle() { bdt.textContent = brand.classList.contains("dark") ? S().light : S().dark; }
bdt.addEventListener("click", () => { brand.classList.toggle("dark"); syncBrandToggle(); flash("dark"); });
$(".bd-logo", brand).addEventListener("click", () => flash("logo"));
$(".bd-type", brand).addEventListener("click", () => flash("type"));

/* =========================================================
   Arma tu proyecto: arma el mensaje para Fiverr
   ========================================================= */
const TYPES = {
  web: { es: "una página web", en: "a website" },
  store: { es: "una tienda online", en: "an online store" },
  brand: { es: "la identidad de marca (logo y colores)", en: "a brand identity (logo and colors)" },
  roblox: { es: "un script de Roblox", en: "a Roblox script" },
  minecraft: { es: "un mod de Minecraft", en: "a Minecraft mod" },
  auto: { es: "una automatización con JavaScript", en: "a JavaScript automation" },
  video: { es: "un video editado", en: "an edited video" }
};
const EXTRAS = [
  { k: "mobile", for: ["web", "store"], es: "Se ve bien en el celular", en: "Looks great on phones" },
  { k: "wa", for: ["web", "store"], es: "Botón de WhatsApp", en: "WhatsApp button" },
  { k: "cart", for: ["store"], es: "Carrito y pedidos", en: "Cart and orders" },
  { k: "admin", for: ["store"], es: "Panel para editar productos", en: "Panel to edit products" },
  { k: "dark", for: ["web", "store"], es: "Modo oscuro", en: "Dark mode" },
  { k: "pwa", for: ["web", "store"], es: "Instalable como app", en: "Installable as an app" },
  { k: "seo", for: ["web", "store"], es: "Aparecer en Google", en: "Show up on Google" },
  { k: "logo", for: ["brand"], es: "Logo", en: "Logo" },
  { k: "mascot", for: ["brand"], es: "Mascota", en: "Mascot" },
  { k: "icon", for: ["brand"], es: "Ícono de app", en: "App icon" },
  { k: "manual", for: ["brand"], es: "Manual de marca", en: "Brand guide" },
  { k: "rui", for: ["roblox"], es: "Interfaz o menú animado", en: "Animated UI or menu" },
  { k: "combat", for: ["roblox"], es: "Sistema de combate", en: "Combat system" },
  { k: "move", for: ["roblox"], es: "Sistema de movimiento", en: "Movement system" },
  { k: "save", for: ["roblox"], es: "Guardar datos del jugador", en: "Save player data" },
  { k: "mmenu", for: ["minecraft"], es: "Menú con temas", en: "Menu with themes" },
  { k: "mfeat", for: ["minecraft"], es: "Una mecánica nueva", en: "A new mechanic" },
  { k: "atask", for: ["auto"], es: "Automatizar una tarea en una web", en: "Automate a task on a website" },
  { k: "vintro", for: ["video"], es: "Intro animada", en: "Animated intro" },
  { k: "vsocial", for: ["video"], es: "Formato para redes", en: "Social media format" },
  { k: "bilingual", for: ["*"], es: "Español e inglés", en: "Spanish and English" },
  { k: "anim", for: ["*"], es: "Animaciones", en: "Animations" }
];
const WHEN = {
  calm: { es: "sin apuro", en: "no rush" },
  weeks: { es: "en 1 o 2 semanas", en: "within 1 or 2 weeks" },
  asap: { es: "lo antes posible", en: "as soon as possible" }
};
const saved = store.get("leo-brief", {});
const builder = {
  types: new Set(saved.types || []), extras: new Set(saved.extras || []), when: saved.when || "weeks",
  idea: saved.idea || "", msgLang: LANG, touchedLang: false
};
const idea = $("#b-idea"); idea.value = builder.idea;
function saveBrief() { store.set("leo-brief", { types: [...builder.types], extras: [...builder.extras], when: builder.when, idea: builder.idea }); }
function list(items, l) {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + (l === "en" ? " and " : " y ") + items[items.length - 1];
}
function visibleExtras() { return EXTRAS.filter(x => x.for.includes("*") ? builder.types.size > 0 : x.for.some(t => builder.types.has(t))); }
function renderExtras() {
  const box = $("#b-extras"), vis = visibleExtras();
  const keep = new Set(vis.map(x => x.k));
  [...builder.extras].forEach(k => { if (!keep.has(k)) builder.extras.delete(k); });
  const before = new Set($$(".chip", box).map(c => c.dataset.extra));
  box.innerHTML = vis.length ? vis.map(x => `<button type="button" class="chip${before.has(x.k) ? "" : " extra"}" data-extra="${x.k}" aria-pressed="${builder.extras.has(x.k)}">${x[LANG]}</button>`).join("")
    : `<span style="font-size:14px;color:var(--muted)">${LANG === "en" ? "Choose something in step 1 to see options." : "Elige algo en el paso 1 para ver opciones."}</span>`;
}
function message(l) {
  const types = ["web", "store", "brand", "roblox", "minecraft", "auto", "video"].filter(t => builder.types.has(t)).map(t => TYPES[t][l]);
  if (!types.length) return "";
  const lc = s => /^(WhatsApp|Google|Spanish|English)/.test(s) ? s : s[0].toLowerCase() + s.slice(1);
  const ex = EXTRAS.filter(x => builder.extras.has(x.k)).map(x => lc(x[l]));
  const lines = [];
  if (l === "en") {
    lines.push("Hi Leo! I saw your portfolio and I'd like a quote for a project.", "");
    lines.push(`• I need: ${list(types, l)}.`);
    if (ex.length) lines.push(`• It should have: ${list(ex, l)}.`);
    lines.push(`• Timeline: ${WHEN[builder.when].en}.`);
    if (builder.idea.trim()) lines.push(`• My idea: ${builder.idea.trim()}`);
    lines.push("", "Could you send me a proposal with price and timeline? Thanks!");
  } else {
    lines.push("¡Hola, Leo! Vi tu portafolio y quiero cotizar un proyecto.", "");
    lines.push(`• Necesito: ${list(types, l)}.`);
    if (ex.length) lines.push(`• Debe tener: ${list(ex, l)}.`);
    lines.push(`• Plazo: ${WHEN[builder.when].es}.`);
    if (builder.idea.trim()) lines.push(`• Mi idea: ${builder.idea.trim()}`);
    lines.push("", "¿Me puedes enviar una propuesta con precio y plazo? ¡Gracias!");
  }
  return lines.join("\n");
}
let prevMsg = { lang: null, lines: [] };
function renderMsg() {
  const m = message(builder.msgLang), box = $("#b-msg");
  if (m) {
    const lines = m.split("\n"), sameLang = prevMsg.lang === builder.msgLang && prevMsg.lines.length;
    box.innerHTML = lines.map(l => `<span class="ml${sameLang && l.trim() && !prevMsg.lines.includes(l) ? " new" : ""}">${esc(l) || " "}</span>`).join("\n");
    prevMsg = { lang: builder.msgLang, lines };
  } else { box.innerHTML = `<span class="ph">${STR[builder.msgLang].placeholder}</span>`; prevMsg = { lang: builder.msgLang, lines: [] }; }
  $$("[data-ml]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ml === builder.msgLang));
  $$("#b-types .chip").forEach(c => c.setAttribute("aria-pressed", builder.types.has(c.dataset.type)));
  $$("#b-when .chip").forEach(c => c.setAttribute("aria-checked", c.dataset.when === builder.when));
}
$("#b-types").addEventListener("click", e => {
  const c = e.target.closest("[data-type]"); if (!c) return;
  const t = c.dataset.type; builder.types.has(t) ? builder.types.delete(t) : builder.types.add(t);
  renderExtras(); renderMsg(); saveBrief();
});
$("#b-extras").addEventListener("click", e => {
  const c = e.target.closest("[data-extra]"); if (!c) return;
  const k = c.dataset.extra; builder.extras.has(k) ? builder.extras.delete(k) : builder.extras.add(k);
  c.setAttribute("aria-pressed", builder.extras.has(k)); renderMsg(); saveBrief();
});
$("#b-when").addEventListener("click", e => {
  const c = e.target.closest("[data-when]"); if (!c) return;
  builder.when = c.dataset.when; renderMsg(); saveBrief();
});
idea.addEventListener("input", () => { builder.idea = idea.value; renderMsg(); saveBrief(); });
$$("[data-ml]").forEach(b => b.addEventListener("click", () => { builder.msgLang = b.dataset.ml; builder.touchedLang = true; renderMsg(); }));
function copiedFx(btn) {
  if (!btn) return;
  let ok = btn.querySelector(".ok-label");
  if (!ok) { ok = document.createElement("span"); ok.className = "ok-label"; ok.setAttribute("aria-hidden", "true"); btn.appendChild(ok); }
  ok.innerHTML = `<svg class="ico" viewBox="0 0 24 24"><path class="draw" d="M5 12.5l4.5 4.5L19 7.5"/></svg>${S().copiedBtn}`;
  btn.classList.remove("copied"); void btn.offsetWidth; btn.classList.add("copied");
  clearTimeout(btn._ct); btn._ct = setTimeout(() => btn.classList.remove("copied"), 1700);
}
function needTypes() {
  if (builder.types.size) return false;
  toast(S().pickFirst); const first = $("#b-types .chip"); first && first.focus(); return true;
}
$("#b-go").addEventListener("click", () => {
  if (needTypes()) return;
  const text = message(builder.msgLang);
  copyText(text).then(() => { toast(S().msgCopied); copiedFx($("#b-go")); }).catch(() => toast(S().copyFail));
  const w = window.open(CONFIG.fiverr, "_blank");
  if (w) { try { w.opener = null; } catch (e) {} } else setTimeout(() => { location.href = CONFIG.fiverr; }, 900);
});
$("#b-copy").addEventListener("click", () => {
  if (needTypes()) return;
  copyText(message(builder.msgLang)).then(() => { toast(S().msgCopiedOnly); copiedFx($("#b-copy")); }).catch(() => toast(S().copyFail));
});
/* Los botones «Cotizar este servicio» eligen el servicio en el formulario */
const PICK = { web: "web", brand: "brand", roblox: "roblox", minecraft: "minecraft", auto: "auto", video: "video" };
$$("[data-pick]").forEach(a => a.addEventListener("click", () => {
  builder.types.add(PICK[a.dataset.pick]); renderExtras(); renderMsg(); saveBrief();
}));

/* =========================================================
   Fondo: cuadrados que se encienden alrededor del mouse
   ========================================================= */
function squareField(canvas, opts) {
  const ctx = canvas.getContext("2d");
  const SZ = opts.size, R = opts.radius;
  let W = 0, H = 0, cols = 0, rows = 0, cells = new Float32Array(0);
  let mouse = { x: -9999, y: -9999, active: false }, color = "36,83,214", color2 = "20,184,166", running = false, raf = 0;
  let offY = 0, prevV = 0; const pulses = [];
  const toRgb = v => { const h = v.trim().replace("#", ""); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(","); };
  const readColors = () => {
    const cs = getComputedStyle(root);
    color = opts.color || toRgb(cs.getPropertyValue("--accent")); color2 = opts.color2 || toRgb(cs.getPropertyValue("--accent-2"));
  };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / SZ) + 1; rows = Math.ceil(H / SZ) + 1; cells = new Float32Array(cols * rows);
  };
  const hue = new Float32Array(4096).map(() => Math.random());
  const frame = () => {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    if (mouse.active) {
      const cx = Math.floor(mouse.x / SZ), cy = Math.floor((mouse.y + offY) / SZ), n = Math.ceil(R / SZ);
      for (let y = cy - n; y <= cy + n; y++) for (let x = cx - n; x <= cx + n; x++) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const dx = x * SZ + SZ / 2 - mouse.x, dy = y * SZ + SZ / 2 - offY - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < R) { const v = 1 - d / R, i = y * cols + x; if (cells[i] < v) cells[i] = v; }
      }
    }
    const now = performance.now();
    for (let k = pulses.length - 1; k >= 0; k--) {
      const p = pulses[k], prog = (now - p.t0) / p.dur;
      if (prog >= 1) { pulses.splice(k, 1); continue; }
      const rad = p.max * (1 - Math.pow(1 - prog, 2.2)), band = SZ * .9, strength = (1 - prog) * p.power;
      const x0 = Math.max(0, Math.floor((p.x - rad - band) / SZ)), x1 = Math.min(cols - 1, Math.ceil((p.x + rad + band) / SZ));
      const y0 = Math.max(0, Math.floor((p.y + offY - rad - band) / SZ)), y1 = Math.min(rows - 1, Math.ceil((p.y + offY + rad + band) / SZ));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x * SZ + SZ / 2 - p.x, y * SZ + SZ / 2 - offY - p.y), gap = Math.abs(d - rad);
        if (gap < band) { const v = strength * (1 - gap / band), i = y * cols + x; if (cells[i] < v) cells[i] = v; }
      }
    }
    if (Math.random() < opts.twinkle) { const i = (Math.random() * cells.length) | 0; cells[i] = Math.max(cells[i], .55 + Math.random() * .35); }
    for (let i = 0; i < cells.length; i++) {
      const v = cells[i]; if (v < .01) { cells[i] = 0; continue; }
      const x = (i % cols) * SZ, y = ((i / cols) | 0) * SZ - offY, c = hue[i % 4096] > .7 ? color2 : color;
      ctx.fillStyle = `rgba(${c},${v * opts.alpha})`; ctx.fillRect(x + 1, y + 1, SZ - 1, SZ - 1);
      ctx.strokeStyle = `rgba(${c},${v * opts.alpha * 1.6})`; ctx.strokeRect(x + 1.5, y + 1.5, SZ - 2, SZ - 2);
      cells[i] = v * opts.decay;
    }
    raf = requestAnimationFrame(frame);
  };
  readColors(); resize(); addEventListener("resize", resize);
  return {
    move(x, y) { mouse.x = x; mouse.y = y; mouse.active = true; },
    pulse(x, y, power = .95, max = 460, dur = 1100) { pulses.push({ x, y, power, max, dur, t0: performance.now() }); if (pulses.length > 6) pulses.shift(); },
    scroll(pos, speed = .3) {
      const v = pos * speed, shift = Math.floor(v / SZ) - Math.floor(prevV / SZ);
      if (shift) {
        if (Math.abs(shift) >= rows) cells.fill(0);
        else if (shift > 0) { cells.copyWithin(0, shift * cols); cells.fill(0, (rows - shift) * cols); }
        else { cells.copyWithin(-shift * cols, 0, (rows + shift) * cols); cells.fill(0, 0, -shift * cols); }
      }
      prevV = v; offY = v - Math.floor(v / SZ) * SZ; return offY;
    },
    leave() { mouse.active = false; },
    recolor: readColors,
    start() { if (running) return; running = true; raf = requestAnimationFrame(frame); },
    stop() { running = false; cancelAnimationFrame(raf); }
  };
}
if (!reduce) {
  const bg = squareField($("#squares"), { size: 40, radius: 150, decay: .955, alpha: .2, twinkle: .12 });
  bg.start();
  addEventListener("pointermove", e => bg.move(e.clientX, e.clientY), { passive: true });
  document.addEventListener("pointerleave", () => bg.leave());
  addEventListener("touchend", () => bg.leave(), { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? bg.stop() : bg.start());
  window.__recolor = () => bg.recolor();
  window.LeoBG = { bg, cf: null };
  const box = $(".contact-box");
  const cf = squareField($("#contact-canvas"), { size: 34, radius: 130, decay: .95, alpha: .28, twinkle: .18, color: "70,117,255", color2: "45,212,191" });
  window.LeoBG.cf = cf;
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? cf.start() : cf.stop())).observe(box);
  box.addEventListener("pointermove", e => { const r = box.getBoundingClientRect(); cf.move(e.clientX - r.left, e.clientY - r.top); });
  box.addEventListener("pointerleave", () => cf.leave());
}

/* ---------- Contador de visitas opcional (GoatCounter, sin cookies) ---------- */
if (CONFIG.goatcounter) {
  const g = document.createElement("script"); g.async = true;
  g.dataset.goatcounter = `https://${CONFIG.goatcounter}.goatcounter.com/count`;
  g.src = "https://gc.zgo.at/count.js"; document.body.appendChild(g);
}

/* ---------- Inicio ---------- */
renderExtras();
setLang(LANG, true);
onScroll();
$("#replay").addEventListener("click", () => { if (window.LeoIntro) { scrollTo({ top: 0 }); window.LeoIntro.play(); } });
})();
