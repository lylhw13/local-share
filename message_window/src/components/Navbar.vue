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
            <span>Add</span>
            <v-icon right>mdi-plus</v-icon>
        </v-btn>
          <v-btn text color="grey">
              <span>Sign Out</span>
              <v-icon right> mdi-export</v-icon>
          </v-btn>
      </v-app-bar>
      <v-card v-model="addUser">
          <AddUser/>
      </v-card>

      <v-dialog v-model="dialog" max-width="500">
          <div id="dialog-div" style="background-color:white;">
          <span>方法1: 在浏览器中输入以下网址:</span>
          <br/>
          <span> {{url}}</span>
          <br/>
        <span>方法2: 用手机扫描以下二维码:</span>
          <br/>
            <div id="qrcodeid"></div>
          </div>
      </v-dialog>
    </nav>
</template>

<script>
import AddUser from './AddUser'
import QRCode from 'qrcodejs2'

export default {
    components: {
        AddUser
    },
    data() {
        return {
            addUser: false,
            dialog: false,
            url: "",
            qrcodeState: false,
        }
    },
    mounted() {
        let serverUel = new URL(window.location.href)
        this.url = serverUel.protocol + "//" + serverUel.host
    },
    watch: {
        dialog: function(val){
            if (val && !this.qrcodeState) {
                this.$nextTick(()=>{
                    new QRCode(document.getElementById("qrcodeid"), {
                            text: "http://192.168.0.100:8080",
                            width: 256,
                            height: 256,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                        });
                    this.qrcodeState = true;
                })  
            }
        }
    },
    methods: {
        changeVis(){
            this.addUser = !this.addUser;
            console.log("click");
        },
    }
}
</script>

<style scoped>
#dialog-div {
    padding: 5px;
}
#qrcodeid {
      width: 270px;
      height: 270px;
      background-color: #fff; 
      padding: 5px; 
      border: solid 2px;
      margin: 5px;
  }
</style>>
