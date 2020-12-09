<template>
  <v-app>
    <!-- <v-main>
      <router-link to="/"></router-link>
      <router-link to="/about"></router-link>
    <router-view></router-view>
    </v-main> -->
    <!-- <v-app-bar app class="text-uppercase grey-text">
      <span class="font-weight-light">Local</span>
      <span>Share</span>
    </v-app-bar> -->
  <!-- <v-main>
  <MainWindow/>
  </v-main> -->
  <v-main>
    <router-link to="/"></router-link>
    <router-link to="/login"></router-link>
    <router-view></router-view>
  </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
// import Home from './views/Home';
// import Home from './views/Home.vue';
// import MainWindow from './components/MainWindow';

export default {
  name: 'App',

  components: {
    // HelloWorld,
    // Home
    // Home
    // MainWindow
  },

  

  data: () => ({
    //
  }),
};
</script>

<style>
html,body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
/* .v-main {
    height: 100%;
  overflow: hidden;
} */
</style>
