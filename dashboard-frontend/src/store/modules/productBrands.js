import axios from "axios";
import FormData from 'form-data';

const state = {
  productBrandList: []
};

const getters = {
  getProductBrandById: (state) => (id) => {
    return state.productBrandList.find(productBrand => productBrand.id === id);
  },
  getProductBrandFileNameById: (state) => (id) => {
    return state.productBrandList.find(productBrand => productBrand.id === id).file_name;
  },
  getProductBrandList: (state) => {
    return state.productBrandList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productBrands/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result

            if (obj) {
              obj.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productBrands/viewImage/${element.file_name}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBrands/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBrands/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBrands/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productBrands/delete/${payload}`;
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
      state.productBrandList = payload;
    } else {
      state.productBrandList = [];
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = `${process.env.VUE_APP_API_BACKEND}/productBrands/viewImage/${payload.file_name}`;
    state.productBrandList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productBrandList.map(productBrand => productBrand.id).indexOf(payload.id);
    Object.assign(state.productBrandList[index], {
      name: payload.name,
      description: payload.description,
      file_name: payload.file_name,
      file_path: `${process.env.VUE_APP_API_BACKEND}/productBrands/viewImage/${payload.file_name}`
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productBrandList.map(productBrand => productBrand.id).indexOf(payload);
    state.productBrandList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
