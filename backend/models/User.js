const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    vendor: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        default: -1
    }
});

module.exports = User = mongoose.model("users", UserSchema);