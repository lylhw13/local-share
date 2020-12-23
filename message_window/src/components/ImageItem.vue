<template>
  <div id="image-message">
    <v-img
      max-width="50vw"
      contain
      :src="path"
      v-on:click="dialog = !dialog"
      v-on:load="$emit('loaded')"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-dialog v-model="dialog" transition="dialog-transition">
      <v-card v-on:click="dialog = !dialog">
        <v-img :src="path" contain
        >
        </v-img>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <template>
         <v-btn
            color="blue-grey"
            class="ma-0 white--text"
            fab
            small
            v-on:click="$emit('download-file')"
            >
        <v-icon dark download>
            mdi-cloud-download
        </v-icon>
        </v-btn>
          </template>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: "ImageDialog",
  props: ["path"],
  data() {
    return {
      dialog: false,
      isIOS: false,
    };
  },
  beforeCreate() {

    // this.picsrc = require("../assets/bg.jpg");
    // this.picsrc = this.path

    // console.log(this.picsrc)
    // var img = new Image()
    // img.src = this.picsrc
    // this.ratio = img.width / img.height
    // console.log(img.height)
    // console.log(img.width)
    // console.log(this.ratio)
  },
  mounted() {
    this.isIOS = this.iOS()
  },
  methods: {
    //   download() {
    //       console.log("download")

    //         var FileSaver = require('file-saver');
    //         FileSaver.saveAs(this.path, "image.jpg");
    //   },
      // loaded(){
      //   console.log("load finish")
      // },
      iOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        }
  },
};
</script>