// Toggle password visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password validation for register page
if (document.getElementById('registerPassword')) {
    const passwordInput = document.getElementById('registerPassword');
    const requirements = {
        length: document.getElementById('length'),
        number: document.getElementById('number'),
        uppercase: document.getElementById('uppercase')
    };

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Check length (min 8 characters)
        if (password.length >= 8) {
            updateRequirement(requirements.length, true);
        } else {
            updateRequirement(requirements.length, false);
        }
        
        // Check for number
        if (/\d/.test(password)) {
            updateRequirement(requirements.number, true);
        } else {
            updateRequirement(requirements.number, false);
        }
        
        // Check for uppercase letter
        if (/[A-Z]/.test(password)) {
            updateRequirement(requirements.uppercase, true);
        } else {
            updateRequirement(requirements.uppercase, false);
        }
        
        // Enable/disable submit button
        const allValid = password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
        const submitButton = document.querySelector('.auth-button');
        submitButton.disabled = !allValid;
    });
}

function updateRequirement(element, isValid) {
    const icon = element.querySelector('i');
    const span = element.querySelector('span');

    if (isValid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-check');
        span.style.color = '#94ADE2';      // Ustawienie koloru tekstu
        icon.style.color = '#94ADE2';      // Ustawienie koloru ikony
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        icon.classList.remove('fa-check');
        icon.classList.add('fa-times');
        span.style.color = 'black';        // Kolor domyślny tekstu
        icon.style.color = 'black';        // Kolor domyślny ikony
    }
}


// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'homepage.html';
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(error => {
                showMessage('An error occurred. Please try again.', 'error');
            });
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'homepage.html';
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(error => {
                showMessage('An error occurred. Please try again.', 'error');
            });
        });
    }
});

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // Insert before form
    const form = document.querySelector('.auth-form');
    form.parentNode.insertBefore(messageDiv, form);
}
