import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  shippingMethodRateList: [],
};

const getters = {
  getShippingMethodRateById: (state) => (id) => {
    return state.shippingMethodRateList.find(
      (shippingMethodRate) => shippingMethodRate.id === id
    );
  },
  getShippingMethodRateList: (state) => {
    return state.shippingMethodRateList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/shippingMethodRates/`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByShippingMethodId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/shippingMethodRates/findAllbyShippingMethodId/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/shippingMethodRates/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/shippingMethodRates/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          rate_amount: payload.rate_amount,
          subtotal_amount_from: payload.subtotal_amount_from,
          subtotal_amount_to: payload.subtotal_amount_to,
          quantity_from: payload.quantity_from,
          quantity_to: payload.quantity_to,
          shipping_method_id: payload.shipping_method_id,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            if (data.result) {
              commit("ADD_DATA", data.result);
            }
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/shippingMethodRates/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          rate_amount: payload.rate_amount,
          subtotal_amount_from: payload.subtotal_amount_from,
          subtotal_amount_to: payload.subtotal_amount_to,
          quantity_from: payload.quantity_from,
          quantity_to: payload.quantity_to,
          shipping_method_id: payload.shipping_method_id,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            commit("UPDATE_DATA", data.result);
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/shippingMethodRates/delete/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, "", header)
          .then((response) => {
            const data = response.data;
            commit("DELETE_DATA", payload);
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
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
    const index = state.shippingMethodRateList
      .map((shippingMethodRate) => shippingMethodRate.id)
      .indexOf(payload.id);
    Object.assign(state.shippingMethodRateList[index], {
      rate_amount: payload.rate_amount,
      subtotal_amount_from: payload.subtotal_amount_from,
      subtotal_amount_to: payload.subtotal_amount_to,
      quantity_from: payload.quantity_from,
      quantity_to: payload.quantity_to,
      shipping_method_id: payload.shipping_method_id,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.shippingMethodRateList
      .map((shippingMethodRate) => shippingMethodRate.id)
      .indexOf(payload);
    state.shippingMethodRateList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
