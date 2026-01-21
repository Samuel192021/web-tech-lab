// Exercise 3: Dynamic Survey Builder with DOM-Generated Forms

// 1) Question structure with types: text, radio, checkbox
const questions = [
  {
    id: "q1",
    type: "text",
    title: "Your Full Name",
    desc: "Enter your name (3 - 30 characters).",
    required: true,
    minChars: 3,
    maxChars: 30,
    placeholder: "Ex: Samuel G"
  },
  {
    id: "q2",
    type: "radio",
    title: "How often do you shop online?",
    desc: "Pick one option.",
    required: true,
    options: ["Daily", "Weekly", "Monthly", "Rarely"]
  },
  {
    id: "q3",
    type: "checkbox",
    title: "Which categories do you prefer?",
    desc: "Choose minimum 1 and maximum 3 options.",
    required: true,
    options: ["Electronics", "Fashion", "Grocery", "Books", "Sports"],
    minSelect: 1,
    maxSelect: 3
  },
  {
    id: "q4",
    type: "text",
    title: "Write a short feedback about this survey app",
    desc: "Minimum 10 and maximum 120 characters.",
    required: true,
    minChars: 10,
    maxChars: 120,
    placeholder: "Type your feedback here..."
  },
  {
    id: "q5",
    type: "radio",
    title: "Rate the UI Design",
    desc: "Pick one option.",
    required: true,
    options: ["⭐ 1", "⭐⭐ 2", "⭐⭐⭐ 3", "⭐⭐⭐⭐ 4", "⭐⭐⭐⭐⭐ 5"]
  },
  {
    id: "q6",
    type: "checkbox",
    title: "Which features do you want next?",
    desc: "Optional question: select up to 2 features.",
    required: false,
    options: ["Dark mode", "PDF Download", "Email Report", "Charts/Analytics"],
    minSelect: 0,
    maxSelect: 2
  }
];

const form = document.getElementById("surveyForm");
const formFields = document.getElementById("formFields");
const resultBox = document.getElementById("resultBox");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const liveStatus = document.getElementById("liveStatus");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

// Storage key
const LS_KEY = "exercise3_survey_answers_v1";

// state: answers object
let answers = loadFromStorage();

// 2) Dynamically generate fields using DOM
function buildForm() {
  formFields.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "q-card";
    card.dataset.qid = q.id;

    card.innerHTML = `
      <div class="q-top">
        <div class="q-title">${index + 1}. ${q.title}</div>
        ${q.required ? `<div class="req">Required</div>` : `<div class="req" style="background:rgba(255,209,102,0.12)">Optional</div>`}
      </div>
      <div class="q-desc">${q.desc}</div>

      <div class="input" id="${q.id}_input"></div>

      <div class="error" id="${q.id}_error"></div>
      <div class="success-line" id="${q.id}_ok">Looks good ✅</div>
    `;

    formFields.appendChild(card);

    const inputHost = card.querySelector(`#${q.id}_input`);

    if (q.type === "text") {
      inputHost.appendChild(buildTextInput(q));
    } else if (q.type === "radio") {
      inputHost.appendChild(buildRadioInput(q));
    } else if (q.type === "checkbox") {
      inputHost.appendChild(buildCheckboxInput(q));
    }
  });

  // after build apply saved values
  hydrateSavedAnswers();
  validateAllLive();
}

// TEXT input
function buildTextInput(q) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <input class="textbox" id="${q.id}" type="text" placeholder="${q.placeholder || ""}" />
    <div class="counter">
      <span>Char Limit: ${q.minChars || 0} - ${q.maxChars || "∞"}</span>
      <b id="${q.id}_count">0</b>
    </div>
  `;

  const input = wrap.querySelector(`#${q.id}`);
  const counter = wrap.querySelector(`#${q.id}_count`);

  input.addEventListener("input", () => {
    answers[q.id] = input.value;
    counter.textContent = `${input.value.length} chars`;
    saveToStorage();
    validateQuestion(q.id);
    updateProgress();
  });

  return wrap;
}

// RADIO input
function buildRadioInput(q) {
  const wrap = document.createElement("div");
  wrap.className = "options";

  q.options.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "opt";
    label.innerHTML = `
      <input type="radio" name="${q.id}" value="${opt}" />
      <span>${opt}</span>
    `;
    label.querySelector("input").addEventListener("change", () => {
      answers[q.id] = opt;
      saveToStorage();
      validateQuestion(q.id);
      updateProgress();
    });
    wrap.appendChild(label);
  });

  return wrap;
}

// CHECKBOX input
function buildCheckboxInput(q) {
  const wrap = document.createElement("div");
  wrap.className = "options";

  q.options.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "opt";
    label.innerHTML = `
      <input type="checkbox" value="${opt}" />
      <span>${opt}</span>
    `;
    label.querySelector("input").addEventListener("change", () => {
      const selected = [...wrap.querySelectorAll("input:checked")].map(x => x.value);
      answers[q.id] = selected;
      saveToStorage();
      validateQuestion(q.id);
      updateProgress();
    });
    wrap.appendChild(label);
  });

  return wrap;
}

