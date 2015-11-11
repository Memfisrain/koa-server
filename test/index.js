'use strict';

const fs = require("mz/fs");
const request = require("co-request");
const mocha = require("mocha");
const coMocha = require("co-mocha");
const mongoose = require("mongoose");
require("should");

coMocha(mocha);

let User = require("../User");


mongoose.connect("mongodb://localhost/test", {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5,
  }
});



describe("check the initial loading of app", function () {

  it.only("GET /users should return array of users or empty array", function* () {
    let users = yield User.find({});
    let res = yield request("http://localhost:3000/users");
    let gettingUsers = JSON.parse(res.body);

    gettingUsers.should.be.eql(users);
  });

  it("GET /users/existing_id should return user", function* () {

    let user = yield User.findOne({});
    let res = yield request("http://localhost:3000/users/" + user.id);
    let gettingUser = JSON.parse(res.body);

    gettingUser.firstName.should.be.eql(user.firstName);

  });

  it("POST /users should create new user with fields from request body", function* () {

  });

  it("DELETE /users/:id should remove user with specified id from db", function* () {

  });

  it("PATCH /users/:id should update user", function* () {

  });

})
