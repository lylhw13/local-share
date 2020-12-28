import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "周杰伦",
    color: "red",
    loginState: false,
    serverIp: "192.168.0.101",
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setLoginState(state, loginState) {
      state.loginState = loginState;
      if (!loginState) {
        state.username = '';
        state.color = '';
        state.serverIp = ''
      }
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
