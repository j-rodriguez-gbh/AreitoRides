const pool = require('../../config/db');
const logger = require('../../utils/logger');

// Obtener todos los vehículos
const getAllVehiculos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.id, v.anio, v.estado, v.precio_dia, v.activo,
                   v.no_chasis, v.no_motor, v.no_placa,
                   m.nombre as marca_nombre, mo.nombre as modelo_nombre, 
                   tv.nombre as tipo_vehiculo_nombre, tc.nombre as tipo_combustible_nombre
            FROM vehiculos v
            LEFT JOIN marcas m ON v.id_marca = m.id_marca
            LEFT JOIN modelos mo ON v.id_modelo = mo.id_modelo
            LEFT JOIN tipo_vehiculo tv ON v.id_tipoVehiculo = tv.id_tipo_vehiculo
            LEFT JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id_tipo_combustible
            WHERE v.activo = TRUE
        `);
        logger.info('Vehículos obtenidos exitosamente', `Total: ${rows.length}`);
        res.json(rows);
    } catch (error) {
        logger.error('Error al obtener vehículos', error.message);
        res.status(500).json({ message: 'Error al obtener vehículos' });
    }
};

// Obtener un vehículo por ID
const getVehiculoById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.*, m.nombre as marca_nombre, mo.nombre as modelo_nombre, 
                   tv.nombre as tipo_vehiculo_nombre, tc.nombre as tipo_combustible_nombre,
                   dv.kilometraje, dv.ultimo_mantenimiento, dv.fecha_compra, dv.valor_compra
            FROM vehiculos v
            LEFT JOIN marcas m ON v.id_marca = m.id_marca
            LEFT JOIN modelos mo ON v.id_modelo = mo.id_modelo
            LEFT JOIN tipo_vehiculo tv ON v.id_tipoVehiculo = tv.id_tipo_vehiculo
            LEFT JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id_tipo_combustible
            LEFT JOIN detalles_vehiculo dv ON v.id = dv.id_vehiculo
            WHERE v.id = ? AND v.activo = TRUE
        `, [req.params.id]);

        if (rows.length === 0) {
            logger.warn('Vehículo no encontrado', `ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        logger.info('Vehículo obtenido exitosamente', `ID: ${req.params.id}`);
        res.json(rows[0]);
    } catch (error) {
        logger.error('Error al obtener vehículo', `ID: ${req.params.id}, Error: ${error.message}`);
        res.status(500).json({ message: 'Error al obtener vehículo' });
    }
};

// Crear un nuevo vehículo
const createVehiculo = async (req, res) => {
    try {
        const { 
            id_marca, 
            id_modelo, 
            id_tipoVehiculo, 
            id_tipo_combustible,
            no_placa,
            no_chasis,
            no_motor,
            anio,
            precio_dia,
            estado 
        } = req.body;

        // Validaciones básicas
        if (!id_marca || !id_modelo || !id_tipoVehiculo || !id_tipo_combustible || !precio_dia) {
            logger.warn('Intento de crear vehículo con campos faltantes', JSON.stringify(req.body));
            return res.status(400).json({ 
                message: 'Los campos marca, modelo, tipo de vehículo, tipo de combustible y precio son requeridos' 
            });
        }

        // Verificar si la placa ya existe
        if (no_placa) {
            const [placaExists] = await pool.query(
                'SELECT id FROM vehiculos WHERE no_placa = ?',
                [no_placa]
            );

            if (placaExists.length > 0) {
                logger.warn('Intento de crear vehículo con placa duplicada', `Placa: ${no_placa}`);
                return res.status(400).json({ 
                    message: 'Ya existe un vehículo con esta placa' 
                });
            }
        }

        // Verificar si el número de chasis ya existe
        if (no_chasis) {
            const [chasisExists] = await pool.query(
                'SELECT id FROM vehiculos WHERE no_chasis = ?',
                [no_chasis]
            );

            if (chasisExists.length > 0) {
                logger.warn('Intento de crear vehículo con número de chasis duplicado', `Chasis: ${no_chasis}`);
                return res.status(400).json({ 
                    message: 'Ya existe un vehículo con este número de chasis' 
                });
            }
        }

        const [result] = await pool.query(`
            INSERT INTO vehiculos (
                id_marca, id_modelo, id_tipoVehiculo, id_tipo_combustible,
                no_placa, no_chasis, no_motor, anio, precio_dia, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_marca, id_modelo, id_tipoVehiculo, id_tipo_combustible,
            no_placa || null, no_chasis || null, no_motor || null, 
            anio || new Date().getFullYear(), precio_dia, estado || 'disponible'
        ]);

        logger.info('Vehículo creado exitosamente', `ID: ${result.insertId}`);
        res.status(201).json({
            id: result.insertId,
            message: 'Vehículo creado exitosamente'
        });
    } catch (error) {
        logger.error('Error al crear vehículo', error.message);
        res.status(500).json({ message: 'Error al crear vehículo' });
    }
};

