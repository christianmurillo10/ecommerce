import axios from "axios";

const state = {
  productFlashDealHeaderList: [],
  productFlashDealHeaderDataById: ""
};

const getters = {
  getProductFlashDealHeaderById: (state) => (id) => {
    return state.productFlashDealHeaderList.find(productFlashDealHeader => productFlashDealHeader.id === id);
  },
  getProductFlashDealHeaderTitleById: (state) => (id) => {
    return state.productFlashDealHeaderList.find(productFlashDealHeader => productFlashDealHeader.id === id).title;
  },
  getProductFlashDealHeaderList: (state) => {
    return state.productFlashDealHeaderList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          date_from: payload.date_from,
          date_to: payload.date_to
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          date_from: payload.date_from,
          date_to: payload.date_to,
          is_active: payload.is_active
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
  updateStatusData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/delete/${payload}`;
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
      state.productFlashDealHeaderList = payload;
    } else {
      state.productFlashDealHeaderList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productFlashDealHeaderDataById = payload;
    } else {
      state.productFlashDealHeaderDataById = "";
    }
  },
  ADD_DATA(state, payload) {
    state.productFlashDealHeaderList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productFlashDealHeaderList.map(productFlashDealHeader => productFlashDealHeader.id).indexOf(payload.id);
    Object.assign(state.productFlashDealHeaderList[index], {
      title: payload.title,
      date_from: payload.date_from,
      date_to: payload.date_to,
      is_active: payload.is_active
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productFlashDealHeaderList.map(productFlashDealHeader => productFlashDealHeader.id).indexOf(payload);
    state.productFlashDealHeaderList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
