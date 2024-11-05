import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminHome.css';
import CalendarComponent from './CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faCalendar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function Home() {
  const [data, setData] = useState({ total: 0, active: 0, blocked: 0 });
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [packages, setPackages] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); // New state for user modal
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    fetchData();
    fetchPackages();
    fetchRecentTransactions();
    fetchTotalIncome();
  }, []);

  const fetchData = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      const userResponse = await axios.get('http://localhost:7100/user/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = userResponse.data;
      const total = users.length;
      const active = users.filter(user => !user.blocked).length;
      const blocked = total - active;

      animateCountUp(total, setData, 'total');
      setData(prev => ({ ...prev, active, blocked }));

      // Fetching messages from the new endpoint
      const messageResponse = await axios.get('http://localhost:7100/contact/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const messages = messageResponse.data || [];
      const recentMessages = messages.slice(0, 5);
      setMessages(recentMessages);
      animateCountUp(messages.length, setMessageCount);

      const recentTransactions = JSON.parse(sessionStorage.getItem('transactions')) || [];
      const newNotifications = [
        ...recentMessages.map(msg => ({
          type: 'message',
          message: `New message from ${msg.name}: "${msg.message}"`, // Include message content here
          timestamp: msg.timestamp,
          id: msg.id,
        })),
        ...recentTransactions.map(transaction => ({
          type: 'transaction',
          message: `Transaction from ${transaction.cardholderName}`,
          timestamp: transaction.createdAt,
          id: transaction.id,
        })),
      ];

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({ total: 0, active: 0, blocked: 0 });
      setMessages([]);
      setNotifications([]);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:7100/api/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:7100/api/payments/payment-intents');
      setRecentTransactions(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  };

  const fetchTotalIncome = async () => {
    try {
      const response = await axios.get('http://localhost:7100/api/payments/payment-intents');
      const totalIncome = response.data.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
      setTotalIncome(totalIncome);
    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  const animateCountUp = (total, setValue, field = 'messageCount') => {
    let start = 0;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / total));
    const counter = () => {
      if (start < total) {
        start += 1;
        if (field === 'total') {
          setValue(prev => ({ ...prev, total: start }));
        } else {
          setValue(start);
        }
        setTimeout(counter, stepTime);
      }
    };
    counter();
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
    clearNotification('transaction', transaction.id);
  };

  const handleMessageClick = (message) => {
    clearNotification('message', message.id);
  };

  const clearNotification = (type, id) => {
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
    setUnreadCount(prev => prev - 1);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleUserIconClick = () => {
    // Retrieve user data from localStorage
    const userDataFromStorage = JSON.parse(localStorage.getItem('userData')); // Assuming 'userData' key in localStorage
    setUserData(userDataFromStorage); // Set user data
    setShowUserModal(true); // Show user modal
  };

  const donutChartData = {
    labels: ['Active', 'Blocked'],
    datasets: [{
      data: [data.active, data.blocked],
      backgroundColor: ['#5e226d','#e783d7' ],
      borderColor: ['#ffffff3b', '#ffffff3b'],
      borderWidth: 2,
    }],
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex justify-content-end align-items-center mt-3">
          <FontAwesomeIcon
            icon={faBell}
            className="icon"
            onClick={() => setShowNotificationsModal(true)} // Show the notifications modal
          />
          <span className="notification-count">{unreadCount}</span>
          <FontAwesomeIcon icon={faCalendar} onClick={() => setShowCalendar(true)} className="icon" />
          <FontAwesomeIcon icon={faUserCircle} className="icon" onClick={handleUserIconClick} /> {/* Add click handler */}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-4 d-flex flex-column">
          <div className="total-users card">
            <h5 className="HomeH5">Total Users</h5>
            <p className="message-count">{data.total}</p>
          </div>
          <div className="total-messages card">
            <h5 className="HomeH5">Total Messages</h5>
            <p className="message-count">{messageCount}</p>
          </div>
        </div>

        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="done-chart">
            <Doughnut data={donutChartData} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="package-list card">
            <h5 className="av-HomeH5">Available Packages</h5>
            {packages.length > 0 ? (
              packages.map((pkg, index) => (
                <div key={index} className="package-card-Admin card mb-3">
                  <div className="card-body">
                    <h5 className="package-name">{pkg.name}</h5>
                    <p className="package-description">{pkg.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No packages available</p>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <div className="payment-section card">
            <h5 className="HomeH5">Total Income: ${(totalIncome / 100).toFixed(2)}</h5>
            <div className="recent-transactions">
              <h6>Recent Transactions</h6>
              {recentTransactions.length > 0 ? (
                <ul className="transaction-list">
                  {recentTransactions.map((transaction, index) => (
                    <li key={index} className="transaction-item" onClick={() => handleTransactionClick(transaction)}>
                      <p><strong>Card Holder:</strong> {transaction.cardholderName}</p>
                      <p><strong>Amount:</strong> ${(transaction.amount / 100).toFixed(2)}</p>
                      <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent transactions</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="recent-messages card">
            <h5 className="HomeH5">Recent Messages</h5>
            {messages.length > 0 ? (
              <ul className="message-list">
                {messages.map((msg, index) => (
                  <li key={index} className="message-item" onClick={() => handleMessageClick(msg)}>
                    <div className="message-avatar">
                      <FontAwesomeIcon icon={faUserCircle} className="avatar-icon" />
                    </div>
                    <div className="message-content">
                      <strong>{msg.name}</strong>
                      <p>{msg.message}</p> 
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent messages</p>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <Modal show={showNotificationsModal} onHide={() => setShowNotificationsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length > 0 ? (
            <ul className="notification-list">
              {notifications.map((notification, index) => (
                <li key={index} className="notification-item">
                  <p>{notification.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={clearAllNotifications}>Clear All</Button>
        </Modal.Footer>
      </Modal>

      {/* Calendar Modal */}
      <Modal show={showCalendar} onHide={() => setShowCalendar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarComponent date={selectedDate} setDate={setSelectedDate} />
        </Modal.Body>
      </Modal>

      {/* User Info Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userData ? (
            <>
              <p><strong>Name:</strong> {userData.userName}</p>
              <p><strong>Email:</strong> {userData.userEmail}</p>
              <p><strong>Role:</strong> {userData.userRole}</p>
              <p><strong>Blocked:</strong> {userData.userBlocked ? 'Yes' : 'No'}</p>
            </>
          ) : (
            <p>No user data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <>
              <p><strong>Card Holder:</strong> {selectedTransaction.cardholderName}</p>
              <p><strong>Amount:</strong> ${(selectedTransaction.amount / 100).toFixed(2)}</p>
              <p><strong>Currency:</strong> {selectedTransaction.currency?.toUpperCase() || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedTransaction.createdAt).toLocaleTimeString()}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
