//clickRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userSchema.js');
const authenticate = require('../auth/authenticate.js');
const socket = require('../auth/socket.js');

// Route to get the current count
router.get('/count', authenticate, async (req, res) => {
  try {
    // Find the user based on the ID from the authentication token
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ count: user.count });
  } catch (error) {
    console.error("Error fetching user's count:", error);
    res.status(500).send(error.message);
  }
});

// Route to increment the count
router.post('/click', authenticate, async (req, res) => {
  try {
    // Use the authenticated user's ID to find and update the user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { count: 1 },
        $set: { lastUpdated: new Date() } 
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    const io = socket.getIo();
    io.emit('countUpdated', { user: user.username, count: user.count });
    res.json(user);
  } catch (error) {
    console.log("Error in /click route:", error);
    res.status(500).send(error.message);
  }
});
//route to get leaderboard info
router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ count: -1, lastUpdated: 1 })
      .limit(3);
    const currentUser = req.user;

    let currentUserInTop = topUsers.findIndex(user => user._id.equals(currentUser._id)) !== -1;
    let currentUserData = null;

    if (!currentUserInTop) {
      const allUsers = await User.find().sort({ count: -1, lastUpdated: 1 });
      const rank = allUsers.findIndex(user => user._id.equals(currentUser._id)) + 1;
      currentUserData = { rank, username: currentUser.username, count: currentUser.count };
    }

    res.json({
      topUsers,
      currentUserInTop,
      currentUserData
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard data", error: error.message });
  }
});

module.exports = router;
