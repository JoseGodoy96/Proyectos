import express from 'express';
import { db } from '../db.mjs';

const router = express.Router();

router.get("/", (req, res) => {
	db.query("SELECT id, nombre, rol, created_at FROM usuarios", (err, results) => {
		if (err)
			return res.status(500).json({ error: err.message });
		res.json(results);
	});
});

router.get("/:id", (req, res) => {
	const { id } = req.params;
	db.query("SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?", [id], (err, results) => {
		if (err)
			return res.status(500).json({ error: err.message });
		if (results.length === 0)
			return res.status(404).json({ error: "Usuario no encontrado" });
		res.json(results[0]);
	});
});

router.post("/", (req, res) => {
	const { nombre, email, password, rol } = req.body;
	db.query("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
		[nombre, email, password, rol || "cliente"],
		(err, result) => {
		if (err)
			return res.status(500).json({ error: err.message });
		res.status(201).json({ id: result.insertId, nombre, email, rol: rol || "cliente"});
	});
});

router.put("/:id", (req, res) => {
	const { id } = req.params;
	const { nombre, email, password, rol } = req.body;
	db.query("UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?",
		[nombre, email, password, rol, id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.json({ message: "usuario actualizado"});
	});
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;
	db.query("DELETE FROM usuarios WHERE id = ?",
		[id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.json({ message: "Usuario eliminado" })
	});
});

export default router;