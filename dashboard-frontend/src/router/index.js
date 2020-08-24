import Vue from "vue";
import Router from "vue-router";
import ErrorPage from '../views/Error'
import Login from "../views/Login";
import Dashboard from "../views/dashboard/Index";
import Users from "../views/users/Index";
import Roles from "../views/roles/Index";
import Banks from "../views/banks/Index";
import CustomerCreditDebitCards from "../views/customers/Cards";
import Customers from "../views/customers/Index";
import Employees from "../views/employees/Index";
import FrontendPolicyPages from "../views/frontendPolicyPages/Index";
import FrontendSliderImages from "../views/frontendSliderImages/Index";
import FrontendUsefulLinks from "../views/frontendUsefulLinks/Index";
import ProductBrands from "../views/productBrands/Index";
import ProductCategories from "../views/productCategories/Index";
import ProductSubCategories from "../views/productSubCategories/Index";
import ProductSubSubCategories from "../views/productSubSubCategories/Index";
import Products from "../views/products/Index";
import ProductStores from "../views/productStores/Index";
import ProductsCreate from "../views/products/Create";
import ProductsUpdate from "../views/products/Update";
import ProductsView from "../views/products/View";
import ProductsImage from "../views/products/Image";
import ProductsOption from "../views/products/Option";
import ProductFlashDealHeaders from "../views/productFlashDealHeaders/Index";
import ProductFlashDealDetails from "../views/productFlashDealHeaders/Details";
import SalesOrdersOpen from "../views/salesOrders/Open";
import SalesOrdersReviewed from "../views/salesOrders/Reviewed";
import SalesOrdersApproved from "../views/salesOrders/Approved";
import SalesOrdersOnProcess from "../views/salesOrders/OnProcess";
import SalesOrdersDelivered from "../views/salesOrders/Delivered";
import SalesOrders from "../views/salesOrders/Index";
import SalesOrdersInvoice from "../views/salesOrders/Invoice";
import ShippingMethods from "../views/shippingMethods/Index";
import ShippingMethodRates from "../views/shippingMethods/Rates";

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
      path: "/banks",
      name: "banks",
      component: Banks
    },
    {
      path: "/customers",
      name: "customers",
      component: Customers
    },
    {
      path: "/customers/cards/:customerId",
      name: "customerCreditDebitCards",
      component: CustomerCreditDebitCards
    },
    {
      path: "/employees",
      name: "employees",
      component: Employees
    },
    {
      path: "/frontendPolicyPages/:type",
      name: "frontendPolicyPages",
      component: FrontendPolicyPages
    },
    {
      path: "/frontendSliderImages",
      name: "frontendSliderImages",
      component: FrontendSliderImages
    },
    {
      path: "/frontendUsefulLinks",
      name: "frontendUsefulLinks",
      component: FrontendUsefulLinks
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
      path: "/productStores",
      name: "productStores",
      component: ProductStores
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
      path: "/products/variantOption/:id",
      name: "productsOption",
      component: ProductsOption
    },
    {
      path: "/productFlashDeals",
      name: "productFlashDealHeaders",
      component: ProductFlashDealHeaders
    },
    {
      path: "/productFlashDeals/details/:headerId",
      name: "productFlashDealDetails",
      component: ProductFlashDealDetails
    },
    {
      path: "/salesOrders/open",
      name: "salesOrdersOpen",
      component: SalesOrdersOpen
    },
    {
      path: "/salesOrders/reviewed",
      name: "salesOrdersReviewed",
      component: SalesOrdersReviewed
    },
    {
      path: "/salesOrders/approved",
      name: "salesOrdersApproved",
      component: SalesOrdersApproved
    },
    {
      path: "/salesOrders/onProcess",
      name: "salesOrdersOnProcess",
      component: SalesOrdersOnProcess
    },
    {
      path: "/salesOrders/delivered",
      name: "salesOrdersDelivered",
      component: SalesOrdersDelivered
    },
    {
      path: "/salesOrders/index",
      name: "salesOrders",
      component: SalesOrders
    },
    {
      path: "/salesOrders/invoice/:salesOrderId",
      name: "salesOrdersInvoice",
      component: SalesOrdersInvoice
    },
    {
      path: "/shippingMethods",
      name: "shippingMethods",
      component: ShippingMethods
    },
    {
      path: "/shippingMethods/rates/:shippingMethodId",
      name: "shippingMethodRates",
      component: ShippingMethodRates
    },
  ]
})

export default router
