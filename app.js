'use strict';

const app = require("koa")();
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");

let User =  require("./User");

mongoose.set("debug", false);

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

router.param("id", function* (id, next) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    this.throw(404);
  }

  this.user = yield User.findById(id);

  yield* next;
});

router.post("/", function* (next) {
  let user = yield User.create(this.request.body);
  this.body = user.toObject();
});


router.get("/:id", function* (next) {
  this.body = this.user.toObject();
});

router.get("/", function* (next) {
  let users = yield User.find({}).lean();
  this.body = JSON.stringify(users);
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




