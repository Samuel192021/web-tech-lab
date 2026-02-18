const usernameInput = document.getElementById("username");
const feedback = document.getElementById("feedback");
const loader = document.getElementById("loader");
const submitBtn = document.getElementById("submitBtn");
const statusIcon = document.getElementById("statusIcon");
const form = document.getElementById("registerForm");

let isAvailable = false;

usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();

    if (username.length < 3) {
        feedback.textContent = "Minimum 3 characters required";
        feedback.style.color = "yellow";
        submitBtn.disabled = true;
        return;
    }

    checkUsername(username);
});

function checkUsername(username) {
    loader.style.display = "block";
    feedback.textContent = "";
    statusIcon.textContent = "";

    fetch("users.json")
        .then(response => {
            if (!response.ok) throw new Error("Server Error");
            return response.json();
        })
        .then(data => {
            loader.style.display = "none";

            if (data.users.includes(username.toLowerCase())) {
                feedback.textContent = "Username already taken";
                feedback.style.color = "#ff4d4d";
                statusIcon.textContent = "❌";
                isAvailable = false;
            } else {
                feedback.textContent = "Username available";
                feedback.style.color = "#00ff99";
                statusIcon.textContent = "✔";
                isAvailable = true;
            }

            submitBtn.disabled = !isAvailable;
        })
        .catch(error => {
            loader.style.display = "none";
            feedback.textContent = error.message;
            feedback.style.color = "red";
            submitBtn.disabled = true;
        });
}

form.addEventListener("submit", (e) => {
    if (!isAvailable) {
        e.preventDefault();
        alert("Username is not available!");
    } else {
        alert("Registration Successful!");
    }
});
