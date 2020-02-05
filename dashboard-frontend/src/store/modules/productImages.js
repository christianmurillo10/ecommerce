import axios from "axios";
import FormData from 'form-data';

const state = {
  productImageList: []
};

const getters = {
  getProductImageById: (state) => (id) => {
    return state.productImageList.find(productImage => productImage.id === id);
  },
  getProductImageFileNameById: (state) => (id) => {
    return state.productImageList.find(productImage => productImage.id === id).file_name;
  },
  getProductImageList: (state) => {
    return state.productImageList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/${payload}`;
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
  getDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/findAllbyProductId/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            let obj = response.data.result

            if (obj) {
              obj.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.file_name}`;
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
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('order', payload.order);
        data.set('color', payload.color);
        data.set('product_id', payload.product_id);
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          file_name: payload.file_name,
          order: payload.order,
          color: payload.color,
          product_id: payload.product_id
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/delete/${payload}`;
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
      state.productImageList = payload;
    } else {
      state.productImageList = [];
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${payload.file_name}`;
    state.productImageList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productImageList.map(productImage => productImage.id).indexOf(payload.id);
    Object.assign(state.productImageList[index], {
      file_name: payload.file_name,
      order: payload.order,
      color: payload.color,
      product_id: payload.product_id,
      file_path: `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${payload.file_name}`
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productImageList.map(productImage => productImage.id).indexOf(payload);
    state.productImageList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
