"use strict";
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  }
});

userSchema.plugin(uniqueValidator, {
  message: "Error: {PATH} already exist!"
});

let User = mongoose.model("User", userSchema);

module.exports = User;
