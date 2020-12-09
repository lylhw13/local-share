<template>
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="message-content" v-bind:style="messageCon">
        <v-list full-height color="purple lighten-3" class="scrollable" id="messageList">
          <div
            v-for="(item, index) in messages"
            :key="index"
            outlined
            class="primary pa-2 ma-2 d-flex flex-row"
            :class="{'flex-row-reverse': item.receive}"
          >
            <div
              id="message-box"
              outline
              class="pa-2 orange"
              style="
                max-width: 60%;
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
              "
              :style=" item.receive ? `border-bottom-right-radius: 1rem;` : `border-bottom-left-radius: 1rem;`
              "
            >
              {{ index }}
              <!-- time is {{item.time}}, -->
              nickname is {{ item.nickname }},
              message is {{item.message}}
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
      messages: [{
          message:"",
        //   time: "2020-10-01",
        //   receive: false,
          nickname: "hello",
        //   type: "",
      }]
    };
  },

  mounted() {
      if ( !this.$store.loginstate ) {
          
          this.$router.push("/login");
      }

    socket.on('new message', (msg) => {
      this.messages.push(msg.message);
    })
  },

  updated() {
    //   var container = this.$refs.messageList;
          var container = this.$el.querySelector('#messageList');
        container.scrollTop = container.scrollHeight;
  },

  methods: {
    send(){
        if (!this.inputText) { return }
    
    // const msg = {
    //     message: this.inputText,
    //     //   time: "2020-10-01",
    //     //   receive: false,
    //       nickname: this.$store.username,
    //     //   type: "",
    // }
      this.messages.push(this.inputText);
      socket.emit('new message', this.inputText);

    }
  },
};
</script>

<style scoped>
.scrollable {
  overflow-y: auto;
  height: calc(100vh - 7rem);
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
#message-content {
  background-color: dark;
  flex: 1;
}

.inputArea {
  display: flex;
  flex: row;
}

.v-textarea {
  height: 7rem;
} 
</style>