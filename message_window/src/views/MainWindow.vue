<template>
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
    

      <div id="messages-window">
        <v-list color="purple lighten-3" id="scrollable" v-bind:style="{ 'height': `calc(${mainHeight}vh - ${height}px)`}">
          <div id="message-row"
            v-for="(item, index) in messages"
            :key="index"
            >

          <message-item :message="item"></message-item>
          </div>
        </v-list>
          <!-- <v-image :src="url('${imageData}')"></v-image> -->

      </div>

      <div id="input-window" style="background-color:red;" ref="inputWindow">
          <div style="width:1rem;">
          <v-file-input v-model="inputFile" multiple chips show-size flat solo dense hide-details background-color="grey lighten-3" disable-input class="ma-0 pa-0" truncate-length="15"
            v-bind:disabled="inputText.length > 0">
          </v-file-input>
          </div>

          <v-textarea id="input"
          background-color="primary"
            color="red"
            rows="3"
            no-resize
            outlined
            placeholder="Input your message..."
            v-model="inputText"
            v-bind:disabled="inputFile.length > 0"
          >
          </v-textarea>

          <v-btn v-on:click="send" class="align-self-end mr-5" v-bind:loading="loading">
            发送
          </v-btn>
          

      </div>
    </div>
  </v-container>
</template>

<script>
import MessageItem from '../components/MessageItem.vue';

const axios = require("axios");
// const multer = requirs("multer");
const FormData = require('form-data');
const io = require('socket.io-client');
var socket = io();
const imgExts = new Set(['png','jpg', 'svg'])

export default {
  data() {
    return {
      inputText: "",
      inputFile: [],
      height:500,
      loading: false,
      selectImage: null,
      // username: "",
      // messages: [],
      messages: [{
          type: "file",
          data:"hahah",
          time: Date.now(),
          receive: false,  
          username: "hello",
          color: "red",
          info: {
            path: "",
            name: "",
          }
      },{
          type: "text",
          data:"hahah",
          time: Date.now(),
          receive: true,  
          username: "hello",
          color: "red",
      },{
          type: "image",
          data:"hahah",
          time: Date.now(),
          receive: false,  
          username: "hello",
          color: "red",
          info: {
            path: "",
            name: "",
          }
      }],


    };
  },
  components:{
    MessageItem
  },

  computed: {
    // username(){
    //   return this.$store.state.username;
    // },
    color() {
      return this.$store.state.color;
    },
    mainHeight() {
      if (this.$vuetify.breakpoint.lgAndUp)
        return 90
      else
        return 77
    }
  },

  beforeCreate() {
      // if ( !this.$store.state.loginState ) {
      //     this.$router.push("/");
      // }
  },
  beforeMount() {
      const currentUrl = new URL(window.location.href);
      this.clientUrl = currentUrl.hostname + ':' + currentUrl.port
      // console.log("current url is " + this.clientUrl)
  },
  mounted() {
    // new message
    socket.on('new message', (msg) => {
      msg.receive = true;

      if (msg.type === "file") {
        if (this.clientUrl === msg.info.url) {
          msg.receive = false;
        }
      }
      console.log("new message")
      console.log(msg)
      this.messages.push(msg);
    }),

    // cancel all login state
    socket.on('change host password', () => {
      this.$store.commit("setLoginState", false);
      this.$router.push("/");
    }),

    this.height =document.getElementById("input-window").offsetHeight
  },

  updated() {
        var container = this.$el.querySelector('#scrollable');
        container.scrollTop = container.scrollHeight;
  },

  methods: {
    send(){
      // only send one file a time
      if (this.inputFile.length > 0) {
        console.log(this.inputFile)
        console.log(typeof(this.inputFile))
        const file = this.inputFile[0]
        this.selectImage = file
        const ext = file.name.split('.').pop()
        console.log(file.name)
        console.log("ext is " + ext)
        if (imgExts.has(ext.toLowerCase())) {
          console.log("is image")
          const reader = new FileReader
          reader.onload = e => {
            this.imageData = e.target.result
          }
          reader.readAsDataURL(file)
          //   const msg = {
          //     type: "image",
          //   data: file.name,
          //   time: Date.now(),
          //   receive: false,
          //   username: "hello",
          //   color: this.color,
          //   info: {
          //     path: file
          //   }
          // }
          // console.log("color is " + msg.color)
          // this.messages.push(msg);
          // socket.emit('new message', msg);
          console.log('hello')
        }
        else {
          var formData = new FormData();
        // for (let file of this.inputFile) {
          formData.append("file", file, file.name);
        // }
          
          axios.post("/upload_file", formData)
                .then(response => {
                  console.log("success")
                  console.log(response)
                  this.loading = false
                })
                .catch( error => {
                  console.log("error")
                  console.log(error)
                })

          this.loading = true
        }
      }
      else {      
        if (!this.inputText) { return }
        
        const msg = {
          data: this.inputText,
          time: Date.now(),
          receive: false,
          username: this.username,
          color: this.color,
          type: "text"
        }
        // console.log("color is " + msg.color)
        this.messages.push(msg);
        socket.emit('new message', msg);

      }

    },



    download() {
      console.log("download");
    }

  },
};
</script>

<style scoped>
#scrollable {
  overflow-y: auto;
  /* height: calc(100vh - 22rem); */
}
.v-container {
  background-color: bisque;
  height: 100%;
  overflow: hidden;
}
#main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: stretch; */
  /* justify-content: space-between; */
}
#messages-window {
  background-color: dark;
  /* flex: 1; */
}

#input-window {
  display: flex;
  flex-direction: column;
}

.v-textarea {
  height: 7rem;
} 
</style>