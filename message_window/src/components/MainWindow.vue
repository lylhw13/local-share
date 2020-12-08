<template>
  <!-- <v-container fluid ma-0 pa-0 class="success lighten-4" md-6> -->
  <!-- <v-container class="grey lighten-1"> -->
  <!-- <v-layout row wrap>  -->
  <!-- <v-flex xs12 md6>
            <v-btn outline block class="primary"> 1</v-btn>
        </v-flex>
        <v-flex xs4 md2>
            <v-btn outline block class="primary"> 2</v-btn>
        </v-flex>
                <v-flex xs4 md2>
            <v-btn outline block class="primary"> 2</v-btn>
        </v-flex>
                <v-flex xs4 md2>
            <v-btn outline block class="primary"> 2</v-btn>
        </v-flex> -->
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="message-content" v-bind:style="messageCon">
        <v-list full-height color="purple lighten-3" class="scrollable" ref="messageList" id="messageList">
          <div
            v-for="(item, index) in messages"
            :key="index"
            outlined
            class="primary pa-2 ma-2 d-flex flex-row"
            :class="index % 2 === 1 ? '' : 'flex-row-reverse'"
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
              :style="
                index % 2 === 1
                  ? `border-bottom-right-radius: 1rem;`
                  : `border-bottom-left-radius: 1rem;`
              "
            >
              {{ index }}
              {{ item }}
            </div>
          </div>
          <!-- <v-list-item v-for="n in 3" :key="n"> -->
          <!-- <v-card outlined
            class="pa-2 primary rounded-tl-xl rounded-tr-xl" 
            :class="n/2 === 1? `rounded-bl-xl text-right`: `rounded-br-xl`">

            flex item {{ n }}
          </v-card> -->
          <!-- <v-list-item-content fluid
            outlined
            class="pa-2 primary rounded-tl-xl rounded-tr-xl">
            <v-card
                outlined
                class="orange" witdh="20%">
            flex item {{n}}
            </v-card>
          </v-list-item-content> -->
          <!-- <div outlined class="primary pa-2 align-right">
              hello
          </div>
        </v-list-item> -->
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
      messages:
        [" Regardless of whether the asynchronous operation completes immediately orinvocation"],
    };
  },

  mounted() {
    // const io=require('socket.io-client');

    // var socket = io();
    socket.on('new message', (msg) => {
        // const usename = msg.usename;
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