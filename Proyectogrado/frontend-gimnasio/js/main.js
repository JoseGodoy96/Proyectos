document.addEventListener("DOMContentLoaded", () => {
	const nombreUsuario = document.getElementById("nombreUsuario");
	const rolUsuario = document.getElementById("rolUsuario");
	const logoutBtn = document.getElementById("logoutBtn");
	const userData = JSON.parse(localStorage.getItem("user"));
	if (!userData) {
		alert("Debes iniciar sesion");
		window.location.href = "index.html";
		return ;
	}
	nombreUsuario.textContent = userData.nombre;
	rolUsuario.textContent = userData.rol;
	document.getElementById(`acciones${capitalize(userData.rol)}`).classList.remove("oculto");
	logoutBtn.addEventListener("click", () => {
		localStorage.removeItem("user");
		window.location.href = "index.html";
	});
});

function irA(pagina) {
	window.location.href = pagina;
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}