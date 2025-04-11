const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: "Se requiere un token para autenticación" });
  }
  
  try {
    // Eliminar 'Bearer ' del token si existe
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'No autorizado' });
    }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado' });
    }
};

// Middleware para verificar si el usuario es empleado
const isEmployee = (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'empleado') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado' });
    }
};

module.exports = {
    verifyToken,
    isAuthenticated,
    isAdmin,
    isEmployee
}; 