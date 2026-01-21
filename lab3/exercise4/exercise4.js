// Exercise 4: Real-Time User Activity Monitor

// 2) store activity in an array of objects
let activityLog = [];
let paused = false;

// Threshold system
const thresholds = {
  clicksPer10s: 12,
  keysPer10s: 30,
  focusChangesPer10s: 10
};

let recentWindow = []; // store events for last 10 seconds

// DOM
const logList = document.getElementById("logList");
const emptyLog = document.getElementById("emptyLog");

const totalEvents = document.getElementById("totalEvents");
const clickCount = document.getElementById("clickCount");
const keyCount = document.getElementById("keyCount");
const focusCount = document.getElementById("focusCount");

const statusChip = document.getElementById("statusChip");
const warnText = document.getElementById("warnText");
const warnBox = document.getElementById("warnBox");

const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const pauseBtn = document.getElementById("pauseBtn");

const exportBox = document.getElementById("exportBox");
const exportText = document.getElementById("exportText");
const copyBtn = document.getElementById("copyBtn");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

const playground = document.getElementById("playground");

// Helpers
const nowISO = () => new Date().toISOString();

function getSelector(el) {
  if (!el || el === document || el === window) return "document";
  let tag = el.tagName ? el.tagName.toLowerCase() : "unknown";
  let id = el.id ? `#${el.id}` : "";
  let cls = el.className && typeof el.className === "string"
    ? "." + el.className.trim().split(/\s+/).slice(0,2).join(".")
    : "";
  return `${tag}${id}${cls}`.slice(0, 90);
}

// 4) DOM display
function renderLog() {
  const q = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;

  const filtered = activityLog.filter(ev => {
    const matchType = (type === "ALL") ? true : (ev.type === type);
    const blob = `${ev.type} ${ev.phase} ${ev.target} ${ev.key || ""}`.toLowerCase();
    const matchSearch = q ? blob.includes(q) : true;
    return matchType && matchSearch;
  });

  if (filtered.length === 0) {
    logList.innerHTML = "";
    emptyLog.style.display = "block";
  } else {
    emptyLog.style.display = "none";
  }

  logList.innerHTML = "";
  filtered.slice().reverse().forEach((ev) => {
    const div = document.createElement("div");
    div.className = "log";

    const badgeClass =
      ev.type === "click" ? "badge b-click"
      : ev.type === "keydown" ? "badge b-key"
      : "badge b-focus";

    const title =
      ev.type === "click" ? "Click"
      : ev.type === "keydown" ? "Key Press"
      : ev.type === "focusin" ? "Focus In"
      : "Focus Out";

    div.innerHTML = `
      <div class="log-top">
        <div>
          <b>${title}</b>
          <small>${ev.time}</small>
        </div>
        <div class="${badgeClass}">${ev.phase.toUpperCase()}</div>
      </div>
      <small><b>Target:</b> ${ev.target}</small>
      <small><b>Path:</b> ${ev.path}</small>
      ${ev.key ? `<small><b>Key:</b> ${ev.key}</small>` : ""}
    `;
    logList.appendChild(div);
  });

  updateStats();
}

function updateStats() {
  totalEvents.textContent = activityLog.length;

  const clicks = activityLog.filter(e => e.type === "click").length;
  const keys = activityLog.filter(e => e.type === "keydown").length;
  const focusEv = activityLog.filter(e => e.type === "focusin" || e.type === "focusout").length;

  clickCount.textContent = clicks;
  keyCount.textContent = keys;
  focusCount.textContent = focusEv;
}

// 5) suspicious activity thresholds
function checkSuspicious() {
  const now = Date.now();

  // keep last 10 seconds
  recentWindow = recentWindow.filter(ev => now - ev.ts <= 10000);

  const clicks = recentWindow.filter(e => e.type === "click").length;
  const keys = recentWindow.filter(e => e.type === "keydown").length;
  const focusEv = recentWindow.filter(e => e.type === "focusin" || e.type === "focusout").length;

  let warnings = [];
  if (clicks >= thresholds.clicksPer10s) warnings.push(`Too many clicks in 10s (${clicks})`);
  if (keys >= thresholds.keysPer10s) warnings.push(`Too many keys in 10s (${keys})`);
  if (focusEv >= thresholds.focusChangesPer10s) warnings.push(`Too many focus changes in 10s (${focusEv})`);

  if (warnings.length > 0) {
    warnText.textContent = "⚠️ Suspicious Activity: " + warnings.join(" | ");
    warnBox.style.borderColor = "rgba(255,107,107,0.55)";
    statusChip.textContent = "Warning ⚠️";
    statusChip.style.borderColor = "rgba(255,107,107,0.55)";
  } else {
    warnText.textContent = "No suspicious activity detected.";
    warnBox.style.borderColor = "rgba(255,255,255,0.14)";
    statusChip.textContent = paused ? "Paused ⏸️" : "Monitoring ✅";
    statusChip.style.borderColor = "rgba(255,255,255,0.14)";
  }
}

