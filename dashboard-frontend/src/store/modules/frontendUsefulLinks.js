import axios from "axios";

const state = {
  frontendUsefulLinkList: []
};

const getters = {
  getFrontendUsefulLinkById: (state) => (id) => {
    return state.frontendUsefulLinkList.find(frontendUsefulLink => frontendUsefulLink.id === id);
  },
  getFrontendUsefulLinkNameById: (state) => (id) => {
    return state.frontendUsefulLinkList.find(frontendUsefulLink => frontendUsefulLink.id === id).name;
  },
  getFrontendUsefulLinkList: (state) => {
    return state.frontendUsefulLinkList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendUsefulLinks/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendUsefulLinks/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendUsefulLinks/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          url: payload.url
        };

        axios
          .post(url, obj, header)
          .then(response => {
            if (response.data.result) {
              commit("ADD_DATA", response.data.result);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendUsefulLinks/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          url: payload.url
        };

        axios
          .put(url, obj, header)
          .then(response => {
            commit("UPDATE_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendUsefulLinks/delete/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, '', header)
          .then(response => {
            commit("DELETE_DATA", payload);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
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
    let index = state.frontendUsefulLinkList.map(frontendUsefulLink => frontendUsefulLink.id).indexOf(payload.id);
    Object.assign(state.frontendUsefulLinkList[index], {
      name: payload.name,
      url: payload.url
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.frontendUsefulLinkList.map(frontendUsefulLink => frontendUsefulLink.id).indexOf(payload);
    state.frontendUsefulLinkList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
