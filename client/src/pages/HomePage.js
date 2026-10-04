import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    API.get('/api/items')
      .then(res => setFeaturedItems(res.data.slice(0, 4)))
      .catch(() => {}); // Fail silently on home page
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Welcome to Canteen Food Ordering</h1>
        <p>Fresh, Fast and Delicious Food at Your Campus</p>
        <Link to="/menu" className="hero-button-link">
          <button>Order Now</button>
        </Link>
      </section>

      {featuredItems.length > 0 && (
        <section className="food-section">
          <h2>Popular Food Items</h2>
          <div className="food-container">
            {featuredItems.map(item => (
              <div key={item._id} className="food-card">
                <div className="food-icon">{item.icon || '🍽️'}</div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <Link to={`/order?item=${encodeURIComponent(item.name)}`}>
                  <button>Order</button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
