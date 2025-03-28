document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Simple validation
            if (username === '') {
                showError('Usuário é obrigatório');
                return;
            }
            
            if (password === '') {
                showError('Senha é obrigatória');
                return;
            }
            
            // For demo purposes, let's use a hardcoded validation
            // In a real application, you would verify credentials against a server
            if (username === 'admin' && password === 'admin123') {
                // Store login state in localStorage (not secure for production)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // Redirect to main page after login
                window.location.href = 'cadastro-aluno.html';
            } else {
                showError('Usuário ou senha incorretos');
            }
        });
    }
    
    // Check login status on page load
    checkLoginStatus();
    
    function showError(message) {
        // Remove any existing error message
        const existingError = document.querySelector('.auth-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and display error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        
        const container = document.querySelector('.auth-container');
        container.appendChild(errorDiv);
    }
    
    function checkLoginStatus() {
        // This function can be used to check if user is logged in
        // and redirect to login page if they're not
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        // If we're not on login page and not logged in, redirect to login
        const isLoginPage = window.location.pathname.includes('index.html') || 
                          window.location.pathname.endsWith('/');
        
        if (!isLoggedIn && !isLoginPage) {
            window.location.href = 'index.html';
        }
    }
});

// Helper function to log out user
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}
