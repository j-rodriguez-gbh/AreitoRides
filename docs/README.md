# API REST para Areito Rides

API REST para el sistema de gestión de vehículos Areito Rides, desarrollada con Node.js, Express y MySQL.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm (v6 o superior)

## Instalación

1. Clona este repositorio:
   ```
   git clone <url-del-repositorio>
   cd areito-api
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Edita el archivo `.env` con tus credenciales de base de datos

4. Asegúrate de que la base de datos esté configurada:
   - Ejecuta el script SQL `bdd_inicial.sql` en tu servidor MySQL

## Ejecución

### Modo Producción
```
npm start
```

### Modo Desarrollo
```
npm run dev
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario actual

### Marcas
- `GET /api/marcas` - Obtener todas las marcas
- `GET /api/marcas/:id` - Obtener una marca por ID
- `POST /api/marcas` - Crear una nueva marca (solo administradores)
- `PUT /api/marcas/:id` - Actualizar una marca (solo administradores)
- `DELETE /api/marcas/:id` - Eliminar una marca (solo administradores)

### Modelos
- `GET /api/modelos` - Obtener todos los modelos
- `GET /api/modelos/:id` - Obtener un modelo por ID
- `POST /api/modelos` - Crear un nuevo modelo (solo administradores)
- `PUT /api/modelos/:id` - Actualizar un modelo (solo administradores)
- `DELETE /api/modelos/:id` - Eliminar un modelo (solo administradores)

### Tipos de Vehículos
- `GET /api/tipos-vehiculos` - Obtener todos los tipos de vehículos
- `GET /api/tipos-vehiculos/:id` - Obtener un tipo de vehículo por ID
- `POST /api/tipos-vehiculos` - Crear un nuevo tipo de vehículo (solo administradores)
- `PUT /api/tipos-vehiculos/:id` - Actualizar un tipo de vehículo (solo administradores)
- `DELETE /api/tipos-vehiculos/:id` - Eliminar un tipo de vehículo (solo administradores)

### Tipos de Combustible
- `GET /api/tipos-combustible` - Obtener todos los tipos de combustible
- `GET /api/tipos-combustible/:id` - Obtener un tipo de combustible por ID
- `POST /api/tipos-combustible` - Crear un nuevo tipo de combustible (solo administradores)
- `PUT /api/tipos-combustible/:id` - Actualizar un tipo de combustible (solo administradores)
- `DELETE /api/tipos-combustible/:id` - Eliminar un tipo de combustible (solo administradores)

### Vehículos
- `GET /api/vehiculos` - Obtener todos los vehículos
- `GET /api/vehiculos/:id` - Obtener un vehículo por ID
- `POST /api/vehiculos` - Crear un nuevo vehículo (solo administradores)
- `PUT /api/vehiculos/:id` - Actualizar un vehículo (solo administradores)
- `DELETE /api/vehiculos/:id` - Eliminar un vehículo (solo administradores)

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente por ID
- `POST /api/clientes` - Crear un nuevo cliente (solo administradores)
- `PUT /api/clientes/:id` - Actualizar un cliente (solo administradores)
- `DELETE /api/clientes/:id` - Eliminar un cliente (solo administradores)

## Estructura del Proyecto

```
areito-api/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── marcasController.js
│   ├── modelosController.js
│   ├── tiposVehiculosController.js
│   ├── tiposCombustibleController.js
│   ├── vehiculosController.js
│   └── clientesController.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── marcas.js
│   ├── modelos.js
│   ├── tiposVehiculos.js
│   ├── tiposCombustible.js
│   ├── vehiculos.js
│   └── clientes.js
├── .env
├── package.json
├── README.md
└── server.js
```

## Próximos Pasos

- Implementar validación de datos con Joi o express-validator
- Implementar un sistema de logs
- Añadir documentación con Swagger
- Implementar pruebas unitarias y de integración