import express from 'express';
import { db } from '../db.mjs';
import { verificarToken } from '../middleware/middlewareAuth.mjs';

const router = express.Router();

router.get("/", (req, res) => {
	db.query("SELECT id, usuario_id, clase_id, estado FROM reservas", (err, result) => {
		if (err)
			return res.status(500).json({ error: err.message });
		res.json(result);
	});
});

router.get("/mis-reservas", verificarToken, (req, res) => {
	const usuarioId = req.usuario.id;
	db.query("SELECT id, clase_id, estado FROM reservas WHERE usuario_id = ?",
		[usuarioId],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.json(result);
	});
});

router.post("/", verificarToken, (req, res) => {
	const { clase_id } = req.body;
	const usuario_id = req.usuario.id;
	if (!clase_id)
		return res.status(400).json({ error: "clase_id es obligatorio" });
	db.query("INSERT INTO reservas (usuario_id, clase_id, estado) VALUES (?, ?, 'pendiente')",
		[usuario_id, clase_id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.status(201).json({ id: result.insertId, usuario_id, clase_id, estado: "pendiente"});
	});
});

router.put("/:id", verificarToken, (req, res) => {
	const { id } = req.params;
	const { estado } = req.body;
	const usuario_id = req.usuario.id;
	db.query("UPDATE reservas SET estado = ? WHERE id = ? AND usuario_id = ?",
		[estado, id, usuario_id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.affectedRows === 0)
				return res.status(404).json({ error: "Reserva no encontrada o no autorizada" });
			res.json({ message: "Reserva actualizada" });
	});
});

router.delete("/:id", verificarToken, (req, res) => {
	const { id } = req.params;
	const usuario_id = req.usuario.id;
	db.query("DELETE FROM reservas WHERE id = ? AND usuario_id = ?",
		[id, usuario_id],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.affectedRows === 0)
				return res.status(404).json({ error: "Reserva no encontrada o no autorizada "});
			res.json({ message: "Reserva eliminada" });
	});
});

export default router;