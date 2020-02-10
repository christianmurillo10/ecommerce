import axios from "axios";

const state = {
  productSubCategoryList: [],
  productSubCategoryDataById: null
};

const getters = {
  getProductSubCategoryById: (state) => (id) => {
    return state.productSubCategoryList.find(productSubCategory => productSubCategory.id === id);
  },
  getProductSubCategoryNameById: (state) => (id) => {
    return state.productSubCategoryList.find(productSubCategory => productSubCategory.id === id).name;
  },
  getProductSubCategoryList: (state) => {
    return state.productSubCategoryList;
  }
};

const actions = {
  getDataByProductCategoryId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubCategory/findAllbyProductCategoryId/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubCategory/${payload}`;
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
      state.productSubCategoryList = payload;
    } else {
      state.productSubCategoryList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productSubCategoryDataById = payload;
    } else {
      state.productSubCategoryDataById = null;
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
