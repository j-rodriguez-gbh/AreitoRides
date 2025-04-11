// API endpoints
const API_URL = 'http://localhost:5001/api';

// Clase para manejar las llamadas a la API
class Api {
    constructor() {
        this.baseUrl = API_URL;
        console.log('API URL:', this.baseUrl);
        
        // Inicializar submódulos
        this.auth = {
            login: this.login.bind(this),
            register: this.register.bind(this),
            logout: this.logout.bind(this),
            isAuthenticated: this.isAuthenticated.bind(this),
            getToken: this.getToken.bind(this),
            getCurrentUser: this.getCurrentUser.bind(this)
        };
        
        this.vehiculos = {
            getAll: this.getVehicles.bind(this),
            getById: this.getVehicleById.bind(this),
            create: this.createVehicle.bind(this),
            update: this.updateVehicle.bind(this),
            delete: this.deleteVehicle.bind(this)
        };
        
        this.marcas = {
            getAll: async () => {
                console.log('Calling marcas.getAll()');
                try {
                    // First try with /api/marcas
                    try {
                        const response = await this.getGenericResource('marcas');
                        console.log('Got marcas response:', response);
                        return response;
                    } catch (firstError) {
                        console.log('Failed to fetch from /api/marcas, trying fallback');
                        // Fallback to mock data if the endpoint is not available
                        return [
                            { id_marca: 1, nombre: 'Toyota' },
                            { id_marca: 2, nombre: 'Honda' },
                            { id_marca: 3, nombre: 'Ford' },
                            { id_marca: 4, nombre: 'Chevrolet' },
                            { id_marca: 5, nombre: 'Nissan' },
                            { id_marca: 6, nombre: 'Volkswagen' },
                            { id_marca: 7, nombre: 'BMW' },
                            { id_marca: 8, nombre: 'Mercedes-Benz' },
                            { id_marca: 9, nombre: 'Hyundai' },
                            { id_marca: 10, nombre: 'Kia' }
                        ];
                    }
                } catch (error) {
                    console.error('Error in marcas.getAll():', error);
                    throw error;
                }
            },
            getById: async (id) => this.getGenericResourceById('marcas', id),
            create: async (data) => this.createGenericResource('marcas', data),
            update: async (id, data) => this.updateGenericResource('marcas', id, data),
            delete: async (id) => this.deleteGenericResource('marcas', id)
        };
        
        this.modelos = {
            getAll: async () => {
                try {
                    try {
                        return await this.getGenericResource('modelos');
                    } catch (firstError) {
                        console.log('Failed to fetch from /api/modelos, trying fallback');
                        return [
                            { id_modelo: 1, nombre: 'Corolla', id_marca: 1 },
                            { id_modelo: 2, nombre: 'Civic', id_marca: 2 },
                            { id_modelo: 3, nombre: 'Mustang', id_marca: 3 },
                            { id_modelo: 4, nombre: 'Camaro', id_marca: 4 },
                            { id_modelo: 5, nombre: 'Altima', id_marca: 5 }
                        ];
                    }
                } catch (error) {
                    console.error('Error in modelos.getAll():', error);
                    throw error;
                }
            },
            getById: async (id) => this.getGenericResourceById('modelos', id),
            create: async (data) => this.createGenericResource('modelos', data),
            update: async (id, data) => this.updateGenericResource('modelos', id, data),
            delete: async (id) => this.deleteGenericResource('modelos', id)
        };
        
        this.tiposVehiculos = {
            getAll: async () => {
                try {
                    try {
                        const response = await this.getGenericResource('tipovehiculo');
                        console.log('Raw tipo_vehiculo response:', response);
                        
                        // Map the response to a consistent format
                        return response.map(tipo => ({
                            id: tipo.id_tipo_vehiculo || tipo.id,
                            id_tipo_vehiculo: tipo.id_tipo_vehiculo || tipo.id,
                            nombre: tipo.nombre || tipo.descripcion,
                            estado: tipo.estado || (tipo.activo ? 'activo' : 'inactivo')
                        }));
                    } catch (firstError) {
                        console.log('Failed to fetch from /api/tipovehiculo, trying fallback');
                        return [
                            { id: 1, id_tipo_vehiculo: 1, nombre: 'Sedán', estado: 'activo' },
                            { id: 2, id_tipo_vehiculo: 2, nombre: 'SUV', estado: 'activo' },
                            { id: 3, id_tipo_vehiculo: 3, nombre: 'Pickup', estado: 'activo' },
                            { id: 4, id_tipo_vehiculo: 4, nombre: 'Compacto', estado: 'activo' },
                            { id: 5, id_tipo_vehiculo: 5, nombre: 'Deportivo', estado: 'activo' }
                        ];
                    }
                } catch (error) {
                    console.error('Error in tiposVehiculos.getAll():', error);
                    throw error;
                }
            },
            getById: async (id) => this.getGenericResourceById('tipovehiculo', id),
            create: async (data) => this.createGenericResource('tipovehiculo', data),
            update: async (id, data) => this.updateGenericResource('tipovehiculo', id, data),
            delete: async (id) => this.deleteGenericResource('tipovehiculo', id)
        };
        
        this.tiposCombustible = {
            getAll: async () => {
                try {
                    try {
                        const response = await this.getGenericResource('tiposcombustible');
                        console.log('Raw tipo_combustible response:', response);
                        
                        // Map the response to a consistent format
                        return response.map(tipo => ({
                            id: tipo.id_tipo_combustible || tipo.id,
                            id_tipo_combustible: tipo.id_tipo_combustible || tipo.id,
                            nombre: tipo.nombre || tipo.descripcion,
                            estado: tipo.estado || (tipo.activo ? 'activo' : 'inactivo')
                        }));
                    } catch (firstError) {
                        console.log('Failed to fetch from /api/tiposcombustible, trying fallback');
                        return [
                            { id: 1, id_tipo_combustible: 1, nombre: 'Gasolina', estado: 'activo' },
                            { id: 2, id_tipo_combustible: 2, nombre: 'Diesel', estado: 'activo' },
                            { id: 3, id_tipo_combustible: 3, nombre: 'Eléctrico', estado: 'activo' },
                            { id: 4, id_tipo_combustible: 4, nombre: 'Híbrido', estado: 'activo' },
                            { id: 5, id_tipo_combustible: 5, nombre: 'Gas Natural', estado: 'activo' }
                        ];
                    }
                } catch (error) {
                    console.error('Error in tiposCombustible.getAll():', error);
                    throw error;
                }
            },
            getById: async (id) => this.getGenericResourceById('tiposcombustible', id),
            create: async (data) => this.createGenericResource('tiposcombustible', data),
            update: async (id, data) => this.updateGenericResource('tiposcombustible', id, data),
            delete: async (id) => this.deleteGenericResource('tiposcombustible', id)
        };
        
        this.empleados = {
            getAll: async () => this.getGenericResource('empleados'),
            getById: async (id) => this.getGenericResourceById('empleados', id),
            create: async (data) => this.createGenericResource('empleados', data),
            update: async (id, data) => this.updateGenericResource('empleados', id, data),
            delete: async (id) => this.deleteGenericResource('empleados', id)
        };
        
        this.clientes = {
            getAll: async () => this.getGenericResource('clientes'),
            getById: async (id) => this.getGenericResourceById('clientes', id),
            create: async (data) => this.createGenericResource('clientes', data),
            update: async (id, data) => this.updateGenericResource('clientes', id, data),
            delete: async (id) => this.deleteGenericResource('clientes', id)
        };
        
        this.alquileres = {
            getAll: this.getRentals.bind(this),
            create: this.createRental.bind(this)
        };
    }

