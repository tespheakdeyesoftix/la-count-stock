import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CountedProduct from '../views/CountedProduct.vue'


const router = createRouter({
  history: createWebHistory('/'),
  // history: createWebHistory('/'),
  mode: 'history',
  base:"/",
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/count-product/:name',
      name: 'count-product',
      component: CountedProduct
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(/* webpackChunkName: "login" */ '../views/logins/Login.vue'),
      meta: {
        isLoginPage: true
      },
      props: true
    },
    
  ]
})

export default router
