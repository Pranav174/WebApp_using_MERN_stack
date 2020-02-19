const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authorize')
const Order = require("../models/Order");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
// const validateUserType = require("../validation/user_type");

const User = require("../models/User");

router.post("/register", (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already registered" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                vendor: req.body.vendor
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => res.status(400).json({ err: err }));
                    // .catch(err => console.log(err));
                });
            });
        }
    });
});


router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                jwt.sign(
                    { id: user.id, vendor: user.vendor },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user
                        });
                    }
                )
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

router.get("/is_authenticated", auth, (req, res) => {
    res.status(200).json(req.user)
})

router.get("/vendor/:id", auth, (req, res) => {
    if (req.user.vendor) res.status(400).json({ msg: "Only customers" })
    else {
        User.findById(req.params.id, (err, user) => {
            if (err) res.status(400).json({ err: err })
            else if (!user.vendor) res.status(400).json({ err: "queried user is not a vendor" })
            Order.find({ vendor_id: user.id, reviewed: true }).populate("customer_id item_id").exec((err, orders) => {
                if (err) res.status(400).json({ err: err })
                res.status(200).json({vendor: user, reviews: orders})
            })
        })
    }
})

module.exports = router;