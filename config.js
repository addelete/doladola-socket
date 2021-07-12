'use strict';

module.exports = {
  port: 10996,
  
  socket_io_options: {
    cors: {
      origin: [
        'http://127.0.0.1:10997',
        'https://doladola-web.humwo.com', 
      ],
      methods: ["GET", "POST"]
    }
  },
  jwt_secret: 'QEJWxCOpAPsEaRWwvU',
  mongodb_uri: 'mongodb://127.0.0.1/doladola-socket',
}