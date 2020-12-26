<template>
  <nav id="navbar">
    <v-app-bar flat app dense>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Local</span>
        <span>share</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        text
        color="grey"
        v-on:click="dialog = !dialog"
        v-show="loginState"
      >
        <span class="hidden-sm-and-down">Join</span>
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
      <v-btn text color="grey" v-on:click="exitApp" v-show="loginState">
        <span class="hidden-sm-and-down">Sign Out</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

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
import QRCode from "qrcodejs2";

export default {
  components: {
  },
  data() {
    return {
      dialog: false,
      serverUrl: "",
      qrcodeState: false,
    };
  },
  computed: {
      loginState() {
          return this.$store.state.loginState;
      }

  },
  watch: {
    dialog: function (val) {
      if (val && !this.qrcodeState) {
        let curr_url = new URL(window.location.href);

        if (curr_url.hostname === "127.0.0.1") {
          this.serverUrl = curr_url.protocol + "//" + this.$store.state.serverIp + ":" + curr_url.port;
        } 
        else 
          this.serverUrl = curr_url.protocol + "//" + curr_url.host;

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
    exitApp() {
      this.$store.commit('setLoginState', false)
      this.$router.push('/')
    },
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
  margin: auto;
}
</style>>
