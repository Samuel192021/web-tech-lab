// Exercise 1: Adaptive Registration System with Dynamic Validation Rules

// DOM
const form = document.getElementById("regForm");
const role = document.getElementById("role");
const roleChip = document.getElementById("roleChip");

const teacherBlock = document.getElementById("teacherBlock");
const adminBlock = document.getElementById("adminBlock");

const passFill = document.getElementById("passFill");
const passStrength = document.getElementById("passStrength");
const passRules = document.getElementById("passRules");

const resultBox = document.getElementById("resultBox");
const resetBtn = document.getElementById("resetBtn");

// store input temporarily in JS object
let userData = {
  name: "",
  email: "",
  age: "",
  role: "Student",
  skills: "",
  subject: "",
  adminCode: ""
};

// helper: error + valid UI
function setError(inputId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(`${inputId}_err`);

  if (msg) {
    err.style.display = "block";
    err.textContent = msg;
    input.classList.add("invalid");
  } else {
    err.style.display = "none";
    err.textContent = "";
    input.classList.remove("invalid");
  }
}

// email format
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// role-based email domain rules
function validateEmailDomain(email, selectedRole) {
  const lower = email.toLowerCase();

  if (selectedRole === "Student") {
    // must contain student or end with .edu
    return lower.includes("student") || lower.endsWith(".edu");
  }

  if (selectedRole === "Teacher") {
    // must contain teacher or end with .school
    return lower.includes("teacher") || lower.endsWith(".school");
  }

  if (selectedRole === "Admin") {
    // must end with @admin.com OR contain admin
    return lower.endsWith("@admin.com") || lower.includes("admin");
  }

  return true;
}

// password strength by role
function passwordRulesByRole(selectedRole) {
  if (selectedRole === "Admin") {
    return {
      minLen: 10,
      needUpper: true,
      needLower: true,
      needNum: true,
      needSpecial: true
    };
  }

  if (selectedRole === "Teacher") {
    return {
      minLen: 8,
      needUpper: true,
      needLower: true,
      needNum: true,
      needSpecial: false
    };
  }

  // Student
  return {
    minLen: 6,
    needUpper: false,
    needLower: true,
    needNum: true,
    needSpecial: false
  };
}

// password check
function checkPasswordStrength(password, rules) {
  let score = 0;
  const hints = [];

  if (password.length >= rules.minLen) score++; else hints.push(`Min length ${rules.minLen}`);
  if (!rules.needUpper || /[A-Z]/.test(password)) score++; else hints.push("Add uppercase");
  if (!rules.needLower || /[a-z]/.test(password)) score++; else hints.push("Add lowercase");
  if (!rules.needNum || /[0-9]/.test(password)) score++; else hints.push("Add number");
  if (!rules.needSpecial || /[^A-Za-z0-9]/.test(password)) score++; else hints.push("Add special char");

  return { score, hints };
}

function updatePasswordMeter() {
  const selectedRole = role.value;
  const rules = passwordRulesByRole(selectedRole);
  const password = document.getElementById("password").value;

  // show rules in UI
  const ruleText = `
    Role rules: Min ${rules.minLen}, 
    ${rules.needUpper ? "Uppercase," : ""}
    ${rules.needLower ? "Lowercase," : ""}
    ${rules.needNum ? "Number," : ""}
    ${rules.needSpecial ? "Special char" : ""}
  `.replace(/\s+/g, " ").trim();

  passRules.textContent = ruleText;

  const { score, hints } = checkPasswordStrength(password, rules);
  const maxScore = 5;
  const percent = Math.round((score / maxScore) * 100);

  passFill.style.width = percent + "%";

  if (percent <= 40) passStrength.textContent = "Strength: Weak";
  else if (percent <= 70) passStrength.textContent = "Strength: Medium";
  else passStrength.textContent = "Strength: Strong";

  return { percent, hints, rules };
}

// =======================
// Role UI show/hide blocks
// =======================
function updateRoleUI() {
  const r = role.value;
  roleChip.textContent = `Role: ${r}`;

  teacherBlock.classList.add("hidden");
  adminBlock.classList.add("hidden");

  if (r === "Teacher") teacherBlock.classList.remove("hidden");
  if (r === "Admin") adminBlock.classList.remove("hidden");

  updatePasswordMeter();
  validateAll(); // revalidate when role changes
}

// =======================
// Validation functions
// =======================
function validateName() {
  const name = document.getElementById("name").value.trim();
  userData.name = name;

  if (name.length < 3 || name.length > 30) {
    setError("name", "Name must be 3 to 30 characters.");
    return false;
  }
  setError("name", "");
  return true;
}

