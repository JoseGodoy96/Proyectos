document.addEventListener("DOMContentLoaded", () => {
	const nombreUsuario = document.getElementById("nombreUsuario");
	const rolUsuario = document.getElementById("rolUsuario");
	const logoutBtn = document.getElementById("logoutBtn");	
	let userData = null;
	try {
		userData = JSON.parse(localStorage.getItem("user"));
	} catch (e) {
		console.error("Error al leer userData:", e);
	}
	if (!userData) {
		alert("Debes iniciar sesion");
		window.location.href = "index.html";
		return ;
	}
	if (nombreUsuario)
		nombreUsuario.textContent = userData.nombre;
	if (rolUsuario)
		rolUsuario.textContent = userData.rol;
	const acciones = document.getElementById(`acciones${capitalize(userData.rol)}`);
	if (acciones)
		acciones.classList.remove("oculto");
	logoutBtn.addEventListener("click", () => {
		console.log("boton presionado");
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