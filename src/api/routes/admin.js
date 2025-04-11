const express = require('express');
const router = express.Router();

// Ruta para obtener estadísticas generales
router.get('/stats', (req, res) => {
    // Aquí iría la lógica para obtener estadísticas
    res.json({
        totalVehiculos: 0,
        totalClientes: 0,
        totalRentas: 0,
        rentasActivas: 0
    });
});

// Ruta para obtener el dashboard
router.get('/dashboard', (req, res) => {
    // Aquí iría la lógica para obtener datos del dashboard
    res.json({
        rentasPorMes: [],
        vehiculosPopulares: [],
        clientesFrecuentes: []
    });
});

module.exports = router; 