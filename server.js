const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const dotenv = require('dotenv');
const db = require('./src/config/db');
const jwt = require('jsonwebtoken');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./src/api/routes/auth');
const vehiculosRoutes = require('./src/api/routes/vehiculos');
const marcasRoutes = require('./src/api/routes/marcas');
const modelosRoutes = require('./src/api/routes/modelos');
const tiposVehiculosRoutes = require('./src/api/routes/tiposVehiculos');
const tiposCombustibleRoutes = require('./src/api/routes/tiposCombustible');
const empleadosRoutes = require('./src/api/routes/empleados');
const clientesRoutes = require('./src/api/routes/clientes');
const adminRoutes = require('./src/api/routes/admin');
const dashboardRoutes = require('./src/api/routes/dashboard');

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 5001;

// Configuración de la sesión MySQL
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5001', 'http://127.0.0.1:5001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/views', express.static(path.join(__dirname, 'public/views')));
app.use('/css', express.static(path.join(__dirname, 'public/views/front/css')));
app.use('/js', express.static(path.join(__dirname, 'public/views/front/js')));
app.use('/img', express.static(path.join(__dirname, 'public/assets/img')));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'lax'
    }
}));

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Middleware de administrador
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
    }
};

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculosRoutes);

// Rutas protegidas
app.use('/api/marcas', authMiddleware, marcasRoutes);
app.use('/api/modelos', authMiddleware, modelosRoutes);
app.use('/api/tipovehiculo', authMiddleware, tiposVehiculosRoutes);
app.use('/api/tiposcombustible', authMiddleware, tiposCombustibleRoutes);
app.use('/api/empleados', authMiddleware, empleadosRoutes);
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Rutas de administrador
app.use('/api/admin', adminMiddleware, adminRoutes);

// Rutas para páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/front/index.html'));
});

app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/front/catalogo.html'));
});

app.get('/reservas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/front/reservas.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/front/contacto.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/auth/login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/auth/registro.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/front/perfil.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/index.html'));
});

// Rutas para páginas de administración
app.get('/admin/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_clientes.html'));
});

app.get('/admin/tipos-vehiculos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_tipos_vehiculos.html'));
});

app.get('/admin/modelos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_modelos.html'));
});

app.get('/admin/empleados', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_empleados.html'));
});

app.get('/admin/combustible', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_combustible.html'));
});

app.get('/admin/vehiculos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_vehiculos.html'));
});

app.get('/admin/marcas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/admin/gestion_marcas.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 