/* ============================================================
   COURSE ENROLLMENT SYSTEM — script.js
   ES6 Features:
     - class with constructor
     - class method (displayCourse)
     - Promise with resolve / reject
     - .then() / .catch() chaining
     - Arrow functions
     - Template literals
     - let / const
   ============================================================ */

/* ─────────────────────────────────────────
   ES6 CLASS DEFINITION
   ───────────────────────────────────────── */
class Course {
  constructor(courseName, instructor, totalSeats, seatsFilled, credits) {
    this.courseName  = courseName;
    this.instructor  = instructor;
    this.totalSeats  = totalSeats;
    this.seatsFilled = seatsFilled;
    this.credits     = credits;
  }

  // Method to display course details (as required by exercise)
  displayCourse() {
    console.log(`Course: ${this.courseName}, Instructor: ${this.instructor}`);
    return `Course: ${this.courseName}, Instructor: ${this.instructor}`;
  }

  // Helper: seats remaining
  get seatsAvailable() {
    return this.seatsFilled < this.totalSeats;
  }

  get seatsRemaining() {
    return Math.max(this.totalSeats - this.seatsFilled, 0);
  }

  get fillPercent() {
    return Math.min((this.seatsFilled / this.totalSeats) * 100, 100);
  }
}

/* ─────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────── */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* ─────────────────────────────────────────
   DOM REFERENCES
   ───────────────────────────────────────── */
const enrollBtn      = document.getElementById('enrollBtn');
const backBtn        = document.getElementById('backBtn');
const formCard       = document.getElementById('formCard');
const resultSection  = document.getElementById('resultSection');
const statusStamp    = document.getElementById('statusStamp');
const forceFullCheck = document.getElementById('forceFull');
const toggleHint     = document.getElementById('toggleHint');

/* ─────────────────────────────────────────
   TOGGLE HINT UPDATE
   ───────────────────────────────────────── */
forceFullCheck.addEventListener('change', () => {
  if (forceFullCheck.checked) {
    toggleHint.textContent = 'Forced: course full';
    toggleHint.classList.add('full');
  } else {
    toggleHint.textContent = 'Seats available';
    toggleHint.classList.remove('full');
  }
});

/* ─────────────────────────────────────────
   RENDER HELPERS
   ───────────────────────────────────────── */
const renderMiniConsole = (containerId, title, lines) => {
  const el = document.getElementById(containerId);
  el.innerHTML = `
    <div class="mc-bar">
      <span class="mc-dot r"></span>
      <span class="mc-dot y"></span>
      <span class="mc-dot g"></span>
      <span class="mc-title">${title}</span>
    </div>
    <div class="mc-body">
      ${lines.map((l, i) => `<div class="mc-line" id="${containerId}_line${i}" style="transition-delay:${i * 220}ms">${l.text}</div>`).join('')}
    </div>
  `;
  // Trigger show with stagger
  lines.forEach((_, i) => {
    setTimeout(() => {
      const lineEl = document.getElementById(`${containerId}_line${i}`);
      if (lineEl) lineEl.classList.add('show');
    }, 350 + i * 220);
  });
};

const setPipelineNode = (nodeId, arrowId, state) => {
  const node  = document.getElementById(nodeId);
  const arrow = arrowId ? document.getElementById(arrowId) : null;
  if (node)  node.classList.add(state);
  if (arrow) arrow.classList.add('lit');
};

/* ─────────────────────────────────────────
   BUILD SYNTAX-HIGHLIGHTED CODE SNIPPET
   ───────────────────────────────────────── */
