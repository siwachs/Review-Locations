const HttpError = require("../models/http_error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
//For encrypt or hash password
const jwt = require("jsonwebtoken");
//token generator

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong on server side", 500));
  }
  users = users.map((ele) => ele.toObject({ getters: true }));
  res.json({ users });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("INVALID INPUTS PASSED", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Failed to fetch User", 500));
  }

  if (existingUser) {
    const error = new HttpError("User already existed", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //salt value
  } catch (error) {
    return next(new HttpError("Failed to encrypt password", 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Failed to save password", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { uid: createdUser.id, email: createdUser.email },
      process.env.PRIVATE_KEY_FOR_TOKEN,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("can't generate token", 500));
  }

  res
    .status(201)
    .json({ uid: createdUser.id, email: createdUser.email, token: token });
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong on server side", 500));
  }
  if (!existingUser) {
    const error = new HttpError("User not exist", 403);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Failed to match password", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid Password", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { uid: existingUser.id, email: existingUser.email },
      process.env.PRIVATE_KEY_FOR_TOKEN,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("sign in failed", 500));
  }

  res.json({
    uid: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.signIn = signIn;
