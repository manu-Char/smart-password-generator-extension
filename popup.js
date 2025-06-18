// Password Generator
const lengthInput = document.getElementById("lengthInput");
const includeUppercase = document.getElementById("includeUppercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const generateBtn = document.getElementById("generateBtn");
const generatedPassword = document.getElementById("generatedPassword");
const copyPasswordBtn = document.getElementById("copyPasswordBtn");
const passwordHistoryList = document.getElementById("passwordHistoryList");

generateBtn.addEventListener("click", () => {
  const length = parseInt(lengthInput.value) || 12;
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let charset = lower;
  if (includeUppercase.checked) charset += upper;
  if (includeNumbers.checked) charset += numbers;
  if (includeSymbols.checked) charset += symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * charset.length);
    password += charset[rand];
  }

  generatedPassword.textContent = `Password: ${password}`;

  // Save to localStorage
  let history = JSON.parse(localStorage.getItem("passwordHistory") || "[]");
  history.unshift(password);
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem("passwordHistory", JSON.stringify(history));
  updatePasswordHistory();
});

copyPasswordBtn.addEventListener("click", () => {
  const pwd = generatedPassword.textContent.replace("Password: ", "").trim();
  if (pwd && pwd !== "----") {
    navigator.clipboard.writeText(pwd);
    copyPasswordBtn.textContent = "Copied!";
    setTimeout(() => (copyPasswordBtn.textContent = "Copy Password"), 1000);
  }
});

// Password Strength Checker
const passwordInput = document.getElementById("passwordInput");
const strengthOutput = document.getElementById("strengthOutput");
const suggestionsList = document.getElementById("suggestionsList");

passwordInput.addEventListener("input", () => {
  const pwd = passwordInput.value;
  const suggestions = [];

  let score = 0;
  if (pwd.length >= 8) score++;
  else suggestions.push("Use at least 8 characters");

  if (/[A-Z]/.test(pwd)) score++;
  else suggestions.push("Add uppercase letters");

  if (/[a-z]/.test(pwd)) score++;
  else suggestions.push("Add lowercase letters");

  if (/[0-9]/.test(pwd)) score++;
  else suggestions.push("Include numbers");

  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  else suggestions.push("Add special characters");

  const levels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
  const level = levels[Math.min(score, levels.length - 1)];
  strengthOutput.textContent = `Strength: ${level}`;

  // Update progress bar
  const bar = document.querySelector("#strengthBar .bar");
  bar.style.width = `${(score / 5) * 100}%`;
  bar.style.backgroundColor = [
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#27ae60",
  ][Math.min(score, 4)];

  // Suggestions
  suggestionsList.innerHTML = "";
  suggestions.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    suggestionsList.appendChild(li);
  });
});

// Show password history
function updatePasswordHistory() {
  const history = JSON.parse(localStorage.getItem("passwordHistory") || "[]");
  passwordHistoryList.innerHTML = "";
  history.forEach((pwd) => {
    const li = document.createElement("li");
    li.textContent = pwd;
    passwordHistoryList.appendChild(li);
  });
}

// Dark Mode Toggle
const modeSwitch = document.getElementById("modeSwitch");

modeSwitch.addEventListener("change", () => {
  const isDark = modeSwitch.checked;
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    modeSwitch.checked = true;
    document.body.classList.add("dark-mode");
  }
  updatePasswordHistory();
});
