import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  bankList: [],
};

const getters = {
  getBankById: (state) => (id) => {
    return state.bankList.find((bank) => bank.id === id);
  },
  getBankNameById: (state) => (id) => {
    return state.bankList.find((bank) => bank.id === id).name;
  },
  getBankList: (state) => {
    return state.bankList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/banks/`;
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
    const url = `${apiUrl}/banks/${payload}`;
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
    const url = `${apiUrl}/banks/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          description: payload.description,
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
    const url = `${apiUrl}/banks/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          description: payload.description,
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
    const url = `${apiUrl}/banks/delete/${payload}`;
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
      state.bankList = payload;
    } else {
      state.bankList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.bankList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.bankList.map((bank) => bank.id).indexOf(payload.id);
    Object.assign(state.bankList[index], {
      code: payload.code,
      name: payload.name,
      description: payload.description,
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.bankList.map((bank) => bank.id).indexOf(payload);
    state.bankList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
