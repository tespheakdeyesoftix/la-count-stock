import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CountedProduct from '../views/CountedProduct.vue'
import test from '../views/test.vue'

const router = createRouter({
  history: createWebHistory('/la-count-stock/'),
  // history: createWebHistory('/'),
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
    {
      path: '/test',
      name: 'test',
      component: test
    },
    
  ]
})

export default router
