import Vue from 'vue';
import App from './App.vue';
import { sync } from 'vuex-router-sync';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Axios from "axios";
import _ from 'lodash';

sync(store, router);

// set token
Vue.prototype.$http = Axios;

const token = localStorage.getItem("cToken");

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
