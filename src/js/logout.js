// Get DOM elements
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = JSON.parse(localStorage.getItem('user'));

// Add event listener for logout
logoutBtn.addEventListener('click', handleLogout);

// Display user info if available
document.addEventListener('DOMContentLoaded', () => {
    if (userInfo) {
        // You can display user info here if needed
        console.log('Logged in as:', userInfo.email);
    }
});

// Logout handler
function handleLogout() {
    // Show confirmation dialog
    const confirmLogout = confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        
        // Show logout message
        showLogoutMessage();
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
            window.location.href = '/src/authentication.html';
        }, 1500);
    }
}

// Show logout message
function showLogoutMessage() {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '15px 25px';
    messageDiv.style.background = '#28a745';
    messageDiv.style.color = 'white';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.opacity = '0';
    messageDiv.style.transition = 'opacity 0.3s ease-in-out';
    
    // Add message text
    messageDiv.textContent = 'Logging out successfully...';
    
    // Add to document
    document.body.appendChild(messageDiv);
    
    // Trigger fade in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    // Remove message after delay
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 1500);
}