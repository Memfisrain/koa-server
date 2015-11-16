"use strict";

const app = require("./app");
const config = require("config");

let server = app.listen(config.get("server").port);