import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MongoDBItems from './pages/MongoDBItems';

import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="logo">🍴 Canteen Food</div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/order">Order</Link>
          <Link to="/mongodb">Inventory</Link>

          {user ? (
            <div className="auth-user-section">
              <span className="user-greeting">👋 Hi, {user.name}</span>
              <button onClick={logout} className="logout-nav-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mongodb" element={<MongoDBItems />} />
      </Routes>

      <footer>
        <p>© 2026 Canteen Food Ordering System</p>
      </footer>
    </div>
  );
}

export default App;
