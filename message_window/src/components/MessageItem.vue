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
       <!--  <div id="file-message">
          <v-menu offset-y absolute rounded="lg">
            <template v-slot:activator="{ on, attrs }">
              <div
                id="file-message"
                class="pa-1 cyan message-text-content"
                :style="
                  message.receive
                    ? `border-bottom-right-radius: 1rem;`
                    : `border-bottom-left-radius: 1rem;`
                "
                v-bind="attrs"
                v-on="on"
              >
                <div class="align-self-center text-content">
                  hello card
                  mdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outline
                  hello card
                  mdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outlinemdi-file-document-multiple-outline
                  {{ message.data }}
                </div>
                <v-icon right>mdi-file-document-multiple-outline</v-icon>
              </div>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                color="success"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> 
        </div> -->
      </template>

      <!-- image part -->
      <template v-if="message.type === 'image'">
        <!-- <div id="image-message">
          <v-menu offset-y absolute rounded="lg">
            <template v-slot:activator="{ on, attrs }">
              <v-img
                max-height="50vh"
                max-width="30vw"
                contain
                :src="require('../assets/bg.jpg')"
                v-on:click="download"
                v-bind="attrs"
                v-on="on"
              >
              </v-img>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in items" :key="index" dense>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div> -->
        <image-item></image-item>
      </template>
    </div>
  </div>
</template>


<script>
import ImageItem from './ImageItem.vue';
// const FileSaver = require('file-saver')
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
            //path = window.location.href + this.message.path
            const path = this.message.path
            console.log(path)
            // FileSaver.saveAs(path, this.message.data)

            axios.get("/temp/" + "hello.pdf",
            {
              // params: {
              //     name: this.message.filename
              //   },
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type : 'application/gzip'}));
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('href', 'data:application/pdf;');
                // link.setAttribute('download', response.headers["content-disposition"].split("filename=")[1]);
                link.setAttribute('name', 'file.pdf'); //or any other extension
                // link.setAttribute('type', 'application/pdf')
                document.body.appendChild(link);
                link.click();

            })
            .catch((error) => console.log(error));
          }

          // download(filename, text) {
          // var pom = document.createElement('a');
          // pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
          // pom.setAttribute('download', filename);

          // if (document.createEvent) {
          //     var event = document.createEvent('MouseEvents');
          //     event.initEvent('click', true, true);
          //     pom.dispatchEvent(event);
          // }
          // else {
          //     pom.click();
          // }
// }
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