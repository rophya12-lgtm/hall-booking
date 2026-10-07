# College Resource Booking - Firebase Auth & Database

This project provides a full-featured College Resource Booking system integrated with:
- **Firebase Authentication** (Sign up, Log in, Log out, session persistence)
- **Cloud Firestore Database** (Real-time booking storage, conflict detection, user cancellation)

Your API keys for Firebase project **`college-hall-booking-139a9`** are already configured and active!

---

## 📂 Project Structure

- **[`login.html`](login.html)**: Dedicated Login and Account Registration page.
- **[`login.js`](login.js)**: Handles authentication, validation, and auto-redirect to the dashboard.
- **[`index.html`](index.html)**: Main Resource Booking Dashboard with user session bar, booking form, and live schedule.
- **[`script.js`](script.js)**: Firestore database queries, slot collision check, real-time sync, and reservation cancellation.
- **[`style.css`](style.css)**: Modern gradient theme matching your college booking portal.
- **[`firebase-config.js`](firebase-config.js)**: Central Firebase configuration.

---

## 🚀 How to Run

You can open the project directly in your browser without any terminal or server:

1. **Double-click [`login.html`](login.html)** in Windows File Explorer (or [`index.html`](index.html)).
2. Sign in or create an account with your college email.
3. Book halls/labs and watch reservations sync to your Firebase Firestore database in real time!

---

## ⚙️ Essential Firebase Console Checks

Before testing, verify in your [Firebase Console](https://console.firebase.google.com/project/college-hall-booking-139a9/):
1. **Authentication**: Go to **Authentication > Sign-in method** -> enable **Email/Password**.
2. **Firestore Database**: Go to **Firestore Database** -> ensure database is created in **Test mode**.