    // Métodos genéricos para recursos
    async getGenericResource(resource) {
        try {
            const response = await fetch(`${this.baseUrl}/${resource}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al obtener ${resource}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${resource}:`, error);
            throw error;
        }
    }
    
    async getGenericResourceById(resource, id) {
        try {
            const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al obtener ${resource} con id ${id}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${resource}:`, error);
            throw error;
        }
    }
    
    async createGenericResource(resource, data) {
        try {
            const response = await fetch(`${this.baseUrl}/${resource}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al crear ${resource}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${resource}:`, error);
            throw error;
        }
    }
    
    async updateGenericResource(resource, id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al actualizar ${resource}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${resource}:`, error);
            throw error;
        }
    }
    
    async deleteGenericResource(resource, id) {
        try {
            const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al eliminar ${resource}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${resource}:`, error);
            throw error;
        }
    }

    // Métodos de autenticación
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    usuario: username, 
                    contrasena: password 
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Credenciales inválidas');
            }

            // Guardar el token y la información del usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                username: data.usuario || data.username,
                role: data.rol || data.role
            }));

            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            // Ensure all fields are defined and not empty strings
            if (!userData.usuario || !userData.nombre || !userData.apellido || 
                !userData.email || !userData.password) {
                throw new Error('Todos los campos obligatorios son requeridos');
            }
            
            // Create the request data with all required fields
            const requestData = {
                usuario: userData.usuario,
                nombre: userData.nombre,
                apellido: userData.apellido,
                email: userData.email,
                contrasena: userData.password,
                rol: 'cliente'
            };
            
            // Only add optional fields if they have values
            if (userData.telefono && userData.telefono.trim() !== '') {
                requestData.telefono = userData.telefono;
            }
            
            if (userData.direccion && userData.direccion.trim() !== '') {
                requestData.direccion = userData.direccion;
            }
            
            console.log('Datos de registro a enviar:', requestData);

            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            if (!response.ok) {
                // Log more detailed error information
                console.error('Error de registro - Status:', response.status);
                console.error('Error de registro - Detalles:', data);
                
                // Throw a more descriptive error
                throw new Error(data.message || `Error en el registro: ${response.status} - ${data.error || 'Error desconocido'}`);
            }

            return data;
        } catch (error) {
            console.error('Error completo en registro:', error);
            // If it's our error with message, throw it as is
            if (error.message) {
                throw error;
            }
            // For network or other errors, throw a generic message
            throw new Error('Error de conexión al servidor. Por favor, intente nuevamente.');
        }
    }

    async logout() {
        try {
            // First call the server endpoint
            const response = await fetch(`${this.baseUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            // Log the result
            const data = await response.json();
            console.log('Logout response:', data);
            
            // Always clear local storage, even if server request fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            return data;
        } catch (error) {
            console.error('Error durante logout:', error);
            // Still clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // User management methods
    async getUser(userId) {
        try {
            // First try to get from session if already logged in
            const currentUser = this.getCurrentUser();
            if (currentUser && !userId) {
                userId = currentUser.id;
            }
            
            if (!userId) {
                throw new Error('ID de usuario no proporcionado');
            }
            
            const response = await fetch(`${this.baseUrl}/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            throw error;
        }
    }
    
    async updateUser(userId, userData) {
        try {
            // Use current user if no ID provided
            const currentUser = this.getCurrentUser();
            if (currentUser && !userId) {
                userId = currentUser.id;
            }
            
            if (!userId) {
                throw new Error('ID de usuario no proporcionado');
            }
            
            const response = await fetch(`${this.baseUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el perfil');
            }
            
            // Update local storage with new user data if it's the current user
            if (currentUser && userId === currentUser.id) {
                const updatedUser = {
                    ...currentUser,
                    ...userData
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar perfil de usuario:', error);
            throw error;
        }
    }

    // Métodos para vehículos
    async getVehicles() {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos`);
            if (!response.ok) {
                throw new Error('Error al obtener vehículos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }

    async getVehicleById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el vehículo');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener el vehículo:', error);
            throw error;
        }
    }

    // Métodos para alquileres
    async createRental(rentalData) {
        try {
            const response = await fetch(`${this.baseUrl}/alquileres`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(rentalData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el alquiler');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al crear alquiler:', error);
            throw error;
        }
    }

    async getRentals() {
        try {
            const response = await fetch(`${this.baseUrl}/alquileres`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los alquileres');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener alquileres:', error);
            throw error;
        }
    }

    // Métodos para vehículos
    async createVehicle(data) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al crear el vehículo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al crear vehículo:', error);
            throw error;
        }
    }
    
    async updateVehicle(id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el vehículo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            throw error;
        }
    }
    
    async deleteVehicle(id) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el vehículo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            throw error;
        }
    }
}

// Crear y exportar una instancia única de la API
export const api = new Api();

// Exportar funciones globales necesarias para el DOM
window.api = api; // Esto permite acceder a la API desde los event handlers en el HTML 