// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {getLocalIp} = require("./util/local_ip");
const multer = require("multer")
const mime = require('mime-types')


const fileFolder = "./temp/"
var upload = multer({dest: fileFolder})

// const port = process.env.PORT || 10001;
const port = 10001;

// import {getLocalIp} from "./util/local_ip.mjs"

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json())
var g_password = "admin"  // default password
var g_username = ""
let userinfos = new Map();  // username host

let numUsers = 0;

// setting password
app.post('/api/setting', (req, res) => {
  console.log("setting");

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
    serverIp: getLocalIp()
  })
  //make all already login state false
})

// check password
app.post('/api/login', (req, res) => {
  console.log("login");
  const data = req.body
  const c_username = data.username
  const c_url = req.get('host')

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
})



app.post('/api/upload_file', upload.single("file"), (req, res) => {
  console.log("upload_file")
  console.log("file: ")
  console.log(req.file)
  // console.log(req)

  // {
  //   fieldname: 'file',
  //   originalname: 'Operating Systems Design Implementation 3.pdf',
  //   encoding: '7bit',
  //   mimetype: 'application/pdf',
  //   destination: './temp/',
  //   filename: '9a21331fe285a9252efdbc5fdf4eea67',
  //   path: 'temp/9a21331fe285a9252efdbc5fdf4eea67',
  //   size: 35870253
  // }

  return res.status(200).send({
    path: "/temp/" + req.file.filename
  })
})


app.get('/temp/:name', (req,res) => {
  console.log("download")
  var filename = req.params.name
  var options = {
    root: path.join(__dirname, fileFolder),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      // 'Content-Type': mime_type,
      // 'Content-Disposition': 'attachment; filename=' + encodeURI(filename)
    }
  }

  res.sendFile(filename, options, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Sent:', filename)
    }
  })
})


io.on('connection', (socket) => {
  console.log("socket connect")

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // console.log(socket.request.connection.remoteAddress);
    socket.broadcast.emit('new message', data);
  });

  socket.on('add user', (username) => {
    console.log("add user")
    console.log(username)
    socket.broadcast.emit('new message', {
      username: username,
      num: userinfos.size + 1,
      data: "加入",
      type: 'info'
    });
  });

  socket.on('user left', (username) => {
    if (username === g_username) {
      g_username = ""
      socket.broadcast.emit("reset");
      userinfos.clear()
    }
    else {
      userinfos.delete(username)
      socket.broadcast.emit('new message', {
        username: username,
        num: userinfos.size + 1,
        data: "离开",
        type: 'info'
      });
    }
  });

  // when the client emits 'typing', we broadcast it to others
  // socket.on('typing', () => {
  //   socket.broadcast.emit('typing', {
  //     username: socket.username
  //   });
  // });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    console.log("socket disconnect")
    
    if (g_username === "" && userinfos.size === 0) {
      console.log("curr process is " + process.pid + " there is no user");
      process.exit()
    }
  });
});


// app.get('/temp', (req, res) =>{
//   console.log("download");
//   console.log(req.query)
//   var filename = req.query.originalName
//   console.log(filename)

//   // var fileExt = filename.split('.').pop();
//   var mime_type = mime.lookup(filename.split('.').pop());

//   console.log(mime_type)

//   var options = {
//     root: path.join(__dirname, fileFolder),
//     dotfiles: 'deny',
//     headers: {
//       'x-timestamp': Date.now(),
//       'x-sent': true,
//       'Content-Type': mime_type,
//       'Content-Disposition': 'attachment; filename=' + encodeURI(filename)
//     }
//   }

//   res.sendFile(req.query.name, options, function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('Sent:', filename)
//     }
//   })
// })

