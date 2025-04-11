const db = require('../../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los empleados
const getAllEmpleados = async (req, res) => {
  try {
    const [empleados] = await db.query('SELECT * FROM empleados');
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
};

// Obtener un empleado por ID
const getEmpleadoById = async (req, res) => {
  try {
    const [empleado] = await db.query('SELECT * FROM empleados WHERE id = ?', [req.params.id]);
    if (empleado.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json(empleado[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ message: 'Error al obtener empleado' });
  }
};

// Crear un nuevo empleado
const createEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, fecha_nacimiento, fecha_contratacion, salario, cargo } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO empleados (nombre, apellido, email, telefono, direccion, fecha_nacimiento, fecha_contratacion, salario, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono, direccion, fecha_nacimiento, fecha_contratacion, salario, cargo]
    );

    res.status(201).json({
      message: 'Empleado creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ message: 'Error al crear empleado' });
  }
};

// Actualizar un empleado
const updateEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, fecha_nacimiento, fecha_contratacion, salario, cargo } = req.body;
    
    const [result] = await db.query(
      'UPDATE empleados SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, fecha_nacimiento = ?, fecha_contratacion = ?, salario = ?, cargo = ? WHERE id = ?',
      [nombre, apellido, email, telefono, direccion, fecha_nacimiento, fecha_contratacion, salario, cargo, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ message: 'Error al actualizar empleado' });
  }
};

// Eliminar un empleado
const deleteEmpleado = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM empleados WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ message: 'Error al eliminar empleado' });
  }
};

module.exports = {
  getAllEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
}; 