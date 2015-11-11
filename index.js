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
    unique: true,
    validator: function(v) {
      console.log(v);
      return true;
    }
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

router.post("/users", function* (next) {
  let body = this.request.body;

  let ctx = this;

<<<<<<< HEAD
  try {
    let user = yield User.create(body);
    ctx.body = JSON.stringify(user, "", 2);
  } catch(e) {
    ctx.throw(400, "User with this email already exist");
  }
=======
  yield User.create(body, function(err, user) {
    if (err) {
      //console.log("Error occured ", err);
      console.log(err);
      //return;
    }
>>>>>>> 03742f5fb833a6046c460edce4fe1ab7a94bf884

});

router.get("/users/:id", function* (next) {
<<<<<<< HEAD
  let id = this.params.id;
  let ctx = this;

  try {
    ctx.body = JSON.stringify(user, "", 2);
    let user = yield User.findById(id);
  } catch(e) {
    ctx.throw(404, "Not found");
=======
  let _id = this.params.id;
  let ctx = this;

  try {
    let user = yield User.find({_id:_id});
    ctx.body = JSON.stringify(user, "", 2);
  } catch(e) {
    console.log(e);
>>>>>>> 03742f5fb833a6046c460edce4fe1ab7a94bf884
  }
});

router.get("/users", function* (next) {
  let ctx = this;

  try {
    let users = yield User.find({});
<<<<<<< HEAD
    ctx.body = JSON.stringify(users);
  } catch(e) {
    console.log("My catched error: ", e);
    ctx.throw()
=======
    ctx.body = users;
  } catch(e) {
    console.log("My catched error: ", e);
>>>>>>> 03742f5fb833a6046c460edce4fe1ab7a94bf884
  }
});

router.del("/users/:id", function* (next) {
  let ctx = this;

  try {
    let user = yield User.findByIdAndRemove(ctx.params.id);
    ctx.body = JSON.stringify(user, "", 2);
  } catch(e) {
    ctx.throw(404, "User with this email is not found");
  }
});



app.use(router.routes());

app.listen(3000);


// helpers functions
function getUsers() {
  return users;
}


