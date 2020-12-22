<template>
  <div id="message-box"  class="primary pa-0 ma-1 d-flex flex-row" :class="{'flex-row-reverse': !message.receive}">
    <div id="avatar" style="background-color: white" class="d-flex align-end">
      <v-avatar v-bind:color="message.color">
        <span class="white--text headline">{{
          message.username[0].toUpperCase()
        }}</span>
      </v-avatar>
    </div>

    <div
      id="message-part"
      class="ma-0 mb-6 ml-1 mr-1 red d-flex flex-column"
      :class="{ 'align-end': !message.receive }"
    >
      <div id="message-title" style="background-color: pink">
        <span v-bind:color="message.color" class="font-weight-bold"
          >{{ message.username }}&emsp;</span
        >
        <span class="font-weight-light caption">{{
          toFormatDate(message.time)
        }}</span>
      </div>

      <!-- text part -->
      <template v-if="message.type === 'text'">
        <div
          id="text-message"
          class="pa-1 orange message-text-content"
          :style="
            message.receive
              ? `border-bottom-right-radius: 1rem;`
              : `border-bottom-left-radius: 1rem;`
          "
        >
          <div  class="align-self-center text-content">
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
              ? `border-bottom-right-radius: 1rem;`
              : `border-bottom-left-radius: 1rem;`
          "
          v-on:click="downloadFile"
        >
          <div  class="align-self-center text-content">
          {{ message.data }}
          </div>
           <v-icon right>mdi-file-document-multiple-outline</v-icon>
        </div>
      </template>

      <!-- image part -->
      <template v-if="message.type === 'image'" :path="message.info.path">
        <image-item></image-item>
      </template>
    </div>
  </div>
</template>


<script>
import ImageItem from './ImageItem.vue';
const axios = require("axios");

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
          toFormatDate(time) {
            var dateFormat = require('dateformat');
            return dateFormat(time, "mm-dd HH:MM");
          },
          downloadFile() {
            console.log("download file")
            console.log("path " + this.message.info.path)
            console.log("name " + this.message.info.name)

            axios.get("/temp",
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                params: {
                  name: this.message.info.name,
                  originalName: this.message.data,
                }
            })
            .then((response) => {
                var mime_type = response.headers['content-type']
                console.log("browser type is " + mime_type)

                const url = window.URL.createObjectURL(new Blob([response.data], {type : mime_type}));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', decodeURI(response.headers["content-disposition"].split("filename=")[1]));
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
    min-width: 10vw;
    min-height: 10vh;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem; 
    display: flex;
}

.text-content {
    max-width: 40vw;
}

#message-part {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 1.5rem; */
}
</style>