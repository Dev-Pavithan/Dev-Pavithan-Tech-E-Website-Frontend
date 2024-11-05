// RegisterModal.js
import React from 'react';
import { Modal } from 'react-bootstrap';
import Register from '../Register/Register.js'; 
import './RegisterModal.css';  
export default function RegisterModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
      <div className="register-modal-body">
        <Register />
      </div>
    </Modal>
  );
}
