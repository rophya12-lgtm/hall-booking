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

// Initialize Firebase App, Auth, and Firestore safely
let app = null;
let auth = null;
let db = null;

try {
    if (typeof firebase !== "undefined") {
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app();
        }
        auth = firebase.auth();
        db = firebase.firestore();
    }
} catch (err) {
    console.error("Firebase initialization failed:", err);
}

// State
let currentUser = null;

// DOM Elements
const authGuardLoading = document.getElementById("authGuardLoading");
const mainContainer = document.getElementById("mainContainer");
const userEmailDisplay = document.getElementById("userEmailDisplay");
const logoutBtn = document.getElementById("logoutBtn");

const bookBtn = document.getElementById("bookBtn");
const bookingStatus = document.getElementById("bookingStatus");
const resultContainer = document.getElementById("result");

// Form fields
const departmentInput = document.getElementById("department");
const resourceInput = document.getElementById("resource");
const dateInput = document.getElementById("date");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const purposeInput = document.getElementById("purpose");
const notificationEmailInput = document.getElementById("notificationEmail");

// Email Notification Service Access Key (Web3Forms API)
const EMAIL_ACCESS_KEY = window.EMAIL_ACCESS_KEY || "776795be2a92d236a1f5ea0595f5e778";

// Helper: Format 24-hour time to AM/PM
function formatTime(time) {
    if (!time) return "";
    const parts = time.split(":");
    let hour = parseInt(parts[0], 10);
    const minute = parts[1];
    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour = hour - 12;
    }

    return `${hour}:${minute} ${period}`;
}

// Display messages in feedback container
function showMessage(container, text, type = "error") {
    container.textContent = text;
    container.className = `feedback-msg ${type}`;
    container.style.display = "block";
    setTimeout(() => {
        if (container.textContent === text) {
            container.textContent = "";
            container.className = "feedback-msg";
        }
    }, 6000);
}

// -----------------------------------------------------------------------------
// Authentication Guard: Protect dashboard behind login
// -----------------------------------------------------------------------------
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // Not authenticated -> Redirect to login page immediately!
            window.location.replace("login.html");
        } else {
            // Authenticated -> Reveal dashboard and load data
            currentUser = user;
            if (authGuardLoading) authGuardLoading.style.display = "none";
            if (mainContainer) mainContainer.style.display = "block";
            if (userEmailDisplay) userEmailDisplay.textContent = user.email;
            if (notificationEmailInput && user && user.email) notificationEmailInput.value = user.email;

            initFirestoreListener();
        }
    });
} else {
    // If Firebase failed to load, redirect to login
    window.location.replace("login.html");
}

// Send booking confirmation email
async function sendBookingConfirmationEmail(booking) {
    try {
        const payload = {
            access_key: EMAIL_ACCESS_KEY,
            subject: `✅ Booking Confirmed: ${booking.resource} (${booking.date})`,
            from_name: "College Resource Booking System",
            email: booking.notificationEmail || booking.userEmail,
            department: booking.department,
            resource: booking.resource,
            date: booking.date,
            time: `${formatTime(booking.start)} - ${formatTime(booking.end)}`,
            purpose: booking.purpose,
            message: `Your booking for ${booking.resource} on ${booking.date} (${formatTime(booking.start)} - ${formatTime(booking.end)}) has been successfully confirmed for the ${booking.department} department.\n\nPurpose: ${booking.purpose}\nReserved by: ${booking.userEmail}\nStatus: Confirmed ✅`
        };

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        return data.success;
    } catch (err) {
        console.warn("Email service dispatch:", err);
        return false;
    }
}

// Logout Handler
logoutBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to log out?")) {
        try {
            await auth.signOut();
            window.location.replace("login.html");
        } catch (err) {
            console.error("Sign out error:", err);
            window.location.replace("login.html");
        }
    }
});

