import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ProductIndexByCategory from '../views/Products/IndexByCategory.vue'
import ProductIndexBySubCategory from '../views/Products/IndexBySubCategory.vue'
import ProductView from '../views/Products/View.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/category/:id/page/:page',
    name: 'categoryById',
    component: ProductIndexByCategory
  },
  {
    path: '/category/:categoryId/subCategory/:subCategoryId/page/:page',
    name: 'productByCategoryIdAndSubCategoryId',
    component: ProductIndexBySubCategory
  },
  {
    path: '/product/:id',
    name: 'productById',
    component: ProductView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
