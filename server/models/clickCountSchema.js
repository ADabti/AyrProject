//clickCountSchema.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
}, { collection: "AyrProjectUsers" }); //name of the collection in Mongodb is AyrProjectUsers

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