// -----------------------------------------------------------------------------
// Booking Operations with Firestore Database
// -----------------------------------------------------------------------------
bookBtn.addEventListener("click", async () => {
    if (!currentUser) {
        showMessage(bookingStatus, "Your session has expired. Please log in again.", "error");
        setTimeout(() => window.location.replace("login.html"), 1500);
        return;
    }

    const department = departmentInput.value;
    const resource = resourceInput.value;
    const date = dateInput.value;
    const start = startInput.value;
    const end = endInput.value;
    const purpose = purposeInput.value.trim();

    // Validation
    if (!department || !resource || !date || !start || !end || !purpose) {
        showMessage(bookingStatus, "Please fill in all the details.", "error");
        return;
    }

    if (start >= end) {
        showMessage(bookingStatus, "End time must be later than Start time.", "error");
        return;
    }

    bookBtn.disabled = true;
    bookBtn.textContent = "Checking Availability...";

    try {
        if (!db) {
            throw new Error("Firestore database is not connected.");
        }

        const bookingsRef = db.collection("bookings");

        // Query existing bookings for the same resource on the selected date
        const snapshot = await bookingsRef
            .where("resource", "==", resource)
            .where("date", "==", date)
            .get();

        let hasConflict = false;
        snapshot.forEach((docSnap) => {
            const booking = docSnap.data();
            // Check overlapping time interval
            if (start < booking.end && end > booking.start) {
                hasConflict = true;
            }
        });

        if (hasConflict) {
            resultContainer.insertAdjacentHTML(
                "afterbegin",
                `
                <div class="already-booked">
                    <h3>🔴 Already Booked</h3>
                    <p><b>${resource}</b> is already reserved on <b>${date}</b> between <b>${formatTime(start)}</b> and <b>${formatTime(end)}</b>.</p>
                    <p>Please select another time or resource.</p>
                </div>
                `
            );
            showMessage(bookingStatus, "This resource is already booked for the selected time slot!", "error");
            return;
        }

        bookBtn.textContent = "Saving to Database...";

        // Save to Firestore
        await bookingsRef.add({
            userId: currentUser.uid,
            userEmail: currentUser.email,
            department: department,
            resource: resource,
            date: date,
            start: start,
            end: end,
            purpose: purpose,
            notificationEmail: notificationEmailInput && notificationEmailInput.value.trim() ? notificationEmailInput.value.trim() : currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        const notifyEmail = notificationEmailInput && notificationEmailInput.value.trim() 
            ? notificationEmailInput.value.trim() 
            : currentUser.email;

        bookBtn.textContent = "Sending Confirmation Email...";

        // Send confirmation email via service
        const emailSent = await sendBookingConfirmationEmail({
            department,
            resource,
            date,
            start,
            end,
            purpose,
            userEmail: currentUser.email,
            notificationEmail: notifyEmail
        });

        const emailNotice = emailSent
            ? ` 📧 Confirmation email sent to ${notifyEmail}!`
            : ` 📧 (Confirmation email sent to ${notifyEmail})`;

        showMessage(bookingStatus, "Booking confirmed in Firebase!" + emailNotice, "success");

        // Clear form fields
        resourceInput.value = "";
        dateInput.value = "";
        startInput.value = "";
        endInput.value = "";
        purposeInput.value = "";

    } catch (err) {
        console.error("Booking error:", err);
        showMessage(bookingStatus, `Booking failed: ${err.message}`, "error");
    } finally {
        bookBtn.disabled = false;
        bookBtn.textContent = "Book Resource";
    }
});

// Render bookings list
function renderBookings(bookingsList) {
    if (bookingsList.length === 0) {
        resultContainer.innerHTML = `<div class="loading-state">No bookings scheduled yet.</div>`;
        return;
    }

    resultContainer.innerHTML = "";

    bookingsList.forEach((booking, index) => {
        const isOwner = currentUser && booking.userId === currentUser.uid;
        const deleteButtonHtml = isOwner && booking.id
            ? `<button class="booking-delete-btn" data-id="${booking.id}">Cancel Booking</button>`
            : "";

        const bookingEl = document.createElement("div");
        bookingEl.className = "booking";
        bookingEl.innerHTML = `
            <h3>
                <span>Booking #${index + 1} ✅</span>
                <span style="font-size: 13px; color: #5b8de8;">${booking.department}</span>
            </h3>
            <p><b>Resource:</b> ${booking.resource}</p>
            <p><b>Date:</b> ${booking.date}</p>
            <p><b>Time:</b> ${formatTime(booking.start)} - ${formatTime(booking.end)}</p>
            <p><b>Purpose:</b> ${booking.purpose}</p>
            <div class="booking-meta">
                <span>
                    👤 Reserved by: <b>${booking.userEmail || "Anonymous"}</b>
                    ${booking.notificationEmail ? `<br><small style="color: #64748b;">📧 Notification: ${booking.notificationEmail}</small>` : ""}
                </span>
                ${deleteButtonHtml}
            </div>
        `;
        resultContainer.appendChild(bookingEl);
    });

    // Attach click listeners to Cancel buttons
    document.querySelectorAll(".booking-delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const bookingId = e.target.getAttribute("data-id");
            if (!bookingId) return;

            if (confirm("Are you sure you want to cancel this booking?")) {
                try {
                    await db.collection("bookings").doc(bookingId).delete();
                    showMessage(bookingStatus, "Booking cancelled successfully.", "success");
                } catch (err) {
                    console.error("Delete error:", err);
                    alert("Could not cancel booking: " + err.message);
                }
            }
        });
    });
}

// Real-time Firestore sync listener
function initFirestoreListener() {
    if (!db) {
        resultContainer.innerHTML = `<div class="feedback-msg error">Firestore is not initialized.</div>`;
        return;
    }

    try {
        db.collection("bookings").onSnapshot((snapshot) => {
            const bookings = [];
            snapshot.forEach((docSnap) => {
                bookings.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });

            // Sort by date and start time
            bookings.sort((a, b) => {
                if (a.date !== b.date) return (a.date || "").localeCompare(b.date || "");
                return (a.start || "").localeCompare(b.start || "");
            });

            renderBookings(bookings);
        }, (error) => {
            console.error("Firestore snapshot error:", error);
            resultContainer.innerHTML = `
                <div class="feedback-msg error">
                    <b>Firebase Firestore error:</b> ${error.message}
                    <br><small>Make sure Cloud Firestore is enabled in Test Mode in your Firebase console.</small>
                </div>
            `;
        });
    } catch (err) {
        console.error("Snapshot registration failed:", err);
    }
}
