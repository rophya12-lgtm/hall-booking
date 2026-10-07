// Firebase Configuration for college-hall-booking-139a9
const firebaseConfig = {
    apiKey: "AIzaSyBjPOildB_TG03CbqNuE_yjGDwPsgp06xo",
    authDomain: "college-hall-booking-139a9.firebaseapp.com",
    projectId: "college-hall-booking-139a9",
    storageBucket: "college-hall-booking-139a9.firebasestorage.app",
    messagingSenderId: "603825507392",
    appId: "1:603825507392:web:d9f9574b4fab331cdc63a5",
    measurementId: "G-60JB0CNN6T"
};

// Initialize Firebase
let auth = null;
try {
    if (typeof firebase !== "undefined") {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
    } else {
        console.warn("Firebase SDK script not loaded yet.");
    }
} catch (err) {
    console.error("Firebase initialization failed:", err);
}

// UI Elements
const pageTitle = document.getElementById("pageTitle");
const loginTabBtn = document.getElementById("loginTabBtn");
const signupTabBtn = document.getElementById("signupTabBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitBtn");
const authMessage = document.getElementById("authMessage");
const googleSignInBtn = document.getElementById("googleSignInBtn");

let mode = "login"; // "login" | "signup"

// Helper: Show Feedback Message
function showMessage(text, type = "error") {
    authMessage.textContent = text;
    authMessage.className = `feedback-msg ${type}`;
    authMessage.style.display = "block";
}

// Google Sign-In Handler
googleSignInBtn.addEventListener("click", async () => {
    googleSignInBtn.disabled = true;
    googleSignInBtn.style.opacity = "0.7";
    showMessage("Opening Google Sign-In...", "success");

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await auth.signInWithPopup(provider);
        showMessage(`Signed in as ${result.user.email}! Redirecting...`, "success");
        setTimeout(() => {
            window.location.replace("index.html");
        }, 800);
    } catch (error) {
        console.error("Google Auth error:", error);
        let msg = error.message;
        if (error.code === "auth/popup-closed-by-user") {
            msg = "Sign-in cancelled (popup was closed).";
        } else if (error.code === "auth/operation-not-allowed") {
            msg = "⚠️ Google sign-in is not enabled yet in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Google provider.";
        } else if (error.code === "auth/unauthorized-domain" || error.code === "auth/operation-not-supported-in-this-environment") {
            msg = "Google popup sign-in requires running via a web server (like localhost) or adding this domain to Firebase Authorized Domains. You can use Email/Password login directly below!";
        }
        showMessage(msg, "error");
    } finally {
        googleSignInBtn.disabled = false;
        googleSignInBtn.style.opacity = "1";
    }
});

// Check if user is already signed in
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            showMessage(`Already logged in as ${user.email}. Redirecting to booking dashboard...`, "success");
            setTimeout(() => {
                window.location.replace("index.html");
            }, 800);
        }
    });
}

// Tab: Log In
loginTabBtn.addEventListener("click", () => {
    mode = "login";
    loginTabBtn.classList.add("active");
    signupTabBtn.classList.remove("active");
    pageTitle.textContent = "Sign In to Your Account";
    submitBtn.textContent = "Log In";
    confirmPasswordGroup.style.display = "none";
    authMessage.style.display = "none";
});

// Tab: Sign Up
signupTabBtn.addEventListener("click", () => {
    mode = "signup";
    signupTabBtn.classList.add("active");
    loginTabBtn.classList.remove("active");
    pageTitle.textContent = "Create a New Account";
    submitBtn.textContent = "Register Account";
    confirmPasswordGroup.style.display = "block";
    authMessage.style.display = "none";
});

// Form Submit
submitBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Please enter both email and password.", "error");
        return;
    }

    if (mode === "signup") {
        const confirmPassword = confirmPasswordInput.value;
        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.", "error");
            return;
        }
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }
    }

    submitBtn.disabled = true;
    submitBtn.textContent = mode === "signup" ? "Creating Account..." : "Signing In...";

    try {
        if (mode === "signup") {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            showMessage(`Account created for ${userCredential.user.email}! Redirecting...`, "success");
        } else {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            showMessage(`Login successful! Redirecting to dashboard...`, "success");
        }

        setTimeout(() => {
            window.location.replace("index.html");
        }, 800);

    } catch (error) {
        console.error("Auth error:", error);
        let msg = error.message;

        if (error.code === "auth/operation-not-allowed") {
            msg = "⚠️ Email/Password is not enabled yet in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Email/Password.";
        } else if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
            msg = "Invalid email or password.";
        } else if (error.code === "auth/user-not-found") {
            msg = "No account found with this email. Click 'Sign Up' above to register.";
        } else if (error.code === "auth/email-already-in-use") {
            msg = "This email is already registered. Please switch to the 'Log In' tab.";
        } else if (error.code === "auth/weak-password") {
            msg = "Password should be at least 6 characters.";
        } else if (error.code === "auth/invalid-email") {
            msg = "Please enter a valid email address.";
        }

        showMessage(msg, "error");
        submitBtn.disabled = false;
        submitBtn.textContent = mode === "signup" ? "Register Account" : "Log In";
    }
});
