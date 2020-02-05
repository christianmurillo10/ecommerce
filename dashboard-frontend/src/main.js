import Vue from "vue";
import "./components";
import "./plugins";
import { sync } from "vuex-router-sync";
import App from "./App";
import router from "@/router";
import store from "@/store";
import Axios from "axios";
import _ from 'lodash'

sync(store, router);

// set token
Vue.prototype.$http = Axios;

const token = localStorage.getItem("token");

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
