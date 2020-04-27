import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Index.vue'
import Login from '../views/Login.vue'
import CustomerCart from '../views/CustomerCarts/Index.vue'
import ProductCategories from '../views/Products/Categories.vue'
import ProductSubCategories from '../views/Products/SubCategories.vue'
import ProductSubSubCategories from '../views/Products/SubSubCategories.vue'
import ProductSearch from '../views/Products/Search.vue'
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
    path: '/cart',
    name: 'customerCart',
    component: CustomerCart
  },
  {
    path: '/category/:id/page/:page',
    name: 'productByCategoryId',
    component: ProductCategories
  },
  {
    path: '/category/:categoryId/sub-category/:id/page/:page',
    name: 'productBySubCategoryId',
    component: ProductSubCategories
  },
  {
    path: '/category/:categoryId/sub-category/:subCategoryId/sub-sub-category/:id/page/:page',
    name: 'productBySubSubCategoryId',
    component: ProductSubSubCategories
  },
  {
    path: '/search/:keyword/page/:page',
    name: 'productSearch',
    component: ProductSearch
  },
  {
    path: '/related/:relatedId/search/:keyword/page/:page',
    name: 'productSearchBySubCategory',
    component: ProductSearch
  },
  {
    path: '/products/:id',
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
