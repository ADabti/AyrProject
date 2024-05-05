// Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import io from 'socket.io-client';
import { getBaseUrl } from '../auth/Config';
import { FaCrown } from "react-icons/fa";

const baseUrl = getBaseUrl();
const socket = io(baseUrl);

function Leaderboard() {
    const [topUsers, setTopUsers] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const token = currentUser?.accessToken;
            const response = await axios.get(`${baseUrl}/api/leaderboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTopUsers(response.data.topUsers.slice(0, 3));
            // Determine if the current user is within the top 3
            const isInTopThree = response.data.topUsers.some(user => user._id === currentUser._id);
            // If not in the top 3 then set their rank
            const currentUserData = response.data.currentUserData;
            if (currentUserData && !isInTopThree) {
                setCurrentUserRank(currentUserData);
            } else {
                setCurrentUserRank(null);
            }
        };

        if (currentUser) {
          fetchLeaderboard();
        }

        socket.on('countUpdated', () => {
          if (currentUser) {
            fetchLeaderboard();
          }
        });

        return () => {
            socket.off('countUpdated');
        };
    }, [currentUser]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    const UserRow = ({ user, index }) => (
        <div key={user._id} className={`flex items-center justify-between p-2 sm:p-3 m-2 ${user.username === currentUser.username ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-700'} rounded-lg shadow`}>
            <span className="flex-1 text-left font-medium">
                {index + 1}. {capitalizeFirstLetter(user.username)} {index === 0 && <FaCrown className="inline ml-2 text-blue-600"/>}
            </span>
            <span className="w-16 sm:w-20 text-right font-semibold">{user.count}</span>
        </div>
    );
    
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Leaderboard</h2>
            <div className="mt-2 sm:mt-4">
                <div className="flex justify-between text-gray-800 font-semibold px-2 sm:px-3">
                    <span>User</span>
                    <span>Clicks</span>
                </div>
                {topUsers.map((user, index) => <UserRow user={user} index={index} />)}
                {currentUserRank && (
                    <>
                        <div className="text-center text-gray-700 my-2">...</div>
                        <UserRow user={currentUserRank} index={currentUserRank.rank - 1} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
