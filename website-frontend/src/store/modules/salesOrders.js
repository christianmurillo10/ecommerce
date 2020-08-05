import axios from "axios";

const state = {
  salesOrderDataByCustomerIdList: []
};

const getters = { };

const actions = {
  getDataByCustomerId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/findAllbyCustomerId/${payload}`;
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
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.salesOrderDataByCustomerIdList = payload;
    } else {
      state.salesOrderDataByCustomerIdList = [];
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