// ===================================
// 3) Client-side validation rules
// ===================================
function validateQuestion(questionId) {
  const q = questions.find(x => x.id === questionId);
  const errEl = document.getElementById(`${q.id}_error`);
  const okEl = document.getElementById(`${q.id}_ok`);

  let isValid = true;
  let msg = "";

  const value = answers[q.id];

  if (q.type === "text") {
    const text = (value || "").trim();
    const len = text.length;

    if (q.required && len === 0) {
      isValid = false;
      msg = "This field is required.";
    } else if (len > 0) {
      if (q.minChars && len < q.minChars) {
        isValid = false;
        msg = `Minimum ${q.minChars} characters required.`;
      } else if (q.maxChars && len > q.maxChars) {
        isValid = false;
        msg = `Maximum ${q.maxChars} characters allowed.`;
      }
    }
  }

  if (q.type === "radio") {
    if (q.required && (!value || value.trim() === "")) {
      isValid = false;
      msg = "Please select one option.";
    }
  }

  if (q.type === "checkbox") {
    const arr = Array.isArray(value) ? value : [];
    const count = arr.length;

    if (q.required && count === 0) {
      isValid = false;
      msg = "Please select at least one option.";
    } else {
      // selection count rule
      const min = q.minSelect ?? 0;
      const max = q.maxSelect ?? Infinity;

      if (count < min) {
        isValid = false;
        msg = `Select at least ${min} option(s).`;
      }
      if (count > max) {
        isValid = false;
        msg = `Select maximum ${max} option(s).`;
      }
    }
  }

  // 5) inline validation messages (DOM manipulation)
  if (!isValid) {
    errEl.style.display = "block";
    errEl.textContent = msg;
    okEl.style.display = "none";
  } else {
    errEl.style.display = "none";
    errEl.textContent = "";
    okEl.style.display = "block";
  }

  return isValid;
}

// Validate all questions at once
function validateAllLive() {
  let ok = true;
  questions.forEach((q) => {
    const valid = validateQuestion(q.id);
    ok = ok && valid;
  });
  updateProgress();
  updateLiveStatus(ok);
  return ok;
}

// 4) Validate before submission using JS functions
function validateBeforeSubmit() {
  return validateAllLive();
}

// Progress calculation
function updateProgress() {
  const total = questions.length;
  let correct = 0;

  questions.forEach((q) => {
    const isValid = validateQuestion(q.id);
    if (isValid) correct++;
  });

  const percent = Math.round((correct / total) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";

  updateLiveStatus(percent === 100);
}

// Live status chip
function updateLiveStatus(allValid) {
  if (allValid) {
    liveStatus.textContent = "All Valid ✅";
    liveStatus.style.borderColor = "rgba(29,209,161,0.5)";
  } else {
    liveStatus.textContent = "Fix Errors ⚠️";
    liveStatus.style.borderColor = "rgba(255,107,107,0.5)";
  }
}

// ================================
// Auto Save / Load (Extra feature)
// ================================
function saveToStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(answers));
}

function loadFromStorage() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Fill saved answers into DOM controls
function hydrateSavedAnswers() {
  questions.forEach((q) => {
    const val = answers[q.id];

    if (q.type === "text") {
      const input = document.getElementById(q.id);
      if (input) {
        input.value = val || "";
        const counter = document.getElementById(`${q.id}_count`);
        if (counter) counter.textContent = `${(input.value || "").length} chars`;
      }
    }

    if (q.type === "radio") {
      if (val) {
        const radios = document.querySelectorAll(`input[type="radio"][name="${q.id}"]`);
        radios.forEach(r => r.checked = (r.value === val));
      }
    }

    if (q.type === "checkbox") {
      const selected = Array.isArray(val) ? val : [];
      const checkboxes = document.querySelectorAll(`[data-qid="${q.id}"] input[type="checkbox"]`);
      checkboxes.forEach(cb => cb.checked = selected.includes(cb.value));
    }
  });
}

// ================================
// 6) Prevent submission until valid
// ================================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const valid = validateBeforeSubmit();
  if (!valid) {
    resultBox.style.display = "block";
    resultBox.innerHTML = `
      <b style="color:#ff6b6b">❌ Cannot Submit</b>
      <p style="margin-top:8px;color:rgba(234,240,255,0.75)">
        Please fix the highlighted errors before submitting.
      </p>
    `;
    return;
  }

  // success
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <b style="color:#1dd1a1">✅ Survey Submitted Successfully!</b>
    <p style="margin-top:8px;color:rgba(234,240,255,0.75)">
      Submitted data is shown below:
    </p>
    <pre style="margin-top:10px;background:rgba(0,0,0,0.25);padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,0.12);overflow:auto;">
${JSON.stringify(answers, null, 2)}
    </pre>
  `;

  // Optional: clear storage after submit
  localStorage.removeItem(LS_KEY);
});

// Save draft button
saveBtn.addEventListener("click", () => {
  saveToStorage();
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <b style="color:#5f8cff">💾 Draft Saved!</b>
    <p style="margin-top:8px;color:rgba(234,240,255,0.75)">
      Your answers were stored in localStorage.
    </p>
  `;
});

// Reset
resetBtn.addEventListener("click", () => {
  if (!confirm("Reset survey and clear saved draft?")) return;
  answers = {};
  localStorage.removeItem(LS_KEY);
  buildForm();
  resultBox.style.display = "none";
});

// INIT
buildForm();
