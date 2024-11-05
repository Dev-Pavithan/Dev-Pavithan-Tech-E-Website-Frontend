import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './avatarMaintain.css';
import 'react-toastify/dist/ReactToastify.css';

export default function AvatarMaintain() {
  const { t, i18n } = useTranslation(); // Use useTranslation to get t function and i18n
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile || !email) {
      toast.error(t('Please select a file and provide an email')); // Use translation for error message
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('email', email);

    try {
      const response = await axios.post('http://localhost:7100/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadedImageUrl = response.data.imageUrl;
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('uploadedImageUrl', uploadedImageUrl);
      
      setUploadedImages((prevImages) => [...prevImages, uploadedImageUrl]);

      toast.success(t('Image uploaded successfully!')); // Use translation for success message
      setEmail('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading image', error);
      toast.error(t('Failed to upload image')); // Use translation for error message
    }
  };

  const handleEdit = async () => {
    const storedEmail = sessionStorage.getItem('email');
    const storedImageUrl = sessionStorage.getItem('uploadedImageUrl');

    if (!storedEmail || !storedImageUrl) {
      toast.error(t('No email or image URL found in session storage.')); // Use translation
      return;
    }

    try {
      await axios.post('http://localhost:7100/api/images/edit', { 
        email: storedEmail,
        imageUrl: storedImageUrl
      });
      toast.success(t('Image link sent via email!')); // Use translation
      setEmail('');
    } catch (error) {
      console.error('Error sending email', error);
      toast.error(t('Failed to send email')); // Use translation
    }
  };

  // Language switch function
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="avatar-maintain-container">
      <h1 className="title">{t('Avatar Maintenance')}</h1>
      
      

      <div className="row ManageSection">
        <div className="upload-section">
          <form onSubmit={handleUpload} className="upload-form">
            <h2 className="form-title">{t('Upload Your Avatar')}</h2>
            <div className="input-group">
              <label htmlFor="email" className="input-label">{t('Email:')}</label>
              <input
                type="email"
                id="email"
                className="input-field"
                value={email}
                onChange={handleEmailChange}
                placeholder={t('Enter Developer Email')}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="image" className="input-label">{t('Upload Image:')}</label>
              <input
                type="file"
                id="image"
                className="input-field"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn-m btn-m-upload">
                <i className="bi bi-upload"></i> {t('Check Avatar')}
              </button>
              <button type="button" onClick={handleEdit} className="btn-m btn-m-email">
                <i className="bi bi-envelope-fill"></i> {t('Send Email')}
              </button>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <h2 className="preview-title">{t('Preview Images')}</h2>
          <div className="image-preview-container">
            {uploadedImages.length > 0 ? (
              uploadedImages.map((url, index) => (
                <div key={index} className="image-card">
                  <img src={url} alt={`Uploaded avatar ${index}`} className="img-fluid" />
                </div>
              ))
            ) : (
              <p className="no-images">{t('No images uploaded yet.')}</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
