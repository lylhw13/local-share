<template>
    <v-container fill-height d-flex flex-column>
        <span id="title">Setting page</span>
        <div id="content"
        >
        <v-flex d-flex align-center flex-column>          
            <v-text-field 
                clearable
                clear-icon="mdi-close-circle"
                label="username"
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
                label="Password"
                rows="1"
                no-resize
                maxlength="32"
                :rules="rules.notempty"
                required
                outlined
                dense
                v-model="password">

            </v-text-field>
        <v-btn v-on:click="login" align-center>Setting</v-btn>
        </v-flex>
        </div>
        
    </v-container>
</template>

<script>

export default {
    data(){
        return {
            username: this.username,
            rules: {
                notempty: [val => (val || '').length > 0 || 'This field is required'],
            }

        }
    },
    methods: {
        login () {
            if(!this.username || !this.password) { return }

            console.log("username is " + this.username);
            console.log("password is " + this.password);
            this.$store.commit("setUsername", this.username);

            //if password is right
            this.$router.push('/');
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