import axios from "axios";

const state = {
  productAvailableSizeList: []
};

const getters = {
  getProductAvailableSizeById: (state) => (id) => {
    return state.productAvailableSizeList.find(productAvailableSize => productAvailableSize.id === id);
  },
  getProductAvailableSizeNameById: (state) => (id) => {
    return state.productAvailableSizeList.find(productAvailableSize => productAvailableSize.id === id).name;
  },
  getProductAvailableSizeList: (state) => {
    return state.productAvailableSizeList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productAvailableSize/`;
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
  getDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productAvailableSize/findAllbyProductId/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productAvailableSize/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productAvailableSize/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          product_id: payload.product_id
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productAvailableSize/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productAvailableSize/delete/${payload}`;
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
      state.productAvailableSizeList = payload;
    } else {
      state.productAvailableSizeList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productAvailableSizeList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productAvailableSizeList.map(productAvailableSize => productAvailableSize.id).indexOf(payload.id);
    Object.assign(state.productAvailableSizeList[index], {
      name: payload.name
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productAvailableSizeList.map(productAvailableSize => productAvailableSize.id).indexOf(payload);
    state.productAvailableSizeList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
