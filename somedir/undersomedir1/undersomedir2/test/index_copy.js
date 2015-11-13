'use strict';

const fs = require("mz/fs");
const request = require("co-request");
const mocha = require("mocha");
const coMocha = require("co-mocha");
const mongoose = require("mongoose");
const app = require("../../../../app");

require("should");

coMocha(mocha);

let User = require("../../../../User");
let server;


describe("check the initial loading of app", function () {
  let mary, kate;

  before(function* () {
    yield function (done) {
      server = app.listen(3000, done);
    };
  });

  after(function* () {
    server.close();
  });

  beforeEach(function* () {
    yield User.remove({});

    mary = yield User.create({
      email: "mary@mail.ru",
      firstName: "Mary",
      lastName: "Brown"
    });

    kate = yield User.create({
      email: "kate@gmail.com",
      firstName: "Kate",
      lastName: "Smith"
    });

  });


  afterEach(function* () {
    yield User.remove();
  });


  it("GET /users should return array of users or empty array", function* () {
    let users = yield User.find({});

    let res = yield request("http://localhost:3000/users",{
      json: true
    });

    res.body.should.be.instanceof(Array).and.have.lengthOf(2);
  });

  it("GET /users/existing_id should return user", function* () {

    let res = yield request("http://localhost:3000/users/" + mary._id, {
      json: true
    });

    res.body.firstName.should.be.eql(mary.firstName);
    res.body._id.toString().should.be.equal(mary._id.toString());

  });

  it("POST /users should create new user with fields from request body", function* () {

    let obj = {
      firstName: "Pavel",
      lastName: "Volya",
      email: "pavel@mail.ru"
    };

    let res = yield request("http://localhost:3000/users", {
      method: "POST",
      body: obj,
      json: true
    });

    res.body.firstName.should.be.equal(obj.firstName);
  });

  it("DELETE /users/:id should remove user with specified id from db", function* () {
    let id = mary._id;

    let res = yield request(`http://localhost:3000/users/${id}`, {
      method: "DELETE"
    });

    res.statusCode.should.be.equal(200);
  });

  it("PATCH /users/:id should update user", function* () {
    let id = mary._id;

    let newMary = {
      firstName: "newMary",
      lastName: "newsurname",
      email: "newmary@mail.ru"
    };

    let res = yield request(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      body: newMary,
      json: true
    });

    res.body.firstName.should.be.equal(newMary.firstName);
    res.body.email.should.be.equal(newMary.email);
  });

});