// Actualizar un vehículo
const updateVehiculo = async (req, res) => {
    try {
        const { 
            id_marca, 
            id_modelo, 
            id_tipoVehiculo, 
            id_tipo_combustible,
            no_placa,
            no_chasis,
            no_motor,
            anio,
            precio_dia,
            estado 
        } = req.body;

        // Validaciones básicas
        if (!id_marca || !id_modelo || !id_tipoVehiculo || !id_tipo_combustible || !precio_dia) {
            logger.warn('Intento de actualizar vehículo con campos faltantes', `ID: ${req.params.id}, Body: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ 
                message: 'Los campos marca, modelo, tipo de vehículo, tipo de combustible y precio son requeridos' 
            });
        }

        // Verificar si la placa ya existe en otro vehículo
        if (no_placa) {
            const [placaExists] = await pool.query(
                'SELECT id FROM vehiculos WHERE no_placa = ? AND id != ?',
                [no_placa, req.params.id]
            );

            if (placaExists.length > 0) {
                logger.warn('Intento de actualizar vehículo con placa duplicada', `ID: ${req.params.id}, Placa: ${no_placa}`);
                return res.status(400).json({ 
                    message: 'Ya existe otro vehículo con esta placa' 
                });
            }
        }

        // Verificar si el número de chasis ya existe en otro vehículo
        if (no_chasis) {
            const [chasisExists] = await pool.query(
                'SELECT id FROM vehiculos WHERE no_chasis = ? AND id != ?',
                [no_chasis, req.params.id]
            );

            if (chasisExists.length > 0) {
                logger.warn('Intento de actualizar vehículo con número de chasis duplicado', `ID: ${req.params.id}, Chasis: ${no_chasis}`);
                return res.status(400).json({ 
                    message: 'Ya existe otro vehículo con este número de chasis' 
                });
            }
        }

        const [result] = await pool.query(`
            UPDATE vehiculos 
            SET id_marca = ?, id_modelo = ?, id_tipoVehiculo = ?, 
                id_tipo_combustible = ?, no_placa = ?, no_chasis = ?, 
                no_motor = ?, anio = ?, precio_dia = ?, estado = ?
            WHERE id = ?
        `, [
            id_marca, id_modelo, id_tipoVehiculo, id_tipo_combustible,
            no_placa, no_chasis, no_motor, anio, precio_dia, estado,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            logger.warn('Intento de actualizar vehículo inexistente', `ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        logger.info('Vehículo actualizado exitosamente', `ID: ${req.params.id}`);
        res.json({ message: 'Vehículo actualizado exitosamente' });
    } catch (error) {
        logger.error('Error al actualizar vehículo', `ID: ${req.params.id}, Error: ${error.message}`);
        res.status(500).json({ message: 'Error al actualizar vehículo' });
    }
};

// Eliminar un vehículo
const deleteVehiculo = async (req, res) => {
    try {
        // Verificar si el vehículo tiene alquileres asociados
        const [rentasAsociadas] = await pool.query(
            'SELECT COUNT(*) as count FROM alquileres WHERE id_vehiculo = ?',
            [req.params.id]
        );

        if (rentasAsociadas[0].count > 0) {
            logger.warn('Intento de eliminar vehículo con alquileres asociados', `ID: ${req.params.id}`);
            return res.status(400).json({ 
                message: 'No se puede eliminar el vehículo porque tiene alquileres asociados' 
            });
        }

        const [result] = await pool.query(
            'DELETE FROM vehiculos WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            logger.warn('Intento de eliminar vehículo inexistente', `ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        logger.info('Vehículo eliminado exitosamente', `ID: ${req.params.id}`);
        res.json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        logger.error('Error al eliminar vehículo', `ID: ${req.params.id}, Error: ${error.message}`);
        res.status(500).json({ message: 'Error al eliminar vehículo' });
    }
};

module.exports = {
    getAllVehiculos,
    getVehiculoById,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
}; 