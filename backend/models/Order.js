const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    item_id: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    quanity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "W"
        // W for waiting, P for placed, D for dispatched, C for canceled
    },
    review: {
        tpye: String,
        default: ""
    },
    product_rating: {
        type: Number,
        default: -1
    },
    seller_rating: {
        type: Number,
        default: -1
    }
});

module.exports = Order = mongoose.model("orders", OrderSchema);