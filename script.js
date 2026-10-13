/* =====================================================================
   Sonu Sinha - Data Analyst Portfolio  |  script.js
   1. CONFIG (edit this)   2. demo data + dashboards   3. viewer / cards
   4. page effects         5. theme switch
   ===================================================================== */

/* ============================ 1. CONFIG ============================== */
const SITE = {
  github: "https://github.com/sonusinhadata",
  linkedin: "https://www.linkedin.com/in/sonusinha-dataanalyst",
  email: "sonusinha.data@gmail.com"
};

// status: "done" | "progress" | "planned"
// live.powerbi : paste the iframe src from Power BI  (File > Embed report > Publish to web)
// live.excel   : paste the iframe src from Excel Online (File > Share > Embed)
// Leave "" to show the built-in DEMO dashboard instead.
const PROJECTS = [
  { id: "sales", name: "Sales Performance Dashboard",
    question: "Which regions, products and reps drive revenue?",
    tools: ["Power BI", "DAX", "Excel"], kinds: ["Power BI", "Excel"], status: "progress",
    github: "https://github.com/sonusinhadata/sales-performance-dashboard",
    live: { powerbi: "", excel: "" } },
  { id: "stockout", name: "Supply Chain Stock-out Analysis",
    question: "Where and why do stock-outs and delays occur?",
    tools: ["SQL", "Python", "Pandas"], kinds: ["SQL", "Python"], status: "planned", github: "", live: {} },
  { id: "otif", name: "Operations OTIF Tracker",
    question: "How often are orders delivered on time and in full?",
    tools: ["Power Query", "Power BI"], kinds: ["Power BI"], status: "planned", github: "", live: {} }
];

// Headline numbers. Keep them TRUE. (value can be a number or text)
const METRICS = [
  { label: "PROJECTS", value: PROJECTS.length, note: "in my portfolio" },
  { label: "CORE TOOLS", value: 5, note: "SQL · Power BI · Excel · Python · DAX" },
  { label: "IN PROGRESS", value: PROJECTS.filter(p => p.status === "progress").length, note: "building right now" },
  { label: "DAILY PRACTICE", value: 2, suffix: "h", note: "learning and building" }
];

// status: "done" | "now" | "next"
const JOURNEY = [
  { t: "Excel", d: "Pivots, XLOOKUP, dashboards", s: "done" },
  { t: "SQL fundamentals", d: "SELECT, JOIN, GROUP BY", s: "done" },
  { t: "SQL advanced", d: "CTEs and window functions", s: "now" },
  { t: "Python for analysis", d: "Pandas, NumPy, Matplotlib", s: "next" },
  { t: "Power BI and DAX", d: "Data models, measures, dashboards", s: "next" },
  { t: "Statistics and A/B testing", d: "Hypothesis tests, experiment design", s: "next" },
  { t: "Capstone project", d: "End to end, from raw data to recommendation", s: "next" }
];

const WORDS = ["decisions.", "dashboards.", "insights.", "growth."];
const TOOLS = ["Power BI", "Excel", "SQL", "Python", "DAX", "Power Query", "Pandas", "Jupyter", "Git", "GitHub", "KPI design", "Data modelling"];

