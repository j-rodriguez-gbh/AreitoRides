const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
    getAllTiposVehiculos,
    getTipoVehiculoById,
    createTipoVehiculo,
    updateTipoVehiculo,
    deleteTipoVehiculo
} = require('../controllers/tiposVehiculosController');

// Rutas públicas (requieren autenticación)
router.get('/', verifyToken, getAllTiposVehiculos);
router.get('/:id', verifyToken, getTipoVehiculoById);

// Rutas protegidas (requieren rol de administrador)
router.post('/', verifyToken, isAdmin, createTipoVehiculo);
router.put('/:id', verifyToken, isAdmin, updateTipoVehiculo);
router.delete('/:id', verifyToken, isAdmin, deleteTipoVehiculo);

module.exports = router; 