<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="!$route.meta.hideNavigation"/>
    <v-main>
      <router-link to="/"></router-link>
      <router-link to="/login"></router-link>
      <router-link to="/messagewindow"></router-link>
      <router-link to="*"></router-link>
      <router-view></router-view>
    </v-main>
   
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",

  components: {
    // HelloWorld,
    // Home
    // Home
    // MainWindow
    Navbar,
  },

  data: () => ({
    //
    sheet: false,
  }),
};
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
/* .v-main {
    height: 100%;
  overflow: hidden;
} */
</style>
