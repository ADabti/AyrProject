// socket.js
const socketIo = require('socket.io');
let io; 

exports.initialize = (server) => {
    io = socketIo(server, {
        cors: {
            origin: ["http://ayrproject.s3-website.us-east-2.amazonaws.com", "https://ayrproject.onrender.com", "http://localhost:5000", "http://localhost:3000"],
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        },
        pingTimeout: 10000,
        pingInterval: 5000
    });

    io.on('connection', (socket) => {
        console.log('New client connected, socket id:', socket.id);
        socket.on('disconnect', (reason) => {
            console.log(`Client disconnected, reason: ${reason}`);
        });
        socket.on('error', (err) => {
            console.log('Socket.IO error:', err);
        });
    });

    return io;
};

exports.getIo = () => {
    if (!io) {
        console.error("Socket.io is not initialized - access denied.");
        throw new Error("Socket.io not initialized");
    }
    return io;
};
