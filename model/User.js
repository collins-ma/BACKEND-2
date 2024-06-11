const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true // Add validation to ensure username is required
    },
    password: {
        type: String,
        required: true // Add validation to ensure password is required
    },
    roles: {
        type: [String],
        default: ["Employee"]
    },
    refreshToken:{
        type:String
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    active: {
        type: Boolean,
        default: true 
    }
}, {
    timestamps: true 
});

// Export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
