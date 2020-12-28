# message_window

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# local share

类似于web chat， 可以方便临时分享小段文字，图片和文件

功能
- 除了服务器，其他设备无需下载，通过网页即可访问
- 任一电脑启动，其他设备均可连接
- 通过密码访问，具备一定安全性
- 适配多种设备
- 支持图片，文件传送
- 每个客户可以自选头像颜色

特性
- 如果服务器退出，将会使其他客户端强制退出
- 服务器在没有连接的情况下，一个小时后自动关闭

使用方法：
1. 在任何一个设备启动该软件
2. 在浏览器中输入http://127.0.0.1:10001, 端口号视占用情况，会递增
3. 点击加号，可以查看服务器的地址或二维码，以方便其他设备接入

主要技术：
- 前端使用 vue, vuetify 搭建
- 后端使用 express
- 通信使用 axios 和 socketio

# TODO
- 显示在线用户列表

