const mongoose = require("mongoose");
const Schemea = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
//Validation Between User and his/her location

const userSchema = new Schemea({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

//places are array store mongoose document 's object ID for refrential integrity

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
