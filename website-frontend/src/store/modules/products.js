import axios from "axios";

const state = {
  productHomeList: [],
  productBySubCategoryList: [],
  productBySubCategoryTotalCount: 0
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
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.productImages[0].file_name}`;
              });
            }
            commit("SET_DATA_HOME", obj);
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
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.productImages[0].file_name}`;
              });
            }
            commit("SET_DATA_BY_SUB_CATEGORY", obj);
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
  SET_DATA_HOME(state, payload) {
    if (payload) {
      state.productHomeList = payload;
    } else {
      state.productHomeList = [];
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
