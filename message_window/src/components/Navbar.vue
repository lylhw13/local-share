<template>
  <nav>
    <v-app-bar flat app>
      <!-- <v-toolbar-side-icon class="grey--text">

          </v-toolbar-side-icon> -->
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Local</span>
        <span>share</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text color="grey" v-on:click="dialog = !dialog">
        <span class="hidden-sm-and-down">Join</span>
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
      <v-btn text color="grey" v-on:click="exitApp">
        <span class="hidden-sm-and-down">Sign Out</span>
        <v-icon right> mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card v-model="addUser">
      <AddUser />
    </v-card>

    <v-dialog v-model="dialog" max-width="310">
      <div id="dialog-div" style="background-color: white">
        <p>方法1: 在浏览器中输入以下网址:</p>
        <p id="url_text">{{ serverUrl }}</p>
        <p>方法2: 用手机扫描以下二维码:</p>
        <div id="qrcodeid"></div>
      </div>
    </v-dialog>
  </nav>
</template>

<script>
import AddUser from "./AddUser";
import QRCode from "qrcodejs2";

export default {
  components: {
    AddUser,
  },
  data() {
    return {
      addUser: false,
      dialog: false,
      url: "",
      serverUrl: "",
      qrcodeState: false,
    };
  },
  mounted() {
    let curr_url = new URL(window.location.href);

    if (curr_url.hostname === "127.0.0.1") {
        this.serverUrl = curr_url.protocol + "//" + this.$store.state.serverIp + ":" + curr_url.port;
    }
    else 
        this.serverUrl = curr_url.protocol + "//" + curr_url.host;
  },
  watch: {
    dialog: function (val) {
      if (val && !this.qrcodeState) {
        this.$nextTick(() => {
          new QRCode(document.getElementById("qrcodeid"), {
            text: this.serverUrl,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
          this.qrcodeState = true;
        });
      }
    },
  },

  methods: {
    changeVis() {
      this.addUser = !this.addUser;
      console.log("click");
    },

    exitApp() {
        console.log("username is " + this.$store.state.username);
        this.$store.commit("setUsername", 123);
        console.log("username is " + this.$store.state.username);
    }
  },
};
</script>

<style scoped>
#dialog-div {
  padding: 20px;
  opacity: 1;
}

#url_text {
  text-align: center;
}

#qrcodeid {
  width: 270px;
  height: 270px;
  background-color: #fff;
  padding: 5px;
  border: solid 2px;
  /* margin: 5px; */
  margin: auto;
}
</style>>
