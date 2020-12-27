// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {getLocalIp} = require("./util/local_ip");
const multer = require("multer")
const mime = require('mime-types')

const fs = require("fs");

const urlFilePah = '/files/'
const fileFolder = "." + urlFilePah
if (!fs.existsSync(fileFolder)) {
  fs.mkdirSync(fileFolder)
}

var upload = multer({dest: fileFolder})

var port = 10001;

const serverInstance = server.listen(port, () => { 
      console.log('Server listening at port %d', port);
      })
      .on('error', function (err) {
          if(err.code === 'EADDRINUSE') {
              console.log(`----- Port ${port} is busy, trying with port ${port + 1} -----`);
              port += 1;
              serverInstance.listen(port);
          } else {
              console.log(err);
          }
      });

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json())
var g_password = "admin"  // default password
var g_username = ""
let userinfos = new Map();  // username host

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


  return res.status(200).send({
    // path: "/temp/" + req.file.filename
    path: urlFilePah + req.file.filename
    // path: path.join(filePath, req.file.filename)
  })
})


app.get(urlFilePah + ":name", (req,res) => {
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

  socket.on('new message', (data) => {
    // console.log(socket.request.connection.remoteAddress);
    socket.broadcast.emit('new message', data);
  });

  socket.on('user join', (data) => {
    console.log("user join")
    console.log(data.username)
    socket.broadcast.emit('new message', {
      username: data.username,
      num: userinfos.size + 1,
      data: "加入",
      type: 'info'
    });
  });

  socket.on('user left', (data) => {
    console.log("user left " + data.username)
    if (data.username === g_username) {
      g_username = ""
      socket.broadcast.emit("reset");
      userinfos.clear()
    }
    else {
      userinfos.delete(data.username)
      socket.broadcast.emit('new message', {
        username: data.username,
        num: userinfos.size + 1,
        data: "离开",
        type: 'info'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log("socket disconnect")
    console.log("g_username " + g_username)
    
    if (g_username === "" && userinfos.size === 0) {
      console.log('start time out')
      setTimeout(()=>{
        if (g_username === "" && userinfos.size === 0) {
          console.log("curr process is " + process.pid + " there is no user");
          process.exit()
        }
      }, 60000)
    }
  });
});




