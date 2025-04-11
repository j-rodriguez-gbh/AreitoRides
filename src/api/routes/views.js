const express = require('express');
const router = express.Router();
const path = require('path');

// Base directory for views
const viewsDir = path.join(__dirname, '../../../public/views');

// Front-end routes
router.get('/perfil', (req, res) => {
  res.sendFile(path.join(viewsDir, 'front/perfil.html'));
});

// Admin view routes handled separately to ensure authentication
router.get('/admin', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/index.html'));
});

router.get('/admin/vehiculos', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_vehiculos.html'));
});

router.get('/admin/clientes', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_clientes.html'));
});

router.get('/admin/marcas', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_marcas.html'));
});

router.get('/admin/modelos', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_modelos.html'));
});

router.get('/admin/tipos-vehiculos', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_tipos_vehiculos.html'));
});

router.get('/admin/combustible', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_combustible.html'));
});

router.get('/admin/empleados', (req, res) => {
  res.sendFile(path.join(viewsDir, 'admin/gestion_empleados.html'));
});

module.exports = router; 