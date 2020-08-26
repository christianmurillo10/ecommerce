import axios from "axios";

const state = {
  productVariationDetailList: []
};

const getters = {
  getProductVariationDetailById: (state) => (id) => {
    return state.productVariationDetailList.find(productVariationDetail => productVariationDetail.id === id);
  },
  getProductVariationDetailList: (state) => {
    return state.productVariationDetailList;
  },
  getFilteredProductVariationDetailList: (state) => {
    let filteredList = [];
    state.productVariationDetailList.forEach(value => {
      filteredList.push({
        id: value.id,
        code: value.code,
        name: value.name
      });
    });
    return filteredList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productVariationDetails/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
  getDataByProductVariationId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productVariationDetails/findAllbyProductVariationId/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productVariationDetails/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productVariationDetails/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          product_variation_id: payload.product_variation_id
        }

        axios
          .post(url, obj, header)
          .then(response => {
            if (response.data.result) {
              commit("ADD_DATA", response.data.result);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productVariationDetails/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          product_variation_id: payload.product_variation_id
        }

        axios
          .put(url, obj, header)
          .then(response => {
            commit("UPDATE_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productVariationDetails/delete/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, '', header)
          .then(response => {
            commit("DELETE_DATA", payload);
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
      state.productVariationDetailList = payload;
    } else {
      state.productVariationDetailList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productVariationDetailList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productVariationDetailList.map(productVariationDetail => productVariationDetail.id).indexOf(payload.id);
    Object.assign(state.productVariationDetailList[index], {
      code: payload.code,
      name: payload.name,
      product_variation_id: payload.product_variation_id
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productVariationDetailList.map(productVariationDetail => productVariationDetail.id).indexOf(payload);
    state.productVariationDetailList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
