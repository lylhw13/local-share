<template>
  <v-container fill-height d-flex flex-column>
    <span id="title">{{ pageTitle }}</span>
    <div id="content" v-bind:style="$vuetify.breakpoint.mdAndDown ? 'width:100%;' : 'width:50%;'">
      <v-flex d-flex align-center flex-column>
        <v-text-field
          clearable
          clear-icon="mdi-close-circle"
          label="Please input your nickname..."
          rows="1"
          no-resize
          maxlength="32"
          :rules="rules.notempty"
          required
          outlined
          xs12
          sm6
          md4
          v-model="username"
        >
        </v-text-field>

        <v-text-field
          clearable
          clear-icon="mdi-close-circle"
          label="Pleas input password..."
          rows="1"
          no-resize
          maxlength="32"
          :rules="rules.notempty"
          required
          outlined
          v-model="password"
        >
        </v-text-field>

        <v-card outlined width="100%" color="grey lighten-3">
          <div class="full_div pa-1">
            <span class="avater-title pl-2 text-body-1">Click avatar to set color...</span>
            <v-dialog v-model="dialog" max-width="300">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar
                  v-bind="attrs"
                  v-on="on"
                  v-bind:color="color"
                  v-on:click="dialog = true"
                >
                  <span class="white--text headline">{{
                    username ? username[0].toUpperCase() : "A"
                  }}</span>
                </v-avatar>
              </template>

              <v-color-picker v-model="color" show-swatches swatches-max-height="200"> </v-color-picker>
            </v-dialog>
          </div>
        </v-card>

        <v-btn v-on:click="login" class="ma-6 align-center">{{ btnTxt }}</v-btn>
      </v-flex>
    </div>

    <v-alert
      v-model="alert"
      border="left"
      close-text="Close Alert"
      color="deep-purple accent-4"
      dark
      dismissible
    >
    </v-alert>
  </v-container>
</template>

<script>
const axios = require("axios");

export default {
  data() {
    return {
      username: "",
      password: "",
      color: "red",
      pageTitle: this.isServerPage ? "Server Setting" : "Please Login",
      btnTxt: this.isServerPage ? "Setting" : "Login",
      dialog: false,
      alert: false,
      rules: {
        notempty: [(val) => (val || "").length > 0 || "This field is required"],
      },
    };
  },
  beforeCreate() {
    this.isServerPage = false;
    // console.log(new URL(window.location.href).hostname);
    const currentUrl = new URL(window.location.href);
    // console.log("hostname is " + currentUrl.hostname);
    // console.log("port is " + currentUrl.port);
    if (currentUrl.hostname === "127.0.0.1") {
      this.isServerPage = true;
    //   console.log("server page");
    }
  },
  computed: {
      loginState() {
            return this.$store.state.loginState;
      }
  },
  watch:{
    loginState: function(val){
        if (val) {
            // this.$router.push("/MessageWindow");
            console.log("watch")
        }
    }
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        return;
      }

      console.log("username is " + this.username);
      console.log("password is " + this.password);
      console.log(this.isServerPage);

    //         this.$store.commit("setUsername", this.username);
    //         this.$store.commit("setLoginState", true);
    //         console.log("log state is " + this.$store.state.loginState)
    //         this.$router.push("/messagewindow");

      let url = "/api/login";

      if (this.isServerPage) {
        url = "/api/setting";
      }

      const that = this;
      console.log("axios");
      axios({
        method: "post",
        url: url,
        data: {
          username: this.username,
          password: this.password,
          color: this.color,
        },
      })
        .then(function (response) {
          console.log("response " + response.data.serverIp);
            
          if (that.isServerPage) {
            that.$store.commit("setServerIp", response.data.serverIp)
            console.log("srever ip is" + that.$store.state.serverIp)
          }

            // checking password
            // that.$store.commit("setUsername", that.username);
            // that.$store.commit("setLoginState", true);
            // console.log("log state is " + that.$store.state.loginState)
            // that.$router.push("/MessageWindow");
            that.$store.commit("setUsername", that.username);
            that.$store.commit("setLoginState", true);
            that.$store.commit("setColor", that.color);
            console.log("usename is " + that.$store.state.username);
            console.log("log state is " + that.$store.state.loginState);
            that.$router.push("/messagewindow");
        })
        .catch(function (error) {
          console.log("error " + error);
          console.log("error response ")
          console.log(error.response.data)
          if (error.response.status === '401') {
            that.password = "";
          } else if (error.response.status === '409') {
            that.username = "";
          }
          // that.alert = true
          alert(error.response.data.message);
        //   return;
        });

            // this.$store.commit("setUsername", this.username);
            // this.$store.commit("setLoginState", true);
            // this.$store.commit("setColor", this.color);
            // console.log("usename is " + this.$store.state.username);
            // console.log("log state is " + this.$store.state.loginState);
            // this.$router.push("/messagewindow");
    },

  },
};
</script>

<style scoped>
.v-text-field {
  width: 100%;
}

#title {
  font-size: 20px;
  padding: auto;
  padding-bottom: 2rem;
}

.full_div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.avater-title {
  display: flex;
  justify-content: center;
  align-items: center; 
}
</style>