// Store event
function logEvent(e, phase) {
  if (paused) return;

  const entry = {
    id: activityLog.length + 1,
    type: e.type,
    phase, // CAPTURE or BUBBLE
    time: new Date().toLocaleTimeString(),
    iso: nowISO(),
    target: getSelector(e.target),
    key: e.type === "keydown" ? e.key : null,
    path: getEventPath(e),
    ts: Date.now()
  };

  activityLog.push(entry);
  recentWindow.push(entry);

  renderLog();
  checkSuspicious();
}

// 3) event bubbling + capturing
function attachListeners() {
  // Capturing
  document.addEventListener("click", (e) => logEvent(e, "capture"), true);
  document.addEventListener("keydown", (e) => logEvent(e, "capture"), true);

  // focusin/out bubble by default but we can capture too
  document.addEventListener("focusin", (e) => logEvent(e, "capture"), true);
  document.addEventListener("focusout", (e) => logEvent(e, "capture"), true);

  // Bubbling
  document.addEventListener("click", (e) => logEvent(e, "bubble"), false);
  document.addEventListener("keydown", (e) => logEvent(e, "bubble"), false);
  document.addEventListener("focusin", (e) => logEvent(e, "bubble"), false);
  document.addEventListener("focusout", (e) => logEvent(e, "bubble"), false);
}

// Get event path in readable form
function getEventPath(e) {
  // composedPath supported in modern browsers
  const p = e.composedPath ? e.composedPath() : [];
  if (!p.length) return getSelector(e.target);

  const cleaned = p
    .filter(x => x && x.tagName)
    .slice(0, 6)
    .map(getSelector)
    .join(" > ");

  return cleaned || getSelector(e.target);
}

// 6) reset and export formatted text
function resetLog() {
  activityLog = [];
  recentWindow = [];
  exportBox.style.display = "none";
  exportText.value = "";
  renderLog();
  checkSuspicious();
}

function exportLog() {
  if (activityLog.length === 0) {
    exportBox.style.display = "block";
    exportText.value = "No log events to export.";
    return;
  }

  const lines = [];
  lines.push("=== USER ACTIVITY MONITOR LOG ===");
  lines.push(`Exported At: ${new Date().toLocaleString()}`);
  lines.push(`Total Events: ${activityLog.length}`);
  lines.push("--------------------------------");

  activityLog.forEach((ev) => {
    lines.push(
      `[${ev.id}] ${ev.time} | ${ev.type.toUpperCase()} | ${ev.phase.toUpperCase()}`
    );
    lines.push(` Target: ${ev.target}`);
    if (ev.key) lines.push(` Key: ${ev.key}`);
    lines.push(` Path: ${ev.path}`);
    lines.push(` ISO: ${ev.iso}`);
    lines.push("--------------------------------");
  });

  exportBox.style.display = "block";
  exportText.value = lines.join("\n");
}

// Copy to clipboard
async function copyExport() {
  try {
    await navigator.clipboard.writeText(exportText.value);
    alert("✅ Export text copied!");
  } catch {
    alert("❌ Clipboard blocked. Copy manually from textarea.");
  }
}

// Pause toggle
function togglePause() {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  statusChip.textContent = paused ? "Paused ⏸️" : "Monitoring ✅";
  checkSuspicious();
}

// Events
resetBtn.addEventListener("click", resetLog);
exportBtn.addEventListener("click", exportLog);
pauseBtn.addEventListener("click", togglePause);
copyBtn.addEventListener("click", copyExport);

searchInput.addEventListener("input", renderLog);
typeFilter.addEventListener("change", renderLog);

// Initial
attachListeners();
renderLog();
checkSuspicious();

// Extra: little UI pulse when clicking inside playground
playground.addEventListener("click", () => {
  playground.style.outline = "2px solid rgba(95,140,255,0.35)";
  setTimeout(() => playground.style.outline = "none", 200);
});
