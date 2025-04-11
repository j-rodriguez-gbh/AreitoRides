// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Client
const api = {
    // Authentication
    auth: {
        login: async (credentials) => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Error de autenticación');
                }
                
                const data = await response.json();
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
        },
        
        logout: async () => {
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return { success: true };
            } catch (error) {
                console.error('Error en logout:', error);
                throw error;
            }
        },
        
        getToken: () => localStorage.getItem('token'),
        
        isAuthenticated: () => !!localStorage.getItem('token'),
        
        getCurrentUser: () => {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
    },

    // Generic request function with error handling
    request: async (endpoint, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            console.log(`Fetching from: ${API_BASE_URL}${endpoint}`);
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                    throw new Error('Sesión expirada');
                }
                
                // Try to get error message from response
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // If we can't parse the error, use the default message
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error en request (${endpoint}):`, error);
            throw error;
        }
    },

    // Fallback data for when API is unavailable
    fallbackData: {
        marcas: [
            { id: 1, nombre: 'Toyota', estado: 'activo' },
            { id: 2, nombre: 'Honda', estado: 'activo' },
            { id: 3, nombre: 'Ford', estado: 'activo' },
            { id: 4, nombre: 'BMW', estado: 'activo' },
            { id: 5, nombre: 'Nissan', estado: 'activo' }
        ],
        modelos: [
            { id: 1, nombre: 'Corolla', id_marca: 1, estado: 'activo' },
            { id: 2, nombre: 'Civic', id_marca: 2, estado: 'activo' },
            { id: 3, nombre: 'Mustang', id_marca: 3, estado: 'activo' },
            { id: 4, nombre: '3 Series', id_marca: 4, estado: 'activo' },
            { id: 5, nombre: 'Altima', id_marca: 5, estado: 'activo' }
        ],
        tiposVehiculos: [
            { id: 1, nombre: 'Sedán', estado: 'activo' },
            { id: 2, nombre: 'SUV', estado: 'activo' },
            { id: 3, nombre: 'Pickup', estado: 'activo' },
            { id: 4, nombre: 'Deportivo', estado: 'activo' },
            { id: 5, nombre: 'Compacto', estado: 'activo' }
        ],
        combustibles: [
            { id: 1, nombre: 'Gasolina', estado: 'activo' },
            { id: 2, nombre: 'Diesel', estado: 'activo' },
            { id: 3, nombre: 'Eléctrico', estado: 'activo' },
            { id: 4, nombre: 'Híbrido', estado: 'activo' },
            { id: 5, nombre: 'Gas Natural', estado: 'activo' }
        ],
        vehiculos: [
            { 
                id: 1,
                id_marca: 4,
                id_modelo: 4,
                id_tipo: 4,
                id_combustible: 2,
                anio: 2023,
                chasis: 'TC12345678901234',
                motor: 'TM123456789',
                placa: 'ABC123',
                estado: 'disponible',
                precio_dia: 3500,
                
                // Pre-resolved names for easier display
                marca_nombre: 'BMW',
                modelo_nombre: '3 Series',
                tipo_nombre: 'Deportivo',
                combustible_nombre: 'Diesel'
            },
            { 
                id: 2,
                id_marca: 1,
                id_modelo: 1,
                id_tipo: 1,
                id_combustible: 1,
                anio: 2023,
                chasis: 'TC23456789012345',
                motor: 'TM234567890',
                placa: 'DEF456',
                estado: 'disponible',
                precio_dia: 2800,
                
                // Pre-resolved names
                marca_nombre: 'Toyota',
                modelo_nombre: 'Corolla',
                tipo_nombre: 'Sedán',
                combustible_nombre: 'Gasolina'
            }
        ]
    },

    // Specific API endpoints with fallback support
    marcas: {
        getAll: async () => {
            try {
                return await api.request('/marcas');
            } catch (error) {
                console.log('Usando datos de respaldo para marcas');
                return api.fallbackData.marcas;
            }
        },
        create: async (data) => api.request('/marcas', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: async (id, data) => api.request(`/marcas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: async (id) => api.request(`/marcas/${id}`, {
            method: 'DELETE'
        })
    },

    modelos: {
        getAll: async () => {
            try {
                return await api.request('/modelos');
            } catch (error) {
                console.log('Usando datos de respaldo para modelos');
                return api.fallbackData.modelos;
            }
        },
        create: async (data) => api.request('/modelos', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: async (id, data) => api.request(`/modelos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: async (id) => api.request(`/modelos/${id}`, {
            method: 'DELETE'
        })
    },

    tiposVehiculos: {
        getAll: async () => {
            try {
                return await api.request('/tipos-vehiculos');
            } catch (error) {
                console.log('Usando datos de respaldo para tipos de vehículos');
                return api.fallbackData.tiposVehiculos;
            }
        },
        create: async (data) => api.request('/tipos-vehiculos', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: async (id, data) => api.request(`/tipos-vehiculos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: async (id) => api.request(`/tipos-vehiculos/${id}`, {
            method: 'DELETE'
        })
    },

    // We support both naming conventions
    tiposCombustible: {
        getAll: async () => {
            try {
                return await api.request('/combustibles');
            } catch (error) {
                console.log('Usando datos de respaldo para combustibles');
                return api.fallbackData.combustibles;
            }
        },
        create: async (data) => api.request('/combustibles', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: async (id, data) => api.request(`/combustibles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: async (id) => api.request(`/combustibles/${id}`, {
            method: 'DELETE'
        })
    },

    // Also support the original name for backwards compatibility
    combustibles: {
        getAll: async () => api.tiposCombustible.getAll(),
        create: async (data) => api.tiposCombustible.create(data),
        update: async (id, data) => api.tiposCombustible.update(id, data),
        delete: async (id) => api.tiposCombustible.delete(id)
    },

    vehiculos: {
        getAll: async () => {
            try {
                const vehicles = await api.request('/vehiculos');
                
                // Try to pre-resolve names for display if they're not already included
                if (vehicles && vehicles.length > 0 && !vehicles[0].marca_nombre) {
                    console.log('Resolviendo nombres de marcas, modelos, tipos y combustibles...');
                    
                    // Load reference data in parallel
                    const [marcas, modelos, tipos, combustibles] = await Promise.all([
                        api.marcas.getAll(),
                        api.modelos.getAll(),
                        api.tiposVehiculos.getAll(),
                        api.tiposCombustible.getAll()
                    ]);
                    
                    // Add display names to each vehicle
                    return vehicles.map(vehicle => {
                        const marca = marcas.find(m => m.id == vehicle.id_marca || m.id == vehicle.marca_id);
                        const modelo = modelos.find(m => m.id == vehicle.id_modelo || m.id == vehicle.modelo_id);
                        const tipo = tipos.find(t => t.id == vehicle.id_tipo || t.id == vehicle.id_tipoVehiculo || t.id == vehicle.tipo_id);
                        const combustible = combustibles.find(c => c.id == vehicle.id_combustible || c.id == vehicle.id_tipo_combustible || c.id == vehicle.combustible_id);
                        
                        return {
                            ...vehicle,
                            marca_nombre: marca ? marca.nombre : 'Desconocida',
                            modelo_nombre: modelo ? modelo.nombre : 'Desconocido',
                            tipo_nombre: tipo ? tipo.nombre : 'Desconocido',
                            combustible_nombre: combustible ? combustible.nombre : 'Desconocido'
                        };
                    });
                }
                
                return vehicles;
            } catch (error) {
                console.log('Usando datos de respaldo para vehículos');
                return api.fallbackData.vehiculos;
            }
        },
        getById: async (id) => {
            try {
                return await api.request(`/vehiculos/${id}`);
            } catch (error) {
                // Try to find in fallback data
                const vehicle = api.fallbackData.vehiculos.find(v => v.id == id);
                if (vehicle) return vehicle;
                throw error;
            }
        },
        create: async (data) => api.request('/vehiculos', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: async (id, data) => api.request(`/vehiculos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: async (id) => api.request(`/vehiculos/${id}`, {
            method: 'DELETE'
        }),
        getDisponibles: async () => {
            try {
                return await api.request('/vehiculos/disponibles');
            } catch (error) {
                // Return available vehicles from fallback data
                return api.fallbackData.vehiculos.filter(v => v.estado === 'disponible');
            }
        },
        cambiarEstado: async (id, estado) => api.request(`/vehiculos/${id}/estado`, {
            method: 'PUT',
            body: JSON.stringify({ estado })
        })
    }
};

// Error Handler with toast notifications
const handleError = (error, resource) => {
    console.error(`Error en ${resource}:`, error);
    
    // Create and show a toast notification
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.innerHTML = `
        <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>Error:</strong> ${error.message || 'Ha ocurrido un error desconocido'}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Use Bootstrap toast if available, otherwise set a timeout
    if (window.bootstrap && window.bootstrap.Toast) {
        const toast = new window.bootstrap.Toast(toastContainer.querySelector('.toast'), { delay: 5000 });
        toast.show();
    } else {
        const toast = toastContainer.querySelector('.toast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toastContainer.remove(), 300);
        }, 5000);
    }
};

// Make API and error handler available globally
window.api = api;
window.handleError = handleError; 