function validateAge() {
  const age = document.getElementById("age").value.trim();
  userData.age = age;

  const n = Number(age);
  if (isNaN(n) || n < 10 || n > 70) {
    setError("age", "Age must be between 10 and 70.");
    return false;
  }
  setError("age", "");
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  userData.email = email;
  const r = role.value;

  if (!isEmailValid(email)) {
    setError("email", "Enter a valid email address.");
    return false;
  }

  if (!validateEmailDomain(email, r)) {
    setError("email", `Email domain not allowed for ${r}.`);
    return false;
  }

  setError("email", "");
  return true;
}

function validatePassword() {
  const password = document.getElementById("password").value;
  const { percent, hints, rules } = updatePasswordMeter();

  if (password.length === 0) {
    setError("password", "Password is required.");
    return false;
  }

  const ok =
    password.length >= rules.minLen &&
    (!rules.needUpper || /[A-Z]/.test(password)) &&
    (!rules.needLower || /[a-z]/.test(password)) &&
    (!rules.needNum || /[0-9]/.test(password)) &&
    (!rules.needSpecial || /[^A-Za-z0-9]/.test(password));

  if (!ok) {
    setError("password", "Password not strong enough: " + hints.join(", "));
    return false;
  }

  setError("password", "");
  return true;
}

function validateConfirmPassword() {
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (confirm.length === 0) {
    setError("confirmPassword", "Confirm password is required.");
    return false;
  }

  if (password !== confirm) {
    setError("confirmPassword", "Passwords do not match.");
    return false;
  }

  setError("confirmPassword", "");
  return true;
}

function validateSkills() {
  const skills = document.getElementById("skills").value.trim();
  const r = role.value;
  userData.skills = skills;

  // skills requirement changes
  if (r === "Student") {
    if (skills.split(",").filter(s => s.trim()).length < 1) {
      setError("skills", "Enter at least 1 skill (comma separated).");
      return false;
    }
  }
  if (r === "Teacher") {
    if (skills.split(",").filter(s => s.trim()).length < 2) {
      setError("skills", "Teachers must enter at least 2 skills.");
      return false;
    }
  }
  if (r === "Admin") {
    if (skills.split(",").filter(s => s.trim()).length < 3) {
      setError("skills", "Admins must enter at least 3 skills.");
      return false;
    }
  }

  setError("skills", "");
  return true;
}

function validateTeacherSubject() {
  const r = role.value;
  const subject = document.getElementById("subject").value.trim();
  userData.subject = subject;

  if (r === "Teacher") {
    if (subject.length < 3) {
      setError("subject", "Subject is required for teachers.");
      return false;
    }
    setError("subject", "");
  } else {
    setError("subject", "");
  }

  return true;
}

function validateAdminCode() {
  const r = role.value;
  const code = document.getElementById("adminCode").value.trim();
  userData.adminCode = code;

  if (r === "Admin") {
    if (!/^ADM-\d{4}$/.test(code.toUpperCase())) {
      setError("adminCode", "Admin code format: ADM-XXXX (digits).");
      return false;
    }
    setError("adminCode", "");
  } else {
    setError("adminCode", "");
  }

  return true;
}

// validate all
function validateAll() {
  const ok =
    validateName() &
    validateAge() &
    validateEmail() &
    validatePassword() &
    validateConfirmPassword() &
    validateSkills() &
    validateTeacherSubject() &
    validateAdminCode();

  return Boolean(ok);
}

// =======================
// Event listeners
// =======================
role.addEventListener("change", updateRoleUI);

["name","age","email"].forEach(id => {
  document.getElementById(id).addEventListener("input", validateAll);
});

["password","confirmPassword","skills","subject","adminCode"].forEach(id => {
  document.getElementById(id).addEventListener("input", validateAll);
});

// prevent submit until valid
form.addEventListener("submit", (e) => {
  e.preventDefault();
  resultBox.style.display = "block";

  const ok = validateAll();
  if (!ok) {
    resultBox.innerHTML = `
      <b style="color:#ff6b6b">❌ Registration Failed</b>
      <p style="margin-top:8px;color:rgba(234,240,255,0.75)">
        Fix the highlighted fields and try again.
      </p>
    `;
    return;
  }

  userData.role = role.value;

  resultBox.innerHTML = `
    <b style="color:#1dd1a1">✅ Registration Successful!</b>
    <p style="margin-top:8px;color:rgba(234,240,255,0.75)">
      User data stored in JS variables:
    </p>
    <pre style="margin-top:10px;background:rgba(0,0,0,0.25);padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,0.12);overflow:auto;border-radius:14px;">
${JSON.stringify(userData, null, 2)}
    </pre>
  `;
});

// reset
resetBtn.addEventListener("click", () => {
  form.reset();
  userData = { name:"", email:"", age:"", role:"Student", skills:"", subject:"", adminCode:"" };
  resultBox.style.display = "none";
  updateRoleUI();
  validateAll();
});

// init
updateRoleUI();
validateAll();
