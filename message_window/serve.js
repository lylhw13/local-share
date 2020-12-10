// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
// const { set } = require('vue/types/umd');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// const port = process.env.PORT || 10001;
const port = 10001;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Chatroom

let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // console.log(socket);
    // var address = socket.handshake.address;
    // console.log("New connection from " + address.address + ":" + address.port);
    console.log(socket.request.connection.remoteAddress);
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      // address: socket.address,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

app.use(express.json())
let password = ""
let usernames = new Map();

// setting password
app.post('/api/setting', (req, res) => {
  // console.log(req);
  res.send("api server");
  console.log(req.body);
  username = req.body.username
  password = req.body.password
})


// check password
app.post('/api/login', (req, res) => {
  console.log("login");
  const currpasswd = req.body.password
  const currusername = req.body.username

  if (currpasswd !== password) {
    return res.status(401).send({
      message: "密码错误！"
    })
  }

  if (usernames.has(currusername)) {
    return res.status(409).send({
      message: "该用户名已经存在，请选择新的用户名！"
    })
  }
  console.log(req.get('host'));
  usernames.set(currusername, req.get('host'))
  // const username = req.body.username
})


