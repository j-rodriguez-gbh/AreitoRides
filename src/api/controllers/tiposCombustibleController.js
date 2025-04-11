const pool = require('../../config/db');

// Obtener todos los tipos de combustible
const getAllTiposCombustible = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_combustible ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de combustible:', error);
    res.status(500).json({ message: 'Error al obtener tipos de combustible' });
  }
};

// Obtener un tipo de combustible por ID
const getTipoCombustibleById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tipo_combustible WHERE id_tipo_combustible = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de combustible no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener tipo de combustible:', error);
    res.status(500).json({ message: 'Error al obtener tipo de combustible' });
  }
};

// Crear un nuevo tipo de combustible
const createTipoCombustible = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const [result] = await pool.query(`
      INSERT INTO tipo_combustible (nombre)
      VALUES (?)
    `, [nombre]);

    res.status(201).json({
      id_tipo_combustible: result.insertId,
      nombre,
      message: 'Tipo de combustible creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear tipo de combustible:', error);
    res.status(500).json({ message: 'Error al crear tipo de combustible' });
  }
};

// Actualizar un tipo de combustible
const updateTipoCombustible = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const [result] = await pool.query(`
      UPDATE tipo_combustible 
      SET nombre = ?
      WHERE id_tipo_combustible = ?
    `, [nombre, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de combustible no encontrado' });
    }

    res.json({ message: 'Tipo de combustible actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar tipo de combustible:', error);
    res.status(500).json({ message: 'Error al actualizar tipo de combustible' });
  }
};

// Eliminar un tipo de combustible
const deleteTipoCombustible = async (req, res) => {
  try {
    // Verificar si hay vehículos asociados a este tipo de combustible
    const [vehiculos] = await pool.query(
      'SELECT COUNT(*) as count FROM vehiculos WHERE id_tipo_combustible = ?',
      [req.params.id]
    );
    
    if (vehiculos[0].count > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar este tipo de combustible porque está asociado a vehículos',
        vehiculosAsociados: vehiculos[0].count
      });
    }
    
    const [result] = await pool.query(
      'DELETE FROM tipo_combustible WHERE id_tipo_combustible = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de combustible no encontrado' });
    }

    res.json({ message: 'Tipo de combustible eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tipo de combustible:', error);
    res.status(500).json({ message: 'Error al eliminar tipo de combustible' });
  }
};

module.exports = {
  getAllTiposCombustible,
  getTipoCombustibleById,
  createTipoCombustible,
  updateTipoCombustible,
  deleteTipoCombustible
}; 