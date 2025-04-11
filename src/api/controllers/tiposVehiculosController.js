const db = require('../../config/db');

// Obtener todos los tipos de vehículos
const getAllTiposVehiculos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tipo_vehiculo ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de vehículos:', error);
    res.status(500).json({ message: 'Error al obtener tipos de vehículos' });
  }
};

// Obtener un tipo de vehículo por ID
const getTipoVehiculoById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tipo_vehiculo WHERE id_tipo_vehiculo = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de vehículo no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener tipo de vehículo:', error);
    res.status(500).json({ message: 'Error al obtener tipo de vehículo' });
  }
};

// Crear un nuevo tipo de vehículo
const createTipoVehiculo = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    
    const [result] = await db.query(
      'INSERT INTO tipo_vehiculo (nombre) VALUES (?)',
      [nombre]
    );
    res.status(201).json({
      id_tipo_vehiculo: result.insertId,
      nombre
    });
  } catch (error) {
    console.error('Error al crear tipo de vehículo:', error);
    res.status(500).json({ message: 'Error al crear tipo de vehículo' });
  }
};

// Actualizar un tipo de vehículo
const updateTipoVehiculo = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    
    const [result] = await db.query(
      'UPDATE tipo_vehiculo SET nombre = ? WHERE id_tipo_vehiculo = ?',
      [nombre, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de vehículo no encontrado' });
    }
    res.json({ id_tipo_vehiculo: req.params.id, nombre });
  } catch (error) {
    console.error('Error al actualizar tipo de vehículo:', error);
    res.status(500).json({ message: 'Error al actualizar tipo de vehículo' });
  }
};

// Eliminar un tipo de vehículo
const deleteTipoVehiculo = async (req, res) => {
  try {
    // Verificar si hay vehículos asociados a este tipo
    const [vehiculos] = await db.query(
      'SELECT COUNT(*) as count FROM vehiculos WHERE id_tipoVehiculo = ?',
      [req.params.id]
    );
    
    if (vehiculos[0].count > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar este tipo de vehículo porque está asociado a vehículos',
        vehiculosAsociados: vehiculos[0].count
      });
    }
    
    const [result] = await db.query(
      'DELETE FROM tipo_vehiculo WHERE id_tipo_vehiculo = ?', 
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de vehículo no encontrado' });
    }
    
    res.json({ message: 'Tipo de vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tipo de vehículo:', error);
    res.status(500).json({ message: 'Error al eliminar tipo de vehículo' });
  }
};

module.exports = {
  getAllTiposVehiculos,
  getTipoVehiculoById,
  createTipoVehiculo,
  updateTipoVehiculo,
  deleteTipoVehiculo
}; 