/* ====================== 2. DEMO DATA + DASHBOARDS ==================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = n => Math.round(n).toLocaleString("en-US");

const REG = ["North", "South", "East", "West"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CAT = ["Electronics", "Furniture", "Clothing", "Grocery"];
const CCOL = ["#38bdf8", "#2dd4bf", "#a78bfa", "#fbbf24"];
const DATA = {}; REG.forEach((r, i) => DATA[r] = MON.map((_, m) => Math.round(38 + i * 7 + m * 3.2 + Math.sin(m * .9 + i) * 8)));
const SHARE = { North: [.42, .18, .22, .18], South: [.35, .22, .25, .18], East: [.40, .16, .26, .18], West: [.30, .25, .27, .18] };
const YOY = { North: 12.4, South: 8.1, East: 15.2, West: 4.6 };
const AOV = 412;

function drawDash(el, sel) {
  const regs = sel === "All" ? REG : [sel];
  const month = MON.map((_, m) => regs.reduce((a, r) => a + DATA[r][m], 0));
  const total = month.reduce((a, b) => a + b, 0);
  const cats = CAT.map((c, i) => regs.reduce((a, r) => a + DATA[r].reduce((x, y) => x + y, 0) * SHARE[r][i], 0));
  const yoy = regs.reduce((a, r) => a + YOY[r] * DATA[r].reduce((x, y) => x + y, 0), 0) / total;
  const max = Math.max(...month) * 1.15, W = 520, H = 190;
  const px = i => 30 + i * (W - 44) / 11, py = v => H - 26 - v / max * (H - 46);
  const line = month.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  const grid = [0, .5, 1].map(f => `<line x1="30" x2="${W - 14}" y1="${py(max * f)}" y2="${py(max * f)}" stroke="var(--line)"/>`).join("");
  const dots = month.map((v, i) => `<circle cx="${px(i)}" cy="${py(v)}" r="4" fill="#f2c811"><title>${MON[i]}: ${fmt(v)}K</title></circle>`).join("");
  const xl = MON.map((m, i) => i % 2 === 0 ? `<text x="${px(i)}" y="${H - 8}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${m}</text>` : "").join("");
  const cmax = Math.max(...cats);
  const bars = CAT.map((c, i) => `<text x="0" y="${22 + i * 38}" font-size="11.5" fill="var(--muted)">${c}</text>
    <rect x="0" y="${28 + i * 38}" width="${cats[i] / cmax * 230}" height="14" rx="4" fill="${CCOL[i]}"><title>${c}: ${fmt(cats[i])}K</title></rect>
    <text x="${cats[i] / cmax * 230 + 8}" y="${40 + i * 38}" font-size="11.5" font-weight="700" fill="var(--txt)">${fmt(cats[i])}K</text>`).join("");
  const rt = REG.map(r => DATA[r].reduce((a, b) => a + b, 0)), rs = rt.reduce((a, b) => a + b, 0);
  let off = 0; const circ = 2 * Math.PI * 38;
  const donut = rt.map((v, i) => { const len = v / rs * circ; const s = `<circle r="38" cx="60" cy="60" fill="none" stroke="${CCOL[i]}" stroke-width="22" stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)" opacity="${sel === "All" || sel === REG[i] ? 1 : .22}"><title>${REG[i]}: ${(v / rs * 100).toFixed(0)}%</title></circle>`; off += len; return s; }).join("");
  el.innerHTML = `<div class="dash">
    <div class="dash-top"><h4>Sales Performance <small>Demo data · 12 months</small></h4>
      <div class="slicer" role="group" aria-label="Region slicer">${["All", ...REG].map(r => `<button type="button" data-r="${r}" aria-pressed="${r === sel}">${r}</button>`).join("")}</div></div>
    <div class="dkpis">
      <div class="dkpi"><small>REVENUE</small><b>${fmt(total)}K</b><em class="up">▲ ${yoy.toFixed(1)}% YoY</em></div>
      <div class="dkpi"><small>ORDERS</small><b>${fmt(total * 1000 / AOV)}</b><em class="up">▲ ${(yoy * .65).toFixed(1)}%</em></div>
      <div class="dkpi"><small>AVG ORDER VALUE</small><b>${AOV}</b><em class="up">▲ 3.6%</em></div>
      <div class="dkpi"><small>TOP CATEGORY</small><b>${CAT[cats.indexOf(cmax)]}</b><em>${(cmax / cats.reduce((a, b) => a + b, 0) * 100).toFixed(0)}% of revenue</em></div></div>
    <div class="dgrid">
      <div class="dcard"><h5>MONTHLY REVENUE (K)</h5><svg viewBox="0 0 ${W} ${H}">${grid}<path d="${line} L${px(11)} ${py(0)} L${px(0)} ${py(0)}Z" fill="#f2c811" opacity=".14"/><path d="${line}" fill="none" stroke="#f2c811" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xl}</svg></div>
      <div class="dcard"><h5>REVENUE BY CATEGORY</h5><svg viewBox="0 0 300 160">${bars}</svg></div>
      <div class="dcard wide"><h5>REGION SHARE</h5><div style="display:flex;align-items:center;gap:22px;flex-wrap:wrap"><svg viewBox="0 0 120 120" style="width:130px">${donut}</svg>
        <div class="legend" style="flex-direction:column;gap:6px">${REG.map((r, i) => `<span><i style="background:${CCOL[i]}"></i>${r} · ${(rt[i] / rs * 100).toFixed(0)}%</span>`).join("")}</div></div></div>
    </div></div>`;
  $$(".slicer button", el).forEach(b => b.onclick = () => drawDash(el, b.dataset.r));
}

function drawExcel(el, sheet) {
  const rows = []; for (let i = 0; i < 14; i++) { const r = REG[i % 4], c = CAT[(i * 3) % 4], u = 2 + (i * 5) % 9, p = [820, 410, 95, 38][(i * 3) % 4]; rows.push([1001 + i, `2025-0${1 + i % 9}-${10 + i}`, r, c, u, p, u * p]); }
  const L = "ABCDEFGH", cell = (a, f, cls = "") => `<td data-a="${a}" data-f="${esc(f)}" class="${cls}">`;
  let body = "";
  if (sheet === "Data") {
    body = `<tr class="hd"><th>1</th>${["OrderID", "Date", "Region", "Category", "Units", "UnitPrice", "Revenue"].map((h, i) => cell(L[i] + 1, h) + h + "</td>").join("")}</tr>` +
      rows.map((r, i) => `<tr><th>${i + 2}</th>${r.map((v, j) => cell(L[j] + (i + 2), j === 6 ? `=E${i + 2}*F${i + 2}` : v, j > 3 ? "num" : "") + (j > 4 ? fmt(v) : v) + "</td>").join("")}</tr>`).join("");
  } else {
    const val = (r, c) => Math.round(DATA[r].reduce((a, b) => a + b, 0) * SHARE[r][c]);
    const all = REG.flatMap(r => CAT.map((_, c) => val(r, c))), mx = Math.max(...all);
    body = `<tr class="hd"><th>1</th>${cell("A1", "Revenue (K) by Region × Category") + "Region</td>"}${CAT.map((c, i) => cell(L[i + 1] + 1, c) + c + "</td>").join("")}${cell("F1", "Total") + "Total</td>"}</tr>` +
      REG.map((r, i) => { const vs = CAT.map((_, c) => val(r, c)); return `<tr><th>${i + 2}</th>${cell("A" + (i + 2), r) + r + "</td>"}${vs.map((v, c) => `<td data-a="${L[c + 1]}${i + 2}" data-f="=SUMIFS(Data!G:G,Data!C:C,$A${i + 2},Data!D:D,${L[c + 1]}$1)" class="num" style="background:rgba(33,163,102,${(.12 + v / mx * .55).toFixed(2)})">${fmt(v)}</td>`).join("")}${cell("F" + (i + 2), `=SUM(B${i + 2}:E${i + 2})`, "num") + "<b>" + fmt(vs.reduce((a, b) => a + b, 0)) + "</b></td>"}</tr>`; }).join("") +
      `<tr class="tot"><th>6</th>${cell("A6", "Total") + "Total</td>"}${CAT.map((_, c) => cell(L[c + 1] + 6, `=SUM(${L[c + 1]}2:${L[c + 1]}5)`, "num") + fmt(REG.reduce((a, r) => a + val(r, c), 0)) + "</td>").join("")}${cell("F6", "=SUM(F2:F5)", "num") + fmt(all.reduce((a, b) => a + b, 0)) + "</td>"}</tr>`;
  }
  const head = `<tr><th></th>${(sheet === "Data" ? "ABCDEFG" : "ABCDEF").split("").map(c => `<th>${c}</th>`).join("")}</tr>`;
  el.innerHTML = `<div class="xlw"><div class="fx"><span class="nm" id="xnm">A1</span><span class="ic">fx</span><span class="fv" id="xfv">Click any cell to see its formula</span></div>
    <div class="xlscroll"><table class="xl"><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <div class="sheets">${["Data", "Pivot"].map(s => `<button type="button" data-s="${s}" aria-pressed="${s === sheet}">${s}</button>`).join("")}</div></div>`;
  $$("td", el).forEach(td => td.onclick = () => { $$("td.sel", el).forEach(x => x.classList.remove("sel")); td.classList.add("sel"); $("#xnm", el).textContent = td.dataset.a; $("#xfv", el).textContent = td.dataset.f; });
  $$(".sheets button", el).forEach(b => b.onclick = () => drawExcel(el, b.dataset.s));
}

/* ======================= 3. VIEWER + PROJECT CARDS =================== */
function mountViewer(host, project, kind) {
  const kinds = project.kinds.filter(k => k === "Power BI" || k === "Excel");
  kind = kinds.includes(kind) ? kind : kinds[0];
  const url = kind === "Power BI" ? project.live.powerbi : project.live.excel, real = !!url;
  host.innerHTML = `<div class="vbar"><div class="dots"><i></i><i></i><i></i></div>
      <div class="vtabs" role="group" aria-label="Choose viewer">${kinds.map(k => `<button type="button" data-k="${k}" aria-pressed="${k === kind}"><i style="background:${k === "Power BI" ? "var(--pbi)" : "var(--xl)"}"></i>${k}</button>`).join("")}</div>
      <div class="url" title="${esc(real ? url : project.name)}">${esc(real ? url : (kind === "Power BI" ? "app.powerbi.com/view?r=…" : "excel.officeapps.live.com/…"))}</div>
      ${real ? "" : '<span class="demo-tag">DEMO DATA</span>'}</div>
    <div class="vbody" id="vb"></div>
    <div class="vfoot"><span><b style="color:var(--txt)">${esc(project.name)}</b> · ${esc(project.question)}</span>
      <span class="acts">${project.github ? `<a class="btn sm" href="${esc(project.github)}" target="_blank" rel="noopener">View code on GitHub</a>` : ""}
      <button class="btn sm" type="button" id="fs">Full screen</button></span></div>`;
  const vb = $("#vb", host);
  if (real) vb.innerHTML = `<iframe src="${esc(url)}" title="${esc(project.name)} (${kind})" loading="lazy" allowfullscreen></iframe>`;
  else if (kind === "Power BI") drawDash(vb, "All"); else drawExcel(vb, "Pivot");
  $$(".vtabs button", host).forEach(b => b.onclick = () => mountViewer(host, project, b.dataset.k));
  $("#fs", host).onclick = () => (host.requestFullscreen || host.webkitRequestFullscreen || (() => { })).call(host);
}

