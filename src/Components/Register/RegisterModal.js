import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Google from './google.png';
import './RegisterModal.css';

// Load Google API
const loadGoogleScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

export default function RegisterModal({ show, handleClose, openLoginModal }) {
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
                client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
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
            const response = await axios.post('https://tech-e-website-backend.vercel.app/user/register', formData);
            console.log('Registration successful', response.data);

            toast.success('Registration successful! You can now log in.', {
                position: "top-right",
                autoClose: 3000,
            });

            // Redirect to the login page after 5 seconds
            setTimeout(() => {
                navigate('/'); // Redirect to login or homepage after registration
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
            const userData = {
                name: response.profileObj.name,
                email: response.profileObj.email,
                id: response.profileObj.sub,
            };

            try {
                const res = await axios.post('https://tech-e-website-backend.vercel.app/user/register', userData);
                console.log('Google Registration successful:', res.data);
                toast.success('Registration successful! You can now log in.', {
                    position: "top-right",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate('/'); // Redirect to homepage after registration
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
        <Modal show={show} onHide={handleClose} className="register-modal">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <form onSubmit={handleSubmit} className="register-form">
                    <h2 className="login-head">Register</h2>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control name-input"
                            id="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control email-input"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control password-input"
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
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control password-input"
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

                    <button type="submit" className="btn-primary btn-rgister">Register</button>

                    <div className="register-prompt">
                        <p>
                            Already have an account? 
                            <span onClick={() => { handleClose(); openLoginModal(); }} className="login-link">
                                Login
                            </span>
                        </p>
                    </div>

                    <div className="register-divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="google-button" onClick={() => window.google.accounts.id.prompt()}>
                        <img className="GoogleImageIcon" src={Google} alt="Google" /> Sign up with Google
                    </button>
                </form>
            </Modal.Body>
            <ToastContainer />
        </Modal>
    );
}
