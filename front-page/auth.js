// Authentication check
function checkAuth() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // If not logged in, redirect to front page
        window.location.href = '/front-page/index.html';
        return false;
    }
    
    return true;
}

// Function to log out
function logout() {
    localStorage.removeItem('isLoggedIn');
    // Redirect to home page
    window.location.href = '../front-page/index.html';
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add logout button to the navigation if it doesn't exist
    const nav = document.querySelector('nav ul.nav-menu');
    if (nav) {
        // Check if logout button already exists
        const existingLogout = document.querySelector('.logout-btn');
        if (!existingLogout) {
            const logoutItem = document.createElement('li');
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'logout-btn';
            logoutBtn.textContent = 'Cerrar Sesión';
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
            
            logoutItem.appendChild(logoutBtn);
            nav.appendChild(logoutItem);
        }
    }
}); 