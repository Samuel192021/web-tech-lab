/* ============================================================
   STUDENT MARKS CALCULATOR — script.js
   ES6 Features: let/const, arrow functions, template literals
   ============================================================ */

// ── ES6: Arrow function (as required by the exercise) ──────
const calculateAverage = (m1, m2, m3) => {
  return (m1 + m2 + m3) / 3;
};

// ── Helper: grade letter from average ─────────────────────
const getGrade = (avg) => {
  if (avg >= 90) return 'O';   // Outstanding
  if (avg >= 80) return 'A';
  if (avg >= 70) return 'B';
  if (avg >= 60) return 'C';
  if (avg >= 50) return 'D';
  return 'F';
};

// ── Helper: grade colour from grade letter ─────────────────
const getGradeColor = (grade) => {
  const map = { O: '#40d080', A: '#f0c040', B: '#60b8f0', C: '#e09030', D: '#c080f0', F: '#e05050' };
  return map[grade] || '#f0c040';
};

// ── DOM references ─────────────────────────────────────────
const calcBtn     = document.getElementById('calcBtn');
const resetBtn    = document.getElementById('resetBtn');
const inputCard   = document.getElementById('inputCard');
const resultCard  = document.getElementById('resultCard');

const nameInput   = document.getElementById('studentName');
const m1Input     = document.getElementById('mark1');
const m2Input     = document.getElementById('mark2');
const m3Input     = document.getElementById('mark3');

const badgeAvatar  = document.getElementById('badgeAvatar');
const badgeName    = document.getElementById('badgeName');
const badgeGrade   = document.getElementById('badgeGrade');
const totalEl      = document.getElementById('totalMarks');
const avgEl        = document.getElementById('avgMarks');
const totalSubEl   = document.getElementById('totalSub');
const progressFill = document.getElementById('progressFill');
const progressPct  = document.getElementById('progressPct');

const consoleLines = [
  document.getElementById('line1'),
  document.getElementById('line2'),
  document.getElementById('line3'),
];

// ── Input validation ───────────────────────────────────────
function validate(name, m1, m2, m3) {
  if (!name.trim()) { alert('Please enter the student name.'); return false; }
  const marks = [m1, m2, m3];
  for (let i = 0; i < marks.length; i++) {
    const v = Number(marks[i]);
    if (isNaN(v) || v < 0 || v > 100) {
      alert(`Subject ${i + 1}: marks must be between 0 and 100.`);
      return false;
    }
  }
  return true;
}

// ── Animate a number counting up ──────────────────────────
function animateCount(el, target, decimals = 0, duration = 800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const val = eased * target;
    el.textContent = decimals ? val.toFixed(decimals) : Math.round(val);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── Show console lines one by one ─────────────────────────
function showConsoleLine(el, text, delay) {
  setTimeout(() => {
    el.textContent = text;
    el.classList.add('visible');
  }, delay);
}

// ── Main calculate function ────────────────────────────────
function calculate() {
  // Read inputs
  const studentName = nameInput.value.trim() || 'Student';
  const mark1 = parseFloat(m1Input.value);
  const mark2 = parseFloat(m2Input.value);
  const mark3 = parseFloat(m3Input.value);

  if (!validate(studentName, mark1, mark2, mark3)) return;

  // ES6: let/const declarations
  let total = mark1 + mark2 + mark3;
  let average = calculateAverage(mark1, mark2, mark3);
  const grade = getGrade(average);
  const color = getGradeColor(grade);

  // ES6: Template literals for console output
  const line1Text = `Student Name: ${studentName}`;
  const line2Text = `Total Marks:  ${total}`;
  const line3Text = `Average Marks: ${average.toFixed(2)}`;

  // Populate badge
  badgeAvatar.textContent = studentName.charAt(0).toUpperCase();
  badgeAvatar.style.background = color;
  badgeAvatar.style.boxShadow = `0 0 24px ${color}55`;
  badgeName.textContent = studentName;
  badgeGrade.textContent = grade;
  badgeGrade.style.color = color;
  badgeGrade.style.textShadow = `0 0 30px ${color}66`;
  totalSubEl.textContent = `out of 300`;

  // Reset console lines
  consoleLines.forEach(l => { l.textContent = ''; l.classList.remove('visible'); });

  // Show result card
  inputCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  // Animate numbers
  animateCount(totalEl, total, 0, 900);
  animateCount(avgEl, average, 2, 900);

  // Progress bar
  const pct = Math.round(average);
  setTimeout(() => {
    progressFill.style.width = `${pct}%`;
    progressPct.textContent = `${pct}%`;
  }, 150);

  // Console lines
  showConsoleLine(consoleLines[0], line1Text, 400);
  showConsoleLine(consoleLines[1], line2Text, 750);
  showConsoleLine(consoleLines[2], line3Text, 1100);

  // Also log to the actual browser console (as the exercise requires)
  console.log(`Student Name: ${studentName}`);
  console.log(`Total Marks: ${total}`);
  console.log(`Average Marks: ${average.toFixed(2)}`);
}

// ── Reset function ─────────────────────────────────────────
function reset() {
  resultCard.classList.add('hidden');
  inputCard.classList.remove('hidden');

  // Reset progress fill immediately for next run
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';
  setTimeout(() => { progressFill.style.transition = 'width 1s cubic-bezier(.16,1,.3,1)'; }, 50);
}

// ── Event listeners ────────────────────────────────────────
calcBtn.addEventListener('click', calculate);
resetBtn.addEventListener('click', reset);

// Allow Enter key on any input
[nameInput, m1Input, m2Input, m3Input].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calculate();
  });
});

// Live input validation highlight
[m1Input, m2Input, m3Input].forEach(input => {
  input.addEventListener('input', () => {
    const v = Number(input.value);
    if (input.value !== '' && (v < 0 || v > 100)) {
      input.style.borderColor = '#e05050';
      input.style.boxShadow = '0 0 0 3px rgba(224,80,80,.12)';
    } else {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  });
});