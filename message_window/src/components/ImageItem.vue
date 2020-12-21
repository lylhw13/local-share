<template>
  <div id="image-message">
    <v-img
      max-width="50vw"
      contain
      :src="picsrc"
      v-on:click="dialog = !dialog"
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
        <v-img :src="picsrc" contain
        >
        </v-img>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <template v-if="!isIOS">
         <v-btn
            color="blue-grey"
            class="ma-0 white--text"
            fab
            small
            >
        <v-icon dark download>
            mdi-cloud-download
        </v-icon>
        </v-btn>
          </template>

        <template v-if="isIOS">
            <a :href="picsrc" download>Download</a>
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
      // picsrc,
      dialog: false,
      isIOS: false,
      // items: []
    };
  },
  beforeCreate() {
    // function gcd (a, b) {
    //     return (b == 0) ? a : gcd (b, a%b);
    // }
    // this.picsrc = require("../assets/bg.jpg");
    this.picsrc = require(this.path)

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
      download() {
          console.log("download")

            var FileSaver = require('file-saver');
            FileSaver.saveAs(this.picsrc, "image.jpg");
      },
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