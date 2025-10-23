import express from 'express';
import cors from 'cors';
import { db } from './db.mjs';
import dotenv from 'dotenv';
import usuariosRoutes from './routes/usuarios.mjs';
import clasesRoutes from './routes/clases.mjs';
import reservasRoutes from './routes/reservas.mjs';
import authRoutes from './routes/auth.mjs';

const app = express();
const PORT = 3000;

app.use(cors());
dotenv.config();
app.use(express.json());


app.use((req, res, next) => {
	console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`)
	next();
})

app.get("/", (req, res) => {
	res.send("Bienvenido al servidor de node.js conectado con MySQL");
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/clases", clasesRoutes);
app.use("/api/reservas", reservasRoutes);

app.use((req, res) => res.status(404).send("Ruta no encontrada"));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Error interno de servidor");
});

app.listen(PORT, () => {
	console.log(`Servidor activo y corriendo en http://localhost:${PORT}`);
});