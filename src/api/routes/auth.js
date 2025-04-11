const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

// Ruta para obtener el perfil del usuario actual
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router; 