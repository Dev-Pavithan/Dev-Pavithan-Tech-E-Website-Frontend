import React, { useState } from 'react';
import LoginModal from './LoginModal'; // Adjust the import path as necessary
import RegisterModal from './RegisterModal.js'; // Adjust the import path as necessary
import { Button } from 'react-bootstrap';

export default function ParentComponent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginShow = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);

  const handleRegisterShow = () => setShowRegister(true);
  const handleRegisterClose = () => setShowRegister(false);

  return (
    <div>
      <Button variant="primary" onClick={handleLoginShow}>
        Open Login Modal
      </Button>
      <Button variant="secondary" onClick={handleRegisterShow}>
        Open Register Modal
      </Button>

      <LoginModal show={showLogin} handleClose={handleLoginClose} />
      <RegisterModal show={showRegister} handleClose={handleRegisterClose} />
    </div>
  );
}
