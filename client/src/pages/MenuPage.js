import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/api/items')
      .then(res => setItems(res.data))
      .catch(() => setError('Error Loading Menu'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p style={{ color: '#666' }}>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#d93025' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Canteen Menu</h1>
        <p>Available items from today's inventory</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-menu">
          <p>No items in the inventory right now.</p>
          <Link to="/mongodb">
            <button>Add Items via MongoDB Panel</button>
          </Link>
        </div>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <div key={item._id} className="menu-item-card">
              <div className="item-icon">{item.icon || '🍽️'}</div>
              <div className="item-content">
                <div className="item-title-row">
                  <h3>{item.name}</h3>
                  <span className="item-price">₹{item.price}</span>
                </div>
                <div className="item-action">
                  <Link to={`/order?item=${encodeURIComponent(item.name)}`}>
                    <button className="order-item-btn">Order</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuPage;
