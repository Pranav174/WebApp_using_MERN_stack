const express = require("express");
const router = express.Router();
const auth = require('../middleware/authorize')

const Item = require("../models/Item");
const Order = require("../models/Order");
const User = require("../models/User");

router.post("/new", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        Item.findById(req.body.item_id, (err, item) => {
            if (err) res.status(400).json({ err: err })
            else if (!item) res.status(400).json({ err: "No item found" });
            else if (req.body.quantity < 1) res.status(400).json({ err: "Quantity less than 1" });
            else if (item.remaining < req.body.quantity) res.status(400).json({ err: "Less than that items remaining" });
            else if (item.canceled || item.ready || item.dispatched) res.status(400).json({ err: "Item not available" });
            else {
                const newOrder = new Order({
                    customer_id: req.user.id,
                    item_id: req.body.item_id,
                    vendor_id: item.vendor_id,
                    quantity: req.body.quantity
                });
                newOrder
                    .save()
                    .then(order => {
                        item.remaining -= order.quantity
                        update = { quantity_left: item.remaining }
                        if (item.remaining == 0) {
                            item.ready = true
                            update = { quantity_left: item.remaining, status: "P" }
                        }
                        Order.updateMany({ item_id: item.id }, update).catch(err => console.log(err))
                        item.save()
                        res.status(200).json(order)
                    })
                    .catch(err => res.status(400).json({ err: err }));
            }
        })
    }
});

router.get("/get/:order_id", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        Order.findById(req.params.order_id, (err, order) => {
            if (err) res.status(400).json({ err: err })
            else if (!order) res.status(400).json({ err: "No Order found" });
            else if (order.customer_id != req.user.id) res.status(400).json({ err: "Not authorized" });
            else {
                res.status(200).json(order)
            }
        })
    }
});

router.get("/get_list/:status", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        Order.find({ customer_id: req.user.id, status: req.params.status }).populate("vendor_id item_id").exec((err, orders) => {
            if (err) res.status(400).json({ err: err })
            else res.status(200).json(orders)
        })
    }
});

router.get("/dispatched", auth, (req, res) => {
    if (!req.user.vendor) res.status(400).json({ msg: "Only vendors" })
    else {
        Order.find({ vendor_id: req.user.id, status : "D" }).populate("customer_id item_id").exec((err, docs) => {
            if (err) res.status(400).json({ err: err });
            else res.status(200).json(docs);
        })
    }
});

router.post("/edit_quantity/:order_id", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        Order.findById(req.params.order_id, (err, order) => {
            if (err) res.status(400).json({ err: err })
            else if (!order) res.status(400).json({ err: "No Order found" });
            else if (req.body.quantity < 1) res.status(400).json({ err: "Quantity less than 1" });
            else if (order.customer_id != req.user.id) res.status(400).json({ err: "Not authorized" });
            else {
                Item.findById(order.item_id, (err, item) => {
                    if (err) res.status(400).json({ err: err })
                    else if (!item) res.status(400).json({ err: "No item found" });
                    else {
                        item.remaining += order.quantity
                        if (item.remaining < req.body.quantity) res.status(400).json({ err: "Less than that items remaining" });
                        else {
                            order.quantity = req.body.quantity
                            item.remaining -= order.quantity
                            update = { quantity_left: item.remaining }
                            if (item.remaining == 0) {
                                item.ready = true
                                update = { quantity_left: item.remaining, status: "P" }
                            }
                            console.log(item)
                            order.save().catch(err => console.log(err))
                            Order.updateMany({ item_id: item.id }, update).catch(err => console.log(err))
                            item.save().catch(err => console.log(err))
                            res.status(200).json(order);
                        }
                    }
                })
            }
        })
    }
});


router.post("/review_vendor/:order_id", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        rating = req.body.rating
        Order.findById(req.params.order_id, (err, order) => {
            if (err) res.status(400).json({ err: err })
            else if (!order) res.status(400).json({ err: "No Order found" });
            else if (order.customer_id != req.user.id) res.status(400).json({ err: "Not authorized" });
            else if (order.seller_rating != -1) res.status(400).json({ err: "already reviewed" });
            else if (rating > 10 || rating < 0) res.status(400).json({ err: "Invalid range" });
            else if (order.status != "P" && order.status != "D") res.status(400).json({ err: "not applicable order status" });
            else {
                User.findById(order.vendor_id, (err, user) => {
                    if (err) res.status(400).json({ err: err })
                    else if (!user) res.status(400).json({ err: "No Vendor found" });
                    else {
                        user.ratings.push(rating)
                        let sum = user.ratings.reduce((previous, current) => current += previous);
                        let avg = sum / user.ratings.length;
                        user.rating = avg
                        user.save()
                        order.seller_rating = rating
                        order.save()
                        Item.updateMany({ vendor_id: user.id }, { seller_rating: avg }).catch(console.log(err))
                        res.status(200).json(order)
                    }
                })
            }
        })
    }
    
})
router.post("/review_product/:order_id", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        Order.findById(req.params.order_id, (err, order) => {
            if (err) res.status(400).json({ err: err })
            else if (!order) res.status(400).json({ err: "No Order found" });
            else if (order.customer_id != req.user.id) res.status(400).json({ err: "Not authorized" });
            else if (order.reviewed) res.status(400).json({ err: "already reviewed" });
            else if (req.body.rating > 10 || req.body.rating < 0) res.status(400).json({ err: "Invalid range" });
            else if (order.status != "D") res.status(400).json({ err: "not applicable order status" });
            else {
                order.reviewed = true
                order.review = req.body.review
                order.product_rating = req.body.rating
                order
                .save()
                .then(order => res.status(200).json(order))
                    .catch(err => res.status(400).json({ err: err }));
                }
        })
    }
})

module.exports = router;