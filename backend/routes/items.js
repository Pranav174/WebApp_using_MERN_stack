const express = require("express");
const router = express.Router();
const auth = require('../middleware/authorize')
const FuzzySearch = require('fuzzy-search');
const Item = require("../models/Item");
const User = require("../models/User");
const Order = require("../models/Order");

router.post("/create", auth, (req, res) => {
    if (!req.user.vendor) res.status(400).json({ err: "Only vendors" })
    else if (req.body.price < 1 || req.body.quantity < 1) res.status(400).json({ err: "Need positive price and quantity" })
    else {

        const newItem = new Item({
            vendor_id: req.user.id,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            remaining: req.body.quantity,
        });
        newItem
            .save()
            .then(item => res.status(200).json(item))
            .catch(err => res.status(400).json({ err: err }));
    }
});

router.get("/", auth, (req, res) => {
    if (!req.user.vendor) res.status(400).json({ err: "Only vendors" })
    else {
        Item.find({ vendor_id: req.user.id, ready: false, canceled: false, dispatched: false }, (err, docs) => {
            if (err) res.status(400).json({ err: err });
            else res.status(200).json(docs);
        })
    }
});

router.get("/ready_to_dispatch", auth, (req, res) => {
    if (!req.user.vendor) res.status(400).json({ err: "Only vendors" })
    else {
        Item.find({ vendor_id: req.user.id, ready: true, canceled: false, dispatched: false }, (err, docs) => {
            if (err) res.status(400).json({ err: err });
            else res.status(200).json(docs);
        })
    }
});

router.post("/cancel/:id", auth, (req, res) => {
    if (!req.user.vendor) res.status(400).json({ err: "Only vendors" })
    else {
        Item.findById(req.params.id, (err, item) => {
            if (err) res.status(400).json({ err: err })
            else if (!item) res.status(400).json({ err: "No item found" });
            else if (item.vendor_id != req.user.id) res.status(400).json({ err: "the item doesn't belong to this vendor" });
            else if (item.canceled) res.status(400).json({ err: "already canceled" });
            else if (item.dispatched) res.status(400).json({ err: "already dispatched" });
            else {
                item.canceled = true;
                item.save().then(item => {
                    Order.updateMany({item_id: item.id},{status: "C"}).catch(err => console.log(err))
                    res.status(200).json(item)
                })
                .catch(err => res.status(400).json({ err: err }));
            }
        })
    }
});

router.post("/dispatch/:id", auth, (req, res) => {
    if (!req.user.vendor) res.status(400).json({ msg: "Only vendors" })
    else {
        Item.findById(req.params.id, (err, item) => {
            if (err) res.status(400).json({ err: err })
            else if (!item) res.status(400).json({ err: "No item found" });
            else if (item.vendor_id != req.user.id) res.status(400).json({ err: "the item doesn't belong to this vendor" });
            else if (item.canceled) res.status(400).json({ err: "the item has been canceled" });
            else if (!item.ready) res.status(400).json({ err: "the item is not yet ready to be dispatched" });
            else {
                item.ready = false
                item.dispatched = true
                item.save().then(item => {
                    Order.updateMany({item_id: item.id},{status: "D"}).catch(err => console.log(err))
                    res.status(200).json(item)
                })
                    .catch(err => res.status(400).json({ err: err }));
            }
        })
    }
});

router.get("/search", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        var odr = 1
        if (req.query.order == 'DSC') odr = -1
        var sort_by = {price: odr}
        if (req.query.key == "remaining") sort_by = {remaining: odr}
        if (req.query.key == "seller_rating") sort_by = {seller_rating: odr}
        Item.find({canceled: false, ready: false, dispatched: false}).sort(sort_by).populate("vendor_id").exec((err, items) => {
            if (err) res.status(400).json({ err: err })
            else{
                const searcher = new FuzzySearch(items, ['name'])
                res.json(searcher.search(req.query.search_string))
            }
        })
    }
});

router.get("/get/:id", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only costumers" })
    else {
        Item.findById(req.params.id, (err, item) => {
            if (err) res.status(400).json({ err: err })
            else if (!item) res.status(400).json({ err: "no item" })
            else {
                Order.find({ item_id: req.params.id, reviewed: true }, "review product_rating", (err, reviews) => {
                    if (err) res.status(400).json({ err: err })
                    else {
                        item.reviews = reviews
                        res.status(200).json({ item: item, reviews: reviews })
                    }
                })
            }
        })
    }
});

module.exports = router;
