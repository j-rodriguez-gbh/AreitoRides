import { api } from '/views/front/js/api.js';

function showError(message) {
    const errorElement = document.getElementById('registroError');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
}

function hideError() {
    const errorElement = document.getElementById('registroError');
    errorElement.classList.add('d-none');
}

document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError();
    
    // Obtener todos los campos
    const usuario = document.getElementById('usuario').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validaciones de campos requeridos
    if (!usuario || !nombre || !apellido || !email || !password || !confirmPassword) {
        showError('Por favor, complete todos los campos obligatorios');
        return;
    }

    // Validar longitud del usuario
    if (usuario.length < 3) {
        showError('El nombre de usuario debe tener al menos 3 caracteres');
        return;
    }

    // Validar contraseñas
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Por favor, ingrese un correo electrónico válido');
        return;
    }

    // Validar formato de teléfono (opcional)
    if (telefono && !/^\+?[\d\s-]{8,}$/.test(telefono)) {
        showError('Por favor, ingrese un número de teléfono válido');
        return;
    }
    
    // Log the data we're sending
    console.log('Enviando datos de registro:', { 
        usuario, nombre, apellido, email, 
        telefono: telefono || null, 
        direccion: direccion || null, 
        password: password.substring(0, 3) + '***' // For security
    });
    
    try {
        // Try the registration with full validation
        const result = await api.register({
            usuario,
            nombre,
            apellido,
            email,
            telefono: telefono || null,
            direccion: direccion || null,
            password
        });
        
        console.log('Registro exitoso:', result);
        
        // Redirigir al catálogo después del registro exitoso
        window.location.href = '/catalogo';
    } catch (error) {
        console.error('Error en registro:', error);
        showError(error.message || 'Error al registrar usuario. Por favor, intente nuevamente.');
    }
}); 