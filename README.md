# doladola server by socket.io

[server](https://github.com/addelete/doladola-socket)  
[web](https://github.com/addelete/doladola-react)

## dev
```
yarn dev
```

## prod
### step 1
create `config.custom.js` and eidt it
```ts
module.exports = {
  port: 10996,
  socket_io_options: {
    cors: {
      origin: [
        'web client origin', 
        'http://127.0.0.1:10997',
        'http://localhost:10997',
      ],
      methods: ["GET"]
    }
  },
  jwt_secret: 'jwt searct',
  mongodb_uri: 'mongodb://127.0.0.1/doladola-socket',
}
```
### step 2
```
pm2 start app.js --name=doladola-socket
```
