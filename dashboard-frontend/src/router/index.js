import Vue from "vue";
import Router from "vue-router";
import ErrorPage from '../views/Error'
import Login from "../views/Login";
import Dashboard from "../views/Dashboard";
import Users from "../views/users/Index";
import Roles from "../views/roles/Index";
import ProductBrands from "../views/productBrands/Index";
import ProductCategories from "../views/productCategories/Index";
import ProductSubCategories from "../views/productSubCategories/Index";
import ProductSubSubCategories from "../views/productSubSubCategories/Index";
import Products from "../views/products/Index";
import ProductsCreate from "../views/products/Create";
import ProductsUpdate from "../views/products/Update";
import ProductsView from "../views/products/View";
import ProductsImage from "../views/products/Image";
import ProductsOption from "../views/products/Option";
import ProductBannerImages from "../views/productBannerImages/Index";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'error',
      component: ErrorPage
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/users",
      name: "users",
      component: Users
    },
    {
      path: "/roles",
      name: "roles",
      component: Roles
    },
    {
      path: "/productBrands",
      name: "productBrands",
      component: ProductBrands
    },
    {
      path: "/productCategories",
      name: "productCategories",
      component: ProductCategories
    },
    {
      path: "/productSubCategories",
      name: "productSubCategories",
      component: ProductSubCategories
    },
    {
      path: "/productSubSubCategories",
      name: "productSubSubCategories",
      component: ProductSubSubCategories
    },
    {
      path: "/products",
      name: "products",
      component: Products
    },
    {
      path: "/products/create",
      name: "productsCreate",
      component: ProductsCreate
    },
    {
      path: "/products/update/:id",
      name: "productsUpdate",
      component: ProductsUpdate
    },
    {
      path: "/products/view/:id",
      name: "productsView",
      component: ProductsView
    },
    {
      path: "/products/image/:id",
      name: "productsImage",
      component: ProductsImage
    },
    {
      path: "/products/option/:id",
      name: "productsOption",
      component: ProductsOption
    },
    {
      path: "/productBannerImages",
      name: "productBannerImages",
      component: ProductBannerImages
    },
  ]
})

export default router
