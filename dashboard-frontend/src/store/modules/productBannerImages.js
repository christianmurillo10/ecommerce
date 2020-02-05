import axios from "axios";
import FormData from 'form-data';

const state = {
  productBannerImageList: []
};

const getters = {
  getProductBannerImageById: (state) => (id) => {
    return state.productBannerImageList.find(productBannerImage => productBannerImage.id === id);
  },
  getProductBannerImageFileNameById: (state) => (id) => {
    return state.productBannerImageList.find(productBannerImage => productBannerImage.id === id).file_name;
  },
  getProductBannerImageList: (state) => {
    return state.productBannerImageList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result;

            if (obj !== false) {
              obj.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/viewImage/${element.file_name}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('order', payload.order);
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('order', payload.order);
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/delete/${payload}`;
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
      state.productBannerImageList = payload;
    } else {
      state.productBannerImageList = [];
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/viewImage/${payload.file_name}`;
    state.productBannerImageList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productBannerImageList.map(productBannerImage => productBannerImage.id).indexOf(payload.id);
    Object.assign(state.productBannerImageList[index], {
      file_name: payload.file_name,
      order: payload.order,
      file_path: `${process.env.VUE_APP_API_BACKEND}/productBannerImage/viewImage/${payload.file_name}`
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productBannerImageList.map(productBannerImage => productBannerImage.id).indexOf(payload);
    state.productBannerImageList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
