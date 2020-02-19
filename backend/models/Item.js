const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    remaining: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    canceled: {
        type: Boolean,
        default: false
    },
    ready: {
        type: Boolean,
        default: false
    },
    dispatched: {
        type: Boolean,
        default: false
    },
    seller_rating: {
        type: Number,
        default: -1
    }

});

module.exports = Item = mongoose.model("items", ItemSchema);