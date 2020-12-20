<template>
  <div id="image-message">
    <v-img
      max-height="50vh"
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
    <v-dialog v-model="dialog" transition="dialog-transition" >
      <v-card v-on:click="dialog = !dialog">
          <!-- <v-toolbar app flat dense>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="dialog = !dialog"
          >
          Download
        </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = !dialog"
          >
            I accept
          </v-btn>
          </v-toolbar> -->
        <v-img :src="picsrc" contain max-height="100vh">
        </v-img>
        <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >
        </v-app-bar>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// const picsrc = require('../assets/bg.jpg')

export default {
  name: "ImageDialog",
  props: ["path"],
  data() {
    return {
      // picsrc,
      dialog: false,
      // items: []
    };
  },
  beforeCreate() {
    this.picsrc = require("../assets/bg.jpg");
  },
};
</script>