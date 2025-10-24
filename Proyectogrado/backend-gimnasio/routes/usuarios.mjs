import express from 'express';
import bcrypt from 'bcrypt';
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

router.post("/", async (req, res) => {
	const { nombre, email, password, rol } = req.body;
	if (!nombre || !email || !password)
		return res.status(400).json({ error: "nombre, email y password son obligatorios"});
	db.query("SELECT id FROM usuarios WHERE email = ?",
		[email],
		async (err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.length !== 0)
				return res.status(400).json({ error: "El email ya esta registrado" });
			const hashedPassword = await bcrypt.hash(password, 10);
			db.query("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
				[nombre, email, hashedPassword, rol || "cliente"],
				(err, result) => {
					if (err)
						return res.status(500).json({ error: err.message });
					res.status(201).json({ id: result.insertId, nombre, email, rol: rol || "cliente"});
			});
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