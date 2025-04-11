const express = require('express');
const router = express.Router();
const marcasController = require('../controllers/marcasController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Obtener todas las marcas
router.get('/', verifyToken, marcasController.getAllMarcas);

// Obtener una marca por ID
router.get('/:id', verifyToken, marcasController.getMarcaById);

// Crear una nueva marca (solo administradores)
router.post('/', verifyToken, isAdmin, marcasController.createMarca);

// Actualizar una marca (solo administradores)
router.put('/:id', verifyToken, isAdmin, marcasController.updateMarca);

// Eliminar una marca (solo administradores)
router.delete('/:id', verifyToken, isAdmin, marcasController.deleteMarca);

module.exports = router; 