import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Components/LandingPage/Home';
import Features from './Components/Features/features.js';
import Blog from './Components/Blog/Blog.js'
import UserAvailablePackages from './Components/AvailablePackages/UserAvailablePackages.js';
import Contact from './Components/Contact/contact';
import Payment from './Components/Payment/Payment';
import PayLogin from './Components/Payment/PayLogin/paylogin.js';
import Packages from './Components/Packages/packages.js';

import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminHome from './Components/Admin/AdminHome.js';
import UserManagement from './Components/Admin/UserTable';
import PackageManagement from './Components/Admin/PackageManagement';
import Message from './Components/Admin/ManageMessages';
import PaymentManagement from './Components/Admin/PaymentManagement/paymentManagement';
import Avatermaintain from './Components/Admin/ModelMaintain/avatermaintain.js';
import AdFooter from './Components/Admin/AdminFooter/AdFooter.js';
import Settings from './Components/Admin/Settings';

import LoginModal from './Components/Login/LoginModal.js';
import RegisterModal from './Components/Register/RegisterModal.js';
import Footer from './Components/Footer/footer';
import Nav from './Components/Navbar/Nav';
import ContactModal from './Components/Contact/contact.js';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import ta from "./locales/ta.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    ta: { translation: ta }

   
  },
  lng: localStorage.getItem('language') || 'en', 
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});


export default function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Modal state handlers
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); // Contact Modal state

  // State to manage redirection after login
  const [redirectToPayment, setRedirectToPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to open login modal
  const openLoginModal = (pkg) => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    if (pkg) {
      setRedirectToPayment(true);
      setSelectedPackage(pkg);
    }
  };

  // Close login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Function to open register modal
  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  // Function to handle redirection after login
  const handleLoginSuccess = () => {
    closeLoginModal();
    if (redirectToPayment && selectedPackage) {
      navigate('/payment');
      setRedirectToPayment(false);
    }
    checkLoginStatus();
  };

  // Function to check login status from localStorage
  const checkLoginStatus = () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userBlocked = localStorage.getItem('userBlocked');
    const userRole = localStorage.getItem('userRole');
    const userPackages = localStorage.getItem('userPackages');

    if (!userName || !userEmail || userBlocked === 'true' || !userRole || !userPackages) {
      setIsLoggedIn(false);
      // You can decide to show the login modal here or keep it closed
      // openLoginModal(); // Uncomment if you want to show the login modal in this case
    } else {
      setIsLoggedIn(true);
    }
  };

  // Open the contact modal
  const openContactModal = () => {
    setShowContactModal(true);
  };

  // Close the contact modal
  const closeContactModal = () => {
    setShowContactModal(false);
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status only on mount
  }, []);

  return (
    <>
      {!isAdminRoute && <Nav openLoginModal={openLoginModal} />}

      <Routes>
        {/* Non-admin routes */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="/userAvailablePackages" element={<UserAvailablePackages />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/paylogin" element={<PayLogin />} />
        <Route path="/packages" element={<Packages/>} />
        <Route path="/payment" element={<Payment />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="packages" element={<PackageManagement />} />
          <Route path="messages" element={<Message />} />
          <Route path="avatermaintain" element={<Avatermaintain />} />
          <Route path="settings" element={<Settings />} />
          <Route path="paymentsDetails" element={<PaymentManagement />} />
        </Route>
      </Routes>

      <LoginModal
        show={showLoginModal}
        handleClose={closeLoginModal}
        openRegisterModal={openRegisterModal}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        show={showRegisterModal}
        handleClose={closeRegisterModal}
        openLoginModal={openLoginModal}
      />

      {/* Contact Modal */}
      <ContactModal show={showContactModal} handleClose={closeContactModal} />

      {!isAdminRoute && <Footer />}
    </>
  );
}
