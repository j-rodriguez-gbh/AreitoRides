import { api } from './api.js';

// Variables globales
const API_URL = 'http://localhost:5000/api';
let vehicles = [];
let vehicleTypes = [];
let brands = [];
let anios = [];
let filteredVehicles = [];
let currentUser = null;
let selectedVehicle = null;
let initialized = false;

// Elementos del DOM
let vehiclesContainer = document.getElementById('vehiclesContainer');
let searchForm;
let userMenu;
let loginBtn;
let registerBtn;
let logoutBtn;
let alertContainer = document.getElementById('alertContainer');
let tipoVehiculoSelect = document.getElementById('tipoVehiculo');
let marcaSelect = document.getElementById('marca');
let anioSelect = document.getElementById('anio');
const vehicleModal = new bootstrap.Modal(document.getElementById('vehicleModal'));

// Funciones de utilidad
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => alertDiv.remove(), 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

function createVehicleCard(vehicle) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="vehicle-card card h-100">
                <img src="${vehicle.imagen || 'img/default-vehicle.jpg'}" class="card-img-top" alt="${vehicle.modelo}">
                <div class="card-body">
                    <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                    <p class="card-text">
                        <strong>Tipo:</strong> ${vehicle.tipoVehiculo}<br>
                        <strong>Año:</strong> ${vehicle.anio}<br>
                        <strong>Transmisión:</strong> ${vehicle.transmision}<br>
                        <strong>Combustible:</strong> ${vehicle.combustible}
                    </p>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">$${vehicle.precioDia}/día</span>
                        <button class="btn btn-primary" onclick="reservarVehiculo(${vehicle.id})">
                            <i class="fas fa-calendar-check me-2"></i>Reservar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Funciones para cargar datos
async function loadInitialData() {
    try {
        // Cargar vehículos
        vehicles = await api.getVehicles();
        renderVehicles(vehicles);

        // Cargar filtros
        if (tipoVehiculoSelect) {
            const tipos = [...new Set(vehicles.map(v => v.tipo_vehiculo_nombre))].filter(Boolean);
            tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo;
                option.textContent = tipo;
                tipoVehiculoSelect.appendChild(option);
            });
        }

        if (marcaSelect) {
            const marcas = [...new Set(vehicles.map(v => v.marca_nombre))].filter(Boolean);
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                marcaSelect.appendChild(option);
            });
        }

        if (anioSelect) {
            const anios = [...new Set(vehicles.map(v => v.anio))].filter(Boolean).sort((a, b) => b - a);
            anios.forEach(anio => {
                const option = document.createElement('option');
                option.value = anio;
                option.textContent = anio;
                anioSelect.appendChild(option);
            });
        }

        // Configurar eventos
        setupEventListeners();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showAlert('Error al cargar los datos. Por favor, intente nuevamente.', 'danger');
    }
}

// Renderizar vehículos
function renderVehicles(vehiclesToRender) {
    if (!vehiclesContainer) return;

    // Limpiar el contenedor antes de renderizar
    vehiclesContainer.innerHTML = '';
    
    if (!vehiclesToRender || !vehiclesToRender.length) {
        vehiclesContainer.innerHTML = '<div class="col-12"><p class="text-center">No se encontraron vehículos</p></div>';
        return;
    }

    // Crear un fragmento para mejorar el rendimiento
    const fragment = document.createDocumentFragment();

    vehiclesToRender.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="/assets/img/vehiculos/marcas/${vehicle.marca_nombre}/${vehicle.modelo_nombre}.jpg" 
                     class="card-img-top" 
                     alt="${vehicle.marca_nombre} ${vehicle.modelo_nombre}"
                     onerror="this.src='/assets/img/vehiculos/marcas/${vehicle.marca_nombre}/${vehicle.modelo_nombre}.png'">
                <div class="card-body">
                    <h5 class="card-title">${vehicle.marca_nombre} ${vehicle.modelo_nombre}</h5>
                    <p class="card-text">
                        <strong>Tipo:</strong> ${vehicle.tipo_vehiculo_nombre}<br>
                        <strong>Año:</strong> ${vehicle.anio}<br>
                        <strong>Precio por día:</strong> $${vehicle.precio_dia || 0}
                    </p>
                    <button class="btn btn-primary" onclick="showVehicleDetails(${vehicle.id})">
                        Ver Detalles
                    </button>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });

    vehiclesContainer.appendChild(fragment);
}

