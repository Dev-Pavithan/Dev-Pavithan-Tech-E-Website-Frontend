// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import './AdminDashboard.css';

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [profileImage, setProfileImage] = useState('');
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Step 1: Sidebar toggle state

//   const userName = localStorage.getItem('userName') || 'Admin';
//   const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';

//   const getButtonClassName = (path) => {
//     return location.pathname === path ? 'btn btn-primary active' : 'btn btn-primary';
//   };

//   useEffect(() => {
//     if (location.pathname === '/admin') {
//       navigate('/admin/home');
//     }

//     const fetchUserProfileImage = async () => {
//       try {
//         const res = await axios.get('http://localhost:7100/user/profile-image', {
//           headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
//         });
//         setProfileImage(res.data.profileImageUrl || 'path/to/default-placeholder.png');
//       } catch (error) {
//         console.error('Error fetching profile image:', error);
//       }
//     };

//     fetchUserProfileImage();
//   }, [location.pathname, navigate]);

//   const handleHomeNavigation = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate('/');
//   };

//   const handleToggleSidebar = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed); // Step 3: Toggle sidebar state
//   };

//   return (
//     <div className="admin-dashboard">
//       <div className="left-navbar">
//         <h1
//           style={{ cursor: 'pointer' }}
//           onClick={handleHomeNavigation}
//         >
//           Tech-E Admin
//         </h1>

//         <div className="profile-section">
//           <img
//             src={profileImage}
//             alt="User Profile"
//             className="profile-image"
//           />
//           <h3 className="user-name">{userName}</h3>
//           <p className="admin-email">{userEmail}</p>
//         </div>

//         <button className={getButtonClassName('/admin/home')} onClick={() => navigate('/admin/home')}>
//           <i className="bi bi-house-door-fill"></i> Home
//         </button>
//         <button className={getButtonClassName('/admin/users')} onClick={() => navigate('/admin/users')}>
//           <i className="bi bi-person-fill"></i> Manage Users
//         </button>
//         <button className={getButtonClassName('/admin/messages')} onClick={() => navigate('/admin/messages')}>
//           <i className="bi bi-envelope-fill"></i> Manage Messages
//         </button>
//         <button className={getButtonClassName('/admin/packages')} onClick={() => navigate('/admin/packages')}>
//           <i className="bi bi-box-fill"></i> Manage Packages
//         </button>
//         <button className={getButtonClassName('/admin/paymentsDetails')} onClick={() => navigate('/admin/paymentsDetails')}>
//           <i className="bi bi-credit-card-fill"></i> Payment Details
//         </button>
//         <button className={getButtonClassName('/admin/avatermaintain')} onClick={() => navigate('/admin/avatermaintain')}>
//           <i className="bi bi-puzzle-fill"></i> Avatars Model
//         </button>
//         <button className={getButtonClassName('/admin/settings')} onClick={() => navigate('/admin/settings')}>
//           <i className="bi bi-gear-fill"></i> Settings
//         </button>

//         {/* <label className="bb8-toggle">
//           <input
//             className="bb8-toggle__checkbox"
//             type="checkbox"
//             onChange={handleToggleSidebar} // Step 3: Handle toggle change
//           />
//           <div className="bb8-toggle__container">
//             <div className="bb8-toggle__scenery">
//               <div className="bb8-toggle__scenery">
//                 <div className="bb8-toggle__star"></div>
//                 <div className="bb8-toggle__star"></div>
//                 <div className="bb8-toggle__star"></div>
//                 <div className="bb8-toggle__star"></div>
//                 <div className="bb8-toggle__star"></div>
//                 <div className="bb8-toggle__star"></div>
//                 <div className="bb8-toggle__star"></div>
//                 <div className="tatto-1"></div>
//                 <div className="tatto-2"></div>
//                 <div className="gomrassen"></div>
//                 <div className="hermes"></div>
//                 <div className="chenini"></div>
//                 <div className="bb8-toggle__cloud"></div>
//                 <div className="bb8-toggle__cloud"></div>
//                 <div className="bb8-toggle__cloud"></div>
//               </div>
//               <div className="bb8">
//                 <div className="bb8__head-container">
//                   <div className="bb8__antenna"></div>
//                   <div className="bb8__antenna"></div>
//                   <div className="bb8__head"></div>
//                 </div>
//                 <div className="bb8__body"></div>
//               </div>
//               <div className="artificial__hidden">
//                 <div className="bb8__shadow"></div>
//               </div>
//             </div>
//           </div>
//         </label> */}
//       </div>
//       <div className={`right-section ${isSidebarCollapsed ? 'collapsed' : ''}`}> {/* Step 2: Conditional class */}
//         <Outlet />
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { t } = useTranslation(); // Integrating i18n translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const userName = localStorage.getItem('userName') || 'Admin';
  const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';

  const getButtonClassName = (path) => {
    return location.pathname === path ? 'btn btn-primary active' : 'btn btn-primary';
  };

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/home');
    }

    const fetchUserProfileImage = async () => {
      try {
        const res = await axios.get('http://localhost:7100/user/profile-image', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        setProfileImage(res.data.profileImageUrl || 'path/to/default-placeholder.png');
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchUserProfileImage();
  }, [location.pathname, navigate]);

  const handleHomeNavigation = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="admin-dashboard">
      <div className="left-navbar">
        <h1
          style={{ cursor: 'pointer' }}
          onClick={handleHomeNavigation}
        >
          {t('Tech-E Admin')}
        </h1>

        <div className="profile-section">
          <img
            src={profileImage}
            alt="User Profile"
            className="profile-image"
          />
          <h3 className="user-name">{userName}</h3>
          <p className="admin-email">{userEmail}</p>
        </div>

        <button className={getButtonClassName('/admin/home')} onClick={() => navigate('/admin/home')}>
          <i className="bi bi-house-door-fill"></i> {t('Home')}
        </button>
        <button className={getButtonClassName('/admin/users')} onClick={() => navigate('/admin/users')}>
          <i className="bi bi-person-fill"></i> {t('Manage Users')}
        </button>
        <button className={getButtonClassName('/admin/messages')} onClick={() => navigate('/admin/messages')}>
          <i className="bi bi-envelope-fill"></i> {t('Manage Messages')}
        </button>
        <button className={getButtonClassName('/admin/packages')} onClick={() => navigate('/admin/packages')}>
          <i className="bi bi-box-fill"></i> {t('Manage Packages')}
        </button>
        <button className={getButtonClassName('/admin/paymentsDetails')} onClick={() => navigate('/admin/paymentsDetails')}>
          <i className="bi bi-credit-card-fill"></i> {t('Payment Details')}
        </button>
        <button className={getButtonClassName('/admin/avatermaintain')} onClick={() => navigate('/admin/avatermaintain')}>
          <i className="bi bi-puzzle-fill"></i> {t('Avatars Model')}
        </button>
        <button className={getButtonClassName('/admin/settings')} onClick={() => navigate('/admin/settings')}>
          <i className="bi bi-gear-fill"></i> {t('Settings')}
        </button>

        
      </div>

      <div className={`right-section ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}
