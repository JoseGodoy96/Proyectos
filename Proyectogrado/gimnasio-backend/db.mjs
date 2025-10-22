import mysql from 'mysql2';

export const db = mysql.createConnection({
	host: 'localhost',
	user: 'txemita',
	password: 'mi_contraseña',
	database: 'gimnasio'
});

db.connect((err) => {
	if (err) {
		console.error("Error al conectar a MySQL:", err.message);
		process.exit(1);
	} else {
		console.log("Conectado a la base de datos MySQL");
	}
});