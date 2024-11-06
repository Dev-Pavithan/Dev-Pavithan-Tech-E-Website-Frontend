// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Login.css';
// import Google from './google.png';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadGoogleAPI = () => {
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.onload = () => {
//         window.google.accounts.id.initialize({
//           client_id: 'ClientID   = 488070785140-t2v9rar79lbj7s7e88f9juad3doq1qct.apps.googleusercontent.com', 
//           callback: handleGoogleResponse,
//         });
//       };
//       script.onerror = () => {
//         console.error('Failed to load Google API script');
//       };
//       document.body.appendChild(script);
//     };

//     loadGoogleAPI();
//   }, []);

//   const handleGoogleResponse = async (response) => {
//     if (response.credential) {
//       try {
//         const decodedData = JSON.parse(atob(response.credential.split('.')[1])); 
//         const userData = {
//           email: decodedData.email,
//           name: decodedData.name,
//           id: decodedData.sub,
//         };

//         const loginResponse = await axios.post('https://tech-e-website-backend.vercel.app/user/login', userData);

//         storeUserDetails(loginResponse.data);

//         toast.success('Login successful! Redirecting...', {
//           position: 'top-right',
//           autoClose: 5000,
//         });

//         handleRedirect(loginResponse.data.role);
//       } catch (error) {
//         console.error('Google login failed:', error);
//         toast.error('Google login failed. Please try again.');
//       }
//     } else {
//       console.error('Google login failed. No credential received.');
//       toast.error('Google login failed. Please try again.');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { email, password } = formData;

//     if (!email || !password) {
//       toast.error('Please provide both email and password.');
//       return;
//     }

//     try {
//       const loginResponse = await axios.post('https://tech-e-website-backend.vercel.app/user/login', formData);
      
//       storeUserDetails(loginResponse.data);

//       toast.success('Login successful! Redirecting...', {
//         position: 'top-right',
//         autoClose: 5000,
//       });

//       handleRedirect(loginResponse.data.role);
//     } catch (error) {
//       console.error('Login failed:', error);
//       toast.error('Invalid email or password. Please try again.');
//     }
//   };

//   const storeUserDetails = ({ name, email, blocked, role, packages, userId, token }) => {
//     sessionStorage.setItem('role', role);
//     sessionStorage.setItem('userId', userId);
//     sessionStorage.setItem('token', token);
//     sessionStorage.setItem('isLoggedIn', true); 

//     localStorage.setItem('userName', name);
//     localStorage.setItem('userEmail', email);
//     localStorage.setItem('userBlocked', blocked);
//     localStorage.setItem('userRole', role);
//     localStorage.setItem('userPackages', JSON.stringify(packages)); 
//   };

//   const handleRedirect = (role) => {
//     const paymentAmount = sessionStorage.getItem('tempPaymentAmount'); 
//     if (paymentAmount && role !== 'admin') {
//       sessionStorage.removeItem('tempPaymentAmount'); 
//       navigate('/payment'); 
//     } else if (role === 'admin') {
//       navigate('/admin'); 
//     } else {
//       navigate('/'); 
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group password-group">
//             <label htmlFor="password">Password</label>
//             <div className="password-container">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 className="form-control"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? 'Hide' : 'Show'}
//               </button>
//             </div>
//           </div>

//           <div className="form-group">
//             <a href="#!" className="forgot-password">Forgot Password?</a>
//           </div>

//           <button type="submit" className="btn-primary">Login</button>

//           <div className="register-prompt">
//             <p>
//               Don't have an account?{' '}
//               <Link to="/register" className="register-link">
//                 Register
//               </Link>
//             </p>
//           </div>

//           <div className="register-divider">
//             <span>or</span>
//           </div>

//           <button
//             type="button"
//             className="google-button"
//             onClick={() => window.google.accounts.id.prompt()}
//           >
//             <img className="GoogleImageIcon" src={Google} alt="Google" /> Sign in with Google
//           </button>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Google from './google.png';
import './Login.css';

// Custom hook to handle form input changes
const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return [formData, handleChange];
};

// Utility function to store user details
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

// Utility function to handle redirection based on role
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

export default function Login() {
  const [formData, handleChange] = useForm({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: '488070785140-t2v9rar79lbj7s7e88f9juad3doq1qct.apps.googleusercontent.com', 
          callback: handleGoogleResponse,
        });
      };
      script.onerror = () => {
        console.error('Failed to load Google API script');
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

        const loginResponse = await axios.post('https://tech-e-website-backend.vercel.app/user/login', userData);

        storeUserDetails(loginResponse.data);

        toast.success('Login successful! Redirecting...', { position: 'top-right', autoClose: 5000 });

        handleRedirect(loginResponse.data.role, navigate);
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
      const loginResponse = await axios.post('https://tech-e-website-backend.vercel.app/user/login', formData);

      storeUserDetails(loginResponse.data);

      toast.success('Login successful! Redirecting...', { position: 'top-right', autoClose: 5000 });

      handleRedirect(loginResponse.data.role, navigate);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <a href="#!" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary">Login</button>

          <div className="register-prompt">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="register-link">
                Register
              </Link>
            </p>
          </div>

          <div className="register-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="google-button"
            onClick={() => window.google.accounts.id.prompt()}
          >
            <img className="GoogleImageIcon" src={Google} alt="Google" /> Sign in with Google
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
