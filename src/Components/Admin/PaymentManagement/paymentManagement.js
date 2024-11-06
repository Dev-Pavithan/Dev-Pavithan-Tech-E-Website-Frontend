import React, { useEffect, useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are imported
import '../UserManagement.css'; // Import the same CSS file for consistent styling

export default function PaymentManagement() {
  const { t, i18n } = useTranslation(); // Destructure t and i18n from useTranslation
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('https://tech-e-website-backend.vercel.app//api/payments/payment-intents');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment =>
    (payment.cardholderName || '').toLowerCase().includes(search.toLowerCase()) ||
    (payment.currency || '').toLowerCase().includes(search.toLowerCase()) ||
    (payment.amount ? payment.amount.toString() : '').includes(search)
  );

  const getCardIcon = (paymentMethodType) => {
    switch (paymentMethodType) {
      case 'visa':
        return <FaCcVisa size={24} className="payment-card-icon" />;
      case 'mastercard':
        return <FaCcMastercard size={24} className="payment-card-icon" />;
      case 'amex':
        return <FaCcAmex size={24} className="payment-card-icon" />;
      case 'discover':
        return <FaCcDiscover size={24} className="payment-card-icon" />;
      default:
        return <FaCcVisa size={24} className="payment-card-icon" />;
    }
  };

  // Function to change language
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="container mt-4 user-management-container"> {/* Use the same class for styling */}
      <h2 className="user-management-heading mb-4">{t('Payment Management')}</h2> {/* Use the translation function */}

      {/* Language Selection */}
      <div className="mb-3">
        <select className="form-select" onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="es">Spanish</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      {/* Search Input */}
      <div className="row mb-3"> {/* Use the same row structure as UserManagement */}
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control search-input" // Use the same input class for styling
            placeholder={t('Search by Card Holder Name, Currency, or Amount')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Details Table - Added Scrollable Div */}
      <div className="table-responsive">
        <table className="user-table table table-hover table-striped"> {/* Use the same table class for styling */}
          <thead>
            <tr>
              <th scope="col">{t('Card Holder Name')}</th>
              <th scope="col">{t('Amount')}</th>
              <th scope="col">{t('Currency')}</th>
              <th scope="col">{t('Card Type')}</th>
              <th scope="col">{t('Date')}</th>
              <th scope="col">{t('Time')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.paymentIntentId}>
                  <td>{payment.cardholderName || 'N/A'}</td>
                  <td>${(payment.amount / 100).toFixed(2)}</td>
                  <td>{payment.currency ? payment.currency.toUpperCase() : 'N/A'}</td>
                  <td>
                    {payment.payment_method_types && payment.payment_method_types.length > 0
                      ? getCardIcon(payment.payment_method_types[0])
                      : <FaCcVisa size={24} className="payment-card-icon" />}
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(payment.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">{t('No payments found')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
