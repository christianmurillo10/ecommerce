import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync';
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Axios from "axios";
import _ from 'lodash'
import VueZoomer from 'vue-zoomer'

Vue.use(VueZoomer)

sync(store, router);

// set token
Vue.prototype.$http = Axios;

const token = localStorage.getItem("cToken");

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
  Vue.prototype.$http.defaults.headers.common["token"] = token;
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
