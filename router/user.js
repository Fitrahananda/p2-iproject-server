const express = require("express");
const user = express.Router();
const userController = require("../controller/user_controller");
const authentication = require("../middleware/authentication");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
user.post("/register", userController.register);
user.post("/login", userController.login);
user.post("/forgorpassword",userController.passwordForgot);
user.patch("/reserpassword", userController.resetForgot);


user.use(authentication);
user.get("/profile", userController.profile);
user.post("/addprofile", upload.single("file"), userController.addprofile);
user.get("/listprofile", userController.listProfile);
user.post("/addpartner", userController.addPartner);
user.get("/listpartner", userController.listPartner);
user.get("/recieved", userController.recievedRequest);
user.post("/cencel", userController.cencelRequest);
user.patch("/accept", userController.acceptRequest);
user.get("/partner", userController.partner);


module.exports = user;
