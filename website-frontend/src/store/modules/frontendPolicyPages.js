import axios from "axios";

const state = {
  frontendPolicyPageDataByType: ""
};

const getters = { };

const actions = {
  getDataByType({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendPolicyPages/findOneByType/${payload}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            commit("SET_DATA_BY_TYPE", obj);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
};

const mutations = {
  SET_DATA_BY_TYPE(state, payload) {
    if (payload) {
      state.frontendPolicyPageDataByType = payload;
    } else {
      state.frontendPolicyPageDataByType = "";
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
