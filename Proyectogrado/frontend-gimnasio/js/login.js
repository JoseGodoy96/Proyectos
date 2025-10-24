document.getElementById("loginForm").addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("email").value.trim();
	const password = document.getElementById("password").value.trim();
	const errorMsg = document.getElementById("errorMsg");

	try {
		const response = await fetch("http://localhost:3000/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error || "Error al iniciar sesion");
		}
		localStorage.setItem("user", JSON.stringify(data.user));
		window.location.href = "dashboard.html";
	} catch (err) {
		errorMsg.textContent = err.message;
	}
});