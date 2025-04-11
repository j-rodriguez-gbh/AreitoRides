const express = require('express');
const router = express.Router();
const { 
    getAllVehiculos, 
    getVehiculoById, 
    createVehiculo, 
    updateVehiculo, 
    deleteVehiculo 
} = require('../controllers/vehiculosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getAllVehiculos);
router.get('/:id', getVehiculoById);

// Rutas protegidas (solo administradores)
router.post('/', verifyToken, isAdmin, createVehiculo);
router.put('/:id', verifyToken, isAdmin, updateVehiculo);
router.delete('/:id', verifyToken, isAdmin, deleteVehiculo);

module.exports = router; 