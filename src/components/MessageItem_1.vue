<template>
<div class="red pa-0 ma-1 d-flex flex-column" :class="{'flex-row-reverse': !message.receive}">
  <div id="message-title" class="mb-1 grey lighten-1">
        <span v-bind:color="message.color" class="font-weight-bold"
          >{{ message.username }}&emsp;</span
        >
        <span class="font-weight-light caption">{{
          toFormatDate(message.time)
        }}</span>
      </div>
  <div id="message-box"  class="grey lighten-3 pa-0 ma-1 d-flex flex-row" :class="{'flex-row-reverse': !message.receive}">
    <div id="avatar" class="d-flex align-end">
      <v-avatar v-bind:color="message.color" size='40'>
        <span class="white--text headline">{{
          message.username[0].toUpperCase()
        }}</span>
      </v-avatar>
    </div>

    <div
      id="message-part"
      class="ma-0 mb-5 ml-1 mr-1 d-flex flex-column"
      :class="message.receive ?'align-start':'align-end'"
    >
      <!-- <div id="message-title" class="mb-1 grey lighten-1">
        <span v-bind:color="message.color" class="font-weight-bold"
          >{{ message.username }}&emsp;</span
        >
        <span class="font-weight-light caption">{{
          toFormatDate(message.time)
        }}</span>
      </div> -->

      <!-- text part -->
      <template v-if="message.type === 'text'">    
        <div
          id="text-message"
          class="pa-1 orange message-text-content"
          :style="
            message.receive
              ? `border-bottom-right-radius: 0.5rem;`
              : `border-bottom-left-radius: 0.5rem;`
          "
        >
          <div class="text-content">
          {{ message.data }}
          </div>
        </div>
      </template>

      <!-- file part -->
      <template v-if="message.type === 'file'">
        <div
          id="file-message"
          class="pa-1 orange message-text-content"
          :style="
            message.receive
              ? `border-bottom-right-radius: 0.5rem;`
              : `border-bottom-left-radius: 0.5rem;`
          "
          v-on:click="downloadFile"
        >
        <!-- <v-icon large>mdi-file-document-multiple-outline</v-icon> -->
          <div  class="align-self-center text-content">
          {{ message.data }}
          </div>
        </div>
      </template>

      <!-- image part -->
      <template v-if="message.type === 'image'" >
        <image-item :path="message.path" v-on:download-file="downloadFile" v-on:loaded="$emit('loaded')"></image-item>
      </template>
    </div>
  </div>
  </div>
</template>


<script>
import ImageItem from './ImageItem.vue';
const axios = require("axios");
var mime = require('mime-types')

export default {
    name: 'MessageItem',
    props: ["message"],
    data() {
      return {
        // items:[]
      }
    },

    components:{
        ImageItem
    },
    methods: {
      // loaded(){
      //   console.log("load finish")
      // },
          toFormatDate(time) {
            var dateFormat = require('dateformat');
            return dateFormat(time, "mm-dd HH:MM");
          },
          downloadFile() {
            console.log("download file")

            axios.get(this.message.path,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
            })
            .then((response) => {
                // var mime_type = response.headers['content-type']
                var mime_type = mime.lookup(this.message.data.split('.').pop())
                console.log("browser type is " + mime_type)

                const url = window.URL.createObjectURL(new Blob([response.data], {type : mime_type}));
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('download', decodeURI(response.headers["content-disposition"].split("filename=")[1]));
                link.setAttribute('download', this.message.data);
                document.body.appendChild(link);
                link.click();

            })
            .catch((error) => console.log(error));
          }
    },
};
</script>

<style scoped>
#message-box {
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.message-text-content {
    /* min-width: 10vw; */
    /* min-height: 10vh; */
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem; 
    display: flex;
    max-width: 40vw;
}

.text-content {
    padding: 0.25rem;
    overflow-wrap: break-word;
}

#message-part {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 1.5rem; */
}
</style>