import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  frontendPolicyPageList: [],
};

const getters = {};

const actions = {
  getDataByType(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/frontendPolicyPages/findOneByType/${payload}`;
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
    const url = `${apiUrl}/frontendPolicyPages/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          description: payload.description,
          type: payload.type,
        };

        axios
          .post(url, obj, header)
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
  updateData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/frontendPolicyPages/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          description: payload.description,
          type: payload.type,
        };

        axios
          .put(url, obj, header)
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
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
