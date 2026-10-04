import React, { useEffect, useState } from 'react';
import API from '../api';

function MongoDBItems() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    icon: '🍽️'
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await API.get('/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await API.post('/api/items', {
        name: formData.name,
        price: Number(formData.price),
        icon: formData.icon
      });

      setFormData({ name: '', price: '', icon: '🍽️' });
      setMessage(`"${formData.name}" added successfully.`);
      fetchItems();
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Unable to add item.');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setMessage('');
    setIsError(false);

    try {
      await API.delete(`/api/items/${id}`);
      setMessage(`"${name}" was deleted successfully.`);
      fetchItems();
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to delete item.');
    }
  };

  return (
    <div className="page">
      <div className="mongo-card">
        <h1>Item Manager</h1>

        {/* Items list */}
        <div className="mongo-list">
          {items.length === 0 ? (
            <p style={{ color: '#888', fontSize: '14px' }}>No items yet. Add one below.</p>
          ) : (
            items.map((item) => (
              <div className="mongo-item" key={item._id}>
                <span style={{ fontSize: '22px', marginRight: '10px' }}>{item.icon || '🍽️'}</span>
                <span><strong>{item.name}</strong></span>
                <span style={{ marginLeft: 'auto', color: '#e67e22', fontWeight: 'bold', marginRight: '14px' }}>₹{item.price}</span>
                <button
                  type="button"
                  className="delete-item-btn"
                  onClick={() => handleDeleteItem(item._id, item.name)}
                  title={`Delete ${item.name}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add item form */}
        <form onSubmit={handleSubmit} className="mongo-form">
          <div className="field-group">
            <label>Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Samosa"
              required
            />
          </div>

          <div className="field-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 30"
              min="1"
              required
            />
          </div>

          <div className="field-group">
            <label>Icon (paste any emoji)</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g. 🍕"
              maxLength={4}
            />
          </div>

          <button type="submit">Add Item to Menu</button>
        </form>

        {message && (
          <p
            className={isError ? 'error-message' : 'form-message success'}
            style={{ marginTop: '14px', textAlign: 'center' }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default MongoDBItems;
