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

      if (numUsers === 0) {
        console.log("curr process is " + process.pid + " there is no user");
        process.exit()
      }
    }
  });
});

app.use(express.json())
let g_password = ""
let userinfos = new Map();  // nickname host

// setting password
app.post('/api/setting', (req, res) => {
  res.send("api server");
  console.log(req.body);

  if (req.get('host') !== "127.0.0.1") { return }

  username = req.body.username
  g_password = req.body.password
})


// check password
app.post('/api/login', (req, res) => {
  console.log("login");
  const c_passwd = req.body.password
  const c_username = req.body.username
  const c_url = req.get('host')
  console.log(c_url)

  if (c_passwd !== g_password) {
    return res.status(401).send({
      message: "密码错误！"
    })
  }

  if (userinfos.has(c_username) && userinfos.get(c_username) !== c_url) {
    return res.status(409).send({
      message: "该用户名已经存在，请选择新的用户名！"
    })
  }

  userinfos.set(c_username, c_url)
  // const username = req.body.username
})


