<template>
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="messages-window" v-bind:style="messageCon">
        <v-list full-height color="purple lighten-3" class="scrollable" id="messageList">
          <div
            v-for="(item, index) in messages"
            :key="index"
            outlined
            id="message-row"
            class="primary pa-2 ma-2 d-flex flex-row"
            :class="{'flex-row-reverse': item.receive}"
          >
          <div style="background-color: white;" class="d-flex align-end">
            <v-avatar v-bind:color="item.color">
              <span class="white--text headline">{{username[0].toUpperCase()}}</span>
            </v-avatar>
          </div>
          <div id="message-box" class="ma-1 mb-6 red d-flex"
            :class="{'align-end':item.receive}">
              <div id="message-title">
                <span>{{item.username}}</span>
                <span class="font-weight-light">{{toFormatDate(item.time)}}</span>
              </div>

              <div
              id="message-content"
              outline
              class="pa-1 orange"
              style="
                max-width: 60%;
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
              "
              :style=" item.receive ? `border-bottom-left-radius: 1rem;` : `border-bottom-right-radius: 1rem;`
              "
            >
              {{ index }}
              <!-- time is {{item.time}}, -->
              nickname is {{ item.nickname }},
              message is {{item.message}}
            </div>

          </div>

          

          </div>
        </v-list>
      </div>

      <div class="inputArea">
        <v-textarea id="input"
          backgroud-color="blue"
          color="cyan"
          rows="3"
          no-resize
          outlined
          placeholder="Input your message..."
          v-model="inputText"
        >
          {{ inputText }}
        </v-textarea>

        <v-btn v-on:click="send">
          发送
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
const io = require('socket.io-client');
var socket = io();

export default {
  data() {
    return {
      messageCon: {},
      inputText: "",
      username: "周杰伦",
      messages: [{
          message:"hahah",
          time: Date.now(),
          receive: true,  
          username: "hello",
          color: "red",
          type: "text",
      }]
    };
  },

  beforeCreate() {
      // if ( !this.$store.loginstate ) {
      //     this.$router.push("/login");
      // }
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
    })
  },

  updated() {
        var container = this.$el.querySelector('#messageList');
        container.scrollTop = container.scrollHeight;
  },

  methods: {
    send(){
      if (!this.inputText) { return }
      this.messages.push(this.inputText);
      const msg = {
        message: this.inputText,
        time: Date.now(),
        receive: false,
        username: this.username,
        color: this.$store.color,
        type: "text"
      }
      socket.emit('new message', msg);
    },

    toFormatDate(time) {
      var dateFormat = require('dateformat');
      return dateFormat(time, "mm-dd HH:MM");
    }

  },
};
</script>

<style scoped>
.scrollable {
  overflow-y: auto;
  height: calc(90vh - 7rem);
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
  align-items: stretch;
  justify-content: space-between;
}
#messages-window {
  background-color: dark;
  flex: 1;
}

#message-row {
  /* display: flex; */
  /* flex-direction: row; */
}

#message-box {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 1.5rem; */
}

.inputArea {
  display: flex;
  flex: row;
}

.v-textarea {
  height: 7rem;
} 
</style>