// Import API
import { api } from '/views/front/js/api.js';

// Variables globales
let currentUser = null;

// Function to check authentication and update UI
function checkAuth() {
    try {
        const isAuthenticated = api.isAuthenticated();
        const currentUser = api.getCurrentUser();
        
        // Check if user is authenticated
        if (isAuthenticated && currentUser) {
            // User is authenticated, show logout button
            const logoutContainer = document.getElementById('logoutButtonContainer');
            if (logoutContainer) {
                logoutContainer.style.display = 'block';
            }
            
            // If we have a username container, update it
            const usernameElem = document.getElementById('currentUsername');
            if (usernameElem) {
                usernameElem.textContent = currentUser.username;
            }
            
            // Show/hide admin panel link based on user role
            const adminPanelLink = document.getElementById('adminPanelLink');
            if (adminPanelLink) {
                if (currentUser.role === 'admin' || currentUser.role === 'empleado') {
                    adminPanelLink.style.display = 'block';
                } else {
                    adminPanelLink.style.display = 'none';
                }
            }
            
            // Hide login button container if it exists
            const loginContainer = document.getElementById('loginButtonContainer');
            if (loginContainer) {
                loginContainer.style.display = 'none';
            }
            
            // If we're on an admin page, check if user has admin role
            if (window.location.pathname.includes('/admin')) {
                if (currentUser.role !== 'admin' && currentUser.role !== 'empleado') {
                    console.log('Usuario sin permisos de admin, redirigiendo...');
                    window.location.href = '/';
                    return false;
                }
            }
            
            return true;
        } else {
            // User is not authenticated, hide logout button
            const logoutContainer = document.getElementById('logoutButtonContainer');
            if (logoutContainer) {
                logoutContainer.style.display = 'none';
            }
            
            // Show login button container if it exists
            const loginContainer = document.getElementById('loginButtonContainer');
            if (loginContainer) {
                loginContainer.style.display = 'block';
            }
            
            // If we're on an admin page and not authenticated, redirect to login
            if (window.location.pathname.includes('/admin')) {
                console.log('No autenticado en página de admin, redirigiendo...');
                window.location.href = '/login';
            }
            
            return false;
        }
    } catch (error) {
        console.error('Error en checkAuth:', error);
        return false;
    }
}

// Function to handle logout
async function logout(e) {
    if (e) e.preventDefault();
    
    try {
        console.log('Intentando cerrar sesión...');
        await api.logout();
        console.log('Sesión cerrada exitosamente');
        
        // Show alert if we have an alert function
        if (window.showAlert) {
            window.showAlert('Has cerrado sesión exitosamente', 'success');
        }
        
        // Redirect based on current page
        if (window.location.pathname.includes('/admin')) {
            // Admin page - redirect to homepage
            window.location.href = '/';
        } else {
            // Public page - redirect to home or reload
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        
        // Still attempt to redirect on error since we cleared local storage
        if (window.location.pathname.includes('/admin')) {
            window.location.href = '/';
        } else {
            window.location.href = '/';
        }
    }
}

// Function to initialize auth features on page load
function initAuth() {
    // Check authentication
    const isAuthenticated = checkAuth();
    
    // Add event listener to logout button if it exists
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Add event listener to admin logout button if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    return isAuthenticated;
}

// Initialize auth on page load
let initialized = false;
document.addEventListener('DOMContentLoaded', () => {
    if (!initialized) {
        initialized = true;
        initAuth();
    }
});

// Export for use in other scripts
export { checkAuth, logout, initAuth };

// Make functions available globally
window.checkAuth = checkAuth;
window.handleLogout = logout; // For backward compatibility
window.logout = logout;
window.showAlert = showAlert; // Make showAlert available globally

// Función para mostrar alertas
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
} 