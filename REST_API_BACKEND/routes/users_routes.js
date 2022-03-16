const express = require("express");
const body_parser = require("body-parser");
const { check } = require("express-validator");

const router = express.Router();
const fileUpload = require("../customMiddleware/fileUpload");

const users_controller = require("../controllers/users_controler");

router.use(body_parser.json());

router.get("/", users_controller.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  users_controller.signUp
);

router.post("/login", users_controller.signIn);

module.exports = router;
