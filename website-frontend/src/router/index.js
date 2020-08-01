import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Pages/Login.vue'
import Register from '../views/Pages/Registration/Index.vue'
import RegisterComplete from '../views/Pages/Registration/Complete.vue'
import PrivacyPolicy from '../views/Pages/Policies/Privacy.vue'
import ReturnPolicy from '../views/Pages/Policies/Return.vue'
import SellerPolicy from '../views/Pages/Policies/Seller.vue'
import SupportPolicy from '../views/Pages/Policies/Support.vue'
import TermsAndConditions from '../views/Pages/Policies/TermsAndConditions.vue'
import Home from '../views/Home/Index.vue'
import Customers from '../views/Customers/Index.vue'
import CustomerCart from '../views/CustomerCarts/Index.vue'
import ProductCategories from '../views/Products/Categories.vue'
import ProductSubCategories from '../views/Products/SubCategories.vue'
import ProductSubSubCategories from '../views/Products/SubSubCategories.vue'
import ProductSearch from '../views/Products/Search.vue'
import ProductDetails from '../views/Products/Details.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/register/complete',
    name: 'registerComplete',
    component: RegisterComplete,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: PrivacyPolicy
  },
  {
    path: '/return-policy',
    name: 'returnPolicy',
    component: ReturnPolicy
  },
  {
    path: '/seller-policy',
    name: 'sellerPolicy',
    component: SellerPolicy
  },
  {
    path: '/support-policy',
    name: 'supportPolicy',
    component: SupportPolicy
  },
  {
    path: '/terms-and-conditions',
    name: 'termsAndConditions',
    component: TermsAndConditions
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/profile',
    name: 'customerProfile',
    component: Customers,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next();
      } else {
        next("/login");
      }
    }
  },
  {
    path: '/cart',
    name: 'customerCart',
    component: CustomerCart,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next();
      } else {
        next("/login");
      }
    }
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
    component: ProductDetails
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
