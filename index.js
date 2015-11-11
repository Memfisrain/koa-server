'use strict';

const app = require("koa")();
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");

let User =  require("./User");

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


app.use( bodyParser() );

app.use(function* (next) {
  try {
    yield* next;
  } catch(e) {
    console.info("Info error ", e);
    if (e.status) {
      this.body = e.message;
      this.statusCode = e.status
    } else {
      this.body = "Error";
      this.statusCode = 500;
      //console.error(e.message, e.stack);
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
  let id = this.params.id;

  try {
    let user = yield User.findById(id);
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
    ctx.throw(404, "User with this email is not found");
  }

});

router.patch("/:id", function* (next) {
  let ctx = this;

  try {
    let user = yield User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = user;
  } catch(e) {
    ctx.throw(404);
  }

});



app.use(router.routes());
app.listen(3000);



