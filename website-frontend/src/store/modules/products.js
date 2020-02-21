import axios from "axios";

const state = {
  productHomeList: [],
  productByCategoryList: [],
  productByCategoryTotalCount: 0,
  productBySubCategoryList: [],
  productBySubCategoryTotalCount: 0,
  productBySearchList: [],
  productBySearchTotalCount: 0,
  productSearchKeyword: "",
  productDataById: null
};

const getters = {
  getProductHomeById: (state) => (id) => {
    return state.productHomeList.find(ProductHome => product.id === id);
  },
  getProductHomeNameById: (state) => (id) => {
    return state.productHomeList.find(product => product.id === id).name;
  },
  getProductHomeList: (state) => {
    return state.productHomeList;
  }
};

const actions = {
  getDataWithLimitOffsetAndFileName({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/product/findAllWithLimitOffsetAndFileName/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.forEach(element => {
                if (!_.isEmpty(element.productImages)) {
                  element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.productImages[0].file_name}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }
            commit("SET_DATA_HOME", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductCategoryIdWithLimitOffsetAndFileName({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/product/findAllByProductCategoryIdWithLimitOffsetAndFileName/${payload.productCategoryId}/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj.data) {
              obj.data.forEach(element => {
                if (!_.isEmpty(element.productImages)) {
                  element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.productImages[0].file_name}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }
            commit("SET_DATA_BY_CATEGORY", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductSubCategoryIdWithLimitOffsetAndFileName({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/product/findAllByProductSubCategoryIdWithLimitOffsetAndFileName/${payload.productSubCategoryId}/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj.data) {
              obj.data.forEach(element => {
                if (!_.isEmpty(element.productImages)) {
                  element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.productImages[0].file_name}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }
            commit("SET_DATA_BY_SUB_CATEGORY", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataBySearchWithLimitOffsetAndFileName({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/product/search/${payload.keyword}/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj.data) {
              obj.data.forEach(element => {
                if (!_.isEmpty(element.productImages)) {
                  element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.productImages[0].file_name}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }
            commit("SET_DATA_BY_SEARCH", obj);
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
            let obj = response.data.result;
            obj.productImages.forEach(element => {
              if (!_.isEmpty(element)) {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.file_name}`;
              } else {
                element.file_path = require("../../assets/images/no-image.png");
              }
            });
            commit("SET_DATA_BY_ID", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
};

const mutations = {
  SET_DATA_HOME(state, payload) {
    if (payload) {
      state.productHomeList = payload;
    } else {
      state.productHomeList = [];
    }
  },
  SET_DATA_BY_CATEGORY(state, payload) {
    if (payload.data) {
      state.productByCategoryList = payload.data;
      state.productByCategoryTotalCount = payload.count;
    } else {
      state.productByCategoryList = [];
      state.productByCategoryTotalCount = 0;
    }
  },
  SET_DATA_BY_SUB_CATEGORY(state, payload) {
    if (payload.data) {
      state.productBySubCategoryList = payload.data;
      state.productBySubCategoryTotalCount = payload.count;
    } else {
      state.productBySubCategoryList = [];
      state.productBySubCategoryTotalCount = 0;
    }
  },
  SET_DATA_BY_SEARCH(state, payload) {
    if (payload.data) {
      state.productBySearchList = payload.data;
      state.productBySearchTotalCount = payload.count;
    } else {
      state.productBySearchList = [];
      state.productBySearchTotalCount = 0;
    }
  },
  SET_DATA_SEARCH_KEYWORD(state, payload) {
    if (payload) {
      state.productSearchKeyword = payload;
    } else {
      state.productSearchKeyword = null;
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productDataById = payload;
    } else {
      state.productDataById = null;
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
