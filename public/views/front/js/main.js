import { api } from './api.js';

// Función para cargar vehículos destacados
async function loadFeaturedVehicles() {
    try {
        const vehicles = await api.getVehicles();
        const featuredVehicles = vehicles.slice(0, 3); // Mostrar solo los primeros 3 vehículos
        renderVehicles(featuredVehicles);
    } catch (error) {
        console.error('Error al cargar vehículos destacados:', error);
        const container = document.getElementById('featuredVehicles');
        if (container) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error al cargar los vehículos. Por favor, intente más tarde.</p></div>';
        }
    }
}

// Función para verificar si el usuario está autenticado
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const loginBtn = document.querySelector('a[href="/login"]');
    const userMenu = document.getElementById('userMenu');

    if (token && loginBtn) {
        loginBtn.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
        }
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedVehicles();
    checkAuthStatus();
});

function renderVehicles(vehicles) {
    const container = document.getElementById('featuredVehicles');
    if (!container) {
        console.error('No se encontró el contenedor de vehículos');
        return;
    }

    container.innerHTML = vehicles.map(vehicle => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="/assets/img/vehiculos/marcas/${vehicle.marca_nombre}/${vehicle.modelo_nombre}.jpg" 
                     onerror="this.onerror=null; this.src='/assets/img/vehiculos/marcas/${vehicle.marca_nombre}/${vehicle.modelo_nombre}.png'"
                     class="card-img-top" alt="${vehicle.modelo_nombre}">
                <div class="card-body">
                    <h5 class="card-title">${vehicle.modelo_nombre}</h5>
                    <p class="card-text">
                        <strong>Marca:</strong> ${vehicle.marca_nombre}<br>
                        <strong>Tipo:</strong> ${vehicle.tipo_vehiculo_nombre}<br>
                        <strong>Precio:</strong> $${vehicle.precio_dia}/día
                    </p>
                    <a href="/catalogo?id=${vehicle.id}" class="btn btn-primary">
                        Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `).join('');
} 