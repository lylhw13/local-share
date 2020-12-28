<template>
  <v-container id="container" fill-height flex align-start v-bind:style="containerColor">
    <v-snackbar v-model="snackbar" :timeout="6000" top color="error">
      {{errorMsg}}
      <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="snackbar = false"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
      </template>
    </v-snackbar>
    

      <div id="messages-window" v-bind:style="{'height': `${messageWindowHeight}px`}">
        <v-list color="white lighten-4" pa-1 pb-2 id="scrollable" style="height:100%;" >
        <!-- v-bind:style="{ 'height': `calc(${mainHeight}vh - ${height}px - 8px)`}"> -->
          <div id="message-row"
            v-for="(item, index) in messages"
            :key="index"
            >

          <template v-if="item.type === 'info'">
              <div class="d-flex justify-center" style="background-color:white; width:100%">
              <span class="font-weight-light caption">用户</span>
              <span class="font-weight-bold caption ml-1 mr-1">{{item.username}}</span>
              <span class="font-weight-light caption">{{item.data}}，目前共有{{item.num}}位用户</span> 
            </div>
          </template>

          <template v-else>
            <message-item :message="item" v-on:loaded="loaded"></message-item>

          </template>
          </div>
        </v-list>
      </div>

        <div id="input-window" ref="inputWindow" class="grey lighten-4" v-bind:style="{ 'width': `${inputWindowWidth}px`}">
          <div style="width:1rem;">
          <v-file-input v-model="inputFile" multiple chips show-size flat solo dense hide-details background-color="grey lighten-4" disable-input class="ma-0 pa-0" truncate-length="15"
            v-bind:disabled="inputText.length > 0">
          </v-file-input>
          </div>
          <div class="d-flex flex-row pb-2">
            <v-textarea id="input"
              v-bind:rows="$vuetify.breakpoint.mobile ? 1 : 3"
              no-resize
              outlined
              flat
              hide-details
              dense
              placeholder="Input your message..."
              v-model="inputText"
              v-bind:disabled="inputFile.length > 0"
            >
            </v-textarea>

            <v-btn v-on:click="send" fab small class="align-self-center ml-1 mr-1" v-bind:loading="loading">
              <v-icon>mdi-send</v-icon>
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
const socket = io({
  autoConnect: false,
  reconnectionAttempts: 100,
});


const imgExts = new Set(['png','jpg','jpeg','jfif','gif','bmp', 'svg','tiff', 'tif'])


export default {
  data() {
    return {
      inputText: "",
      inputFile: [],
      height:500,
      loading: false,
      errorMsg:"",
      snackbar: false,
      sheet: false,
      inputWindowWidth: 300,
      messageWindowHeight: 300,
      username: "",
      messages: [],
    };
  },
  components:{
    MessageItem,
  },

  computed: {
    // username(){
    //   return this.$store.state.username;
    // },
    color() {
      return this.$store.state.color;
    },

    containerColor: function(){
      return 'border: 2px solid ' + this.$store.state.color
      // return 'border: 2px solid red'
    },

  },

  beforeCreate() {
      if ( !this.$store.state.loginState ) {
          this.$router.push("/");
      }
  },
  created() {
    console.log("mainwindow created")
    socket.connect()
  },

  mounted() {
    console.log("mainwindow mounted")

    socket.emit('user join', {
      username: this.$store.state.username,
    })

    socket.on('new message', (msg) => {
      console.log("new message")
      console.log(msg)
      this.messages.push(msg);
    })

    socket.on('reset', () => {
      this.$store.commit('setLoginState', false)
      this.$router.push('/')
    })

    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
      this.onResize()
    })
  },
  
  updated() {
        var container = this.$el.querySelector('#scrollable');
        container.scrollTop = container.scrollHeight;
  },
  beforeDestroy() {
    console.log("mainwindow beforedestory")

    socket.emit('user left', {
      username: this.$store.state.username
    })
    socket.disconnect()

    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    containerClass(){
      return this.$store.state.color
    },
    onResize(){
      this.messageWindowHeight = window.innerHeight - document.getElementById("input-window").offsetHeight - 50;
      // this.messageWindowHeight = document.getElementById("container").offsetHeight - document.getElementById("input-window").offsetHeight;
      this.inputWindowWidth = document.getElementById("container").offsetWidth - 8;
    },
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
              username: this.$store.state.username,
              color: this.$store.state.color,
              path: URL.createObjectURL(file),
        }
        this.messages.push(msg);

        formData.append("file", file, file.name);

          axios.post("/api/upload_file", formData)
            .then(response => {
              console.log("upload success, response is")
              let t_msg = { ...msg }  //deep copy
              t_msg.receive = true
              t_msg.path = response.data.path
              socket.emit('new message', t_msg);
              this.loading = false
              this.inputFile = []
            })
            .catch(error => {
              console.log("upload error")
              console.log(error)
              this.loading = false
              this.errorMsg = error
              this.snackbar = true
            })

            this.loading = true
      }
      else {      
        if (!this.inputText) { return }
        
        const msg = {
          type: "text",
          data: this.inputText,
          time: Date.now(),
          receive: false,
          username: this.$store.state.username,
          color: this.$store.state.color,
        }
        this.messages.push(msg)

        var t_msg = {...msg}
        t_msg.receive = true
        socket.emit('new message', t_msg);
        this.inputText = ""
      }

    },

    // download() {
    //   console.log("download");
    // }

  },
};
</script>

<style scoped>
#scrollable {
  overflow-x:hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  /* height: calc(100vh - 22rem); */
}
/* .v-container {
  background-color: bisque;
  height: 100%;
  overflow: hidden;
} */

#container {
  padding: 2px;
  /* height: 1px; */
  /* min-height: 100%; */
  /* background-color: aqua; */
}
#main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
#messages-window {
  width: 100%;
}

#input-window {
  position: fixed;
  bottom: 0px;
  z-index: 1;
}

/* .v-textarea {
  height: 7rem;
}  */
</style>