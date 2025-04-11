const express = require('express');
const router = express.Router();
const { 
    getAllTiposCombustible, 
    getTipoCombustibleById, 
    createTipoCombustible, 
    updateTipoCombustible, 
    deleteTipoCombustible 
} = require('../controllers/tiposCombustibleController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', verifyToken, getAllTiposCombustible);
router.get('/:id', verifyToken, getTipoCombustibleById);

// Rutas protegidas (solo administradores)
router.post('/', verifyToken, isAdmin, createTipoCombustible);
router.put('/:id', verifyToken, isAdmin, updateTipoCombustible);
router.delete('/:id', verifyToken, isAdmin, deleteTipoCombustible);

module.exports = router; 