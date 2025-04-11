const pool = require('../../config/db');

// Obtener todos los modelos
const getAllModelos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.*, ma.nombre as marca_nombre
            FROM modelos m
            LEFT JOIN marcas ma ON m.id_marca = ma.id_marca
            ORDER BY ma.nombre, m.nombre
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener modelos:', error);
        res.status(500).json({ message: 'Error al obtener modelos' });
    }
};

// Obtener un modelo por ID
const getModeloById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.*, ma.nombre as marca_nombre
            FROM modelos m
            LEFT JOIN marcas ma ON m.id_marca = ma.id_marca
            WHERE m.id_modelo = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Modelo no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener modelo:', error);
        res.status(500).json({ message: 'Error al obtener modelo' });
    }
};

// Crear un nuevo modelo
const createModelo = async (req, res) => {
    try {
        const { id_marca, nombre } = req.body;

        const [result] = await pool.query(`
            INSERT INTO modelos (id_marca, nombre)
            VALUES (?, ?)
        `, [id_marca, nombre]);

        res.status(201).json({
            id_modelo: result.insertId,
            message: 'Modelo creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear modelo:', error);
        res.status(500).json({ message: 'Error al crear modelo' });
    }
};

// Actualizar un modelo
const updateModelo = async (req, res) => {
    try {
        const { id_marca, nombre } = req.body;

        const [result] = await pool.query(`
            UPDATE modelos 
            SET id_marca = ?, nombre = ?
            WHERE id_modelo = ?
        `, [id_marca, nombre, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Modelo no encontrado' });
        }

        res.json({ message: 'Modelo actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar modelo:', error);
        res.status(500).json({ message: 'Error al actualizar modelo' });
    }
};

// Eliminar un modelo
const deleteModelo = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM modelos WHERE id_modelo = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Modelo no encontrado' });
        }

        res.json({ message: 'Modelo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar modelo:', error);
        res.status(500).json({ message: 'Error al eliminar modelo' });
    }
};

module.exports = {
    getAllModelos,
    getModeloById,
    createModelo,
    updateModelo,
    deleteModelo
}; 