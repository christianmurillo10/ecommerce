import axios from "axios";

const state = {
  inventoryList: [],
  inventoryAllTotalQuantityList: []
};

const getters = {
  getInventoryById: (state) => (id) => {
    return state.inventoryList.find(inventory => inventory.id === id);
  },
  getInventoryList: (state) => {
    return state.inventoryList;
  },
  getInventoryAllTotalQuantityList: (state) => {
    return state.inventoryAllTotalQuantityList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/`;
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
  getAllTotalQuantityData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/findAllTotalQuantity`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_DATA_ALL_TOTAL_QUANTITY", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/findAllbyProductId/${payload}`;
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
  getAvailableQuantityDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/findAvailableQuantityByProductId/${payload}`;
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
  getDataBySku({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/findBySku/${payload}`;
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
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          sku: payload.sku,
          quantity_in: payload.quantity_in,
          quantity_out: payload.quantity_out,
          quantity_reserved: payload.quantity_reserved,
          quantity_returned: payload.quantity_returned,
          quantity_available: payload.quantity_available,
          unit: payload.unit,
          price_amount: payload.price_amount,
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
  addStockData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/addStock/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          quantity: payload.quantity
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
  generateBulkDataWithProductVariantsByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/generateBulkWithProductVariantsByProductId`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          product_id: payload.product_id
        };

        axios
          .post(url, obj, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          sku: payload.sku,
          quantity_in: payload.quantity,
          quantity_out: payload.quantity_out,
          quantity_reserved: payload.quantity_reserved,
          quantity_returned: payload.quantity_returned,
          quantity_available: payload.quantity,
          unit: payload.unit,
          price_amount: payload.price_amount
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
    let url = `${process.env.VUE_APP_API_BACKEND}/inventories/delete/${payload}`;
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
  },
};

const mutations = {
  SET_DATA(state, payload) {
    if (payload) {
      state.inventoryList = payload;
    } else {
      state.inventoryList = [];
    }
  },
  SET_DATA_ALL_TOTAL_QUANTITY(state, payload) {
    if (payload) {
      state.inventoryAllTotalQuantityList = payload;
    } else {
      state.inventoryAllTotalQuantityList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.inventoryList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.inventoryList.map(inventory => inventory.id).indexOf(payload.id);
    Object.assign(state.inventoryList[index], {
      name: payload.name,
      sku: payload.sku,
      quantity_in: payload.quantity_in,
      quantity_out: payload.quantity_out,
      quantity_reserved: payload.quantity_reserved,
      quantity_returned: payload.quantity_returned,
      quantity_available: payload.quantity_available,
      unit: payload.unit,
      price_amount: payload.price_amount,
      product_id: payload.product_id
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.inventoryList.map(inventory => inventory.id).indexOf(payload);
    state.inventoryList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
