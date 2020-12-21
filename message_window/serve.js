// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
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
    // socket.broadcast.emit('new message', {
    //   username: socket.username,
    //   // address: socket.address,
    //   message: data
    // });
    socket.broadcast.emit('new message', data);
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
var g_password = ""
var g_username = ""
let userinfos = new Map();  // nickname host

// setting password
app.post('/api/setting', (req, res) => {
  console.log(req.body);

  if (req.hostname !== "127.0.0.1") { 
    return res.status(401).send({
      message: "Only the host can set password!"
    })
  }

  g_username = req.body.username
  g_password = req.body.password

  console.log("g_username is " + g_username)
  console.log("g_password is " + g_password)

  return res.status(200).send({
    serverIp: getLoaclIp()
  })
  //make all already login state false
})


// check password
app.post('/api/login', (req, res) => {
  console.log("login");
  const data = req.body
  const c_username = data.username
  const c_url = req.get('host')
  console.log(c_url)


  if (data.password !== g_password) {
    return res.status(401).send({
      message: "密码错误！"
    })
  }

  if (c_username === g_username || (userinfos.has(c_username) && userinfos.get(c_username).url !== c_url)) {
    return res.status(409).send({
      message: "该用户名已经存在，请选择新的用户名！"
    })
  }

  userinfos.set(c_username, {
    "username": c_username,
    "color": data.color,
    "url": c_url
  });

  return res.status(200).send({
    message: "OK"
  })
  // const username = req.body.username
})

const multer = require("multer")
const fileFolder = "./temp/"
var upload = multer({dest: fileFolder})

app.post('/upload_file', upload.single("file"), (req, res) => {
  console.log("upload_file")
  console.log("file: ")
  console.log(req.file)
  // console.log(req)

  const msg = {
    type: "file",
    data: req.file.originalname,
    time: Date.now(),
    receive: false,
    username: "hello",
    color: this.color,
    info: {
      path: req.file.destination,
      name: req.file.filename, 
      url: req.get('host')
    }
  }

  console.log(msg.info.url)

  io.sockets.emit("new message", msg)

  return res.send("upload_file")
})

var mime = require('mime-types')

app.get('/temp', (req, res) =>{
  console.log("download");
  console.log(req.query)
  var filename = req.query.originalName
  console.log(filename)

  // var fileExt = filename.split('.').pop();
  var mime_type = mime.lookup(filename.split('.').pop());

  console.log(mime_type)

  var options = {
    root: path.join(__dirname, fileFolder),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'Content-Type': mime_type,
      'Content-Disposition': 'attachment; filename=' + encodeURI(filename)
    }
  }

  res.sendFile(req.query.name, options, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Sent:', filename)
    }
  })

})

function getLoaclIp() {
  var ifaces = require("os").networkInterfaces();
for (var dev in ifaces) {
    var iface = ifaces[dev].filter((details) => {
        return (
            details.family === "IPv4" &&
            details.internal === false &&
            !details.mac.startsWith("00:50:56")
        );
    });

    if (iface.length > 0) {
        address = iface[0].address;
        return address;
    }
}
}

