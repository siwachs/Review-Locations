const HttpError = require("../models/http_error");
const { validationResult } = require("express-validator");
const mapLocation = require("../utils/location");
const mongoose = require("mongoose");

const fs = require("fs");
//Read write on Disk

const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    return next(new HttpError("Something went wrong on server side", 500));
  }
  if (!place) {
    return next(new HttpError("Could not find place for defined PID", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
  //it change __id to id and change mongo document as JS object
};

const getPlacesByUid = async (req, res, next) => {
  const uid = req.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(uid).populate("places");
  } catch (err) {
    return next(new HttpError("Something went wrong on server side", 500));
  }

  res.json({
    places: userWithPlaces.places.map((ele) => ele.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("INVALID INPUTS PASSED", 422));
  }

  const { title, desc, address } = req.body;
  let coordinates;
  try {
    coordinates = await mapLocation.getCords(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    desc,
    address,
    location: coordinates,
    image: req.file.path,
    uid: req.userData.uid,
  });

  let user;
  try {
    user = await User.findById(req.userData.uid);
  } catch (err) {
    return next(new HttpError("Something went wrong on server side"), 500);
  }

  if (!user) {
    return next(
      new HttpError(
        "The place you are trying to create does not belong to any UID",
        404
      )
    );
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    //Start session for ACID property

    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    //It store document Object ID
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Could not save place to DB triggering rollback", 500)
    );
  }
  res.status(201).json({ place: createPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("INVALID INPUTS PASSED", 422));
  }
  const { title, desc } = req.body;
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    return next(new HttpError("Something went wrong on server side", 500));
  }

  if (place.uid.toString() !== req.userData.uid) {
    return next(
      new HttpError("the place you try to update does not belong to you", 401)
    );
  }

  place.title = title;
  place.desc = desc;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError("Failed to save change rollback", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid).populate("uid");
  } catch (err) {
    return next(new HttpError("Something went wrong on server side", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find Place for defined PID", 404));
  }

  if (place.uid.id !== req.userData.uid) {
    return next(
      new HttpError(
        "Can't delete this place because this place does not belong to you",
        401
      )
    );
  }
  //Claer FS
  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.uid.places.pull(place);
    await place.uid.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Failed to commit Transaction for deletion", 500)
    );
  }

  fs.unlink(imagePath, (err) => {
    console.log("Could not able to clean FS" + err);
  });

  res.status(200).json({ message: "Place Deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUid = getPlacesByUid;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
