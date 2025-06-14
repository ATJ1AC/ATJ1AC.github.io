document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const res = await fetch("backend/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            const data = await res.json();

            if (data.success) {
                message.textContent = "Вход выполнен!";
                setTimeout(() => location.href = "index.html", 1000);
            } else {
                message.textContent = data.message || "Ошибка";
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const res = await fetch("backend/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            const data = await res.json();

            if (data.success) {
                message.textContent = "Регистрация успешна!";
                setTimeout(() => location.href = "login.html", 1000);
            } else {
                message.textContent = data.error || "Ошибка регистрации";
            }
        });
    }
});