// Mostrar detalles del vehículo
window.showVehicleDetails = async function(vehicleId) {
    try {
        const vehicle = await api.getVehicleById(vehicleId);
        console.log('Datos del vehículo:', vehicle);
        selectedVehicle = vehicle;

        document.getElementById('vehicleTitle').textContent = `${vehicle.marca_nombre} ${vehicle.modelo_nombre}`;
        
        document.getElementById('vehicleDetails').innerHTML = `
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <img src="/assets/img/vehiculos/marcas/${vehicle.marca_nombre}/${vehicle.modelo_nombre}.jpg" 
                             class="img-fluid rounded" 
                             alt="${vehicle.marca_nombre} ${vehicle.modelo_nombre}"
                             onerror="this.src='/assets/img/vehiculos/marcas/${vehicle.marca_nombre}/${vehicle.modelo_nombre}.png'">
                    </div>
                    <div class="col-md-6">
                        <h5>Detalles del vehículo:</h5>
                        <ul class="list-unstyled">
                            <li><strong>Tipo:</strong> ${vehicle.tipo_vehiculo_nombre || 'No especificado'}</li>
                            <li><strong>Combustible:</strong> ${vehicle.tipo_combustible_nombre || 'No especificado'}</li>
                            <li><strong>Número de Chasis:</strong> ${vehicle.no_chasis || 'No especificado'}</li>
                            <li><strong>Número de Motor:</strong> ${vehicle.no_motor || 'No especificado'}</li>
                            <li><strong>Placa:</strong> ${vehicle.no_placa || 'No especificada'}</li>
                            <li><strong>Estado:</strong> ${vehicle.estado || 'No especificado'}</li>
                        </ul>
                        <h5>Precio por día:</h5>
                        <p class="h4 text-primary">$${vehicle.precio_dia || 0} por día</p>
                    </div>
                </div>
            </div>
        `;
        vehicleModal.show();
    } catch (error) {
        console.error('Error al cargar detalles:', error);
        showAlert('Error al cargar los detalles del vehículo.', 'danger');
    }
}

// Obtener nombre del tipo de vehículo
function getTipoVehiculoName(id) {
    const tipo = vehicleTypes.find(t => t.id_tipo_vehiculo === id);
    return tipo ? tipo.nombre : 'Desconocido';
}

// Obtener nombre de la marca
function getMarcaName(id) {
    const marca = brands.find(m => m.id_marca === id);
    return marca ? marca.nombre : 'Desconocida';
}

// Función unificada para rentar un vehículo
async function rentVehicle(vehicleId) {
    if (!api.isAuthenticated()) {
        showAlert('Debe iniciar sesión para rentar un vehículo', 'warning');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }

    try {
        const rentalData = {
            id_vehiculo: vehicleId,
            fecha_inicio: new Date().toISOString().split('T')[0],
            fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        await api.createRental(rentalData);
        showAlert('¡Alquiler iniciado con éxito!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('vehicleModal')).hide();
    } catch (error) {
        console.error('Error al iniciar alquiler:', error);
        showAlert('Error al iniciar el alquiler. Por favor, intente nuevamente.', 'danger');
    }
}

// Filtrar vehículos
function filterVehicles() {
    const tipo = document.getElementById('tipoVehiculo').value;
    const marca = document.getElementById('marca').value;
    const precio = document.getElementById('precio').value;

    // Filtrar los vehículos basado en los criterios seleccionados
    const filteredVehicles = vehicles.filter(vehicle => {
        let matches = true;
        
        // Filtro por tipo
        if (tipo && vehicle.tipo_vehiculo_nombre !== tipo) {
            matches = false;
        }
        
        // Filtro por marca
        if (marca && vehicle.marca_nombre !== marca) {
            matches = false;
        }
        
        // Filtro por precio
        if (precio) {
            const vehiclePrecio = vehicle.precio_dia;
            const [min, max] = precio.split('-').map(Number);
            if (max) {
                matches = matches && vehiclePrecio >= min && vehiclePrecio <= max;
            } else {
                matches = matches && vehiclePrecio >= min;
            }
        }
        
        return matches;
    });

    // Renderizar los vehículos filtrados
    renderVehicles(filteredVehicles);
}

// Funciones de manejo de eventos
function handleSearch(event) {
    event.preventDefault();
    const filters = {
        tipoVehiculo: tipoVehiculoSelect.value,
        marca: marcaSelect.value,
        anio: anioSelect.value
    };
    loadVehicles(filters);
}

// Función para actualizar la interfaz según el estado de autenticación
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const user = api.getCurrentUser();

    if (user) {
        // Usar el template del menú de usuario
        const template = document.getElementById('userMenuTemplate');
        const clone = template.content.cloneNode(true);
        
        // Actualizar el nombre de usuario
        clone.querySelector('.username').textContent = user.username;
        
        // Mostrar enlace de administración si el usuario es admin
        if (user.role === 'admin') {
            clone.querySelector('.admin-link').style.display = 'block';
        }
        
        // Limpiar y agregar el nuevo contenido
        authButtons.innerHTML = '';
        authButtons.appendChild(clone);

        // Reinicializar los dropdowns de Bootstrap
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        });
    } else {
        // Usar el template de botones de autenticación
        const template = document.getElementById('authButtonsTemplate');
        const clone = template.content.cloneNode(true);
        
        // Limpiar y agregar el nuevo contenido
        authButtons.innerHTML = '';
        authButtons.appendChild(clone);
    }
}

