import axios from "axios";

const state = {
  shippingMethodList: [],
  shippingMethodDataById: ""
};

const getters = {
  getShippingMethodById: (state) => (id) => {
    return state.shippingMethodList.find(shippingMethod => shippingMethod.id === id);
  },
  getShippingMethodNameById: (state) => (id) => {
    return state.shippingMethodList.find(shippingMethod => shippingMethod.id === id).name;
  },
  getShippingMethodList: (state) => {
    return state.shippingMethodList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethods/`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethods/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            commit("SET_DATA_BY_ID", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethods/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethods/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/shippingMethods/delete/${payload}`;
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
      state.shippingMethodList = payload;
    } else {
      state.shippingMethodList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.shippingMethodDataById = payload;
    } else {
      state.shippingMethodDataById = "";
    }
  },
  ADD_DATA(state, payload) {
    state.shippingMethodList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.shippingMethodList.map(shippingMethod => shippingMethod.id).indexOf(payload.id);
    Object.assign(state.shippingMethodList[index], {
      name: payload.name,
      description: payload.description
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.shippingMethodList.map(shippingMethod => shippingMethod.id).indexOf(payload);
    state.shippingMethodList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
