const db = require('../../config/db');

// Obtener todas las marcas
exports.getAllMarcas = async (req, res) => {
  try {
    const [marcas] = await db.execute('SELECT * FROM marcas ORDER BY nombre');
    res.json(marcas);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ message: 'Error al obtener las marcas' });
  }
};

// Obtener una marca por ID
exports.getMarcaById = async (req, res) => {
  try {
    const [marcas] = await db.execute('SELECT * FROM marcas WHERE id_marca = ?', [req.params.id]);
    
    if (marcas.length === 0) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    
    res.json(marcas[0]);
  } catch (error) {
    console.error('Error al obtener marca:', error);
    res.status(500).json({ message: 'Error al obtener la marca' });
  }
};

// Crear una nueva marca
exports.createMarca = async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    
    // Validar datos
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    
    // Verificar si ya existe una marca con la misma descripción
    const [existing] = await db.execute(
      'SELECT * FROM marcas WHERE nombre = ?',
      [nombre]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ya existe una marca con ese nombre' });
    }
    
    // Insertar la nueva marca
    const [result] = await db.execute(
      'INSERT INTO marcas (nombre, estado) VALUES (?, ?)',
      [nombre, estado || 'activo']
    );
    
    // Obtener la marca creada
    const [newMarca] = await db.execute(
      'SELECT * FROM marcas WHERE id_marca = ?',
      [result.insertId]
    );
    
    res.status(201).json(newMarca[0]);
  } catch (error) {
    console.error('Error al crear marca:', error);
    res.status(500).json({ message: 'Error al crear la marca' });
  }
};

// Actualizar una marca
exports.updateMarca = async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const id = req.params.id;
    
    // Validar datos
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    
    // Verificar si la marca existe
    const [existing] = await db.execute(
      'SELECT * FROM marcas WHERE id_marca = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    
    // Verificar si ya existe otra marca con el mismo nombre
    const [duplicate] = await db.execute(
      'SELECT * FROM marcas WHERE nombre = ? AND id_marca != ?',
      [nombre, id]
    );
    
    if (duplicate.length > 0) {
      return res.status(400).json({ message: 'Ya existe otra marca con ese nombre' });
    }
    
    // Actualizar la marca
    await db.execute(
      'UPDATE marcas SET nombre = ?, estado = ? WHERE id_marca = ?',
      [nombre, estado, id]
    );
    
    // Obtener la marca actualizada
    const [updatedMarca] = await db.execute(
      'SELECT * FROM marcas WHERE id_marca = ?',
      [id]
    );
    
    res.json(updatedMarca[0]);
  } catch (error) {
    console.error('Error al actualizar marca:', error);
    res.status(500).json({ message: 'Error al actualizar la marca' });
  }
};

// Eliminar una marca
exports.deleteMarca = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar si la marca existe
    const [existing] = await db.execute(
      'SELECT * FROM marcas WHERE id_marca = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    
    // Verificar si hay modelos asociados a esta marca
    const [modelos] = await db.execute(
      'SELECT * FROM modelos WHERE id_marca = ?',
      [id]
    );
    
    if (modelos.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar la marca porque tiene modelos asociados',
        modelosAsociados: modelos.length
      });
    }
    
    // Eliminar la marca
    await db.execute('DELETE FROM marcas WHERE id_marca = ?', [id]);
    
    res.json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    res.status(500).json({ message: 'Error al eliminar la marca' });
  }
}; 