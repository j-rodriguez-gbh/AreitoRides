const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/estadisticas', verifyToken, dashboardController.getEstadisticas);

module.exports = router; 