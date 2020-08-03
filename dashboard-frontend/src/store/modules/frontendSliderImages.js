import axios from "axios";
import FormData from 'form-data';

const state = {
  frontendSliderImageList: []
};

const getters = {
  getFrontendSliderImageById: (state) => (id) => {
    return state.frontendSliderImageList.find(frontendSliderImage => frontendSliderImage.id === id);
  },
  getFrontendSliderImageFileNameById: (state) => (id) => {
    return state.frontendSliderImageList.find(frontendSliderImage => frontendSliderImage.id === id).file_name;
  },
  getFrontendSliderImageList: (state) => {
    return state.frontendSliderImageList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result;
            if (obj !== false) {
              obj.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/viewImage/${element.file_name}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('url', payload.url);
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('url', payload.url);
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
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/delete/${payload}`;
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
      state.frontendSliderImageList = payload;
    } else {
      state.frontendSliderImageList = [];
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/viewImage/${payload.file_name}`;
    state.frontendSliderImageList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let index = state.frontendSliderImageList.map(frontendSliderImage => frontendSliderImage.id).indexOf(payload.id);
    Object.assign(state.frontendSliderImageList[index], {
      file_name: payload.file_name,
      url: payload.url,
      order: payload.order,
      file_path: `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/viewImage/${payload.file_name}`
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.frontendSliderImageList.map(frontendSliderImage => frontendSliderImage.id).indexOf(payload);
    state.frontendSliderImageList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
