//Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getBaseUrl } from '../auth/Config';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser, login } = useAuth();
    const baseUrl = getBaseUrl();

    useEffect(() => {
        if (currentUser) {
            navigate('/button-click');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/api/users/login`, { username, password });
            if (response.data.accessToken && response.data.refreshToken) {  
                login(response.data.accessToken, response.data.refreshToken, response.data.username);
                navigate('/button-click');
            } else {
                alert('Login failed, no token received');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-lg">
                <h2 className="text-lg text-center font-bold mb-8">
                    Welcome to ClickMe,<br />
                    where you can click as much as you want!
                </h2>
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
                    <button type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button onClick={() => navigate('/register')} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-700 bg-transparent hover:bg-blue-50">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
