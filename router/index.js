const express = require("express");
const router = express.Router();
const user = require("../router/user");

router.use("/users", user)

module.exports = router;
