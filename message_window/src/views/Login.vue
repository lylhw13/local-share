<template>
    <v-container>
        <span>login page</span>
        <!-- <v-textarea placeholder="Please Input Your Name..." v-model="username" v-on:keyup.enter="setUsername" outlined rows="1">
        </v-textarea> -->
        <v-input v-on:keyup.enter="setUsername" v-model="username" type="text">
        <!-- <v-btn v-on:click="setUsername"></v-btn> -->
        <!-- <input @keyup.enter="login" v-model.trim="name" type="text" autofocus> -->
    </v-container>
</template>

<script>
export default {
    data(){
        return {
            username: this.username
        }
    },
    methods: {
        setUsername () {
            // if (!this.username) { return}
            console.log("username is " + this.username);
            this.$store.commit("setUsername", this.username);
        }
    },
}
</script>