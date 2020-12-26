import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/messagewindow',
    name: 'MessageWindow',
    component: () => import("../views/MainWindow.vue")
  },
  {
    path: '/',
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: '*',
    component: () => import('../views/PageNotFound.vue'),
    meta: {hideNavigation: true}
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// disable goback()
router.beforeEach((to, from, next) => {
  const isLogged = store.state.loginState;

  if (isLogged && to.name === 'Login')
    next({name: 'MessageWindow'})
  else if (!isLogged && to.name === 'MessageWindow')
    next({name: 'Login'})
  else
    next()
})

export default router
