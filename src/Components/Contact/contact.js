import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS
import './contactModal.css';

export default function ContactModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:7100/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' }); // Reset form including phone
        handleClose(); // Close modal
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="contact-modal">
        <Modal.Header closeButton className="modal-header">
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form onSubmit={handleSubmit} className="contact-form">
            <Modal.Title className="contact-head">Contact Us</Modal.Title>

            <Form.Group controlId="name">
              <Form.Label className="form-label">Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label className="form-label">Email</Form.Label>
              <Form.Control
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="phone" className="mt-3">
              <Form.Label className="form-label">Phone</Form.Label>
              <Form.Control
                type="tel"
                className="form-control"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="message" className="mt-3">
              <Form.Label className="form-label">Message</Form.Label>
              <Form.Control
                as="textarea"
                className="form-control"
                rows={3}
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </Form.Group>

            <Button className="mt-3 contact-button" variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
