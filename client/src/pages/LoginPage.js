import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await API.post('/api/auth/login', {
        email: data.email,
        password: data.password
      });

      setIsError(false);
      setMessage(response.data.message || `Welcome, ${response.data.user.name}!`);

      if (response.data.user) {
        login(response.data.user);
        setTimeout(() => {
          navigate(redirectPath);
        }, 800);
      }
    } catch (error) {
      setIsError(true);
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h1>Customer Login</h1>

        {location.state?.message && (
          <p style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '10px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center',
            border: '1px solid #ffeeba'
          }}>
            {location.state.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email.'
                }
              })}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              {...register('password', {
                required: 'Password is required.'
              })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <p
            className={`form-message ${isError ? '' : 'success'}`}
            style={isError ? { color: '#d93025', marginTop: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' } : { marginTop: '16px', textAlign: 'center' }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: '18px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#e67e22', fontWeight: 'bold' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
