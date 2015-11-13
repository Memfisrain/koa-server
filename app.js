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
    if (e.errors) {
      //this is error throw by mongoose
      this.body = e.message;
      this.status = 400;
    } else if (e.status) {
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

  if (!this.user) {
    this.throw(404);
  }

  yield* next;
});

router.post("/", function* (next) {
  let user = yield User.create(this.request.body);
  this.body = user.toObject();
});


router.get("/:id", function* (next) {
  console.log(this.user);
  this.body = this.user.toObject();
});

router.get("/", function* (next) {
  let users = yield User.find({}).lean();
  this.body = users;
});

router.del("/:id", function* (next) {
  let user = yield this.user.remove();
  this.body = user.toObject();

});

router.patch("/:id", function* (next) {
  let user = yield User.findByIdAndUpdate(this.params.id, this.request.body, {"new": true});
  this.body = user.toObject();
});

app.use(router.routes());

module.exports = app;




