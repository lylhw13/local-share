import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "李",
    color: "red",
    loginState: false,
    serverIp: "192.168.0.30",
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setLoginState(state, loginState) {
      state.loginState = loginState;
    },
    setColor(state, color) {
      state.color = color;
    },
    setServerIp(state, url) {
      state.serverIp = url;
    }
  },
  actions: {
  },
  modules: {
  }
})
