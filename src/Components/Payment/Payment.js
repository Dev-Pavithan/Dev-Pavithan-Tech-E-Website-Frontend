// export default Payment;
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Payment.css';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51Q0TEXRvwjj18J6TooOsxJF8J8IweJyuMZdyc2p8M2bGJEihjAdAwbfUpavDZVfN9j5AAxUbOVt6JvjbHQSczIC600myHW2EBv');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  // New states for amount and package details
  const [amount, setAmount] = useState(0);
  const [packageDetails, setPackageDetails] = useState({ name: '', description: '' });

  useEffect(() => {
    // Fetch package details and amount from sessionStorage
    const storedAmount = sessionStorage.getItem('paymentAmount');
    const storedPackageName = sessionStorage.getItem('selectedPackageName');
    const storedPackageDescription = sessionStorage.getItem('selectedPackageDescription');

    // Update state with retrieved values
    if (storedAmount) setAmount(parseInt(storedAmount, 10)); 
    if (storedPackageName && storedPackageDescription) {
      setPackageDetails({
        name: storedPackageName,
        description: storedPackageDescription,
      });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder's name");
      setLoading(false);
      return;
    }

    try {
      // Create PaymentIntent with the dynamic amount in cents
      const response = await axios.post('http://localhost:7100/api/payments/payment-intent', {
        amount,
        cardholderName,
      });

      const { clientSecret } = response.data;

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (error) {
        toast.error('Payment failed: ' + error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success(`Payment of $${(amount / 100).toFixed(2)} successful! Thank you for your purchase.`, {
          position: "top-right", 
          autoClose: 3000, // Set auto close to 3 seconds
        });

        // Clear session storage
        sessionStorage.removeItem('paymentAmount');
        sessionStorage.removeItem('selectedPackageName');
        sessionStorage.removeItem('selectedPackageDescription');

        // Retrieve current packages from local storage
        const userPackages = JSON.parse(localStorage.getItem('userPackages')) || [];

        // Create new package object
        const newPackage = {
          id: sessionStorage.getItem('selectedPackageId'), 
          name: packageDetails.name,
          description: packageDetails.description,
          price: amount,
          date: new Date().toISOString(), // Store the date of purchase
        };

        // Update user packages
        userPackages.push(newPackage);

        // Save updated packages to local storage
        localStorage.setItem('userPackages', JSON.stringify(userPackages));

        // Save purchase details to the backend (if needed)
        await axios.post('http://localhost:7100/api/packages/purchase', {
          userId: sessionStorage.getItem('userId'),
          packageId: sessionStorage.getItem('selectedPackageId'),
          name: packageDetails.name,
          description: packageDetails.description,
          price: amount,
        });

        // Redirect based on package price after 3 seconds
        setTimeout(() => {
          if (amount === 1000) { // pkg.price = 10
            window.location.href = 'http://localhost:3001';
          } else if (amount === 4999) { // pkg.price = 49.99
            window.location.href = 'http://localhost:3002';
          } else if (amount === 10000) { // pkg.price = 100
            window.location.href = 'http://localhost:5173';
          } else {
            window.location.href = '/'; // Default redirect
          }
        }, 3000);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h4 className="mb-4">Enter Card Details</h4>

      {/* Cardholder Name Input Field */}
      <div className="form-group mb-3">
        <label htmlFor="cardholderName">Cardholder Name</label>
        <input
          type="text"
          id="cardholderName"
          className="form-control"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
      </div>

      {/* Card Element Input */}
      <div className="form-group mb-3">
        <CardElement className="form-control" />
      </div>

      {/* Package Details */}
      <div className="mb-3">
        <p><strong>Package Name:</strong> {packageDetails.name}</p>
        <p><strong>Description:</strong> {packageDetails.description}</p>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-100" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`} 
      </button>
    </form>
  );
};

const Payment = () => (
  <div className="container payment-container">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card p-4 mt-5">
          <h2 className="text-center mb-4">Complete Your Payment</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
);

export default Payment;

