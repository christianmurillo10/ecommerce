import axios from "axios";

const state = {
  productSubCategoryList: [],
  productSubCategoryDataById: ""
};

const getters = { };

const actions = {
  getDataByProductCategoryId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubCategories/findAllbyProductCategoryId/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubCategories/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` } };
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
      state.productSubCategoryList = payload;
    } else {
      state.productSubCategoryList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productSubCategoryDataById = payload;
    } else {
      state.productSubCategoryDataById = "";
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
