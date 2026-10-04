import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const initialItem = queryParams.get('item') || '';

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    foodItem: initialItem,
    quantity: 1,
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Protect route: require login to place order
  useEffect(() => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname + location.search,
          message: 'Please login to place an order.'
        },
        replace: true
      });
    }
  }, [user, navigate, location]);

  // Fetch items from DB on load
  useEffect(() => {
    API.get('/api/items')
      .then(res => {
        setMenuItems(res.data);
        // Set the initially selected item object
        const init = res.data.find(i => i.name === (initialItem || res.data[0]?.name));
        if (init) {
          setSelectedItem(init);
          setFormData(f => ({ ...f, foodItem: init.name }));
        }
      })
      .catch(() => setFetchError('Could not load items from server.'));
  }, []);

  // Keep selectedItem in sync with dropdown choice
  useEffect(() => {
    const found = menuItems.find(i => i.name === formData.foodItem);
    setSelectedItem(found || null);
  }, [formData.foodItem, menuItems]);

  const totalAmount = selectedItem ? selectedItem.price * Number(formData.quantity) : 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/api/orders', formData);
      navigate('/payment', { state: { order: response.data } });
    } catch (err) {
      // Fallback in-memory order if server is unreachable
      const localOrder = {
        _id: 'temp-' + Date.now(),
        customerName: formData.customerName,
        foodItem: formData.foodItem,
        quantity: Number(formData.quantity),
        phoneNumber: formData.phoneNumber,
        amount: totalAmount
      };
      navigate('/payment', { state: { order: localOrder } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h1>Place Your Order</h1>

        {fetchError && <p className="error-message" style={{ marginBottom: '14px' }}>{fetchError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="customerName">Customer Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              placeholder="Enter your name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="foodItem">Food Item</label>
            <select
              id="foodItem"
              name="foodItem"
              value={formData.foodItem}
              onChange={handleChange}
              required
            >
              {menuItems.length === 0 && (
                <option value="">Loading items...</option>
              )}
              {menuItems.map(item => (
                <option key={item._id} value={item.name}>
                  {item.icon} {item.name} — ₹{item.price}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {selectedItem && (
            <div className="amount-box">
              Total: ₹{selectedItem.price} × {formData.quantity} = <strong>₹{totalAmount}</strong>
            </div>
          )}

          <button type="submit" disabled={loading || menuItems.length === 0}>
            {loading ? 'Processing...' : 'Proceed to Payment →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderPage;
