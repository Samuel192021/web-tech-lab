document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("regForm");
    const msg = document.getElementById("msg");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        msg.style.color = "red";

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const reg = document.getElementById("reg").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (name === "") {
            msg.textContent = "Name cannot be empty";
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            msg.textContent = "Enter valid email";
            return;
        }

        if (reg.length !== 6) {
            msg.textContent = "Reg No must be exactly 6 characters";
            return;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            msg.textContent = "Enter a valid 10-digit mobile number";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Registration Successful!";
        form.reset();
    });
});
