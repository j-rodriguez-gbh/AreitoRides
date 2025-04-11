const pool = require('../../config/db');

// Obtener todos los clientes
const getAllClientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM clientes WHERE id_cliente = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
    try {
        const { 
            nombre, 
            apellido, 
            direccion, 
            telefono, 
            email, 
            licencia_conducir, 
            fecha_nacimiento 
        } = req.body;

        const [result] = await pool.query(`
            INSERT INTO clientes (
                nombre, apellido, direccion, telefono, 
                email, licencia_conducir, fecha_nacimiento
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            nombre, apellido, direccion, telefono, 
            email, licencia_conducir, fecha_nacimiento
        ]);

        res.status(201).json({
            id_cliente: result.insertId,
            message: 'Cliente creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
    try {
        const { 
            nombre, 
            apellido, 
            direccion, 
            telefono, 
            email, 
            licencia_conducir, 
            fecha_nacimiento 
        } = req.body;

        const [result] = await pool.query(`
            UPDATE clientes 
            SET nombre = ?, apellido = ?, direccion = ?, 
                telefono = ?, email = ?, licencia_conducir = ?, 
                fecha_nacimiento = ?
            WHERE id_cliente = ?
        `, [
            nombre, apellido, direccion, telefono, 
            email, licencia_conducir, fecha_nacimiento,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM clientes WHERE id_cliente = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
}; 