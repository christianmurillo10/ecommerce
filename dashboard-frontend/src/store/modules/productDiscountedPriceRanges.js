import axios from "axios";

const state = {
  productDiscountedPriceRangeList: []
};

const getters = {
  getProductDiscountedPriceRangeById: (state) => (id) => {
    return state.productDiscountedPriceRangeList.find(productDiscountedPriceRange => productDiscountedPriceRange.id === id);
  },
  getProductDiscountedPriceRangeList: (state) => {
    return state.productDiscountedPriceRangeList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productDiscountedPriceRange/`;
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
  getDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productDiscountedPriceRange/findAllbyProductId/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productDiscountedPriceRange/${payload}`;
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
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productDiscountedPriceRange/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          quantity_from: payload.quantity_from,
          quantity_to: payload.quantity_to,
          price: payload.price,
          product_id: payload.product_id
        };

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
    let url = `${process.env.VUE_APP_API_BACKEND}/productDiscountedPriceRange/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          quantity_from: payload.quantity_from,
          quantity_to: payload.quantity_to,
          price: payload.price
        };

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
    let url = `${process.env.VUE_APP_API_BACKEND}/productDiscountedPriceRange/delete/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
      state.productDiscountedPriceRangeList = payload;
    } else {
      state.productDiscountedPriceRangeList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productDiscountedPriceRangeList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productDiscountedPriceRangeList.map(productDiscountedPriceRange => productDiscountedPriceRange.id).indexOf(payload.id);
    Object.assign(state.productDiscountedPriceRangeList[index], {
      quantity_from: payload.quantity_from,
      quantity_to: payload.quantity_to,
      price: payload.price
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productDiscountedPriceRangeList.map(productDiscountedPriceRange => productDiscountedPriceRange.id).indexOf(payload);
    state.productDiscountedPriceRangeList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
