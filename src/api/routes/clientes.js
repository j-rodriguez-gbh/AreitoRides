const express = require('express');
const router = express.Router();
const { 
    getAllClientes, 
    getClienteById, 
    createCliente, 
    updateCliente, 
    deleteCliente 
} = require('../controllers/clientesController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', verifyToken, getAllClientes);
router.get('/:id', verifyToken, getClienteById);

// Rutas protegidas (solo administradores)
router.post('/', verifyToken, isAdmin, createCliente);
router.put('/:id', verifyToken, isAdmin, updateCliente);
router.delete('/:id', verifyToken, isAdmin, deleteCliente);

module.exports = router; 