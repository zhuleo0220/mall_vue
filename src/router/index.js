import Vue from 'vue'
import Router from 'vue-router'

import AppIndex from '../components/home/AppIndex'
import Login from '../components/Login'
import Fail from '../components/home/Fail'
import Home from '../components/Home'
import CategoryIndex from '../components/category/CategoryIndex'
import ProductIndex from '../components/product/ProductIndex'
import OrderIndex from '../components/order/OrderIndex'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // home页面并不需要被访问
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex
        },
        {
          path: '/category',
          name: 'Category',
          component: CategoryIndex
        },
        {
          path: '/product',
          name: 'Product',
          component: ProductIndex
        },
        {
          path: '/order',
          name: 'Order',
          component: OrderIndex
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/fail',
      name: 'Fail',
      component: Fail
    }
  ]
})
