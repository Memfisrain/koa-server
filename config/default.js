"use strict";

module.exports = {
  server: {
    port: 3000
  },
  mongoose: {
    server: {
      socketOptions: {
        keepAlive: 1
      },
      poolSize: 5
    },
    debug: false
  }
};