// Función para manejar el cierre de sesión
window.handleLogout = function() {
    api.logout();
    updateAuthUI();
    showAlert('Has cerrado sesión exitosamente', 'success');
    
    // Si estamos en una página que requiere autenticación, redirigir al catálogo
    const requiresAuth = ['/perfil', '/mis-alquileres'];
    if (requiresAuth.includes(window.location.pathname)) {
        window.location.href = '/catalogo';
    }
}

// Modificar setupEventListeners para incluir el manejo del login
function setupEventListeners() {
    // Agregar botón de limpiar filtros si no existe
    const filterContainer = document.querySelector('.card-body');
    if (filterContainer && !document.getElementById('clearFilters')) {
        const clearButton = document.createElement('button');
        clearButton.id = 'clearFilters';
        clearButton.className = 'btn btn-secondary mt-2';
        clearButton.innerHTML = '<i class="fas fa-undo"></i> Limpiar Filtros';
        clearButton.onclick = clearFilters;
        filterContainer.appendChild(clearButton);
    }

    // Eventos de filtrado
    if (tipoVehiculoSelect) {
        tipoVehiculoSelect.addEventListener('change', filterVehicles);
    }
    if (marcaSelect) {
        marcaSelect.addEventListener('change', filterVehicles);
    }
    if (document.getElementById('precio')) {
        document.getElementById('precio').addEventListener('change', filterVehicles);
    }

    // Evento de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();

            // Validación más estricta
            if (!username || !email || !password) {
                showAlert('Por favor, complete todos los campos', 'warning');
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Por favor, ingrese un correo electrónico válido', 'warning');
                return;
            }

            // Validar longitud mínima de contraseña
            if (password.length < 6) {
                showAlert('La contraseña debe tener al menos 6 caracteres', 'warning');
                return;
            }

            try {
                console.log('Intentando registrar usuario:', { username, email });
                const response = await api.register(username, email, password);
                console.log('Respuesta de registro:', response);
                
                showAlert('¡Registro exitoso! Por favor, inicie sesión.', 'success');
                bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                
                // Limpiar el formulario
                registerForm.reset();
                
                // Mostrar el modal de login
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).show();
            } catch (error) {
                console.error('Error en registro:', error);
                showAlert(error.message || 'Error al registrarse. Por favor, intente nuevamente.', 'danger');
            }
        });
    }

    // Evento de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!username || !password) {
                showAlert('Por favor, complete todos los campos', 'warning');
                return;
            }

            try {
                await api.login(username, password);
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal.hide();
                updateAuthUI();
                showAlert('¡Inicio de sesión exitoso!', 'success');
                loginForm.reset();
            } catch (error) {
                console.error('Error en login:', error);
                showAlert(error.message || 'Error al iniciar sesión. Por favor, verifique sus credenciales.', 'danger');
            }
        });
    }
}

// Función para limpiar los filtros
function clearFilters() {
    if (tipoVehiculoSelect) tipoVehiculoSelect.value = '';
    if (marcaSelect) marcaSelect.value = '';
    if (document.getElementById('precio')) document.getElementById('precio').value = '';
    renderVehicles(vehicles);
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    if (!initialized) {
        initialized = true;
        await loadInitialData();
        setupEventListeners();
        updateAuthUI(); // Actualizar la UI según el estado de autenticación
    }
});

// Exportar funciones necesarias globalmente
window.showVehicleDetails = showVehicleDetails;
window.rentVehicle = rentVehicle;
window.filterVehicles = filterVehicles;
window.handleLogout = handleLogout;
window.selectedVehicle = selectedVehicle; 