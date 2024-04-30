// ButtonClick.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import Leaderboard from './Leaderboard';
import { getBaseUrl } from '../auth/Config';

function ButtonClick() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const baseUrl = getBaseUrl();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = currentUser?.accessToken;
        const response = await axios.get(`${baseUrl}/api/count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching count:', error);
      }
    };
  
    if (currentUser) {
      fetchCount();
    }
  }, [currentUser, baseUrl]); 
  
  const handleButtonClick = async () => {
    setLoading(true);
    const token = currentUser?.accessToken;
    try {
      const response = await axios.post(`${baseUrl}/api/click`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCount(response.data.count);
    } catch (error) {
      console.error('Error updating count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100">
      <div className="order-2 lg:order-1 w-full lg:w-1/3 max-w-md px-3 py-6 lg:absolute lg:left-20 lg:top-1/2 lg:-translate-y-1/2  rounded-lg lg:shadow-none">
        <Leaderboard currentUserId={currentUser?._id} />
      </div>
      <div className="order-1 lg:order-2 w-full max-w-lg flex flex-col items-center justify-center px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Welcome {currentUser?.username}!</h2>
        <div className="mb-4 p-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-blue-500">Click Count: <span className="text-black">{count}</span></h1>
        </div>
        <button
          disabled={loading}
          className={`mb-2 px-4 py-2 text-lg rounded-lg text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} transition duration-300`}
          onClick={handleButtonClick}>
          {loading ? 'Adding...' : 'Click Me!'}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white text-lg rounded-lg hover:bg-red-700 transition duration-300"
          onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>


  );
}

export default ButtonClick;
