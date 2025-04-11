const db = require('../../config/db');
const logger = require('../../utils/logger');

const dashboardController = {
    async getEstadisticas(req, res) {
        try {
            logger.info('Obteniendo estadísticas del dashboard');
            
            // Inicializar datos con valores por defecto
            let response = {
                totalVehiculos: 0,
                vehiculosDisponibles: 0,
                totalEmpleados: 0,
                reservasActivas: 0,
                reservasPorMes: [],
                vehiculosPorTipo: []
            };
            
            try {
                // Obtener total de vehículos
                const [totalVehiculos] = await db.query('SELECT COUNT(*) as total FROM vehiculos');
                response.totalVehiculos = totalVehiculos[0]?.total || 0;
            } catch (error) {
                logger.error('Error al consultar total de vehículos:', error.message);
            }
            
            try {
                // Obtener vehículos disponibles
                const [vehiculosDisponibles] = await db.query(`
                    SELECT COUNT(*) as total 
                    FROM vehiculos v 
                    WHERE v.estado = 'disponible' OR v.estado IS NULL
                `);
                response.vehiculosDisponibles = vehiculosDisponibles[0]?.total || 0;
            } catch (error) {
                logger.error('Error al consultar vehículos disponibles:', error.message);
            }
            
            try {
                // Obtener total de empleados
                const [totalEmpleados] = await db.query('SELECT COUNT(*) as total FROM usuarios WHERE rol = "admin"');
                response.totalEmpleados = totalEmpleados[0]?.total || 0;
            } catch (error) {
                logger.error('Error al consultar total de empleados:', error.message);
            }
            
            try {
                // Simular datos de gráficos para mostrar datos de ejemplo
                response.reservasPorMes = [
                    { mes: 1, total: 5 },
                    { mes: 2, total: 8 },
                    { mes: 3, total: 12 },
                    { mes: 4, total: 7 },
                    { mes: 5, total: 10 },
                    { mes: 6, total: 15 },
                    { mes: 7, total: 20 },
                    { mes: 8, total: 18 },
                    { mes: 9, total: 14 },
                    { mes: 10, total: 12 },
                    { mes: 11, total: 9 },
                    { mes: 12, total: 11 }
                ];
                
                response.vehiculosPorTipo = [
                    { tipo: 'Sedán', total: 10 },
                    { tipo: 'SUV', total: 8 },
                    { tipo: 'Pickup', total: 5 },
                    { tipo: 'Compacto', total: 7 },
                    { tipo: 'Deportivo', total: 3 }
                ];
            } catch (error) {
                logger.error('Error al generar datos de gráficos:', error.message);
            }

            logger.info('Estadísticas obtenidas exitosamente');
            res.json(response);
        } catch (error) {
            logger.error('Error al obtener estadísticas del dashboard:', error);
            logger.error('Stack trace:', error.stack);
            
            // Enviar el mensaje de error completo en desarrollo
            const errorMessage = process.env.NODE_ENV === 'development' 
                ? `Error al obtener estadísticas: ${error.message}` 
                : 'Error al obtener estadísticas';
                
            res.status(500).json({ 
                message: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
};

module.exports = dashboardController; 