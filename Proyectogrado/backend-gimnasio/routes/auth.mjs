import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.mjs';

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const { nombre, email, password } = req.body;
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
				db.query("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
					[nombre, email, hashedPassword],
					(err, result) => {
						if (err)
							return res.status(500).json({ error: err.message });
						res.status(201).json({ message: "Usuario registrado correctamente" });
				})
		});
	} catch (err) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ error: "email y password son obligatorios"});
	db.query("SELECT * FROM usuarios WHERE email = ?",
		[email],
		async (err, result) => {
			if (err)
				return res.status(500).json({ error: err.message });
			if (result.length === 0)
				return res.status(401).json({ error: "Credenciales invalidas" });
			const usuario = result[0];
			const passwordValida = await bcrypt.compare(password, usuario.password);
			if (!passwordValida)
				return res.status(401).json({ error: "Credenciales invalidas" });
			delete usuario.password;
			const token = jwt.sign(
				{ id: usuario.id, rol: usuario.rol },
				process.env.JWT_SECRET,
				{ expiresIn: process.env.JWT_EXPIRES_IN });
			res.json({
				message: "Login correcto",
				token, 
				user: {
					id: usuario.id,
					nombre: usuario.nombre,
					email: usuario.email,
					rol: usuario.rol
				}
			});
	});
});

export default router;