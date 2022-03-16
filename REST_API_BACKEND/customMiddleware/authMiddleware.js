const HttpError = require("../models/http_error");
const jwt = require("jsonwebtoken");
//Token generator

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    //to fix browser behaviour
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //header store as Bearer Token

    if (!token) {
      throw new Error("Auth Error Invalid Token");
    }

    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY_FOR_TOKEN);

    req.userData = { uid: decodedToken.uid };
    next();
  } catch (error) {
    return next(new HttpError("Could not find token for this user", 401));
  }
};
