/**
 * Created by Nikita_Kulazhenko on 11/4/2015.
 */
'use strict';

const fs = require("mz/fs");

const app = require("koa")();
const router = require("koa-router")();

let users = [
  {id: 3, name: "Pasha", age: 22, sex: "M"},
  {id: 6, name: "Andrey", age: 31, sex: "M"},
  {id: 8, name: "Sergey", age: 19, sex: "M"},
  {id: 5, name: "Vadim", age: 23, sex: "M"}
];

router.get("/", function* (next) {
  this.body = "Hello world!";
});

router.get("/users", function* (next) {
  console.log("/users");

  this.body = users.reduce( (curr, next) => curr + JSON.stringify(next, "", 4) + "\n", "");
});

router.get("/users/:id", function* (next) {
  console.log(this.params.id);

  let user = users.find( (el, i, arr) => {
    if (el.id == this.params.id) {
      return true;
    }

    return false;
  } );

  console.log(user);

  this.body = JSON.stringify(user, "", 4);
});

/*app.use(function* responseTime(next) {
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


