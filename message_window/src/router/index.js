import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/messagewindow',
    name: 'MessageWindow',
    // component: Home
    component: () => import("../views/MainWindow.vue")
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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
