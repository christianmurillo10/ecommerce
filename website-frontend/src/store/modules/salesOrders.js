import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  salesOrderDataByCustomerIdList: [],
};

const getters = {};

const actions = {
  getDataByCustomerId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/salesOrders/findAllbyCustomerId/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_ID", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_ID", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = {
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.salesOrderDataByCustomerIdList = payload;
    } else {
      state.salesOrderDataByCustomerIdList = [];
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
