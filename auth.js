// Constants
const STORAGE_KEY = 'user';

// DOM Elements
const emailInput = document.querySelector('input[placeholder="Email address"]');
const passwordInput = document.querySelector('input[placeholder="Password"]');
const rememberMeCheckbox = document.querySelector('#formCheck');
const loginButton = document.querySelector('.btn-primary');
const googleSignInButton = document.querySelector('.btn-light');
const signUpLink = document.querySelector('a[href="#"]');

// Sample user data (in a real app, this would be in a database)
const validUsers = [
    {
        email: 'admin@gmail.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
    },
    {
        email: 'user@example.com',
        password: 'user123',
        name: 'Regular User',
        role: 'user'
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
        redirectToDashboard();
    }

    // Add event listeners to buttons
    loginButton?.addEventListener('click', handleLogin);
    googleSignInButton?.addEventListener('click', handleGoogleSignIn);
    signUpLink?.addEventListener('click', handleSignUpClick);
});

// Login Handler
async function handleLogin(e) {
    e.preventDefault();

    if (!emailInput || !passwordInput) {
        showError('Invalid form elements');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Check credentials against valid users
    const user = validUsers.find(u => u.email === email && u.password === password);

    if (user) {
        // Create session data
        const sessionData = {
            email: user.email,
            name: user.name,
            role: user.role,
            timestamp: new Date().toISOString(),
            isRemembered: rememberMeCheckbox?.checked || false
        };

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

        // Show success message
        showSuccess('Login successful! Redirecting...');

        // Redirect to dashboard
        setTimeout(redirectToDashboard, 1000);
    } else {
        showError('Invalid email or password');
    }
}

// Google Sign In Handler
function handleGoogleSignIn(e) {
    e.preventDefault();
    // In a real application, this would integrate with Google OAuth
    showInfo('Google Sign In functionality would be implemented here');
}

// Sign Up Handler
function handleSignUpClick(e) {
    e.preventDefault();
    // Redirect to sign up page
    showInfo('Sign Up functionality would be implemented here');
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function redirectToDashboard() {
    window.location.href = '/index.html';
}

// Message Display Functions
function showError(message) {
    showMessage(message, 'danger');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showInfo(message) {
    showMessage(message, 'info');
}

function showMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.alert');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `alert alert-${type} mt-3`;
    messageElement.role = 'alert';
    messageElement.textContent = message;

    // Insert message after the login button
    loginButton.parentNode.insertAdjacentElement('afterend', messageElement);

    // Auto remove after 3 seconds
    setTimeout(() => messageElement.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("togglePassword");
    const toggleIcon = toggleButton.querySelector("i");
  
    toggleButton.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
      }
    });
  });

  

// Logout Function
// function logout() {
//     localStorage.removeItem(STORAGE_KEY);
//     window.location.href = '/index.html';
// }

// Export for use in other files
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = { logout };
// }