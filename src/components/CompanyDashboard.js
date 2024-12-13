

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostWork from './PostWork';
import WorkList from './WorkList';
import AcceptedWork from './AcceptedWorkList';
import Chatbot from './Chatbot';  // Import the chatbot component

const CompanyDashboard = () => {
  const [myWorks, setMyWorks] = useState([]);
  const [acceptedWorks, setAcceptedWorks] = useState([]);
  const [loadingAcceptedWorks, setLoadingAcceptedWorks] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('welcome');
  const [companyName, setCompanyName] = useState('Company Name');
  
  // Notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
  });

  useEffect(() => {
    fetchMyWorks();
  }, []);

  // Fetch posted works
  const fetchMyWorks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/company/works', {
        withCredentials: true,
      });
      setMyWorks(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError(error.response ? error.response.data : error.message);
    }
  };

  const fetchAcceptedWorks = async (workId) => {
    setLoadingAcceptedWorks(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/company/${workId}/counterworks`,
        { withCredentials: true }
      );
      setAcceptedWorks(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoadingAcceptedWorks(false);
    }
  };

  // Handle navigation view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Show notification
  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000); // Hide notification after 3 seconds
  };

  const handleWorkPosted = () => {
    showNotification('Work has been successfully posted!');
    fetchMyWorks(); // Refresh the list of works after posting
  };

  return (
    <div className="min-h-screen bg-cover bg-center">
      {/* Navbar */}
      <nav className="bg-blue-700 shadow-lg p-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-semibold">
            Company Dashboard
          </div>
          <div className="space-x-6 text-white">
            <button
              className={`hover:text-blue-300 ${
                currentView === 'postWork' ? 'font-bold underline' : ''
              }`}
              onClick={() => handleViewChange('postWork')}
            >
              Post Work
            </button>
            <button
              className={`hover:text-blue-300 ${
                currentView === 'myWorks' ? 'font-bold underline' : ''
              }`}
              onClick={() => handleViewChange('myWorks')}
            >
              View My Works
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        {/* Welcome Message */}
        {currentView === 'welcome' && (
          <div className="text-center mt-6 text-white text-2xl">
            <h2 className="font-semibold">Welcome, {companyName}!</h2>
            <p className="mt-4">
              Explore your dashboard to manage posted works, view accepted works,
              and interact with freelancers. Select an option from the menu to
              get started!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="text-red-500 text-center mb-4">{String(error)}</div>}

        {/* Conditionally render PostWork component */}
        {currentView === 'postWork' && <PostWork onWorkPosted={handleWorkPosted} />}

        {/* Conditionally render View My Works */}
        {currentView === 'myWorks' && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">My Posted Works</h3>
            <WorkList works={myWorks} onSeeStatus={fetchAcceptedWorks} />
            {loadingAcceptedWorks ? (
              <p className="text-white">Loading Accepted Works...</p>
            ) : acceptedWorks.length > 0 ? (
              <AcceptedWork works={acceptedWorks} />
            ) : (
              <p className="text-white mt-4">No countered works for selected work.</p>
            )}
          </div>
        )}
      </div>

      {/* Chatbot */}
      <div className="chatbot-container fixed bottom-10 right-10 z-50">
        <Chatbot />
      </div>

      {/* Notification */}
      {notification.visible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
          <p>{notification.message}</p>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;

