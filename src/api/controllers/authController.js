const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const logger = require('../../utils/logger');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
const register = async (req, res) => {
    try {
        const { usuario, nombre, apellido, email, contrasena, telefono, direccion, rol = 'cliente' } = req.body;
        logger.info('Intento de registro', { email, usuario });

        // Validar que se proporcionen todos los campos requeridos
        if (!usuario || !nombre || !apellido || !email || !contrasena) {
            logger.warn('Intento de registro con campos faltantes');
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Verificar si el usuario o email ya existen
        const [existingUsers] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE usuario = ? OR email = ?', 
            [usuario, email]
        );
        
        if (existingUsers.length > 0) {
            logger.warn('Intento de registro con usuario o email existente', { usuario, email });
            return res.status(400).json({ message: 'El usuario o email ya están registrados' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Preparar campos opcionales
        const telefonoValue = telefono || null;
        const direccionValue = direccion || null;

        // Insertar el nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (usuario, contrasena, nombre, apellido, email, telefono, direccion, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [usuario, hashedPassword, nombre, apellido, email, telefonoValue, direccionValue, rol, 1]
        );

        logger.info('Usuario registrado exitosamente', { email, usuario });
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        logger.error('Error en registro', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// Función para iniciar sesión
const login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        console.log('Recibida petición de login:', { usuario });
        logger.info('Intento de login', { usuario });

        // Validar que se proporcionen los campos requeridos
        if (!usuario || !contrasena) {
            console.log('Campos faltantes:', { usuario: !!usuario, contrasena: !!contrasena });
            logger.warn('Intento de login sin credenciales completas');
            return res.status(400).json({ message: 'Por favor proporcione usuario y contraseña' });
        }

        // Buscar el usuario por nombre de usuario
        console.log('Buscando usuario en la base de datos...');
        const [users] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        console.log('Resultado de la búsqueda:', { encontrado: users.length > 0 });
        logger.info('Búsqueda de usuario', { usuario, encontrado: users.length > 0 });
        
        if (users.length === 0) {
            logger.warn('Usuario no encontrado', { usuario });
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];
        console.log('Usuario encontrado:', { id: user.id_usuario, rol: user.rol });

        // Verificar la contraseña
        console.log('Verificando contraseña...');
        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        console.log('Resultado de verificación:', { valida: validPassword });
        logger.info('Verificación de contraseña', { usuario, valida: validPassword });
        
        if (!validPassword) {
            logger.warn('Contraseña incorrecta', { usuario });
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        console.log('Generando token JWT...');
        const token = jwt.sign(
            { 
                id: user.id_usuario, 
                usuario: user.usuario,
                rol: user.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info('Login exitoso', { usuario, rol: user.rol });
        console.log('Login exitoso, enviando respuesta...');
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: user.usuario,
            rol: user.rol
        });
    } catch (error) {
        console.error('Error en login:', error);
        logger.error('Error en login', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

// Función para cerrar sesión
const logout = (req, res) => {
    try {
        // Para JWT, el logout se maneja principalmente en el cliente
        // Pero podemos registrar la acción y devolver una respuesta exitosa
        
        // Si se quiere implementar un sistema de tokens inválidos,
        // aquí se agregaría el token actual a una lista negra
        
        logger.info('Sesión cerrada exitosamente');
        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        logger.error('Error al cerrar sesión', { error: error.message });
        res.status(500).json({ message: 'Error al cerrar sesión' });
    }
};

// Función para obtener el perfil del usuario actual
const getProfile = (req, res) => {
    if (!req.session.user) {
        logger.warn('Intento de obtener perfil sin sesión');
        return res.status(401).json({ message: 'No autorizado' });
    }
    logger.info('Perfil obtenido exitosamente', { email: req.session.user.email });
    res.json(req.session.user);
};

module.exports = {
    register,
    login,
    logout,
    getProfile
}; 