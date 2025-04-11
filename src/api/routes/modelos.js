const express = require('express');
const router = express.Router();
const { 
    getAllModelos, 
    getModeloById, 
    createModelo, 
    updateModelo, 
    deleteModelo 
} = require('../controllers/modelosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', verifyToken, getAllModelos);
router.get('/:id', verifyToken, getModeloById);

// Rutas protegidas (solo administradores)
router.post('/', verifyToken, isAdmin, createModelo);
router.put('/:id', verifyToken, isAdmin, updateModelo);
router.delete('/:id', verifyToken, isAdmin, deleteModelo);

module.exports = router; 