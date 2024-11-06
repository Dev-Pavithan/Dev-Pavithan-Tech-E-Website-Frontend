import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './AvailablePackages.css';

export default function UserAvailablePackages({ show, handleClose }) {
  const [packageDetails, setPackageDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userPackages = JSON.parse(localStorage.getItem('userPackages'));

    if (userPackages && userPackages.length) {
      const fetchPackageDetails = async () => {
        try {
          const packagePromises = userPackages.map((packageId) =>
            fetch(`http://localhost:7100/api/packages/${packageId}`).then((res) => res.json())
          );
          const packageData = await Promise.all(packagePromises);
          setPackageDetails(packageData);
          setLoading(false);
        } catch (err) {
          setError('Failed to load package details');
          setLoading(false);
        }
      };

      fetchPackageDetails();
    } else {
      setLoading(false);
    }
  }, []);

  const handleGoClick = (pkg) => {
    const hasPurchasedPackage = true; // Replace with actual logic to check if the user has purchased the package
    if (hasPurchasedPackage) {
      const price = parseFloat(pkg.price);
      const redirectMap = {
        10: 'http://localhost:3001',
        49.99: 'http://localhost:3002',
        100: 'http://localhost:5173',
      };

      const redirectUrl = redirectMap[price];
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("No URL mapped for this package price.");
      }
    } else {
      console.warn("User has not purchased this package.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="package-modal1">
      <Modal.Header closeButton>
        <h2 className="h2">Your Packages</h2>
      </Modal.Header>
      <Modal.Body className="modal-body-packages">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="package-container-packages">
            <div className="package-list">
              {packageDetails.length > 0 ? (
                packageDetails.map((pkg) => (
                  <div key={pkg.id} className="package-item">
                    <div className="package-content">
                      <h3>{pkg.name}</h3>
                      <p>{pkg.description}</p>
                      <p><strong>Price:</strong> ${pkg.price}</p>
                    </div>
                    <button 
                      className="go-button" 
                      onClick={() => handleGoClick(pkg)}
                    >
                      GO
                    </button>
                  </div>
                ))
              ) : (
                <p>No packages available.</p>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
