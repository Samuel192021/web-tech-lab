/* ============================================================
   STUDENT OBJECT · script.js
   ES6 Features Used:
     - const / let
     - Object destructuring
     - Spread operator (...)
     - Template literals
     - Arrow functions
   ============================================================ */

// ── Grade helpers (arrow functions) ───────────────────────
const getGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
};

const getGradeLabel = (grade) => {
  const labels = {
    'A+': 'Outstanding',
    'A' : 'Excellent',
    'B+': 'Very Good',
    'B' : 'Good',
    'C' : 'Average',
    'D' : 'Below Average',
    'F' : 'Fail'
  };
  return labels[grade] || 'Unknown';
};

const getGradeBadgeColors = (marks) => {
  if (marks >= 90) return { bg: 'var(--green-lt)',  color: 'var(--green)' };
  if (marks >= 75) return { bg: 'var(--blue-lt)',   color: 'var(--blue)'  };
  if (marks >= 60) return { bg: 'var(--amber-lt)',  color: 'var(--amber)' };
  if (marks >= 40) return { bg: 'var(--violet-lt)', color: 'var(--violet)'};
  return { bg: 'var(--rose-lt)', color: 'var(--rose)' };
};

// ── Live grade badge in form ───────────────────────────────
const marksInput  = document.getElementById('smarks');
const liveGradeEl = document.getElementById('liveGrade');

function updateLiveBadge() {
  const v = parseInt(marksInput.value, 10);
  if (isNaN(v) || v < 0 || v > 100) { liveGradeEl.textContent = '?'; return; }
  const g = getGrade(v);
  const c = getGradeBadgeColors(v);
  liveGradeEl.textContent = g;
  liveGradeEl.style.background = c.bg;
  liveGradeEl.style.color = c.color;
}

marksInput.addEventListener('input', updateLiveBadge);
updateLiveBadge();

// ── Syntax-highlighted object → HTML ──────────────────────
const renderObj = (obj, highlightKey = null) => {
  const lines = Object.entries(obj).map(([k, v]) => {
    const isNew   = k === highlightKey;
    const keySpan = `<span class="${isNew ? 'obj-new' : 'obj-key'}">${k}</span>`;
    const colon   = `<span class="obj-colon">: </span>`;
    const val     = typeof v === 'string'
      ? `<span class="obj-str">"${v}"</span>`
      : `<span class="obj-num">${v}</span>`;
    return `  ${keySpan}${colon}${val}<span class="obj-comma">,</span>`;
  });
  return `<span class="obj-brace">{</span>\n${lines.join('\n')}\n<span class="obj-brace">}</span>`;
};

// ── Code snippet HTML ──────────────────────────────────────
const buildCodeSnippet = (student, updatedStudent) => {
  const { id, name, department, marks } = student;
  const { grade } = updatedStudent;

  return `<span class="cc">// ES6: const declaration</span>
<span class="ck">const</span> student = {
  id<span class="cc">:</span>         <span class="cn">${id}</span>,
  name<span class="cc">:</span>       <span class="cs">"${name}"</span>,
  department<span class="cc">:</span> <span class="cs">"${department}"</span>,
  marks<span class="cc">:</span>      <span class="cn">${marks}</span>
};

<span class="cc">// ES6: Object destructuring</span>
<span class="ck">const</span> { id, name, department, marks } = student;
console.<span class="cf">log</span>(<span class="ct">\`\${id} \${name} \${department} \${marks}\`</span>);
<span class="cc">// → ${id} ${name} ${department} ${marks}</span>

<span class="cc">// ES6: Spread operator + new property</span>
<span class="ck">const</span> updatedStudent = {
  <span class="ca">...student</span>,
  grade<span class="cc">:</span> <span class="cs">"${grade}"</span>
};
console.<span class="cf">log</span>(updatedStudent);
<span class="cc">// → { id: ${id}, name: '${name}', department: '${department}', marks: ${marks}, grade: '${grade}' }</span>`;
};

