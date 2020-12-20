<template>
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="messages-window">
        <v-list color="purple lighten-3" id="scrollable" v-bind:style="{ 'height': `calc(${mainHeight}vh - ${height}px)`}">
          <div id="message-row"
            v-for="(item, index) in messages"
            :key="index"
            >
          <message-item :message="item">hello</message-item>
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
            rows="3"
            no-resize
            outlined
            placeholder="Input your message..."
            v-model="inputText"
            v-bind:disabled="inputFile.length > 0"
          >
          </v-textarea>

          <v-btn v-on:click="send" class="align-self-end mr-5">
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

export default {
  data() {
    return {
      inputText: "",
      inputFile: [],
      height:500,
      // username: "",
      // messages: [],
      messages: [{
          data:"hahah",
          time: Date.now(),
          receive: false,  
          username: "hello",
          color: "red",
          type: "file",
      },{
          data:"hahah",
          time: Date.now(),
          receive: true,  
          username: "hello",
          color: "red",
          type: "text",
      },{
          data:"hahah",
          time: Date.now(),
          receive: false,  
          username: "hello",
          color: "red",
          type: "image",
      }],


    };
  },
  components:{
    MessageItem
  },

  beforeCreate() {
      // if ( !this.$store.state.loginState ) {
      //     this.$router.push("/");
      // }
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

  mounted() {
    // new message
    socket.on('new message', (msg) => {
      msg.receive = true;
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
      
      var formData = new FormData();
      for (let file of this.inputFile) {
        formData.append("file", file, file.name);
      }

      axios.post("/upload_file", formData)
            .then(response => {
              console.log("success")
              console.log(response)
            })
            .catch( error => {
              console.log("error")
              console.log(error)
            })

      if (!this.inputFile) {
        console.log(this.inputFile);
        return;
      }
      if (!this.inputText) { return }
      
      const msg = {
        message: this.inputText,
        time: Date.now(),
        receive: false,
        username: this.username,
        color: this.color,
        type: "text"
      }

      // console.log("color is " + msg.color)
      this.messages.push(msg);
      socket.emit('new message', msg);
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