import axios from "axios";
import FormData from 'form-data';

const state = {
  productStoreList: [],
  productStoreTotalCount: 0
};

const getters = {
  getProductStoreById: (state) => (id) => {
    return state.productStoreList.find(productStore => productStore.id === id);
  },
  getProductStoreFileNameById: (state) => (id) => {
    return state.productStoreList.find(productStore => productStore.id === id).file_name;
  },
  getProductStoreList: (state) => {
    return state.productStoreList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result

            if (obj) {
              obj.forEach(element => {
                if (!_.isNull(element.file_name)) {
                  element.file_path = `${process.env.VUE_APP_API_BACKEND}/productStores/viewImage/${element.file_name}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }

            commit("SET_DATA", obj);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/${payload}`;
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
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/count/all`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_TOTAL_COUNT", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('name', payload.name);
        data.set('description', payload.description);
        data.set('file_name', payload.file_name);
        data.append('image', payload.file);

        axios
          .post(url, data, header)
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('name', payload.name);
        data.set('description', payload.description);
        data.set('file_name', payload.file_name);
        data.append('image', payload.file);

        axios
          .put(url, data, header)
          .then(response => {
            commit("UPDATE_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateActiveStatusData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          is_active: payload.value
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productStores/delete/${payload}`;
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
    obj.file_path = _.isNull(payload.file_name) ? require("../../assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productStores/viewImage/${payload.file_name}`;
    state.productStoreList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productStoreList.map(productStore => productStore.id).indexOf(payload.id);
    Object.assign(state.productStoreList[index], {
      name: payload.name,
      description: payload.description,
      file_name: payload.file_name,
      file_path: _.isNull(payload.file_name) ? require("../../assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productStores/viewImage/${payload.file_name}`
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productStoreList.map(productStore => productStore.id).indexOf(payload);
    state.productStoreList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
