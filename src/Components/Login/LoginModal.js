import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Google from './google.png';
import './LoginModel.css';

const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    return [formData, handleChange, setFormData];
};

const storeUserDetails = ({ name, email, blocked, role, packages, userId, token }) => {
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userBlocked', blocked);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userPackages', JSON.stringify(packages));
};

const handleRedirect = (role, navigate) => {
    const paymentAmount = sessionStorage.getItem('tempPaymentAmount');
    if (paymentAmount && role !== 'admin') {
        sessionStorage.removeItem('tempPaymentAmount');
        navigate('/payment');
    } else if (role === 'admin') {
        navigate('/admin');
    } else {
        navigate('/');
    }
};

export default function LoginModal({ show, handleClose, openRegisterModal }) {
    const [formData, handleChange, setFormData] = useForm({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadGoogleAPI = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = () => {
                window.google.accounts.id.initialize({
                    client_id: ' 488070785140-t2v9rar79lbj7s7e88f9juad3doq1qct.apps.googleusercontent.com', // Replace with your actual Google client ID
                    callback: handleGoogleResponse,
                });
            };
            script.onerror = () => {
                console.error('Failed to load Google API script');
                toast.error('Failed to load Google API. Please try again later.');
            };
            document.body.appendChild(script);
        };

        loadGoogleAPI();
    }, []);

    const handleGoogleResponse = async (response) => {
        if (response.credential) {
            try {
                const decodedData = JSON.parse(atob(response.credential.split('.')[1]));
                const userData = {
                    email: decodedData.email,
                    name: decodedData.name,
                    id: decodedData.sub,
                };

                const loginResponse = await axios.post('http://localhost:7100/user/login', userData);
                storeUserDetails(loginResponse.data);
                toast.success('Login successful! Redirecting...', { position: 'top-right', autoClose: 5000 });

                // Close the modal and navigate after a delay
                handleCloseModal();
                setTimeout(() => {
                    handleRedirect(loginResponse.data.role, navigate);
                }, 5000);
            } catch (error) {
                console.error('Google login failed:', error);
                toast.error('Google login failed. Please try again.');
            }
        } else {
            console.error('Google login failed. No credential received.');
            toast.error('Google login failed. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        if (!email || !password) {
            toast.error('Please provide both email and password.');
            return;
        }
        try {
            const loginResponse = await axios.post('http://localhost:7100/user/login', formData);
            storeUserDetails(loginResponse.data);
            toast.success('Login successful! Redirecting...', { position: 'top-right', autoClose: 5000 });

            // Close the modal first
            handleCloseModal();

            // Redirect after closing modal with a delay
            setTimeout(() => {
                handleRedirect(loginResponse.data.role, navigate);
            }, 5000);  // 5 seconds delay
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.status === 401) {
                toast.error('Invalid email or password. Please try again.');
            } else {
                toast.error('Login failed. Please try again later.');
            }
        }
    };

    const handleCloseModal = () => {
        handleClose(); // Close the modal
        setFormData({ email: '', password: '' }); // Reset form data
    };

    return (
        <Modal show={show} onHide={handleCloseModal} className="login-modal">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-head">Login</h2>
                    <div className="form-group email-group">
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
                    <div className="form-group forgot-password-group">
                        <a href="#!" className="forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="btn-primary login-button">Login</button>
                    <div className="register-prompt">
                        <p className="register-text">
                            Don't have an account?{' '}
                            <p onClick={openRegisterModal} className="register-link">
                                Register
                            </p>
                        </p>
                    </div>
                    <div className="register-divider">
                        <span className="divider-line"></span>
                        <span className="divider-text">OR</span>
                        <span className="divider-line"></span>
                    </div>
                    <button
                        type="button"
                        className="google-button"
                        onClick={() => window.google.accounts.id.prompt()}
                    >
                        <img className="GoogleImageIcon" src={Google} alt="Google" /> Sign in with Google
                    </button>
                </form>
            </Modal.Body>
            <ToastContainer />
        </Modal>
    );
}
