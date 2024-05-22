import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CountedProduct from '../views/CountedProduct.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  base: '/la-count-stock/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/count-product',
      name: 'count-product',
      component: CountedProduct
    },
    
  ]
})

export default router
