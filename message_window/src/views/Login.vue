<template>
  <v-container fill-height d-flex flex-column>
    <span id="title">{{ pageTitle }}</span>
    <div id="content">
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
          dense
          color="orange"
          background-color="light-blue"
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
          dense
          v-model="password"
        >
        </v-text-field>

        <v-card outlined width="100%" class="">
          <div class="full_div pa-1">
            <span class="title pl-2 text-body-1">Click avatar to set color...</span>
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
        <v-btn v-on:click="login" align-center>{{ btnTxt }}</v-btn>
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
      pageTitle: this.isServerPage ? "Server Setting" : "Please login",
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
    console.log(new URL(window.location.href).hostname);
    const currentUrl = new URL(window.location.href);
    console.log("hostname is " + currentUrl.hostname);
    console.log("port is " + currentUrl.port);
    if (currentUrl.hostname === "127.0.0.1") {
      this.isServerPage = true;
      console.log("server page");
    }
  },
  mounted() {},
  methods: {
    login() {
      if (!this.username || !this.password) {
        return;
      }

      console.log("username is " + this.username);
      console.log("password is " + this.password);
      console.log(this.isServerPage);

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
          console.log(response);
        })
        .catch(function (error) {
          console.log(error.message);
          if (error.response.status == 401) {
            that.password = "";
          } else if (error.response.status == 409) {
            that.username = "";
          }
          // that.alert = true
          alert(that.message);
          return;
        });

      // checking password
      this.$store.commit("setUsername", this.username);
      this.$store.commit("setLoginState", true);
      this.$router.push("/MessageWindow");
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
  padding: 5rem;
}

.full_width {
  width: 100%;
}

.half_width {
  width: 50%;
}

#content {
  width: 100%;
}

.full_div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.title {
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
}
</style>