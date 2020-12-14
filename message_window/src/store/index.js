import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "",
    color: "",
    loginState: false,
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
  },
  actions: {
  },
  modules: {
  }
})
