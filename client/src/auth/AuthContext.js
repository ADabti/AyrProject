//AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBaseUrl } from './Config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = getBaseUrl()

    const login = (accessToken, refreshToken, username) => {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('username', username);
        setCurrentUser({ accessToken, refreshToken, username });
    };
    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        const refreshToken = sessionStorage.getItem('refreshToken');
        const username = sessionStorage.getItem('username'); 
        if (accessToken && refreshToken && username) {
            setCurrentUser({ accessToken, refreshToken, username });
        }
        setLoading(false);
    }, []);

    const logout = () => {
        sessionStorage.clear(); // Clear all session storage before logout
        setCurrentUser(null);
    };

    const refreshTokenFunction = async () => {
        const response = await fetch(`${baseUrl}/api/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: currentUser.refreshToken })
        });
        const data = await response.json();
        if (data.accessToken) {
            login(data.accessToken, currentUser.refreshToken, currentUser.username); // Re-login with new access token
        } else {
            logout(); 
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, refreshTokenFunction }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
