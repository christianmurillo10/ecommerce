import axios from "axios";

const state = {
  shippingMethodRateList: []
};

const getters = {
  getShippingMethodRateById: (state) => (id) => {
    return state.shippingMethodRateList.find(shippingMethodRate => shippingMethodRate.id === id);
  },
  getShippingMethodRateList: (state) => {
    return state.shippingMethodRateList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethodRates/`;
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
  getDataByShippingMethodId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethodRates/findAllbyShippingMethodId/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethodRates/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethodRates/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          rate_amount: payload.rate_amount,
          subtotal_amount_from: payload.subtotal_amount_from,
          subtotal_amount_to: payload.subtotal_amount_to,
          quantity_from: payload.quantity_from,
          quantity_to: payload.quantity_to,
          shipping_method_id: payload.shipping_method_id
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethodRates/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          rate_amount: payload.rate_amount,
          subtotal_amount_from: payload.subtotal_amount_from,
          subtotal_amount_to: payload.subtotal_amount_to,
          quantity_from: payload.quantity_from,
          quantity_to: payload.quantity_to,
          shipping_method_id: payload.shipping_method_id
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethodRates/delete/${payload}`;
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
      state.shippingMethodRateList = payload;
    } else {
      state.shippingMethodRateList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.shippingMethodRateList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.shippingMethodRateList.map(shippingMethodRate => shippingMethodRate.id).indexOf(payload.id);
    Object.assign(state.shippingMethodRateList[index], {
      rate_amount: payload.rate_amount,
      subtotal_amount_from: payload.subtotal_amount_from,
      subtotal_amount_to: payload.subtotal_amount_to,
      quantity_from: payload.quantity_from,
      quantity_to: payload.quantity_to,
      shipping_method_id: payload.shipping_method_id
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.shippingMethodRateList.map(shippingMethodRate => shippingMethodRate.id).indexOf(payload);
    state.shippingMethodRateList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