// ── Animate staggered appearance for chips ─────────────────
const staggerChips = (container) => {
  const chips = container.querySelectorAll('.destr-chip');
  chips.forEach((chip, i) => {
    chip.style.animationDelay = `${i * 0.08}s`;
  });
};

// ── MAIN: Run program ──────────────────────────────────────
document.getElementById('runBtn').addEventListener('click', () => {
  // Read inputs
  const idVal   = parseInt(document.getElementById('sid').value, 10)   || 101;
  const nameVal = document.getElementById('sname').value.trim()         || 'Priya';
  const deptVal = document.getElementById('sdept').value;
  const markVal = parseInt(document.getElementById('smarks').value, 10) || 0;

  if (markVal < 0 || markVal > 100) {
    alert('Marks must be between 0 and 100.');
    return;
  }

  // ── ES6: const student object ──────────────────────────
  const student = {
    id:         idVal,
    name:       nameVal,
    department: deptVal,
    marks:      markVal
  };

  // ── ES6: Object destructuring ──────────────────────────
  const { id, name, department, marks } = student;

  // ── ES6: Spread operator to add grade property ─────────
  const updatedStudent = {
    ...student,
    grade: getGrade(marks)
  };

  // ── ES6: Template literals for console output ──────────
  const consoleOut1Text = `${id}  ${name}  ${department}  ${marks}`;
  const consoleOut2Text = `{ id: ${id}, name: '${name}', department: '${department}', marks: ${marks}, grade: '${updatedStudent.grade}' }`;

  // Log to real browser console as well
  console.log(id, name, department, marks);
  console.log(updatedStudent);

  // ── Populate UI ────────────────────────────────────────
  // Original object display
  document.getElementById('originalObjDisplay').innerHTML =
    `<div class="cc" style="font-family:var(--font-mono);font-size:11px;margin-bottom:4px;color:var(--muted)">const student =</div>` +
    renderObj(student);

  // Destructuring chips
  const destrRow = document.getElementById('destructureRow');
  destrRow.innerHTML = [
    { key: 'id',         val: id         },
    { key: 'name',       val: name       },
    { key: 'department', val: department },
    { key: 'marks',      val: marks      }
  ].map(({ key, val }) => `
    <div class="destr-chip">
      <span class="chip-key">${key}</span>
      <span class="chip-val">${val}</span>
    </div>
  `).join('');
  staggerChips(destrRow);

  // Console output 1
  const co1 = document.getElementById('consoleOut1');
  co1.textContent = '';
  setTimeout(() => { co1.textContent = consoleOut1Text; }, 300);

  // Spread visual — source box
  document.getElementById('svSourceBox').innerHTML = renderObj(student);

  // Spread visual — result box
  document.getElementById('svResultBox').innerHTML = renderObj(updatedStudent, 'grade');

  // Console output 2
  const co2 = document.getElementById('consoleOut2');
  co2.textContent = '';
  setTimeout(() => { co2.textContent = consoleOut2Text; }, 300);

  // Grade showcase
  const gradeColors = getGradeBadgeColors(marks);
  document.getElementById('gradeShowcase').innerHTML = `
    <div class="gs-letter" style="filter:drop-shadow(0 4px 24px ${gradeColors.color}55)">${updatedStudent.grade}</div>
    <div class="gs-info">
      <div class="gs-title">${getGradeLabel(updatedStudent.grade)}</div>
      <div class="gs-desc">Based on marks scored by <strong>${name}</strong> in department <strong>${department}</strong></div>
      <div class="gs-marks">Marks: ${marks} / 100 &nbsp;·&nbsp; Grade assigned via spread: <code>grade: "${updatedStudent.grade}"</code></div>
    </div>
  `;

  // Code snippet
  document.getElementById('codeSnippet').innerHTML = buildCodeSnippet(student, updatedStudent);

  // Show output
  document.getElementById('formSection').classList.add('hidden');
  document.getElementById('outputSection').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Reset ──────────────────────────────────────────────────
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('outputSection').classList.add('hidden');
  document.getElementById('formSection').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});