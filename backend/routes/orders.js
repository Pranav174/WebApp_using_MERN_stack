const express = require("express");
const router = express.Router();
const auth = require('../middleware/authorize')

const Order = require("../models/Order");
const User = require("../models/User");

router.get("/search/:string", auth, (req, res) => {});

module.exports = router;