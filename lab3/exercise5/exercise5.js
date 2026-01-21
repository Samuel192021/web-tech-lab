// Exercise 5: Multi-Stage Client-Side Form Workflow Engine

// 6) Store input temporarily in JS variables
let formData = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  state: "",
  pincode: "",
  idType: "",
  idNumber: "",
  interests: [],
  contact: "",
  bio: "",
  confirm: false
};

let currentStage = 1;
const totalStages = 4;

// DOM
const statusChip = document.getElementById("statusChip");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const stepsUI = document.getElementById("stepsUI");

const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

const reviewBox = document.getElementById("reviewBox");
const finalResult = document.getElementById("finalResult");

const bio = document.getElementById("bio");
const bioCount = document.getElementById("bioCount");

// Build Steps UI
function buildSteps() {
  const titles = ["Personal", "Address", "Preferences", "Review"];
  stepsUI.innerHTML = "";
  for (let i = 1; i <= totalStages; i++) {
    const div = document.createElement("div");
    div.className = "step";
    div.id = `step_${i}`;
    div.innerHTML = `<div class="dot">${i}</div>${titles[i-1]}`;
    stepsUI.appendChild(div);
  }
}

// Show stage
function showStage(stage) {
  for (let i = 1; i <= totalStages; i++) {
    document.getElementById(`stage${i}`).classList.remove("active");
  }
  document.getElementById(`stage${stage}`).classList.add("active");

  statusChip.textContent = `Stage ${stage} of 4`;

  // buttons
  backBtn.style.display = stage === 1 ? "none" : "inline-flex";
  nextBtn.style.display = stage === 4 ? "none" : "inline-flex";
  submitBtn.style.display = stage === 4 ? "inline-flex" : "none";

  updateProgressUI();
  updateStepsUI();
}

// Progress
function updateProgressUI() {
  const percent = Math.round(((currentStage - 1) / (totalStages - 1)) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;
}

function updateStepsUI() {
  for (let i = 1; i <= totalStages; i++) {
    const step = document.getElementById(`step_${i}`);
    step.classList.remove("active", "done");
    if (i < currentStage) step.classList.add("done");
    if (i === currentStage) step.classList.add("active");
  }
}

// Helpers
function setError(id, msg) {
  const el = document.getElementById(id);
  el.style.display = msg ? "block" : "none";
  el.textContent = msg || "";
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(s) {
  return /^[0-9]+$/.test(s);
}

// Collect data live
function collectStageInputs() {
  // stage 1
  formData.fullName = document.getElementById("fullName").value.trim();
  formData.email = document.getElementById("email").value.trim();
  formData.phone = document.getElementById("phone").value.trim();
  formData.age = document.getElementById("age").value.trim();

  // stage 2
  formData.city = document.getElementById("city").value.trim();
  formData.state = document.getElementById("state").value.trim();
  formData.pincode = document.getElementById("pincode").value.trim();
  formData.idType = document.getElementById("idType").value;
  formData.idNumber = document.getElementById("idNumber").value.trim();

  // stage 3
  const checked = [...document.querySelectorAll("#interestBox input:checked")]
    .map(x => x.value);
  formData.interests = checked;

  const selectedRadio = document.querySelector('input[name="contact"]:checked');
  formData.contact = selectedRadio ? selectedRadio.value : "";

  formData.bio = document.getElementById("bio").value;
  formData.confirm = document.getElementById("confirmCheck").checked;
}

// =============================
// Validation per stage (STRICT)
// =============================

function validateStage1() {
  collectStageInputs();
  let ok = true;

  // name
  if (formData.fullName.length < 3 || formData.fullName.length > 30) {
    setError("fullName_err", "Name must be 3 to 30 characters.");
    ok = false;
  } else setError("fullName_err", "");

  // email
  if (!isEmailValid(formData.email)) {
    setError("email_err", "Enter a valid email address.");
    ok = false;
  } else setError("email_err", "");

  // phone
  if (!onlyDigits(formData.phone) || formData.phone.length !== 10) {
    setError("phone_err", "Phone must be exactly 10 digits.");
    ok = false;
  } else setError("phone_err", "");

  // age
  const ageNum = Number(formData.age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 60) {
    setError("age_err", "Age must be between 18 and 60.");
    ok = false;
  } else setError("age_err", "");

  return ok;
}

function validateStage2() {
  collectStageInputs();
  let ok = true;

  if (formData.city.length < 2) { setError("city_err", "City is required."); ok = false; }
  else setError("city_err", "");

  if (formData.state.length < 2) { setError("state_err", "State is required."); ok = false; }
  else setError("state_err", "");

  if (!onlyDigits(formData.pincode) || formData.pincode.length !== 6) {
    setError("pincode_err", "PIN code must be exactly 6 digits.");
    ok = false;
  } else setError("pincode_err", "");

  if (!formData.idType) {
    setError("idType_err", "Select an ID type.");
    ok = false;
  } else setError("idType_err", "");

  // ID Number rules
  if (!formData.idNumber) {
    setError("idNumber_err", "Enter ID number.");
    ok = false;
  } else {
    if (formData.idType === "Aadhar") {
      if (!onlyDigits(formData.idNumber) || formData.idNumber.length !== 12) {
        setError("idNumber_err", "Aadhar must be 12 digits.");
        ok = false;
      } else setError("idNumber_err", "");
    } else if (formData.idType === "PAN") {
      // PAN: 10 chars, 5 letters 4 digits 1 letter (simple pattern)
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber.toUpperCase())) {
        setError("idNumber_err", "PAN format invalid. Ex: ABCDE1234F");
        ok = false;
      } else setError("idNumber_err", "");
    } else if (formData.idType === "Passport") {
      if (formData.idNumber.length < 6 || formData.idNumber.length > 9) {
        setError("idNumber_err", "Passport must be 6-9 characters.");
        ok = false;
      } else setError("idNumber_err", "");
    }
  }

  return ok;
}

