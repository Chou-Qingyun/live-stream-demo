import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
      path: '/tourist',
      name: 'Tourist',
      component: () => import('../views/Tourist')
    }
]

const router = new VueRouter({
  routes
})

export default router
