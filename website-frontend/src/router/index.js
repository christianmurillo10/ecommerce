import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ProductCategoryIndex from '../views/ProductCategories/Index.vue'
import ProductIndexBySubCategory from '../views/Products/IndexBySubCategory.vue'

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
    path: '/category/:id',
    name: 'categoryById',
    component: ProductCategoryIndex
  },
  {
    path: '/product/category/:categoryId/subCategory/:subCategoryId/page/:page',
    name: 'productByCategoryIdAndSubCategoryId',
    component: ProductIndexBySubCategory
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
