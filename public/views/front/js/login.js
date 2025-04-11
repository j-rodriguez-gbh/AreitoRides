import { api } from './api.js';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    try {
        console.log('Intentando iniciar sesión con:', { username });
        const response = await api.login(username, password);
        console.log('Respuesta del servidor:', response);
        
        // Get user information from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (response.token) {
            // Redirect based on user role
            if (user && (user.role === 'admin' || user.role === 'empleado')) {
                console.log('Redirigiendo al panel de administración...');
                window.location.href = '/admin';
            } else {
                console.log('Redirigiendo al catálogo...');
                window.location.href = '/catalogo';
            }
        } else {
            throw new Error('No se recibió token de autenticación');
        }
    } catch (error) {
        console.error('Error en login:', error);
        errorElement.textContent = 'Credenciales inválidas';
        errorElement.classList.remove('d-none');
    }
}); 