const buildCode = (course, success) => {
  const g = success ? '"Enrollment Successful"' : '"Course Full"';
  const seatsLine = success
    ? `<span class="ck">let</span> seatsAvailable = <span class="ck">true</span>;   <span class="cc">// ${course.seatsRemaining} seat(s) remaining</span>`
    : `<span class="ck">let</span> seatsAvailable = <span class="ck">false</span>;  <span class="cc">// No seats left</span>`;

  return `<span class="cc">// ── ES6 Class Definition ──────────────────────</span>
<span class="ck">class</span> <span class="cp">Course</span> <span class="cb">{</span>
  <span class="cm">constructor</span>(courseName, instructor) <span class="cb">{</span>
    <span class="ck">this</span>.courseName = courseName;
    <span class="ck">this</span>.instructor = instructor;
  <span class="cb">}</span>

  <span class="cm">displayCourse</span>() <span class="cb">{</span>
    console.<span class="cf">log</span>(<span class="cs">\`Course: \${<span class="ck">this</span>.courseName}, Instructor: \${<span class="ck">this</span>.instructor}\`</span>);
  <span class="cb">}</span>
<span class="cb">}</span>

<span class="cc">// ── Create Instance ────────────────────────────</span>
<span class="ck">let</span> course1 = <span class="ck">new</span> <span class="cp">Course</span>(<span class="cs">"${course.courseName}"</span>, <span class="cs">"${course.instructor}"</span>);
course1.<span class="cm">displayCourse</span>();
<span class="cc">// → Course: ${course.courseName}, Instructor: ${course.instructor}</span>

<span class="cc">// ── Promise for Enrollment ─────────────────────</span>
<span class="ck">let</span> enrollCourse = <span class="ck">new</span> <span class="cp">Promise</span>((resolve, reject) <span class="ck">=></span> <span class="cb">{</span>
  ${seatsLine}
  <span class="ck">if</span> (seatsAvailable)
    <span class="cf">resolve</span>(<span class="cs">"Enrollment Successful"</span>);
  <span class="ck">else</span>
    <span class="cf">reject</span>(<span class="cs">"Course Full"</span>);
<span class="cb">}</span>);

<span class="cc">// ── .then() / .catch() Chaining ────────────────</span>
enrollCourse
  .<span class="cm">then</span>(msg <span class="ck">=></span> console.<span class="cf">log</span>(msg))
  .<span class="cm">catch</span>(err <span class="ck">=></span> console.<span class="cf">log</span>(err));
<span class="cc">// → ${success ? 'Enrollment Successful' : 'Course Full'}</span>`;
};

/* ─────────────────────────────────────────
   MAIN ENROLL HANDLER
   ───────────────────────────────────────── */
