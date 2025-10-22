import express from 'express';
import { db } from '../db.mjs';

const router = express.Router();

router.get("/", (req, res) => {
	db.query("SELECT id, usuario_id, clase_id, estado FROM reservas", (err, result) => {
		if (err)
			return res.status(500).json({ error: err.message });
		res.json(result);
	});
});

router.get("/:id", (req, res) => {
	const { id } = req.params;
	db.query("SELECT id, usuario_id, clase_id, estado FROM reservas WHERE id = ?", 
		[id],
		(err, result) => {
		if (err)
			return res.status(500).json({ error: err.message });
		if (result.length === 0)
			return res.status(404).json({ error: "Reserva no encontrada" });
		res.json(result[0]);
	});
});

router.post("/", (req, res) => {
	const { usuario_id, clase_id, estado = "pendiente" } = req.body;
	if (!usuario_id || !clase_id)
		return res.status(400).json({ error: "usuario_id y clase_id son obligatorios"});
	db.query("INSERT INTO reservas (usuario_id, clase_id, estado) VALUES (?, ?, ?)", 
		[usuario_id, clase_id, estado],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.status(201).json({ id: result.insertId, usuario_id, clase_id, estado });
	});
});

router.put("/:id", (req, res) => {
	const { id } = req.params;
	const { estado } = req.body;
	db.query("UPDATE reservas SET estado = ? WHERE id = ?",
		[estado, id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.affectedRows === 0)
				return res.status(404).json({ error: "Reserva no encontrada" });
			res.json({ message: "reserva actualizada"});
		});
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;
	db.query("DELETE FROM reservas WHERE id = ?",
		[id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.affectedRows === 0)
				return res.status(404).json({ error: "Reserva no encontrada" });
			res.json({ message: "Reserva eliminada"});
	});
});

export default router;