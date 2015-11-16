"use strict";
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(val) {
        return /.+?@.+?\.[a-zA-Z]+$/.test(val);
      }
    }
  },

  firstName: {
    type: String,
    required: false
  },

  lastName: {
    type: String,
    required: false
  }
});

userSchema.plugin(uniqueValidator, {
  message: "Error: {PATH} already exist!"
});

let User = mongoose.model("User", userSchema);

module.exports = User;