enrollBtn.addEventListener('click', async () => {

  // Read inputs
  const courseName  = document.getElementById('courseName').value.trim()  || 'Web Technologies';
  const instructor  = document.getElementById('instructor').value.trim()  || 'Dr. Kumar';
  const totalSeats  = parseInt(document.getElementById('totalSeats').value,  10) || 30;
  const seatsFilled = parseInt(document.getElementById('seatsFilled').value, 10) || 0;
  const credits     = parseInt(document.getElementById('credits').value,     10) || 3;
  const forceFull   = forceFullCheck.checked;

  if (seatsFilled > totalSeats) {
    alert('Seats filled cannot exceed total seats.');
    return;
  }

  // ── ES6: Create Course instance ────────────
  const course1 = new Course(courseName, instructor, totalSeats, seatsFilled, credits);

  // ── Call displayCourse() ───────────────────
  const displayOutput = course1.displayCourse();

  // ── Determine seat availability ────────────
  const seatsAvailable = forceFull ? false : course1.seatsAvailable;

  // Show result section
  formCard.classList.add('hidden');
  resultSection.classList.remove('hidden');

  // ── Step 1: Course Details ─────────────────
  document.getElementById('courseDetailsBlock').innerHTML = `
    <div class="cdb-row">
      <span class="cdb-key">Course Name</span>
      <span class="cdb-val">${course1.courseName}</span>
    </div>
    <div class="cdb-row">
      <span class="cdb-key">Instructor</span>
      <span class="cdb-val">${course1.instructor}</span>
    </div>
    <div class="cdb-row">
      <span class="cdb-key">Credits</span>
      <span class="cdb-val">${course1.credits}</span>
    </div>
  `;

  renderMiniConsole('miniConsole1', 'course1.displayCourse()', [
    { text: `Course: ${course1.courseName}, Instructor: ${course1.instructor}` }
  ]);

  // ── Step 2: Promise with animation ────────
  await delay(400);
  setPipelineNode('ppCreate', null, 'active');

  await delay(600);
  setPipelineNode('ppCheck', 'ppArrow1', 'active');
  document.getElementById('ppCheckSub').textContent =
    seatsAvailable ? `true (${course1.seatsRemaining} left)` : 'false (0 left)';

  // ── ES6: Promise (as required by exercise) ─
  const enrollCourse = new Promise((resolve, reject) => {
    if (seatsAvailable)
      resolve('Enrollment Successful');
    else
      reject('Course Full');
  });

  await delay(800);

  let enrollResult = '';
  let isSuccess    = false;

  await enrollCourse
    .then(msg => {
      enrollResult = msg;
      isSuccess    = true;
      console.log(msg);
    })
    .catch(err => {
      enrollResult = err;
      isSuccess    = false;
      console.log(err);
    });

  // Animate outcome node
  setPipelineNode('ppOutcome', 'ppArrow2', isSuccess ? 'resolve' : 'reject');
  document.getElementById('ppOutcomeIcon').textContent  = isSuccess ? '✓' : '✗';
  document.getElementById('ppOutcomeTitle').textContent = isSuccess ? '.then()' : '.catch()';
  document.getElementById('ppOutcomeSub').textContent   = enrollResult;

  renderMiniConsole('miniConsole2', 'enrollCourse.then().catch()', [
    { text: enrollResult }
  ]);

  // ── Result banner ──────────────────────────
  const banner = document.getElementById('resultBanner');
  banner.className = `result-banner anim-in ${isSuccess ? 'success' : 'fail'}`;
  banner.style.setProperty('--d', '.22s');
  banner.innerHTML = `
    <div class="rb-icon">${isSuccess ? '🎓' : '🚫'}</div>
    <div>
      <div class="rb-title">${enrollResult}</div>
      <div class="rb-sub">${isSuccess
        ? `Welcome to ${course1.courseName} · Promise resolved`
        : `No seats available · Promise rejected`
      }</div>
    </div>
  `;

  // ── Stamp ──────────────────────────────────
  statusStamp.textContent = isSuccess ? 'ENROLLED' : 'REJECTED';
  statusStamp.className   = `stamp-box ${isSuccess ? 'success' : 'fail'}`;

  // ── Seat meter ─────────────────────────────
  const seatCard = document.getElementById('seatCard');
  seatCard.innerHTML = `
    <div class="rc-label">SEAT AVAILABILITY</div>
    <div class="seat-header">
      <span class="seat-title">Occupancy</span>
      <span class="seat-count">${seatsFilled} / ${totalSeats} filled</span>
    </div>
    <div class="seat-track">
      <div class="seat-fill ${!seatsAvailable ? 'full' : ''}" id="seatFill"></div>
    </div>
    <div class="seat-ticks">
      <span>0</span><span>${Math.round(totalSeats * .25)}</span>
      <span>${Math.round(totalSeats * .5)}</span>
      <span>${Math.round(totalSeats * .75)}</span>
      <span>${totalSeats}</span>
    </div>
  `;
  setTimeout(() => {
    const sf = document.getElementById('seatFill');
    if (sf) sf.style.width = `${course1.fillPercent}%`;
  }, 100);

  // ── Code snippet ───────────────────────────
  document.getElementById('codeBlock').innerHTML = buildCode(course1, isSuccess);

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────
   RESET
   ───────────────────────────────────────── */
backBtn.addEventListener('click', () => {
  resultSection.classList.add('hidden');
  formCard.classList.remove('hidden');
  statusStamp.textContent = 'PENDING';
  statusStamp.className   = 'stamp-box';

  // Reset pipeline node states
  ['ppCreate','ppCheck','ppOutcome'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = id === 'ppOutcome' ? 'pp-node outcome-node' : 'pp-node';
  });
  ['ppArrow1','ppArrow2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'pp-arrow';
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
});