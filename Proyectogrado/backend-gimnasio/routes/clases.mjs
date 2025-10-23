import express from 'express';
import { db } from '../db.mjs';
import { verificarToken } from '../middleware/middlewareAuth.mjs';
import { verificarRol } from '../middleware/middlewareRol.mjs';

const router = express.Router();

router.get("/", (req, res) => {
	db.query("SELECT id, nombre, descripcion, created_at FROM clases", (err, result) => {
		if (err)
			return res.status(500).json({ error: err.message });
		res.json(result);
	});
});

router.get("/:id", (req, res) => {
	const { id } = req.params;
	db.query("SELECT id, nombre, descripcion, fecha_hora, duracion, capacidad, created_at FROM clases WHERE id = ?",
		[id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.length === 0)
				return res.status(404).json({ error: "Clase no encontrada" });
			res.json(result[0]);
	});
});

router.post("/", verificarToken, verificarRol('administrador'), (req, res) => {
	const { nombre, descripcion, fecha_hora, duracion, capacidad } = req.body;
	if (!nombre || !descripcion)
		return res.status(400).json({ error: "nombre y descripcion son obligatorios" });
	db.query("INSERT INTO clases (nombre, descripcion, fecha_hora, duracion, capacidad) VALUES (?, ?, ?, ?, ?)",
		[nombre, descripcion, fecha_hora, duracion, capacidad],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.status(201).json({ id: result.insertId, nombre, descripcion, fecha_hora, duracion, capacidad });
	});
});

router.put("/:id", verificarToken, verificarRol('administrador'), (req, res) => {
	const { id } = req.params;
	const { nombre, descripcion, fecha_hora, duracion, capacidad } = req.body;
	db.query("UPDATE clases SET nombre = ?, descripcion = ?, fecha_hora = ?, duracion = ?, capacidad = ? WHERE id = ?",
		[nombre, descripcion, fecha_hora, duracion, capacidad, id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.affectedRows === 0)
				return res.status(404).json({ error: "Clase no encontrada" });
			res.json({ message: "clase actualizada"});
	});
});

router.delete("/:id", verificarToken, verificarRol('administrador'), (req, res) => {
	const { id } = req.params;
	db.query("DELETE FROM clases WHERE id = ?",
		[id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.affectedRows === 0)
				return res.status(404).json({ error: "Clase no encontrada" });
			res.json({ message: "clase eliminada" });
	});
});

export default router;