import axios from "axios";

const state = {
  frontendPolicyPageList: []
};

const getters = {
  getFrontendPolicyPageById: (state) => (id) => {
    return state.frontendPolicyPageList.find(frontendPolicyPage => frontendPolicyPage.id === id);
  },
  getFrontendPolicyPageList: (state) => {
    return state.frontendPolicyPageList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendPolicyPages/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendPolicyPages/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendPolicyPages/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          description: payload.description,
          type: payload.type
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendPolicyPages/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          description: payload.description,
          type: payload.type
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendPolicyPages/delete/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
      state.frontendPolicyPageList = payload;
    } else {
      state.frontendPolicyPageList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.frontendPolicyPageList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.frontendPolicyPageList.map(frontendPolicyPage => frontendPolicyPage.id).indexOf(payload.id);
    Object.assign(state.frontendPolicyPageList[index], {
      description: payload.description,
      type: payload.type
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.frontendPolicyPageList.map(frontendPolicyPage => frontendPolicyPage.id).indexOf(payload);
    state.frontendPolicyPageList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
