import axios from "axios";

const state = {
  productCategoryList: [],
  productCategoryDataById: null
};

const getters = {
  getProductCategoryById: (state) => (id) => {
    return state.productCategoryList.find(productCategory => productCategory.id === id);
  },
  getProductCategoryNameById: (state) => (id) => {
    return state.productCategoryList.find(productCategory => productCategory.id === id).name;
  },
  getProductCategoryList: (state) => {
    return state.productCategoryList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategory/`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategory/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            commit("SET_DATA_BY_ID", response.data.result);
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
      state.productCategoryList = payload;
    } else {
      state.productCategoryList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productCategoryDataById = payload;
    } else {
      state.productCategoryDataById = null;
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
