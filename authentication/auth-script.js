// password visibility
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

// password validation (REGISTER)
if (document.getElementById('registerPassword')) {
    const passwordInput = document.getElementById('registerPassword');
    const requirements = {
        length: document.getElementById('length'),
        number: document.getElementById('number'),
        uppercase: document.getElementById('uppercase')
    };

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // min. 8 characters
        // min. 1 number
        // min. 1 uppercase letter

        if (password.length >= 8) {
            updateRequirement(requirements.length, true);
        } else {
            updateRequirement(requirements.length, false);
        }
        
        if (/\d/.test(password)) {
            updateRequirement(requirements.number, true);
        } else {
            updateRequirement(requirements.number, false);
        }
        
        if (/[A-Z]/.test(password)) {
            updateRequirement(requirements.uppercase, true);
        } else {
            updateRequirement(requirements.uppercase, false);
        }
        
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
        span.style.color = '#94ADE2';      
        icon.style.color = '#94ADE2';      
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        icon.classList.remove('fa-check');
        icon.classList.add('fa-times');
        span.style.color = 'black';     
        icon.style.color = 'black';      
    }
}

// submission handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('login.php', {  // No path change needed - same directory
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '../homepage.php'; // Assuming homepage is in parent directory
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
            
            fetch('register.php', {  // No path change needed - same directory
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'login.html'; // No path change needed - same directory
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
    // remove existing messages
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // insert before form
    const form = document.querySelector('.auth-form');
    form.parentNode.insertBefore(messageDiv, form);
}