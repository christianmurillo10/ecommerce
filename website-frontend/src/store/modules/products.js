import axios from "axios";

const state = {
  productList: []
};

const getters = {
  getProductById: (state) => (id) => {
    return state.productList.find(product => product.id === id);
  },
  getProductNameById: (state) => (id) => {
    return state.productList.find(product => product.id === id).name;
  },
  getProductList: (state) => {
    return state.productList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/product/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/product/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
};

const mutations = {
  SET_DATA(state, payload) {
    if (payload) {
      state.productList = payload;
    } else {
      state.productList = [];
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
