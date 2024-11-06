import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './UserManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserManagement() {
  const { t } = useTranslation(); // Initialize translation function
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error(t('Unauthorized! Please log in.')); // Translate message
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://tech-e-website-backend.vercel.app/user/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        toast.error(t('Failed to fetch users. Please try again later.')); // Translate message
      }
    };

    fetchUsers();
  }, [navigate, t]);

  const handleSearch = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(`https://tech-e-website-backend.vercel.app/user/by-email/${searchEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setFilteredUsers([response.data]);
      } else {
        toast.error(t('User not found.')); // Translate message
        setFilteredUsers([]);
      }
    } catch (error) {
      toast.error(t('User not found.')); // Translate message
      setFilteredUsers([]);
    }
  };

  const handleBlockToggle = async (id, currentlyBlocked) => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.patch(`https://tech-e-website-backend.vercel.app/user/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.map(user => (user._id === id ? { ...user, blocked: !currentlyBlocked } : user)));
      toast.success(response.data.message); // This should also be translated if applicable
    } catch (error) {
      toast.error(t('Failed to toggle user block status.')); // Translate message
    }
  };

  return (
    <div className="container mt-4 user-management-container">
      <h2 className="user-management-heading mb-4">{t('Manage Users')}</h2>

      <div className="row mb-3">
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control search-input"
            placeholder={t('Search by email')} // Translate placeholder
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <button onClick={handleSearch} className="btn btn-primary w-100">{t('Search')}</button> {/* Translate button text */}
        </div>
      </div>

      <div className="table-responsive">
        <table className="user-table table table-hover table-striped">
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Email')}</th>
              <th>{t('Role')}</th>
              <th>{t('Status')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {(filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.blocked ? t('Blocked') : t('Active')}</td> {/* Translate status */}
                <td>
                  <button
                    onClick={() => handleBlockToggle(user._id, user.blocked)}
                    className={`btn ${user.blocked ? 'btn-success' : 'btn-danger'}`}
                  >
                    {user.blocked ? t('Unblock') : t('Block')} {/* Translate button text */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
