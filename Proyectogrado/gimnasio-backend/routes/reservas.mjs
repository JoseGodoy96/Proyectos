import express from 'express';
import { db } from '../db.mjs';
import { verificarToken } from '../middleware/middlewareAuth.mjs';
import { verificarRol } from '../middleware/middlewareRol.mjs';

const router = express.Router();

router.get("/", verificarRol('administrador', 'empleado'), (req, res) => {
	db.query("SELECT id, usuario_id, clase_id, estado FROM reservas", (err, result) => {
		if (err)
			return res.status(500).json({ error: err.message });
		res.json(result);
	});
});

router.get("/mis-reservas", verificarToken, verificarRol('cliente', 'empleado'), (req, res) => {
	const usuarioId = req.usuario.id;
	db.query("SELECT id, clase_id, estado FROM reservas WHERE usuario_id = ?",
		[usuarioId],
		(err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			res.json(result);
	});
});

router.post("/", verificarToken, verificarRol('cliente', 'empleado', 'administrador'), (req, res) => {
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

router.put("/:id", verificarToken, verificarRol('cliente', 'empleado', 'administrador'), (req, res) => {
	const { id } = req.params;
	const { estado } = req.body;
	const usuario_id = req.usuario.id;
	if (req.usuario.rol === 'cliente') {
		db.query("UPDATE reservas SET estado = ? WHERE id = ? AND usuario_id = ?",
			[estado, id, usuario_id],
			(err, result) => {
				if (err)
					return res.status(500).json({ error: err.message });
				if (result.affectedRows === 0)
					return res.status(404).json({ error: "Reserva no encontrada o no autorizada" });
				res.json({ message: "Reserva actualizada" });
		});
	} else {
		db.query("UPDATE reservas SET estadp = ? WHERE id = ?",
			[estado, id],
			(err, result) => {
				if (err)
					return res.status(500).json({ error: "Reserva no encontrada" });
				if (result.affectedRows === 0)
					return res.status(404).json({ error: "Reserva no encontrada" });
				res.json({ message: "Reserva actualizada" });
		});
	}
});

router.delete("/:id", verificarToken, verificarRol('cliente', 'administrador'), (req, res) => {
	const { id } = req.params;
	const usuario_id = req.usuario.id;
	if (req.usuario.rol === 'cliente') {
		db.query("DELETE FROM reservas WHERE id = ? AND usuario_id = ?",
			[id, usuario_id],
			(err, result) => {
				if (err)
					return res.status(500).json({ error: err.message });
				if (result.affectedRows === 0)
					return res.status(404).json({ error: "Reserva no encontrada o no autorizada "});
				res.json({ message: "Reserva eliminada" });
		});
	} else {
		db.query("DELETE FROM reservas WHERE id = ?",
			[id],
			(err, result) => {
				if (err)
					return res.status(500).json({ error: "Reserva no encontrada" });
				if (result.affectedRows === 0)
					return res.status(404).json({ error: "Reserva no encontrada" });
				res.json({ message: "Reserva eliminada" });
		});
	}
});

export default router;