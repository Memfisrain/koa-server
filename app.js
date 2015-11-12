'use strict';

const app = require("koa")();
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");

let User =  require("./User");

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost/test", {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});


app.use( bodyParser() );

app.use(function* (next) {
  try {
    yield* next;
  } catch(e) {
    console.info("Info error ", e);
    if (e.status) {
      console.log("status is ", e.status);
      this.body = e.message;
      this.status = e.status
    } else {
      this.body = "Error";
      this.status = 500;
    }
  }
});


//Routers

let router = new Router({
  prefix: "/users"
});

router.post("/", function* (next) {
  let body = this.request.body;

  let ctx = this;

  try {
    let user = yield User.create(body);
    ctx.body = JSON.stringify(user, "", 2);
  } catch(e) {
    ctx.throw(400, "User with this email already exist");
  }

});

router.get("/:id", function* (next) {
  let ctx = this;
  let _id = this.params.id;

  try {
    let user = yield User.findOne({_id:_id});
    ctx.body = JSON.stringify(user, "", 2);
  } catch(e) {
    console.log(e);
  }

});

router.get("/", function* (next) {
  let ctx = this;

  try {
    let users = yield User.find({});
    ctx.body = JSON.stringify(users);
  } catch(e) {
    console.log("My catched error: ", e);
    ctx.throw()
  }

});

router.del("/:id", function* (next) {
  let ctx = this;

  try {
    let user = yield User.findByIdAndRemove(ctx.params.id);
    ctx.body = JSON.stringify(user, "", 2);
  } catch(e) {
    console.log("Error occured when delete");
    ctx.throw("User with this email is not found", 404);
  }

});

router.patch("/:id", function* (next) {
  let ctx = this;
  let id = this.params.id;

  try {
    let user = yield User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {"new": true});
    ctx.body = user;
  } catch(e) {
    ctx.throw(404);
  }
});

app.use(router.routes());

module.exports = app;




