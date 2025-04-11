const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', verifyToken, empleadosController.getAllEmpleados);
router.get('/:id', verifyToken, empleadosController.getEmpleadoById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, empleadosController.createEmpleado);
router.put('/:id', verifyToken, isAdmin, empleadosController.updateEmpleado);
router.delete('/:id', verifyToken, isAdmin, empleadosController.deleteEmpleado);

module.exports = router; 