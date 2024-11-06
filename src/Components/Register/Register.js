import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './register.css';
import Google from './google.png';

// Load Google API
const loadGoogleScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadGoogleScript().then(() => {
      window.google.accounts.id.initialize({
        client_id: '488070785140-t2v9rar79lbj7s7e88f9juad3doq1qct.apps.googleusercontent.com', // Replace with your Google Client ID
        callback: handleGoogleResponse,
      });
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7100/user/register', formData);
      console.log('Registration successful', response.data);

      toast.success('Registration successful! You can now log in.', {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 5000);

    } catch (error) {
      console.error('Registration failed', error);
      const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      // Extract user data from the response
      const userData = {
        name: response.profileObj.name,
        email: response.profileObj.email,
        id: response.profileObj.sub,
      };

      try {
        const res = await axios.post('http://localhost:7100/user/register', userData);
        console.log('Google Registration successful:', res.data);
        toast.success('Registration successful! You can now log in.', {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } catch (error) {
        console.error('Google registration failed:', error);
        const errorMessage = error.response?.data?.message || 'Failed to register with Google. Please try again.';
        toast.error(errorMessage);
      }
    } else {
      toast.error('Google registration failed. Please check your browser settings.');
    }
  };

  return (
    <div className="Register-container">
      <div className="Register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group password-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary">Register</button>

          <div className="register-prompt">
            <p>Already have an account? <Link to="/login" className="register-link">Login</Link></p>
          </div>

          <div className="register-divider">
            <span>or</span>
          </div>

          <button type="button" className="google-button" onClick={() => window.google.accounts.id.prompt()}>
            <img className="GoogleImageIcon" src={Google} alt="Google" /> Sign up with Google
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
