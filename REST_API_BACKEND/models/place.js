const mongoose = require("mongoose");
//need a defined schema to store Data
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  uid: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

//ref is User means we make a refrential integrity type logic in our NO SQL DB

module.exports = mongoose.model("Place", placeSchema);
