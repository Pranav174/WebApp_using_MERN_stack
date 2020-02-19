const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    item_id: {
        type: Schema.Types.ObjectId,
        ref: 'items'
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "W"
        // W for waiting, P for placed, D for dispatched, C for canceled
    },
    date: {
        type: Date,
        default: Date.now
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    review: {
        type: String,
        default: ""
    },
    product_rating: {
        type: Number,
        default: -1
    },
    seller_rating: {
        type: Number,
        default: -1
    },
    quantity_left: {
        type: Number,
        default: 0
    }
});

module.exports = Order = mongoose.model("orders", OrderSchema);