<template>
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="messages-window">
        <v-list color="purple lighten-3 pr-2" id="scrollable" v-bind:style="{ 'height': `calc(${mainHeight}vh - ${height}px)`}">
          <div id="message-row"
            v-for="(item, index) in messages"
            :key="index"
            >
          <message-item :message="item" v-on:loaded="loaded"></message-item>
          </div>
        </v-list>
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
            v-bind:rows="$vuetify.breakpoint.mobile ? 1 : 3"
            no-resize
            outlined
            hide-details
            placeholder="Input your message..."
            v-model="inputText"
            v-bind:disabled="inputFile.length > 0"
          >
          </v-textarea>

          <v-btn v-on:click="send" class="align-self-end ma-1 mr-5" v-bind:loading="loading">
            发送
          </v-btn>
          
      </div>
    </div>
  </v-container>
</template>

<script>
import MessageItem from '../components/MessageItem.vue';

const axios = require("axios");
const FormData = require('form-data');
const io = require('socket.io-client');
var socket = io();
const imgExts = new Set(['png','jpg','jpeg','jfif','gif','bmp', 'svg','tiff', 'tif'])

export default {
  data() {
    return {
      inputText: "",
      inputFile: [],
      height:500,
      loading: false,
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
  // beforeMount() {
  //     const currentUrl = new URL(window.location.href);
  //     this.clientUrl = currentUrl.hostname + ':' + currentUrl.port
  //     // console.log("current url is " + this.clientUrl)
  // },
  mounted() {
    // new message
    socket.on('new message', (msg) => {
      console.log("new message")
      console.log(msg)
      this.messages.push(msg);
      // this.scrollUp()
    }),

    // cancel all login state
    socket.on('change host password', () => {
      this.$store.commit("setLoginState", false);
      this.$router.push("/");
    }),

    this.height =document.getElementById("input-window").offsetHeight
  },
  // watch: {
  //   messages:function(){
  //     console.log("watch")
  //     var container = this.$el.querySelector('#scrollable');
  //       container.scrollTop = container.scrollHeight;
  //   }
  // },

  updated() {
        var container = this.$el.querySelector('#scrollable');
        container.scrollTop = container.scrollHeight;
  },

  methods: {
      loaded(){
        console.log("load finish")
        this.scrollUp()
      },
    scrollUp() {
      console.log("scroll")
        var container = this.$el.querySelector('#scrollable');
        container.scrollTop = container.scrollHeight;
    },
    send(){
      // only send one file a time
      if (this.inputFile.length > 0) {
        const file = this.inputFile[0]
        var formData = new FormData();

        const ext = file.name.split('.').pop()

        const msg = {
              type: imgExts.has(ext.toLowerCase()) ? "image" : "file",
              data: file.name,
              time: Date.now(),
              receive: false,
              username: "hello",
              color: "red",
              path: URL.createObjectURL(file),
        }
        this.messages.push(msg);
        // this.scrollUp()

        formData.append("file", file, file.name);

          axios.post("/upload_file", formData)
            .then(response => {
              console.log("upload success, response is")
              // console.log(response)
              let t_msg = { ...msg }  //deep copy
              t_msg.receive = true
              t_msg.path = response.data.path
              socket.emit('new message', t_msg);
              // console.log(t_msg)
              this.loading = false
              this.inputFile = []
            })
            .catch(error => {
              console.log("upload error")
              console.log(error)
            })

            this.loading = true
      }
      else {      
        if (!this.inputText) { return }
        
        const msg = {
          data: this.inputText,
          time: Date.now(),
          receive: false,
          username: "hello",
          color: this.color,
          type: "text"
        }
        this.messages.push(msg);

        var t_msg = {...msg}
        t_msg.receive = true
        socket.emit('new message', t_msg);
        this.inputText = ""
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
  overflow-x:hidden;
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

/* .v-textarea {
  height: 7rem;
}  */
</style>