import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/MessageWindow',
    name: 'MessageWindow',
    // component: Home
    component: () => import("../components/MainWindow.vue")
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
  }
]

const router = new VueRouter({
  routes
})

export default router
