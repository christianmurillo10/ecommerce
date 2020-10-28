import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  frontendUsefulLinkList: [],
};

const getters = {};

const actions = {
  getData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/frontendUsefulLinks/`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            commit("SET_DATA", obj);
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
      state.frontendUsefulLinkList = payload;
    } else {
      state.frontendUsefulLinkList = [];
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
