import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the order that was placed on OrderPage
  const order = location.state?.order;

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // If someone accessed /payment directly without placing an order
  if (!order) {
    return (
      <div className="page">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h1>No Active Order</h1>
          <p style={{ color: '#666', margin: '15px 0 25px' }}>
            Please select your food items and place an order first.
          </p>
          <Link to="/order">
            <button>Go to Order Page</button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await axios.post('http://localhost:5000/api/orders/confirm-payment', {
        orderId: order._id,
        paymentMethod
      });
    } catch (err) {
      console.warn('Backend payment status update skipped:', err.message);
    } finally {
      setTimeout(() => {
        setProcessing(false);
        setPaymentSuccess(true);
      }, 800);
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setRatingSubmitted(true);
  };

  return (
    <div className="page">
      <div className="form-card" style={{ maxWidth: '480px' }}>
        {!paymentSuccess ? (
          <div>
            <h1>Payment Gateway</h1>

            {/* Read-only Order Summary: User never re-types item or quantity! */}
            <div className="details-box">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Food Item:</strong> {order.foodItem}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total Payable:</strong> ₹{order.amount}</p>
            </div>

            <form onSubmit={handlePayment}>
              <div className="field-group">
                <label htmlFor="method">Select Payment Method</label>
                <select
                  id="method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash at Counter">Cash on Pickup / Counter</option>
                </select>
              </div>

              <div className="amount-box">
                Amount to Pay: ₹<strong>{order.amount}</strong>
              </div>

              <button type="submit" disabled={processing}>
                {processing ? 'Processing Payment...' : `Pay Now`}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 style={{ color: '#0a7a2d' }}>🎉 Payment Confirmed!</h1>

            <div className="details-box">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Item:</strong> {order.foodItem} (Qty: {order.quantity})</p>
              <p><strong>Amount Paid:</strong> ₹{order.amount}</p>
              <p><strong>Payment Mode:</strong> {paymentMethod}</p>
              <p><strong>Status:</strong> <span style={{ color: '#0a7a2d', fontWeight: 'bold' }}>Confirmed</span></p>
            </div>

            {!ratingSubmitted ? (
              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#333' }}>Rate Your Experience</h3>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 12px' }}>
                  Rating: {rating} / 5
                </p>
                {rating > 0 && (
                  <button onClick={handleRatingSubmit} style={{ marginBottom: '12px' }}>
                    Submit Feedback
                  </button>
                )}
              </div>
            ) : (
              <p style={{ color: '#0a7a2d', fontWeight: 'bold', margin: '15px 0', textAlign: 'center' }}>
                Thank you for your rating!
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Link to="/menu" style={{ flex: 1 }}>
                <button style={{ width: '100%', background: '#555' }}>Order More</button>
              </Link>
              <Link to="/" style={{ flex: 1 }}>
                <button style={{ width: '100%' }}>Back to Home</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
