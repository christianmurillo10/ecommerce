import axios from "axios";

const state = {
  productSubSubCategoryList: [],
  productSubSubCategoryDataById: ""
};

const getters = { };

const actions = {
  getDataByProductCategoryId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/findAllbyProductCategoryId/${payload}`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductSubCategoryId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/findAllbyProductSubCategoryId/${payload}`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/${payload}`;
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
      state.productSubSubCategoryList = payload;
    } else {
      state.productSubSubCategoryList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productSubSubCategoryDataById = payload;
    } else {
      state.productSubSubCategoryDataById = "";
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
