import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  frontendPolicyPageDataByType: "",
};

const getters = {};

const actions = {
  getDataByType(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/frontendPolicyPages/findOneByType/${payload}`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_TYPE", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_TYPE", "");
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = {
  SET_DATA_BY_TYPE(state, payload) {
    if (payload) {
      state.frontendPolicyPageDataByType = payload;
    } else {
      state.frontendPolicyPageDataByType = "";
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
