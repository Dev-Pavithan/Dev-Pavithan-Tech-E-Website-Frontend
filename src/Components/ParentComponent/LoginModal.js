import React from 'react';
import { Modal } from 'react-bootstrap';
import Login from '../Login/Login'; 
import './LoginModal.css';  // Custom CSS for any specific overrides

export default function LoginModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
      <div className="login-modal-body">
        <Login />
      </div>
    </Modal>
  );
}
