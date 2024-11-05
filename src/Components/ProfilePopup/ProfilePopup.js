// ProfilePopup.js
import React from 'react';
import './ProfilePopup.css'; // Make sure to create a CSS file for styling

const ProfilePopup = ({ onClose }) => {
  // Retrieve user data from localStorage
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="profile-popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>User Profile</h3>
        <p><strong>Name:</strong> {userName || 'Not available'}</p>
        <p><strong>Email:</strong> {userEmail || 'Not available'}</p>
        <p><strong>Role:</strong> {userRole || 'Not available'}</p>
      </div>
    </div>
  );
};

export default ProfilePopup;
