import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "../views/Pages/Errors/NotFound";
import Login from "../views/Pages/Login.vue";
import Register from "../views/Pages/Registration/Index.vue";
import RegisterComplete from "../views/Pages/Registration/Complete.vue";
import PrivacyPolicy from "../views/Pages/Policies/Privacy.vue";
import ReturnPolicy from "../views/Pages/Policies/Return.vue";
import SellerPolicy from "../views/Pages/Policies/Seller.vue";
import SupportPolicy from "../views/Pages/Policies/Support.vue";
import TermsAndConditions from "../views/Pages/Policies/TermsAndConditions.vue";
import AboutUs from "../views/Pages/AboutUs.vue";
import ContactUs from "../views/Pages/ContactUs.vue";
import TrackOrder from "../views/Pages/TrackOrder.vue";
import Home from "../views/Home/Index.vue";
import Customers from "../views/Customers/Index.vue";
import Cart from "../views/Cart/Index.vue";
import Checkout from "../views/Checkout/Index.vue";
import Products from "../views/Products/Index.vue";
import ProductSearch from "../views/Products/Search.vue";
import ProductDetails from "../views/Products/Details.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "Not Found",
    component: NotFound,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/register/complete",
    name: "registerComplete",
    component: RegisterComplete,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/about-us",
    name: "aboutUs",
    component: AboutUs,
  },
  {
    path: "/contact-us",
    name: "contactUs",
    component: ContactUs,
  },
  {
    path: "/track-order",
    name: "trackOrder",
    component: TrackOrder,
  },
  {
    path: "/privacy-policy",
    name: "privacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/return-policy",
    name: "returnPolicy",
    component: ReturnPolicy,
  },
  {
    path: "/seller-policy",
    name: "sellerPolicy",
    component: SellerPolicy,
  },
  {
    path: "/support-policy",
    name: "supportPolicy",
    component: SupportPolicy,
  },
  {
    path: "/terms-and-conditions",
    name: "termsAndConditions",
    component: TermsAndConditions,
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/profile",
    name: "customerProfile",
    component: Customers,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
    beforeEnter: (to, from, next) => {
      if (store.state.customerAuthentication.token) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/products",
    name: "products",
    component: Products,
  },
  {
    path: "/search",
    name: "productSearch",
    component: ProductSearch,
  },
  {
    path: "/products/:id",
    name: "productById",
    component: ProductDetails,
  },
];

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
