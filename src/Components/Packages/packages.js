import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TechE from './Logo version04.png'
import './package.css';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();  // Initialize navigate here

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('https://tech-e-website-backend.vercel.app');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handlePackageClick = (pkg) => {
    sessionStorage.setItem('selectedPackageId', pkg._id);
    sessionStorage.setItem('paymentAmount', pkg.price * 100);
    sessionStorage.setItem('selectedPackageName', pkg.name);
    sessionStorage.setItem('selectedPackageDescription', pkg.description);

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      toast.info("You need to log in to access this package.");
    } else {
      toast.success("Proceeding to payment.");
      navigate('/payment');  // Use navigate to go to /payment page
    }
  };

  return (
    <div className="appContainer">
      {/* <div className="pricingContainer">
        <ul className="cardList">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <li key={pkg._id} className="cardItem">
                <a href="#" className="cardLink" onClick={() => handlePackageClick(pkg)}>
                  <img src={pkg.images[0]} className="cardImage" alt={pkg.name} />
                  <div className="cardOverlay">
                    <div className="cardHeader">
                      <svg className="cardArc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                      <img className="cardThumb" src="https://i.imgur.com/7D7I6dI.png" alt="Tech-E logo" />
                      <div className="cardHeaderText">
                        <h3 className="cardTitle">{pkg.name}</h3>
                        <span className="cardStatus">${pkg.price}</span>
                      </div>
                    </div>
                    <ul className="cardDescription">
                      {pkg.description.split('\n').map((point, index) => (
                        <li key={index} className="bulletPoint">{point}</li>
                      ))}
                    </ul>
                  </div>
                </a>
              </li>
            ))
          ) : (
            <p className="noPackages">No packages available</p>
          )}
        </ul>
      </div> */}

      <div className="pricing-container">
        <ul class="cards">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <li key={pkg._id} >
                <a href="" class="packagecard" onClick={() => handlePackageClick(pkg)}>
                  <img src={pkg.images[0]} class="card__image" alt="" />
                  <div class="card__overlay">
                    <div class="card__header">
                      <svg class="card__arc" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                        <path fill="var(--surface-color)" d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
                      </svg>
                      <img class="card__thumb" src={TechE} alt="Tech-E logo" />
                      <div class="card__header-text">
                        <h3 class="card__title">{pkg.name}</h3>
                        <span class="card__status">${pkg.price}</span>
                      </div>
                    </div>
                    <p class="card__description">
                      {pkg.description.split('\n').map((point, index) => (
                        <li key={index} className="bulletPoint">{point}</li>
                      ))}
                    </p>
                  </div>
                </a>
              </li>
            ))
          ) : (
            <p className="noPackages">No packages available</p>
          )}
        </ul>
      </div>

    </div>
  );
}
