import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CountedProduct from '../views/CountedProduct.vue'


const router = createRouter({
  history: createWebHistory('/la-count-stock'),
  // history: createWebHistory('/'),
  mode: 'history',
  base:"/la-count-stock/",
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
