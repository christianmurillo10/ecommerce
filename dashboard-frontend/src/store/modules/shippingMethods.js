import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  shippingMethodList: [],
  shippingMethodDataById: "",
};

const getters = {
  getShippingMethodById: (state) => (id) => {
    return state.shippingMethodList.find(
      (shippingMethod) => shippingMethod.id === id
    );
  },
  getShippingMethodNameById: (state) => (id) => {
    return state.shippingMethodList.find(
      (shippingMethod) => shippingMethod.id === id
    ).name;
  },
  getShippingMethodList: (state) => {
    return state.shippingMethodList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/shippingMethods/`;
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
    const url = `${apiUrl}/shippingMethods/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_ID", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_ID", "");
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
    const url = `${apiUrl}/shippingMethods/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
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
    const url = `${apiUrl}/shippingMethods/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
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
    const url = `${apiUrl}/shippingMethods/delete/${payload}`;
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
    const index = state.shippingMethodList
      .map((shippingMethod) => shippingMethod.id)
      .indexOf(payload.id);
    Object.assign(state.shippingMethodList[index], {
      name: payload.name,
      description: payload.description,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.shippingMethodList
      .map((shippingMethod) => shippingMethod.id)
      .indexOf(payload);
    state.shippingMethodList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
