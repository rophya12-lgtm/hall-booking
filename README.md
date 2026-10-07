# 🏛️ College Resource Booking System

A modern College Resource Booking system integrated with:
- **Firebase Authentication** (Email/Password & Google Sign-In with protected dashboard route)
- **Cloud Firestore Database** (Real-time reservation syncing & conflict detection)
- **Automated Email Notifications** (Web3Forms API key configured to send booking confirmation slips)

---

## 🔑 Integrated APIs & Keys
- **Email Confirmation API (Web3Forms):** `776795be2a92d236a1f5ea0595f5e778`
  - Configured in: [`email-config.js`](email-config.js) & [`script.js`](script.js)
  - Purpose: Automatically sends reservation confirmation emails to students/faculty upon booking.
- **Firebase Project:** `college-hall-booking-139a9`
  - Configured in: [`firebase-config.js`](firebase-config.js)
  - Features: Auth (Email/Pass + Google) & Firestore Database.

---

## 📂 Project Structure
- [`index.html`](index.html): Main protected resource booking dashboard.
- [`login.html`](login.html): Dedicated authentication portal (Google + Email/Password).
- [`email-config.js`](email-config.js): Web3Forms Email API configuration (`776795be2a92d236a1f5ea0595f5e778`).
- [`firebase-config.js`](firebase-config.js): Firebase project credentials.
- [`script.js`](script.js): Dashboard logic, real-time Firestore database listener, and confirmation email dispatcher.
- [`login.js`](login.js): Sign-in and sign-up handlers.
- [`style.css`](style.css): Modern responsive UI styling.
- [`push_to_github.bat`](push_to_github.bat): One-click deployment script.
