import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  shippingMethodList: [],
};

const getters = {};

const actions = {
  getData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/shippingMethods/`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
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
};

const mutations = {
  SET_DATA(state, payload) {
    if (payload) {
      state.shippingMethodList = payload;
    } else {
      state.shippingMethodList = [];
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
