const express = require("express");
const router = express.Router();
const auth = require('../middleware/authorize')

const Item = require("../models/Item");
const User = require("../models/User");

router.post("/create", auth, (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if (user) {
            if (!user.vendor) res.status(400).json({ msg: "Only vendors can create new items" })
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
        }
        else res.status(400).json({ msg: "Can not find user associated with the token" })
    })
});

router.get("/", auth, (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if (user) {
            if (!user.vendor) res.status(400).json({ msg: "Only vendors can create new items" })
            else {
                Item.find({ vendor_id: req.user.id, ready: false, canceled: false, dispatched: false }, (err, docs) => {
                    if (err) res.status(400).json({ err: err });
                    else res.status(200).json(docs);
                })
            }
        }
        else res.status(400).json({ msg: "Can not find user associated with the token" })
    })
});

router.get("/ready_to_dispatch", auth, (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if (user) {
            if (!user.vendor) res.status(400).json({ msg: "Only vendors can create new items" })
            else {
                Item.find({ vendor_id: req.user.id, ready: true, canceled: false, dispatched: false }, (err, docs) => {
                    if (err) res.status(400).json({ err: err });
                    else res.status(200).json(docs);
                })
            }
        }
        else res.status(400).json({ msg: "Can not find user associated with the token" })
    })
});

router.post("/cancel/:id", auth, (req, res) => {
    console.log('calcelinging item: ', req.params.id)
    User.findById(req.user.id, (err, user) => {
        if (user) {
            if (!user.vendor) res.status(400).json({ msg: "Only vendors can create new items" })
            else {
                Item.findById(req.params.id, (err, item) => {
                    if (err) res.status(400).json({ err: err })
                    else if (!item) res.status(400).json({ err: "No item found" });
                    else if (item.vendor_id != req.user.id) res.status(400).json({ err: "the item doesn't belong to this vendor" });
                    else {
                        item.canceled = true;
                        item.save().then(item => {
                            // also update all the associated orders
                            res.status(200).json(item)
                        })
                            .catch(err => res.status(400).json({ err: err }));
                    }
                })
            }
        }
        else res.status(400).json({ msg: "Can not find user associated with the token" })
    })
});

router.post("/dispatch/:id", auth, (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if (user) {
            if (!user.vendor) res.status(400).json({ msg: "Only vendors can create new items" })
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
                            // also update all the associated orders
                            res.status(200).json(item)
                        })
                            .catch(err => res.status(400).json({ err: err }));
                    }
                })
            }
        }
        else res.status(400).json({ msg: "Can not find user associated with the token" })
    });
});

module.exports = router;
