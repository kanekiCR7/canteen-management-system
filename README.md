# Canteen Management System

A full-stack Canteen Food Ordering and Management web application built with Node.js, Express, MongoDB Atlas, and React.

---

## 📋 Prerequisites
Make sure you have installed on your computer:
- [Node.js (v18 or higher)](https://nodejs.org/)

---

## 🚀 Setup & Run Instructions

### 1. Backend Server Setup
Open a terminal in the root directory:
```bash
cd server
npm install
```

Make sure you have a `.env` file inside the `server/` directory with:
```env
PORT=5000
MONGO_URI=mongodb+srv://soham:soham123@canteenmanagement.i5a7eib.mongodb.net/canteenDB?retryWrites=true&w=majority&appName=canteenmanagement
```
*(You can also duplicate `.env.example` and rename it to `.env`)*

Start the backend server:
```bash
node server.js
```
You should see:
```text
Server running on port 5000
MongoDB connected
```

---

### 2. Frontend React Client Setup
Open a **second** terminal window:
```bash
cd client
npm install
npm start
```

Your browser will automatically open at:
👉 **`http://localhost:3000`**

---

## 🌐 Features Included
- **Home & Menu**: React-based interactive food catalog.
- **Login & Register**: Authentication forms.
- **Static Portal**: Campus registration and interactive star-rating / feedback.
- **Order Placement**: Express-based item selection and order processing.
- **Payment Gateway**: Simulated checkout workflow.
- **MongoDB Atlas Integration**: Live item inventory synced with cloud database.
