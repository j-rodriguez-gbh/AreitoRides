const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Función para obtener la fecha y hora actual formateada
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
};

// Función para escribir en el archivo de log
const writeLog = (level, message, details = '') => {
    const logFile = path.join(logsDir, 'app.log');
    const timestamp = getCurrentDateTime();
    const logEntry = `[${timestamp}] [${level}] ${message} ${details ? `- ${details}` : ''}\n`;
    
    fs.appendFileSync(logFile, logEntry);
};

// Funciones de logging para diferentes niveles
const info = (message, details = '') => {
    writeLog('INFO', message, details);
};

const error = (message, details = '') => {
    writeLog('ERROR', message, details);
};

const warn = (message, details = '') => {
    writeLog('WARN', message, details);
};

const debug = (message, details = '') => {
    writeLog('DEBUG', message, details);
};

module.exports = {
    info,
    error,
    warn,
    debug
}; 