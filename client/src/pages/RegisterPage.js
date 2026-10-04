import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      setSuccessMessage(response.data.message || 'Registration successful! You can now log in.');
      reset();
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check connection.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h1>Customer Registration</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              {...register('name', {
                required: 'Full name is required.'
              })}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="field-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              {...register('email', {
                required: 'Email address is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address.'
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
              placeholder="Create Password"
              {...register('password', {
                required: 'Password is required.',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters.'
                }
              })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Registering Account...' : 'Register'}
          </button>
        </form>

        {successMessage && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <p className="form-message success">{successMessage}</p>
            <Link to="/login" style={{ color: '#e67e22', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}>
              Go to Login Page →
            </Link>
          </div>
        )}

        {errorMessage && (
          <p className="error-message" style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
