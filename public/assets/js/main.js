// Función para cargar vehículos destacados
async function loadFeaturedVehicles() {
    try {
        const vehicles = await api.vehiculos.getAll();
        const featuredVehicles = vehicles.slice(0, 3); // Mostrar solo los primeros 3 vehículos

        const container = document.getElementById('featuredVehicles');
        if (!container) return;

        container.innerHTML = featuredVehicles.map(vehicle => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${vehicle.imagen || '/assets/img/default-car.jpg'}" class="card-img-top" alt="${vehicle.modelo}">
                    <div class="card-body">
                        <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                        <p class="card-text">${vehicle.descripcion || 'Sin descripción disponible'}</p>
                        <p class="card-text"><strong>Precio por día:</strong> $${vehicle.precio_dia}</p>
                        <a href="/views/front/catalogo.html?id=${vehicle.id}" class="btn btn-primary">Ver detalles</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar vehículos destacados:', error);
    }
}

// Función para verificar el estado de autenticación
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        
        const loginBtn = document.querySelector('a[href="/views/auth/login.html"]');
        const registerBtn = document.querySelector('a[href="/views/auth/registro.html"]');
        
        if (data.authenticated) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            // Aquí podrías mostrar un botón de logout si lo deseas
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (registerBtn) registerBtn.style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedVehicles();
    checkAuthStatus();
}); 