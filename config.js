'use strict';

let defaultConfig = {
  port: 10996,

  socket_io_options: {
    cors: {
      origin: [
        'http://127.0.0.1:10997',
        'http://localhost:10997',
      ],
      methods: ["GET"]
    }
  },
  jwt_secret: 'secret',
  mongodb_uri: 'mongodb://127.0.0.1/doladola-socket',
}

try {
  const customConfig = require('./config.custom')
  defaultConfig = Object.assign(defaultConfig, customConfig)
} catch (err) {

}

module.exports = defaultConfig