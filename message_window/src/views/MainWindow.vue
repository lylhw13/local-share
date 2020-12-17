<template>
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="messages-window" v-bind:style="messageCon">
        <v-list color="purple lighten-3" id="scrollable" v-bind:style="{ 'height': `calc(${mainHeight}vh - ${height}px)`}">
          <div id="message-row"
            v-for="(item, index) in messages"
            :key="index"
            outlined
            class="primary pa-0 ma-1 d-flex flex-row"
            :class="{'flex-row-reverse': !item.receive}"
          >
          <div style="background-color: white;" class="d-flex align-end">
            <v-avatar v-bind:color="item.color">
              <span class="white--text headline">{{(item.username[0].toUpperCase())}}</span>
            </v-avatar>
          </div>
          <div id="message-box" class="ma-0 mb-6 ml-1 mr-1 red d-flex flex-column"
            :class="{'align-end': !item.receive}">
              <div id="message-title" 
                  style="background-color: pink;">
                <span v-bind:color="item.color" class="font-weight-bold">{{item.username}}&emsp;</span>
                <span class="font-weight-light caption">{{toFormatDate(item.time)}}</span>
              </div>

              <div id="text-message" outline 
              v-show="item.type === 'text'"
              class="pa-1 orange"
              style="max-width: 60vw; border-top-left-radius: 1rem; border-top-right-radius: 1rem; "
              :style=" item.receive ? `border-bottom-right-radius: 1rem;` : `border-bottom-left-radius: 1rem;`"
              >
                  hello card
                  {{ index }}
                  {{item.message}}
              </div>

              <div id="image-message" v-show="item.type === 'jpg'">
                  <v-menu offset-y absolute rounded="lg">
                  <template v-slot:activator="{ on, attrs }">
                      <v-img 
                        max-height="50vh"
                        max-width="30vw"
                        contain
                        :src="require('../assets/bg.jpg')" v-on:click="download"
                        v-bind="attrs"
                        v-on="on">
                      </v-img>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      dense
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <div id="file-message" v-show="item.type === 'file'">
                  <v-menu offset-y absolute rounded="lg">
                  <template v-slot:activator="{ on, attrs }">
                      <div id="file-message" outline 
                      v-show="item.type === 'file'"
                      class="pa-1 cyan d-flex"
                      style="min-width:10vw; min-height:10vh; border-top-left-radius: 1rem; border-top-right-radius: 1rem; "
                      :style=" item.receive ? `border-bottom-right-radius: 1rem;` : `border-bottom-left-radius: 1rem;`"
                      v-bind="attrs"
                      v-on="on"
                      >
                        <div class="align-self-center" style="max-width:40vw;">
                            hello card mdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outline
                            hello card mdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outline
                            {{ index }}
                            {{item.message}}
                        </div>
                        <v-icon right>mdi-file-document-multiple-outline</v-icon>
                      </div>
                  </template>
                  <v-list dense>
                    <!-- <v-list-item-group color="primary"> -->
                      
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      color="success"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                    <!-- </v-list-item-group> -->

                  </v-list>
                </v-menu>
              </div>

              <div>

              </div>

          </div>

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
const axios = require("axios");
// const multer = requirs("multer");
const FormData = require('form-data');
const io = require('socket.io-client');
var socket = io();

export default {
  data() {
    return {
      messageCon: {},
      inputText: "",
      inputFile: [],
      height:500,
      // username: "",
      // messages: [],
      // username: "周杰伦",
      messages: [{
          message:"hahah",
          time: Date.now(),
          receive: false,  
          username: "hello",
          color: "red",
          type: "file",
      },{
          message:"hahah",
          time: Date.now(),
          receive: true,  
          username: "hello",
          color: "red",
          type: "file",
      }],

      items: [
        { title: 'zoomup' },
        { title: 'download' },
      ],
    };
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

    toFormatDate(time) {
      var dateFormat = require('dateformat');
      return dateFormat(time, "mm-dd HH:MM");
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

#message-box {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 1.5rem; */
}

#input-window {
  display: flex;
  flex-direction: column;
}

.v-textarea {
  height: 7rem;
} 
</style>