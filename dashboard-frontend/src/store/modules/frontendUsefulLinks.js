import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  frontendUsefulLinkList: [],
};

const getters = {
  getFrontendUsefulLinkById: (state) => (id) => {
    return state.frontendUsefulLinkList.find(
      (frontendUsefulLink) => frontendUsefulLink.id === id
    );
  },
  getFrontendUsefulLinkNameById: (state) => (id) => {
    return state.frontendUsefulLinkList.find(
      (frontendUsefulLink) => frontendUsefulLink.id === id
    ).name;
  },
  getFrontendUsefulLinkList: (state) => {
    return state.frontendUsefulLinkList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/frontendUsefulLinks/`;
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
    const url = `${apiUrl}/frontendUsefulLinks/${payload}`;
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
    const url = `${apiUrl}/frontendUsefulLinks/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          url: payload.url,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            if (data.result) {
              commit("ADD_DATA", response.data.result);
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
    const url = `${apiUrl}/frontendUsefulLinks/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          url: payload.url,
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
    const url = `${apiUrl}/frontendUsefulLinks/delete/${payload}`;
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
      state.frontendUsefulLinkList = payload;
    } else {
      state.frontendUsefulLinkList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.frontendUsefulLinkList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    const index = state.frontendUsefulLinkList
      .map((frontendUsefulLink) => frontendUsefulLink.id)
      .indexOf(payload.id);
    Object.assign(state.frontendUsefulLinkList[index], {
      name: payload.name,
      url: payload.url,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.frontendUsefulLinkList
      .map((frontendUsefulLink) => frontendUsefulLink.id)
      .indexOf(payload);
    state.frontendUsefulLinkList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
