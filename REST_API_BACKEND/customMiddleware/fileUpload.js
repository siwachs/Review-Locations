const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const fileUpload = multer({
  limits: 10000,
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads/images");
      //image storeage path
    },
    filename: (req, file, callback) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      //file.mimetype contains extention of image
      callback(null, uuidv4() + "." + ext);
      //give image a unique name
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    //!! double bang change undef or null to false
    let error = isValid
      ? null
      : new Error("INVALID FILE EXTENTION PLEASE UPLOAD A jpeg,jpg or png");
    callback(error, isValid);
  },
});

module.exports = fileUpload;
