import axios from "axios";

const state = {
  productOptionList: []
};

const getters = {
  getProductOptionById: (state) => (id) => {
    return state.productOptionList.find(productOption => productOption.id === id);
  },
  getProductOptionList: (state) => {
    return state.productOptionList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productOptions/`;
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
  getDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productOptions/findAllbyProductId/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productOptions/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productOptions/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          values: payload.values,
          product_id: payload.product_id
        }

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
    let url = `${process.env.VUE_APP_API_BACKEND}/productOptions/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          values: payload.values,
          product_id: payload.product_id
        }

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
    let url = `${process.env.VUE_APP_API_BACKEND}/productOptions/delete/${payload}`;
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
      state.productOptionList = payload;
    } else {
      state.productOptionList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productOptionList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productOptionList.map(productOption => productOption.id).indexOf(payload.id);
    Object.assign(state.productOptionList[index], {
      title: payload.title,
      values: payload.values,
      product_id: payload.product_id
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productOptionList.map(productOption => productOption.id).indexOf(payload);
    state.productOptionList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
