// Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import io from 'socket.io-client';
import { getBaseUrl } from '../auth/Config';
import { GiLaurelCrown } from 'react-icons/gi'; // Importing specific icons

const baseUrl = getBaseUrl();
const socket = io(baseUrl);

function Leaderboard({ currentUserId }) {
    const [topUsers, setTopUsers] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = currentUser?.accessToken;  // Update to use accessToken
                const response = await axios.get(`${baseUrl}/api/leaderboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTopUsers(response.data.topUsers.slice(0, 3)); // Only take the top 3 users
                if (response.data.currentUserInTop) {
                    setCurrentUserRank(null); // Do not show the current user if they are in the top 3
                } else if (response.data.currentUserData && response.data.currentUserData.rank > 3) {
                    setCurrentUserRank(response.data.currentUserData); // Show current user only if they are not in the top 3
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };
    
        if (currentUser) {
          fetchLeaderboard();
        }
    
        socket.on('countUpdated', (data) => {
            if (currentUser) {
              fetchLeaderboard();
            }
        });
    
        return () => {
            socket.off('countUpdated');
        };
    }, [currentUser]);
    
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Leaderboard</h2>
            <div className="mt-2 sm:mt-4">
                <div className="flex justify-between text-gray-800 font-semibold px-2 sm:px-3">
                    <span>User</span>
                    <span>Clicks</span>
                </div>
                {topUsers.map((user, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 sm:p-3 m-2 ${user._id === currentUserId ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-700'} rounded-lg shadow`}>
                        <span className="flex-1 text-left font-medium">
                            {index + 1}. {user.username} {index === 0 && <GiLaurelCrown className="inline ml-2 text-yellow-400"/>}
                        </span>
                        <span className="w-16 sm:w-20 text-right font-semibold">{user.count}</span>
                    </div>
                ))}
                {currentUserRank && topUsers.length === 3 && (
                    <div className="text-center text-gray-700 my-2">
                        ...
                    </div>
                )}
                {currentUserRank && (
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 text-gray-700 rounded-lg shadow mt-1 sm:mt-2">
                        <span className="flex-1 text-left font-medium">{currentUserRank.rank}. {currentUserRank.username}</span>
                        <span className="w-16 sm:w-20 text-right font-semibold">{currentUserRank.count}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
