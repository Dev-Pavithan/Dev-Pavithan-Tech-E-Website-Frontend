import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './nav.css';
import logo from './Logo version04.png';
import ContactModal from '../Contact/contact.js'; // Import the ContactModal component

export default function Nav({ openLoginModal }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); // State to show/hide the contact modal
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role === 'user') {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      try {
        const response = await fetch(`http://localhost:7100/user/by-email/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          fetchPackageDetails(userData.packages);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const fetchPackageDetails = async (packageIds) => {
    try {
      const packageDetails = await Promise.all(
        packageIds.map(async (packageId) => {
          const response = await fetch(`http://localhost:7100/api/packages/${packageId}`);
          if (response.ok) {
            const packageData = await response.json();
            return packageData.name;
          } else {
            console.error('Error fetching package data:', response.statusText);
            return 'Unknown Package';
          }
        })
      );
      setPackages(packageDetails);
    } catch (error) {
      console.error('Error fetching package details:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    toast.success('Logout successful!');
    openLoginModal();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleProfilePopover = () => {
    setShowProfilePopover((prev) => !prev);
  };

  const handleContactClick = () => {
    setShowContactModal(true); // Open the contact modal when Contact Us is clicked
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false); // Close the contact modal
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <Link to="/" className="navbar-brand" onClick={handleLogoClick}>
          <img alt="Logo" src={logo} className="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/blog">Blog</Link>
            {/* Updated Contact Us link to open the modal */}
            <span className="nav-link" onClick={handleContactClick}>Contact Us</span>
          </div>
        </div>

        <div className="navbar-nav ms-auto">
          {isLoggedIn ? (
            <>
              <div className="nav-link" onClick={toggleProfilePopover} title="Profile">
                <i className="fas fa-user-circle"></i>
              </div>

              {showProfilePopover && user && (
                <div className="profile-popover">
                  <div className="popover-content">
                    <h5>{user.name || 'User'}</h5>
                    <p>Email: {user.email}</p>
                    <h6>User Packages:</h6>
                    <ul>
                      {packages.length > 0 ? (
                        packages.map((pkgName, index) => (
                          <li key={index}>{pkgName}</li>
                        ))
                      ) : (
                        <li>No packages subscribed.</li>
                      )}
                    </ul>
                    <button onClick={handleLogout} className="btn btn-out">Logout</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="nav-link" onClick={openLoginModal}>
              <i className="fas fa-user"></i> Login
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />

      <ToastContainer />
    </nav>
  );
}
