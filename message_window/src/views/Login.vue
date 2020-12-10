<template>
    <v-container fill-height d-flex flex-column>
            
        <span id="title">{{pageTitle}}</span>
        <div id="content"
        >
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
                xs12 sm6 md4
                v-model="username">
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
                v-model="password">

            </v-text-field>
        <v-btn v-on:click="login" align-center>{{btnTxt}}</v-btn>
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
const axios = require('axios')

export default {
    data(){
        return {
            username: "",
            password: "",
            pageTitle: this.isServerPage? "Server Setting": "Please login",
            btnTxt: this.isServerPage? "Setting": "Login",
            alert: false,
            rules: {
                notempty: [val => (val || '').length > 0 || 'This field is required'],
            }
        }
    },
    beforeCreate() {
        this.isServerPage = false;
        console.log((new URL(window.location.href)).hostname)
        window.location.href.hostname
        const currentUrl = new URL(window.location.href);
        console.log("hostname is " + currentUrl.hostname)
        console.log("port is " + currentUrl.port)
        if (currentUrl.hostname === "127.0.0.1") {
            this.isServerPage = true
            console.log("server page")
        }
    },
    mounted() {
        
    },
    methods: {
        login () {
            if(!this.username || !this.password) { return }

            console.log("username is " + this.username);
            console.log("password is " + this.password);
            console.log(this.isServerPage)

            //if password is right
            // this.$router.push('/MessageWindow');
            let url = "/api/login";

            // if (this.isServerPage) {
            //     url = "/api/setting";
            // }
            const that = this
            console.log("axios")
                //setting password
                axios({
                    method: 'post',
                    url: url,
                    data: {
                        username: this.username,
                        password: this.password
                    }
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error.message);
                    if (error.response.status == 401) {
                        that.password = "";
                    }
                    else if (error.response.status == 409) {
                        that.username = "";
                    }
                    // that.alert = true
                    alert(that.message)
                })


                // checking password
                this.$store.commit("setUsername", this.username);
                // this.$router.push('/MessageWindow');
        }
    },
}
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
    background-color: aqua;
}
</style>