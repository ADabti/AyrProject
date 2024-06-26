//Register.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getBaseUrl } from '../auth/Config';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const baseUrl = getBaseUrl();

    useEffect(() => {
        if (currentUser) {
            navigate('/button-click');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsRegistering(true);
        const formattedUsername = username.charAt(0).toLowerCase() + username.slice(1);
        try {
            await axios.post(`${baseUrl}/api/users/register`, { username: formattedUsername, password });
            alert('User registered successfully');
            navigate('/login');
        } catch (error) {
            alert('Failed to register');
        } finally {
            setIsRegistering(false); 
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-lg">
                <h2 className="text-lg text-center font-bold mb-8">Join the ClickMe community!</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </label>
                    </div>
                    <button type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isRegistering ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isRegistering ? 'Registering...' : 'Register'}
                    </button>
                    <button onClick={() => navigate('/login')} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-100">
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
