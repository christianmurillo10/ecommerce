import axios from "axios";

const state = {
  roleList: []
};

const getters = {
  getRoleById: (state) => (id) => {
    return state.roleList.find(role => role.id === id);
  },
  getRoleNameById: (state) => (id) => {
    return state.roleList.find(role => role.id === id).name;
  },
  getRoleList: (state) => {
    return state.roleList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/role/`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/role/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/role/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          description: payload.description
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
    let url = `${process.env.VUE_APP_API_BACKEND}/role/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          description: payload.description
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
    let url = `${process.env.VUE_APP_API_BACKEND}/role/delete/${payload}`;
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
      state.roleList = payload;
    } else {
      state.roleList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.roleList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.roleList.map(role => role.id).indexOf(payload.id);
    Object.assign(state.roleList[index], {
      name: payload.name,
      description: payload.description
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.roleList.map(role => role.id).indexOf(payload);
    state.roleList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
