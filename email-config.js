// =============================================================================
// Email & Notification Service Configuration
// Service: Web3Forms (Automated Booking Confirmation Emails)
// =============================================================================

const EMAIL_CONFIG = {
    apiKey: "776795be2a92d236a1f5ea0595f5e778",
    endpoint: "https://api.web3forms.com/submit",
    systemSenderName: "College Resource Booking System"
};

// Global export for script.js
window.EMAIL_ACCESS_KEY = EMAIL_CONFIG.apiKey;
window.EMAIL_CONFIG = EMAIL_CONFIG;
