//Config.js
export const getBaseUrl = () => {
    if (window.location.hostname === "localhost") {
        // Specify your local backend URL
        return "http://localhost:5000"; 
    } else {
        // Production backend URL
        return "https://ayrproject.onrender.com";
    }
};