function validateStage3() {
  collectStageInputs();
  let ok = true;

  // interests minimum 2
  if (formData.interests.length < 2) {
    setError("interests_err", "Select at least 2 interests.");
    ok = false;
  } else setError("interests_err", "");

  // contact mode
  if (!formData.contact) {
    setError("contact_err", "Select a contact mode.");
    ok = false;
  } else setError("contact_err", "");

  // bio strict chars 10 - 120
  const len = formData.bio.trim().length;
  if (len < 10 || len > 120) {
    setError("bio_err", "Bio must be 10 to 120 characters.");
    ok = false;
  } else setError("bio_err", "");

  return ok;
}

function validateStage4() {
  collectStageInputs();
  let ok = true;

  if (!formData.confirm) {
    setError("confirm_err", "You must confirm before submission.");
    ok = false;
  } else setError("confirm_err", "");

  return ok;
}

// Validate current stage
function validateCurrentStage() {
  if (currentStage === 1) return validateStage1();
  if (currentStage === 2) return validateStage2();
  if (currentStage === 3) return validateStage3();
  if (currentStage === 4) return validateStage4();
  return false;
}

// Build review summary
function buildReview() {
  reviewBox.innerHTML = `
    <div class="row"><span>Name</span><b>${formData.fullName}</b></div>
    <div class="row"><span>Email</span><b>${formData.email}</b></div>
    <div class="row"><span>Phone</span><b>${formData.phone}</b></div>
    <div class="row"><span>Age</span><b>${formData.age}</b></div>
    <div class="row"><span>City</span><b>${formData.city}</b></div>
    <div class="row"><span>State</span><b>${formData.state}</b></div>
    <div class="row"><span>PIN</span><b>${formData.pincode}</b></div>
    <div class="row"><span>ID Proof</span><b>${formData.idType} - ${formData.idNumber}</b></div>
    <div class="row"><span>Interests</span><b>${formData.interests.join(", ")}</b></div>
    <div class="row"><span>Contact</span><b>${formData.contact}</b></div>
    <div class="row"><span>Bio</span><b>${formData.bio.trim()}</b></div>
  `;
}

// Navigation
nextBtn.addEventListener("click", () => {
  const ok = validateCurrentStage();
  if (!ok) return; // 5) prevent navigation if invalid

  // if moving to stage 4, build review
  if (currentStage === 3) {
    collectStageInputs();
    buildReview();
  }

  currentStage++;
  showStage(currentStage);
});

backBtn.addEventListener("click", () => {
  currentStage--;
  showStage(currentStage);
});

// Live bio counter
bio.addEventListener("input", () => {
  bioCount.textContent = `${bio.value.length} chars`;
  if (currentStage === 3) validateStage3();
});

// validate on input for stage 1 & 2
["fullName","email","phone","age","city","state","pincode","idNumber"].forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => {
    if (currentStage === 1) validateStage1();
    if (currentStage === 2) validateStage2();
  });
});
document.getElementById("idType").addEventListener("change", () => {
  if (currentStage === 2) validateStage2();
});

// stage 3 listeners
document.querySelectorAll("#interestBox input").forEach(cb => {
  cb.addEventListener("change", () => {
    if (currentStage === 3) validateStage3();
  });
});
document.querySelectorAll('input[name="contact"]').forEach(r => {
  r.addEventListener("change", () => {
    if (currentStage === 3) validateStage3();
  });
});
document.getElementById("confirmCheck").addEventListener("change", () => {
  if (currentStage === 4) validateStage4();
});

// Prevent submit until all stages valid
document.getElementById("multiForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // validate stage 4
  const ok4 = validateStage4();
  if (!ok4) return;

  // Re-validate all for safety
  const ok = validateStage1() && validateStage2() && validateStage3() && validateStage4();
  if (!ok) return;

  finalResult.style.display = "block";
  finalResult.innerHTML = `
    <b style="color:#1dd1a1">✅ Form Submitted Successfully!</b>
    <p style="margin-top:8px;color:rgba(234,240,255,0.75)">
      Stored data (JS variables):
    </p>
    <pre style="margin-top:10px;background:rgba(0,0,0,0.25);padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,0.12);overflow:auto;">
${JSON.stringify(formData, null, 2)}
    </pre>
  `;
});

// INIT
buildSteps();
showStage(currentStage);
bioCount.textContent = `${bio.value.length} chars`;
