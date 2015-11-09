/**
 * Created by Nikita_Kulazhenko on 11/4/2015.
 */
'use strict';

const fs = require("mz/fs");

const app = require("koa")();
const router = require("koa-router")();
const bodyParser = require("koa-bodyparser");
const uniqueValidator = require("mongoose-unique-validator");

const mongoose = require("mongoose");

let users = [
  {id: 3, name: "Pasha", age: 22, sex: "M"},
  {id: 4, name: "Andrey", age: 31, sex: "M"},
  {id: 5, name: "Sergey", age: 19, sex: "M"},
  {id: 6, name: "Vadim", age: 23, sex: "M"}
];


mongoose.set("debug", true);

mongoose.connect("mongodb://localhost/test", {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

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

app.use( bodyParser() );

app.use(function* (next) {
  try {
    yield* next;
  } catch(e) {
    if (e.status) {
      this.body = e.message;
      this.statusCode = e.status
    } else {
      this.body = "Error";
      this.statusCode = 500;
      console.error(e.message, e.stack);
    }
  }
});


router.post("/users", function* (next) {
  let body = this.request.body;

  let self = this;

  yield User.create(body, function(err, user) {
    if (err) {
      //console.log("Error occured ", err);
      //self.throw(err);
      return;
    }

    self.body = JSON.stringify(user, "", 4);
  })
});

router.get("/users/:id", function* (next) {

});

router.get("/users", function* (next) {

});

router.delete("/users/:id", function* (next) {

});



/*
app.use(bodyParser);

app.use(function* responseTime(next) {
  let start = new Date;
  yield next;
  let ms = new Date - start;
  this.set("X-Response-Time", ms + "ms");
});

app.use(function* logger(next) {
  let start = new Date;
  yield next;
  let diff = new Date - start;
  console.log('%s %s %s %sms',
    this.method,
    this.originalUrl,
    this.status, diff);
});

app.use(function* logger(next) {
  yield next;
  if (!this.body) return;
  this.set("Content-Length", this.body.length);
});*/

app.use(router.routes());

app.listen(3000);


// helpers functions
function getUsers() {
  return users;
}


