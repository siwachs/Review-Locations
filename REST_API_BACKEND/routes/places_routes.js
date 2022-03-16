const express = require("express");
const body_parser = require("body-parser");
const { check } = require("express-validator");

const router = express.Router();
const authMiddleware = require("../customMiddleware/authMiddleware");
const fileUpload = require("../customMiddleware/fileUpload");

const places_controller = require("../controllers/places_controller");

router.use(body_parser.json());

router.get("/:pid", places_controller.getPlaceById);

router.get("/user/:uid", places_controller.getPlacesByUid);

router.use(authMiddleware);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("desc").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  places_controller.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("desc").isLength({ min: 5 })],
  places_controller.updatePlaceById
);

router.delete("/:pid", places_controller.deletePlaceById);

module.exports = router;
