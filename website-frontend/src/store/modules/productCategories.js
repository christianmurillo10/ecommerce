import axios from "axios";

const state = {
  productCategoryWithSubList: [],
  productCategoryList: [],
  productCategoryDataById: ""
};

const getters = { };

const actions = {
  getDataWithSubCategories({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/findAllWithSubCategories`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            commit("SET_DATA_WITH_SUB_CATEGORIES", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },

  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/${payload}`;
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
  SET_DATA_WITH_SUB_CATEGORIES(state, payload) {
    if (payload) {
      state.productCategoryWithSubList = payload;
    } else {
      state.productCategoryWithSubList = [];
    }
  },

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
      state.productCategoryDataById = "";
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