const TAGC = { "Power BI": "t-pbi", "Excel": "t-xl", "SQL": "t-sql", "Python": "t-py" };
function thumb(p) {
  const k = p.kinds[0];
  if (k === "Power BI") return `<svg viewBox="0 0 200 110"><rect x="8" y="10" width="56" height="26" rx="5" fill="#f2c811" opacity=".9"/><rect x="72" y="10" width="56" height="26" rx="5" fill="var(--acc)" opacity=".8"/><rect x="136" y="10" width="56" height="26" rx="5" fill="var(--acc3)" opacity=".8"/>${[30, 52, 40, 68, 84, 60].map((h, i) => `<rect x="${12 + i * 17}" y="${100 - h * .8}" width="11" height="${h * .8}" rx="2" fill="#f2c811" opacity="${.45 + i * .09}"/>`).join("")}<path d="M120 90 L140 70 L158 78 L192 44" fill="none" stroke="var(--acc2)" stroke-width="3" stroke-linecap="round"/></svg>`;
  return `<svg viewBox="0 0 200 110">${[0, 1, 2, 3, 4].map(r => `<rect x="14" y="${12 + r * 19}" width="172" height="14" rx="3" fill="var(--line)" opacity="${r ? .6 : 1}"/>`).join("")}<rect x="14" y="12" width="172" height="14" rx="3" fill="${k === "SQL" ? "#60a5fa" : "#fbbf24"}" opacity=".85"/>${[0, 1, 2, 3].map(r => `<rect x="${24 + r * 4}" y="${33 + r * 19}" width="${60 + r * 22}" height="6" rx="2" fill="var(--acc)" opacity=".7"/>`).join("")}</svg>`;
}
let filter = "All";
function renderCards() {
  const list = PROJECTS.filter(p => filter === "All" || p.kinds.includes(filter) || p.tools.includes(filter));
  $("#project-list").innerHTML = list.map(p => {
    const label = { done: "COMPLETED", progress: "IN PROGRESS", planned: "PLANNED" }[p.status];
    const hasLive = p.kinds.some(k => k === "Power BI" || k === "Excel") && p.status !== "planned";
    return `<article class="pcard spot"><div class="thumb">${thumb(p)}<div class="tag-row">${p.kinds.map(k => `<span class="tag ${TAGC[k]}">${k.toUpperCase()}</span>`).join("")}</div></div>
      <div class="pbody"><span class="status s-${p.status}">${label}</span><h3>${esc(p.name)}</h3><p>${esc(p.question)}</p>
      <div class="tools">${p.tools.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <div class="pact">${hasLive ? `<button class="btn primary sm" type="button" data-open="${p.id}">Live view</button>` : ""}
      ${p.github && p.status !== "planned" ? `<a class="btn sm" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
      ${p.status === "planned" ? '<span style="color:var(--muted);font-size:14px">Coming soon</span>' : ""}</div></div></article>`;
  }).join("") || '<p class="sub">No projects in this category yet.</p>';
  $$("[data-open]").forEach(b => b.onclick = () => openModal(PROJECTS.find(p => p.id === b.dataset.open)));
}
function renderFilters() {
  const all = ["All", ...new Set(PROJECTS.flatMap(p => p.kinds))];
  $("#filters").innerHTML = all.map(f => `<button type="button" data-f="${f}" aria-pressed="${f === filter}">${f}</button>`).join("");
  $$("#filters button").forEach(b => b.onclick = () => { filter = b.dataset.f; renderFilters(); renderCards(); });
}

function openModal(p) { mountViewer($("#modal-viewer"), p, p.kinds[0]); $("#modal").classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal() { $("#modal").classList.remove("open"); document.body.style.overflow = ""; $("#modal-viewer").innerHTML = ""; }
$("#modal-close").onclick = closeModal;
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeMenu(); } });

/* ========================= 4. PAGE EFFECTS =========================== */
// content
$("#c-linkedin").href = SITE.linkedin; $("#c-github").href = SITE.github; $("#c-mail").href = "mailto:" + SITE.email;
$("#yr").textContent = new Date().getFullYear();
$("#metrics").innerHTML = METRICS.map(m => `<div class="metric spot"><small>${esc(m.label)}</small><b>${typeof m.value === "number"
  ? `<span data-count="${m.value}">0</span>${esc(m.suffix || "")}` : esc(m.value)}</b><span>${esc(m.note)}</span></div>`).join("");
$("#journey-list").innerHTML = JOURNEY.map(j => `<div class="jitem ${j.s}"><b>${esc(j.t)}</b><em>${{ done: "COMPLETED", now: "IN PROGRESS", next: "UP NEXT" }[j.s]}</em><span>${esc(j.d)}</span></div>`).join("");
$("#track").innerHTML = [...TOOLS, ...TOOLS].map(t => `<span>${esc(t)}</span>`).join("");
renderFilters(); renderCards(); mountViewer($("#lab-viewer"), PROJECTS[0], "Power BI");

// scroll reveal + animated counters
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
  $$("[data-count]", e.target).forEach(el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1100;
    (function tick(t) { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(t0);
  });
}), { threshold: .12 });
$$(".reveal").forEach(el => io.observe(el));

// scroll progress bar, back-to-top, active nav link
const bar = $("#progress"), totop = $("#totop"), secs = $$("section[id]"), navLinks = $$(".links a");
function onScroll() {
  const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
  bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + "%";
  totop.classList.toggle("show", h.scrollTop > 700);
  let cur = ""; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
totop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

// cursor spotlight on cards
document.addEventListener("pointermove", e => {
  const c = e.target.closest && e.target.closest(".spot"); if (!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
}, { passive: true });

// rotating headline word
const rot = $("#rot"); let wi = 0;
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(() => {
  rot.classList.add("out");
  setTimeout(() => { wi = (wi + 1) % WORDS.length; rot.textContent = WORDS[wi]; rot.classList.remove("out"); }, 350);
}, 2800);

// mobile menu
const burger = $("#burger"), menu = $("#menu");
function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); };
navLinks.forEach(a => a.addEventListener("click", closeMenu));
addEventListener("resize", () => { if (innerWidth > 960) closeMenu(); });

/* ===================== 5. THEME: Auto / Light / Dark ================= */
(function () {
  const DAY_START = 6, DAY_END = 18, KEY = "theme-mode", root = document.documentElement;   // light 06:00-17:59, dark otherwise
  const buttons = $$(".theme button"), autoLabel = $("#auto-label");
  let mode = "auto"; try { mode = localStorage.getItem(KEY) || "auto"; } catch (e) { }
  const resolve = m => m !== "auto" ? m : ((h => h >= DAY_START && h < DAY_END)(new Date().getHours()) ? "light" : "dark");
  function apply(m) {
    const t = resolve(m); root.setAttribute("data-theme", t);
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    autoLabel.textContent = m === "auto" ? (t === "light" ? "Auto · Day" : "Auto · Night") : "Auto";
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = t === "light" ? "#f5f8fd" : "#080d1a";
  }
  buttons.forEach(b => b.addEventListener("click", () => { mode = b.dataset.mode; try { localStorage.setItem(KEY, mode); } catch (e) { } apply(mode); }));
  apply(mode); setInterval(() => { if (mode === "auto") apply("auto"); }, 60000);
})();
