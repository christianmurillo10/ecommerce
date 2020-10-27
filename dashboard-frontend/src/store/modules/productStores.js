import axios from "axios";
import FormData from "form-data";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productStoreList: [],
  productStoreTotalCount: 0,
};

const getters = {
  getProductStoreById: (state) => (id) => {
    return state.productStoreList.find(
      (productStore) => productStore.id === id
    );
  },
  getProductStoreFileNameById: (state) => (id) => {
    return state.productStoreList.find((productStore) => productStore.id === id)
      .file_name;
  },
  getProductStoreList: (state) => {
    return state.productStoreList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productStores/`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;

            if (obj) {
              obj.forEach((element) => {
                if (!_.isNull(element.file_name)) {
                  element.file_path = `${apiUrl}/productStores/viewImage/${
                    element.file_name
                  }`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }

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
  getDataById(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productStores/${payload}`;
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
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productStores/count/all`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_TOTAL_COUNT", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_TOTAL_COUNT", 0);
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
    const url = `${apiUrl}/productStores/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("name", payload.name);
        data.set("description", payload.description);
        data.set("file_name", payload.file_name);
        data.append("image", payload.file);

        axios
          .post(url, data, header)
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
    const url = `${apiUrl}/productStores/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("name", payload.name);
        data.set("description", payload.description);
        data.set("file_name", payload.file_name);
        data.append("image", payload.file);

        axios
          .put(url, data, header)
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
  updateActiveStatusData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productStores/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          is_active: payload.value,
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
    const url = `${apiUrl}/productStores/delete/${payload}`;
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
      state.productStoreList = payload;
    } else {
      state.productStoreList = [];
    }
  },
  SET_TOTAL_COUNT(state, payload) {
    if (payload) {
      state.productStoreTotalCount = payload;
    } else {
      state.productStoreTotalCount = 0;
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = _.isNull(payload.file_name)
      ? require("../../assets/images/no-image.png")
      : `${apiUrl}/productStores/viewImage/${payload.file_name}`;
    state.productStoreList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    const index = state.productStoreList
      .map((productStore) => productStore.id)
      .indexOf(payload.id);
    Object.assign(state.productStoreList[index], {
      name: payload.name,
      description: payload.description,
      file_name: payload.file_name,
      file_path: _.isNull(payload.file_name)
        ? require("../../assets/images/no-image.png")
        : `${apiUrl}/productStores/viewImage/${payload.file_name}`,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.productStoreList
      .map((productStore) => productStore.id)
      .indexOf(payload);
    state.productStoreList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
